// import React, { useRef, useState } from 'react';
// import * as XLSX from 'xlsx-js-style';
// import { Upload, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
// import {  COLUMN_HEADER_MAP, FIELD_DATA_TYPES } from '../constants/diamondConstants';
// import { parseExcelDate } from '../utils/excelBuilder';
// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const getDefaultValue = (fieldName, value) => {
//   if (value !== null && value !== undefined && value !== '') return value;
//   const dataType = FIELD_DATA_TYPES[fieldName];
//   const requiredStrings = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
//   switch (dataType) {
//     case 'int':     return 0;
//     case 'decimal': return 0;
//     case 'string':  return requiredStrings.includes(fieldName) ? '' : null;
//     default:        return null;
//   }
// };

// const validateDataType = (fieldName, value, rowIndex) => {
//   if (value === null || value === undefined || value === '') return { isValid: true, error: null };
//   const dataType = FIELD_DATA_TYPES[fieldName];
//   if (dataType === 'int') {
//     const n = Number(value);
//     if (isNaN(n) || !Number.isInteger(n))
//       return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Integer', message: `Invalid integer: "${value}"` } };
//   } else if (dataType === 'decimal') {
//     if (isNaN(Number(value)))
//       return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Decimal/Number', message: `Invalid decimal: "${value}"` } };
//   }
//   return { isValid: true, error: null };
// };

// const mapExcelRow = (excelRow, rowIndex, typeErrors) => {
//   const mapped = {};
//   Object.keys(excelRow).forEach(header => {
//     const field = COLUMN_HEADER_MAP[header] || header;
//     const value = excelRow[header];
//     const v = validateDataType(field, value, rowIndex);
//     if (!v.isValid) typeErrors.push(v.error);
//     mapped[field] = getDefaultValue(field, value);
//   });
//   return mapped;
// };

// const validateBusinessRules = (mainData, diamondData, csData) => {
//   const errors = [];
//   const idSet = new Set(mainData.map(r => String(r.id ?? '')).filter(Boolean));
//   mainData.forEach((row, idx) => {
//     const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//     if (empty) return;
//     if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required`);
//     if (!row.ProductName)  errors.push(`Row ${idx + 8}: ProductName is required`);
//     if (!row.DesignNo)     errors.push(`Row ${idx + 8}: DesignNo is required`);
//   });
//   diamondData.forEach((row, idx) => {
//     const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//     if (empty) return;
//     if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
//     else if (!idSet.has(String(row.purchaseEntryId))) errors.push(`Diamond Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
//   });
//   csData.forEach((row, idx) => {
//     const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
//     if (empty) return;
//     if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`ColorStone Row ${idx + 2}: Entry Id required`);
//     else if (!idSet.has(String(row.purchaseEntryId))) errors.push(`ColorStone Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
//   });
//   return errors;
// };

// // ─── ValidationErrorsTable ────────────────────────────────────────────────────
// const ValidationErrorsTable = ({ errors }) => (
//   <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200 mt-3">
//     <div className="flex items-center gap-2 mb-3">
//       <XCircle className="w-5 h-5 text-red-600" />
//       <h3 className="font-semibold text-red-900">Data Type Errors ({errors.length})</h3>
//     </div>
//     <div className="overflow-auto max-h-72 border rounded bg-white">
//       <table className="min-w-full text-sm">
//         <thead className="bg-red-100 sticky top-0">
//           <tr>
//             {['#', 'Row', 'Field', 'Invalid Value', 'Expected', 'Message'].map(h => (
//               <th key={h} className="border border-red-200 px-3 py-2 text-left">{h}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {errors.map((err, i) => (
//             <tr key={i} className="hover:bg-red-50">
//               <td className="border border-red-200 px-3 py-2 text-center">{i + 1}</td>
//               <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 8}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-blue-700">{err.field}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-red-700">{String(err.value)}</td>
//               <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
//               <td className="border border-red-200 px-3 py-2">{err.message}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     <p className="mt-2 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
//       ⚠️ Fix these errors in your Excel file and re-upload.
//     </p>
//   </div>
// );

// /**
//  * Props:
//  *   onDataLoaded  – (groupedData: Array) => void   called on success
//  *   onReset       – () => void                     called when data is cleared
//  */
// const TemplateUpload = ({ onDataLoaded, onReset }) => {
//   const fileInputRef = useRef(null);
//   const [status, setStatus]           = useState(null);   // { type: 'success'|'error', message }
//   const [typeErrors, setTypeErrors]   = useState([]);
//   const [ruleErrors, setRuleErrors]   = useState([]);
//   const [hasData, setHasData]         = useState(false);

//   const resetAll = () => {
//     setStatus(null); setTypeErrors([]); setRuleErrors([]);
//     setHasData(false);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//     onReset?.();
//   };

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const wb          = XLSX.read(evt.target.result, { type: 'binary' });
//         const mainSheet   = wb.Sheets['Purchase Entry']       || wb.Sheets[wb.SheetNames[0]];
//         const diamondSheet = wb.Sheets['Diamond Details']     || wb.Sheets[wb.SheetNames[1]];
//         const csSheet     = wb.Sheets['Color Stone Details']  || wb.Sheets[wb.SheetNames[2]];

//         if (!mainSheet) {
//           setStatus({ type: 'error', message: 'Sheet "Purchase Entry" not found in this file.' });
//           return;
//         }

//         // Read header fields from rows 2–5
//         const supplierName  = mainSheet['B2']?.v || '';
//         const supplierCode  = mainSheet['B3']?.v || '';
//         const invoiceNumber = mainSheet['B4']?.v || '';
//         const invoiceDate   = parseExcelDate(mainSheet['B5']?.v || '');
//         console.log(invoiceDate)
//         const invoiceRef    = invoiceNumber ? `${invoiceNumber}|${invoiceDate}` : '';

//         // Parse rows (data starts at row 8 = index 6 for sheet_to_json range)
//         const rawMain     = XLSX.utils.sheet_to_json(mainSheet,   { range: 6, defval: '' });
//         const rawDiamonds = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
//         const rawCs       = csSheet      ? XLSX.utils.sheet_to_json(csSheet,      { defval: '' }) : [];

//         // Type-validate + map headers
//         const tErrors = [];
//         const mainData = rawMain.map((row, idx) => {
//           const mapped = mapExcelRow(row, idx, tErrors);
//           mapped.SupplierName  = supplierName;
//           mapped.suppCode      = supplierCode;
//           mapped.invoiceNumber = invoiceRef;
//           mapped.invoiceDate   = invoiceDate;
//           return mapped;
//         });

//         if (tErrors.length) {
//           setTypeErrors(tErrors); setRuleErrors([]);
//           setStatus({ type: 'error', message: `Data type errors found (${tErrors.length}). Fix and re-upload.` });
//           setHasData(false);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }

//         // Map diamond + color stone rows
//         const diamondData = rawDiamonds.map(row => ({
//           purchaseEntryId: row['Entry Id'] || 0,
//           STONE_FROM:   row['Stone From']    || null,
//           DiamondShape: row['Diamond Shape'] || null,
//           NoOfStones:   row['No Of Stones']  || 0,
//           Carat:  row['Carat']  || 0,
//           Rate:   row['Rate']   || 0,
//           Value:  row['Value']  || 0,
//           Weight: row['Weight'] || 0,
//         }));

//         const csData = rawCs.map(row => ({
//           purchaseEntryId: row['Entry Id'] || 0,
//           csShape:    row['Color Stone Shape'] || null,
//           NoOfStones: row['No Of Stones']      || 0,
//           Carat:  row['Carat']  || 0,
//           Rate:   row['Rate']   || 0,
//           Value:  row['Value']  || 0,
//           Weight: row['Weight'] || 0,
//         }));

//         // Business rule validation
//         const bErrors = validateBusinessRules(mainData, diamondData, csData);
//         if (bErrors.length) {
//           setRuleErrors(bErrors); setTypeErrors([]);
//           setStatus({ type: 'error', message: `Validation errors (${bErrors.length}). Fix and re-upload.` });
//           setHasData(false);
//           if (fileInputRef.current) fileInputRef.current.value = '';
//           return;
//         }

//         // Group: attach diamonds + color stones to each purchase entry
//         const grouped = mainData
//           .filter(r => !Object.entries(r).every(([key, val]) =>
//             ['SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate'].includes(key) ||
//             val === '' || val === null || val === undefined || val === 0
//           ))
//           .map(entry => {
//             const idStr = String(entry.id ?? '');
//             return {
//               ...entry,
//               diamonds:    diamondData.filter(d => String(d.purchaseEntryId) === idStr && Object.values(d).some(v => v !== '' && v !== 0 && v !== null)),
//               colorStones: csData.filter(c     => String(c.purchaseEntryId) === idStr && Object.values(c).some(v => v !== '' && v !== 0 && v !== null)),
//             };
//           });

