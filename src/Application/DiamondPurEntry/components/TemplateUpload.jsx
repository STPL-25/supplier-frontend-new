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



import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import { Upload, AlertCircle, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { COLUMN_HEADER_MAP, FIELD_DATA_TYPES } from '../constants/diamondConstants';
import { parseExcelDate } from '../utils/excelBuilder';

// ─── Required columns that MUST have values for a row to be considered ────────
const REQUIRED_ROW_COLUMNS = ['Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isEmpty = (v) => v === '' || v === null || v === undefined;

const isRowComplete = (rawRow) =>
  REQUIRED_ROW_COLUMNS.every(col => !isEmpty(rawRow[col]));

const getDefaultValue = (fieldName, value) => {
  if (value !== null && value !== undefined && value !== '') return value;
  const dataType = FIELD_DATA_TYPES[fieldName];
  const requiredStrings = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
  switch (dataType) {
    case 'int':     return 0;
    case 'decimal': return 0;
    case 'string':  return requiredStrings.includes(fieldName) ? '' : null;
    default:        return null;
  }
};

const validateDataType = (fieldName, value, rowIndex) => {
  if (value === null || value === undefined || value === '') return { isValid: true, error: null };
  const dataType = FIELD_DATA_TYPES[fieldName];
  if (dataType === 'int') {
    const n = Number(value);
    if (isNaN(n) || !Number.isInteger(n))
      return {
        isValid: false,
        error: { row: rowIndex, field: fieldName, value, expectedType: 'Integer', message: `Invalid integer: "${value}"` },
      };
  } else if (dataType === 'decimal') {
    if (isNaN(Number(value)))
      return {
        isValid: false,
        error: { row: rowIndex, field: fieldName, value, expectedType: 'Decimal/Number', message: `Invalid decimal: "${value}"` },
      };
  }
  return { isValid: true, error: null };
};

const mapExcelRow = (excelRow, rowIndex, typeErrors) => {
  const mapped = {};
  Object.keys(excelRow).forEach(header => {
    const field = COLUMN_HEADER_MAP[header] || header;
    const value = excelRow[header];
    const v = validateDataType(field, value, rowIndex);
    if (!v.isValid) typeErrors.push(v.error);
    mapped[field] = getDefaultValue(field, value);
  });
  return mapped;
};

const validateBusinessRules = (mainData, diamondData, csData) => {
  const errors = [];
  const idSet = new Set(mainData.map(r => String(r.id ?? '')).filter(Boolean));

  mainData.forEach((row, idx) => {
    if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required`);
    if (!row.ProductName)  errors.push(`Row ${idx + 8}: ProductName is required`);
    if (!row.DesignNo)     errors.push(`Row ${idx + 8}: DesignNo is required`);
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

const validateHeaderFields = (invoiceNumber, invoiceDate) => {
  const errors = [];
  if (!invoiceNumber || String(invoiceNumber).trim() === '')
    errors.push('Invoice Number (cell B4) is empty — please fill it in the Excel template.');
  if (!invoiceDate || String(invoiceDate).trim() === '' || invoiceDate === 'Invalid Date')
    errors.push('Invoice Date (cell B5) is empty or invalid — please fill it in the Excel template.');
  return errors;
};

// ─── ValidationErrorsTable ────────────────────────────────────────────────────
const ValidationErrorsTable = ({ errors }) => (
  <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200 mt-3">
    <div className="flex items-center gap-2 mb-3">
      <XCircle className="w-5 h-5 text-red-600" />
      <h3 className="font-semibold text-red-900">Data Type Errors ({errors.length})</h3>
    </div>
    <div className="overflow-auto max-h-72 border rounded bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-red-100 sticky top-0">
          <tr>
            {['#', 'Row', 'Field', 'Invalid Value', 'Expected', 'Message'].map(h => (
              <th key={h} className="border border-red-200 px-3 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {errors.map((err, i) => (
            <tr key={i} className="hover:bg-red-50">
              <td className="border border-red-200 px-3 py-2 text-center">{i + 1}</td>
              <td className="border border-red-200 px-3 py-2 font-medium">{err.row + 8}</td>
              <td className="border border-red-200 px-3 py-2 font-mono text-blue-700">{err.field}</td>
              <td className="border border-red-200 px-3 py-2 font-mono text-red-700">{String(err.value)}</td>
              <td className="border border-red-200 px-3 py-2">{err.expectedType}</td>
              <td className="border border-red-200 px-3 py-2">{err.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-2 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-2">
      ⚠️ Fix these errors in your Excel file and re-upload.
    </p>
  </div>
);

// ─── SkippedRowsNotice ────────────────────────────────────────────────────────
const SkippedRowsNotice = ({ skippedRows }) => (
  <div className="p-3 bg-blue-50 rounded border-2 border-blue-200 mt-3">
    <div className="flex items-center gap-2 mb-2">
      <AlertCircle className="w-4 h-4 text-blue-600" />
      <span className="font-semibold text-blue-900 text-sm">
        {skippedRows.length} row(s) skipped — missing required fields
      </span>
    </div>
    <div className="max-h-40 overflow-y-auto text-sm space-y-1">
      {skippedRows.map((info, i) => (
        <div key={i} className="text-blue-800">
          • Row {info.rowNumber}: missing{' '}
          <span className="font-mono font-semibold">{info.missingCols.join(', ')}</span>
        </div>
      ))}
    </div>
    <p className="mt-2 text-xs text-blue-700">
      These rows and their associated Diamond / Color Stone entries were ignored.
      Fill in the required fields and re-upload if they should be included.
    </p>
  </div>
);

// ─── SupplierMismatchBanner ───────────────────────────────────────────────────
const SupplierMismatchBanner = ({ excelName, excelCode, loginName, loginCode }) => (
  <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg mt-3">
    <div className="flex items-center gap-2 mb-2">
      <ShieldAlert className="w-5 h-5 text-orange-600" />
      <h3 className="font-semibold text-orange-900">Supplier Mismatch — Upload Blocked</h3>
    </div>
    <p className="text-sm text-orange-800 mb-3">
      The supplier details in the Excel file do not match your login credentials.
      You can only upload files for your own supplier account.
    </p>
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div className="bg-white border border-orange-200 rounded p-2">
        <div className="text-xs text-gray-500 font-medium mb-1">Excel File</div>
        <div><span className="text-gray-600">Name:</span> <span className="font-semibold text-red-700">{excelName || '(empty)'}</span></div>
        <div><span className="text-gray-600">Code:</span> <span className="font-semibold text-red-700">{excelCode || '(empty)'}</span></div>
      </div>
      <div className="bg-white border border-orange-200 rounded p-2">
        <div className="text-xs text-gray-500 font-medium mb-1">Logged-in Supplier</div>
        <div><span className="text-gray-600">Name:</span> <span className="font-semibold text-green-700">{loginName || '(empty)'}</span></div>
        <div><span className="text-gray-600">Code:</span> <span className="font-semibold text-green-700">{loginCode || '(empty)'}</span></div>
      </div>
    </div>
    <p className="mt-2 text-xs text-orange-700">
      ✏️ Update cells B2 (Supplier Name) and B3 (Supplier Code) in the Excel file to match your account, then re-upload.
    </p>
  </div>
);

// ─── TemplateUpload ───────────────────────────────────────────────────────────
/**
 * Props:
 *   onDataLoaded  – (groupedData: Array) => void
 *   onReset       – () => void
 *   loginUser     – { supplierName: string, supplierCode: string }
 */
const TemplateUpload = ({ onDataLoaded, onReset, loginUser }) => {
  const fileInputRef = useRef(null);
  const [status, setStatus]                     = useState(null);
  const [typeErrors, setTypeErrors]             = useState([]);
  const [ruleErrors, setRuleErrors]             = useState([]);
  const [supplierMismatch, setSupplierMismatch] = useState(null);
  const [skippedRows, setSkippedRows]           = useState([]);
  const [hasData, setHasData]                   = useState(false);

  const clearFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetAll = () => {
    setStatus(null);
    setTypeErrors([]);
    setRuleErrors([]);
    setSupplierMismatch(null);
    setSkippedRows([]);
    setHasData(false);
    clearFileInput();
    onReset?.();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset all state for fresh read
    setStatus(null);
    setTypeErrors([]);
    setRuleErrors([]);
    setSupplierMismatch(null);
    setSkippedRows([]);
    setHasData(false);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb           = XLSX.read(evt.target.result, { type: 'binary' });
        const mainSheet    = wb.Sheets['Purchase Entry']      || wb.Sheets[wb.SheetNames[0]];
        const diamondSheet = wb.Sheets['Diamond Details']     || wb.Sheets[wb.SheetNames[1]];
        const csSheet      = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

        if (!mainSheet) {
          setStatus({ type: 'error', message: 'Sheet "Purchase Entry" not found in this file.' });
          clearFileInput();
          return;
        }

        // ── Read header cells (rows 2–5) ───────────────────────────────────
        const supplierName  = String(mainSheet['B2']?.v || '').trim();
        const supplierCode  = String(mainSheet['B3']?.v || '').trim();
        const invoiceNumber = mainSheet['B4']?.v || '';
        const invoiceDate   = parseExcelDate(mainSheet['B5']?.v || '');
        console.log('invoiceDate:', invoiceDate);
        const invoiceRef    = invoiceNumber ? `${invoiceNumber}|${invoiceDate}` : '';

        // ── STEP 1: Supplier match check ───────────────────────────────────
        if (loginUser) {
          const loginName = String(loginUser.supplierName || '').trim().toLowerCase();
          const loginCode = String(loginUser.supplierCode || '').trim().toLowerCase();
          const excelName = supplierName.toLowerCase();
          const excelCode = supplierCode.toLowerCase();

          if (!loginName || !loginCode) {
            setStatus({ type: 'error', message: 'Login supplier details are missing. Please re-login.' });
            clearFileInput();
            return;
          }

          if (excelName !== loginName || excelCode !== loginCode) {
            setSupplierMismatch({
              excelName: supplierName,
              excelCode: supplierCode,
              loginName: loginUser.supplierName,
              loginCode: loginUser.supplierCode,
            });
            setStatus({ type: 'error', message: 'Supplier mismatch: Excel supplier does not match your login. Upload blocked.' });
            clearFileInput();
            return;
          }
        }

        // ── STEP 2: Invoice header field validation ────────────────────────
        const headerErrors = validateHeaderFields(invoiceNumber, invoiceDate);
        if (headerErrors.length) {
          setRuleErrors(headerErrors);
          setStatus({ type: 'error', message: `Missing header fields (${headerErrors.length}). Fix and re-upload.` });
          clearFileInput();
          return;
        }

        // ── STEP 3: Parse all raw rows from sheet (data starts row 8) ──────
        const allRawMain  = XLSX.utils.sheet_to_json(mainSheet,   { range: 6, defval: '' });
        const rawDiamonds = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
        const rawCs       = csSheet      ? XLSX.utils.sheet_to_json(csSheet,      { defval: '' }) : [];

        if (allRawMain.length === 0) {
          setStatus({ type: 'error', message: 'No data rows found in the Purchase Entry sheet.' });
          clearFileInput();
          return;
        }

        // ── STEP 4: Filter rows — keep only those with all required fields ──
        // Collect skipped row info for the notice banner
        const skipped = [];
        const validRawMain = allRawMain.filter((row, idx) => {
          const missingCols = REQUIRED_ROW_COLUMNS.filter(col => isEmpty(row[col]));
          if (missingCols.length > 0) {
            skipped.push({ rowNumber: idx + 8, missingCols });
            return false; // exclude this row
          }
          return true;
        });

        // Build a set of valid Entry Ids so diamond/CS rows for skipped
        // purchase rows are also excluded
        const validEntryIdSet = new Set(
          validRawMain.map(r => String(r['Entry Id'] ?? '')).filter(Boolean)
        );

        // Filter diamond and color stone rows to only those whose Entry Id
        // belongs to a valid (non-skipped) purchase row
        const filteredDiamonds = rawDiamonds.filter(
          row => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
        );
        const filteredCs = rawCs.filter(
          row => validEntryIdSet.has(String(row['Entry Id'] ?? ''))
        );

        if (validRawMain.length === 0) {
          setSkippedRows(skipped);
          setStatus({
            type: 'error',
            message: 'No valid rows found. All rows are missing required fields (Entry Id, Product Name, Metal Type, Weight Mode, Design No).',
          });
          clearFileInput();
          return;
        }

        // ── STEP 5: Type-validate + map valid rows ─────────────────────────
        const tErrors  = [];
        const mainData = validRawMain.map((row, idx) => {
          const mapped         = mapExcelRow(row, idx, tErrors);
          mapped.SupplierName  = supplierName;
          mapped.suppCode      = supplierCode;
          mapped.invoiceNumber = invoiceRef;
          mapped.invoiceDate   = invoiceDate;
          return mapped;
        });

        if (tErrors.length) {
          setTypeErrors(tErrors);
          setSkippedRows(skipped);
          setStatus({ type: 'error', message: `Data type errors found (${tErrors.length}). Fix and re-upload.` });
          clearFileInput();
          return;
        }

        // ── STEP 6: Map diamond + color stone rows ─────────────────────────
        const diamondData = filteredDiamonds.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          STONE_FROM:   row['Stone From']    || null,
          DiamondShape: row['Diamond Shape'] || null,
          NoOfStones:   row['No Of Stones']  || 0,
          Carat:        row['Carat']  || 0,
          Rate:         row['Rate']   || 0,
          Value:        row['Value']  || 0,
          Weight:       row['Weight'] || 0,
        }));

        const csData = filteredCs.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          csShape:    row['Color Stone Shape'] || null,
          NoOfStones: row['No Of Stones']      || 0,
          Carat:      row['Carat']  || 0,
          Rate:       row['Rate']   || 0,
          Value:      row['Value']  || 0,
          Weight:     row['Weight'] || 0,
        }));

        // ── STEP 7: Business rule validation ──────────────────────────────
        const bErrors = validateBusinessRules(mainData, diamondData, csData);
        if (bErrors.length) {
          setRuleErrors(bErrors);
          setSkippedRows(skipped);
          setStatus({ type: 'error', message: `Validation errors (${bErrors.length}). Fix and re-upload.` });
          clearFileInput();
          return;
        }

        // ── STEP 8: Group diamonds + color stones onto each purchase entry ─
        const grouped = mainData.map(entry => {
          const idStr = String(entry.id ?? '');
          return {
            ...entry,
            diamonds: diamondData.filter(
              d => String(d.purchaseEntryId) === idStr &&
                   Object.values(d).some(v => v !== '' && v !== 0 && v !== null)
            ),
            colorStones: csData.filter(
              c => String(c.purchaseEntryId) === idStr &&
                   Object.values(c).some(v => v !== '' && v !== 0 && v !== null)
            ),
          };
        });

        // ── Success ────────────────────────────────────────────────────────
        setTypeErrors([]);
        setRuleErrors([]);
        setSupplierMismatch(null);
        setSkippedRows(skipped); // show skipped notice even on success
        setStatus({
          type: 'success',
          message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}${
            skipped.length ? ` (${skipped.length} incomplete rows skipped)` : ''
          }`,
        });
        setHasData(true);
        clearFileInput();
        onDataLoaded?.(grouped);

      } catch (err) {
        console.error(err);
        setStatus({ type: 'error', message: 'Failed to read file. Check the format and try again.' });
        setTypeErrors([]);
        setRuleErrors([]);
        setSupplierMismatch(null);
        setSkippedRows([]);
        clearFileInput();
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-3">
      {/* Upload button row */}
      <div className="flex items-center gap-3">
        <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700 text-sm font-medium">
          <Upload className="w-4 h-4" />
          Upload Filled Excel
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {hasData && (
          <button
            onClick={resetAll}
            className="px-3 py-2 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Status banner */}
      {status && (
        <div className={`p-3 rounded flex items-center gap-2 text-sm border-2 ${
          status.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-300'
            : 'bg-green-50 text-green-800 border-green-300'
        }`}>
          {status.type === 'success'
            ? <CheckCircle className="w-5 h-5 shrink-0" />
            : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      {/* Supplier mismatch banner */}
      {supplierMismatch && (
        <SupplierMismatchBanner
          excelName={supplierMismatch.excelName}
          excelCode={supplierMismatch.excelCode}
          loginName={supplierMismatch.loginName}
          loginCode={supplierMismatch.loginCode}
        />
      )}

      {/* Skipped rows notice (shown on both success and error) */}
      {skippedRows.length > 0 && <SkippedRowsNotice skippedRows={skippedRows} />}

      {/* Data type errors table */}
      {typeErrors.length > 0 && <ValidationErrorsTable errors={typeErrors} />}

      {/* Business rule / header errors list */}
      {ruleErrors.length > 0 && (
        <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
          <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" /> Validation Errors ({ruleErrors.length})
          </div>
          <div className="max-h-48 overflow-y-auto text-sm space-y-1">
            {ruleErrors.map((err, i) => (
              <div key={i} className="text-yellow-800">• {err}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateUpload;

