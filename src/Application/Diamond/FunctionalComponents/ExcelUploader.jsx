import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx-js-style';
import {
  FileSpreadsheet, Eye, Download, Upload, AlertCircle, CheckCircle, Save, RefreshCw, Loader2, XCircle
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

// ─── NON-EDITABLE COLUMNS in React table ─────────────────────────────────────
const NON_EDITABLE_COLS = new Set(['id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate']);

// ─── Loading State ────────────────────────────────────────────────────────────
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

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3">
        <div className="transform -rotate-3">
          <FileSpreadsheet className="w-16 h-16 text-gray-400" />
        </div>
      </div>
      <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
        <Upload className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="text-center space-y-4 max-w-md">
      <h3 className="text-2xl font-bold text-gray-900">No Purchase Entries Yet</h3>
    </div>
  </div>
);

// ─── COLUMN HEADER MAPPING ────────────────────────────────────────────────────
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
  'PGI UIN No': 'PgiUinNo',
};

const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce((acc, [display, backend]) => {
  acc[backend] = display;
  return acc;
}, {});
BACKEND_TO_DISPLAY_MAP['SupplierName']   = 'Supplier Name';
BACKEND_TO_DISPLAY_MAP['suppCode']       = 'Supplier Code';
BACKEND_TO_DISPLAY_MAP['invoiceNumber']  = 'Invoice Number';
BACKEND_TO_DISPLAY_MAP['invoiceDate']    = 'Invoice Date';

const FIELD_DATA_TYPES = {
  'SupplierName': 'string', 'ProductName': 'string', 'MetalType': 'string',
  'WtMode': 'string', 'DesignNo': 'string', 'GoMcType': 'string',
  'WastageType': 'string', 'CertType': 'string', 'HallMarkType': 'string',
  'HUID': 'string', 'suppCode': 'string', 'PTMcType': 'string',
  'PTWastageType': 'string', 'IgiSummaryNo': 'string', 'PgiUinNo': 'string',
  'invoiceNumber': 'string', 'invoiceDate': 'string',
  'id': 'int', 'PCS': 'int', 'HMQty': 'int', 'NoofStone': 'int', 'ClrStnPCS': 'int',
  'GCarat': 'decimal', 'GoldWt': 'decimal', 'GoldPurity': 'decimal',
  'GoldPurityWt': 'decimal', 'Gold999Rate': 'decimal', 'GoldValue': 'decimal',
  'PTWt': 'decimal', 'PTPurity': 'decimal', 'PTPurityWt': 'decimal',
  'PT999Rate': 'decimal', 'PTValue': 'decimal', 'GoMcRate': 'decimal',
  'GoMcAmount': 'decimal', 'WastageWeight': 'decimal', 'WastageAmt': 'decimal',
  'CertGST': 'decimal', 'CertQty': 'decimal', 'CertRate': 'decimal',
  'CertTaxableAmt': 'decimal', 'CertTotal': 'decimal', 'HMGST': 'decimal',
  'HMRate': 'decimal', 'HMTaxableAmt': 'decimal', 'HMTotal': 'decimal',
  'HandleRate': 'decimal', 'HandleAmount': 'decimal', 'GNetWt': 'decimal',
  'PNetWt': 'decimal', 'TotalValue': 'decimal', 'GST': 'decimal',
  'GrandTotal': 'decimal', 'PTMcRate': 'decimal', 'PTMcAmount': 'decimal',
  'PTWastageWeight': 'decimal', 'PTWastageAmt': 'decimal', 'certTaxAmt': 'decimal',
  'HmTaxAmt': 'decimal', 'DCarat': 'decimal', 'DiamondRate': 'decimal',
  'DiamondValue': 'decimal', 'DiamondWt': 'decimal', 'CLSCarat': 'decimal',
  'ClrStnWt': 'decimal', 'ClrStnRate': 'decimal', 'CSAmount': 'decimal',
};

const PT_COLUMNS = [
  'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'Pcs',
  'PT Wt', 'PT Purity', 'PT Purity Wt', 'PT999Rate (without GST)', 'PT Value',
  'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
  'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
  'Platinum Mc Type', 'Platinum Mc Rate', 'Platinum Mc Amount',
  'Platinum Wastage Type', 'Platinum Wastage Weight', 'Platinum Wastage Amount',
  'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
  'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
  'HandleRate', 'HandleAmount', 'Platinum NetWt', 'Total Value', 'GST', 'Grand Total',
  'IGI Summary No', 'PGI UIN No',
];