//         setTypeErrors([]); setRuleErrors([]);
//         setStatus({ type: 'success', message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` });
//         setHasData(true);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//         onDataLoaded?.(grouped);

//       } catch (err) {
//         console.error(err);
//         setStatus({ type: 'error', message: 'Failed to read file. Check the format and try again.' });
//         setTypeErrors([]); setRuleErrors([]);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="space-y-3">
//       {/* Upload button row */}
//       <div className="flex items-center gap-3">
//         <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700 text-sm font-medium">
//           <Upload className="w-4 h-4" />
//           Upload Filled Excel
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFile}
//             className="hidden"
//           />
//         </label>

//         {hasData && (
//           <button
//             onClick={resetAll}
//             className="px-3 py-2 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 text-sm"
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* Status banner */}
//       {status && (
//         <div className={`p-3 rounded flex items-center gap-2 text-sm border-2 ${
//           status.type === 'error'
//             ? 'bg-red-50 text-red-800 border-red-300'
//             : 'bg-green-50 text-green-800 border-green-300'
//         }`}>
//           {status.type === 'success'
//             ? <CheckCircle className="w-5 h-5 shrink-0" />
//             : <AlertCircle className="w-5 h-5 shrink-0" />}
//           <span className="font-medium">{status.message}</span>
//         </div>
//       )}

//       {/* Data type errors table */}
//       {typeErrors.length > 0 && <ValidationErrorsTable errors={typeErrors} />}

//       {/* Business rule errors list */}
//       {ruleErrors.length > 0 && (
//         <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
//           <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2 text-sm">
//             <AlertCircle className="w-4 h-4" /> Validation Errors ({ruleErrors.length})
//           </div>
//           <div className="max-h-48 overflow-y-auto text-sm space-y-1">
//             {ruleErrors.map((err, i) => (
//               <div key={i} className="text-yellow-800">• {err}</div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateUpload;



// import React, { useRef, useState } from 'react';
// import * as XLSX from 'xlsx-js-style';
// import { Upload, AlertCircle, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
// import { COLUMN_HEADER_MAP, FIELD_DATA_TYPES } from '../constants/diamondConstants';
// import { parseExcelDate } from '../utils/excelBuilder';

// // ─── Required columns that MUST have values for a row to be considered ────────
// const REQUIRED_ROW_COLUMNS = ['Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No'];

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const isEmpty = (v) => v === '' || v === null || v === undefined;

// const isRowComplete = (rawRow) =>
//   REQUIRED_ROW_COLUMNS.every(col => !isEmpty(rawRow[col]));

// const getDefaultValue = (fieldName, value) => {
//   if (value !== null && value !== undefined && value !== '') return value;
//   const dataType = FIELD_DATA_TYPES[fieldName];
//   const requiredStrings = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber','po_number'];
//   switch (dataType) {
//     case 'int':     return 0;
//     case 'decimal': return 0;
//     case 'string':  return requiredStrings.includes(fieldName) ? '' : null;
//     default:        return null;
//   }
// };

// const validateDataType = (fieldName, value, rowIndex) => {
//   if (value === null || value === undefined || value === '') return { isValid: true, error: null };
//   const dataType = FIELD_DATA_TYPES[fieldName];
//   if (dataType === 'int') {
//     const n = Number(value);
//     if (isNaN(n) || !Number.isInteger(n))
//       return {
//         isValid: false,
//         error: { row: rowIndex, field: fieldName, value, expectedType: 'Integer', message: `Invalid integer: "${value}"` },
//       };
//   } else if (dataType === 'decimal') {
//     if (isNaN(Number(value)))
//       return {
//         isValid: false,
//         error: { row: rowIndex, field: fieldName, value, expectedType: 'Decimal/Number', message: `Invalid decimal: "${value}"` },
//       };
//   }
//   return { isValid: true, error: null };
// };

// const mapExcelRow = (excelRow, rowIndex, typeErrors) => {
//   const mapped = {};
//   Object.keys(excelRow).forEach(header => {
//     const field = COLUMN_HEADER_MAP[header] || header;
//     const value = excelRow[header];
//     const v = validateDataType(field, value, rowIndex);
//     if (!v.isValid) typeErrors.push(v.error);
//     mapped[field] = getDefaultValue(field, value);
//   });
//   return mapped;
// };

// const validateBusinessRules = (mainData, diamondData, csData) => {
//   const errors = [];
//   const idSet = new Set(mainData.map(r => String(r.id ?? '')).filter(Boolean));

//   mainData.forEach((row, idx) => {
//     if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required`);
//     if (!row.ProductName)  errors.push(`Row ${idx + 8}: ProductName is required`);
//     if (!row.DesignNo)     errors.push(`Row ${idx + 8}: DesignNo is required`);
//   });

//   diamondData.forEach((row, idx) => {
//     if (!row.purchaseEntryId && row.purchaseEntryId !== 0)
//       errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
//     else if (!idSet.has(String(row.purchaseEntryId)))
//       errors.push(`Diamond Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
//   });

//   csData.forEach((row, idx) => {
//     if (!row.purchaseEntryId && row.purchaseEntryId !== 0)
//       errors.push(`ColorStone Row ${idx + 2}: Entry Id required`);
//     else if (!idSet.has(String(row.purchaseEntryId)))
//       errors.push(`ColorStone Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
//   });

//   return errors;
// };

// const validateHeaderFields = (invoiceNumber, invoiceDate) => {
//   const errors = [];
//   if (!invoiceNumber || String(invoiceNumber).trim() === '')
//     errors.push('Invoice Number (cell B4) is empty — please fill it in the Excel template.');
//   if (!invoiceDate || String(invoiceDate).trim() === '' || invoiceDate === 'Invalid Date')
//     errors.push('Invoice Date (cell B5) is empty or invalid — please fill it in the Excel template.');
//   return errors;
// };

// // ─── ValidationErrorsTable ────────────────────────────────────────────────────
// const ValidationErrorsTable = ({ errors }) => (
//   <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200 mt-3">
//     <div className="flex items-center gap-2 mb-3">
//       <XCircle className="w-5 h-5 text-red-600" />
//       <h3 className="font-semibold text-red-900">Data Type Errors ({errors.length})</h3>
//     </div>
//     <div className="overflow-auto max-h-72 border rounded bg-white">
//       <table className="min-w-full text-sm">
//         <thead className="bg-red-100 sticky top-0">
//           <tr>
//             {['#', 'Row', 'Field', 'Invalid Value', 'Expected', 'Message'].map(h => (
//               <th key={h} className="border border-red-200 px-3 py-2 text-left">{h}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {errors.map((err, i) => (
//             <tr key={i} className="hover:bg-red-50">
//               <td className="border border-red-200 px-3 py-2 text-center">{i + 1}</td>
//               <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 8}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-blue-700">{err.field}</td>
//               <td className="border border-red-200 px-3 py-2 font-mono text-red-700">{String(err.value)}</td>
//               <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
//               <td className="border border-red-200 px-3 py-2">{err.message}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//     <p className="mt-2 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
//       ⚠️ Fix these errors in your Excel file and re-upload.
//     </p>
//   </div>
// );

// // ─── SkippedRowsNotice ────────────────────────────────────────────────────────
// const SkippedRowsNotice = ({ skippedRows }) => (
//   <div className="p-3 bg-blue-50 rounded border-2 border-blue-200 mt-3">
//     <div className="flex items-center gap-2 mb-2">
//       <AlertCircle className="w-4 h-4 text-blue-600" />
//       <span className="font-semibold text-blue-900 text-sm">
//         {skippedRows.length} row(s) skipped — missing required fields
//       </span>
//     </div>
//     <div className="max-h-40 overflow-y-auto text-sm space-y-1">
//       {skippedRows.map((info, i) => (
//         <div key={i} className="text-blue-800">
//           • Row {info.rowNumber}: missing{' '}
//           <span className="font-mono font-semibold">{info.missingCols.join(', ')}</span>
//         </div>
//       ))}
//     </div>
//     <p className="mt-2 text-xs text-blue-700">
//       These rows and their associated Diamond / Color Stone entries were ignored.
//       Fill in the required fields and re-upload if they should be included.
//     </p>
//   </div>
// );

