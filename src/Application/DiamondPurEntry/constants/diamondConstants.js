// ─── NON-EDITABLE COLUMNS ────────────────────────────────────────────────────
export const NON_EDITABLE_COLS = new Set([
  'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
]);

// ─── COLUMN HEADER MAPPING (Excel display → backend field) ───────────────────
export const COLUMN_HEADER_MAP = {
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

// ─── BACKEND → DISPLAY (reverse map) ─────────────────────────────────────────
export const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce(
  (acc, [display, backend]) => { acc[backend] = display; return acc; },
  {}
);
BACKEND_TO_DISPLAY_MAP['SupplierName']  = 'Supplier Name';
BACKEND_TO_DISPLAY_MAP['suppCode']      = 'Supplier Code';
BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
BACKEND_TO_DISPLAY_MAP['invoiceDate']   = 'Invoice Date';

// ─── FIELD DATA TYPES ─────────────────────────────────────────────────────────
export const FIELD_DATA_TYPES = {
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

// ─── COLUMN SETS ──────────────────────────────────────────────────────────────
export const PT_COLUMNS = [
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

export const GOLD_COLUMNS = [
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

export const PURCHASE_COLUMNS_BACKEND = [
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

// ─── DROPDOWN OPTIONS (Excel display-name keys — for buildSheet) ──────────────
export const DROPDOWN_OPTIONS = {
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

// ─── DROPDOWN OPTIONS (backend field-name keys — for React table selects) ────
export const DROPDOWN_OPTIONS_BACKEND = {
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

// ─── FORMULA DEFINITIONS (used by excelBuilder) ───────────────────────────────
export const FORMULA_DEFINITIONS = {
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