const GOLD_COLUMNS = [
  'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'G Karat', 'Pcs',
  'Gold Wt', 'Gold Purity', 'Gold Purity Wt', 'Gold999Rate (without GST)', 'Gold Value',
  'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
  'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
  'Gold Mc Type', 'Gold Mc Rate', 'Gold Mc Amount',
  'Gold Wastage Type', 'Gold Wastage Weight', 'Gold Wastage Amount',
  'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
  'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
  'Gold HallMark Type', 'Gold HallMark GST', 'GoldHallMark Qty',
  'Gold HallMark Rate', 'Gold HallMark Taxable Amount', 'Gold HallMark Tax Amount', 'Gold HallMark Total',
  'HandleRate', 'HandleAmount', 'Gold Net Wt', 'Total Value', 'GST', 'Grand Total',
  'HUID No', 'IGI Summary No', 'PGI UIN No',
];

const PURCHASE_COLUMNS_BACKEND = [
  'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
  'ProductName', 'MetalType', 'WtMode', 'DesignNo',
  'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue',
  'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
  'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
  'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount',
  'GoMcType', 'GoMcRate', 'GoMcAmount',
  'PTMcType', 'PTMcRate', 'PTMcAmount',
  'WastageType', 'WastageWeight', 'WastageAmt',
  'PTWastageType', 'PTWastageWeight', 'PTWastageAmt',
  'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt', 'certTaxAmt', 'CertTotal',
  'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HmTaxAmt', 'HMTotal',
  'HandleRate', 'HandleAmount',
  'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID', 'IgiSummaryNo', 'PgiUinNo',
];

// ─── DROPDOWN OPTIONS (Excel display name keys) ───────────────────────────────
const DROPDOWN_OPTIONS = {
  'Metal Type':               ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
  'Weight Mode':              ['Gross Weight', 'Net Weight'],
  'G Karat':                  ['18K', '20K', '22K', '24K', '14K'],
  'Gold Mc Type':             ['Percentage', 'Per Gram', 'Fixed'],
  'Platinum Mc Type':         ['Percentage', 'Per Gram', 'Fixed'],
  'Gold Wastage Type':        ['Percentage', 'Fixed Weight'],
  'Platinum Wastage Type':    ['Percentage', 'Fixed Weight'],
  'Diamond Certificate Type': ['IGI', 'GIA', 'HRD', 'None'],
  'Gold HallMark Type':       ['HUID', 'BIS', 'None'],
  'GST':                      ['1.5', '3', '5', '12', '18'],
  'Diamond Certificate GST':  ['5', '12', '18'],
  'Gold HallMark GST':        ['5', '12', '18'],
};

// ─── DROPDOWN OPTIONS (Backend field name keys, for React table) ──────────────
const DROPDOWN_OPTIONS_BACKEND = {
  'MetalType':     ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
  'WtMode':        ['Gross Weight', 'Net Weight'],
  'GCarat':        ['18K', '20K', '22K', '24K', '14K'],
  'GoMcType':      ['Percentage', 'Per Gram', 'Fixed'],
  'PTMcType':      ['Percentage', 'Per Gram', 'Fixed'],
  'WastageType':   ['Percentage', 'Fixed Weight'],
  'PTWastageType': ['Percentage', 'Fixed Weight'],
  'CertType':      ['IGI', 'GIA', 'HRD', 'None'],
  'HallMarkType':  ['HUID', 'BIS', 'None'],
  'GST':           ['1.5', '3', '5', '12', '18'],
  'CertGST':       ['5', '12', '18'],
  'HMGST':         ['5', '12', '18'],
};