// // ─── SupplierMismatchBanner ───────────────────────────────────────────────────
// const SupplierMismatchBanner = ({ excelName, excelCode, loginName, loginCode }) => (
//   <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg mt-3">
//     <div className="flex items-center gap-2 mb-2">
//       <ShieldAlert className="w-5 h-5 text-orange-600" />
//       <h3 className="font-semibold text-orange-900">Supplier Mismatch — Upload Blocked</h3>
//     </div>
//     <p className="text-sm text-orange-800 mb-3">
//       The supplier details in the Excel file do not match your login credentials.
//       You can only upload files for your own supplier account.
//     </p>
//     <div className="grid grid-cols-2 gap-3 text-sm">
//       <div className="bg-white border border-orange-200 rounded p-2">
//         <div className="text-xs text-gray-500 font-medium mb-1">Excel File</div>
//         <div><span className="text-gray-600">Name:</span> <span className="font-semibold text-red-700">{excelName || '(empty)'}</span></div>
//         <div><span className="text-gray-600">Code:</span> <span className="font-semibold text-red-700">{excelCode || '(empty)'}</span></div>
//       </div>
//       <div className="bg-white border border-orange-200 rounded p-2">
//         <div className="text-xs text-gray-500 font-medium mb-1">Logged-in Supplier</div>
//         <div><span className="text-gray-600">Name:</span> <span className="font-semibold text-green-700">{loginName || '(empty)'}</span></div>
//         <div><span className="text-gray-600">Code:</span> <span className="font-semibold text-green-700">{loginCode || '(empty)'}</span></div>
//       </div>
//     </div>
//     <p className="mt-2 text-xs text-orange-700">
//       ✏️ Update cells B2 (Supplier Name) and B3 (Supplier Code) in the Excel file to match your account, then re-upload.
//     </p>
//   </div>
// );

// // ─── TemplateUpload ───────────────────────────────────────────────────────────
// /**
//  * Props:
//  *   onDataLoaded  – (groupedData: Array) => void
//  *   onReset       – () => void
//  *   loginUser     – { supplierName: string, supplierCode: string }
//  */
// const TemplateUpload = ({ onDataLoaded, onReset, loginUser }) => {
//   const fileInputRef = useRef(null);
//   const [status, setStatus]                     = useState(null);
//   const [typeErrors, setTypeErrors]             = useState([]);
//   const [ruleErrors, setRuleErrors]             = useState([]);
//   const [supplierMismatch, setSupplierMismatch] = useState(null);
//   const [skippedRows, setSkippedRows]           = useState([]);
//   const [hasData, setHasData]                   = useState(false);

//   const clearFileInput = () => {
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const resetAll = () => {
//     setStatus(null);
//     setTypeErrors([]);
//     setRuleErrors([]);
//     setSupplierMismatch(null);
//     setSkippedRows([]);
//     setHasData(false);
//     clearFileInput();
//     onReset?.();
//   };

//   const handleFile = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Reset all state for fresh read
//     setStatus(null);
//     setTypeErrors([]);
//     setRuleErrors([]);
//     setSupplierMismatch(null);
//     setSkippedRows([]);
//     setHasData(false);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const wb           = XLSX.read(evt.target.result, { type: 'binary' });
//         const mainSheet    = wb.Sheets['Purchase Entry']      || wb.Sheets[wb.SheetNames[0]];
//         const diamondSheet = wb.Sheets['Diamond Details']     || wb.Sheets[wb.SheetNames[1]];
//         const csSheet      = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

//         if (!mainSheet) {
//           setStatus({ type: 'error', message: 'Sheet "Purchase Entry" not found in this file.' });
//           clearFileInput();
//           return;
//         }

//         // ── Read header cells (rows 2–5) ───────────────────────────────────
//         const supplierName  = String(mainSheet['B2']?.v || '').trim();
//         const supplierCode  = String(mainSheet['B3']?.v || '').trim();
//         const poNumber      = String(mainSheet['B4']?.v || '').trim();
//         const invoiceNumber = mainSheet['B5']?.v || '';
//         const invoiceDate   = parseExcelDate(mainSheet['B6']?.v || '');
//         console.log('invoiceDate:', invoiceDate);
//         const invoiceRef    = invoiceNumber ? `${invoiceNumber}|${invoiceDate}` : '';

//         // ── STEP 1: Supplier match check ───────────────────────────────────
//         if (loginUser) {
//           const loginName = String(loginUser.supplierName || '').trim().toLowerCase();
//           const loginCode = String(loginUser.supplierCode || '').trim().toLowerCase();
//           const excelName = supplierName.toLowerCase();
//           const excelCode = supplierCode.toLowerCase();

//           if (!loginName || !loginCode) {
//             setStatus({ type: 'error', message: 'Login supplier details are missing. Please re-login.' });
//             clearFileInput();
//             return;
//           }

//           if (excelName !== loginName || excelCode !== loginCode) {
//             setSupplierMismatch({
//               excelName: supplierName,
//               excelCode: supplierCode,
//               loginName: loginUser.supplierName,
//               loginCode: loginUser.supplierCode,
//             });
//             setStatus({ type: 'error', message: 'Supplier mismatch: Excel supplier does not match your login. Upload blocked.' });
//             clearFileInput();
//             return;
//           }
//         }

//         // ── STEP 2: Invoice header field validation ────────────────────────
//         const headerErrors = validateHeaderFields(invoiceNumber, invoiceDate);
//         if (headerErrors.length) {
//           setRuleErrors(headerErrors);
//           setStatus({ type: 'error', message: `Missing header fields (${headerErrors.length}). Fix and re-upload.` });
//           clearFileInput();
//           return;
//         }

//         // ── STEP 3: Parse all raw rows from sheet (data starts row 8) ──────
//         const allRawMain  = XLSX.utils.sheet_to_json(mainSheet,   { range: 6, defval: '' });
//         const rawDiamonds = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
//         const rawCs       = csSheet      ? XLSX.utils.sheet_to_json(csSheet,      { defval: '' }) : [];

//         if (allRawMain.length === 0) {
//           setStatus({ type: 'error', message: 'No data rows found in the Purchase Entry sheet.' });
//           clearFileInput();
//           return;
//         }

//         // ── STEP 4: Filter rows — keep only those with all required fields ──
//         // Collect skipped row info for the notice banner
//         const skipped = [];
//         const validRawMain = allRawMain.filter((row, idx) => {
//           const missingCols = REQUIRED_ROW_COLUMNS.filter(col => isEmpty(row[col]));
//           if (missingCols.length > 0) {
//             skipped.push({ rowNumber: idx + 8, missingCols });
//             return false; // exclude this row
//           }
//           return true;
//         });

//         // Build a set of valid Entry Ids so diamond/CS rows for skipped
//         // purchase rows are also excluded
//         const validEntryIdSet = new Set(
//           validRawMain.map(r => String(r['Entry Id'] ?? '')).filter(Boolean)
//         );

//         // Filter diamond and color stone rows to only those whose Entry Id
//         // belongs to a valid (non-skipped) purchase row
//         const filteredDiamonds = rawDiamonds.filter(
//           row => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
//         );
//         const filteredCs = rawCs.filter(
//           row => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
//         );

//         if (validRawMain.length === 0) {
//           setSkippedRows(skipped);
//           setStatus({
//             type: 'error',
//             message: 'No valid rows found. All rows are missing required fields (Entry Id, Product Name, Metal Type, Weight Mode, Design No).',
//           });
//           clearFileInput();
//           return;
//         }

//         // ── STEP 5: Type-validate + map valid rows ─────────────────────────
//         const tErrors  = [];
//         const mainData = validRawMain.map((row, idx) => {
//           const mapped         = mapExcelRow(row, idx, tErrors);
//           mapped.SupplierName  = supplierName;
//           mapped.suppCode      = supplierCode;
//           mapped.invoiceNumber = invoiceRef;
//           mapped.invoiceDate   = invoiceDate;
//           return mapped;
//         });

//         if (tErrors.length) {
//           setTypeErrors(tErrors);
//           setSkippedRows(skipped);
//           setStatus({ type: 'error', message: `Data type errors found (${tErrors.length}). Fix and re-upload.` });
//           clearFileInput();
//           return;
//         }

//         // ── STEP 6: Map diamond + color stone rows ─────────────────────────
//         const diamondData = filteredDiamonds.map(row => ({
//           purchaseEntryId: row['Entry Id'] || 0,
//           STONE_FROM:   row['Stone From']    || null,
//           DiamondShape: row['Diamond Shape'] || null,
//           NoOfStones:   row['No Of Stones']  || 0,
//           Carat:        row['Carat']  || 0,
//           Rate:         row['Rate']   || 0,
//           Value:        row['Value']  || 0,
//           Weight:       row['Weight'] || 0,
//         }));

//         const csData = filteredCs.map(row => ({
//           purchaseEntryId: row['Entry Id'] || 0,
//           csShape:    row['Color Stone Shape'] || null,
//           NoOfStones: row['No Of Stones']      || 0,
//           Carat:      row['Carat']  || 0,
//           Rate:       row['Rate']   || 0,
//           Value:      row['Value']  || 0,
//           Weight:     row['Weight'] || 0,
//         }));

//         // ── STEP 7: Business rule validation ──────────────────────────────
//         const bErrors = validateBusinessRules(mainData, diamondData, csData);
//         if (bErrors.length) {
//           setRuleErrors(bErrors);
//           setSkippedRows(skipped);
//           setStatus({ type: 'error', message: `Validation errors (${bErrors.length}). Fix and re-upload.` });
//           clearFileInput();
//           return;
//         }

//         // ── STEP 8: Group diamonds + color stones onto each purchase entry ─
//         const grouped = mainData.map(entry => {
//           const idStr = String(entry.id ?? '');
//           return {
//             ...entry,
//             diamonds: diamondData.filter(
//               d => String(d.purchaseEntryId) === idStr &&
//                    Object.values(d).some(v => v !== '' && v !== 0 && v !== null)
//             ),
//             colorStones: csData.filter(
//               c => String(c.purchaseEntryId) === idStr &&
//                    Object.values(c).some(v => v !== '' && v !== 0 && v !== null)
//             ),
//           };
//         });

//         // ── Success ────────────────────────────────────────────────────────
//         setTypeErrors([]);
//         setRuleErrors([]);
//         setSupplierMismatch(null);
//         setSkippedRows(skipped); // show skipped notice even on success
//         setStatus({
//           type: 'success',
//           message: `Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}${
//             skipped.length ? ` (${skipped.length} incomplete rows skipped)` : ''
//           }`,
//         });
//         setHasData(true);
//         clearFileInput();
//         onDataLoaded?.(grouped);

//       } catch (err) {
//         console.error(err);
//         setStatus({ type: 'error', message: 'Failed to read file. Check the format and try again.' });
//         setTypeErrors([]);
//         setRuleErrors([]);
//         setSupplierMismatch(null);
//         setSkippedRows([]);
//         clearFileInput();
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div className="space-y-3">
//       {/* Upload button row */}
//       <div className="flex items-center gap-3">
//         <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700 text-sm font-medium">
//           <Upload className="w-4 h-4" />
//           Upload Filled Excel
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".xlsx,.xls"
//             onChange={handleFile}
//             className="hidden"
//           />
//         </label>

//         {hasData && (
//           <button
//             onClick={resetAll}
//             className="px-3 py-2 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 text-sm"
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* Status banner */}
//       {status && (
//         <div className={`p-3 rounded flex items-center gap-2 text-sm border-2 ${
//           status.type === 'error'
//             ? 'bg-red-50 text-red-800 border-red-300'
//             : 'bg-green-50 text-green-800 border-green-300'
//         }`}>
//           {status.type === 'success'
//             ? <CheckCircle className="w-5 h-5 shrink-0" />
//             : <AlertCircle className="w-5 h-5 shrink-0" />}
//           <span className="font-medium">{status.message}</span>
//         </div>
//       )}

