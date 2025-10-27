
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DIA_API } from "../../../config/configData";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import PDFExportButton from "./ExportToPdf";

const SupplierReport = () => {
  const { userRole, user } = useContext(DashBoardContext);
  const [filterData, setFilterData] = useState('Pending');
  const [supplierNames, setSupplierNames] = useState("");
  const [invoiceNo, setInvoiceNo] = useState(""); // New invoice filter state
  const [queryOptions, setQueryOptions] = useState([]);
  const [invoiceOptions, setInvoiceOptions] = useState([]); // New state for invoice options
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]); // Store all data for client-side filtering
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (value, columnId) => {
    const threeDecimalColumns = [
      'GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt',
      'DCarat', 'DiamondWt', 'CLSCarat', 'ClrStnWt'
    ];
    const integerColumns = ['PCS', 'NoofStone', 'ClrStnPCS'];
    
    if (!value && value !== 0) return '';
    
    if (threeDecimalColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    }
    if (integerColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const TABLE_HEAD = [
    { id: 'sno', label: 'S.No', type: 'number' },
    { id: 'invoiceNumber', label: 'Invoice No', type: 'text' }, // Add Invoice No column
    { id: 'SupplierName', label: 'Supplier Name', type: 'text' },
    { id: 'ProductName', label: 'Product Name', type: 'text' },
    // ... rest of your existing columns
    { id: 'MetalType', label: 'Metal Type', type: 'text' },
    { id: 'WtMode', label: 'Weight Mode', type: 'text' },
    { id: 'DesignNo', label: 'Design No', type: 'text' },
    { id: 'GCarat', label: 'Gold Karat', type: 'text' },
    { id: 'PCS', label: 'PCS', type: 'number' },
    { id: 'GoldWt', label: 'Gold Weight', type: 'number' },
    { id: 'GoldPurity', label: 'Gold Purity', type: 'text' },
    { id: 'GoldPurityWt', label: 'Gold Purity Weight', type: 'number' },
    { id: 'Gold999Rate', label: 'Gold 999 Rate', type: 'text' },
    { id: 'GoldValue', label: 'Gold Value', type: 'number' },
    { id: 'PTWt', label: 'Platinum Weight', type: 'number' },
    { id: 'PTPurity', label: 'Platinum Purity', type: 'text' },
    { id: 'PTPurityWt', label: 'Platinum Purity Weight', type: 'number' },
    { id: 'PT999Rate', label: 'Platinum 999 Rate', type: 'text' },
    { id: 'PTValue', label: 'Platinum Value', type: 'number' },
    { id: 'NoofStone', label: 'Number of Stones', type: 'number' },
    { id: 'DCarat', label: 'Diamond Carat', type: 'number' },
    { id: 'DiamondWt', label: 'Diamond Weight', type: 'number' },
    { id: 'DiamondRate', label: 'Diamond Rate', type: 'text' },
    { id: 'DiamondValue', label: 'Diamond Value', type: 'number' },
    { id: 'ClrStnPCS', label: 'Color Stone PCS', type: 'number' },
    { id: 'CLSCarat', label: 'Color Stone Carat', type: 'number' },
    { id: 'ClrStnWt', label: 'Color Stone Weight', type: 'number' },
    { id: 'ClrStnRate', label: 'Color Stone Rate', type: 'text' },
    { id: 'CSAmount', label: 'Color Stone Amount', type: 'number' },
    { id: 'GoMcType', label: 'Gold Making Charge Type', type: 'text' },
    { id: 'GoMcRate', label: 'Gold Making Charge Rate', type: 'text' },
    { id: 'GoMcAmount', label: 'Gold Making Charge Amount', type: 'number' },
    { id: 'PTMcType', label: 'Platinum Making Charge Type', type: 'text' },
    { id: 'PTMcRate', label: 'Platinum Making Charge Rate', type: 'text' },
    { id: 'PTMcAmount', label: 'Platinum Making Charge Amount', type: 'number' },
    { id: 'WastageType', label: 'Wastage Type', type: 'text' },
    { id: 'WastageWeight', label: 'Wastage Weight', type: 'number' },
    { id: 'WastageAmt', label: 'Wastage Amount', type: 'number' },
    { id: 'CertType', label: 'Certificate Type', type: 'text' },
    { id: 'CertGST', label: 'Certificate GST', type: 'text' },
    { id: 'CertQty', label: 'Certificate Quantity', type: 'number' },
    { id: 'CertRate', label: 'Certificate Rate', type: 'text' },
    { id: 'CertTaxableAmt', label: 'Certificate Taxable Amount', type: 'number' },
    { id: 'CertTotal', label: 'Certificate Total', type: 'number' },
    { id: 'HallMarkType', label: 'Hallmark Type', type: 'text' },
    { id: 'HMGST', label: 'Hallmark GST', type: 'number' },
    { id: 'HMQty', label: 'Hallmark Quantity', type: 'number' },
    { id: 'HMRate', label: 'Hallmark Rate', type: 'text' },
    { id: 'HMTaxableAmt', label: 'Hallmark Taxable Amount', type: 'number' },
    { id: 'HMTotal', label: 'Hallmark Total', type: 'number' },
    { id: 'HandleRate', label: 'Handling Rate', type: 'text' },
    { id: 'HandleAmount', label: 'Handling Amount', type: 'number' },
    { id: 'GNetWt', label: 'Gold Net Weight', type: 'number' },
    { id: 'PNetWt', label: 'Platinum Net Weight', type: 'number' },
    { id: 'TotalValue', label: 'Total Value', type: 'number' },
    { id: 'GST', label: 'GST', type: 'number' },
    { id: 'GrandTotal', label: 'Grand Total', type: 'number' },
    { id: 'HUID', label: 'HUID', type: 'text' },
  ];

  // Calculate totals based on filtered rows
  const totals = rows.reduce((acc, row) => {
    TABLE_HEAD.forEach(col => {
      if (col.type === 'number' && col.id !== 'sno') {
        acc[col.id] = (acc[col.id] || 0) + (Number(row[col.id]) || 0);
      }
    });
    return acc;
  }, {});

  // Filter data based on invoice number
  useEffect(() => {
    if (!invoiceNo) {
      setRows(allRows);
    } else {
      const filteredRows = allRows.filter(row => 
        row.invoiceNumber && row.invoiceNumber.toString().toLowerCase().includes(invoiceNo.toLowerCase())
      );
      setRows(filteredRows);
    }
  }, [invoiceNo, allRows]);

  // Clear invoice filter when other filters change
  useEffect(() => {
    setInvoiceNo("");
  }, [filterData, supplierNames]);

  // Fetch initial options
  useEffect(() => {
    const fetchOptionData = async () => {
      try {
        setIsLoading(true);
        if (userRole === "Diamond-Supplier") {
          setSupplierNames(user);
        }
        
        const response = await axios.get(`${DIA_API}/gettingoptiondata`);
        const { supplierNames } = response.data;
        setQueryOptions(supplierNames);
      } catch (err) {
        console.error("Error fetching options:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptionData();
  }, [userRole, user]);

  // Fetch supplier data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const res = await axios.put(
          `${DIA_API}/submittedData`,
          { filterData, supplierNames }
        );
        setAllRows(res.data); // Store all data
        setRows(res.data); // Initially show all data
        
        // Extract unique invoice numbers for dropdown
        const uniqueInvoices = [...new Set(res.data.map(row => row.invoiceNumber).filter(Boolean))];
        setInvoiceOptions(uniqueInvoices.sort());
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (supplierNames && filterData) {
      fetchDetails();
    }
  }, [supplierNames, filterData]);

  const handleExport = async () => {
    try {
      const response = await axios.put(`${DIA_API}/excel`, rows, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DiamondDealerReceipt.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const clearFilters = () => {
    setInvoiceNo("");
    setFilterData('Pending');
    if (userRole !== "Diamond-Supplier") {
      setSupplierNames("");
    }
  };

  return (
    <div className="mx-auto px-2 py-4 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-lg p-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Comprehensive Supplier Report
        </h1>

        {/* Export Buttons */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export to Excel
          </button>
          <PDFExportButton data={rows} />
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Supplier Filter - Only for Diamond-Purchase role */}
            {userRole === "Diamond-Purchase" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supplier
                </label>
                <select 
                  value={supplierNames}
                  onChange={(e) => setSupplierNames(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Suppliers</option>
                  {queryOptions.map((supplier, index) => (
                    <option key={index} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Status
              </label>
              <select 
                value={filterData}
                onChange={(e) => setFilterData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Invoice Number Filter - Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Invoice No
              </label>
            <select 
  value={invoiceNo}
  onChange={(e) => setInvoiceNo(e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">All Invoices</option>
  {[...new Set(rows.map(invoice => invoice.invoiceNumber))]
    .filter(invoiceNum => invoiceNum) // Remove null/undefined values
    .sort() // Optional: sort alphabetically
    .map((invoiceNum, index) => (
      <option key={index} value={invoiceNum}>
        {invoiceNum}
      </option>
    ))
  }
</select>

            </div>

            {/* Invoice Number Filter - Text Input (Alternative) */}
            {/* Uncomment this section if you prefer text input instead of dropdown
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Invoice No
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="Enter invoice number..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            */}

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(supplierNames || invoiceNo || filterData !== 'Pending') && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {supplierNames && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Supplier: {supplierNames}
                  </span>
                )}
                {invoiceNo && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    Invoice: {invoiceNo}
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Status: {filterData}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {/* {!isLoading && (
          <div className="mb-4 p-3 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              Showing <strong>{rows.length}</strong> of <strong>{allRows.length}</strong> records
              {invoiceNo && ` matching invoice "${invoiceNo}"`}
            </p>
          </div>
        )} */}

        {/* Loading, Error, and Data Display */}
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        ) : rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  {TABLE_HEAD.map(column => (
                    <th key={column.id} className="border p-2 text-left">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    {TABLE_HEAD.map(column => (
                      <td key={column.id} className="border p-2">
                        {column.type === 'number' && column.id !== 'sno'
                          ? formatNumber(row[column.id], column.id)
                          : column.id === 'sno'
                          ? index + 1
                          : row[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  {TABLE_HEAD.map(column => (
                    <td key={column.id} className="border p-2">
                      {column.type === 'number' && column.id !== 'sno'
                        ? formatNumber(totals[column.id], column.id)
                        : column.id === 'sno'
                        ? 'Totals'
                        : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-xl">No Data Found</p>
            {invoiceNo && (
              <p className="text-gray-500 text-sm mt-2">
                No records found matching invoice number "{invoiceNo}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierReport;
