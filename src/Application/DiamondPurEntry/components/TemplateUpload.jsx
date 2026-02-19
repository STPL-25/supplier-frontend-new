import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx-js-style';
import { Upload, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { COLUMN_HEADER_MAP, FIELD_DATA_TYPES } from '../../constants/diamondConstants';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Integer', message: `Invalid integer: "${value}"` } };
  } else if (dataType === 'decimal') {
    if (isNaN(Number(value)))
      return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Decimal/Number', message: `Invalid decimal: "${value}"` } };
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
    const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
    if (empty) return;
    if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required`);
    if (!row.ProductName)  errors.push(`Row ${idx + 8}: ProductName is required`);
    if (!row.DesignNo)     errors.push(`Row ${idx + 8}: DesignNo is required`);
  });
  diamondData.forEach((row, idx) => {
    const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
    if (empty) return;
    if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
    else if (!idSet.has(String(row.purchaseEntryId))) errors.push(`Diamond Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
  });
  csData.forEach((row, idx) => {
    const empty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
    if (empty) return;
    if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`ColorStone Row ${idx + 2}: Entry Id required`);
    else if (!idSet.has(String(row.purchaseEntryId))) errors.push(`ColorStone Row ${idx + 2}: Entry Id '${row.purchaseEntryId}' not found in Purchase sheet`);
  });
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

/**
 * Props:
 *   onDataLoaded  – (groupedData: Array) => void   called on success
 *   onReset       – () => void                     called when data is cleared
 */
const TemplateUpload = ({ onDataLoaded, onReset }) => {
  const fileInputRef = useRef(null);
  const [status, setStatus]           = useState(null);   // { type: 'success'|'error', message }
  const [typeErrors, setTypeErrors]   = useState([]);
  const [ruleErrors, setRuleErrors]   = useState([]);
  const [hasData, setHasData]         = useState(false);

  const resetAll = () => {
    setStatus(null); setTypeErrors([]); setRuleErrors([]);
    setHasData(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onReset?.();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb          = XLSX.read(evt.target.result, { type: 'binary' });
        const mainSheet   = wb.Sheets['Purchase Entry']       || wb.Sheets[wb.SheetNames[0]];
        const diamondSheet = wb.Sheets['Diamond Details']     || wb.Sheets[wb.SheetNames[1]];
        const csSheet     = wb.Sheets['Color Stone Details']  || wb.Sheets[wb.SheetNames[2]];

        if (!mainSheet) {
          setStatus({ type: 'error', message: 'Sheet "Purchase Entry" not found in this file.' });
          return;
        }

        // Read header fields from rows 2–5
        const supplierName  = mainSheet['B2']?.v || '';
        const supplierCode  = mainSheet['B3']?.v || '';
        const invoiceNumber = mainSheet['B4']?.v || '';
        const invoiceDate   = mainSheet['B5']?.v || '';
        const invoiceRef    = invoiceNumber ? `${invoiceNumber}|${invoiceDate}` : '';

        // Parse rows (data starts at row 8 = index 6 for sheet_to_json range)
        const rawMain     = XLSX.utils.sheet_to_json(mainSheet,   { range: 6, defval: '' });
        const rawDiamonds = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
        const rawCs       = csSheet      ? XLSX.utils.sheet_to_json(csSheet,      { defval: '' }) : [];

        // Type-validate + map headers
        const tErrors = [];
        const mainData = rawMain.map((row, idx) => {
          const mapped = mapExcelRow(row, idx, tErrors);
          mapped.SupplierName  = supplierName;
          mapped.suppCode      = supplierCode;
          mapped.invoiceNumber = invoiceRef;
          mapped.invoiceDate   = invoiceDate;
          return mapped;
        });

        if (tErrors.length) {
          setTypeErrors(tErrors); setRuleErrors([]);
          setStatus({ type: 'error', message: `Data type errors found (${tErrors.length}). Fix and re-upload.` });
          setHasData(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Map diamond + color stone rows
        const diamondData = rawDiamonds.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          STONE_FROM:   row['Stone From']    || null,
          DiamondShape: row['Diamond Shape'] || null,
          NoOfStones:   row['No Of Stones']  || 0,
          Carat:  row['Carat']  || 0,
          Rate:   row['Rate']   || 0,
          Value:  row['Value']  || 0,
          Weight: row['Weight'] || 0,
        }));

        const csData = rawCs.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          csShape:    row['Color Stone Shape'] || null,
          NoOfStones: row['No Of Stones']      || 0,
          Carat:  row['Carat']  || 0,
          Rate:   row['Rate']   || 0,
          Value:  row['Value']  || 0,
          Weight: row['Weight'] || 0,
        }));

        // Business rule validation
        const bErrors = validateBusinessRules(mainData, diamondData, csData);
        if (bErrors.length) {
          setRuleErrors(bErrors); setTypeErrors([]);
          setStatus({ type: 'error', message: `Validation errors (${bErrors.length}). Fix and re-upload.` });
          setHasData(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Group: attach diamonds + color stones to each purchase entry
        const grouped = mainData
          .filter(r => !Object.entries(r).every(([key, val]) =>
            ['SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate'].includes(key) ||
            val === '' || val === null || val === undefined || val === 0
          ))
          .map(entry => {
            const idStr = String(entry.id ?? '');
            return {
              ...entry,
              diamonds:    diamondData.filter(d => String(d.purchaseEntryId) === idStr && Object.values(d).some(v => v !== '' && v !== 0 && v !== null)),
              colorStones: csData.filter(c     => String(c.purchaseEntryId) === idStr && Object.values(c).some(v => v !== '' && v !== 0 && v !== null)),
            };
          });

        setTypeErrors([]); setRuleErrors([]);
        setStatus({ type: 'success', message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` });
        setHasData(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onDataLoaded?.(grouped);

      } catch (err) {
        console.error(err);
        setStatus({ type: 'error', message: 'Failed to read file. Check the format and try again.' });
        setTypeErrors([]); setRuleErrors([]);
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

      {/* Data type errors table */}
      {typeErrors.length > 0 && <ValidationErrorsTable errors={typeErrors} />}

      {/* Business rule errors list */}
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
