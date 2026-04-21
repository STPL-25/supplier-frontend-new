
// import React, { useEffect, useState, useRef, useContext } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   FileSpreadsheet, Eye, Download, Upload, AlertCircle, CheckCircle, Save, RefreshCw, Loader2, XCircle
// } from 'lucide-react';
// import { DIA_API } from '../../../config/configData';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';


// // Loading State Component
// const LoadingState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-8">
//       <div className="absolute inset-0 animate-ping opacity-20">
//         <div className="w-24 h-24 bg-indigo-500 rounded-full"></div>
//       </div>
//       <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
//         <Loader2 className="w-12 h-12 text-white animate-spin" />
//       </div>
//     </div>
//     <div className="text-center space-y-3">
//       <h3 className="text-2xl font-bold text-gray-900">Loading Purchase Entries</h3>
//       <p className="text-gray-500 max-w-md">Processing your Excel file and organizing the data...</p>
//       <div className="flex items-center justify-center gap-2 mt-6">
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//       </div>
//     </div>
//   </div>
// );


// // Empty State Component
// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-8">
//       <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
//         <div className="transform -rotate-3">
//           <FileSpreadsheet className="w-16 h-16 text-gray-400" />
//         </div>
//       </div>
//       <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg ">
//         <Upload className="w-6 h-6 text-white" />
//       </div>
//     </div>
//     <div className="text-center space-y-4 max-w-md">
//       <h3 className="text-2xl font-bold text-gray-900">No Purchase Entries Yet</h3>
//     </div>
//   </div>
// );


// // Column Header Mapping: Display Name -> Backend Field Name
// const COLUMN_HEADER_MAP = {
//   'Entry Id': 'id',
//   'Product Name': 'ProductName',
//   'Metal Type': 'MetalType',
//   'Weight Mode': 'WtMode',
//   'Design No': 'DesignNo',
//   'G Karat': 'GCarat',
//   'Pcs': 'PCS',
//   'Gold Wt': 'GoldWt',
//   'Gold Purity': 'GoldPurity',
//   'Gold Purity Wt': 'GoldPurityWt',
//   'Gold999Rate (without GST)': 'Gold999Rate',
//   'Gold Value': 'GoldValue',
//   'PT Wt': 'PTWt',
//   'PT Purity': 'PTPurity',
//   'PT Purity Wt': 'PTPurityWt',
//   'PT999Rate (without GST)': 'PT999Rate',
//   'PT Value': 'PTValue',
//   'No of Stones': 'NoofStone',
//   'Diamond Carat': 'DCarat',
//   'Diamond Rate': 'DiamondRate',
//   'Diamond Value': 'DiamondValue',
//   'Diamond Wt': 'DiamondWt',
//   'ColorStone PCS': 'ClrStnPCS',
//   'ColorStone Carat': 'CLSCarat',
//   'ColorStone Wt': 'ClrStnWt',
//   'ColorStone Rate': 'ClrStnRate',
//   'ColorStone Amount': 'CSAmount',
//   'Gold Mc Type': 'GoMcType',
//   'Gold Mc Rate': 'GoMcRate',
//   'Gold Mc Amount': 'GoMcAmount',
//   'Platinum Mc Type': 'PTMcType',
//   'Platinum Mc Rate': 'PTMcRate',
//   'Platinum Mc Amount': 'PTMcAmount',
//   'Gold Wastage Type': 'WastageType',
//   'Gold Wastage Weight': 'WastageWeight',
//   'Gold Wastage Amount': 'WastageAmt',
//   'Platinum Wastage Type': 'PTWastageType',
//   'Platinum Wastage Weight': 'PTWastageWeight',
//   'Platinum Wastage Amount': 'PTWastageAmt',
//   'Diamond Certificate Type': 'CertType',
//   'Diamond Certificate GST': 'CertGST',
//   'Diamond Certificate Qty': 'CertQty',
//   'Diamond Certificate Rate': 'CertRate',
//   'Diamond Certificate Taxable Amount': 'CertTaxableAmt',
//   'Diamond Certificate Tax Amount': 'certTaxAmt',
//   'Diamond Certificate Total': 'CertTotal',
//   'Gold HallMark Type': 'HallMarkType',
//   'Gold HallMark GST': 'HMGST',
//   'GoldHallMark Qty': 'HMQty',
//   'Gold HallMark Rate': 'HMRate',
//   'Gold HallMark Taxable Amount': 'HMTaxableAmt',
//   'Gold HallMark Tax Amount': 'HmTaxAmt',
//   'Gold HallMark Total': 'HMTotal',
//   'HandleRate': 'HandleRate',
//   'HandleAmount': 'HandleAmount',
//   'Gold Net Wt': 'GNetWt',
//   'Platinum NetWt': 'PNetWt',
//   'Total Value': 'TotalValue',
//   'GST': 'GST',
//   'Grand Total': 'GrandTotal',
//   'HUID No': 'HUID',
//   'IGI Summary No': 'IgiSummaryNo',
//   'PGI UIN No': 'PgiUinNo'
// };


// // Field Data Types Mapping (based on SQL procedure)
// const FIELD_DATA_TYPES = {
//   // NVARCHAR fields
//   'SupplierName': 'string',
//   'ProductName': 'string',
//   'MetalType': 'string',
//   'WtMode': 'string',
//   'DesignNo': 'string',
//   'GoMcType': 'string',
//   'WastageType': 'string',
//   'CertType': 'string',
//   'HallMarkType': 'string',
//   'HUID': 'string',
//   'suppCode': 'string',
//   'PTMcType': 'string',
//   'PTWastageType': 'string',
//   'IgiSummaryNo': 'string',
//   'PgiUinNo': 'string',
//   'invoiceNumber': 'string',
  
//   // INT fields
//   'id': 'int',
//   'PCS': 'int',
//   'HMQty': 'int',
//   'NoofStone': 'int',
//   'ClrStnPCS': 'int',
  
//   // DECIMAL fields
//   'GCarat': 'decimal',
//   'GoldWt': 'decimal',
//   'GoldPurity': 'decimal',
//   'GoldPurityWt': 'decimal',
//   'Gold999Rate': 'decimal',
//   'GoldValue': 'decimal',
//   'PTWt': 'decimal',
//   'PTPurity': 'decimal',
//   'PTPurityWt': 'decimal',
//   'PT999Rate': 'decimal',
//   'PTValue': 'decimal',
//   'GoMcRate': 'decimal',
//   'GoMcAmount': 'decimal',
//   'WastageWeight': 'decimal',
//   'WastageAmt': 'decimal',
//   'CertGST': 'decimal',
//   'CertQty': 'decimal',
//   'CertRate': 'decimal',
//   'CertTaxableAmt': 'decimal',
//   'CertTotal': 'decimal',
//   'HMGST': 'decimal',
//   'HMRate': 'decimal',
//   'HMTaxableAmt': 'decimal',
//   'HMTotal': 'decimal',
//   'HandleRate': 'decimal',
//   'HandleAmount': 'decimal',
//   'GNetWt': 'decimal',
//   'PNetWt': 'decimal',
//   'TotalValue': 'decimal',
//   'GST': 'decimal',
//   'GrandTotal': 'decimal',
//   'PTMcRate': 'decimal',
//   'PTMcAmount': 'decimal',
//   'PTWastageWeight': 'decimal',
//   'PTWastageAmt': 'decimal',
//   'certTaxAmt': 'decimal',
//   'HmTaxAmt': 'decimal',
//   'DCarat': 'decimal',
//   'DiamondRate': 'decimal',
//   'DiamondValue': 'decimal',
//   'DiamondWt': 'decimal',
//   'CLSCarat': 'decimal',
//   'ClrStnWt': 'decimal',
//   'ClrStnRate': 'decimal',
//   'CSAmount': 'decimal',
// };

// // Platinum-specific columns to exclude from Gold template
// const PT_COLUMNS = [
//   // 'Sno',
//   'Product Name',
//   'Metal Type',
//   'Weight Mode',
//   'Design No',
//   'Pcs',
//   'PT Wt',
//   'PT Purity',
//   'PT Purity Wt',
//   'PT999Rate (without GST)',
//   'PT Value',
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Rate',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Wt',
//   'ColorStone Rate',
//   'ColorStone Amount',
//   'Platinum Mc Type',
//   'Platinum Mc Rate',
//   'Platinum Mc Amount',
//   'Platinum Wastage Type',
//   'Platinum Wastage Weight',
//   'Platinum Wastage Amount',
//   'Diamond Certificate Type',
//   'Diamond Certificate GST',
//   'Diamond Certificate Qty',
//   'Diamond Certificate Rate',
//   'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount',
//   'Diamond Certificate Total',
//   'HandleRate',
//   'HandleAmount',
//   'Platinum NetWt',
//   'Total Value',
//   'GST',
//   'Grand Total',
//   'IGI Summary No',
//   'PGI UIN No'
// ];

// // Gold-specific columns (excluding Platinum columns)
// const GOLD_COLUMNS = [
//   // 'Sno',
//   'Product Name',
//   'Metal Type',
//   'Weight Mode',
//   'Design No',
//   'G Karat',
//   'Pcs',
//   'Gold Wt',
//   'Gold Purity',
//   'Gold Purity Wt',
//   'Gold999Rate (without GST)',
//   'Gold Value',
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Rate',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Wt',
//   'ColorStone Rate',
//   'ColorStone Amount',
//   'Gold Mc Type',
//   'Gold Mc Rate',
//   'Gold Mc Amount',
//   'Gold Wastage Type',
//   'Gold Wastage Weight',
//   'Gold Wastage Amount',
//   'Diamond Certificate Type',
//   'Diamond Certificate GST',
//   'Diamond Certificate Qty',
//   'Diamond Certificate Rate',
//   'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount',
//   'Diamond Certificate Total',
//   'Gold HallMark Type',
//   'Gold HallMark GST',
//   'GoldHallMark Qty',
//   'Gold HallMark Rate',
//   'Gold HallMark Taxable Amount',
//   'Gold HallMark Tax Amount',
//   'Gold HallMark Total',
//   'HandleRate',
//   'HandleAmount',
//   'Gold Net Wt',
//   'Total Value',
//   'GST',
//   'Grand Total',
//   'HUID No',
//   'IGI Summary No',
//   'PGI UIN No'
// ];

// // Purchase entry columns for display (backend field names)
// const PURCHASE_COLUMNS = [
//   'id', 'SupplierName', 'invoiceNumber', 'suppCode', 'ProductName', 'MetalType', 'WtMode', 'DesignNo', 
//   'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue', 
//   'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
//   'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
//   'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount', 
//   'GoMcType', 'GoMcRate', 'GoMcAmount', 
//   'PTMcType', 'PTMcRate', 'PTMcAmount', 
//   'WastageType', 'WastageWeight', 'WastageAmt',
//   'PTWastageType','PTWastageWeight','PTWastageAmt',
//   'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt','certTaxAmt', 'CertTotal',
//   'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt','HmTaxAmt', 'HMTotal', 
//   'HandleRate', 'HandleAmount',
//   'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID','IgiSummaryNo','PgiUinNo'
// ];


// // Helper: Get default value based on data type - RETURN NULL FOR OPTIONAL EMPTY FIELDS
// const getDefaultValue = (fieldName, value) => {
//   // If value exists and is not empty string, return it
//   if (value !== null && value !== undefined && value !== '') {
//     return value;
//   }
  
//   const dataType = FIELD_DATA_TYPES[fieldName];
  
//   // Required string fields that should never be null
//   const requiredStringFields = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
  
//   switch (dataType) {
//     case 'int':
//       return 0;
//     case 'decimal':
//       return 0;
//     case 'string':
//       // Return null for optional string fields, empty string for required fields
//       return requiredStringFields.includes(fieldName) ? '' : null;
//     default:
//       return null;
//   }
// };


// // Helper: Validate data type
// const validateDataType = (fieldName, value, rowIndex) => {
//   // Skip validation for empty values (will use default)
//   if (value === null || value === undefined || value === '') {
//     return { isValid: true, error: null };
//   }
  
//   const dataType = FIELD_DATA_TYPES[fieldName];
  
//   switch (dataType) {
//     case 'int':
//       const intValue = Number(value);
//       if (isNaN(intValue) || !Number.isInteger(intValue)) {
//         return {
//           isValid: false,
//           error: {
//             row: rowIndex,
//             field: fieldName,
//             value: value,
//             expectedType: 'Integer',
//             message: `Invalid integer value: "${value}"`
//           }
//         };
//       }
//       break;
      