// ─── FORMULA DEFINITIONS ──────────────────────────────────────────────────────
const FORMULA_DEFINITIONS = {
  'Gold Purity Wt': (cols, r) =>
    cols['Gold Wt'] && cols['Gold Purity']
      ? `=${cols['Gold Wt']}${r}*${cols['Gold Purity']}${r}/100` : '',
  'Gold Value': (cols, r) =>
    cols['Gold Purity Wt'] && cols['Gold999Rate (without GST)']
      ? `=${cols['Gold Purity Wt']}${r}*${cols['Gold999Rate (without GST)']}${r}` : '',
  'PT Purity Wt': (cols, r) =>
    cols['PT Wt'] && cols['PT Purity']
      ? `=${cols['PT Wt']}${r}*${cols['PT Purity']}${r}/100` : '',
  'PT Value': (cols, r) =>
    cols['PT Purity Wt'] && cols['PT999Rate (without GST)']
      ? `=${cols['PT Purity Wt']}${r}*${cols['PT999Rate (without GST)']}${r}` : '',
  'Gold Mc Amount': (cols, r) =>
    cols['Gold Mc Rate'] && cols['Gold Wt']
      ? `=${cols['Gold Wt']}${r}*${cols['Gold Mc Rate']}${r}` : '',
  'Platinum Mc Amount': (cols, r) =>
    cols['Platinum Mc Rate'] && cols['PT Wt']
      ? `=${cols['PT Wt']}${r}*${cols['Platinum Mc Rate']}${r}` : '',
  'Gold Wastage Amount': (cols, r) =>
    cols['Gold Value'] && cols['Gold Wastage Weight']
      ? `=${cols['Gold Value']}${r}*${cols['Gold Wastage Weight']}${r}/100` : '',
  'Platinum Wastage Amount': (cols, r) =>
    cols['PT Value'] && cols['Platinum Wastage Weight']
      ? `=${cols['PT Value']}${r}*${cols['Platinum Wastage Weight']}${r}/100` : '',
  'Diamond Certificate Taxable Amount': (cols, r) =>
    cols['Diamond Certificate Qty'] && cols['Diamond Certificate Rate']
      ? `=${cols['Diamond Certificate Qty']}${r}*${cols['Diamond Certificate Rate']}${r}` : '',
  'Diamond Certificate Tax Amount': (cols, r) =>
    cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate GST']
      ? `=${cols['Diamond Certificate Taxable Amount']}${r}*${cols['Diamond Certificate GST']}${r}/100` : '',
  'Diamond Certificate Total': (cols, r) =>
    cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate Tax Amount']
      ? `=${cols['Diamond Certificate Taxable Amount']}${r}+${cols['Diamond Certificate Tax Amount']}${r}` : '',
  'Gold HallMark Taxable Amount': (cols, r) =>
    cols['GoldHallMark Qty'] && cols['Gold HallMark Rate']
      ? `=${cols['GoldHallMark Qty']}${r}*${cols['Gold HallMark Rate']}${r}` : '',
  'Gold HallMark Tax Amount': (cols, r) =>
    cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark GST']
      ? `=${cols['Gold HallMark Taxable Amount']}${r}*${cols['Gold HallMark GST']}${r}/100` : '',
  'Gold HallMark Total': (cols, r) =>
    cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark Tax Amount']
      ? `=${cols['Gold HallMark Taxable Amount']}${r}+${cols['Gold HallMark Tax Amount']}${r}` : '',
  'HandleAmount': (cols, r) => {
    const wtCol = cols['Gold Wt'] || cols['PT Wt'];
    return wtCol && cols['HandleRate'] ? `=${wtCol}${r}*${cols['HandleRate']}${r}` : '';
  },
  'Total Value': (cols, r) => {
    const parts = [
      cols['Gold Value'], cols['PT Value'], cols['Diamond Value'], cols['ColorStone Amount'],
      cols['Gold Mc Amount'], cols['Platinum Mc Amount'], cols['Gold Wastage Amount'],
      cols['Platinum Wastage Amount'], cols['Diamond Certificate Total'],
      cols['Gold HallMark Total'], cols['HandleAmount'],
    ].filter(Boolean).map(c => `${c}${r}`);
    return parts.length ? '=' + parts.join('+') : '';
  },
  'Grand Total': (cols, r) =>
    cols['Total Value'] && cols['GST']
      ? `=${cols['Total Value']}${r}+(${cols['Total Value']}${r}*${cols['GST']}${r}/100)` : '',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const colLetter = (idx) => {
  let letter = '', n = idx + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
};

const getDefaultValue = (fieldName, value) => {
  if (value !== null && value !== undefined && value !== '') return value;
  const dataType = FIELD_DATA_TYPES[fieldName];
  const requiredStringFields = ['SupplierName', 'ProductName', 'DesignNo', 'MetalType', 'WtMode', 'suppCode', 'invoiceNumber'];
  switch (dataType) {
    case 'int':     return 0;
    case 'decimal': return 0;
    case 'string':  return requiredStringFields.includes(fieldName) ? '' : null;
    default:        return null;
  }
};

const validateDataType = (fieldName, value, rowIndex) => {
  if (value === null || value === undefined || value === '') return { isValid: true, error: null };
  const dataType = FIELD_DATA_TYPES[fieldName];
  if (dataType === 'int') {
    const intValue = Number(value);
    if (isNaN(intValue) || !Number.isInteger(intValue))
      return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Integer', message: `Invalid integer value: "${value}"` } };
  } else if (dataType === 'decimal') {
    const decimalValue = Number(value);
    if (isNaN(decimalValue))
      return { isValid: false, error: { row: rowIndex, field: fieldName, value, expectedType: 'Decimal/Number', message: `Invalid decimal value: "${value}"` } };
  }
  return { isValid: true, error: null };
};

const formatNumber = (v, decimals = 2) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const mapExcelHeadersToBackend = (excelRow, rowIndex, validationErrors) => {
  const mappedRow = {};
  Object.keys(excelRow).forEach(excelHeader => {
    const backendField = COLUMN_HEADER_MAP[excelHeader] || excelHeader;
    const value = excelRow[excelHeader];
    const validation = validateDataType(backendField, value, rowIndex);
    if (!validation.isValid) validationErrors.push(validation.error);
    mappedRow[backendField] = getDefaultValue(backendField, value);
  });
  return mappedRow;
};

// ─── EXCEL SHEET PROTECTION HELPER ───────────────────────────────────────────
// Returns the correct !protect object — NO algorithmName, NO undefined values
const makeProtect = () => ({
  sheet: true,
  password: '',
  formatCells: false,
  formatColumns: false,
  formatRows: false,
  insertColumns: false,
  insertRows: true,
  insertHyperlinks: false,
  deleteColumns: false,
  deleteRows: false,
  selectLockedCells: true,
  selectUnlockedCells: true,
  sort: true,
  autoFilter: false,
  pivotTables: false,
  objects: false,
  scenarios: false,
});

// ─── CELL STYLE FACTORIES (inline, no spread — fixes xlsx-js-style protection bug) ──
const makeLockedHeaderStyle = (fillRgb) => ({
  protection: { locked: true },
  font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
  fill: { fgColor: { rgb: fillRgb } },
  alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'FFFFFF' } },
    bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
    left:   { style: 'thin', color: { rgb: 'FFFFFF' } },
    right:  { style: 'thin', color: { rgb: 'FFFFFF' } },
  },
});

