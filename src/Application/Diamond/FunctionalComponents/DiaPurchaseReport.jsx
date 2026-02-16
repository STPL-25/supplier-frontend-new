import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {  
  FileSpreadsheet, 
  Download, 
  Filter, 
  Calendar, 
  RefreshCw, 
  Loader2,
  Eye,
  X,
  ChevronDown,
  Diamond,
  Gem
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import DiamondPDF from './DiaDealerReceipt'; 
import { PDFDownloadLink } from '@react-pdf/renderer'; 
import { FileText } from 'lucide-react';
const PurchaseReport = () => {
  const { user, companyName } = useContext(DashBoardContext);
  const [purchaseData, setPurchaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Unique lists for dropdowns
  const [suppliers, setSuppliers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // Filter states
  const [filters, setFilters] = useState({
    supplierName: '',
    invoiceNumber: '',
    fromDate: '',
    toDate: ''
  });

  // Helper function to parse diamonds/colorstones JSON strings
  const parseStones = (stonesString) => {
    try {
      if (!stonesString || stonesString === '[]') return [];
      return JSON.parse(stonesString);
    } catch (error) {
      console.error('Error parsing stones:', error);
      return [];
    }
  };

  // Transform data for PDF
  const transformDataForPDF = (data) => {
    return data.map(item => {
      const diamonds = parseStones(item.diamonds);
      const colorstones = parseStones(item.colorstones);
      
      return {
        ...item,
        Diamonds: diamonds.map(d => ({
          ShapeShortName: d.DiamondShape || '',
          NoOfStones: d.NoOfStones || 0,
          Carat: d.Carat || 0,
          Rate: d.Rate || 0,
          Value: d.Value || 0,
        })),
        ColorStones: colorstones.map(c => ({
          ShapeShortName: c.csShape || '',
          Pcs: c.NoOfStones || 0,
          csCarat: c.Carat || 0,
          csRate: c.Rate || 0,
          Amount: c.Value || 0,
        })),
        GNetWt: item.GoldWt || 0,
        PNetWt: item.PTWt || 0,
        GoldPurity: item.GoldPurity || item.GCarat || '',
        PTPurity: item.PTPurity || '',
      };
    });
  };

  // Fetch all purchase entries on mount
  useEffect(() => {
    fetchPurchaseEntries();
  }, []);

  // Update unique suppliers and invoices when data changes
  useEffect(() => {
    if (purchaseData.length > 0) {
      const uniqueSuppliers = [...new Set(
        purchaseData
          .map(item => item.SupplierName)
          .filter(name => name && name.trim() !== '')
      )].sort();
      setSuppliers(uniqueSuppliers);

      const uniqueInvoices = [...new Set(
        purchaseData
          .map(item => item.invoiceNumber)
          .filter(invoice => invoice && invoice.trim() !== '')
      )].sort();
      setInvoices(uniqueInvoices);
      setFilteredInvoices(uniqueInvoices);
    }
  }, [purchaseData]);
  // Filter invoices based on selected supplier
  useEffect(() => {
    if (filters.supplierName) {
      const supplierInvoices = [...new Set(
        purchaseData
          .filter(item => item.SupplierName === filters.supplierName)
          .map(item => item.invoiceNumber)
          .filter(invoice => invoice && invoice.trim() !== '')
      )].sort();
      setFilteredInvoices(supplierInvoices);
      
      if (filters.invoiceNumber && !supplierInvoices.includes(filters.invoiceNumber)) {
        setFilters(prev => ({ ...prev, invoiceNumber: '' }));
      }
    } else {
      setFilteredInvoices(invoices);
    }
  }, [filters.supplierName, purchaseData, invoices]);

  // Auto-apply filters when filter values change
  useEffect(() => {
    applyFilters();
  }, [filters, purchaseData]);

  // Fetch purchase entries from backend
  const fetchPurchaseEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DIA_API}/getPurchaseEntries`);
      const data = response.data.result[0] || [];
      console.log('Fetched purchase entries:', data);
      setPurchaseData(data);
      setFilteredData(data);
    } catch (error) {
      console.error('Error fetching purchase entries:', error);
      setPurchaseData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...purchaseData];

    if (filters.supplierName) {
      filtered = filtered.filter(item => 
        item.SupplierName === filters.supplierName
      );
    }

    if (filters.invoiceNumber) {
      filtered = filtered.filter(item => 
        item.invoiceNumber === filters.invoiceNumber
      );
    }

    if (filters.fromDate) {
      filtered = filtered.filter(item => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        const fromDate = new Date(filters.fromDate);
        return itemDate >= fromDate;
      });
    }

    if (filters.toDate) {
      filtered = filtered.filter(item => {
        if (!item.createdAt) return false;
        const itemDate = new Date(item.createdAt);
        const toDate = new Date(filters.toDate);
        toDate.setHours(23, 59, 59, 999);
        return itemDate <= toDate;
      });
    }

    setFilteredData(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      supplierName: '',
      invoiceNumber: '',
      fromDate: '',
      toDate: ''
    });
  };

  // Handle supplier change
  const handleSupplierChange = (e) => {
    setFilters({
      ...filters, 
      supplierName: e.target.value,
      invoiceNumber: ''
    });
  };

  // Export to Excel
 

  // Calculate summary statistics with parsed diamonds and colorstones
  const calculateSummary = () => {
    let totalDiamondCarat = 0;
    let totalDiamondValue = 0;
    let totalDiamondStones = 0;
    let totalColorStoneCarat = 0;
    let totalColorStoneValue = 0;
    let totalColorStoneStones = 0;

    filteredData.forEach(item => {
      const diamonds = parseStones(item.diamonds);
      const colorstones = parseStones(item.colorstones);

      diamonds.forEach(d => {
        totalDiamondStones += d.NoOfStones || 0;
        totalDiamondCarat += d.Carat || 0;
        totalDiamondValue += d.Value || 0;
      });

      colorstones.forEach(c => {
        totalColorStoneStones += c.NoOfStones || 0;
        totalColorStoneCarat += c.Carat || 0;
        totalColorStoneValue += c.Value || 0;
      });
    });

    return {
      totalEntries: filteredData.length,
      totalGoldWeight: filteredData.reduce((sum, item) => sum + (item.GoldWt || 0), 0),
      totalPlatinumWeight: filteredData.reduce((sum, item) => sum + (item.PTWt || 0), 0),
      totalDiamondStones,
      totalDiamondCarat,
      totalDiamondValue,
      totalColorStoneStones,
      totalColorStoneCarat,
      totalColorStoneValue,
      totalValue: filteredData.reduce((sum, item) => sum + (item.GrandTotal || 0), 0),
      uniqueSuppliers: new Set(filteredData.map(item => item.SupplierName)).size,
      uniqueInvoices: new Set(filteredData.map(item => item.invoiceNumber)).size
    };
  };

  // View entry details
  const viewEntryDetails = (entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  const summary = calculateSummary();

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Purchase Report
          </h2>
          <div className="flex gap-3">
            <button
              onClick={fetchPurchaseEntries}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {/* <button
              onClick={exportToExcel}
              disabled={filteredData.length === 0}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                filteredData.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Download className="w-4 h-4" /> Export to Excel
            </button> */}
            {filteredData.length > 0 &&filters?.invoiceNumber&& (
              <PDFDownloadLink
                document={<DiamondPDF data={transformDataForPDF(filteredData)} />}
                fileName={`Diamond_Receipt_${filteredData[0].SupplierName}-${filteredData[0].invoiceNumber}.pdf`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                {({ loading }) => (
                  <>
                    <FileText className="w-4 h-4" />
                    {loading ? 'Preparing PDF...' : 'Export to PDF'}
                  </>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Supplier Name Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name
              </label>
              <div className="relative">
                <select
                  value={filters.supplierName}
                  onChange={handleSupplierChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((supplier, index) => (
                    <option key={index} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Invoice Number Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
                {filters.supplierName && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({filteredInvoices.length} invoices)
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  value={filters.invoiceNumber}
                  onChange={(e) => setFilters({...filters, invoiceNumber: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                  disabled={filteredInvoices.length === 0}
                >
                  <option value="">
                    {filters.supplierName 
                      ? 'All Invoices (for selected supplier)' 
                      : 'All Invoices'}
                  </option>
                  {filteredInvoices.map((invoice, index) => (
                    <option key={index} value={invoice}>
                      {invoice}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* From Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* To Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
            {(filters.supplierName || filters.invoiceNumber || filters.fromDate || filters.toDate) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {filteredData.length} of {purchaseData.length} entries shown
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Summary Cards with Diamonds and ColorStones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Total Entries</div>
            <div className="text-2xl font-bold text-indigo-600">{summary.totalEntries}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Suppliers</div>
            <div className="text-2xl font-bold text-blue-600">{summary.uniqueSuppliers}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Invoices</div>
            <div className="text-2xl font-bold text-green-600">{summary.uniqueInvoices}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Gold Wt (g)</div>
            <div className="text-2xl font-bold text-yellow-600">{summary.totalGoldWeight.toFixed(3)}</div>
          </div>

          {/* Row 2 - Diamond Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <Diamond className="w-4 h-4" /> Diamond Stones
            </div>
            <div className="text-2xl font-bold text-blue-700">{summary.totalDiamondStones}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <Diamond className="w-4 h-4" /> Diamond Carat
            </div>
            <div className="text-2xl font-bold text-blue-700">{summary.totalDiamondCarat.toFixed(3)}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
              <Diamond className="w-4 h-4" /> Diamond Value (₹)
            </div>
            <div className="text-xl font-bold text-blue-700">
              {summary.totalDiamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Platinum Wt (g)</div>
            <div className="text-2xl font-bold text-gray-600">{summary.totalPlatinumWeight.toFixed(3)}</div>
          </div>

          {/* Row 3 - ColorStone Stats */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
              <Gem className="w-4 h-4" /> ColorStone Stones
            </div>
            <div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneStones}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
              <Gem className="w-4 h-4" /> ColorStone Carat
            </div>
            <div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneCarat.toFixed(3)}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
            <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
              <Gem className="w-4 h-4" /> ColorStone Value (₹)
            </div>
            <div className="text-xl font-bold text-purple-700">
              {summary.totalColorStoneValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-sm text-gray-600">Total Value (₹)</div>
            <div className="text-xl font-bold text-emerald-600">
              {summary.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-lg">Loading data...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h3>
            <p className="text-gray-500">
              {purchaseData.length === 0 
                ? 'No purchase entries available. Upload data to get started.' 
                : 'No entries match the selected filters. Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Sno</th>
                    <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                    <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Design No</th>
                    <th className="px-4 py-3 text-right font-semibold">Pcs</th>
                    <th className="px-4 py-3 text-right font-semibold">Gold Wt</th>
                    <th className="px-4 py-3 text-right font-semibold">💎 Stones</th>
                    <th className="px-4 py-3 text-right font-semibold">💎 Carat</th>
                    <th className="px-4 py-3 text-right font-semibold">💎 Value</th>
                    <th className="px-4 py-3 text-right font-semibold">🔮 Stones</th>
                    <th className="px-4 py-3 text-right font-semibold">🔮 Carat</th>
                    <th className="px-4 py-3 text-right font-semibold">🔮 Value</th>
                    <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const diamonds = parseStones(item.diamonds);
                    const colorstones = parseStones(item.colorstones);
                    
                    const diamondStones = diamonds.reduce((sum, d) => sum + (d.NoOfStones || 0), 0);
                    const diamondCarat = diamonds.reduce((sum, d) => sum + (d.Carat || 0), 0);
                    const diamondValue = diamonds.reduce((sum, d) => sum + (d.Value || 0), 0);
                    
                    const csStones = colorstones.reduce((sum, c) => sum + (c.NoOfStones || 0), 0);
                    const csCarat = colorstones.reduce((sum, c) => sum + (c.Carat || 0), 0);
                    const csValue = colorstones.reduce((sum, c) => sum + (c.Value || 0), 0);

                    return (
                      <tr key={item.id || index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">{item.SupplierName || '-'}</td>
                        <td className="px-4 py-3 text-xs">{item.invoiceNumber || '-'}</td>
                        <td className="px-4 py-3">{item.ProductName || '-'}</td>
                        <td className="px-4 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
                        <td className="px-4 py-3 text-right">{item.PCS || 0}</td>
                        <td className="px-4 py-3 text-right">{(item.GoldWt || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondStones}</td>
                        <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondCarat.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-blue-700">
                          ₹{diamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3 text-right text-purple-700 font-medium">{csStones}</td>
                        <td className="px-4 py-3 text-right text-purple-700 font-medium">{csCarat.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-purple-700">
                          ₹{csValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          ₹{(item.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => viewEntryDetails(item)}
                            className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 mx-auto text-xs transition-colors"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailModal(false)} />
          <div className="relative z-60 w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <h3 className="text-xl font-bold">Purchase Entry Details</h3>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-auto flex-1">
              <div className="space-y-6">
                {/* Basic Information */}
                <section>
                  <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Supplier Name</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.SupplierName || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Invoice Number</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.invoiceNumber || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Supplier Code</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.suppCode || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Product Name</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.ProductName || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Design No</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border font-mono">{selectedEntry.DesignNo || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Metal Type</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.MetalType || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Weight Mode</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.WtMode || '-'}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Pieces</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.PCS || 0}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">HUID</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.HUID || '-'}</div>
                    </div>
                  </div>
                </section>

                {/* Gold Details */}
                {(selectedEntry.GoldWt > 0 || selectedEntry.GoldValue > 0) && (
                  <section>
                    <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Gold Karat</label>
                        <div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GCarat || 0}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Gold Weight (g)</label>
                        <div className="mt-1 p-2 bg-yellow-50 rounded border">{(selectedEntry.GoldWt || 0).toFixed(3)}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Gold Purity</label>
                        <div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GoldPurity || 0}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 font-medium">Gold Value</label>
                        <div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">₹{(selectedEntry.GoldValue || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Diamonds Section */}
                <section>
                  <h4 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2 flex items-center gap-2">
                    <Diamond className="w-5 h-5" /> Diamonds Details
                  </h4>
                  {(() => {
                    const diamonds = parseStones(selectedEntry.diamonds);
                    return diamonds.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-blue-50">
                            <tr>
                              <th className="px-3 py-2 text-left border">Shape</th>
                              <th className="px-3 py-2 text-right border">No. of Stones</th>
                              <th className="px-3 py-2 text-right border">Carat</th>
                              <th className="px-3 py-2 text-right border">Weight (g)</th>
                              <th className="px-3 py-2 text-right border">Rate (₹)</th>
                              <th className="px-3 py-2 text-right border">Value (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {diamonds.map((diamond, idx) => (
                              <tr key={idx} className="hover:bg-blue-50">
                                <td className="px-3 py-2 border">{diamond.DiamondShape || '-'}</td>
                                <td className="px-3 py-2 text-right border font-medium">{diamond.NoOfStones || 0}</td>
                                <td className="px-3 py-2 text-right border font-semibold text-blue-700">{(diamond.Carat || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">{(diamond.Weight || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">₹{(diamond.Rate || 0).toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-right border font-bold text-blue-700">₹{(diamond.Value || 0).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-100 font-bold">
                              <td className="px-3 py-2 border">Total</td>
                              <td className="px-3 py-2 text-right border">
                                {diamonds.reduce((sum, d) => sum + (d.NoOfStones || 0), 0)}
                              </td>
                              <td className="px-3 py-2 text-right border text-blue-800">
                                {diamonds.reduce((sum, d) => sum + (d.Carat || 0), 0).toFixed(3)}
                              </td>
                              <td className="px-3 py-2 text-right border">
                                {diamonds.reduce((sum, d) => sum + (d.Weight || 0), 0).toFixed(3)}
                              </td>
                              <td className="px-3 py-2 border">-</td>
                              <td className="px-3 py-2 text-right border text-blue-800">
                                ₹{diamonds.reduce((sum, d) => sum + (d.Value || 0), 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No diamond details available</div>
                    );
                  })()}
                </section>

                {/* ColorStones Section */}
                <section>
                  <h4 className="text-lg font-semibold mb-3 text-purple-600 border-b pb-2 flex items-center gap-2">
                    <Gem className="w-5 h-5" /> ColorStones Details
                  </h4>
                  {(() => {
                    const colorstones = parseStones(selectedEntry.colorstones);
                    return colorstones.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-3 py-2 text-left border">Shape/Type</th>
                              <th className="px-3 py-2 text-right border">No. of Stones</th>
                              <th className="px-3 py-2 text-right border">Carat</th>
                              <th className="px-3 py-2 text-right border">Weight (g)</th>
                              <th className="px-3 py-2 text-right border">Rate (₹)</th>
                              <th className="px-3 py-2 text-right border">Value (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {colorstones.map((cs, idx) => (
                              <tr key={idx} className="hover:bg-purple-50">
                                <td className="px-3 py-2 border">{cs.csShape || '-'}</td>
                                <td className="px-3 py-2 text-right border font-medium">{cs.NoOfStones || 0}</td>
                                <td className="px-3 py-2 text-right border font-semibold text-purple-700">{(cs.Carat || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">{(cs.Weight || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">₹{(cs.Rate || 0).toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-right border font-bold text-purple-700">₹{(cs.Value || 0).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                            <tr className="bg-purple-100 font-bold">
                              <td className="px-3 py-2 border">Total</td>
                              <td className="px-3 py-2 text-right border">
                                {colorstones.reduce((sum, c) => sum + (c.NoOfStones || 0), 0)}
                              </td>
                              <td className="px-3 py-2 text-right border text-purple-800">
                                {colorstones.reduce((sum, c) => sum + (c.Carat || 0), 0).toFixed(3)}
                              </td>
                              <td className="px-3 py-2 text-right border">
                                {colorstones.reduce((sum, c) => sum + (c.Weight || 0), 0).toFixed(3)}
                              </td>
                              <td className="px-3 py-2 border">-</td>
                              <td className="px-3 py-2 text-right border text-purple-800">
                                ₹{colorstones.reduce((sum, c) => sum + (c.Value || 0), 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No colorstone details available</div>
                    );
                  })()}
                </section>

                {/* Totals */}
                <section>
                  <h4 className="text-lg font-semibold mb-3 text-green-600 border-b pb-2">Totals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Total Value</label>
                      <div className="mt-1 p-2 bg-green-50 rounded border font-semibold">₹{(selectedEntry.TotalValue || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">GST</label>
                      <div className="mt-1 p-2 bg-green-50 rounded border">₹{(selectedEntry.GST || 0).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium">Grand Total</label>
                      <div className="mt-1 p-2 bg-green-100 rounded border font-bold text-lg text-green-700">
                        ₹{(selectedEntry.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReport;

// const PurchaseReport = () => {
//   const { user, companyName } = useContext(DashBoardContext);
//   const [purchaseData, setPurchaseData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);

//   // Unique lists for dropdowns
//   const [suppliers, setSuppliers] = useState([]);
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);

//   // Filter states
//   const [filters, setFilters] = useState({
//     supplierName: '',
//     invoiceNumber: '',
//     fromDate: '',
//     toDate: ''
//   });

//   // Helper function to parse diamonds/colorstones JSON strings
//   const parseStones = (stonesString) => {
//     try {
//       if (!stonesString || stonesString === '[]') return [];
//       return JSON.parse(stonesString);
//     } catch (error) {
//       console.error('Error parsing stones:', error);
//       return [];
//     }
//   };

//   // Fetch all purchase entries on mount
//   useEffect(() => {
//     fetchPurchaseEntries();
//   }, []);

//   // Update unique suppliers and invoices when data changes
//   useEffect(() => {
//     if (purchaseData.length > 0) {
//       const uniqueSuppliers = [...new Set(
//         purchaseData
//           .map(item => item.SupplierName)
//           .filter(name => name && name.trim() !== '')
//       )].sort();
//       setSuppliers(uniqueSuppliers);

//       const uniqueInvoices = [...new Set(
//         purchaseData
//           .map(item => item.invoiceNumber)
//           .filter(invoice => invoice && invoice.trim() !== '')
//       )].sort();
//       setInvoices(uniqueInvoices);
//       setFilteredInvoices(uniqueInvoices);
//     }
//   }, [purchaseData]);

//   // Filter invoices based on selected supplier
//   useEffect(() => {
//     if (filters.supplierName) {
//       const supplierInvoices = [...new Set(
//         purchaseData
//           .filter(item => item.SupplierName === filters.supplierName)
//           .map(item => item.invoiceNumber)
//           .filter(invoice => invoice && invoice.trim() !== '')
//       )].sort();
//       setFilteredInvoices(supplierInvoices);
      
//       if (filters.invoiceNumber && !supplierInvoices.includes(filters.invoiceNumber)) {
//         setFilters(prev => ({ ...prev, invoiceNumber: '' }));
//       }
//     } else {
//       setFilteredInvoices(invoices);
//     }
//   }, [filters.supplierName, purchaseData, invoices]);

//   // Auto-apply filters when filter values change
//   useEffect(() => {
//     applyFilters();
//   }, [filters, purchaseData]);

//   // Fetch purchase entries from backend
//   const fetchPurchaseEntries = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${DIA_API}/getPurchaseEntries`);
//       const data = response.data.result[0] || [];
//       console.log('Fetched purchase entries:', data);
//       setPurchaseData(data);
//       setFilteredData(data);
//     } catch (error) {
//       console.error('Error fetching purchase entries:', error);
//       setPurchaseData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Apply filters
//   const applyFilters = () => {
//     let filtered = [...purchaseData];

//     if (filters.supplierName) {
//       filtered = filtered.filter(item => 
//         item.SupplierName === filters.supplierName
//       );
//     }

//     if (filters.invoiceNumber) {
//       filtered = filtered.filter(item => 
//         item.invoiceNumber === filters.invoiceNumber
//       );
//     }

//     if (filters.fromDate) {
//       filtered = filtered.filter(item => {
//         if (!item.createdAt) return false;
//         const itemDate = new Date(item.createdAt);
//         const fromDate = new Date(filters.fromDate);
//         return itemDate >= fromDate;
//       });
//     }

//     if (filters.toDate) {
//       filtered = filtered.filter(item => {
//         if (!item.createdAt) return false;
//         const itemDate = new Date(item.createdAt);
//         const toDate = new Date(filters.toDate);
//         toDate.setHours(23, 59, 59, 999);
//         return itemDate <= toDate;
//       });
//     }

//     setFilteredData(filtered);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       supplierName: '',
//       invoiceNumber: '',
//       fromDate: '',
//       toDate: ''
//     });
//   };

//   // Handle supplier change
//   const handleSupplierChange = (e) => {
//     setFilters({
//       ...filters, 
//       supplierName: e.target.value,
//       invoiceNumber: ''
//     });
//   };

//   // Export to Excel
//   const exportToExcel = () => {
//     if (filteredData.length === 0) {
//       alert('No data to export');
//       return;
//     }

//     const mainData = filteredData.map((item, index) => {
//       const diamonds = parseStones(item.diamonds);
//       const colorstones = parseStones(item.colorstones);

//       return {
//         'Sno': index + 1,
//         'Supplier Name': item.SupplierName || '',
//         'Invoice Number': item.invoiceNumber || '',
//         'Supplier Code': item.suppCode || '',
//         'Product Name': item.ProductName || '',
//         'Metal Type': item.MetalType || '',
//         'Design No': item.DesignNo || '',
//         'Weight Mode': item.WtMode || '',
//         'Pcs': item.PCS || 0,
//         'Gold Karat': item.GCarat || 0,
//         'Gold Weight': item.GoldWt || 0,
//         'Gold Value': item.GoldValue || 0,
//         'PT Weight': item.PTWt || 0,
//         'PT Value': item.PTValue || 0,
//         'Total Diamond Stones': diamonds.reduce((sum, d) => sum + (d.NoOfStones || 0), 0),
//         'Total Diamond Carat': diamonds.reduce((sum, d) => sum + (d.Carat || 0), 0),
//         'Total Diamond Value': diamonds.reduce((sum, d) => sum + (d.Value || 0), 0),
//         'Total ColorStone Stones': colorstones.reduce((sum, c) => sum + (c.NoOfStones || 0), 0),
//         'Total ColorStone Carat': colorstones.reduce((sum, c) => sum + (c.Carat || 0), 0),
//         'Total ColorStone Value': colorstones.reduce((sum, c) => sum + (c.Value || 0), 0),
//         'Gold MC Amount': item.GoMcAmount || 0,
//         'Total Value': item.TotalValue || 0,
//         'GST': item.GST || 0,
//         'Grand Total': item.GrandTotal || 0,
//         'HUID': item.HUID || '',
//         'Created At': item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''
//       };
//     });

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(mainData);
//     ws['!cols'] = Array(Object.keys(mainData[0]).length).fill({ wch: 15 });
//     XLSX.utils.book_append_sheet(wb, ws, 'Purchase Report');

//     const timestamp = new Date().toISOString().split('T')[0];
//     const filename = `Purchase_Report_${timestamp}.xlsx`;
//     XLSX.writeFile(wb, filename);
//   };

//   // Calculate summary statistics with parsed diamonds and colorstones
//   const calculateSummary = () => {
//     let totalDiamondCarat = 0;
//     let totalDiamondValue = 0;
//     let totalDiamondStones = 0;
//     let totalColorStoneCarat = 0;
//     let totalColorStoneValue = 0;
//     let totalColorStoneStones = 0;

//     filteredData.forEach(item => {
//       const diamonds = parseStones(item.diamonds);
//       const colorstones = parseStones(item.colorstones);

//       diamonds.forEach(d => {
//         totalDiamondStones += d.NoOfStones || 0;
//         totalDiamondCarat += d.Carat || 0;
//         totalDiamondValue += d.Value || 0;
//       });

//       colorstones.forEach(c => {
//         totalColorStoneStones += c.NoOfStones || 0;
//         totalColorStoneCarat += c.Carat || 0;
//         totalColorStoneValue += c.Value || 0;
//       });
//     });

//     return {
//       totalEntries: filteredData.length,
//       totalGoldWeight: filteredData.reduce((sum, item) => sum + (item.GoldWt || 0), 0),
//       totalPlatinumWeight: filteredData.reduce((sum, item) => sum + (item.PTWt || 0), 0),
//       totalDiamondStones,
//       totalDiamondCarat,
//       totalDiamondValue,
//       totalColorStoneStones,
//       totalColorStoneCarat,
//       totalColorStoneValue,
//       totalValue: filteredData.reduce((sum, item) => sum + (item.GrandTotal || 0), 0),
//       uniqueSuppliers: new Set(filteredData.map(item => item.SupplierName)).size,
//       uniqueInvoices: new Set(filteredData.map(item => item.invoiceNumber)).size
//     };
//   };

//   // View entry details
//   const viewEntryDetails = (entry) => {
//     setSelectedEntry(entry);
//     setShowDetailModal(true);
//   };

//   const summary = calculateSummary();

//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-semibold flex items-center gap-2">
//             <FileSpreadsheet className="w-6 h-6" /> Purchase Report
//           </h2>
//           <div className="flex gap-3">
//             <button
//               onClick={fetchPurchaseEntries}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
//             >
//               <RefreshCw className="w-4 h-4" /> Refresh
//             </button>
//             <button
//               onClick={exportToExcel}
//               disabled={filteredData.length === 0}
//               className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
//                 filteredData.length === 0 
//                   ? 'bg-gray-300 cursor-not-allowed' 
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               <Download className="w-4 h-4" /> Export to Excel
//             </button>
//           </div>
//         </div>

//         {/* Filters Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-indigo-600" />
//             <h3 className="text-lg font-semibold">Filters</h3>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             {/* Supplier Name Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Supplier Name
//               </label>
//               <div className="relative">
//                 <select
//                   value={filters.supplierName}
//                   onChange={handleSupplierChange}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
//                 >
//                   <option value="">All Suppliers</option>
//                   {suppliers.map((supplier, index) => (
//                     <option key={index} value={supplier}>
//                       {supplier}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Invoice Number Dropdown */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Invoice Number
//                 {filters.supplierName && (
//                   <span className="text-xs text-gray-500 ml-1">
//                     ({filteredInvoices.length} invoices)
//                   </span>
//                 )}
//               </label>
//               <div className="relative">
//                 <select
//                   value={filters.invoiceNumber}
//                   onChange={(e) => setFilters({...filters, invoiceNumber: e.target.value})}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
//                   disabled={filteredInvoices.length === 0}
//                 >
//                   <option value="">
//                     {filters.supplierName 
//                       ? 'All Invoices (for selected supplier)' 
//                       : 'All Invoices'}
//                   </option>
//                   {filteredInvoices.map((invoice, index) => (
//                     <option key={index} value={invoice}>
//                       {invoice}
//                     </option>
//                   ))}
//                 </select>
//                 <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* From Date Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 From Date
//               </label>
//               <div className="relative">
//                 <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
//                 <input
//                   type="date"
//                   value={filters.fromDate}
//                   onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
//                   className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* To Date Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 To Date
//               </label>
//               <div className="relative">
//                 <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
//                 <input
//                   type="date"
//                   value={filters.toDate}
//                   onChange={(e) => setFilters({...filters, toDate: e.target.value})}
//                   className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Filter Actions */}
//           <div className="flex gap-3">
//             <button
//               onClick={resetFilters}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
//             >
//               <RefreshCw className="w-4 h-4" /> Reset Filters
//             </button>
//             {(filters.supplierName || filters.invoiceNumber || filters.fromDate || filters.toDate) && (
//               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg">
//                 <Filter className="w-4 h-4" />
//                 <span className="text-sm font-medium">
//                   {filteredData.length} of {purchaseData.length} entries shown
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Enhanced Summary Cards with Diamonds and ColorStones */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Row 1 */}
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Total Entries</div>
//             <div className="text-2xl font-bold text-indigo-600">{summary.totalEntries}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Suppliers</div>
//             <div className="text-2xl font-bold text-blue-600">{summary.uniqueSuppliers}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Invoices</div>
//             <div className="text-2xl font-bold text-green-600">{summary.uniqueInvoices}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Gold Wt (g)</div>
//             <div className="text-2xl font-bold text-yellow-600">{summary.totalGoldWeight.toFixed(3)}</div>
//           </div>

//           {/* Row 2 - Diamond Stats */}
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
//             <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
//               <Diamond className="w-4 h-4" /> Diamond Stones
//             </div>
//             <div className="text-2xl font-bold text-blue-700">{summary.totalDiamondStones}</div>
//           </div>
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
//             <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
//               <Diamond className="w-4 h-4" /> Diamond Carat
//             </div>
//             <div className="text-2xl font-bold text-blue-700">{summary.totalDiamondCarat.toFixed(3)}</div>
//           </div>
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200">
//             <div className="flex items-center gap-2 text-sm text-blue-700 font-medium">
//               <Diamond className="w-4 h-4" /> Diamond Value (₹)
//             </div>
//             <div className="text-xl font-bold text-blue-700">
//               {summary.totalDiamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Platinum Wt (g)</div>
//             <div className="text-2xl font-bold text-gray-600">{summary.totalPlatinumWeight.toFixed(3)}</div>
//           </div>

//           {/* Row 3 - ColorStone Stats */}
//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
//             <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
//               <Gem className="w-4 h-4" /> ColorStone Stones
//             </div>
//             <div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneStones}</div>
//           </div>
//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
//             <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
//               <Gem className="w-4 h-4" /> ColorStone Carat
//             </div>
//             <div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneCarat.toFixed(3)}</div>
//           </div>
//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200">
//             <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
//               <Gem className="w-4 h-4" /> ColorStone Value (₹)
//             </div>
//             <div className="text-xl font-bold text-purple-700">
//               {summary.totalColorStoneValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-sm text-gray-600">Total Value (₹)</div>
//             <div className="text-xl font-bold text-emerald-600">
//               {summary.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//             </div>
//           </div>
//         </div>

//         {/* Data Table */}
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//             <span className="ml-3 text-lg">Loading data...</span>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
//             <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h3>
//             <p className="text-gray-500">
//               {purchaseData.length === 0 
//                 ? 'No purchase entries available. Upload data to get started.' 
//                 : 'No entries match the selected filters. Try adjusting your search criteria.'}
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-50 border-b sticky top-0">
//                   <tr>
//                     <th className="px-4 py-3 text-left font-semibold">Sno</th>
//                     <th className="px-4 py-3 text-left font-semibold">Supplier</th>
//                     <th className="px-4 py-3 text-left font-semibold">Invoice</th>
//                     <th className="px-4 py-3 text-left font-semibold">Product</th>
//                     <th className="px-4 py-3 text-left font-semibold">Design No</th>
//                     <th className="px-4 py-3 text-right font-semibold">Pcs</th>
//                     <th className="px-4 py-3 text-right font-semibold">Gold Wt</th>
//                     <th className="px-4 py-3 text-right font-semibold">💎 Stones</th>
//                     <th className="px-4 py-3 text-right font-semibold">💎 Carat</th>
//                     <th className="px-4 py-3 text-right font-semibold">💎 Value</th>
//                     <th className="px-4 py-3 text-right font-semibold">🔮 Stones</th>
//                     <th className="px-4 py-3 text-right font-semibold">🔮 Carat</th>
//                     <th className="px-4 py-3 text-right font-semibold">🔮 Value</th>
//                     <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
//                     <th className="px-4 py-3 text-left font-semibold">Date</th>
//                     <th className="px-4 py-3 text-center font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((item, index) => {
//                     const diamonds = parseStones(item.diamonds);
//                     const colorstones = parseStones(item.colorstones);
                    
//                     const diamondStones = diamonds.reduce((sum, d) => sum + (d.NoOfStones || 0), 0);
//                     const diamondCarat = diamonds.reduce((sum, d) => sum + (d.Carat || 0), 0);
//                     const diamondValue = diamonds.reduce((sum, d) => sum + (d.Value || 0), 0);
                    
//                     const csStones = colorstones.reduce((sum, c) => sum + (c.NoOfStones || 0), 0);
//                     const csCarat = colorstones.reduce((sum, c) => sum + (c.Carat || 0), 0);
//                     const csValue = colorstones.reduce((sum, c) => sum + (c.Value || 0), 0);

//                     return (
//                       <tr key={item.id || index} className="border-b hover:bg-gray-50">
//                         <td className="px-4 py-3">{index + 1}</td>
//                         <td className="px-4 py-3">{item.SupplierName || '-'}</td>
//                         <td className="px-4 py-3 text-xs">{item.invoiceNumber || '-'}</td>
//                         <td className="px-4 py-3">{item.ProductName || '-'}</td>
//                         <td className="px-4 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
//                         <td className="px-4 py-3 text-right">{item.PCS || 0}</td>
//                         <td className="px-4 py-3 text-right">{(item.GoldWt || 0).toFixed(2)}</td>
//                         <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondStones}</td>
//                         <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondCarat.toFixed(2)}</td>
//                         <td className="px-4 py-3 text-right text-blue-700">
//                           ₹{diamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                         </td>
//                         <td className="px-4 py-3 text-right text-purple-700 font-medium">{csStones}</td>
//                         <td className="px-4 py-3 text-right text-purple-700 font-medium">{csCarat.toFixed(2)}</td>
//                         <td className="px-4 py-3 text-right text-purple-700">
//                           ₹{csValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
//                         </td>
//                         <td className="px-4 py-3 text-right font-semibold">
//                           ₹{(item.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                         </td>
//                         <td className="px-4 py-3 text-xs">
//                           {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
//                         </td>
//                         <td className="px-4 py-3 text-center">
//                           <button
//                             onClick={() => viewEntryDetails(item)}
//                             className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 mx-auto text-xs"
//                           >
//                             <Eye className="w-3 h-3" /> View
//                           </button>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {showDetailModal && selectedEntry && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailModal(false)} />
//           <div className="relative z-60 w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             {/* Modal Header */}
//             <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//               <h3 className="text-xl font-bold">Purchase Entry Details</h3>
//               <button 
//                 onClick={() => setShowDetailModal(false)} 
//                 className="p-2 hover:bg-white/20 rounded-full transition"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 overflow-auto flex-1">
//               <div className="space-y-6">
//                 {/* Basic Information */}
//                 <section>
//                   <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">Basic Information</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Supplier Name</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.SupplierName || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Invoice Number</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.invoiceNumber || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Supplier Code</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.suppCode || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Product Name</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.ProductName || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Design No</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border font-mono">{selectedEntry.DesignNo || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Metal Type</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.MetalType || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Weight Mode</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.WtMode || '-'}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Pieces</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.PCS || 0}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">HUID</label>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.HUID || '-'}</div>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Gold Details */}
//                 {(selectedEntry.GoldWt > 0 || selectedEntry.GoldValue > 0) && (
//                   <section>
//                     <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div>
//                         <label className="text-xs text-gray-600 font-medium">Gold Karat</label>
//                         <div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GCarat || 0}</div>
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-600 font-medium">Gold Weight (g)</label>
//                         <div className="mt-1 p-2 bg-yellow-50 rounded border">{(selectedEntry.GoldWt || 0).toFixed(3)}</div>
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-600 font-medium">Gold Purity</label>
//                         <div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GoldPurity || 0}</div>
//                       </div>
//                       <div>
//                         <label className="text-xs text-gray-600 font-medium">Gold Value</label>
//                         <div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">₹{(selectedEntry.GoldValue || 0).toFixed(2)}</div>
//                       </div>
//                     </div>
//                   </section>
//                 )}

//                 {/* Diamonds Section */}
//                 <section>
//                   <h4 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2 flex items-center gap-2">
//                     <Diamond className="w-5 h-5" /> Diamonds Details
//                   </h4>
//                   {(() => {
//                     const diamonds = parseStones(selectedEntry.diamonds);
//                     return diamonds.length > 0 ? (
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full text-sm border">
//                           <thead className="bg-blue-50">
//                             <tr>
//                               <th className="px-3 py-2 text-left border">Shape</th>
//                               <th className="px-3 py-2 text-right border">No. of Stones</th>
//                               <th className="px-3 py-2 text-right border">Carat</th>
//                               <th className="px-3 py-2 text-right border">Weight (g)</th>
//                               <th className="px-3 py-2 text-right border">Rate (₹)</th>
//                               <th className="px-3 py-2 text-right border">Value (₹)</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {diamonds.map((diamond, idx) => (
//                               <tr key={idx} className="hover:bg-blue-50">
//                                 <td className="px-3 py-2 border">{diamond.DiamondShape || '-'}</td>
//                                 <td className="px-3 py-2 text-right border font-medium">{diamond.NoOfStones || 0}</td>
//                                 <td className="px-3 py-2 text-right border font-semibold text-blue-700">{(diamond.Carat || 0).toFixed(3)}</td>
//                                 <td className="px-3 py-2 text-right border">{(diamond.Weight || 0).toFixed(3)}</td>
//                                 <td className="px-3 py-2 text-right border">₹{(diamond.Rate || 0).toLocaleString('en-IN')}</td>
//                                 <td className="px-3 py-2 text-right border font-bold text-blue-700">₹{(diamond.Value || 0).toLocaleString('en-IN')}</td>
//                               </tr>
//                             ))}
//                             <tr className="bg-blue-100 font-bold">
//                               <td className="px-3 py-2 border">Total</td>
//                               <td className="px-3 py-2 text-right border">
//                                 {diamonds.reduce((sum, d) => sum + (d.NoOfStones || 0), 0)}
//                               </td>
//                               <td className="px-3 py-2 text-right border text-blue-800">
//                                 {diamonds.reduce((sum, d) => sum + (d.Carat || 0), 0).toFixed(3)}
//                               </td>
//                               <td className="px-3 py-2 text-right border">
//                                 {diamonds.reduce((sum, d) => sum + (d.Weight || 0), 0).toFixed(3)}
//                               </td>
//                               <td className="px-3 py-2 border">-</td>
//                               <td className="px-3 py-2 text-right border text-blue-800">
//                                 ₹{diamonds.reduce((sum, d) => sum + (d.Value || 0), 0).toLocaleString('en-IN')}
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No diamond details available</div>
//                     );
//                   })()}
//                 </section>

//                 {/* ColorStones Section */}
//                 <section>
//                   <h4 className="text-lg font-semibold mb-3 text-purple-600 border-b pb-2 flex items-center gap-2">
//                     <Gem className="w-5 h-5" /> ColorStones Details
//                   </h4>
//                   {(() => {
//                     const colorstones = parseStones(selectedEntry.colorstones);
//                     return colorstones.length > 0 ? (
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full text-sm border">
//                           <thead className="bg-purple-50">
//                             <tr>
//                               <th className="px-3 py-2 text-left border">Shape/Type</th>
//                               <th className="px-3 py-2 text-right border">No. of Stones</th>
//                               <th className="px-3 py-2 text-right border">Carat</th>
//                               <th className="px-3 py-2 text-right border">Weight (g)</th>
//                               <th className="px-3 py-2 text-right border">Rate (₹)</th>
//                               <th className="px-3 py-2 text-right border">Value (₹)</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {colorstones.map((cs, idx) => (
//                               <tr key={idx} className="hover:bg-purple-50">
//                                 <td className="px-3 py-2 border">{cs.csShape || '-'}</td>
//                                 <td className="px-3 py-2 text-right border font-medium">{cs.NoOfStones || 0}</td>
//                                 <td className="px-3 py-2 text-right border font-semibold text-purple-700">{(cs.Carat || 0).toFixed(3)}</td>
//                                 <td className="px-3 py-2 text-right border">{(cs.Weight || 0).toFixed(3)}</td>
//                                 <td className="px-3 py-2 text-right border">₹{(cs.Rate || 0).toLocaleString('en-IN')}</td>
//                                 <td className="px-3 py-2 text-right border font-bold text-purple-700">₹{(cs.Value || 0).toLocaleString('en-IN')}</td>
//                               </tr>
//                             ))}
//                             <tr className="bg-purple-100 font-bold">
//                               <td className="px-3 py-2 border">Total</td>
//                               <td className="px-3 py-2 text-right border">
//                                 {colorstones.reduce((sum, c) => sum + (c.NoOfStones || 0), 0)}
//                               </td>
//                               <td className="px-3 py-2 text-right border text-purple-800">
//                                 {colorstones.reduce((sum, c) => sum + (c.Carat || 0), 0).toFixed(3)}
//                               </td>
//                               <td className="px-3 py-2 text-right border">
//                                 {colorstones.reduce((sum, c) => sum + (c.Weight || 0), 0).toFixed(3)}
//                               </td>
//                               <td className="px-3 py-2 border">-</td>
//                               <td className="px-3 py-2 text-right border text-purple-800">
//                                 ₹{colorstones.reduce((sum, c) => sum + (c.Value || 0), 0).toLocaleString('en-IN')}
//                               </td>
//                             </tr>
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No colorstone details available</div>
//                     );
//                   })()}
//                 </section>

//                 {/* Totals */}
//                 <section>
//                   <h4 className="text-lg font-semibold mb-3 text-green-600 border-b pb-2">Totals</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Total Value</label>
//                       <div className="mt-1 p-2 bg-green-50 rounded border font-semibold">₹{(selectedEntry.TotalValue || 0).toFixed(2)}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">GST</label>
//                       <div className="mt-1 p-2 bg-green-50 rounded border">₹{(selectedEntry.GST || 0).toFixed(2)}</div>
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-600 font-medium">Grand Total</label>
//                       <div className="mt-1 p-2 bg-green-100 rounded border font-bold text-lg text-green-700">
//                         ₹{(selectedEntry.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                       </div>
//                     </div>
//                   </div>
//                 </section>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-4 border-t bg-gray-50 flex justify-end">
//               <button
//                 onClick={() => setShowDetailModal(false)}
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PurchaseReport;