//       {/* Supplier mismatch banner */}
//       {supplierMismatch && (
//         <SupplierMismatchBanner
//           excelName={supplierMismatch.excelName}
//           excelCode={supplierMismatch.excelCode}
//           loginName={supplierMismatch.loginName}
//           loginCode={supplierMismatch.loginCode}
//         />
//       )}

//       {/* Skipped rows notice (shown on both success and error) */}
//       {skippedRows.length > 0 && <SkippedRowsNotice skippedRows={skippedRows} />}

//       {/* Data type errors table */}
//       {typeErrors.length > 0 && <ValidationErrorsTable errors={typeErrors} />}

//       {/* Business rule / header errors list */}
//       {ruleErrors.length > 0 && (
//         <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
//           <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2 text-sm">
//             <AlertCircle className="w-4 h-4" /> Validation Errors ({ruleErrors.length})
//           </div>
//           <div className="max-h-48 overflow-y-auto text-sm space-y-1">
//             {ruleErrors.map((err, i) => (
//               <div key={i} className="text-yellow-800">• {err}</div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TemplateUpload;



import React, { useRef, useState, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx-js-style';
import { Upload, AlertCircle, CheckCircle, XCircle, Trash2, Send } from 'lucide-react';
import { COLUMN_HEADER_MAP, FIELD_DATA_TYPES } from '../constants/diamondConstants';
import { DIA_API } from '../../../config/configData';

// ─── Sheet names exactly as in the Excel template ────────────────────────────
const MAIN_SHEET_NAME    = 'Purchase Entry';
const DIAMOND_SHEET_NAME = 'Diamond Details';
const CS_SHEET_NAME      = 'Color Stone Details';

// ─── Header row index (0-based) ───────────────────────────────────────────────
const MAIN_SHEET_HEADER_ROW = 3;

// ─── Required columns ────────────────────────────────────────────────────────
const REQUIRED_ROW_COLUMNS = ['Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const isEmpty = (v) => v === '' || v === null || v === undefined;

const isRowComplete = (rawRow) =>
  REQUIRED_ROW_COLUMNS.every((col) => !isEmpty(rawRow[col]));

const getDefaultValue = (fieldName, value) => {
  if (value !== null && value !== undefined && value !== '') return value;
  const dataType = FIELD_DATA_TYPES[fieldName];
  const requiredStrings = [
    'SupplierName', 'ProductName', 'DesignNo', 'MetalType',
    'WtMode', 'suppCode', 'invoiceNumber', 'po_number',
  ];
  switch (dataType) {
    case 'int':     return 0;
    case 'decimal': return 0;
    case 'string':  return requiredStrings.includes(fieldName) ? '' : null;
    default:        return null;
  }
};

const validateDataType = (fieldName, value, rowIndex) => {
  if (value === null || value === undefined || value === '')
    return { isValid: true, error: null };
  const dataType = FIELD_DATA_TYPES[fieldName];
  if (dataType === 'int') {
    const n = Number(value);
    if (isNaN(n) || !Number.isInteger(n))
      return {
        isValid: false,
        error: {
          row: rowIndex, field: fieldName, value,
          expectedType: 'Integer', message: `Invalid integer: "${value}"`,
        },
      };
  } else if (dataType === 'decimal') {
    if (isNaN(Number(value)))
      return {
        isValid: false,
        error: {
          row: rowIndex, field: fieldName, value,
          expectedType: 'Decimal/Number', message: `Invalid decimal: "${value}"`,
        },
      };
  }
  return { isValid: true, error: null };
};

const mapExcelRow = (excelRow, rowIndex, typeErrors) => {
  const mapped = {};
  Object.keys(excelRow).forEach((header) => {
    const field = COLUMN_HEADER_MAP[header] || header;
    const value = excelRow[header];
    const v = validateDataType(field, value, rowIndex);
    if (!v.isValid) typeErrors.push(v.error);
    mapped[field] = getDefaultValue(field, value);
  });
  return mapped;
};

const validateDuplicateDesignNo = (validRawMain) => {
  const designNoMap = new Map();
  validRawMain.forEach((row, idx) => {
    const designNo = String(row['Design No'] ?? '').trim();
    if (!designNo) return;
    if (!designNoMap.has(designNo)) designNoMap.set(designNo, []);
    designNoMap.get(designNo).push(idx + 6);
  });
  const duplicates = [];
  designNoMap.forEach((rows, designNo) => {
    if (rows.length > 1) duplicates.push({ designNo, rows });
  });
  return duplicates;
};

const validateBusinessRules = (mainData, diamondData, csData) => {
  const errors = [];
  const idSet = new Set(mainData.map((r) => String(r.id ?? '')).filter(Boolean));

  mainData.forEach((row, idx) => {
    if (!row.ProductName) errors.push(`Row ${idx + 6}: ProductName is required`);
    if (!row.DesignNo)    errors.push(`Row ${idx + 6}: DesignNo is required`);
  });

  diamondData.forEach((row, idx) => {
    if (!row.purchaseEntryId && row.purchaseEntryId !== 0)
      errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
    else if (!idSet.has(String(row.purchaseEntryId)))
      errors.push(`Diamond Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
  });

  csData.forEach((row, idx) => {
    if (!row.purchaseEntryId && row.purchaseEntryId !== 0)
      errors.push(`ColorStone Row ${idx + 2}: Entry Id required`);
    else if (!idSet.has(String(row.purchaseEntryId)))
      errors.push(`ColorStone Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
  });

  return errors;
};


// ─── Unified Error Card wrapper ───────────────────────────────────────────────
const normalizeNumericValue = (value, decimals = 3) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Number(value.toFixed(decimals)) : null;
  }
  const cleaned = String(value)
    .replace(/carats?|cts?/gi, '')
    .replace(/[\u20b9$,\s]/g, '')
    .replace(/[^\d.-]/g, '');
  if (!cleaned) return null;
  const number = Number(cleaned);
  if (!Number.isFinite(number)) return null;
  return Number(number.toFixed(decimals));
};

const normalizeCaratNumber = (value) => normalizeNumericValue(value, 3);

const normalizeRateNumber = (value) => normalizeNumericValue(value, 3);

const normalizeShape = (value) => String(value ?? '')
  .trim()
  .toUpperCase()
  .replace(/\b(DIAMOND|DIAMONDS|SHAPE|SHAPED)\b/g, '')
  .replace(/[^A-Z0-9]/g, '');

const formatMasterNumber = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return number % 1 === 0 ? String(number) : number.toFixed(3);
};