const makeUnlockedDataStyle = () => ({
  protection: { locked: false },
  fill: { fgColor: { rgb: 'FFFFFF' } },
  border: {
    top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
    right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
  },
});

const makeCalcDataStyle = () => ({
  protection: { locked: false },
  fill: { fgColor: { rgb: 'F1F8E9' } },
  font: { color: { rgb: '1B5E20' }, italic: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
    bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
    left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
    right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
  },
});

// ─── BUILD MAIN PURCHASE ENTRY SHEET ─────────────────────────────────────────
const buildSheet = (columns, supplierName, supplierCode, titleText, DATA_ROWS = 200) => {
  const ws = {};
  const colMap = {};
  columns.forEach((header, idx) => { colMap[header] = colLetter(idx); });

  // Row 1 — Title (locked)
  const titleColor = titleText.includes('Gold') ? 'B8860B'
    : titleText.includes('Platinum') ? '6A1B9A' : '1565C0';
  ws['A1'] = {
    v: titleText, t: 's',
    s: {
      protection: { locked: true },
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: titleColor } },
      alignment: { horizontal: 'center', vertical: 'center' },
    },
  };
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

  // Rows 2–5 — Labels (locked)
  [['A2', 'Supplier Name:'], ['A3', 'Supplier Code:'], ['A4', 'Invoice Number:'], ['A5', 'Invoice Date:']].forEach(([addr, val]) => {
    ws[addr] = {
      v: val, t: 's',
      s: {
        protection: { locked: true },
        font: { bold: true, color: { rgb: '1A237E' }, sz: 10 },
        fill: { fgColor: { rgb: 'E8EAF6' } },
      },
    };
  });

  // B2, B3 — Supplier values (locked, pre-filled)
  ws['B2'] = {
    v: supplierName || '', t: 's',
    s: {
      protection: { locked: true },
      font: { color: { rgb: '880000' }, italic: true, sz: 10 },
      fill: { fgColor: { rgb: 'FFEBEE' } },
    },
  };
  ws['B3'] = {
    v: supplierCode || '', t: 's',
    s: {
      protection: { locked: true },
      font: { color: { rgb: '880000' }, italic: true, sz: 10 },
      fill: { fgColor: { rgb: 'FFEBEE' } },
    },
  };

  // B4, B5 — Invoice inputs (UNLOCKED — explicit, no spread)
  ws['B4'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false },
      font: { color: { rgb: '000000' }, sz: 10 },
      fill: { fgColor: { rgb: 'FFFDE7' } },
    },
  };
  ws['B5'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false },
      font: { color: { rgb: '000000' }, sz: 10 },
      fill: { fgColor: { rgb: 'FFFDE7' } },
    },
  };

  // Hints C2, C3, C5 (locked)
  ws['C2'] = { v: "(Don't change Supplier Name)", t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };
  ws['C3'] = { v: "(Don't change Supplier Code)", t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };
  ws['C5'] = { v: '(Format: YYYY-MM-DD)',         t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };

  // Row 6 — Spacer (locked)
  for (let c = 0; c < columns.length; c++) {
    ws[`${colLetter(c)}6`] = {
      v: '', t: 's',
      s: { protection: { locked: true }, fill: { fgColor: { rgb: 'F5F5F5' } } },
    };
  }

  // Row 7 — Column headers (locked)
  columns.forEach((header, idx) => {
    const isFormula  = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
    const isDropdown = Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header);
    const fillRgb    = isFormula ? '2E7D32' : isDropdown ? '6A1B9A' : '1E3A5F';
    ws[`${colLetter(idx)}7`] = {
      v: header, t: 's',
      s: makeLockedHeaderStyle(fillRgb),
    };
  });

  // Rows 8+ — Data rows (ALL unlocked — inline styles, no spread)
  const dataValidations = [];
  for (let r = 8; r < 8 + DATA_ROWS; r++) {
    columns.forEach((header, idx) => {
      const addr      = `${colLetter(idx)}${r}`;
      const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);

      if (isFormula) {
        const formula = FORMULA_DEFINITIONS[header](colMap, r);
        if (formula && formula.startsWith('=')) {
          ws[addr] = { f: formula.substring(1), t: 'n', s: makeCalcDataStyle() };
        } else {
          ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
        }
      } else {
        ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
      }
    });
  }

  // Dropdown validations
  columns.forEach((header, idx) => {
    if (DROPDOWN_OPTIONS[header]) {
      dataValidations.push({
        type: 'list',
        allowBlank: true,
        showDropDown: false,
        sqref: `${colLetter(idx)}8:${colLetter(idx)}${8 + DATA_ROWS - 1}`,
        formula1: `"${DROPDOWN_OPTIONS[header].join(',')}"`,
        showErrorMessage: true,
        errorStyle: 'stop',
        errorTitle: 'Invalid Input',
        error: 'Please select from the dropdown list.',
      });
    }
  });
  if (dataValidations.length) ws['!dataValidations'] = dataValidations;

  ws['!ref']  = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
  ws['!cols'] = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
  ws['!rows'] = [{ hpt: 30 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 6 }, { hpt: 42 }];
  ws['!protect'] = makeProtect();   // ← uses the clean helper, no undefined values
  return ws;
};

