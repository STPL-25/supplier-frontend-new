import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, Eye, Save, RefreshCw, 
  CheckCircle, AlertCircle, Loader2, LogIn, LogOut, Filter,
  Download
} from 'lucide-react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
import { KYC_API } from '../../../config/configData';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

const GoogleSheetsPurchaseManager = () => {
  // Google API states
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  
  // Data states
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [currentSpreadsheetId, setCurrentSpreadsheetId] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [masters, setMasters] = useState({});
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Initialize Google API Client - IMPROVED VERSION
  useEffect(() => {
    let isMounted = true;
    
    const loadGapiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.gapi) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load gapi script'));
        document.head.appendChild(script);
      });
    };

    const loadGisScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google?.accounts) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load GIS script'));
        document.head.appendChild(script);
      });
    };

    const initializeGapi = async () => {
      try {
        await loadGapiScript();
        
        return new Promise((resolve, reject) => {
          window.gapi.load('client', async () => {
            try {
              await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: [DISCOVERY_DOC],
              });
              if (isMounted) {
                setGapiInited(true);
                console.log('GAPI initialized successfully');
              }
              resolve();
            } catch (error) {
              console.error('Error initializing GAPI:', error);
              if (isMounted) {
                setStatus({ type: 'error', message: 'Failed to initialize Google API' });
              }
              reject(error);
            }
          });
        });
      } catch (error) {
        console.error('Error loading GAPI script:', error);
        if (isMounted) {
          setStatus({ type: 'error', message: 'Failed to load Google API script' });
        }
      }
    };

    const initializeGis = async () => {
      try {
        await loadGisScript();
        
        if (!window.google?.accounts?.oauth2) {
          throw new Error('Google Identity Services not available');
        }

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response.error !== undefined) {
              console.error('Authorization error:', response.error);
              setStatus({ type: 'error', message: `Authorization failed: ${response.error}` });
              setIsAuthorized(false);
              return;
            }
            setIsAuthorized(true);
            setStatus({ type: 'success', message: 'Successfully authorized!' });
            fetchSuppliers();
          },
        });
        
        if (isMounted) {
          setTokenClient(client);
          setGisInited(true);
          console.log('GIS initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing GIS:', error);
        if (isMounted) {
          setStatus({ type: 'error', message: 'Failed to initialize Google Identity Services' });
        }
      }
    };

    // Initialize both APIs
    const initApis = async () => {
      try {
        await Promise.all([initializeGapi(), initializeGis()]);
      } catch (error) {
        console.error('API initialization failed:', error);
        if (isMounted) {
          setStatus({ 
            type: 'error', 
            message: 'Google API scripts failed to load. Please check your internet connection and refresh.' 
          });
        }
      }
    };

    initApis();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Authorization
  const handleAuthClick = () => {
    if (!tokenClient) {
      setStatus({ type: 'error', message: 'Google API not loaded yet. Please wait or refresh.' });
      return;
    }

    if (!gapiInited || !gisInited) {
      setStatus({ type: 'error', message: 'Google services are still initializing. Please wait.' });
      return;
    }

    try {
      const token = window.gapi.client.getToken();
      if (token === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setStatus({ type: 'error', message: 'Authorization failed. Please try again.' });
    }
  };

  // Handle Sign Out
  const handleSignoutClick = () => {
    try {
      const token = window.gapi.client.getToken();
      if (token !== null) {
        window.google.accounts.oauth2.revoke(token.access_token, () => {
          console.log('Token revoked');
        });
        window.gapi.client.setToken('');
      }
      setIsAuthorized(false);
      setSuppliers([]);
      setSelectedSupplier(null);
      setCurrentSpreadsheetId('');
      setSheetData([]);
      setMasters({});
      setStatus({ type: 'success', message: 'Signed out successfully' });
    } catch (error) {
      console.error('Sign out error:', error);
      setStatus({ type: 'error', message: 'Sign out failed' });
    }
  };

  // Fetch Suppliers from Backend
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${KYC_API}/findAll_kyc/supplier`);
      
      const mappedSuppliers = (response.data.supplierKycData || []).map(supplier => ({
        code: supplier.Suppcode,
        name: supplier.SupplierName,
        spreadsheet_id: supplier.spreadsheet_id || null,
        google_sheet_url: supplier.google_sheet_url || null,
        category: supplier.supplierCategory,
        status: supplier.status,
        ...supplier
      }));
      
      setSuppliers(mappedSuppliers);
      setStatus({ 
        type: 'success', 
        message: `Loaded ${mappedSuppliers.length} suppliers` 
      });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setStatus({ 
        type: 'error', 
        message: `Error fetching suppliers: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Create new Google Sheet for Supplier
  const createSupplierSheet = async (supplierCode, supplierName) => {
    if (!isAuthorized) {
      setStatus({ type: 'error', message: 'Please authorize first' });
      return null;
    }

    setLoading(true);
    try {
      const createResponse = await window.gapi.client.sheets.spreadsheets.create({
        properties: {
          title: `${supplierName}_Purchase_Entry`,
        },
        sheets: [
          { properties: { title: 'Purchase Entry', gridProperties: { frozenRowCount: 1 } } },
          { properties: { title: 'Diamond Details', gridProperties: { frozenRowCount: 1 } } },
          { properties: { title: 'Color Stone Details', gridProperties: { frozenRowCount: 1 } } },
          { properties: { title: 'Suppliers' } },
          { properties: { title: 'Metal Rates' } },
          { properties: { title: 'Weight Mode' } },
        ],
      });

      const newSpreadsheetId = createResponse.result.spreadsheetId;
      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}/edit`;

      console.log('Spreadsheet created:', newSpreadsheetId);

      await formatSupplierSheet(newSpreadsheetId, supplierCode, supplierName);

      try {
        await axios.put(
          `${KYC_API}/update_kyc/${supplierCode}`, 
          {
            spreadsheet_id: newSpreadsheetId,
            google_sheet_url: spreadsheetUrl,
          }
        );
      } catch (backendError) {
        console.error('Backend update error:', backendError);
        setStatus({ 
          type: 'warning', 
          message: 'Sheet created but failed to save to database. Please contact admin.' 
        });
      }

      setStatus({ 
        type: 'success', 
        message: `Created Google Sheet for ${supplierName}` 
      });

      await fetchSuppliers();

      return newSpreadsheetId;
    } catch (error) {
      console.error('Error creating sheet:', error);
      setStatus({ 
        type: 'error', 
        message: `Error creating sheet: ${error.result?.error?.message || error.message}` 
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Format supplier sheet with headers, formulas, and master data
  const formatSupplierSheet = async (spreadsheetId, supplierCode, supplierName) => {
    try {
      const purchaseHeaders = [
        'id', 'SupplierName', 'ProductName', 'MetalType', 'WtMode', 'DesignNo', 'GCarat', 'PCS',
        'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue',
        'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
        'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
        'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount',
        'GoMcType', 'GoMcRate', 'GoMcAmount', 'WastageType', 'WastageWeight', 'WastageAmt',
        'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt', 'CertTotal',
        'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HMTotal',
        'HandleRate', 'HandleAmount', 'GNetWt', 'PNetWt', 'TotalValue', 'GST', 
        'GrandTotal', 'HUID', 'invoiceNumber', 'suppCode'
      ];

      const diamondHeaders = [
        'id', 'purchaseEntryId', 'DiamondShape', 'NoOfStones', 'Carat', 'Rate', 'Value', 'Weight'
      ];

      const colorStoneHeaders = [
        'id', 'purchaseEntryId', 'csShape', 'NoOfStones', 'Carat', 'Rate', 'Value', 'Weight'
      ];

      const suppliersData = [
        ['SupplierCode', 'SupplierName'],
        [supplierCode, supplierName]
      ];

      const metalRatesData = [
        ['Gold999Rate', 'PT999Rate'],
        [7500, 3500]
      ];

      const weightModeData = [
        ['WtMode'],
        ['GROSS'],
        ['NET'],
        ['FINE']
      ];

      await window.gapi.client.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: {
          valueInputOption: 'USER_ENTERED',
          data: [
            { range: 'Purchase Entry!A1', values: [purchaseHeaders] },
            { range: 'Diamond Details!A1', values: [diamondHeaders] },
            { range: 'Color Stone Details!A1', values: [colorStoneHeaders] },
            { range: 'Suppliers!A1', values: suppliersData },
            { range: 'Metal Rates!A1', values: metalRatesData },
            { range: 'Weight Mode!A1', values: weightModeData },
          ],
        },
      });

      const sheetInfo = await window.gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });

      const sheets = sheetInfo.result.sheets;
      const purchaseSheetId = sheets.find(s => s.properties.title === 'Purchase Entry')?.properties.sheetId;
      const diamondSheetId = sheets.find(s => s.properties.title === 'Diamond Details')?.properties.sheetId;
      const colorStoneSheetId = sheets.find(s => s.properties.title === 'Color Stone Details')?.properties.sheetId;

      const formatRequests = [
        {
          repeatCell: {
            range: {
              sheetId: purchaseSheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.5, blue: 0.8 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: diamondSheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.5, blue: 0.8 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: colorStoneSheetId,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.5, blue: 0.8 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: purchaseSheetId,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: purchaseHeaders.length,
            },
          },
        },
      ];

      await window.gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        resource: { requests: formatRequests },
      });

      console.log('Sheet formatted successfully');
    } catch (error) {
      console.error('Error formatting sheet:', error);
      throw new Error(`Formatting failed: ${error.result?.error?.message || error.message}`);
    }
  };

  // Handle Supplier Selection
  const handleSupplierChange = async (e) => {
    const supplierCode = e.target.value;
    
    if (!supplierCode) {
      setSelectedSupplier(null);
      setCurrentSpreadsheetId('');
      setSheetData([]);
      setMasters({});
      return;
    }

    const supplier = suppliers.find(s => s.code === supplierCode);
    
    if (!supplier) {
      setStatus({ type: 'error', message: 'Supplier not found' });
      return;
    }

    setSelectedSupplier(supplier);

    if (!supplier.spreadsheet_id) {
      const shouldCreate = window.confirm(
        `${supplier.name} doesn't have a Google Sheet yet. Create one now?`
      );
      
      if (shouldCreate) {
        const newSheetId = await createSupplierSheet(supplier.code, supplier.name);
        if (newSheetId) {
          setCurrentSpreadsheetId(newSheetId);
          await fetchSheetData(newSheetId);
        }
      } else {
        setStatus({ type: 'error', message: 'Please create a sheet to continue' });
      }
    } else {
      setCurrentSpreadsheetId(supplier.spreadsheet_id);
      await fetchSheetData(supplier.spreadsheet_id);
    }
  };

  // Fetch data from supplier's Google Sheet
  const fetchSheetData = async (spreadsheetId) => {
    if (!isAuthorized || !spreadsheetId) {
      setStatus({ type: 'error', message: 'Missing spreadsheet ID or not authorized' });
      return;
    }

    setLoading(true);
    try {
      const [purchaseResponse, metalRatesRes, wtModeRes] = await Promise.all([
        window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'Purchase Entry!A2:BE',
        }),
        window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'Metal Rates!A2:B2',
        }),
        window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'Weight Mode!A2:A',
        }),
      ]);

      const rows = purchaseResponse.result.values || [];
      
      const entries = rows
        .filter(row => row[0])
        .map(row => ({
          id: row[0] || '',
          SupplierName: row[1] || '',
          ProductName: row[2] || '',
          MetalType: row[3] || '',
          WtMode: row[4] || '',
          DesignNo: row[5] || '',
          GCarat: parseFloat(row[6]) || 0,
          PCS: parseInt(row[7]) || 0,
          GoldWt: parseFloat(row[8]) || 0,
          GoldPurity: parseFloat(row[9]) || 0,
          GoldPurityWt: parseFloat(row[10]) || 0,
          Gold999Rate: parseFloat(row[11]) || 0,
          GoldValue: parseFloat(row[12]) || 0,
          PTWt: parseFloat(row[13]) || 0,
          PTPurity: parseFloat(row[14]) || 0,
          PTPurityWt: parseFloat(row[15]) || 0,
          PT999Rate: parseFloat(row[16]) || 0,
          PTValue: parseFloat(row[17]) || 0,
          NoofStone: parseInt(row[18]) || 0,
          DCarat: parseFloat(row[19]) || 0,
          DiamondRate: parseFloat(row[20]) || 0,
          DiamondValue: parseFloat(row[21]) || 0,
          DiamondWt: parseFloat(row[22]) || 0,
          ClrStnPCS: parseInt(row[23]) || 0,
          CLSCarat: parseFloat(row[24]) || 0,
          ClrStnWt: parseFloat(row[25]) || 0,
          ClrStnRate: parseFloat(row[26]) || 0,
          CSAmount: parseFloat(row[27]) || 0,
          GoMcType: row[28] || '',
          GoMcRate: parseFloat(row[29]) || 0,
          GoMcAmount: parseFloat(row[30]) || 0,
          WastageType: row[31] || '',
          WastageWeight: parseFloat(row[32]) || 0,
          WastageAmt: parseFloat(row[33]) || 0,
          CertType: row[34] || '',
          CertGST: parseFloat(row[35]) || 0,
          CertQty: parseInt(row[36]) || 0,
          CertRate: parseFloat(row[37]) || 0,
          CertTaxableAmt: parseFloat(row[38]) || 0,
          CertTotal: parseFloat(row[39]) || 0,
          HallMarkType: row[40] || '',
          HMGST: parseFloat(row[41]) || 0,
          HMQty: parseInt(row[42]) || 0,
          HMRate: parseFloat(row[43]) || 0,
          HMTaxableAmt: parseFloat(row[44]) || 0,
          HMTotal: parseFloat(row[45]) || 0,
          HandleRate: parseFloat(row[46]) || 0,
          HandleAmount: parseFloat(row[47]) || 0,
          GNetWt: parseFloat(row[48]) || 0,
          PNetWt: parseFloat(row[49]) || 0,
          TotalValue: parseFloat(row[50]) || 0,
          GST: parseFloat(row[51]) || 0,
          GrandTotal: parseFloat(row[52]) || 0,
          HUID: row[53] || '',
          invoiceNumber: row[54] || '',
          suppCode: row[55] || '',
        }));

      const metalRates = metalRatesRes.result.values?.[0] || [];
      const weightModes = (wtModeRes.result.values || []).map(row => row[0]);

      setSheetData(entries);
      setMasters({
        metalRates: {
          Gold999Rate: parseFloat(metalRates[0]) || 0,
          PT999Rate: parseFloat(metalRates[1]) || 0,
        },
        weightModes,
      });

      setStatus({ 
        type: 'success', 
        message: `Loaded ${entries.length} entries from ${selectedSupplier?.name}'s sheet` 
      });
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      
      if (error.status === 401) {
        setIsAuthorized(false);
        setStatus({ 
          type: 'error', 
          message: 'Session expired. Please authorize again.' 
        });
      } else if (error.status === 403) {
        setStatus({ 
          type: 'error', 
          message: 'Access denied. Please check permissions.' 
        });
      } else if (error.status === 404) {
        setStatus({ 
          type: 'error', 
          message: 'Sheet not found. It may have been deleted.' 
        });
      } else {
        setStatus({ 
          type: 'error', 
          message: `Error fetching data: ${error.result?.error?.message || error.message}` 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Diamond & Color Stone Details
  const fetchEntryDetails = async (entryId) => {
    if (!currentSpreadsheetId) return { diamonds: [], colorStones: [] };

    try {
      const [diamondRes, csRes] = await Promise.all([
        window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: currentSpreadsheetId,
          range: 'Diamond Details!A2:H',
        }),
        window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: currentSpreadsheetId,
          range: 'Color Stone Details!A2:H',
        }),
      ]);

      const diamonds = (diamondRes.result.values || [])
        .filter(row => row[1] === String(entryId))
        .map(row => ({
          id: row[0] || '',
          purchaseEntryId: row[1] || '',
          DiamondShape: row[2] || '',
          NoOfStones: parseInt(row[3]) || 0,
          Carat: parseFloat(row[4]) || 0,
          Rate: parseFloat(row[5]) || 0,
          Value: parseFloat(row[6]) || 0,
          Weight: parseFloat(row[7]) || 0,
        }));

      const colorStones = (csRes.result.values || [])
        .filter(row => row[1] === String(entryId))
        .map(row => ({
          id: row[0] || '',
          purchaseEntryId: row[1] || '',
          csShape: row[2] || '',
          NoOfStones: parseInt(row[3]) || 0,
          Carat: parseFloat(row[4]) || 0,
          Rate: parseFloat(row[5]) || 0,
          Value: parseFloat(row[6]) || 0,
          Weight: parseFloat(row[7]) || 0,
        }));

      return { diamonds, colorStones };
    } catch (error) {
      console.error('Error fetching details:', error);
      return { diamonds: [], colorStones: [] };
    }
  };

  // View Entry Details
  const viewEntry = async (entry) => {
    setLoading(true);
    try {
      const details = await fetchEntryDetails(entry.id);
      setSelectedEntry({
        ...entry,
        diamonds: details.diamonds,
        colorStones: details.colorStones,
      });
      setShowModal(true);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to load entry details' });
    } finally {
      setLoading(false);
    }
  };

  // Save to Database
  const saveToDatabase = async () => {
    if (sheetData.length === 0) {
      setStatus({ type: 'error', message: 'No data to save' });
      return;
    }

    if (!selectedSupplier) {
      setStatus({ type: 'error', message: 'No supplier selected' });
      return;
    }

    setSaving(true);
    setStatus({ type: 'info', message: 'Fetching detailed data...' });

    try {
      const entriesWithDetails = await Promise.all(
        sheetData.map(async (entry) => {
          const details = await fetchEntryDetails(entry.id);
          return {
            ...entry,
            diamonds: details.diamonds,
            colorStones: details.colorStones,
          };
        })
      );

      setStatus({ type: 'info', message: 'Saving to database...' });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase-entries/bulk`, 
        {
          entries: entriesWithDetails,
          supplier: selectedSupplier,
        }
      );

      setStatus({ 
        type: 'success', 
        message: `Successfully saved ${entriesWithDetails.length} entries for ${selectedSupplier.name} to database` 
      });
    } catch (error) {
      console.error('Save error:', error);
      setStatus({ 
        type: 'error', 
        message: `Save failed: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setSaving(false);
    }
  };

  // Auto-dismiss status messages
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" />
            Google Sheets Purchase Manager
          </h2>
          <div className="flex items-center gap-3 flex-wrap">
            {!isAuthorized ? (
              <button 
                onClick={handleAuthClick}
                disabled={!gapiInited || !gisInited}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {!gapiInited || !gisInited ? 'Loading...' : 'Authorize Google'}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => fetchSheetData(currentSpreadsheetId)}
                  disabled={loading || !currentSpreadsheetId}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button 
                  onClick={saveToDatabase}
                  disabled={saving || sheetData.length === 0}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    saving || sheetData.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-600' 
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save to DB ({sheetData.length})
                    </>
                  )}
                </button>
                <button 
                  onClick={handleSignoutClick}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {status && (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'error' 
              ? 'bg-red-50 text-red-800 border border-red-200' 
              : status.type === 'info'
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {status.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <span className="flex-1">{status.message}</span>
            <button 
              onClick={() => setStatus(null)}
              className="text-current hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Supplier Selection */}
        {isAuthorized && (
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Select Supplier
                </label>
                <select 
                  value={selectedSupplier?.code || ''}
                  onChange={handleSupplierChange}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.code} value={supplier.code}>
                      {supplier.name} ({supplier.code})
                      {!supplier.spreadsheet_id && ' - No Sheet'}
                    </option>
                  ))}
                </select>
                {selectedSupplier && currentSpreadsheetId && (
                  <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
                    <span>Sheet ID: {currentSpreadsheetId.slice(0, 20)}...</span>
                    <a 
                      href={`https://docs.google.com/spreadsheets/d/${currentSpreadsheetId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Open in Google Sheets
                    </a>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  Current Metal Rates
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs">Gold 999</span>
                    <span className="font-bold text-lg text-yellow-600">
                      ₹{masters.metalRates?.Gold999Rate.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-600 text-xs">Platinum 999</span>
                    <span className="font-bold text-lg text-gray-600">
                      ₹{masters.metalRates?.PT999Rate.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            {selectedSupplier && sheetData.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold mb-3">Summary Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-600 block mb-1">Total Entries</span>
                    <span className="text-2xl font-bold text-blue-700">{sheetData.length}</span>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-600 block mb-1">Total Gold Weight</span>
                    <span className="text-2xl font-bold text-yellow-700">
                      {sheetData.reduce((sum, e) => sum + (e.GoldWt || 0), 0).toFixed(3)} g
                    </span>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-600 block mb-1">Total Diamond Carat</span>
                    <span className="text-2xl font-bold text-purple-700">
                      {sheetData.reduce((sum, e) => sum + (e.DCarat || 0), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="text-xs text-gray-600 block mb-1">Total Value</span>
                    <span className="text-2xl font-bold text-green-700">
                      ₹{sheetData.reduce((sum, e) => sum + (e.GrandTotal || 0), 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Data Table */}
        {isAuthorized && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="border-b px-4 py-3 text-left font-semibold">ID</th>
                    <th className="border-b px-4 py-3 text-left font-semibold">Supplier</th>
                    <th className="border-b px-4 py-3 text-left font-semibold">Design No</th>
                    <th className="border-b px-4 py-3 text-left font-semibold">Product</th>
                    <th className="border-b px-4 py-3 text-left font-semibold">Metal</th>
                    <th className="border-b px-4 py-3 text-right font-semibold">Gold Wt (g)</th>
                    <th className="border-b px-4 py-3 text-right font-semibold">Gold Value</th>
                    <th className="border-b px-4 py-3 text-right font-semibold">Diamond Value</th>
                    <th className="border-b px-4 py-3 text-right font-semibold">Grand Total</th>
                    <th className="border-b px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                        <p className="mt-2 text-gray-600">Loading data...</p>
                      </td>
                    </tr>
                  ) : !selectedSupplier ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-gray-500">
                        <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Please select a supplier to view data</p>
                      </td>
                    </tr>
                  ) : sheetData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-12 text-center text-gray-500">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No data found in sheet for {selectedSupplier.name}</p>
                        <p className="text-xs mt-2">Add data to the Google Sheet and refresh</p>
                      </td>
                    </tr>
                  ) : (
                    sheetData.map((entry, idx) => (
                      <tr key={entry.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="border-b px-4 py-3">{entry.id}</td>
                        <td className="border-b px-4 py-3">{entry.SupplierName}</td>
                        <td className="border-b px-4 py-3 font-medium">{entry.DesignNo}</td>
                        <td className="border-b px-4 py-3">{entry.ProductName}</td>
                        <td className="border-b px-4 py-3">{entry.MetalType}</td>
                        <td className="border-b px-4 py-3 text-right">{entry.GoldWt?.toFixed(3)}</td>
                        <td className="border-b px-4 py-3 text-right">₹{entry.GoldValue?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className="border-b px-4 py-3 text-right">₹{entry.DiamondValue?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                        <td className="border-b px-4 py-3 text-right font-bold text-green-700">
                          ₹{entry.GrandTotal?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="border-b px-4 py-3 text-center">
                          <button 
                            onClick={() => viewEntry(entry)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg flex items-center gap-1.5 hover:bg-indigo-700 transition-colors mx-auto"
                          >
                            <Eye className="w-4 h-4" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            How It Works
          </h4>
          <ol className="text-sm text-blue-800 space-y-2 ml-6 list-decimal">
            <li>Click <strong>"Authorize Google"</strong> and sign in with your Google account</li>
            <li>Select a supplier from the dropdown menu</li>
            <li>If the supplier doesn't have a Google Sheet, it will be auto-created with proper formatting</li>
            <li>Data automatically loads from the supplier's dedicated sheet</li>
            <li>Review the data and click <strong>"Save to DB"</strong> to sync entries to your database</li>
            <li>Use <strong>"Refresh"</strong> to reload the latest data from Google Sheets</li>
          </ol>
        </div>

        {/* Detail Modal */}
        {showModal && selectedEntry && (
          <EntryDetailModal 
            entry={selectedEntry}
            onClose={() => {
              setShowModal(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Entry Detail Modal Component - Keep your existing modal code here
const EntryDetailModal = ({ entry, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
    <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
    <div className="relative z-60 w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-auto max-h-[85vh]">
      <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-10">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6" />
          Entry Details — ID: {entry.id} | {entry.DesignNo}
        </h3>
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          Close
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Supplier" value={entry.SupplierName} />
            <InfoItem label="Product" value={entry.ProductName} />
            <InfoItem label="Metal Type" value={entry.MetalType} />
            <InfoItem label="Weight Mode" value={entry.WtMode} />
            <InfoItem label="Design No" value={entry.DesignNo} />
            <InfoItem label="HUID" value={entry.HUID || 'N/A'} />
            <InfoItem label="Invoice No" value={entry.invoiceNumber || 'N/A'} />
            <InfoItem label="PCS" value={entry.PCS} />
          </div>
        </div>

        {/* Gold Details */}
        {entry.GoldWt > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-lg font-semibold mb-3 text-yellow-900">Gold Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="Gold Weight" value={`${entry.GoldWt?.toFixed(3)} g`} />
              <InfoItem label="Gold Purity" value={`${entry.GoldPurity}%`} />
              <InfoItem label="Purity Weight" value={`${entry.GoldPurityWt?.toFixed(3)} g`} />
              <InfoItem label="999 Rate" value={`₹${entry.Gold999Rate?.toLocaleString()}`} />
              <InfoItem label="Gold Value" value={`₹${entry.GoldValue?.toLocaleString()}`} highlight />
              <InfoItem label="Net Weight" value={`${entry.GNetWt?.toFixed(3)} g`} />
            </div>
          </div>
        )}

        {/* Platinum Details */}
        {entry.PTWt > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold mb-3 text-gray-900">Platinum Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="PT Weight" value={`${entry.PTWt?.toFixed(3)} g`} />
              <InfoItem label="PT Purity" value={`${entry.PTPurity}%`} />
              <InfoItem label="Purity Weight" value={`${entry.PTPurityWt?.toFixed(3)} g`} />
              <InfoItem label="999 Rate" value={`₹${entry.PT999Rate?.toLocaleString()}`} />
              <InfoItem label="PT Value" value={`₹${entry.PTValue?.toLocaleString()}`} highlight />
              <InfoItem label="Net Weight" value={`${entry.PNetWt?.toFixed(3)} g`} />
            </div>
          </div>
        )}

        {/* Diamond Details Table */}
        {entry.diamonds && entry.diamonds.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3 text-purple-900">
              Diamonds ({entry.diamonds.length})
            </h4>
            <div className="overflow-auto max-h-64 border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-purple-100 sticky top-0">
                  <tr>
                    <th className="border-b p-3 text-left">Shape</th>
                    <th className="border-b p-3 text-right">Pieces</th>
                    <th className="border-b p-3 text-right">Carat</th>
                    <th className="border-b p-3 text-right">Weight (g)</th>
                    <th className="border-b p-3 text-right">Rate</th>
                    <th className="border-b p-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.diamonds.map((d, idx) => (
                    <tr key={idx} className="hover:bg-purple-50">
                      <td className="border-b p-3">{d.DiamondShape}</td>
                      <td className="border-b p-3 text-right">{d.NoOfStones}</td>
                      <td className="border-b p-3 text-right">{d.Carat}</td>
                      <td className="border-b p-3 text-right">{d.Weight?.toFixed(3)}</td>
                      <td className="border-b p-3 text-right">₹{d.Rate?.toLocaleString()}</td>
                      <td className="border-b p-3 text-right font-semibold">₹{d.Value?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-purple-100 font-bold">
                    <td className="p-3" colSpan={5}>Total Diamond Value</td>
                    <td className="p-3 text-right">₹{entry.DiamondValue?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Color Stone Details Table */}
        {entry.colorStones && entry.colorStones.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold mb-3 text-pink-900">
              Color Stones ({entry.colorStones.length})
            </h4>
            <div className="overflow-auto max-h-64 border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-pink-100 sticky top-0">
                  <tr>
                    <th className="border-b p-3 text-left">Shape</th>
                    <th className="border-b p-3 text-right">Pieces</th>
                    <th className="border-b p-3 text-right">Carat</th>
                    <th className="border-b p-3 text-right">Weight (g)</th>
                    <th className="border-b p-3 text-right">Rate</th>
                    <th className="border-b p-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.colorStones.map((cs, idx) => (
                    <tr key={idx} className="hover:bg-pink-50">
                      <td className="border-b p-3">{cs.csShape}</td>
                      <td className="border-b p-3 text-right">{cs.NoOfStones}</td>
                      <td className="border-b p-3 text-right">{cs.Carat}</td>
                      <td className="border-b p-3 text-right">{cs.Weight?.toFixed(3)}</td>
                      <td className="border-b p-3 text-right">₹{cs.Rate?.toLocaleString()}</td>
                      <td className="border-b p-3 text-right font-semibold">₹{cs.Value?.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-pink-100 font-bold">
                    <td className="p-3" colSpan={5}>Total Color Stone Value</td>
                    <td className="p-3 text-right">₹{entry.CSAmount?.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Additional Charges */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold mb-3 text-gray-900">Additional Charges</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem label="Making Type" value={entry.GoMcType || 'N/A'} />
            <InfoItem label="Making Rate" value={`₹${entry.GoMcRate?.toLocaleString()}`} />
            <InfoItem label="Making Amount" value={`₹${entry.GoMcAmount?.toLocaleString()}`} />
            <InfoItem label="Wastage Type" value={entry.WastageType || 'N/A'} />
            <InfoItem label="Wastage Weight" value={`${entry.WastageWeight?.toFixed(3)} g`} />
            <InfoItem label="Wastage Amount" value={`₹${entry.WastageAmt?.toLocaleString()}`} />
            <InfoItem label="Certificate" value={entry.CertType || 'N/A'} />
            <InfoItem label="Cert Amount" value={`₹${entry.CertTotal?.toLocaleString()}`} />
            <InfoItem label="Hallmark" value={entry.HallMarkType || 'N/A'} />
            <InfoItem label="HM Amount" value={`₹${entry.HMTotal?.toLocaleString()}`} />
            <InfoItem label="Handle Amount" value={`₹${entry.HandleAmount?.toLocaleString()}`} />
          </div>
        </div>

        {/* Final Totals */}
        <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300">
          <h4 className="text-lg font-semibold mb-4 text-green-900">Final Amount</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoItem label="Total Value" value={`₹${entry.TotalValue?.toLocaleString()}`} />
            <InfoItem label="GST" value={`₹${entry.GST?.toLocaleString()}`} />
            <div className="col-span-2">
              <div className="bg-white p-4 rounded-lg border-2 border-green-500">
                <div className="text-sm text-gray-600 mb-1">Grand Total</div>
                <div className="text-3xl font-bold text-green-700">
                  ₹{entry.GrandTotal?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoItem = ({ label, value, highlight = false }) => (
  <div className={`${highlight ? 'bg-white p-3 rounded-lg border' : ''}`}>
    <div className="text-xs text-gray-600 mb-1">{label}</div>
    <div className={`font-semibold ${highlight ? 'text-lg text-blue-700' : ''}`}>
      {value || 'N/A'}
    </div>
  </div>
);

export default GoogleSheetsPurchaseManager;