const collectArrayLeaves = (value, arrays = []) => {
  if (Array.isArray(value)) {
    arrays.push(value);
    value.forEach((item) => collectArrayLeaves(item, arrays));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectArrayLeaves(item, arrays));
  }
  return arrays;
};

const normalizeKeyName = (key) => key.replace(/[\s_-]/g, '').toLowerCase();

const findValueByKeyPattern = (record, patterns, normalizer = (value) => value) => {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = normalizeKeyName(key);
    if (patterns.some((pattern) => normalizedKey.includes(pattern))) {
      const normalizedValue = normalizer(value);
      if (normalizedValue !== null && normalizedValue !== undefined && normalizedValue !== '') {
        return { value: normalizedValue, key };
      }
    }
  }
  return null;
};

const findExactValueByKey = (record, keys, normalizer = (value) => value) => {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const normalizedKeys = new Set(keys.map(normalizeKeyName));
  for (const [key, value] of Object.entries(record)) {
    if (!normalizedKeys.has(normalizeKeyName(key))) continue;
    const normalizedValue = normalizer(value);
    if (normalizedValue !== null && normalizedValue !== undefined && normalizedValue !== '') {
      return { value: normalizedValue, key };
    }
  }
  return null;
};

const FROM_CARAT_PATTERNS = [
  'caratfromweight', 'fromcaratweight', 'caratfrom', 'fromcarat',
  'fromct', 'ctfrom', 'fromweight', 'fromwt',
  'mincarat', 'minimumcarat', 'minct',
  'fromcent', 'centfrom', 'mincent', 'minimumcent',
];

const TO_CARAT_PATTERNS = [
  'caratt0weight', 'carattoweight', 't0caratweight', 'tocaratweight',
  'caratto', 'tocarat', 'toct', 'ctto', 'toweight', 'towt',
  'maxcarat', 'maximumcarat', 'maxct',
  'tocent', 'centto', 'maxcent', 'maximumcent',
];

const SHAPE_PATTERNS = ['diamondshape', 'stoneshape', 'shape'];
const RATE_PATTERNS = ['ratepercarat', 'rateperct', 'ratepct', 'diamondrate', 'diarate'];

const findCaratByKeyPattern = (record, patterns) =>
  findValueByKeyPattern(record, patterns, normalizeCaratNumber);

const findRateByKeyPattern = (record) =>
  findValueByKeyPattern(record, RATE_PATTERNS, normalizeRateNumber) ||
  findExactValueByKey(record, ['rate'], normalizeRateNumber);

const findShapeByKeyPattern = (record) =>
  findValueByKeyPattern(record, SHAPE_PATTERNS, (value) => String(value ?? '').trim());

const getRangeTypeFromKeys = (...keys) =>
  keys.some((key) => normalizeKeyName(String(key || '')).includes('cent')) ? 'cent' : 'carat';

const buildCaratMaster = (payload) => {
  const arrayRows = collectArrayLeaves(payload).flat(Infinity);
  const rows = (arrayRows.length > 0 ? arrayRows : [payload])
    .filter((row) => row && typeof row === 'object' && !Array.isArray(row));
  const ranges = [];
  const rateRules = [];

  rows.forEach((row) => {
    const fromInfo = findCaratByKeyPattern(row, FROM_CARAT_PATTERNS);
    const toInfo = findCaratByKeyPattern(row, TO_CARAT_PATTERNS);
    if (!fromInfo || !toInfo) return;

    const min = Math.min(fromInfo.value, toInfo.value);
    const max = Math.max(fromInfo.value, toInfo.value);
    const rangeType = getRangeTypeFromKeys(fromInfo.key, toInfo.key);
    const range = { min, max, rangeType };
    ranges.push(range);

    const shapeInfo = findShapeByKeyPattern(row);
    const rateInfo = findRateByKeyPattern(row);
    const normalizedShape = normalizeShape(shapeInfo?.value);

    if (normalizedShape && rateInfo) {
      rateRules.push({
        ...range,
        shape: shapeInfo.value,
        normalizedShape,
        rate: rateInfo.value,
      });
    }
  });

  return {
    ranges,
    rateRules,
    hasRules: ranges.length > 0 || rateRules.length > 0,
    hasCentRanges: ranges.some((range) => range.rangeType === 'cent'),
    hasCaratRanges: ranges.some((range) => range.rangeType === 'carat'),
    hasRateRules: rateRules.length > 0,
  };
};

const isValueAllowedForRangeType = (value, master, rangeType) => {
  const number = normalizeCaratNumber(value);
  if (number === null) return false;
  return master.ranges.some((range) => (
    range.rangeType === rangeType &&
    number >= range.min &&
    number <= range.max
  ));
};

const normalizeStoneCount = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(String(value).replace(/,/g, '').trim());
  if (!Number.isFinite(number) || number <= 0) return null;
  return number;
};

const calculateCent = (carat, noOfStones) => {
  const caratNumber = normalizeCaratNumber(carat);
  const stoneCount = normalizeStoneCount(noOfStones);
  if (caratNumber === null || stoneCount === null) return null;
  return Number((caratNumber / stoneCount).toFixed(3));
};

const describeCaratMaster = (master) => {
  if (master.rateRules.length > 0) {
    return master.rateRules
      .slice(0, 6)
      .map(({ shape, min, max, rangeType, rate }) =>
        `${shape} ${min.toFixed(3)}-${max.toFixed(3)} ${rangeType} @ ${formatMasterNumber(rate)}`)
      .join(', ');
  }
  if (master.ranges.length > 0) {
    return master.ranges
      .slice(0, 6)
      .map(({ min, max, rangeType }) => `${min.toFixed(3)}-${max.toFixed(3)} ${rangeType}`)
      .join(', ');
  }
  return '';
};

const isDetailRowUsed = (row) =>
  Object.entries(row).some(([key, value]) => (
    key !== 'purchaseEntryId' &&
    key !== '_excelRowNumber' &&
    value !== '' &&
    value !== null &&
    value !== undefined &&
    value !== 0
  ));

const fetchCaratMaster = async (supplierCode) => {
  const code = String(supplierCode || '').trim();
  if (!code) {
    throw new Error('Supplier code is missing. Cannot validate carat details.');
  }

  const response = await axios.get(`${DIA_API}/get_carat_master/${code}`);
  const master = buildCaratMaster(response.data);
  if (!master.hasRules) {
    throw new Error(`No carat master rules found for supplier code ${code}.`);
  }
  return master;
};

const getRowShape = (row) => row.DiamondShape ?? row.csShape ?? row.Shape ?? '';

const findMatchingRateRule = ({ master, shape, carat, calculatedCent }) => {
  const normalizedShape = normalizeShape(shape);
  if (!normalizedShape) return { status: 'missing-shape' };

  const shapeRules = master.rateRules.filter((rule) => rule.normalizedShape === normalizedShape);
  if (shapeRules.length === 0) return { status: 'missing-shape-master' };

  const matchedRule = shapeRules.find((rule) => {
    const lookupValue = rule.rangeType === 'cent' ? calculatedCent : carat;
    return lookupValue !== null && lookupValue >= rule.min && lookupValue <= rule.max;
  });

  if (!matchedRule) return { status: 'missing-range', shapeRules };
  return {
    status: 'matched',
    rule: matchedRule,
    lookupValue: matchedRule.rangeType === 'cent' ? calculatedCent : carat,
  };
};