// ─── BUILD DIAMOND DETAILS SHEET ─────────────────────────────────────────────
const buildDiamondSheet = (DATA_ROWS = 200) => {
  const headers = ['Entry Id', 'Stone From', 'Diamond Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
  const ws = {};
  headers.forEach((h, idx) => {
    ws[`${colLetter(idx)}1`] = { v: h, t: 's', s: makeLockedHeaderStyle('1E3A5F') };
  });
  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((_, idx) => {
      ws[`${colLetter(idx)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() };
    });
  }
  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(() => ({ wch: 16 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};

// ─── BUILD COLOR STONE DETAILS SHEET ─────────────────────────────────────────
const buildColorStoneSheet = (DATA_ROWS = 200) => {
  const headers = ['Entry Id', 'Color Stone Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
  const ws = {};
  headers.forEach((h, idx) => {
    ws[`${colLetter(idx)}1`] = { v: h, t: 's', s: makeLockedHeaderStyle('1E3A5F') };
  });
  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((_, idx) => {
      ws[`${colLetter(idx)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() };
    });
  }
  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(() => ({ wch: 16 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};

// ─── VALIDATION ERRORS TABLE ──────────────────────────────────────────────────
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
      </p>
    </div>
  </div>
);

// ─── PURCHASE ENTRY TABLE (inline editable) ───────────────────────────────────
const PurchaseEntryTable = ({ data, loading, onRowClick, onRowChange }) => {
  const threeDecimals = new Set(['GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight']);

  return (
    <div className="overflow-auto bg-white border rounded">
      <table className="min-w-full text-sm">
        {data.length > 0 && (
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              {PURCHASE_COLUMNS_BACKEND.map(col => (
                <th key={col} className="border px-2 py-1 text-left whitespace-nowrap">
                  {BACKEND_TO_DISPLAY_MAP[col] || col}
                  {NON_EDITABLE_COLS.has(col) && (
                    <span className="ml-1 text-xs text-red-400 font-normal">(locked)</span>
                  )}
                </th>
              ))}
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
        )}
        <tbody>
          {loading ? (
            <tr><td colSpan={PURCHASE_COLUMNS_BACKEND.length + 1} className="p-6 text-center">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={PURCHASE_COLUMNS_BACKEND.length + 1} className="p-6 text-center">No data</td></tr>
          ) : data.map((row) => (
            <tr key={row.id ?? Math.random()} className="hover:bg-gray-50 align-top">
              {PURCHASE_COLUMNS_BACKEND.map(col => {
                const rawVal = row[col];

                // Locked cell
                if (NON_EDITABLE_COLS.has(col)) {
                  let display = rawVal;
                  if (typeof rawVal === 'number')
                    display = formatNumber(rawVal, threeDecimals.has(col) ? 3 : 2);
                  else if (rawVal == null) display = '';
                  return (
                    <td key={col} className="border px-2 py-1 max-w-[160px] truncate bg-gray-100 text-gray-500 text-xs" title={String(display)}>
                      {String(display)}
                    </td>
                  );
                }

                // Dropdown cell
                if (DROPDOWN_OPTIONS_BACKEND[col]) {
                  return (
                    <td key={col} className="border px-1 py-1 min-w-[120px]">
                      <select
                        value={rawVal ?? ''}
                        onChange={e => onRowChange(row.id, col, e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                      >
                        <option value="">-- Select --</option>
                        {DROPDOWN_OPTIONS_BACKEND[col].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                  );
                }

                // Editable input cell
                const inputType = ['int', 'decimal'].includes(FIELD_DATA_TYPES[col]) ? 'number' : 'text';
                return (
                  <td key={col} className="border px-1 py-1 min-w-[100px]">
                    <input
                      type={inputType}
                      value={rawVal ?? ''}
                      onChange={e => onRowChange(row.id, col, e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      step={inputType === 'number' ? 'any' : undefined}
                    />
                  </td>
                );
              })}
              <td className="border px-2 py-1">
                <button
                  onClick={() => onRowClick(row)}
                  className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-2 hover:bg-indigo-700 whitespace-nowrap"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── DIAMOND TABLE ────────────────────────────────────────────────────────────
const DiamondTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {['#','Stone From','Diamond Shape','No Of Stones','Carat','Rate','Value','Weight'].map(h => (
            <th key={h} className="p-2 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr><td colSpan={8} className="text-center p-4">No diamond records.</td></tr>
        ) : records.map((d, idx) => (
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
        ))}
      </tbody>
    </table>
  </div>
);

// ─── COLOR STONE TABLE ────────────────────────────────────────────────────────
const ColorStoneTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {['#','Color Stone Shape','No Of Stones','Carat','Rate','Value','Weight'].map(h => (
            <th key={h} className="p-2 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr><td colSpan={7} className="text-center p-4">No color stone records.</td></tr>
        ) : records.map((c, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border text-center">{idx + 1}</td>
            <td className="p-2 border"><input value={c.csShape || ''} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            <td className="p-2 border"><input value={c.NoOfStones || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            <td className="p-2 border"><input value={c.Carat || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            <td className="p-2 border"><input value={c.Rate || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            <td className="p-2 border"><input value={c.Value || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
            <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── ENTRY DETAIL MODAL ───────────────────────────────────────────────────────
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
            {[
              ['Supplier Name', entry.SupplierName], ['Invoice Number', entry.invoiceNumber],
              ['Invoice Date', entry.invoiceDate],   ['Product Name', entry.ProductName],
              ['Design No', entry.DesignNo],          ['Metal Type', entry.MetalType],
              ['Grand Total', entry.GrandTotal ?? 0], ['Gold Weight', entry.GoldWt ?? 0],
              ['IGI Summary No', entry.IgiSummaryNo], ['PGI UIN No', entry.PgiUinNo],
            ].map(([label, val]) => (
              <div key={label}>
                <label className="text-xs text-gray-600">{label}</label>
                <input value={val || ''} disabled className="w-full border p-1 rounded bg-gray-100" />
              </div>
            ))}
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const DiamondManager = () => {
  const [suppliers, setSuppliers]         = useState({});
  const [data, setData]                   = useState([]);
  const [uploadedData, setUploadedData]   = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [dataTypeErrors, setDataTypeErrors]     = useState([]);
  const [uploadStatus, setUploadStatus]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [diamonds, setDiamonds]           = useState([]);
  const [colorStones, setColorStones]     = useState([]);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useContext(DashBoardContext);

  useEffect(() => {
    if (!user) return;
    axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user })
      .then(res => setSuppliers(res.data))
      .catch(err => console.error('Error fetching suppliers:', err));
  }, [user]);

  // ── Handle inline cell edit ───────────────────────────────────────────────
  const handleRowChange = (rowId, col, value) => {
    setData(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const dataType = FIELD_DATA_TYPES[col];
      let parsed = value;
      if (dataType === 'int') {
        parsed = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(parsed)) parsed = 0;
      } else if (dataType === 'decimal') {
        parsed = value === '' ? 0 : parseFloat(value);
        if (isNaN(parsed)) parsed = 0;
      }
      return { ...row, [col]: parsed };
    }));
  };

  // ── Template generators ───────────────────────────────────────────────────
  const generateTemplate = (columns, filename, title) => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, buildSheet(columns, suppliers?.companyname || '', suppliers?.Suppcode || '', title), 'Purchase Entry');
    XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');
    XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');
    XLSX.writeFile(wb, filename);
    setUploadStatus({ type: 'success', message: 'Template downloaded successfully!' });
    setTimeout(() => setUploadStatus(null), 2500);
    setShowTemplateMenu(false);
  };

  const generateStandardTemplate = () =>
    generateTemplate(Object.keys(COLUMN_HEADER_MAP), 'Diamond_Purchase_Standard_Template.xlsx', 'DIAMOND PURCHASE ENTRY — STANDARD TEMPLATE (Gold + Platinum)');
  const generatePlatinumTemplate = () =>
    generateTemplate(PT_COLUMNS, 'Diamond_Purchase_Platinum_Template.xlsx', 'DIAMOND PURCHASE ENTRY — PLATINUM TEMPLATE');
  const generateGoldTemplate = () =>
    generateTemplate(GOLD_COLUMNS, 'Diamond_Purchase_Gold_Template.xlsx', 'DIAMOND PURCHASE ENTRY — GOLD TEMPLATE');

  // ── Validate uploaded data ────────────────────────────────────────────────
  const validateData = (mainData, diamondData, csData) => {
    const errors = [];
    mainData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      if (!row.SupplierName) errors.push(`Row ${idx + 8}: SupplierName is required`);
      if (!row.ProductName)  errors.push(`Row ${idx + 8}: ProductName is required`);
      if (!row.DesignNo)     errors.push(`Row ${idx + 8}: DesignNo is required`);
    });
    const purchaseIdSet = new Set(mainData.map(r => String(r.id ?? '')).filter(Boolean));
    diamondData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Diamond Row ${idx + 2}: Entry Id required`);
      else if (!purchaseIdSet.has(String(row.purchaseEntryId))) errors.push(`Diamond Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
    });
    csData.forEach((row, idx) => {
      const isEmpty = Object.values(row).every(v => v === '' || v === null || v === undefined || v === 0);
      if (isEmpty) return;
      if (!row.purchaseEntryId && row.purchaseEntryId !== 0) errors.push(`Color Stone Row ${idx + 2}: Entry Id required`);
      else if (!purchaseIdSet.has(String(row.purchaseEntryId))) errors.push(`Color Stone Row ${idx + 2}: purchaseEntryId '${row.purchaseEntryId}' not found`);
    });
    return errors;
  };

  // ── File upload handler ───────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const mainSheet   = wb.Sheets['Purchase Entry']      || wb.Sheets[wb.SheetNames[0]];
        const diamondSheet = wb.Sheets['Diamond Details']    || wb.Sheets[wb.SheetNames[1]];
        const csSheet      = wb.Sheets['Color Stone Details'] || wb.Sheets[wb.SheetNames[2]];

        if (!mainSheet) {
          setUploadStatus({ type: 'error', message: 'Purchase Entry sheet not found' });
          return;
        }

        const supplierName  = mainSheet['B2']?.v || '';
        const supplierCode  = mainSheet['B3']?.v || '';
        const invoiceDate   = mainSheet['B5']?.v || '';
        const invoiceNumber = mainSheet['B4'] ? `${mainSheet['B4'].v}|${invoiceDate}` : '';

        const mainDataRaw   = XLSX.utils.sheet_to_json(mainSheet, { range: 6, defval: '' });
        const diamondDataRaw = diamondSheet ? XLSX.utils.sheet_to_json(diamondSheet, { defval: '' }) : [];
        const csDataRaw      = csSheet      ? XLSX.utils.sheet_to_json(csSheet,      { defval: '' }) : [];

        const typeErrors = [];
        const mainData = mainDataRaw.map((row, idx) => {
          const mapped = mapExcelHeadersToBackend(row, idx, typeErrors);
          mapped.SupplierName   = supplierName;
          mapped.suppCode       = supplierCode;
          mapped.invoiceNumber  = invoiceNumber;
          mapped.invoiceDate    = invoiceDate;
          return mapped;
        });

        if (typeErrors.length > 0) {
          setDataTypeErrors(typeErrors);
          setValidationErrors([]);
          setUploadStatus({ type: 'error', message: `Data type validation failed (${typeErrors.length} errors)` });
          setUploadedData(null); setData([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const diamondData = diamondDataRaw.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          STONE_FROM:  row['Stone From']   || null,
          DiamondShape: row['Diamond Shape'] || null,
          NoOfStones:  row['No Of Stones'] || 0,
          Carat:  row['Carat']  || 0,
          Rate:   row['Rate']   || 0,
          Value:  row['Value']  || 0,
          Weight: row['Weight'] || 0,
        }));

        const csData = csDataRaw.map(row => ({
          purchaseEntryId: row['Entry Id'] || 0,
          csShape:    row['Color Stone Shape'] || null,
          NoOfStones: row['No Of Stones'] || 0,
          Carat:  row['Carat']  || 0,
          Rate:   row['Rate']   || 0,
          Value:  row['Value']  || 0,
          Weight: row['Weight'] || 0,
        }));

        const errors = validateData(mainData, diamondData, csData);
        if (errors.length > 0) {
          setValidationErrors(errors); setDataTypeErrors([]);
          setUploadStatus({ type: 'error', message: `Validation failed (${errors.length} errors)` });
          setUploadedData(null); setData([]);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        const grouped = mainData
          .filter(r => !Object.entries(r).every(([key, val]) =>
            ['SupplierName','suppCode','invoiceNumber','invoiceDate'].includes(key) ||
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

        setUploadedData({ mainData, diamondData, csData, groupedData: grouped });
        setData(grouped);
        setValidationErrors([]); setDataTypeErrors([]);
        setUploadStatus({ type: 'success', message: `✓ Loaded ${grouped.length} entries for ${supplierName || 'Unknown Supplier'}` });
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        // console.error(error);
        setUploadStatus({ type: 'error', message: 'Error reading file — check format' });
        setDataTypeErrors([]); setValidationErrors([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  // ── Save to backend ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!data.length) return;
    setLoading(true);
    try {
      await axios.post(`${DIA_API}/saveDiamondEntries`, data);
      setUploadStatus({ type: 'success', message: '✓ Data saved successfully!' });
      setTimeout(() => resetForm(), 1500);
    } catch (error) {
      const errorMsg = error.response?.data?.result || error.message || 'Error saving data!';
      setUploadStatus({ type: 'error', message: `✗ ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setData([]); setUploadedData(null);
    setValidationErrors([]); setDataTypeErrors([]);
    setUploadStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openDetails = (row) => {
    setSelectedEntry(row);
    setDiamonds(row.diamonds || []);
    setColorStones(row.colorStones || []);
    setShowModal(true);
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Diamond Purchase Entries
          </h2>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs mr-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: '#1E3A5F' }}></span> Normal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: '#6A1B9A' }}></span> Dropdown</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded inline-block" style={{ background: '#2E7D32' }}></span> Auto-calc</span>
            </div>

            {/* Template menu */}
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
                    <button onClick={generateStandardTemplate} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <div><div className="font-medium">Standard Template</div><div className="text-xs text-gray-500">Gold + Platinum</div></div>
                    </button>
                    <button onClick={generatePlatinumTemplate} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                      <div><div className="font-medium">Platinum Only</div><div className="text-xs text-gray-500">No Gold columns</div></div>
                    </button>
                    <button onClick={generateGoldTemplate} className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-yellow-600" />
                      <div><div className="font-medium">Gold Only Template</div><div className="text-xs text-gray-500">No Platinum columns</div></div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="px-3 py-2 bg-blue-600 text-white rounded cursor-pointer flex items-center gap-2 hover:bg-blue-700">
              <Upload className="w-4 h-4" /> Upload Filled Excel
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {showTemplateMenu && <div className="fixed inset-0 z-40" onClick={() => setShowTemplateMenu(false)} />}

        {/* Status */}
        {uploadStatus && (
          <div className={`p-3 rounded flex items-center gap-2 ${uploadStatus.type === 'error' ? 'bg-red-100 text-red-800 border-2 border-red-300' : 'bg-green-100 text-green-800 border-2 border-green-300'}`}>
            {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{uploadStatus.message}</span>
          </div>
        )}

        {dataTypeErrors.length > 0 && <ValidationErrorsTable errors={dataTypeErrors} />}

        {validationErrors.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded border-2 border-yellow-300">
            <div className="font-semibold mb-2 text-yellow-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Validation Errors ({validationErrors.length})
            </div>
            <div className="max-h-48 overflow-y-auto text-sm space-y-1">
              {validationErrors.map((err, i) => <div key={i} className="text-yellow-800">• {err}</div>)}
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? <LoadingState /> : data.length === 0 ? <EmptyState /> : (
          <PurchaseEntryTable
            data={data}
            loading={false}
            onRowClick={openDetails}
            onRowChange={handleRowChange}
          />
        )}

        {/* Save / Reset */}
        {data.length > 0 && (
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleSave} disabled={loading}
              className={`px-4 py-2 rounded font-medium flex items-center gap-2 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
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