//     case 'decimal':
//       const decimalValue = Number(value);
//       if (isNaN(decimalValue)) {
//         return {
//           isValid: false,
//           error: {
//             row: rowIndex,
//             field: fieldName,
//             value: value,
//             expectedType: 'Decimal/Number',
//             message: `Invalid decimal value: "${value}"`
//           }
//         };
//       }
//       break;
      
//     case 'string':
//       // String is always valid, just convert to string
//       break;
      
//     default:
//       break;
//   }
  
//   return { isValid: true, error: null };
// };


// // Helper: Format numbers
// const formatNumber = (v, decimals = 2) => {
//   if (v === null || v === undefined || v === '') return '';
//   const n = Number(v);
//   if (Number.isNaN(n)) return v;
//   return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
// };


// // Helper: Map Excel headers (Display Names) to backend field names with default values
// const mapExcelHeadersToBackend = (excelRow, rowIndex, validationErrors) => {
//   const mappedRow = {};
  
//   Object.keys(excelRow).forEach(excelHeader => {
//     const backendField = COLUMN_HEADER_MAP[excelHeader] || excelHeader;
//     const value = excelRow[excelHeader];
    
//     // Validate data type
//     const validation = validateDataType(backendField, value, rowIndex);
//     if (!validation.isValid) {
//       validationErrors.push(validation.error);
//     }
    
//     // Set value with default if empty
//     mappedRow[backendField] = getDefaultValue(backendField, value);
//   });
  
//   return mappedRow;
// };

// // Validation Errors Table Component
// const ValidationErrorsTable = ({ errors }) => (
//   <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
//     <div className="flex items-center gap-2 mb-3">
//       <XCircle className="w-5 h-5 text-red-600" />
//       <h3 className="font-semibold text-red-900">Data Type Validation Errors ({errors.length})</h3>
//     </div>
//     <div className="overflow-auto max-h-96 border rounded bg-white">
//       <table className="min-w-full text-sm">
//         <thead className="bg-red-100 sticky top-0">
//           <tr>
//             <th className="border border-red-200 px-3 py-2 text-left">#</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Row</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Field Name</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Invalid Value</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Expected Type</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Error Message</th>
//           </tr>
//         </thead>
//         <tbody>
//           {errors.map((err, idx) => (
//             <tr key={idx} className="hover:bg-red-50">
//               <td className="border border-red-200 px-3 py-2 text-center">{idx + 1}</td>
//               <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 7}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-blue-600">{err.field}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-red-600">{String(err.value)}</td>
//               <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
//               <td className="border border-red-200 px-3 py-2">{err.message}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
//       <p className="text-sm text-yellow-800">
//         <strong>⚠️ Note:</strong> Please fix these errors in your Excel file and re-upload. 
//         Make sure the data types match: Integers for counts, Decimals for weights/amounts, and Text for names/codes.
//       </p>
//     </div>
//   </div>
// );


// // Sub-component: Purchase Entry Table
// const PurchaseEntryTable = ({ data, loading, onRowClick }) => (
//   <div className="overflow-auto bg-white border rounded">
//     <table className="min-w-full text-sm">
//       {data.length > 0 && (
//         <thead>
//           <tr className="bg-gray-100 sticky top-0">
//             {PURCHASE_COLUMNS.map(col => (
//               <th key={col} className="border px-2 py-1 text-left">{col}</th>
//             ))}
//             <th className="border px-2 py-1">Actions</th>
//           </tr>
//         </thead>
//       )}
//       <tbody>
//         {loading ? (
//           <tr>
//             <td colSpan={PURCHASE_COLUMNS.length + 1} className="p-6 text-center">Loading designs...</td>
//           </tr>
//         ) : data.length === 0 ? (
//           <tr>
//             <td colSpan={PURCHASE_COLUMNS.length + 1} className="p-6 text-center">No data</td>
//           </tr>
//         ) : data.map((row) => (
//           <tr key={row.id ?? Math.random()} className="hover:bg-gray-50 align-top">
//             {PURCHASE_COLUMNS.map(col => {
//               let val = row[col];
//               if (col === 'id') {
//                 return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
//               }
//               if (typeof val === 'number') {
//                 const threeDecimals = ['GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight'];
//                 const decimals = threeDecimals.includes(col) ? 3 : 2;
//                 val = formatNumber(val, decimals);
//               } else if (val === null || val === undefined) val = '';
//               return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
//             })}
//             <td className="border px-2 py-1">
//               <button onClick={() => onRowClick(row)} className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700">
//                 <Eye className="w-4 h-4" /> View
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );


// // Sub-component: Diamond Table
// const DiamondTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           <th className="p-2 border">#</th>
//           <th className="p-2 border">STONE FROM</th>
//           <th className="p-2 border">DiamondShape</th>
//           <th className="p-2 border">NoOfStones</th>
//           <th className="p-2 border">Carat</th>
//           <th className="p-2 border">Rate</th>
//           <th className="p-2 border">Value</th>
//           <th className="p-2 border">Weight</th>
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ?
//           <tr><td colSpan={8} className="text-center p-4">No diamond records.</td></tr> :
//           records.map((d, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-2 border text-center">{idx + 1}</td>
//               <td className="p-2 border"><input value={d.STONE_FROM || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//             </tr>
//           ))
//         }
//       </tbody>
//     </table>
//   </div>
// );

// // Sub-component: Color Stone Table
// const ColorStoneTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           <th className="p-2 border">#</th>
//           <th className="p-2 border">csShape</th>
//           <th className="p-2 border">NoOfStones</th>
//           <th className="p-2 border">Carat</th>
//           <th className="p-2 border">Rate</th>
//           <th className="p-2 border">Value</th>
//           <th className="p-2 border">Weight</th>
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ?
//           <tr><td colSpan={7} className="text-center p-4">No color stone records.</td></tr> :
//           records.map((c, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-2 border text-center">{idx + 1}</td>
//               <td className="p-2 border"><input value={c.csShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//             </tr>
//           ))
//         }
//       </tbody>
//     </table>
//   </div>
// );


// // Sub-component: Entry Detail Modal
// const EntryDetailModal = ({ entry, diamonds, colorStones, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
//     <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
//     <div className="relative z-60 w-[95%] max-w-6xl bg-white rounded shadow-lg overflow-auto max-h-[85vh]">
//       <div className="p-4 border-b flex justify-between items-center">
//         <h3 className="text-lg font-bold">Entry Details — ID: {entry.id} | {entry.DesignNo}</h3>
//         <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Close</button>
//       </div>
//       <div className="p-4 space-y-6">
//         <section>
//           <h4 className="font-semibold mb-2">Purchase Entry</h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <div>
//               <label className="text-xs text-gray-600">Supplier Name</label>
//               <input value={entry.SupplierName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Invoice Number</label>
//               <input value={entry.invoiceNumber || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Product Name</label>
//               <input value={entry.ProductName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Design No</label>
//               <input value={entry.DesignNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Metal Type</label>
//               <input value={entry.MetalType || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Grand Total</label>
//               <input value={entry.GrandTotal ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Gold Weight</label>
//               <input value={entry.GoldWt ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">IGI Summary No</label>
//               <input value={entry.IgiSummaryNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">PGI UIN No</label>
//               <input value={entry.PgiUinNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//           </div>
//         </section>
//         <section className="space-y-3">
//           <h4 className="font-semibold">Diamonds ({diamonds.length})</h4>
//           <DiamondTable records={diamonds} />
//         </section>
//         <section className="space-y-3">
//           <h4 className="font-semibold">Color Stones ({colorStones.length})</h4>
//           <ColorStoneTable records={colorStones} />
//         </section>
//       </div>
//     </div>
//   </div>
// );


// const DiamondManager = () => {
//   const [suppliers, setSuppliers] = useState({});
//   const [data, setData] = useState([]);
//   const [uploadedData, setUploadedData] = useState(null);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [dataTypeErrors, setDataTypeErrors] = useState([]);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [diamonds, setDiamonds] = useState([]);
//   const [colorStones, setColorStones] = useState([]);
//   const fileInputRef = useRef(null);
//   const [showTemplateMenu, setShowTemplateMenu] = useState(false);
//   const { user, companyName } = useContext(DashBoardContext);


//   useEffect(() => { 
//     if (!user) return;
//     const fetchSuppliers = async () => {
//       try {
//         const res = await axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user });
//         setSuppliers(res.data);
//       } catch (err) {
//         console.error('Error fetching suppliers:', err);
//       }
//     };
//     fetchSuppliers();
//   }, [user]);