const validateCaratDetails = async ({ diamondData, supplierCode }) => {
  const hasCaratRows = diamondData.some(isDetailRowUsed);
  if (!hasCaratRows) {
    return { errors: [], masterSummary: '' };
  }

  const master = await fetchCaratMaster(supplierCode);
  const errors = [];

  const pushValidationError = (sheetName, row, idx, extra = {}) => {
    errors.push({
      sheetName,
      rowNumber: row._excelRowNumber || idx + 2,
      entryId: row.purchaseEntryId || '',
      shape: getRowShape(row),
      carat: row.Carat,
      noOfStones: row.NoOfStones,
      cent: '',
      enteredRate: row.Rate,
      masterRate: '',
      range: '',
      ...extra,
    });
  };

  const checkRows = (rows, sheetName, { validateRate = false } = {}) => {
    rows.forEach((row, idx) => {
      if (!isDetailRowUsed(row)) return;

      const caratNumber = normalizeCaratNumber(row.Carat);
      if (caratNumber === null) {
        pushValidationError(sheetName, row, idx, {
          message: 'Carat is missing or invalid.',
        });
        return;
      }

      const calculatedCent = calculateCent(row.Carat, row.NoOfStones);
      if (calculatedCent === null) {
        pushValidationError(sheetName, row, idx, {
          message: 'No Of Stones is missing or invalid.',
        });
        return;
      }

      if (master.hasCentRanges && !isValueAllowedForRangeType(calculatedCent, master, 'cent')) {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: 'Calculated cent is outside the supplier cent range.',
        });
      }

      if (!master.hasCentRanges && !master.hasRateRules && master.hasCaratRanges &&
          !isValueAllowedForRangeType(caratNumber, master, 'carat')) {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: 'Carat is outside the supplier carat range.',
        });
      }

      if (!validateRate || !master.hasRateRules) return;

      const rateNumber = normalizeRateNumber(row.Rate);
      if (rateNumber === null) {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: 'Rate is missing or invalid.',
        });
        return;
      }

      const match = findMatchingRateRule({
        master,
        shape: getRowShape(row),
        carat: caratNumber,
        calculatedCent,
      });

      if (match.status === 'missing-shape') {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: 'Diamond Shape is missing. Cannot verify rate.',
        });
        return;
      }

      if (match.status === 'missing-shape-master') {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: `No carat master rate found for shape "${getRowShape(row)}".`,
        });
        return;
      }

      if (match.status === 'missing-range') {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          message: `No carat master rate found for shape "${getRowShape(row)}" and carat ${formatMasterNumber(caratNumber)}.`,
        });
        return;
      }

      if (Math.abs(rateNumber - match.rule.rate) > 0.001) {
        pushValidationError(sheetName, row, idx, {
          cent: calculatedCent,
          masterRate: formatMasterNumber(match.rule.rate),
          range: `${match.rule.min.toFixed(3)}-${match.rule.max.toFixed(3)} ${match.rule.rangeType}`,
          message: `Rate wrongly entered. Expected ${formatMasterNumber(match.rule.rate)} for ${match.rule.shape}.`,
        });
      }
    });
  };

  checkRows(diamondData, DIAMOND_SHEET_NAME, { validateRate: true });

  return {
    errors,
    masterSummary: describeCaratMaster(master),
  };
};

const ErrorCard = ({ icon: Icon, iconColor, borderColor, bgColor, headerColor, title, children, footerText, footerColor, footerBg, footerBorder }) => (
  <div className={`rounded-lg border-2 ${borderColor} ${bgColor} overflow-hidden`}>
    <div className={`flex items-center gap-2 px-4 py-3 border-b ${borderColor}`}>
      <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
      <span className={`font-semibold text-sm ${headerColor}`}>{title}</span>
    </div>
    <div className="p-4">{children}</div>
    {footerText && (
      <div className={`mx-4 mb-4 text-xs rounded px-3 py-2 ${footerColor} ${footerBg} border ${footerBorder}`}>
        ⚠️ {footerText}
      </div>
    )}
  </div>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
const ValidationErrorsTable = ({ errors }) => (
  <ErrorCard
    icon={XCircle}
    iconColor="text-red-500"
    borderColor="border-red-200"
    bgColor="bg-red-50"
    headerColor="text-red-800"
    title={`Data Type Errors (${errors.length})`}
    footerText="Fix these errors in your Excel file and re-upload."
    footerColor="text-yellow-800"
    footerBg="bg-yellow-50"
    footerBorder="border-yellow-200"
  >
    <div className="overflow-auto max-h-64 rounded border border-red-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-red-100 sticky top-0">
          <tr>
            {['#', 'Row', 'Field', 'Invalid Value', 'Expected', 'Message'].map((h) => (
              <th key={h} className="border-b border-red-200 px-3 py-2 text-left font-semibold text-red-800 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {errors.map((err, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
              <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
              <td className="px-3 py-2 font-medium text-gray-800">{err.row + 6}</td>
              <td className="px-3 py-2 font-mono text-blue-700">{err.field}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.value)}</td>
              <td className="px-3 py-2 text-gray-600">{err.expectedType}</td>
              <td className="px-3 py-2 text-gray-700">{err.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ErrorCard>
);

const DuplicateDesignNoNotice = ({ duplicates }) => (
  <ErrorCard
    icon={XCircle}
    iconColor="text-orange-500"
    borderColor="border-orange-200"
    bgColor="bg-orange-50"
    headerColor="text-orange-800"
    title={`Duplicate Design No${duplicates.length > 1 ? 's' : ''} Found (${duplicates.length})`}
    footerText="Each Design No must be unique. Fix duplicates in your Excel file and re-upload."
    footerColor="text-orange-800"
    footerBg="bg-orange-100"
    footerBorder="border-orange-200"
  >
    <div className="overflow-auto max-h-56 rounded border border-orange-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-orange-100 sticky top-0">
          <tr>
            {['#', 'Design No', 'Duplicate in Excel Rows'].map((h) => (
              <th key={h} className="border-b border-orange-200 px-3 py-2 text-left font-semibold text-orange-800 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {duplicates.map((dup, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-orange-50'}>
              <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
              <td className="px-3 py-2 font-mono font-bold text-orange-800">{dup.designNo}</td>
              <td className="px-3 py-2 text-red-700 font-medium">
                {dup.rows.map((r, ri) => (
                  <span key={ri} className="inline-block mr-1">
                    Row {r}{ri < dup.rows.length - 1 ? ',' : ''}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ErrorCard>
);

const SkippedRowsNotice = ({ skippedRows }) => (
  <ErrorCard
    icon={AlertCircle}
    iconColor="text-blue-500"
    borderColor="border-blue-200"
    bgColor="bg-blue-50"
    headerColor="text-blue-800"
    title={`${skippedRows.length} Row${skippedRows.length > 1 ? 's' : ''} Skipped — Missing Required Fields`}
    footerText="Fill in the required fields and re-upload if these rows should be included."
    footerColor="text-blue-700"
    footerBg="bg-blue-100"
    footerBorder="border-blue-200"
  >
    <div className="max-h-40 overflow-y-auto space-y-1">
      {skippedRows.map((info, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-blue-800">
          <span className="shrink-0 text-blue-400 mt-0.5">•</span>
          <span>
            Row <span className="font-semibold">{info.rowNumber + 6}</span>
            {' — missing '}
            <span className="font-mono font-semibold text-blue-900">
              {info.missingCols.join(', ')}
            </span>
          </span>
        </div>
      ))}
    </div>
  </ErrorCard>
);

const RuleErrorsNotice = ({ ruleErrors }) => (
  <ErrorCard
    icon={AlertCircle}
    iconColor="text-yellow-600"
    borderColor="border-yellow-200"
    bgColor="bg-yellow-50"
    headerColor="text-yellow-800"
    title={`Validation Errors (${ruleErrors.length})`}
    footerText="Fix the above issues in your Excel file and re-upload."
    footerColor="text-yellow-800"
    footerBg="bg-yellow-100"
    footerBorder="border-yellow-200"
  >
    <div className="max-h-48 overflow-y-auto space-y-1">
      {ruleErrors.map((err, i) => (
        <div key={i} className="flex items-start gap-2 text-xs text-yellow-800">
          <span className="shrink-0 text-yellow-500 mt-0.5">•</span>
          <span>{err}</span>
        </div>
      ))}
    </div>
  </ErrorCard>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CaratErrorsNotice = ({ caratErrors, masterSummary }) => (
  <ErrorCard
    icon={XCircle}
    iconColor="text-red-500"
    borderColor="border-red-200"
    bgColor="bg-red-50"
    headerColor="text-red-800"
    title={`Carat / Rate Master Validation Errors (${caratErrors.length})`}
    footerText={masterSummary
      ? `Master rules: ${masterSummary}. Fix the wrongly entered values and re-upload.`
      : 'Fix the wrongly entered carat, no-of-stones, shape, or rate values and re-upload.'}
    footerColor="text-red-800"
    footerBg="bg-red-100"
    footerBorder="border-red-200"
  >
    <div className="overflow-auto max-h-64 rounded border border-red-200 bg-white">
      <table className="min-w-full text-xs">
        <thead className="bg-red-100 sticky top-0">
          <tr>
            {[
              '#', 'Sheet', 'Row', 'Entry Id', 'Shape', 'Carat',
              'No Of Stones', 'Cent', 'Entered Rate', 'Master Rate', 'Range', 'Message',
            ].map((h) => (
              <th key={h} className="border-b border-red-200 px-3 py-2 text-left font-semibold text-red-800 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {caratErrors.map((err, i) => (
            <tr key={`${err.sheetName}-${err.rowNumber}-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
              <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
              <td className="px-3 py-2 font-medium text-gray-800">{err.sheetName}</td>
              <td className="px-3 py-2 font-medium text-gray-800">{err.rowNumber}</td>
              <td className="px-3 py-2 font-mono text-blue-700">{err.entryId}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.shape ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.carat ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.noOfStones ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.cent ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.enteredRate ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.masterRate ?? '')}</td>
              <td className="px-3 py-2 font-mono text-red-700">{String(err.range ?? '')}</td>
              <td className="px-3 py-2 text-gray-700">{err.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </ErrorCard>
);

const TemplateUpload = ({ onDataLoaded, onReset, selectedPO, supplierName, supplierCode }) => {
  const fileInputRef                                = useRef(null);
  const [status, setStatus]                         = useState(null);
  const [typeErrors, setTypeErrors]                 = useState([]);
  const [ruleErrors, setRuleErrors]                 = useState([]);
  const [skippedRows, setSkippedRows]               = useState([]);
  const [duplicateDesignNos, setDuplicateDesignNos] = useState([]);
  const [caratErrors, setCaratErrors]               = useState([]);
  const [caratMasterSummary, setCaratMasterSummary] = useState('');
  const [validatingCarats, setValidatingCarats]     = useState(false);
  const [hasData, setHasData]                       = useState(false);
  const [parsedGrouped, setParsedGrouped]           = useState(null);
  const [invoiceNo, setInvoiceNo]                   = useState('');
  const [invoiceDateVal, setInvoiceDateVal]         = useState('');
  const [submitError, setSubmitError]               = useState('');

  const clearFileInput = () => { if (fileInputRef.current) fileInputRef.current.value = ''; };

  const resetAll = () => {
    setStatus(null);
    setTypeErrors([]);
    setRuleErrors([]);
    setSkippedRows([]);
    setDuplicateDesignNos([]);
    setCaratErrors([]);
    setCaratMasterSummary('');
    setValidatingCarats(false);
    setHasData(false);
    setParsedGrouped(null);
    setInvoiceNo('');
    setInvoiceDateVal('');
    setSubmitError('');
    clearFileInput();
    onReset?.();
  };

  // ── Summary totals computed from parsed data ──────────────────────────────
  const summary = useMemo(() => {
    if (!parsedGrouped || parsedGrouped.length === 0) return null;
    const sum = (key) =>
      parsedGrouped.reduce((acc, r) => acc + (parseFloat(r[key]) || 0), 0);
    const base = {
      entries:        parsedGrouped.length,
      totalPCS:       sum('PCS'),
      // Gold
      totalGoldWt:    sum('GoldWt'),
      totalGNetWt:    sum('GNetWt'),
      totalGoldValue: sum('GoldValue'),
      // Platinum
      totalPTWt:      sum('PTWt'),
      totalPNetWt:    sum('PNetWt'),
      totalPTValue:   sum('PTValue'),
      // Diamond
      totalDCarat:    sum('DCarat'),
      totalDiaVal:    sum('DiamondValue'),
      totalDiaWt:     sum('DiamondWt'),
      // Color Stone
      totalCSCarat:   sum('CLSCarat'),
      totalCSAmt:     sum('CSAmount'),
      // Totals
      totalValue:     sum('TotalValue'),
      totalGrandTotal: sum('GrandTotal'),
    };
    return {
      ...base,
      grandWt:       base.totalGoldWt  + base.totalPTWt  + base.totalDiaWt,
      grandNetWt:    base.totalGNetWt  + base.totalPNetWt,
      grandCarat:    base.totalDCarat  + base.totalCSCarat,
      grandValueAmt: base.totalGoldValue + base.totalPTValue + base.totalDiaVal + base.totalCSAmt,
    };
  }, [parsedGrouped]);

  // ── Submit: attach invoice fields and fire callback ───────────────────────
  const handleSubmit = () => {
    setSubmitError('');
    if (!invoiceNo.trim()) {
      setSubmitError('Invoice No is required.');
      return;
    }
    if (!invoiceDateVal) {
      setSubmitError('Invoice Date is required.');
      return;
    }
    const invoiceRef = `${invoiceNo.trim()}|${invoiceDateVal}`;
    const finalData = parsedGrouped.map((entry) => ({
      ...entry,
      invoiceNumber: invoiceRef,
      invoiceDate:   invoiceDateVal,
    }));
    onDataLoaded?.(finalData);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedPO) {
      setStatus({ type: 'error', message: 'Please select a PO number before uploading.' });
      clearFileInput();
      return;
    }

    setStatus(null);
    setTypeErrors([]);
    setRuleErrors([]);
    setSkippedRows([]);
    setDuplicateDesignNos([]);
    setCaratErrors([]);
    setCaratMasterSummary('');
    setHasData(false);
    setParsedGrouped(null);
    setInvoiceNo('');
    setInvoiceDateVal('');
    setSubmitError('');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });

        const mainSheet    = wb.Sheets[MAIN_SHEET_NAME]    ?? wb.Sheets[wb.SheetNames[0]];
        const diamondSheet = wb.Sheets[DIAMOND_SHEET_NAME] ?? wb.Sheets[wb.SheetNames[1]];
        const csSheet      = wb.Sheets[CS_SHEET_NAME]      ?? wb.Sheets[wb.SheetNames[2]];

        if (!mainSheet) {
          setStatus({ type: 'error', message: `Sheet "${MAIN_SHEET_NAME}" not found.` });
          clearFileInput();
          return;
        }

        // STEP 1: Parse rows (invoice no/date will be entered manually)
        const allRawMain = XLSX.utils.sheet_to_json(mainSheet, {
          range: MAIN_SHEET_HEADER_ROW,
          defval: '',
        });

        const rawDiamonds = diamondSheet
          ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' })
          : [];
        const rawCs = csSheet
          ? XLSX.utils.sheet_to_json(csSheet, { defval: '' })
          : [];
        const rawDiamondsWithRows = rawDiamonds.map((row, index) => ({
          row,
          excelRowNumber: index + 2,
        }));
        const rawCsWithRows = rawCs.map((row, index) => ({
          row,
          excelRowNumber: index + 2,
        }));

        if (allRawMain.length === 0) {
          setStatus({ type: 'error', message: 'No data rows found in the Purchase Entry sheet.' });
          clearFileInput();
          return;
        }

        // STEP 3: Filter complete rows
        const skipped = [];
        const validRawMain = allRawMain.filter((row, idx) => {
          const missingCols = REQUIRED_ROW_COLUMNS.filter((col) => isEmpty(row[col]));
          if (missingCols.length > 0) {
            skipped.push({ rowNumber: idx, missingCols });
            return false;
          }
          return true;
        });

        // STEP 4: Duplicate Design No check — BLOCK SAVE
        const duplicates = validateDuplicateDesignNo(validRawMain);
        if (duplicates.length > 0) {
          setDuplicateDesignNos(duplicates);
          setSkippedRows(skipped);
          setStatus({
            type: 'error',
            message: `Duplicate Design No found (${duplicates.length}). Each Design No must be unique. Fix and re-upload.`,
          });
          clearFileInput();
          return; // ← Save is blocked here
        }

        const validEntryIdSet = new Set(
          validRawMain.map((r) => String(r['Entry Id'] ?? '')).filter(Boolean)
        );

        const filteredDiamonds = rawDiamondsWithRows.filter(
          ({ row }) => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
        );
        const filteredCs = rawCsWithRows.filter(
          ({ row }) => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
        );

        if (validRawMain.length === 0) {
          setSkippedRows(skipped);
          setStatus({
            type: 'error',
            message: 'No valid rows found. All rows are missing required fields.',
          });
          clearFileInput();
          return;
        }

        // STEP 5: Type-validate + map (invoice fields attached later at submit)
        const tErrors  = [];
        const mainData = validRawMain.map((row, idx) => {
          const mapped        = mapExcelRow(row, idx, tErrors);
          mapped.SupplierName = supplierName;
          mapped.suppCode     = supplierCode;
          mapped.po_number    = selectedPO;
          return mapped;
        });

        if (tErrors.length) {
          setTypeErrors(tErrors);
          setSkippedRows(skipped);
          setStatus({ type: 'error', message: `Data type errors found (${tErrors.length}). Fix and re-upload.` });
          clearFileInput();
          return;
        }

        // STEP 6: Map Diamond rows
        const diamondData = filteredDiamonds.map(({ row, excelRowNumber }) => ({
          purchaseEntryId: row['Entry Id']      || 0,
          STONE_FROM:      row['Stone From']    || null,
          DiamondShape:    row['Diamond Shape'] || null,
          NoOfStones:      row['No Of Stones']  || 0,
          Carat:           row['Carat']         || 0,
          Rate:            row['Rate']          || 0,
          Value:           row['Value']         || 0,
          Weight:          row['Weight']        || 0,
          _excelRowNumber: excelRowNumber,
        }));

        // STEP 7: Map Color Stone rows
        const csData = filteredCs.map(({ row, excelRowNumber }) => ({
          purchaseEntryId: row['Entry Id']          || 0,
          csShape:         row['Color Stone Shape'] || null,
          NoOfStones:      row['No Of Stones']      || 0,
          Carat:           row['Carat']             || 0,
          Rate:            row['Rate']              || 0,
          Value:           row['Value']             || 0,
          Weight:          row['Weight']            || 0,
          _excelRowNumber: excelRowNumber,
        }));

        // STEP 8: Business rule validation — BLOCK SAVE
        const bErrors = validateBusinessRules(mainData, diamondData, csData);
        if (bErrors.length) {
          setRuleErrors(bErrors);
          setSkippedRows(skipped);
          setStatus({ type: 'error', message: `Validation errors (${bErrors.length}). Fix and re-upload.` });
          clearFileInput();
          return;
        }

        // STEP 9: Validate carat/shape/rate against supplier master
        let caratValidation;
        try {
          setValidatingCarats(true);
          caratValidation = await validateCaratDetails({
            diamondData,
            supplierCode,
          });
        } catch (err) {
          setStatus({
            type: 'error',
            message: err.message || 'Unable to validate carat details. Please try again.',
          });
          setSkippedRows(skipped);
          clearFileInput();
          return;
        } finally {
          setValidatingCarats(false);
        }

        if (caratValidation.errors.length > 0) {
          setCaratErrors(caratValidation.errors);
          setCaratMasterSummary(caratValidation.masterSummary);
          setSkippedRows(skipped);
          setStatus({
            type: 'error',
            message: `Carat/rate validation failed (${caratValidation.errors.length}). Fix and re-upload.`,
          });
          clearFileInput();
          return;
        }

        // STEP 9: Group diamonds + color stones
        const grouped = mainData.map((entry) => {
          const idStr = String(entry.id ?? '');
          return {
            ...entry,
            diamonds: diamondData
              .filter(
                (d) => String(d.purchaseEntryId) === idStr &&
                       Object.entries(d).some(([key, value]) => key !== '_excelRowNumber' && value !== '' && value !== 0 && value !== null)
              )
              .map(({ _excelRowNumber, ...diamond }) => diamond),
            colorStones: csData
              .filter(
                (c) => String(c.purchaseEntryId) === idStr &&
                       Object.entries(c).some(([key, value]) => key !== '_excelRowNumber' && value !== '' && value !== 0 && value !== null)
              )
              .map(({ _excelRowNumber, ...colorStone }) => colorStone),
          };
        });

        // ── SUCCESS — store parsed data; user fills invoice fields then submits
        setTypeErrors([]);
        setRuleErrors([]);
        setDuplicateDesignNos([]);
        setCaratErrors([]);
        setCaratMasterSummary(caratValidation.masterSummary);
        setSkippedRows(skipped);
        setParsedGrouped(grouped);
        setHasData(true);
        clearFileInput();

      } catch (err) {
        setStatus({ type: 'error', message: 'Failed to read file. Check the format and try again.' });
        setTypeErrors([]);
        setRuleErrors([]);
        setSkippedRows([]);
        setDuplicateDesignNos([]);
        setCaratErrors([]);
        setCaratMasterSummary('');
        setValidatingCarats(false);
        clearFileInput();
      }
    };
    reader.readAsBinaryString(file);
  };

  const fmt = (n) => (n % 1 === 0 ? n.toLocaleString() : n.toFixed(3));

  return (
    <div className="space-y-3">

      {/* ── Toolbar row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Upload button */}
        <label
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors select-none ${
            !selectedPO || validatingCarats
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer active:bg-blue-800'
          }`}
        >
          <Upload className="w-4 h-4 shrink-0" />
          {validatingCarats ? 'Validating Master...' : 'Upload Filled Excel'}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            disabled={!selectedPO || validatingCarats}
            className="hidden"
          />
        </label>

        {/* Clear button */}
        {hasData && (
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 active:bg-gray-300 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            Clear
          </button>
        )}

        {/* PO / Supplier pill */}
        {selectedPO && supplierName && (
          <div className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-3 py-1.5 font-medium">
            <span className="text-indigo-400">PO:</span>
            <span>{selectedPO}</span>
            <span className="text-indigo-300">·</span>
            <span>{supplierName}</span>
            {supplierCode && (
              <>
                <span className="text-indigo-300">·</span>
                <span className="font-mono text-indigo-500">{supplierCode}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Error status banner (only shown on errors) ──────────────────── */}
      {status && status.type === 'error' && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{status.message}</span>
        </div>
      )}

      {validatingCarats && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium bg-blue-50 border-blue-200 text-blue-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-blue-500" />
          <span>Validating diamond carat, shape, and rate details against supplier master...</span>
        </div>
      )}

      {/* ── Error / notice cards ─────────────────────────────────────────── */}
      {/* {skippedRows.length > 0        && <SkippedRowsNotice      skippedRows={skippedRows} />} */}
      {duplicateDesignNos.length > 0 && <DuplicateDesignNoNotice duplicates={duplicateDesignNos} />}
      {typeErrors.length > 0         && <ValidationErrorsTable   errors={typeErrors} />}
      {ruleErrors.length > 0         && <RuleErrorsNotice         ruleErrors={ruleErrors} />}
      {caratErrors.length > 0        && <CaratErrorsNotice        caratErrors={caratErrors} masterSummary={caratMasterSummary} />}

      {/* ── Summary + Invoice entry (shown after successful parse) ───────── */}
      {summary && (
        <div className="rounded-lg border border-green-200 bg-green-50 overflow-hidden">

          {/* Summary header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
            <span className="font-semibold text-sm text-green-800">
              Upload Summary — {summary.entries} {summary.entries === 1 ? 'Entry' : 'Entries'} Loaded
              {skippedRows.length > 0 && (
                <span className="ml-2 text-xs font-normal text-green-600">
                  ({skippedRows.length} row{skippedRows.length > 1 ? 's' : ''} skipped)
                </span>
              )}
            </span>
          </div>

          {/* Totals — categorised */}
          {/* Summary Table */}
          <div className="overflow-auto border-b border-green-200">
            <table className="min-w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase tracking-wide">
                  <th className="border border-gray-200 px-3 py-2 text-left font-semibold w-28">Category</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">Entries</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">PCS</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">Wt</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">Net Wt</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">Carat</th>
                  <th className="border border-gray-200 px-3 py-2 text-right font-semibold">Value / Amt</th>
                </tr>
              </thead>
              <tbody>
                {/* General */}
                <tr className="bg-emerald-50">
                  <td className="border border-gray-200 px-3 py-2 font-semibold text-emerald-700">General</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{summary.entries}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalPCS)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                </tr>
                {/* Gold */}
                <tr className="bg-yellow-50">
                  <td className="border border-gray-200 px-3 py-2 font-semibold text-yellow-700">Gold</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalGoldWt)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalGNetWt)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalGoldValue)}</td>
                </tr>
                {/* Platinum */}
                <tr className="bg-slate-50">
                  <td className="border border-gray-200 px-3 py-2 font-semibold text-slate-600">Platinum</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalPTWt)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalPNetWt)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalPTValue)}</td>
                </tr>
                {/* Diamond */}
                <tr className="bg-blue-50">
                  <td className="border border-gray-200 px-3 py-2 font-semibold text-blue-700">Diamond</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalDiaWt)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalDCarat)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalDiaVal)}</td>
                </tr>
                {/* Color Stone */}
                <tr className="bg-purple-50">
                  <td className="border border-gray-200 px-3 py-2 font-semibold text-purple-700">Color Stone</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right text-gray-500">0</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalCSCarat)}</td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-bold text-gray-800">{fmt(summary.totalCSAmt)}</td>
                </tr>
                {/* Grand Total */}
                <tr className="bg-green-100 border-t-2 border-green-400">
                  <td className="border border-green-300 px-3 py-2 font-bold text-green-800">Grand Total</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900">{summary.entries}</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900">{fmt(summary.totalPCS)}</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900">{fmt(summary.grandWt)}</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900">{fmt(summary.grandNetWt)}</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900">{fmt(summary.grandCarat)}</td>
                  <td className="border border-green-300 px-3 py-2 text-right font-extrabold text-green-900 text-sm">{fmt(summary.grandValueAmt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Invoice inputs */}
          <div className="px-4 py-3 space-y-3">
            <p className="text-xs text-green-700 font-medium">
              Enter invoice details to submit:
            </p>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Invoice No <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => { setInvoiceNo(e.target.value); setSubmitError(''); }}
                  placeholder="Enter Invoice No"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Invoice Date <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={invoiceDateVal}
                  onChange={(e) => { setInvoiceDateVal(e.target.value); setSubmitError(''); }}
                  placeholder="DD/MM/YYYY"
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-md text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4 shrink-0" />
                Submit
              </button>
            </div>

            {/* Inline validation message */}
            {submitError && (
              <p className="text-xs text-red-600 font-medium">{submitError}</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default TemplateUpload;