//   // Generate Excel template - STANDARD (With Gold + Platinum)
//   const generateStandardTemplate = () => {
//     const wb = XLSX.utils.book_new();
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
//       ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
//       ['Invoice Number:', '',],
//       ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
//       [],
//       Object.keys(COLUMN_HEADER_MAP)
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(Object.keys(COLUMN_HEADER_MAP).length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       // 'Sno': '',
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       // 'Sno': '',
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(Object.keys(COLUMN_HEADER_MAP).length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     if (ws1['A1']) {
//       ws1['A1'].s = {
//         font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "4472C4" } },
//         alignment: { horizontal: "center", vertical: "center" }
//       };
//     }

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Standard_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Standard template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };


//   // Generate Excel template - PLATINUM ONLY
//   const generatePlatinumTemplate = () => {
//     const wb = XLSX.utils.book_new();
//     const platinumColumns = PT_COLUMNS;
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || ''],
//       ['Supplier Code:', suppliers?.Suppcode || ''],
//       ['Invoice Number:', ''],
//       [],
//       platinumColumns
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(platinumColumns.length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       // 'Sno': '',
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       // 'Sno': '',
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(platinumColumns.length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Platinum_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Platinum template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };

//   // Generate Excel template - GOLD ONLY
//   const generateGoldTemplate = () => {
//     const wb = XLSX.utils.book_new();
//     const goldColumns = GOLD_COLUMNS;
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || ''],
//       ['Supplier Code:', suppliers?.Suppcode || ''],
//       ['Invoice Number:', ''],
//       [],
//       goldColumns
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(goldColumns.length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       'Sno': '',
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       'Sno': '',
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(goldColumns.length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     if (ws1['A1']) {
//       ws1['A1'].s = {
//         font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "FFD700" } },
//         alignment: { horizontal: "center", vertical: "center" }
//       };
//     }

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Gold_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Gold template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };


//   // Validate uploaded data
//   const validateData = (mainData, diamondData, csData) => {
//     const errors = [];
    
//     mainData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
      
//       if (!row.SupplierName) errors.push(`Row ${idx + 7}: SupplierName is required (check common field)`);
//       if (!row.ProductName) errors.push(`Row ${idx + 7}: ProductName is required`);
//       if (!row.DesignNo) errors.push(`Row ${idx + 7}: DesignNo is required`);
//     });

//     const purchaseIdSet = new Set();
//     mainData.forEach((row) => { 
//       if (row.id || row.id === 0) purchaseIdSet.add(String(row.id)); 
//     });

//     diamondData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
//       if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
//       if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
//         errors.push(`Diamond Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
//       }
//     });

//     csData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
//       if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Color Stone Row ${idx + 2}: Entry Id required`);
//       if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
//         errors.push(`Color Stone Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
//       }
//     });

//     return errors;
//   };

//   // Handle file upload with validation
//   const handleFileUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const wb = XLSX.read(evt.target.result, { type: 'binary' });
//         const mainSheet = wb.Sheets['Purchase Entry'] || wb.Sheets[wb.SheetNames[0]];
//         const diamondSheet = wb.Sheets['Diamond Details'] || wb.Sheets[wb.SheetNames[1]];
//         const csSheet = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

//         if (!mainSheet) {
//           setUploadStatus({ type: 'error', message: 'Purchase Entry sheet not found' });
//           return;
//         }

//         // Extract common fields
//         const supplierName = mainSheet['B2'] ? mainSheet['B2'].v : '';
//         const supplierCode = mainSheet['B3'] ? mainSheet['B3'].v : '';
//         const invoiceNumber = mainSheet['B4'] ? mainSheet['B4'].v +'|'+ (mainSheet['B5'] ? mainSheet['B5'].v : '') : '';

//         // Read data starting from row 6
//         const mainDataRaw = XLSX.utils.sheet_to_json(mainSheet, { 
//           range: 5,
//           defval: '' 
//         });
        
//         const diamondDataRaw = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
//         const csDataRaw = csSheet ? XLSX.utils.sheet_to_json(csSheet, { defval: '' }) : [];

//         // Validate data types and map with defaults
//         const typeErrors = [];
//         const mainData = mainDataRaw.map((row, idx) => {
//           const mapped = mapExcelHeadersToBackend(row, idx, typeErrors);
//           mapped.SupplierName = supplierName || '';
//           mapped.suppCode = supplierCode || '';
//           mapped.invoiceNumber = invoiceNumber || '';
//           return mapped;
//         });

//         // If there are data type errors, show them and stop
//         if (typeErrors.length > 0) {
//           setDataTypeErrors(typeErrors);
//           setValidationErrors([]);
//           setUploadStatus({ type: 'error', message: `Data type validation failed (${typeErrors.length} errors)` });
//           setUploadedData(null);
//           setData([]);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }
        
//         // Process diamond data with defaults
//         const diamondData = diamondDataRaw.map(row => {
//           const mapped = {};
//           Object.keys(row).forEach(key => {
//             if (key === 'Sno') {
//               mapped.id = row[key] || 0;
//             } else if (key === 'Entry Id') {
//               mapped.purchaseEntryId = row[key] || 0;
//             } else if (key === 'Stone From') {
//               mapped.STONE_FROM = row[key] || null;
//             } else if (key === 'Diamond Shape') {
//               mapped.DiamondShape = row[key] || null;
//             } else if (key === 'No Of Stones') {
//               mapped.NoOfStones = row[key] || 0;
//             } else if (key === 'Carat') {
//               mapped.Carat = row[key] || 0;
//             } else if (key === 'Rate') {
//               mapped.Rate = row[key] || 0;
//             } else if (key === 'Value') {
//               mapped.Value = row[key] || 0;
//             } else if (key === 'Weight') {
//               mapped.Weight = row[key] || 0;
//             } else {
//               mapped[key] = row[key];
//             }
//           });
//           return mapped;
//         });
        
//         // Process color stone data with defaults
//         const csData = csDataRaw.map(row => {
//           const mapped = {};
//           Object.keys(row).forEach(key => {
//             if (key === 'Sno') {
//               mapped.id = row[key] || 0;
//             } else if (key === 'Entry Id') {
//               mapped.purchaseEntryId = row[key] || 0;
//             } else if (key === 'Color Stone Shape') {
//               mapped.csShape = row[key] || null;
//             } else if (key === 'No Of Stones') {
//               mapped.NoOfStones = row[key] || 0;
//             } else if (key === 'Carat') {
//               mapped.Carat = row[key] || 0;
//             } else if (key === 'Rate') {
//               mapped.Rate = row[key] || 0;
//             } else if (key === 'Value') {
//               mapped.Value = row[key] || 0;
//             } else if (key === 'Weight') {
//               mapped.Weight = row[key] || 0;
//             } else {
//               mapped[key] = row[key];
//             }
//           });
//           return mapped;
//         });

//         // Validate data
//         const errors = validateData(mainData, diamondData, csData);
//         if (errors.length > 0) {
//           setValidationErrors(errors);
//           setDataTypeErrors([]);
//           setUploadStatus({ type: 'error', message: `Validation failed (${errors.length} errors)` });
//           setUploadedData(null);
//           setData([]);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }

//         // Group data
//         const grouped = mainData
//           .filter(r => {
//             const allEmpty = Object.entries(r).every(([key, val]) => {
//               if (key === 'SupplierName' || key === 'suppCode' || key === 'invoiceNumber') return true;
//               return val === '' || val === null || val === undefined || val === 0;
//             });
//             return !allEmpty;
//           })
//           .map(entry => {
//             const idStr = String(entry.id ?? entry.id);
//             const diamondsFor = diamondData.filter(d => String(d.purchaseEntryId) === idStr && Object.values(d).some(v => v !== '' && v !== 0 && v !== null));
//             const csFor = csData.filter(c => String(c.purchaseEntryId) === idStr && Object.values(c).some(v => v !== '' && v !== 0 && v !== null));
//             return { ...entry, diamonds: diamondsFor, colorStones: csFor };
//           });

//         setUploadedData({ mainData, diamondData, csData, groupedData: grouped });
//         setData(grouped);
//         setValidationErrors([]);
//         setDataTypeErrors([]);
//         setUploadStatus({ 
//           type: 'success', 
//           message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` 
//         });
        
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       } catch (error) {
//         console.error(error);
//         setUploadStatus({ type: 'error', message: 'Error reading file — check format' });
//         setDataTypeErrors([]);
//         setValidationErrors([]);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };


//   // Save data to backend
//   const handleSave = async () => {
//     if (!data.length) return;
//     setLoading(true);
//     try {
//       const response = await axios.post(`${DIA_API}/saveDiamondEntries`, data);
//       setUploadStatus({ type: 'success', message: '✓ Data saved successfully!' });
//       setTimeout(() => resetForm(), 1500);
//     } catch (error) {
//       console.error('Save error:', error);
//       const errorMsg = error.response?.data?.result || error.message || 'Error saving data!';
//       setUploadStatus({ type: 'error', message: `✗ ${errorMsg}` });
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Reset form
//   const resetForm = () => {
//     setData([]);
//     setUploadedData(null);
//     setValidationErrors([]);
//     setDataTypeErrors([]);
//     setUploadStatus(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };


//   // Open modal and fetch details
//   const openDetails = (row) => {
//     setSelectedEntry(row);
//     setDiamonds(row.diamonds || []);
//     setColorStones(row.colorStones || []);
//     setShowModal(true);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-semibold flex items-center gap-2">
//             <FileSpreadsheet className="w-6 h-6" /> Diamond Purchase Entries
//           </h2>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <button 
//                 onClick={() => setShowTemplateMenu(!showTemplateMenu)}
//                 className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700"
//               >
//                 <Download className="w-4 h-4" /> Download Template
//               </button>
              
//               {showTemplateMenu && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
//                   <div className="py-2">
//                     <button
//                       onClick={generateStandardTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-blue-600" />
//                       <div>
//                         <div className="font-medium">Standard Template</div>
//                         <div className="text-xs text-gray-500">Gold + Platinum</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={generatePlatinumTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-purple-600" />
//                       <div>
//                         <div className="font-medium">Platinum Only</div>
//                         <div className="text-xs text-gray-500">No Gold columns</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={generateGoldTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-yellow-600" />
//                       <div>
//                         <div className="font-medium">Gold Only Template</div>
//                         <div className="text-xs text-gray-500">No Platinum columns</div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700">
//               <Upload className="w-4 h-4" /> Upload Filled Excel
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".xlsx,.xls"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         </div>

//         {showTemplateMenu && (
//           <div 
//             className="fixed inset-0 z-40" 
//             onClick={() => setShowTemplateMenu(false)}
//           />
//         )}

//         {uploadStatus && (
//           <div className={`p-3 rounded flex items-center gap-2 ${uploadStatus.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
//             {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             <span className="font-medium">{uploadStatus.message}</span>
//           </div>
//         )}

//         {dataTypeErrors.length > 0 && (
//           <ValidationErrorsTable errors={dataTypeErrors} />
//         )}

//         {validationErrors.length > 0 && (
//           <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
//             <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2">
//               <AlertCircle className="w-5 h-5" />
//               Validation Errors ({validationErrors.length})
//             </div>
//             <div className="max-h-48 overflow-y-auto text-sm space-y-1">
//               {validationErrors.map((err, i) => <div key={i} className="text-yellow-800">• {err}</div>)}
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <LoadingState />
//         ) : data.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <PurchaseEntryTable
//             data={data}
//             loading={false}
//             onRowClick={openDetails}
//           />
//         )}

//         {data.length > 0 && (
//           <div className="mt-4 flex justify-end gap-3">
//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
//                 loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save to Database'}
//             </button>
//             <button
//               onClick={resetForm}
//               className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600"
//             >
//               <RefreshCw className="w-4 h-4" /> Reset
//             </button>
//           </div>
//         )}

//         {showModal && selectedEntry && (
//           <EntryDetailModal
//             entry={selectedEntry}
//             diamonds={diamonds}
//             colorStones={colorStones}
//             onClose={() => setShowModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };


// export default DiamondManager;


// import React, { useEffect, useState, useRef, useContext } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   FileSpreadsheet, Eye, Download, Upload, AlertCircle, CheckCircle, Save, RefreshCw, Loader2, XCircle
// } from 'lucide-react';
// import { DIA_API } from '../../../config/configData';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';


// // Loading State Component
// const LoadingState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-8">
//       <div className="absolute inset-0 animate-ping opacity-20">
//         <div className="w-24 h-24 bg-indigo-500 rounded-full"></div>
//       </div>
//       <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
//         <Loader2 className="w-12 h-12 text-white animate-spin" />
//       </div>
//     </div>
//     <div className="text-center space-y-3">
//       <h3 className="text-2xl font-bold text-gray-900">Loading Purchase Entries</h3>
//       <p className="text-gray-500 max-w-md">Processing your Excel file and organizing the data...</p>
//       <div className="flex items-center justify-center gap-2 mt-6">
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//         <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//       </div>
//     </div>
//   </div>
// );


// // Empty State Component
// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-8">
//       <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
//         <div className="transform -rotate-3">
//           <FileSpreadsheet className="w-16 h-16 text-gray-400" />
//         </div>
//       </div>
//       <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg ">
//         <Upload className="w-6 h-6 text-white" />
//       </div>
//     </div>
//     <div className="text-center space-y-4 max-w-md">
//       <h3 className="text-2xl font-bold text-gray-900">No Purchase Entries Yet</h3>
//     </div>
//   </div>
// );


// // Column Header Mapping: Display Name -> Backend Field Name
// const COLUMN_HEADER_MAP = {
//   'Entry Id': 'id',
//   'Product Name': 'ProductName',
//   'Metal Type': 'MetalType',
//   'Weight Mode': 'WtMode',
//   'Design No': 'DesignNo',
//   'G Karat': 'GCarat',
//   'Pcs': 'PCS',
//   'Gold Wt': 'GoldWt',
//   'Gold Purity': 'GoldPurity',
//   'Gold Purity Wt': 'GoldPurityWt',
//   'Gold999Rate (without GST)': 'Gold999Rate',
//   'Gold Value': 'GoldValue',
//   'PT Wt': 'PTWt',
//   'PT Purity': 'PTPurity',
//   'PT Purity Wt': 'PTPurityWt',
//   'PT999Rate (without GST)': 'PT999Rate',
//   'PT Value': 'PTValue',
//   'No of Stones': 'NoofStone',
//   'Diamond Carat': 'DCarat',
//   'Diamond Rate': 'DiamondRate',
//   'Diamond Value': 'DiamondValue',
//   'Diamond Wt': 'DiamondWt',
//   'ColorStone PCS': 'ClrStnPCS',
//   'ColorStone Carat': 'CLSCarat',
//   'ColorStone Wt': 'ClrStnWt',
//   'ColorStone Rate': 'ClrStnRate',
//   'ColorStone Amount': 'CSAmount',
//   'Gold Mc Type': 'GoMcType',
//   'Gold Mc Rate': 'GoMcRate',
//   'Gold Mc Amount': 'GoMcAmount',
//   'Platinum Mc Type': 'PTMcType',
//   'Platinum Mc Rate': 'PTMcRate',
//   'Platinum Mc Amount': 'PTMcAmount',
//   'Gold Wastage Type': 'WastageType',
//   'Gold Wastage Weight': 'WastageWeight',
//   'Gold Wastage Amount': 'WastageAmt',
//   'Platinum Wastage Type': 'PTWastageType',
//   'Platinum Wastage Weight': 'PTWastageWeight',
//   'Platinum Wastage Amount': 'PTWastageAmt',
//   'Diamond Certificate Type': 'CertType',
//   'Diamond Certificate GST': 'CertGST',
//   'Diamond Certificate Qty': 'CertQty',
//   'Diamond Certificate Rate': 'CertRate',
//   'Diamond Certificate Taxable Amount': 'CertTaxableAmt',
//   'Diamond Certificate Tax Amount': 'certTaxAmt',
//   'Diamond Certificate Total': 'CertTotal',
//   'Gold HallMark Type': 'HallMarkType',
//   'Gold HallMark GST': 'HMGST',
//   'GoldHallMark Qty': 'HMQty',
//   'Gold HallMark Rate': 'HMRate',
//   'Gold HallMark Taxable Amount': 'HMTaxableAmt',
//   'Gold HallMark Tax Amount': 'HmTaxAmt',
//   'Gold HallMark Total': 'HMTotal',
//   'HandleRate': 'HandleRate',
//   'HandleAmount': 'HandleAmount',
//   'Gold Net Wt': 'GNetWt',
//   'Platinum NetWt': 'PNetWt',
//   'Total Value': 'TotalValue',
//   'GST': 'GST',
//   'Grand Total': 'GrandTotal',
//   'HUID No': 'HUID',
//   'IGI Summary No': 'IgiSummaryNo',
//   'PGI UIN No': 'PgiUinNo'
// };

// // Field Data Types Mapping (based on SQL procedure)
// const FIELD_DATA_TYPES = {
//   // NVARCHAR fields
//   'SupplierName': 'string',
//   'ProductName': 'string',
//   'MetalType': 'string',
//   'WtMode': 'string',
//   'DesignNo': 'string',
//   'GoMcType': 'string',
//   'WastageType': 'string',
//   'CertType': 'string',
//   'HallMarkType': 'string',
//   'HUID': 'string',
//   'suppCode': 'string',
//   'PTMcType': 'string',
//   'PTWastageType': 'string',
//   'IgiSummaryNo': 'string',
//   'PgiUinNo': 'string',
//   'invoiceNumber': 'string',
//   'invoiceDate': 'string',
  
//   // INT fields
//   'id': 'int',
//   'PCS': 'int',
//   'HMQty': 'int',
//   'NoofStone': 'int',
//   'ClrStnPCS': 'int',
  
//   // DECIMAL fields
//   'GCarat': 'decimal',
//   'GoldWt': 'decimal',
//   'GoldPurity': 'decimal',
//   'GoldPurityWt': 'decimal',
//   'Gold999Rate': 'decimal',
//   'GoldValue': 'decimal',
//   'PTWt': 'decimal',
//   'PTPurity': 'decimal',
//   'PTPurityWt': 'decimal',
//   'PT999Rate': 'decimal',
//   'PTValue': 'decimal',
//   'GoMcRate': 'decimal',
//   'GoMcAmount': 'decimal',
//   'WastageWeight': 'decimal',
//   'WastageAmt': 'decimal',
//   'CertGST': 'decimal',
//   'CertQty': 'decimal',
//   'CertRate': 'decimal',
//   'CertTaxableAmt': 'decimal',
//   'CertTotal': 'decimal',
//   'HMGST': 'decimal',
//   'HMRate': 'decimal',
//   'HMTaxableAmt': 'decimal',
//   'HMTotal': 'decimal',
//   'HandleRate': 'decimal',
//   'HandleAmount': 'decimal',
//   'GNetWt': 'decimal',
//   'PNetWt': 'decimal',
//   'TotalValue': 'decimal',
//   'GST': 'decimal',
//   'GrandTotal': 'decimal',
//   'PTMcRate': 'decimal',
//   'PTMcAmount': 'decimal',
//   'PTWastageWeight': 'decimal',
//   'PTWastageAmt': 'decimal',
//   'certTaxAmt': 'decimal',
//   'HmTaxAmt': 'decimal',
//   'DCarat': 'decimal',
//   'DiamondRate': 'decimal',
//   'DiamondValue': 'decimal',
//   'DiamondWt': 'decimal',
//   'CLSCarat': 'decimal',
//   'ClrStnWt': 'decimal',
//   'ClrStnRate': 'decimal',
//   'CSAmount': 'decimal',
// };

// // Platinum-specific columns to exclude from Gold template
// const PT_COLUMNS = [
//   'Product Name',
//   'Metal Type',
//   'Weight Mode',
//   'Design No',
//   'Pcs',
//   'PT Wt',
//   'PT Purity',
//   'PT Purity Wt',
//   'PT999Rate (without GST)',
//   'PT Value',
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Rate',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Wt',
//   'ColorStone Rate',
//   'ColorStone Amount',
//   'Platinum Mc Type',
//   'Platinum Mc Rate',
//   'Platinum Mc Amount',
//   'Platinum Wastage Type',
//   'Platinum Wastage Weight',
//   'Platinum Wastage Amount',
//   'Diamond Certificate Type',
//   'Diamond Certificate GST',
//   'Diamond Certificate Qty',
//   'Diamond Certificate Rate',
//   'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount',
//   'Diamond Certificate Total',
//   'HandleRate',
//   'HandleAmount',
//   'Platinum NetWt',
//   'Total Value',
//   'GST',
//   'Grand Total',
//   'IGI Summary No',
//   'PGI UIN No'
// ];

// // Gold-specific columns (excluding Platinum columns)
// const GOLD_COLUMNS = [
//   'Product Name',
//   'Metal Type',
//   'Weight Mode',
//   'Design No',
//   'G Karat',
//   'Pcs',
//   'Gold Wt',
//   'Gold Purity',
//   'Gold Purity Wt',
//   'Gold999Rate (without GST)',
//   'Gold Value',
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Rate',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Wt',
//   'ColorStone Rate',
//   'ColorStone Amount',
//   'Gold Mc Type',
//   'Gold Mc Rate',
//   'Gold Mc Amount',
//   'Gold Wastage Type',
//   'Gold Wastage Weight',
//   'Gold Wastage Amount',
//   'Diamond Certificate Type',
//   'Diamond Certificate GST',
//   'Diamond Certificate Qty',
//   'Diamond Certificate Rate',
//   'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount',
//   'Diamond Certificate Total',
//   'Gold HallMark Type',
//   'Gold HallMark GST',
//   'GoldHallMark Qty',
//   'Gold HallMark Rate',
//   'Gold HallMark Taxable Amount',
//   'Gold HallMark Tax Amount',
//   'Gold HallMark Total',
//   'HandleRate',
//   'HandleAmount',
//   'Gold Net Wt',
//   'Total Value',
//   'GST',
//   'Grand Total',
//   'HUID No',
//   'IGI Summary No',
//   'PGI UIN No'
// ];

// // Purchase entry columns for display (backend field names)
// const PURCHASE_COLUMNS = [
//   'id', 'SupplierName', 'invoiceNumber', 'invoiceDate', 'suppCode', 'ProductName', 'MetalType', 'WtMode', 'DesignNo', 
//   'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue', 
//   'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
//   'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
//   'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount', 
//   'GoMcType', 'GoMcRate', 'GoMcAmount', 
//   'PTMcType', 'PTMcRate', 'PTMcAmount', 
//   'WastageType', 'WastageWeight', 'WastageAmt',
//   'PTWastageType','PTWastageWeight','PTWastageAmt',
//   'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt','certTaxAmt', 'CertTotal',
//   'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt','HmTaxAmt', 'HMTotal', 
//   'HandleRate', 'HandleAmount',
//   'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID','IgiSummaryNo','PgiUinNo'
// ];


// // Helper: Get default value based on data type - RETURN NULL FOR OPTIONAL EMPTY FIELDS
// const getDefaultValue = (fieldName, value) => {
//   // If value exists and is not empty string, return it
//   if (value !== null && value !== undefined && value !== '') {
//     return value;
//   }
  
//   const dataType = FIELD_DATA_TYPES[fieldName];
  
//   // Required string fields that should never be null
//   const requiredStringFields = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
  
//   switch (dataType) {
//     case 'int':
//       return 0;
//     case 'decimal':
//       return 0;
//     case 'string':
//       // Return null for optional string fields, empty string for required fields
//       return requiredStringFields.includes(fieldName) ? '' : null;
//     default:
//       return null;
//   }
// };

// // Helper: Validate data type
// const validateDataType = (fieldName, value, rowIndex) => {
//   // Skip validation for empty values (will use default)
//   if (value === null || value === undefined || value === '') {
//     return { isValid: true, error: null };
//   }
  
//   const dataType = FIELD_DATA_TYPES[fieldName];
  
//   switch (dataType) {
//     case 'int':
//       const intValue = Number(value);
//       if (isNaN(intValue) || !Number.isInteger(intValue)) {
//         return {
//           isValid: false,
//           error: {
//             row: rowIndex,
//             field: fieldName,
//             value: value,
//             expectedType: 'Integer',
//             message: `Invalid integer value: "${value}"`
//           }
//         };
//       }
//       break;
      
//     case 'decimal':
//       const decimalValue = Number(value);
//       if (isNaN(decimalValue)) {
//         return {
//           isValid: false,
//           error: {
//             row: rowIndex,
//             field: fieldName,
//             value: value,
//             expectedType: 'Decimal/Number',
//             message: `Invalid decimal value: "${value}"`
//           }
//         };
//       }
//       break;
      
//     case 'string':
//       // String is always valid, just convert to string
//       break;
      
//     default:
//       break;
//   }
  
//   return { isValid: true, error: null };
// };


// // Helper: Format numbers
// const formatNumber = (v, decimals = 2) => {
//   if (v === null || v === undefined || v === '') return '';
//   const n = Number(v);
//   if (Number.isNaN(n)) return v;
//   return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
// };


// // Helper: Map Excel headers (Display Names) to backend field names with default values
// const mapExcelHeadersToBackend = (excelRow, rowIndex, validationErrors) => {
//   const mappedRow = {};
  
//   Object.keys(excelRow).forEach(excelHeader => {
//     const backendField = COLUMN_HEADER_MAP[excelHeader] || excelHeader;
//     const value = excelRow[excelHeader];
    
//     // Validate data type
//     const validation = validateDataType(backendField, value, rowIndex);
//     if (!validation.isValid) {
//       validationErrors.push(validation.error);
//     }
    
//     // Set value with default if empty
//     mappedRow[backendField] = getDefaultValue(backendField, value);
//   });
  
//   return mappedRow;
// };

// // Validation Errors Table Component
// const ValidationErrorsTable = ({ errors }) => (
//   <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
//     <div className="flex items-center gap-2 mb-3">
//       <XCircle className="w-5 h-5 text-red-600" />
//       <h3 className="font-semibold text-red-900">Data Type Validation Errors ({errors.length})</h3>
//     </div>
//     <div className="overflow-auto max-h-96 border rounded bg-white">
//       <table className="min-w-full text-sm">
//         <thead className="bg-red-100 sticky top-0">
//           <tr>
//             <th className="border border-red-200 px-3 py-2 text-left">#</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Row</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Field Name</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Invalid Value</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Expected Type</th>
//             <th className="border border-red-200 px-3 py-2 text-left">Error Message</th>
//           </tr>
//         </thead>
//         <tbody>
//           {errors.map((err, idx) => (
//             <tr key={idx} className="hover:bg-red-50">
//               <td className="border border-red-200 px-3 py-2 text-center">{idx + 1}</td>
//               <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 8}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-blue-600">{err.field}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-red-600">{String(err.value)}</td>
//               <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
//               <td className="border border-red-200 px-3 py-2">{err.message}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
//       <p className="text-sm text-yellow-800">
//         <strong>⚠️ Note:</strong> Please fix these errors in your Excel file and re-upload. 
//         Make sure the data types match: Integers for counts, Decimals for weights/amounts, and Text for names/codes.
//       </p>
//     </div>
//   </div>
// );


// // Sub-component: Purchase Entry Table
// const PurchaseEntryTable = ({ data, loading, onRowClick }) => (
//   <div className="overflow-auto bg-white border rounded">
//     <table className="min-w-full text-sm">
//       {data.length > 0 && (
//         <thead>
//           <tr className="bg-gray-100 sticky top-0">
//             {PURCHASE_COLUMNS.map(col => (
//               <th key={col} className="border px-2 py-1 text-left">{col}</th>
//             ))}
//             <th className="border px-2 py-1">Actions</th>
//           </tr>
//         </thead>
//       )}
//       <tbody>
//         {loading ? (
//           <tr>
//             <td colSpan={PURCHASE_COLUMNS.length + 1} className="p-6 text-center">Loading designs...</td>
//           </tr>
//         ) : data.length === 0 ? (
//           <tr>
//             <td colSpan={PURCHASE_COLUMNS.length + 1} className="p-6 text-center">No data</td>
//           </tr>
//         ) : data.map((row) => (
//           <tr key={row.id ?? Math.random()} className="hover:bg-gray-50 align-top">
//             {PURCHASE_COLUMNS.map(col => {
//               let val = row[col];
//               if (col === 'id') {
//                 return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
//               }
//               if (typeof val === 'number') {
//                 const threeDecimals = ['GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight'];
//                 const decimals = threeDecimals.includes(col) ? 3 : 2;
//                 val = formatNumber(val, decimals);
//               } else if (val === null || val === undefined) val = '';
//               return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
//             })}
//             <td className="border px-2 py-1">
//               <button onClick={() => onRowClick(row)} className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700">
//                 <Eye className="w-4 h-4" /> View
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // Sub-component: Diamond Table
// const DiamondTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           <th className="p-2 border">#</th>
//           <th className="p-2 border">STONE FROM</th>
//           <th className="p-2 border">DiamondShape</th>
//           <th className="p-2 border">NoOfStones</th>
//           <th className="p-2 border">Carat</th>
//           <th className="p-2 border">Rate</th>
//           <th className="p-2 border">Value</th>
//           <th className="p-2 border">Weight</th>
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ?
//           <tr><td colSpan={8} className="text-center p-4">No diamond records.</td></tr> :
//           records.map((d, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-2 border text-center">{idx + 1}</td>
//               <td className="p-2 border"><input value={d.STONE_FROM || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={d.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//             </tr>
//           ))
//         }
//       </tbody>
//     </table>
//   </div>
// );

// // Sub-component: Color Stone Table
// const ColorStoneTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           <th className="p-2 border">#</th>
//           <th className="p-2 border">csShape</th>
//           <th className="p-2 border">NoOfStones</th>
//           <th className="p-2 border">Carat</th>
//           <th className="p-2 border">Rate</th>
//           <th className="p-2 border">Value</th>
//           <th className="p-2 border">Weight</th>
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ?
//           <tr><td colSpan={7} className="text-center p-4">No color stone records.</td></tr> :
//           records.map((c, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-2 border text-center">{idx + 1}</td>
//               <td className="p-2 border"><input value={c.csShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//               <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
//             </tr>
//           ))
//         }
//       </tbody>
//     </table>
//   </div>
// );


// // Sub-component: Entry Detail Modal
// const EntryDetailModal = ({ entry, diamonds, colorStones, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
//     <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
//     <div className="relative z-60 w-[95%] max-w-6xl bg-white rounded shadow-lg overflow-auto max-h-[85vh]">
//       <div className="p-4 border-b flex justify-between items-center">
//         <h3 className="text-lg font-bold">Entry Details — ID: {entry.id} | {entry.DesignNo}</h3>
//         <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Close</button>
//       </div>
//       <div className="p-4 space-y-6">
//         <section>
//           <h4 className="font-semibold mb-2">Purchase Entry</h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             <div>
//               <label className="text-xs text-gray-600">Supplier Name</label>
//               <input value={entry.SupplierName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Invoice Number</label>
//               <input value={entry.invoiceNumber || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Invoice Date</label>
//               <input value={entry.invoiceDate || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Product Name</label>
//               <input value={entry.ProductName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Design No</label>
//               <input value={entry.DesignNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Metal Type</label>
//               <input value={entry.MetalType || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Grand Total</label>
//               <input value={entry.GrandTotal ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">Gold Weight</label>
//               <input value={entry.GoldWt ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">IGI Summary No</label>
//               <input value={entry.IgiSummaryNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//             <div>
//               <label className="text-xs text-gray-600">PGI UIN No</label>
//               <input value={entry.PgiUinNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
//             </div>
//           </div>
//         </section>
//         <section className="space-y-3">
//           <h4 className="font-semibold">Diamonds ({diamonds.length})</h4>
//           <DiamondTable records={diamonds} />
//         </section>
//         <section className="space-y-3">
//           <h4 className="font-semibold">Color Stones ({colorStones.length})</h4>
//           <ColorStoneTable records={colorStones} />
//         </section>
//       </div>
//     </div>
//   </div>
// );

// const DiamondManager = () => {
//   const [suppliers, setSuppliers] = useState({});
//   const [data, setData] = useState([]);
//   const [uploadedData, setUploadedData] = useState(null);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [dataTypeErrors, setDataTypeErrors] = useState([]);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [diamonds, setDiamonds] = useState([]);
//   const [colorStones, setColorStones] = useState([]);
//   const fileInputRef = useRef(null);
//   const [showTemplateMenu, setShowTemplateMenu] = useState(false);
//   const { user, companyName } = useContext(DashBoardContext);


//   useEffect(() => { 
//     if (!user) return;
//     const fetchSuppliers = async () => {
//       try {
//         const res = await axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user });
//         setSuppliers(res.data);
//       } catch (err) {
//         console.error('Error fetching suppliers:', err);
//       }
//     };
//     fetchSuppliers();
//   }, [user]);

//   // Generate Excel template - STANDARD (With Gold + Platinum)
//   const generateStandardTemplate = () => {
//     const wb = XLSX.utils.book_new();
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
//       ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
//       ['Invoice Number:', ''],
//       ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
//       [],
//       Object.keys(COLUMN_HEADER_MAP)
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(Object.keys(COLUMN_HEADER_MAP).length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(Object.keys(COLUMN_HEADER_MAP).length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     if (ws1['A1']) {
//       ws1['A1'].s = {
//         font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "4472C4" } },
//         alignment: { horizontal: "center", vertical: "center" }
//       };
//     }

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Standard_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Standard template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };

//   // Generate Excel template - PLATINUM ONLY
//   const generatePlatinumTemplate = () => {
//     const wb = XLSX.utils.book_new();
//     const platinumColumns = PT_COLUMNS;
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
//       ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
//       ['Invoice Number:', ''],
//       ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
//       [],
//       platinumColumns
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(platinumColumns.length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(platinumColumns.length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Platinum_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Platinum template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };

//   // Generate Excel template - GOLD ONLY
//   const generateGoldTemplate = () => {
//     const wb = XLSX.utils.book_new();
//     const goldColumns = GOLD_COLUMNS;
    
//     const ws1 = XLSX.utils.aoa_to_sheet([
//       ['COMMON FIELDS (Fill these once, will apply to all items below)'],
//       ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
//       ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
//       ['Invoice Number:', ''],
//       ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
//       [],
//       goldColumns
//     ]);

//     XLSX.utils.sheet_add_aoa(ws1, [Array(goldColumns.length).fill('')], { origin: -1 });

//     const diamondTemplate = [{
//       'Entry Id': '',
//       'Stone From': '',
//       'Diamond Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const csTemplate = [{
//       'Entry Id': '',
//       'Color Stone Shape': '',
//       'No Of Stones': '',
//       'Carat': '',
//       'Rate': '',
//       'Value': '',
//       'Weight': ''
//     }];

//     const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
//     const ws3 = XLSX.utils.json_to_sheet(csTemplate);

//     ws1['!cols'] = Array(goldColumns.length).fill({ wch: 15 });
//     ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
//     ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

//     ws1['!merges'] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
//     ];

//     if (ws1['A1']) {
//       ws1['A1'].s = {
//         font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
//         fill: { fgColor: { rgb: "FFD700" } },
//         alignment: { horizontal: "center", vertical: "center" }
//       };
//     }

//     XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
//     XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
//     XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
//     XLSX.writeFile(wb, 'Diamond_Purchase_Gold_Template.xlsx');
//     setUploadStatus({ type: 'success', message: 'Gold template downloaded successfully!' });
//     setTimeout(() => setUploadStatus(null), 2500);
//     setShowTemplateMenu(false);
//   };

//   // Validate uploaded data
//   const validateData = (mainData, diamondData, csData) => {
//     const errors = [];
    
//     mainData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
      
//       if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required (check common field)`);
//       if (!row.ProductName) errors.push(`Row ${idx + 8}: ProductName is required`);
//       if (!row.DesignNo) errors.push(`Row ${idx + 8}: DesignNo is required`);
//     });

//     const purchaseIdSet = new Set();
//     mainData.forEach((row) => { 
//       if (row.id || row.id === 0) purchaseIdSet.add(String(row.id)); 
//     });

//     diamondData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
//       if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
//       if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
//         errors.push(`Diamond Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
//       }
//     });

//     csData.forEach((row, idx) => {
//       const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//       if (isEmpty) return;
//       if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Color Stone Row ${idx + 2}: Entry Id required`);
//       if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
//         errors.push(`Color Stone Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
//       }
//     });

//     return errors;
//   };

//   // Handle file upload with validation
//   const handleFileUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const wb = XLSX.read(evt.target.result, { type: 'binary' });
//         const mainSheet = wb.Sheets['Purchase Entry'] || wb.Sheets[wb.SheetNames[0]];
//         const diamondSheet = wb.Sheets['Diamond Details'] || wb.Sheets[wb.SheetNames[1]];
//         const csSheet = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

//         if (!mainSheet) {
//           setUploadStatus({ type: 'error', message: 'Purchase Entry sheet not found' });
//           return;
//         }

//         // Extract common fields (updated row indices)
//         const supplierName = mainSheet['B2'] ? mainSheet['B2'].v : '';
//         const supplierCode = mainSheet['B3'] ? mainSheet['B3'].v : '';
//         const invoiceDate = mainSheet['B5'] ? mainSheet['B5'].v : '';
//         const invoiceNumber = mainSheet['B4'] ? mainSheet['B4'].v+'|'+invoiceDate : '';

//         // Read data starting from row 7 (updated from row 6)
//         const mainDataRaw = XLSX.utils.sheet_to_json(mainSheet, { 
//           range: 6,
//           defval: '' 
//         });
        
//         const diamondDataRaw = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
//         const csDataRaw = csSheet ? XLSX.utils.sheet_to_json(csSheet, { defval: '' }) : [];

//         // Validate data types and map with defaults
//         const typeErrors = [];
//         const mainData = mainDataRaw.map((row, idx) => {
//           const mapped = mapExcelHeadersToBackend(row, idx, typeErrors);
//           mapped.SupplierName = supplierName || '';
//           mapped.suppCode = supplierCode || '';
//           mapped.invoiceNumber = invoiceNumber || '';
//           mapped.invoiceDate = invoiceDate || '';
//           return mapped;
//         });

//         // If there are data type errors, show them and stop
//         if (typeErrors.length > 0) {
//           setDataTypeErrors(typeErrors);
//           setValidationErrors([]);
//           setUploadStatus({ type: 'error', message: `Data type validation failed (${typeErrors.length} errors)` });
//           setUploadedData(null);
//           setData([]);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }
        
//         // Process diamond data with defaults
//         const diamondData = diamondDataRaw.map(row => {
//           const mapped = {};
//           Object.keys(row).forEach(key => {
//             if (key === 'Sno') {
//               mapped.id = row[key] || 0;
//             } else if (key === 'Entry Id') {
//               mapped.purchaseEntryId = row[key] || 0;
//             } else if (key === 'Stone From') {
//               mapped.STONE_FROM = row[key] || null;
//             } else if (key === 'Diamond Shape') {
//               mapped.DiamondShape = row[key] || null;
//             } else if (key === 'No Of Stones') {
//               mapped.NoOfStones = row[key] || 0;
//             } else if (key === 'Carat') {
//               mapped.Carat = row[key] || 0;
//             } else if (key === 'Rate') {
//               mapped.Rate = row[key] || 0;
//             } else if (key === 'Value') {
//               mapped.Value = row[key] || 0;
//             } else if (key === 'Weight') {
//               mapped.Weight = row[key] || 0;
//             } else {
//               mapped[key] = row[key];
//             }
//           });
//           return mapped;
//         });
        
//         // Process color stone data with defaults
//         const csData = csDataRaw.map(row => {
//           const mapped = {};
//           Object.keys(row).forEach(key => {
//             if (key === 'Sno') {
//               mapped.id = row[key] || 0;
//             } else if (key === 'Entry Id') {
//               mapped.purchaseEntryId = row[key] || 0;
//             } else if (key === 'Color Stone Shape') {
//               mapped.csShape = row[key] || null;
//             } else if (key === 'No Of Stones') {
//               mapped.NoOfStones = row[key] || 0;
//             } else if (key === 'Carat') {
//               mapped.Carat = row[key] || 0;
//             } else if (key === 'Rate') {
//               mapped.Rate = row[key] || 0;
//             } else if (key === 'Value') {
//               mapped.Value = row[key] || 0;
//             } else if (key === 'Weight') {
//               mapped.Weight = row[key] || 0;
//             } else {
//               mapped[key] = row[key];
//             }
//           });
//           return mapped;
//         });

//         // Validate data
//         const errors = validateData(mainData, diamondData, csData);
//         if (errors.length > 0) {
//           setValidationErrors(errors);
//           setDataTypeErrors([]);
//           setUploadStatus({ type: 'error', message: `Validation failed (${errors.length} errors)` });
//           setUploadedData(null);
//           setData([]);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }

//         // Group data
//         const grouped = mainData
//           .filter(r => {
//             const allEmpty = Object.entries(r).every(([key, val]) => {
//               if (key === 'SupplierName' || key === 'suppCode' || key === 'invoiceNumber' || key === 'invoiceDate') return true;
//               return val === '' || val === null || val === undefined || val === 0;
//             });
//             return !allEmpty;
//           })
//           .map(entry => {
//             const idStr = String(entry.id ?? entry.id);
//             const diamondsFor = diamondData.filter(d => String(d.purchaseEntryId) === idStr && Object.values(d).some(v => v !== '' && v !== 0 && v !== null));
//             const csFor = csData.filter(c => String(c.purchaseEntryId) === idStr && Object.values(c).some(v => v !== '' && v !== 0 && v !== null));
//             return { ...entry, diamonds: diamondsFor, colorStones: csFor };
//           });

//         setUploadedData({ mainData, diamondData, csData, groupedData: grouped });
//         setData(grouped);
//         setValidationErrors([]);
//         setDataTypeErrors([]);
//         setUploadStatus({ 
//           type: 'success', 
//           message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` 
//         });
        
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//       } catch (error) {
//         console.error(error);
//         setUploadStatus({ type: 'error', message: 'Error reading file — check format' });
//         setDataTypeErrors([]);
//         setValidationErrors([]);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Save data to backend
//   const handleSave = async () => {
//     if (!data.length) return;
//     setLoading(true);
//     try {
//       const response = await axios.post(`${DIA_API}/saveDiamondEntries`, data);
//       setUploadStatus({ type: 'success', message: '✓ Data saved successfully!' });
//       setTimeout(() => resetForm(), 1500);
//     } catch (error) {
//       console.error('Save error:', error);
//       const errorMsg = error.response?.data?.result || error.message || 'Error saving data!';
//       setUploadStatus({ type: 'error', message: `✗ ${errorMsg}` });
//     } finally {
//       setLoading(false);
//     }
//   };


//   // Reset form
//   const resetForm = () => {
//     setData([]);
//     setUploadedData(null);
//     setValidationErrors([]);
//     setDataTypeErrors([]);
//     setUploadStatus(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };


//   // Open modal and fetch details
//   const openDetails = (row) => {
//     setSelectedEntry(row);
//     setDiamonds(row.diamonds || []);
//     setColorStones(row.colorStones || []);
//     setShowModal(true);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="mx-auto space-y-6">
//         <div className="flex items-center justify-between">
//           <h2 className="text-2xl font-semibold flex items-center gap-2">
//             <FileSpreadsheet className="w-6 h-6" /> Diamond Purchase Entries
//           </h2>
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <button 
//                 onClick={() => setShowTemplateMenu(!showTemplateMenu)}
//                 className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700"
//               >
//                 <Download className="w-4 h-4" /> Download Template
//               </button>
              
//               {showTemplateMenu && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
//                   <div className="py-2">
//                     <button
//                       onClick={generateStandardTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-blue-600" />
//                       <div>
//                         <div className="font-medium">Standard Template</div>
//                         <div className="text-xs text-gray-500">Gold + Platinum</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={generatePlatinumTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-purple-600" />
//                       <div>
//                         <div className="font-medium">Platinum Only</div>
//                         <div className="text-xs text-gray-500">No Gold columns</div>
//                       </div>
//                     </button>
//                     <button
//                       onClick={generateGoldTemplate}
//                       className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
//                     >
//                       <FileSpreadsheet className="w-4 h-4 text-yellow-600" />
//                       <div>
//                         <div className="font-medium">Gold Only Template</div>
//                         <div className="text-xs text-gray-500">No Platinum columns</div>
//                       </div>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700">
//               <Upload className="w-4 h-4" /> Upload Filled Excel
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".xlsx,.xls"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </label>
//           </div>
//         </div>

//         {showTemplateMenu && (
//           <div 
//             className="fixed inset-0 z-40" 
//             onClick={() => setShowTemplateMenu(false)}
//           />
//         )}

//         {uploadStatus && (
//           <div className={`p-3 rounded flex items-center gap-2 ${uploadStatus.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
//             {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
//             <span className="font-medium">{uploadStatus.message}</span>
//           </div>
//         )}

//         {dataTypeErrors.length > 0 && (
//           <ValidationErrorsTable errors={dataTypeErrors} />
//         )}

//         {validationErrors.length > 0 && (
//           <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
//             <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2">
//               <AlertCircle className="w-5 h-5" />
//               Validation Errors ({validationErrors.length})
//             </div>
//             <div className="max-h-48 overflow-y-auto text-sm space-y-1">
//               {validationErrors.map((err, i) => <div key={i} className="text-yellow-800">• {err}</div>)}
//             </div>
//           </div>
//         )}

//         {loading ? (
//           <LoadingState />
//         ) : data.length === 0 ? (
//           <EmptyState />
//         ) : (
//           <PurchaseEntryTable
//             data={data}
//             loading={false}
//             onRowClick={openDetails}
//           />
//         )}

//         {data.length > 0 && (
//           <div className="mt-4 flex justify-end gap-3">
//             <button
//               onClick={handleSave}
//               disabled={loading}
//               className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
//                 loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save to Database'}
//             </button>
//             <button
//               onClick={resetForm}
//               className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600"
//             >
//               <RefreshCw className="w-4 h-4" /> Reset
//             </button>
//           </div>
//         )}

//         {showModal && selectedEntry && (
//           <EntryDetailModal
//             entry={selectedEntry}
//             diamonds={diamonds}
//             colorStones={colorStones}
//             onClose={() => setShowModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };


// export default DiamondManager;

import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet, Eye, Download, Upload, AlertCircle, CheckCircle, Save, RefreshCw, Loader2, XCircle
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';


// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-8">
      <div className="absolute inset-0 animate-ping opacity-20">
        <div className="w-24 h-24 bg-indigo-500 rounded-full"></div>
      </div>
      <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    </div>
    <div className="text-center space-y-3">
      <h3 className="text-2xl font-bold text-gray-900">Loading Purchase Entries</h3>
      <p className="text-gray-500 max-w-md">Processing your Excel file and organizing the data...</p>
      <div className="flex items-center justify-center gap-2 mt-6">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  </div>
);


// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
        <div className="transform -rotate-3">
          <FileSpreadsheet className="w-16 h-16 text-gray-400" />
        </div>
      </div>
      <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg ">
        <Upload className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="text-center space-y-4 max-w-md">
      <h3 className="text-2xl font-bold text-gray-900">No Purchase Entries Yet</h3>
    </div>
  </div>
);


// Column Header Mapping: Display Name -> Backend Field Name
const COLUMN_HEADER_MAP = {
  'Entry Id': 'id',
  'Product Name': 'ProductName',
  'Metal Type': 'MetalType',
  'Weight Mode': 'WtMode',
  'Design No': 'DesignNo',
  'G Karat': 'GCarat',
  'Pcs': 'PCS',
  'Gold Wt': 'GoldWt',
  'Gold Purity': 'GoldPurity',
  'Gold Purity Wt': 'GoldPurityWt',
  'Gold999Rate (without GST)': 'Gold999Rate',
  'Gold Value': 'GoldValue',
  'PT Wt': 'PTWt',
  'PT Purity': 'PTPurity',
  'PT Purity Wt': 'PTPurityWt',
  'PT999Rate (without GST)': 'PT999Rate',
  'PT Value': 'PTValue',
  'No of Stones': 'NoofStone',
  'Diamond Carat': 'DCarat',
  'Diamond Rate': 'DiamondRate',
  'Diamond Value': 'DiamondValue',
  'Diamond Wt': 'DiamondWt',
  'ColorStone PCS': 'ClrStnPCS',
  'ColorStone Carat': 'CLSCarat',
  'ColorStone Wt': 'ClrStnWt',
  'ColorStone Rate': 'ClrStnRate',
  'ColorStone Amount': 'CSAmount',
  'Gold Mc Type': 'GoMcType',
  'Gold Mc Rate': 'GoMcRate',
  'Gold Mc Amount': 'GoMcAmount',
  'Platinum Mc Type': 'PTMcType',
  'Platinum Mc Rate': 'PTMcRate',
  'Platinum Mc Amount': 'PTMcAmount',
  'Gold Wastage Type': 'WastageType',
  'Gold Wastage Weight': 'WastageWeight',
  'Gold Wastage Amount': 'WastageAmt',
  'Platinum Wastage Type': 'PTWastageType',
  'Platinum Wastage Weight': 'PTWastageWeight',
  'Platinum Wastage Amount': 'PTWastageAmt',
  'Diamond Certificate Type': 'CertType',
  'Diamond Certificate GST': 'CertGST',
  'Diamond Certificate Qty': 'CertQty',
  'Diamond Certificate Rate': 'CertRate',
  'Diamond Certificate Taxable Amount': 'CertTaxableAmt',
  'Diamond Certificate Tax Amount': 'certTaxAmt',
  'Diamond Certificate Total': 'CertTotal',
  'Gold HallMark Type': 'HallMarkType',
  'Gold HallMark GST': 'HMGST',
  'GoldHallMark Qty': 'HMQty',
  'Gold HallMark Rate': 'HMRate',
  'Gold HallMark Taxable Amount': 'HMTaxableAmt',
  'Gold HallMark Tax Amount': 'HmTaxAmt',
  'Gold HallMark Total': 'HMTotal',
  'HandleRate': 'HandleRate',
  'HandleAmount': 'HandleAmount',
  'Gold Net Wt': 'GNetWt',
  'Platinum NetWt': 'PNetWt',
  'Total Value': 'TotalValue',
  'GST': 'GST',
  'Grand Total': 'GrandTotal',
  'HUID No': 'HUID',
  'IGI Summary No': 'IgiSummaryNo',
  'PGI UIN No': 'PgiUinNo'
};

// Backend to Display Name Mapping (Reverse mapping)
const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce((acc, [display, backend]) => {
  acc[backend] = display;
  return acc;
}, {});

// Add common fields to the mapping
BACKEND_TO_DISPLAY_MAP['SupplierName'] = 'Supplier Name';
BACKEND_TO_DISPLAY_MAP['suppCode'] = 'Supplier Code';
BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
BACKEND_TO_DISPLAY_MAP['invoiceDate'] = 'Invoice Date';

// Field Data Types Mapping (based on SQL procedure)
const FIELD_DATA_TYPES = {
  // NVARCHAR fields
  'SupplierName': 'string',
  'ProductName': 'string',
  'MetalType': 'string',
  'WtMode': 'string',
  'DesignNo': 'string',
  'GoMcType': 'string',
  'WastageType': 'string',
  'CertType': 'string',
  'HallMarkType': 'string',
  'HUID': 'string',
  'suppCode': 'string',
  'PTMcType': 'string',
  'PTWastageType': 'string',
  'IgiSummaryNo': 'string',
  'PgiUinNo': 'string',
  'invoiceNumber': 'string',
  'invoiceDate': 'string',
  
  // INT fields
  'id': 'int',
  'PCS': 'int',
  'HMQty': 'int',
  'NoofStone': 'int',
  'ClrStnPCS': 'int',
  
  // DECIMAL fields
  'GCarat': 'decimal',
  'GoldWt': 'decimal',
  'GoldPurity': 'decimal',
  'GoldPurityWt': 'decimal',
  'Gold999Rate': 'decimal',
  'GoldValue': 'decimal',
  'PTWt': 'decimal',
  'PTPurity': 'decimal',
  'PTPurityWt': 'decimal',
  'PT999Rate': 'decimal',
  'PTValue': 'decimal',
  'GoMcRate': 'decimal',
  'GoMcAmount': 'decimal',
  'WastageWeight': 'decimal',
  'WastageAmt': 'decimal',
  'CertGST': 'decimal',
  'CertQty': 'decimal',
  'CertRate': 'decimal',
  'CertTaxableAmt': 'decimal',
  'CertTotal': 'decimal',
  'HMGST': 'decimal',
  'HMRate': 'decimal',
  'HMTaxableAmt': 'decimal',
  'HMTotal': 'decimal',
  'HandleRate': 'decimal',
  'HandleAmount': 'decimal',
  'GNetWt': 'decimal',
  'PNetWt': 'decimal',
  'TotalValue': 'decimal',
  'GST': 'decimal',
  'GrandTotal': 'decimal',
  'PTMcRate': 'decimal',
  'PTMcAmount': 'decimal',
  'PTWastageWeight': 'decimal',
  'PTWastageAmt': 'decimal',
  'certTaxAmt': 'decimal',
  'HmTaxAmt': 'decimal',
  'DCarat': 'decimal',
  'DiamondRate': 'decimal',
  'DiamondValue': 'decimal',
  'DiamondWt': 'decimal',
  'CLSCarat': 'decimal',
  'ClrStnWt': 'decimal',
  'ClrStnRate': 'decimal',
  'CSAmount': 'decimal',
};

// Platinum-specific columns to exclude from Gold template
const PT_COLUMNS = [
  'Product Name',
  'Metal Type',
  'Weight Mode',
  'Design No',
  'Pcs',
  'PT Wt',
  'PT Purity',
  'PT Purity Wt',
  'PT999Rate (without GST)',
  'PT Value',
  'No of Stones',
  'Diamond Carat',
  'Diamond Rate',
  'Diamond Value',
  'Diamond Wt',
  'ColorStone PCS',
  'ColorStone Carat',
  'ColorStone Wt',
  'ColorStone Rate',
  'ColorStone Amount',
  'Platinum Mc Type',
  'Platinum Mc Rate',
  'Platinum Mc Amount',
  'Platinum Wastage Type',
  'Platinum Wastage Weight',
  'Platinum Wastage Amount',
  'Diamond Certificate Type',
  'Diamond Certificate GST',
  'Diamond Certificate Qty',
  'Diamond Certificate Rate',
  'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount',
  'Diamond Certificate Total',
  'HandleRate',
  'HandleAmount',
  'Platinum NetWt',
  'Total Value',
  'GST',
  'Grand Total',
  'IGI Summary No',
  'PGI UIN No'
];

// Gold-specific columns (excluding Platinum columns)
const GOLD_COLUMNS = [
  'Product Name',
  'Metal Type',
  'Weight Mode',
  'Design No',
  'G Karat',
  'Pcs',
  'Gold Wt',
  'Gold Purity',
  'Gold Purity Wt',
  'Gold999Rate (without GST)',
  'Gold Value',
  'No of Stones',
  'Diamond Carat',
  'Diamond Rate',
  'Diamond Value',
  'Diamond Wt',
  'ColorStone PCS',
  'ColorStone Carat',
  'ColorStone Wt',
  'ColorStone Rate',
  'ColorStone Amount',
  'Gold Mc Type',
  'Gold Mc Rate',
  'Gold Mc Amount',
  'Gold Wastage Type',
  'Gold Wastage Weight',
  'Gold Wastage Amount',
  'Diamond Certificate Type',
  'Diamond Certificate GST',
  'Diamond Certificate Qty',
  'Diamond Certificate Rate',
  'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount',
  'Diamond Certificate Total',
  'Gold HallMark Type',
  'Gold HallMark GST',
  'GoldHallMark Qty',
  'Gold HallMark Rate',
  'Gold HallMark Taxable Amount',
  'Gold HallMark Tax Amount',
  'Gold HallMark Total',
  'HandleRate',
  'HandleAmount',
  'Gold Net Wt',
  'Total Value',
  'GST',
  'Grand Total',
  'HUID No',
  'IGI Summary No',
  'PGI UIN No'
];

// Purchase entry columns for display (backend field names) - in order
const PURCHASE_COLUMNS_BACKEND = [
  'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate', 'ProductName', 'MetalType', 'WtMode', 'DesignNo', 
  'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue', 
  'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
  'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
  'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount', 
  'GoMcType', 'GoMcRate', 'GoMcAmount', 
  'PTMcType', 'PTMcRate', 'PTMcAmount', 
  'WastageType', 'WastageWeight', 'WastageAmt',
  'PTWastageType','PTWastageWeight','PTWastageAmt',
  'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt','certTaxAmt', 'CertTotal',
  'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt','HmTaxAmt', 'HMTotal', 
  'HandleRate', 'HandleAmount',
  'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID','IgiSummaryNo','PgiUinNo'
];


// Helper: Get default value based on data type - RETURN NULL FOR OPTIONAL EMPTY FIELDS
const getDefaultValue = (fieldName, value) => {
  // If value exists and is not empty string, return it
  if (value !== null && value !== undefined && value !== '') {
    return value;
  }
  
  const dataType = FIELD_DATA_TYPES[fieldName];
  
  // Required string fields that should never be null
  const requiredStringFields = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
  
  switch (dataType) {
    case 'int':
      return 0;
    case 'decimal':
      return 0;
    case 'string':
      // Return null for optional string fields, empty string for required fields
      return requiredStringFields.includes(fieldName) ? '' : null;
    default:
      return null;
  }
};

// Helper: Validate data type
const validateDataType = (fieldName, value, rowIndex) => {
  // Skip validation for empty values (will use default)
  if (value === null || value === undefined || value === '') {
    return { isValid: true, error: null };
  }
  
  const dataType = FIELD_DATA_TYPES[fieldName];
  
  switch (dataType) {
    case 'int':
      const intValue = Number(value);
      if (isNaN(intValue) || !Number.isInteger(intValue)) {
        return {
          isValid: false,
          error: {
            row: rowIndex,
            field: fieldName,
            value: value,
            expectedType: 'Integer',
            message: `Invalid integer value: "${value}"`
          }
        };
      }
      break;
      
    case 'decimal':
      const decimalValue = Number(value);
      if (isNaN(decimalValue)) {
        return {
          isValid: false,
          error: {
            row: rowIndex,
            field: fieldName,
            value: value,
            expectedType: 'Decimal/Number',
            message: `Invalid decimal value: "${value}"`
          }
        };
      }
      break;
      
    case 'string':
      // String is always valid, just convert to string
      break;
      
    default:
      break;
  }
  
  return { isValid: true, error: null };
};


// Helper: Format numbers
const formatNumber = (v, decimals = 2) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};


// Helper: Map Excel headers (Display Names) to backend field names with default values
const mapExcelHeadersToBackend = (excelRow, rowIndex, validationErrors) => {
  const mappedRow = {};
  
  Object.keys(excelRow).forEach(excelHeader => {
    const backendField = COLUMN_HEADER_MAP[excelHeader] || excelHeader;
    const value = excelRow[excelHeader];
    
    // Validate data type
    const validation = validateDataType(backendField, value, rowIndex);
    if (!validation.isValid) {
      validationErrors.push(validation.error);
    }
    
    // Set value with default if empty
    mappedRow[backendField] = getDefaultValue(backendField, value);
  });
  
  return mappedRow;
};

// Validation Errors Table Component
const ValidationErrorsTable = ({ errors }) => (
  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
    <div className="flex items-center gap-2 mb-3">
      <XCircle className="w-5 h-5 text-red-600" />
      <h3 className="font-semibold text-red-900">Data Type Validation Errors ({errors.length})</h3>
    </div>
    <div className="overflow-auto max-h-96 border rounded bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-red-100 sticky top-0">
          <tr>
            <th className="border border-red-200 px-3 py-2 text-left">#</th>
            <th className="border border-red-200 px-3 py-2 text-left">Row</th>
            <th className="border border-red-200 px-3 py-2 text-left">Field Name</th>
            <th className="border border-red-200 px-3 py-2 text-left">Invalid Value</th>
            <th className="border border-red-200 px-3 py-2 text-left">Expected Type</th>
            <th className="border border-red-200 px-3 py-2 text-left">Error Message</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((err, idx) => (
            <tr key={idx} className="hover:bg-red-50">
              <td className="border border-red-200 px-3 py-2 text-center">{idx + 1}</td>
              <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 8}</td>
              <td className="border border-red-200 px-3 py-2 font-mono text-blue-600">{err.field}</td>
              <td className="border border-red-200 px-3 py-2 font-mono text-red-600">{String(err.value)}</td>
              <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
              <td className="border border-red-200 px-3 py-2">{err.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
      <p className="text-sm text-yellow-800">
        <strong>⚠️ Note:</strong> Please fix these errors in your Excel file and re-upload. 
        Make sure the data types match: Integers for counts, Decimals for weights/amounts, and Text for names/codes.
      </p>
    </div>
  </div>
);


// Sub-component: Purchase Entry Table
const PurchaseEntryTable = ({ data, loading, onRowClick }) => (
  <div className="overflow-auto bg-white border rounded">
    <table className="min-w-full text-sm">
      {data.length > 0 && (
        <thead>
          <tr className="bg-gray-100 sticky top-0">
            {PURCHASE_COLUMNS_BACKEND.map(backendCol => (
              <th key={backendCol} className="border px-2 py-1 text-left whitespace-nowrap">
                {BACKEND_TO_DISPLAY_MAP[backendCol] || backendCol}
              </th>
            ))}
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
      )}
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={PURCHASE_COLUMNS_BACKEND.length + 1} className="p-6 text-center">Loading designs...</td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={PURCHASE_COLUMNS_BACKEND.length + 1} className="p-6 text-center">No data</td>
          </tr>
        ) : data.map((row) => (
          <tr key={row.id ?? Math.random()} className="hover:bg-gray-50 align-top">
            {PURCHASE_COLUMNS_BACKEND.map(col => {
              let val = row[col];
              if (col === 'id') {
                return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
              }
              if (typeof val === 'number') {
                const threeDecimals = ['GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight'];
                const decimals = threeDecimals.includes(col) ? 3 : 2;
                val = formatNumber(val, decimals);
              } else if (val === null || val === undefined) val = '';
              return <td key={col} className="border px-2 py-1 max-w-[160px] truncate">{String(val)}</td>;
            })}
            <td className="border px-2 py-1">
              <button onClick={() => onRowClick(row)} className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700 whitespace-nowrap">
                <Eye className="w-4 h-4" /> View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Sub-component: Diamond Table
const DiamondTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="p-2 border">#</th>
          <th className="p-2 border">Stone From</th>
          <th className="p-2 border">Diamond Shape</th>
          <th className="p-2 border">No Of Stones</th>
          <th className="p-2 border">Carat</th>
          <th className="p-2 border">Rate</th>
          <th className="p-2 border">Value</th>
          <th className="p-2 border">Weight</th>
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ?
          <tr><td colSpan={8} className="text-center p-4">No diamond records.</td></tr> :
          records.map((d, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border"><input value={d.STONE_FROM || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={d.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);

// Sub-component: Color Stone Table
const ColorStoneTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          <th className="p-2 border">#</th>
          <th className="p-2 border">Color Stone Shape</th>
          <th className="p-2 border">No Of Stones</th>
          <th className="p-2 border">Carat</th>
          <th className="p-2 border">Rate</th>
          <th className="p-2 border">Value</th>
          <th className="p-2 border">Weight</th>
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ?
          <tr><td colSpan={7} className="text-center p-4">No color stone records.</td></tr> :
          records.map((c, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-2 border text-center">{idx + 1}</td>
              <td className="p-2 border"><input value={c.csShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={c.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={c.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={c.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={c.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
              <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
);


// Sub-component: Entry Detail Modal
const EntryDetailModal = ({ entry, diamonds, colorStones, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
    <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
    <div className="relative z-60 w-[95%] max-w-6xl bg-white rounded shadow-lg overflow-auto max-h-[85vh]">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold">Entry Details — ID: {entry.id} | {entry.DesignNo}</h3>
        <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Close</button>
      </div>
      <div className="p-4 space-y-6">
        <section>
          <h4 className="font-semibold mb-2">Purchase Entry</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-600">Supplier Name</label>
              <input value={entry.SupplierName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Invoice Number</label>
              <input value={entry.invoiceNumber || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Invoice Date</label>
              <input value={entry.invoiceDate || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Product Name</label>
              <input value={entry.ProductName || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Design No</label>
              <input value={entry.DesignNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Metal Type</label>
              <input value={entry.MetalType || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Grand Total</label>
              <input value={entry.GrandTotal ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">Gold Weight</label>
              <input value={entry.GoldWt ?? 0} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">IGI Summary No</label>
              <input value={entry.IgiSummaryNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
            <div>
              <label className="text-xs text-gray-600">PGI UIN No</label>
              <input value={entry.PgiUinNo || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <h4 className="font-semibold">Diamonds ({diamonds.length})</h4>
          <DiamondTable records={diamonds} />
        </section>
        <section className="space-y-3">
          <h4 className="font-semibold">Color Stones ({colorStones.length})</h4>
          <ColorStoneTable records={colorStones} />
        </section>
      </div>
    </div>
  </div>
);

const DiamondManager = () => {
  const [suppliers, setSuppliers] = useState({});
  const [data, setData] = useState([]);
  const [uploadedData, setUploadedData] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [dataTypeErrors, setDataTypeErrors] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [diamonds, setDiamonds] = useState([]);
  const [colorStones, setColorStones] = useState([]);
  const fileInputRef = useRef(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const { user, companyName } = useContext(DashBoardContext);


  useEffect(() => { 
    if (!user) return;
    const fetchSuppliers = async () => {
      try {
        const res = await axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user });
        setSuppliers(res.data);
      } catch (err) {
        // console.error('Error fetching suppliers:', err);
      }
    };
    fetchSuppliers();
  }, [user]);

  // Generate Excel template - STANDARD (With Gold + Platinum)
  const generateStandardTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['COMMON FIELDS (Fill these once, will apply to all items below)'],
      ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
      ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
      ['Invoice Number:', ''],
      ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
      [],
      Object.keys(COLUMN_HEADER_MAP)
    ]);

    XLSX.utils.sheet_add_aoa(ws1, [Array(Object.keys(COLUMN_HEADER_MAP).length).fill('')], { origin: -1 });

    const diamondTemplate = [{
      'Entry Id': '',
      'Stone From': '',
      'Diamond Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const csTemplate = [{
      'Entry Id': '',
      'Color Stone Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
    const ws3 = XLSX.utils.json_to_sheet(csTemplate);

    ws1['!cols'] = Array(Object.keys(COLUMN_HEADER_MAP).length).fill({ wch: 15 });
    ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
    ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

    ws1['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
    ];

    if (ws1['A1']) {
      ws1['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
    XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
    XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
    XLSX.writeFile(wb, 'Diamond_Purchase_Standard_Template.xlsx');
    setUploadStatus({ type: 'success', message: 'Standard template downloaded successfully!' });
    setTimeout(() => setUploadStatus(null), 2500);
    setShowTemplateMenu(false);
  };

  // Generate Excel template - PLATINUM ONLY
  const generatePlatinumTemplate = () => {
    const wb = XLSX.utils.book_new();
    const platinumColumns = PT_COLUMNS;
    
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['COMMON FIELDS (Fill these once, will apply to all items below)'],
      ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
      ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
      ['Invoice Number:', ''],
      ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
      [],
      platinumColumns
    ]);

    XLSX.utils.sheet_add_aoa(ws1, [Array(platinumColumns.length).fill('')], { origin: -1 });

    const diamondTemplate = [{
      'Entry Id': '',
      'Stone From': '',
      'Diamond Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const csTemplate = [{
      'Entry Id': '',
      'Color Stone Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
    const ws3 = XLSX.utils.json_to_sheet(csTemplate);

    ws1['!cols'] = Array(platinumColumns.length).fill({ wch: 15 });
    ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
    ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

    ws1['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
    XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
    XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
    XLSX.writeFile(wb, 'Diamond_Purchase_Platinum_Template.xlsx');
    setUploadStatus({ type: 'success', message: 'Platinum template downloaded successfully!' });
    setTimeout(() => setUploadStatus(null), 2500);
    setShowTemplateMenu(false);
  };

  // Generate Excel template - GOLD ONLY
  const generateGoldTemplate = () => {
    const wb = XLSX.utils.book_new();
    const goldColumns = GOLD_COLUMNS;
    
    const ws1 = XLSX.utils.aoa_to_sheet([
      ['COMMON FIELDS (Fill these once, will apply to all items below)'],
      ['Supplier Name:', suppliers?.companyname || '','(Don\'t change supplier Name )'],
      ['Supplier Code:', suppliers?.Suppcode || '','(Don\'t change supplier Code )'],
      ['Invoice Number:', ''],
      ['Invoice Date:', '','(Format: YYYY-MM-DD)'],
      [],
      goldColumns
    ]);

    XLSX.utils.sheet_add_aoa(ws1, [Array(goldColumns.length).fill('')], { origin: -1 });

    const diamondTemplate = [{
      'Entry Id': '',
      'Stone From': '',
      'Diamond Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const csTemplate = [{
      'Entry Id': '',
      'Color Stone Shape': '',
      'No Of Stones': '',
      'Carat': '',
      'Rate': '',
      'Value': '',
      'Weight': ''
    }];

    const ws2 = XLSX.utils.json_to_sheet(diamondTemplate);
    const ws3 = XLSX.utils.json_to_sheet(csTemplate);

    ws1['!cols'] = Array(goldColumns.length).fill({ wch: 15 });
    ws2['!cols'] = Array(Object.keys(diamondTemplate[0]).length).fill({ wch: 15 });
    ws3['!cols'] = Array(Object.keys(csTemplate[0]).length).fill({ wch: 15 });

    ws1['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }
    ];

    if (ws1['A1']) {
      ws1['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "FFD700" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    XLSX.utils.book_append_sheet(wb, ws1, 'Purchase Entry');
    XLSX.utils.book_append_sheet(wb, ws2, 'Diamond Details');
    XLSX.utils.book_append_sheet(wb, ws3, 'Color Stone Details');
    
    XLSX.writeFile(wb, 'Diamond_Purchase_Gold_Template.xlsx');
    setUploadStatus({ type: 'success', message: 'Gold template downloaded successfully!' });
    setTimeout(() => setUploadStatus(null), 2500);
    setShowTemplateMenu(false);
  };

  // Validate uploaded data
  const validateData = (mainData, diamondData, csData) => {
    const errors = [];
    
    mainData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      
      if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required (check common field)`);
      if (!row.ProductName) errors.push(`Row ${idx + 8}: ProductName is required`);
      if (!row.DesignNo) errors.push(`Row ${idx + 8}: DesignNo is required`);
    });

    const purchaseIdSet = new Set();
    mainData.forEach((row) => { 
      if (row.id || row.id === 0) purchaseIdSet.add(String(row.id)); 
    });

    diamondData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
      if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
        errors.push(`Diamond Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
      }
    });

    csData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Color Stone Row ${idx + 2}: Entry Id required`);
      if ((row.purchaseEntryId || row.purchaseEntryId === 0) && !purchaseIdSet.has(String(row.purchaseEntryId))) {
        errors.push(`Color Stone Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
      }
    });

    return errors;
  };

  // Handle file upload with validation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const mainSheet = wb.Sheets['Purchase Entry'] || wb.Sheets[wb.SheetNames[0]];
        const diamondSheet = wb.Sheets['Diamond Details'] || wb.Sheets[wb.SheetNames[1]];
        const csSheet = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

        if (!mainSheet) {
          setUploadStatus({ type: 'error', message: 'Purchase Entry sheet not found' });
          return;
        }

        // Extract common fields (updated row indices)
        const supplierName = mainSheet['B2'] ? mainSheet['B2'].v : '';
        const supplierCode = mainSheet['B3'] ? mainSheet['B3'].v : '';        
        const invoiceDate = mainSheet['B5'] ? mainSheet['B5'].v : '';
        const invoiceNumber = mainSheet['B4'] ? mainSheet['B4'].v +"|"+invoiceDate: '';

        // Read data starting from row 7 (updated from row 6)
        const mainDataRaw = XLSX.utils.sheet_to_json(mainSheet, { 
          range: 6,
          defval: '' 
        });
        
        const diamondDataRaw = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
        const csDataRaw = csSheet ? XLSX.utils.sheet_to_json(csSheet, { defval: '' }) : [];

        // Validate data types and map with defaults
        const typeErrors = [];
        const mainData = mainDataRaw.map((row, idx) => {
          const mapped = mapExcelHeadersToBackend(row, idx, typeErrors);
          mapped.SupplierName = supplierName || '';
          mapped.suppCode = supplierCode || '';
          mapped.invoiceNumber = invoiceNumber || '';
          mapped.invoiceDate = invoiceDate || '';
          return mapped;
        });

        // If there are data type errors, show them and stop
        if (typeErrors.length > 0) {
          setDataTypeErrors(typeErrors);
          setValidationErrors([]);
          setUploadStatus({ type: 'error', message: `Data type validation failed (${typeErrors.length} errors)` });
          setUploadedData(null);
          setData([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }
        
        // Process diamond data with defaults
        const diamondData = diamondDataRaw.map(row => {
          const mapped = {};
          Object.keys(row).forEach(key => {
            if (key === 'Entry Id') {
              mapped.purchaseEntryId = row[key] || 0;
            } else if (key === 'Stone From') {
              mapped.STONE_FROM = row[key] || null;
            } else if (key === 'Diamond Shape') {
              mapped.DiamondShape = row[key] || null;
            } else if (key === 'No Of Stones') {
              mapped.NoOfStones = row[key] || 0;
            } else if (key === 'Carat') {
              mapped.Carat = row[key] || 0;
            } else if (key === 'Rate') {
              mapped.Rate = row[key] || 0;
            } else if (key === 'Value') {
              mapped.Value = row[key] || 0;
            } else if (key === 'Weight') {
              mapped.Weight = row[key] || 0;
            } else {
              mapped[key] = row[key];
            }
          });
          return mapped;
        });
        
        // Process color stone data with defaults
        const csData = csDataRaw.map(row => {
          const mapped = {};
          Object.keys(row).forEach(key => {
            if (key === 'Entry Id') {
              mapped.purchaseEntryId = row[key] || 0;
            } else if (key === 'Color Stone Shape') {
              mapped.csShape = row[key] || null;
            } else if (key === 'No Of Stones') {
              mapped.NoOfStones = row[key] || 0;
            } else if (key === 'Carat') {
              mapped.Carat = row[key] || 0;
            } else if (key === 'Rate') {
              mapped.Rate = row[key] || 0;
            } else if (key === 'Value') {
              mapped.Value = row[key] || 0;
            } else if (key === 'Weight') {
              mapped.Weight = row[key] || 0;
            } else {
              mapped[key] = row[key];
            }
          });
          return mapped;
        });

        // Validate data
        const errors = validateData(mainData, diamondData, csData);
        if (errors.length > 0) {
          setValidationErrors(errors);
          setDataTypeErrors([]);
          setUploadStatus({ type: 'error', message: `Validation failed (${errors.length} errors)` });
          setUploadedData(null);
          setData([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Group data
        const grouped = mainData
          .filter(r => {
            const allEmpty = Object.entries(r).every(([key, val]) => {
              if (key === 'SupplierName' || key === 'suppCode' || key === 'invoiceNumber' || key === 'invoiceDate') return true;
              return val === '' || val === null || val === undefined || val === 0;
            });
            return !allEmpty;
          })
          .map(entry => {
            const idStr = String(entry.id ?? entry.id);
            const diamondsFor = diamondData.filter(d => String(d.purchaseEntryId) === idStr && Object.values(d).some(v => v !== '' && v !== 0 && v !== null));
            const csFor = csData.filter(c => String(c.purchaseEntryId) === idStr && Object.values(c).some(v => v !== '' && v !== 0 && v !== null));
            return { ...entry, diamonds: diamondsFor, colorStones: csFor };
          });

        setUploadedData({ mainData, diamondData, csData, groupedData: grouped });
        setData(grouped);
        setValidationErrors([]);
        setDataTypeErrors([]);
        setUploadStatus({ 
          type: 'success', 
          message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` 
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        // console.error(error);
        setUploadStatus({ type: 'error', message: 'Error reading file — check format' });
        setDataTypeErrors([]);
        setValidationErrors([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Save data to backend
  const handleSave = async () => {
    if (!data.length) return;
    setLoading(true);
    try {
      const response = await axios.post(`${DIA_API}/saveDiamondEntries`, data);
      setUploadStatus({ type: 'success', message: '✓ Data saved successfully!' });
      setTimeout(() => resetForm(), 1500);
    } catch (error) {
      // console.error('Save error:', error);
      const errorMsg = error.response?.data?.result || error.message || 'Error saving data!';
      setUploadStatus({ type: 'error', message: `✗ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };


  // Reset form
  const resetForm = () => {
    setData([]);
    setUploadedData(null);
    setValidationErrors([]);
    setDataTypeErrors([]);
    setUploadStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  // Open modal and fetch details
  const openDetails = (row) => {
    setSelectedEntry(row);
    setDiamonds(row.diamonds || []);
    setColorStones(row.colorStones || []);
    setShowModal(true);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Diamond Purchase Entries
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Download className="w-4 h-4" /> Download Template
              </button>
              
              {showTemplateMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border z-50">
                  <div className="py-2">
                    <button
                      onClick={generateStandardTemplate}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Standard Template</div>
                        <div className="text-xs text-gray-500">Gold + Platinum</div>
                      </div>
                    </button>
                    <button
                      onClick={generatePlatinumTemplate}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium">Platinum Only</div>
                        <div className="text-xs text-gray-500">No Gold columns</div>
                      </div>
                    </button>
                    <button
                      onClick={generateGoldTemplate}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-yellow-600" />
                      <div>
                        <div className="font-medium">Gold Only Template</div>
                        <div className="text-xs text-gray-500">No Platinum columns</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700">
              <Upload className="w-4 h-4" /> Upload Filled Excel
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {showTemplateMenu && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowTemplateMenu(false)}
          />
        )}

        {uploadStatus && (
          <div className={`p-3 rounded flex items-center gap-2 ${uploadStatus.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
            {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{uploadStatus.message}</span>
          </div>
        )}

        {dataTypeErrors.length > 0 && (
          <ValidationErrorsTable errors={dataTypeErrors} />
        )}

        {validationErrors.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
            <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Validation Errors ({validationErrors.length})
            </div>
            <div className="max-h-48 overflow-y-auto text-sm space-y-1">
              {validationErrors.map((err, i) => <div key={i} className="text-yellow-800">• {err}</div>)}
            </div>
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <PurchaseEntryTable
            data={data}
            loading={false}
            onRowClick={openDetails}
          />
        )}

        {data.length > 0 && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
          </div>
        )}

        {showModal && selectedEntry && (
          <EntryDetailModal
            entry={selectedEntry}
            diamonds={diamonds}
            colorStones={colorStones}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};


export default DiamondManager;
