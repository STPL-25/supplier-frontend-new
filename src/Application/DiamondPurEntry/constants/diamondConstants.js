// // // ─── NON-EDITABLE COLUMNS ────────────────────────────────────────────────────
// // export const NON_EDITABLE_COLS = new Set([
// //   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
// // ]);


// // // ─── COLUMN HEADER MAPPING (Excel display → backend field) ───────────────────
// // export const COLUMN_HEADER_MAP = {
// //   'Entry Id':                             'id',
// //   'Product Name':                         'ProductName',
// //   'Metal Type':                           'MetalType',
// //   'Weight Mode':                          'WtMode',
// //   'Design No':                            'DesignNo',
// //   'G Karat':                              'GCarat',
// //   'Pcs':                                  'PCS',
// //   'Gold Wt':                              'GoldWt',
// //   'Gold Net Wt':                          'GNetWt',
// //   'Gold Purity':                          'GoldPurity',
// //   'Gold Purity Wt':                       'GoldPurityWt',
// //   'Gold999Rate (without GST)':            'Gold999Rate',
// //   'Gold Value':                           'GoldValue',
// //   'PT Wt':                                'PTWt',
// //   'Platinum NetWt':                       'PNetWt',
// //   'PT Purity':                            'PTPurity',
// //   'PT Purity Wt':                         'PTPurityWt',
// //   'PT999Rate (without GST)':              'PT999Rate',
// //   'PT Value':                             'PTValue',
// //   'No of Stones':                         'NoofStone',
// //   'Diamond Carat':                        'DCarat',
// //   'Diamond Rate':                         'DiamondRate',
// //   'Diamond Value':                        'DiamondValue',
// //   'Diamond Wt':                           'DiamondWt',
// //   'ColorStone PCS':                       'ClrStnPCS',
// //   'ColorStone Carat':                     'CLSCarat',
// //   'ColorStone Wt':                        'ClrStnWt',
// //   'ColorStone Rate':                      'ClrStnRate',
// //   'ColorStone Amount':                    'CSAmount',
// //   'Gold Mc Type':                         'GoMcType',
// //   'Gold Mc Rate':                         'GoMcRate',
// //   'Gold Mc Amount':                       'GoMcAmount',
// //   'Platinum Mc Type':                     'PTMcType',
// //   'Platinum Mc Rate':                     'PTMcRate',
// //   'Platinum Mc Amount':                   'PTMcAmount',
// //   'Gold Wastage Type':                    'WastageType',
// //   'Gold Wastage Weight':                  'WastageWeight',
// //   'Gold Wastage Amount':                  'WastageAmt',
// //   'Platinum Wastage Type':                'PTWastageType',
// //   'Platinum Wastage Weight':              'PTWastageWeight',
// //   'Platinum Wastage Amount':              'PTWastageAmt',
// //   'Diamond Certificate Type':            'CertType',
// //   'Diamond Certificate GST':             'CertGST',
// //   'Diamond Certificate Qty':             'CertQty',
// //   'Diamond Certificate Rate':            'CertRate',
// //   'Diamond Certificate Taxable Amount':  'CertTaxableAmt',
// //   'Diamond Certificate Tax Amount':      'certTaxAmt',
// //   'Diamond Certificate Total':           'CertTotal',
// //   'Gold HallMark Type':                  'HallMarkType',
// //   'Gold HallMark GST':                   'HMGST',
// //   'GoldHallMark Qty':                    'HMQty',
// //   'Gold HallMark Rate':                  'HMRate',
// //   'Gold HallMark Taxable Amount':        'HMTaxableAmt',
// //   'Gold HallMark Tax Amount':            'HmTaxAmt',
// //   'Gold HallMark Total':                 'HMTotal',
// //   'HandleRate':                          'HandleRate',
// //   'HandleAmount':                        'HandleAmount',
// //   'Total Value':                         'TotalValue',
// //   'GST':                                 'GST',
// //   'Grand Total':                         'GrandTotal',
// //   'HUID No':                             'HUID',
// //   'IGI Summary No':                      'IgiSummaryNo',
// //   'PGI UIN No':                          'PgiUinNo',
// // };


// // // ─── BACKEND → DISPLAY (reverse map) ─────────────────────────────────────────
// // export const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce(
// //   (acc, [display, backend]) => { acc[backend] = display; return acc; },
// //   {}
// // );
// // BACKEND_TO_DISPLAY_MAP['SupplierName']  = 'Supplier Name';
// // BACKEND_TO_DISPLAY_MAP['suppCode']      = 'Supplier Code';
// // BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
// // BACKEND_TO_DISPLAY_MAP['invoiceDate']   = 'Invoice Date';


// // // ─── FIELD DATA TYPES ─────────────────────────────────────────────────────────
// // export const FIELD_DATA_TYPES = {
// //   'SupplierName': 'string', 'ProductName': 'string', 'MetalType': 'string',
// //   'WtMode': 'string', 'DesignNo': 'string', 'GoMcType': 'string',
// //   'WastageType': 'string', 'CertType': 'string', 'HallMarkType': 'string',
// //   'HUID': 'string', 'suppCode': 'string', 'PTMcType': 'string',
// //   'PTWastageType': 'string', 'IgiSummaryNo': 'string', 'PgiUinNo': 'string',
// //   'invoiceNumber': 'string', 'invoiceDate': 'string',
// //   'id': 'int', 'PCS': 'int', 'HMQty': 'int', 'NoofStone': 'int', 'ClrStnPCS': 'int',
// //   'GCarat': 'decimal', 'GoldWt': 'decimal', 'GoldPurity': 'decimal',
// //   'GoldPurityWt': 'decimal', 'Gold999Rate': 'decimal', 'GoldValue': 'decimal',
// //   'PTWt': 'decimal', 'PTPurity': 'decimal', 'PTPurityWt': 'decimal',
// //   'PT999Rate': 'decimal', 'PTValue': 'decimal', 'GoMcRate': 'decimal',
// //   'GoMcAmount': 'decimal', 'WastageWeight': 'decimal', 'WastageAmt': 'decimal',
// //   'CertGST': 'decimal', 'CertQty': 'decimal', 'CertRate': 'decimal',
// //   'CertTaxableAmt': 'decimal', 'CertTotal': 'decimal', 'HMGST': 'decimal',
// //   'HMRate': 'decimal', 'HMTaxableAmt': 'decimal', 'HMTotal': 'decimal',
// //   'HandleRate': 'decimal', 'HandleAmount': 'decimal', 'GNetWt': 'decimal',
// //   'PNetWt': 'decimal', 'TotalValue': 'decimal', 'GST': 'decimal',
// //   'GrandTotal': 'decimal', 'PTMcRate': 'decimal', 'PTMcAmount': 'decimal',
// //   'PTWastageWeight': 'decimal', 'PTWastageAmt': 'decimal', 'certTaxAmt': 'decimal',
// //   'HmTaxAmt': 'decimal', 'DCarat': 'decimal', 'DiamondRate': 'decimal',
// //   'DiamondValue': 'decimal', 'DiamondWt': 'decimal', 'CLSCarat': 'decimal',
// //   'ClrStnWt': 'decimal', 'ClrStnRate': 'decimal', 'CSAmount': 'decimal',
// // };


// // // ─── COLUMN SETS ──────────────────────────────────────────────────────────────
// // export const PT_COLUMNS = [
// //   'Entry Id','Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'Pcs',
// //   'PT Wt', 'Platinum NetWt', 'PT Purity', 'PT Purity Wt',
// //   'PT999Rate (without GST)', 'PT Value',
// //   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
// //   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
// //   'Platinum Mc Type', 'Platinum Mc Rate', 'Platinum Mc Amount',
// //   'Platinum Wastage Type', 'Platinum Wastage Weight', 'Platinum Wastage Amount',
// //   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
// //   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
// //   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
// //   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
// //   'IGI Summary No', 'PGI UIN No',
// // ];


// // export const GOLD_COLUMNS = [
// //   'Entry Id','Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'G Karat', 'Pcs',
// //   'Gold Wt', 'Gold Net Wt', 'Gold Purity', 'Gold Purity Wt',
// //   'Gold999Rate (without GST)', 'Gold Value',
// //   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
// //   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
// //   'Gold Mc Type', 'Gold Mc Rate', 'Gold Mc Amount',
// //   'Gold Wastage Type', 'Gold Wastage Weight', 'Gold Wastage Amount',
// //   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
// //   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
// //   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
// //   'Gold HallMark Type', 'Gold HallMark GST', 'GoldHallMark Qty',
// //   'Gold HallMark Rate', 'Gold HallMark Taxable Amount', 'Gold HallMark Tax Amount', 'Gold HallMark Total',
// //   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
// //   'HUID No', 'IGI Summary No', 'PGI UIN No',
// // ];


// // export const PURCHASE_COLUMNS_BACKEND = [
// //   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
// //   'ProductName', 'MetalType', 'WtMode', 'DesignNo',
// //   'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue',
// //   'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
// //   'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
// //   'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount',
// //   'GoMcType', 'GoMcRate', 'GoMcAmount',
// //   'PTMcType', 'PTMcRate', 'PTMcAmount',
// //   'WastageType', 'WastageWeight', 'WastageAmt',
// //   'PTWastageType', 'PTWastageWeight', 'PTWastageAmt',
// //   'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt', 'certTaxAmt', 'CertTotal',
// //   'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HmTaxAmt', 'HMTotal',
// //   'HandleRate', 'HandleAmount',
// //   'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID', 'IgiSummaryNo', 'PgiUinNo',
// // ];


// // // ─── DROPDOWN OPTIONS (Excel display-name keys — for buildSheet) ──────────────
// // export const DROPDOWN_OPTIONS = {
// //   'Metal Type':               ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
// //   'Weight Mode':              ['Gross Weight', 'Net Weight'],
// //   'G Karat':                  ['18K', '20K', '22K', '24K', '14K'],
// //   'Gold Mc Type':             ['Percentage', 'Per Gram', 'Fixed'],
// //   'Platinum Mc Type':         ['Percentage', 'Per Gram', 'Fixed'],
// //   'Gold Wastage Type':        ['Percentage', 'Fixed Weight'],
// //   'Platinum Wastage Type':    ['Percentage', 'Fixed Weight'],
// //   'Diamond Certificate Type': ['IGI', 'GIA', 'HRD', 'None'],
// //   'Gold HallMark Type':       ['HUID', 'BIS', 'None'],
// //   'GST':                      ['1.5', '3', '5', '12', '18'],
// //   'Diamond Certificate GST':  ['5', '12', '18'],
// //   'Gold HallMark GST':        ['5', '12', '18'],
// // };


// // // ─── DROPDOWN OPTIONS (backend field-name keys — for React table selects) ────
// // export const DROPDOWN_OPTIONS_BACKEND = {
// //   'MetalType':     ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
// //   'WtMode':        ['Gross Weight', 'Net Weight'],
// //   'GCarat':        ['18K', '20K', '22K', '24K', '14K'],
// //   'GoMcType':      ['Percentage', 'Per Gram', 'Fixed'],
// //   'PTMcType':      ['Percentage', 'Per Gram', 'Fixed'],
// //   'WastageType':   ['Percentage', 'Fixed Weight'],
// //   'PTWastageType': ['Percentage', 'Fixed Weight'],
// //   'CertType':      ['IGI', 'GIA', 'HRD', 'None'],
// //   'HallMarkType':  ['HUID', 'BIS', 'None'],
// //   'GST':           ['1.5', '3', '5', '12', '18'],
// //   'CertGST':       ['5', '12', '18'],
// //   'HMGST':         ['5', '12', '18'],
// // };


// // // ─── DIAMOND DETAIL SHEET FORMULAS ───────────────────────────────────────────
// // // Column layout: A=Entry Id, B=Stone From, C=Diamond Shape,
// // //                D=No Of Stones, E=Carat, F=Rate, G=Value, H=Weight
// // export const DIAMOND_DETAIL_FORMULAS = {
// //   // Value = Carat × Rate
// //   'Value': (cols, r) =>
// //     cols['Carat'] && cols['Rate']
// //       ? `=${cols['Carat']}${r}*${cols['Rate']}${r}` : '',
// //   // Weight = Carat ÷ 5  (1 diamond carat = 0.2g)
// //   'Weight': (cols, r) =>
// //     cols['Carat']
// //       ? `=${cols['Carat']}${r}/5` : '',
// // };


// // // ─── COLOR STONE DETAIL SHEET FORMULAS ───────────────────────────────────────
// // // Column layout: A=Entry Id, B=Color Stone Shape,
// // //                C=No Of Stones, D=Carat, E=Rate, F=Value, G=Weight
// // export const COLORSTONE_DETAIL_FORMULAS = {
// //   // Value = Carat × Rate
// //   'Value': (cols, r) =>
// //     cols['Carat'] && cols['Rate']
// //       ? `=${cols['Carat']}${r}*${cols['Rate']}${r}` : '',
// //   // Weight = Carat ÷ 5
// //   'Weight': (cols, r) =>
// //     cols['Carat']
// //       ? `=${cols['Carat']}${r}/5` : '',
// // };


// // // ─── FORMULA DEFINITIONS (Purchase Entry sheet) ───────────────────────────────
// // //
// // // LOOKUP columns (orange header) — auto-sum from detail sheets via SUMIF.
// // //   Purchase Entry col A = Entry Id (used as SUMIF lookup key)
// // //   Diamond Details:      A=EntryId  D=NoOfStones  E=Carat  G=Value  H=Weight
// // //   Color Stone Details:  A=EntryId  C=NoOfStones  D=Carat  F=Value  G=Weight
// // //
// // // FORMULA columns (green header) — calculated within this sheet.
// // //
// // export const FORMULA_DEFINITIONS = {

// //   // ── Gold ──────────────────────────────────────────────────────────────────
// //   // Gold Purity Wt = Gold Wt (gross) × Gold Purity / 100
// //   'Gold Purity Wt': (cols, r) =>
// //     cols['Gold Net Wt'] && cols['Gold Purity']
// //       ? `=${cols['Gold Net Wt']}${r}*${cols['Gold Purity']}${r}/100` : '',

// //   'Gold Value': (cols, r) =>
// //     cols['Gold Purity Wt'] && cols['Gold999Rate (without GST)']
// //       ? `=${cols['Gold Purity Wt']}${r}*${cols['Gold999Rate (without GST)']}${r}` : '',

// //   // ── Platinum ──────────────────────────────────────────────────────────────
// //   // PT Purity Wt = PT Wt (gross) × PT Purity / 100
// //   'PT Purity Wt': (cols, r) =>
// //     cols['PT Net Wt'] && cols['PT Purity']
// //       ? `=${cols['PT Net Wt']}${r}*${cols['PT Purity']}${r}/100` : '',

// //   'PT Value': (cols, r) =>
// //     cols['PT Purity Wt'] && cols['PT999Rate (without GST)']
// //       ? `=${cols['PT Purity Wt']}${r}*${cols['PT999Rate (without GST)']}${r}` : '',

// //   // ── Making Charges ────────────────────────────────────────────────────────
// //   'Gold Mc Amount': (cols, r) =>
// //     cols['Gold Net Wt'] && cols['Gold Mc Rate']
// //       ? `=${cols['Gold Net Wt']}${r}*${cols['Gold Mc Rate']}${r}` : '',

// //   'Platinum Mc Amount': (cols, r) =>
// //     cols['Platinum NetWt'] && cols['Platinum Mc Rate']
// //       ? `=${cols['Platinum NetWt']}${r}*${cols['Platinum Mc Rate']}${r}` : '',

// //   // ── Diamond SUMIF lookups (from Diamond Details sheet) ────────────────────
// //   // Entry Id is always column A in Purchase Entry (first column in colMap)
// //   'No of Stones': (cols, r) =>
// //     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$D:$D),0)`,

// //   'Diamond Carat': (cols, r) =>
// //     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$E:$E),0)`,

// //   'Diamond Value': (cols, r) =>
// //     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$G:$G),0)`,
// //   'Diamond Rate': (cols, r) =>
// //     cols['Diamond Carat'] ? `=IF(${cols['Diamond Carat']}${r}>0,${cols['Diamond Value']}${r}/${cols['Diamond Carat']}${r},0)` : '',

// //   'Diamond Wt': (cols, r) =>
// //     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$H:$H),0)`,

// //   // ── Color Stone SUMIF lookups (from Color Stone Details sheet) ────────────
// //   'ColorStone PCS': (cols, r) =>
// //     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$C:$C),0)`,

// //   'ColorStone Carat': (cols, r) =>
// //     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$D:$D),0)`,
// //  'ColorStone Rate': (cols, r) =>
// //     cols['ColorStone Carat'] ? `=IF(${cols['ColorStone Carat']}${r}>0,${cols['ColorStone Amount']}${r}/${cols['ColorStone Carat']}${r},0)` : '',
// //   'ColorStone Amount': (cols, r) =>
// //     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$F:$F),0)`,

// //   'ColorStone Wt': (cols, r) =>
// //     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$G:$G),0)`,

// //   // ── Diamond Certificate ───────────────────────────────────────────────────
// //   'Diamond Certificate Taxable Amount': (cols, r) =>
// //     cols['Diamond Certificate Qty'] && cols['Diamond Certificate Rate']
// //       ? `=${cols['Diamond Certificate Qty']}${r}*${cols['Diamond Certificate Rate']}${r}` : '',

// //   'Diamond Certificate Tax Amount': (cols, r) =>
// //     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate GST']
// //       ? `=${cols['Diamond Certificate Taxable Amount']}${r}*${cols['Diamond Certificate GST']}${r}/100` : '',

// //   'Diamond Certificate Total': (cols, r) =>
// //     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate Tax Amount']
// //       ? `=${cols['Diamond Certificate Taxable Amount']}${r}+${cols['Diamond Certificate Tax Amount']}${r}` : '',

// //   // ── Gold HallMark ─────────────────────────────────────────────────────────
// //   'Gold HallMark Taxable Amount': (cols, r) =>
// //     cols['GoldHallMark Qty'] && cols['Gold HallMark Rate']
// //       ? `=${cols['GoldHallMark Qty']}${r}*${cols['Gold HallMark Rate']}${r}` : '',

// //   'Gold HallMark Tax Amount': (cols, r) =>
// //     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark GST']
// //       ? `=${cols['Gold HallMark Taxable Amount']}${r}*${cols['Gold HallMark GST']}${r}/100` : '',

// //   'Gold HallMark Total': (cols, r) =>
// //     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark Tax Amount']
// //       ? `=${cols['Gold HallMark Taxable Amount']}${r}+${cols['Gold HallMark Tax Amount']}${r}` : '',

// //   // ── Handle Amount ─────────────────────────────────────────────────────────
// //   // Gold sheet → 'Gold Net Wt';  PT sheet → 'PT Net Wt'
// //   'HandleAmount': (cols, r) => {
// //     const wtCol = cols['Gold Net Wt'] || cols['PT Net Wt'];
// //     return wtCol && cols['HandleRate']
// //       ? `=${wtCol}${r}*${cols['HandleRate']}${r}` : '';
// //   },

// //   // ── Total Value ───────────────────────────────────────────────────────────
// //   'Total Value': (cols, r) => {
// //     const parts = [
// //       cols['Gold Value'],
// //       cols['PT Value'],
// //       cols['Diamond Value'],
// //       cols['ColorStone Amount'],
// //       cols['Gold Mc Amount'],
// //       cols['Platinum Mc Amount'],
// //       cols['Gold Wastage Amount'],
// //       cols['Platinum Wastage Amount'],
// //       cols['Diamond Certificate Total'],
// //       cols['Gold HallMark Total'],
// //       cols['HandleAmount'],
// //     ].filter(Boolean).map(c => `${c}${r}`);
// //     return parts.length ? '=' + parts.join('+') : '';
// //   },

// //   // ── Grand Total ───────────────────────────────────────────────────────────
// //   'Grand Total': (cols, r) =>
// //     cols['Total Value'] && cols['GST']
// //       ? `=${cols['Total Value']}${r}+(${cols['Total Value']}${r}*${cols['GST']}${r}/100)` : '',
// // };


// // // ─── LOOKUP COLUMNS SET (for orange header color + locked style in buildSheet) ─
// // // These are auto-populated via SUMIF from detail sheets — user must NOT edit them
// // export const LOOKUP_COLUMNS = new Set([
// //   'No of Stones',
// //   'Diamond Carat',
// //   'Diamond Value',
// //   'Diamond Wt',
// //   'ColorStone PCS',
// //   'ColorStone Carat',
// //   'ColorStone Amount',
// //   'ColorStone Wt',
// // ]);



// // ─── NON-EDITABLE COLUMNS ────────────────────────────────────────────────────
// export const NON_EDITABLE_COLS = new Set([
//   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate', 'po_number'
// ]);



// // ─── COLUMN HEADER MAPPING (Excel display → backend field) ───────────────────
// export const COLUMN_HEADER_MAP = {
//   'Entry Id':                             'id',
//   'Product Name':                         'ProductName',
//   'Metal Type':                           'MetalType',
//   'Weight Mode':                          'WtMode',
//   'Design No':                            'DesignNo',
//   'G Karat':                              'GCarat',
//   'Pcs':                                  'PCS',
//   'Gold Wt':                              'GoldWt',
//   'Gold Net Wt':                          'GNetWt',
//   'Gold Purity':                          'GoldPurity',
//   'Gold Purity Wt':                       'GoldPurityWt',
//   'Gold999Rate (without GST)':            'Gold999Rate',
//   'Gold Value':                           'GoldValue',
//   'PT Wt':                                'PTWt',
//   'Platinum NetWt':                       'PNetWt',
//   'PT Purity':                            'PTPurity',
//   'PT Purity Wt':                         'PTPurityWt',
//   'PT999Rate (without GST)':              'PT999Rate',
//   'PT Value':                             'PTValue',
//   'No of Stones':                         'NoofStone',
//   'Diamond Carat':                        'DCarat',
//   'Diamond Rate':                         'DiamondRate',
//   'Diamond Value':                        'DiamondValue',
//   'Diamond Wt':                           'DiamondWt',
//   'ColorStone PCS':                       'ClrStnPCS',
//   'ColorStone Carat':                     'CLSCarat',
//   'ColorStone Wt':                        'ClrStnWt',
//   'ColorStone Rate':                      'ClrStnRate',
//   'ColorStone Amount':                    'CSAmount',
//   'Gold Mc Type':                         'GoMcType',
//   'Gold Mc Rate':                         'GoMcRate',
//   'Gold Mc Amount':                       'GoMcAmount',
//   'Platinum Mc Type':                     'PTMcType',
//   'Platinum Mc Rate':                     'PTMcRate',
//   'Platinum Mc Amount':                   'PTMcAmount',
//   'Gold Wastage Type':                    'WastageType',
//   'Gold Wastage Weight':                  'WastageWeight',
//   'Gold Wastage Amount':                  'WastageAmt',
//   'Platinum Wastage Type':                'PTWastageType',
//   'Platinum Wastage Weight':              'PTWastageWeight',
//   'Platinum Wastage Amount':              'PTWastageAmt',
//   'Diamond Certificate Type':            'CertType',
//   'Diamond Certificate GST':             'CertGST',
//   'Diamond Certificate Qty':             'CertQty',
//   'Diamond Certificate Rate':            'CertRate',
//   'Diamond Certificate Taxable Amount':  'CertTaxableAmt',
//   'Diamond Certificate Tax Amount':      'certTaxAmt',
//   'Diamond Certificate Total':           'CertTotal',
//   'Gold HallMark Type':                  'HallMarkType',
//   'Gold HallMark GST':                   'HMGST',
//   'GoldHallMark Qty':                    'HMQty',
//   'Gold HallMark Rate':                  'HMRate',
//   'Gold HallMark Taxable Amount':        'HMTaxableAmt',
//   'Gold HallMark Tax Amount':            'HmTaxAmt',
//   'Gold HallMark Total':                 'HMTotal',
//   'HandleRate':                          'HandleRate',
//   'HandleAmount':                        'HandleAmount',
//   'Total Value':                         'TotalValue',
//   'GST':                                 'GST',
//   'Grand Total':                         'GrandTotal',
//   'HUID No':                             'HUID',
//   'IGI Summary No':                      'IgiSummaryNo',
//   'PGI UIN No':                          'PgiUinNo',
// };



// // ─── BACKEND → DISPLAY (reverse map) ─────────────────────────────────────────
// export const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce(
//   (acc, [display, backend]) => { acc[backend] = display; return acc; },
//   {}
// );
// BACKEND_TO_DISPLAY_MAP['SupplierName']  = 'Supplier Name';
// BACKEND_TO_DISPLAY_MAP['suppCode']      = 'Supplier Code';
//     BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
// BACKEND_TO_DISPLAY_MAP['invoiceDate']   = 'Invoice Date';
// BACKEND_TO_DISPLAY_MAP['po_number']     = 'PO Number';


// // ─── FIELD DATA TYPES ─────────────────────────────────────────────────────────
// export const FIELD_DATA_TYPES = {
//   'SupplierName': 'string', 'ProductName': 'string', 'MetalType': 'string',
//   'WtMode': 'string', 'DesignNo': 'string', 'GoMcType': 'string',
//   'WastageType': 'string', 'CertType': 'string', 'HallMarkType': 'string',
//   'HUID': 'string', 'suppCode': 'string', 'PTMcType': 'string',
//   'PTWastageType': 'string', 'IgiSummaryNo': 'string', 'PgiUinNo': 'string',
//   'invoiceNumber': 'string', 'invoiceDate': 'string', 'po_number': 'string',
//   'id': 'int', 'PCS': 'int', 'HMQty': 'int', 'NoofStone': 'int', 'ClrStnPCS': 'int',
//   'GCarat': 'decimal', 'GoldWt': 'decimal', 'GoldPurity': 'decimal',
//   'GoldPurityWt': 'decimal', 'Gold999Rate': 'decimal', 'GoldValue': 'decimal',
//   'PTWt': 'decimal', 'PTPurity': 'decimal', 'PTPurityWt': 'decimal',
//   'PT999Rate': 'decimal', 'PTValue': 'decimal', 'GoMcRate': 'decimal',
//   'GoMcAmount': 'decimal', 'WastageWeight': 'decimal', 'WastageAmt': 'decimal',
//   'CertGST': 'decimal', 'CertQty': 'decimal', 'CertRate': 'decimal',
//   'CertTaxableAmt': 'decimal', 'CertTotal': 'decimal', 'HMGST': 'decimal',
//   'HMRate': 'decimal', 'HMTaxableAmt': 'decimal', 'HMTotal': 'decimal',
//   'HandleRate': 'decimal', 'HandleAmount': 'decimal', 'GNetWt': 'decimal',
//   'PNetWt': 'decimal', 'TotalValue': 'decimal', 'GST': 'decimal',
//   'GrandTotal': 'decimal', 'PTMcRate': 'decimal', 'PTMcAmount': 'decimal',
//   'PTWastageWeight': 'decimal', 'PTWastageAmt': 'decimal', 'certTaxAmt': 'decimal',
//   'HmTaxAmt': 'decimal', 'DCarat': 'decimal', 'DiamondRate': 'decimal',
//   'DiamondValue': 'decimal', 'DiamondWt': 'decimal', 'CLSCarat': 'decimal',
//   'ClrStnWt': 'decimal', 'ClrStnRate': 'decimal', 'CSAmount': 'decimal',
// };



// // ─── COLUMN SETS ──────────────────────────────────────────────────────────────
// export const PT_COLUMNS = [
//   'Entry Id','Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'Pcs',
//   'PT Wt', 'Platinum NetWt', 'PT Purity', 'PT Purity Wt',
//   'PT999Rate (without GST)', 'PT Value',
//   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
//   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
//   'Platinum Mc Type', 'Platinum Mc Rate', 'Platinum Mc Amount',
//   'Platinum Wastage Type', 'Platinum Wastage Weight', 'Platinum Wastage Amount',
//   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
//   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
//   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
//   'IGI Summary No', 'PGI UIN No',
// ];



// export const GOLD_COLUMNS = [
//   'Entry Id','Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'G Karat', 'Pcs',
//   'Gold Wt', 'Gold Net Wt', 'Gold Purity', 'Gold Purity Wt',
//   'Gold999Rate (without GST)', 'Gold Value',
//   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
//   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
//   'Gold Mc Type', 'Gold Mc Rate', 'Gold Mc Amount',
//   'Gold Wastage Type', 'Gold Wastage Weight', 'Gold Wastage Amount',
//   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
//   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
//   'Gold HallMark Type', 'Gold HallMark GST', 'GoldHallMark Qty',
//   'Gold HallMark Rate', 'Gold HallMark Taxable Amount', 'Gold HallMark Tax Amount', 'Gold HallMark Total',
//   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
//   'HUID No', 'IGI Summary No', 'PGI UIN No',
// ];



// export const PURCHASE_COLUMNS_BACKEND = [
//   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
//   'ProductName', 'MetalType', 'WtMode', 'DesignNo',
//   'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue',
//   'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
//   'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
//   'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount',
//   'GoMcType', 'GoMcRate', 'GoMcAmount',
//   'PTMcType', 'PTMcRate', 'PTMcAmount',
//   'WastageType', 'WastageWeight', 'WastageAmt',
//   'PTWastageType', 'PTWastageWeight', 'PTWastageAmt',
//   'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt', 'certTaxAmt', 'CertTotal',
//   'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HmTaxAmt', 'HMTotal',
//   'HandleRate', 'HandleAmount',
//   'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID', 'IgiSummaryNo', 'PgiUinNo',
// ];



// // ─── DROPDOWN OPTIONS (Excel display-name keys — for buildSheet) ──────────────
// export const DROPDOWN_OPTIONS = {
//   'Metal Type':               ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
//   'Weight Mode':              ['Gross Weight', 'Net Weight'],
//   'G Karat':                  ['18K', '20K', '22K', '24K', '14K'],
//   'Gold Mc Type':             ['Percentage', 'Per Gram', 'Fixed'],
//   'Platinum Mc Type':         ['Percentage', 'Per Gram', 'Fixed'],
//   'Gold Wastage Type':        ['Percentage', 'Fixed Weight'],
//   'Platinum Wastage Type':    ['Percentage', 'Fixed Weight'],
//   'Diamond Certificate Type': ['IGI', 'GIA', 'HRD', 'None'],
//   'Gold HallMark Type':       ['HUID', 'BIS', 'None'],
//   'GST':                      ['1.5', '3', '5', '12', '18'],
//   'Diamond Certificate GST':  ['5', '12', '18'],
//   'Gold HallMark GST':        ['5', '12', '18'],
// };



// // ─── DROPDOWN OPTIONS (backend field-name keys — for React table selects) ────
// export const DROPDOWN_OPTIONS_BACKEND = {
//   'MetalType':     ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
//   'WtMode':        ['Gross Weight', 'Net Weight'],
//   'GCarat':        ['18K', '20K', '22K', '24K', '14K'],
//   'GoMcType':      ['Percentage', 'Per Gram', 'Fixed'],
//   'PTMcType':      ['Percentage', 'Per Gram', 'Fixed'],
//   'WastageType':   ['Percentage', 'Fixed Weight'],
//   'PTWastageType': ['Percentage', 'Fixed Weight'],
//   'CertType':      ['IGI', 'GIA', 'HRD', 'None'],
//   'HallMarkType':  ['HUID', 'BIS', 'None'],
//   'GST':           ['1.5', '3', '5', '12', '18'],
//   'CertGST':       ['5', '12', '18'],
//   'HMGST':         ['5', '12', '18'],
// };



// // ─── DIAMOND DETAIL SHEET FORMULAS ───────────────────────────────────────────
// // Column layout: A=Entry Id, B=Stone From, C=Diamond Shape,
// //                D=No Of Stones, E=Carat, F=Rate, G=Value, H=Weight
// export const DIAMOND_DETAIL_FORMULAS = {
//   // Value = ROUND(Carat × Rate, 3)
//   'Value': (cols, r) =>
//     cols['Carat'] && cols['Rate']
//       ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',

//   // Weight = ROUND(Carat ÷ 5, 3)  (1 diamond carat = 0.2g)
//   'Weight': (cols, r) =>
//     cols['Carat']
//       ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
// };



// // ─── COLOR STONE DETAIL SHEET FORMULAS ───────────────────────────────────────
// // Column layout: A=Entry Id, B=Color Stone Shape,
// //                C=No Of Stones, D=Carat, E=Rate, F=Value, G=Weight
// export const COLORSTONE_DETAIL_FORMULAS = {
//   // Value = ROUND(Carat × Rate, 3)
//   'Value': (cols, r) =>
//     cols['Carat'] && cols['Rate']
//       ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',

//   // Weight = ROUND(Carat ÷ 5, 3)
//   'Weight': (cols, r) =>
//     cols['Carat']
//       ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
// };



// // ─── FORMULA DEFINITIONS (Purchase Entry sheet) ───────────────────────────────
// //
// // LOOKUP columns (orange header) — auto-sum from detail sheets via SUMIF.
// //   Purchase Entry col A = Entry Id (used as SUMIF lookup key)
// //   Diamond Details:      A=EntryId  D=NoOfStones  E=Carat  G=Value  H=Weight
// //   Color Stone Details:  A=EntryId  C=NoOfStones  D=Carat  F=Value  G=Weight
// //
// // FORMULA columns (green header) — calculated within this sheet.
// //
// export const FORMULA_DEFINITIONS = {

//   // ── Gold ──────────────────────────────────────────────────────────────────
//   // Gold Purity Wt = ROUND(Gold Net Wt × Gold Purity / 100, 3)
//   'Gold Purity Wt': (cols, r) =>
//     cols['Gold Net Wt'] && cols['Gold Purity']
//       ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Purity']}${r}/100,3)` : '',

//   // Gold Value = ROUND(Gold Purity Wt × Gold999Rate, 3)
//   'Gold Value': (cols, r) =>
//     cols['Gold Purity Wt'] && cols['Gold999Rate (without GST)']
//       ? `=ROUND(${cols['Gold Purity Wt']}${r}*${cols['Gold999Rate (without GST)']}${r},3)` : '',


//   // ── Platinum ──────────────────────────────────────────────────────────────
//   // PT Purity Wt = ROUND(PT Net Wt × PT Purity / 100, 3)
//   'PT Purity Wt': (cols, r) =>
//     cols['PT Net Wt'] && cols['PT Purity']
//       ? `=ROUND(${cols['PT Net Wt']}${r}*${cols['PT Purity']}${r}/100,3)` : '',

//   // PT Value = ROUND(PT Purity Wt × PT999Rate, 3)
//   'PT Value': (cols, r) =>
//     cols['PT Purity Wt'] && cols['PT999Rate (without GST)']
//       ? `=ROUND(${cols['PT Purity Wt']}${r}*${cols['PT999Rate (without GST)']}${r},3)` : '',


//   // ── Making Charges ────────────────────────────────────────────────────────
//   // Gold Mc Amount = ROUND(Gold Net Wt × Gold Mc Rate, 3)
//   'Gold Mc Amount': (cols, r) =>
//     cols['Gold Net Wt'] && cols['Gold Mc Rate']
//       ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Mc Rate']}${r},3)` : '',

//   // Platinum Mc Amount = ROUND(Platinum NetWt × Platinum Mc Rate, 3)
//   'Platinum Mc Amount': (cols, r) =>
//     cols['Platinum NetWt'] && cols['Platinum Mc Rate']
//       ? `=ROUND(${cols['Platinum NetWt']}${r}*${cols['Platinum Mc Rate']}${r},3)` : '',


//   // ── Diamond SUMIF lookups (from Diamond Details sheet) ────────────────────
//   'No of Stones': (cols, r) =>
//     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$D:$D),0)`,

//   'Diamond Carat': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$E:$E),3),0)`,

//   'Diamond Value': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$G:$G),3),0)`,

//   'Diamond Rate': (cols, r) =>
//     cols['Diamond Carat']
//       ? `=IF(${cols['Diamond Carat']}${r}>0,ROUND(${cols['Diamond Value']}${r}/${cols['Diamond Carat']}${r},3),0)` : '',

//   'Diamond Wt': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$H:$H),3),0)`,


//   // ── Color Stone SUMIF lookups (from Color Stone Details sheet) ────────────
//   'ColorStone PCS': (cols, r) =>
//     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$C:$C),0)`,

//   'ColorStone Carat': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$D:$D),3),0)`,

//   'ColorStone Amount': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$F:$F),3),0)`,

//   'ColorStone Rate': (cols, r) =>
//     cols['ColorStone Carat']
//       ? `=IF(${cols['ColorStone Carat']}${r}>0,ROUND(${cols['ColorStone Amount']}${r}/${cols['ColorStone Carat']}${r},3),0)` : '',

//   'ColorStone Wt': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$G:$G),3),0)`,


//   // ── Diamond Certificate ───────────────────────────────────────────────────
//   // Taxable Amount = ROUND(Qty × Rate, 3)
//   'Diamond Certificate Taxable Amount': (cols, r) =>
//     cols['Diamond Certificate Qty'] && cols['Diamond Certificate Rate']
//       ? `=ROUND(${cols['Diamond Certificate Qty']}${r}*${cols['Diamond Certificate Rate']}${r},3)` : '',

//   // Tax Amount = ROUND(Taxable Amount × GST / 100, 3)
//   'Diamond Certificate Tax Amount': (cols, r) =>
//     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate GST']
//       ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}*${cols['Diamond Certificate GST']}${r}/100,3)` : '',

//   // Total = ROUND(Taxable Amount + Tax Amount, 3)
//   'Diamond Certificate Total': (cols, r) =>
//     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate Tax Amount']
//       ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}+${cols['Diamond Certificate Tax Amount']}${r},3)` : '',


//   // ── Gold HallMark ─────────────────────────────────────────────────────────
//   // Taxable Amount = ROUND(Qty × Rate, 3)
//   'Gold HallMark Taxable Amount': (cols, r) =>
//     cols['GoldHallMark Qty'] && cols['Gold HallMark Rate']
//       ? `=ROUND(${cols['GoldHallMark Qty']}${r}*${cols['Gold HallMark Rate']}${r},3)` : '',

//   // Tax Amount = ROUND(Taxable Amount × GST / 100, 3)
//   'Gold HallMark Tax Amount': (cols, r) =>
//     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark GST']
//       ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}*${cols['Gold HallMark GST']}${r}/100,3)` : '',

//   // Total = ROUND(Taxable Amount + Tax Amount, 3)
//   'Gold HallMark Total': (cols, r) =>
//     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark Tax Amount']
//       ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}+${cols['Gold HallMark Tax Amount']}${r},3)` : '',


//   // ── Handle Amount ─────────────────────────────────────────────────────────
//   // Gold sheet → 'Gold Net Wt';  PT sheet → 'PT Net Wt'
//   'HandleAmount': (cols, r) => {
//     const wtCol = cols['Gold Net Wt'] || cols['PT Net Wt'];
//     return wtCol && cols['HandleRate']
//       ? `=ROUND(${wtCol}${r}*${cols['HandleRate']}${r},3)` : '';
//   },


//   // ── Total Value ───────────────────────────────────────────────────────────
//   'Total Value': (cols, r) => {
//     const parts = [
//       cols['Gold Value'],
//       cols['PT Value'],
//       cols['Diamond Value'],
//       cols['ColorStone Amount'],
//       cols['Gold Mc Amount'],
//       cols['Platinum Mc Amount'],
//       cols['Gold Wastage Amount'],
//       cols['Platinum Wastage Amount'],
//       cols['Diamond Certificate Total'],
//       cols['Gold HallMark Total'],
//       cols['HandleAmount'],
//     ].filter(Boolean).map(c => `${c}${r}`);
//     return parts.length ? `=ROUND(${parts.join('+')},3)` : '';
//   },


//   // ── Grand Total ───────────────────────────────────────────────────────────
//   'Grand Total': (cols, r) =>
//     cols['Total Value'] && cols['GST']
//       ? `=ROUND(${cols['Total Value']}${r}+(${cols['Total Value']}${r}*${cols['GST']}${r}/100),3)` : '',
// };



// // ─── LOOKUP COLUMNS SET (for orange header color + locked style in buildSheet) ─
// // These are auto-populated via SUMIF from detail sheets — user must NOT edit them
// export const LOOKUP_COLUMNS = new Set([
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Amount',
//   'ColorStone Wt',
// ]);
// ─── NON-EDITABLE COLUMNS ────────────────────────────────────────────────────
// Includes: identity fields + LOOKUP columns (SUMIF) + FORMULA columns (calculated)
// export const NON_EDITABLE_COLS = new Set([
//   // Identity / Invoice fields
//   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate', 'po_number',

//   // LOOKUP columns — auto-summed via SUMIF from Diamond Details sheet
//   'NoofStone',      // No of Stones
//   'DCarat',         // Diamond Carat
//   'DiamondValue',   // Diamond Value
//   'DiamondWt',      // Diamond Wt

//   // LOOKUP columns — auto-summed via SUMIF from Color Stone Details sheet
//   'ClrStnPCS',      // ColorStone PCS
//   'CLSCarat',       // ColorStone Carat
//   'CSAmount',       // ColorStone Amount
//   'ClrStnWt',       // ColorStone Wt

//   // FORMULA columns — Gold
//   'GoldPurityWt',   // Gold Purity Wt  = ROUND(GNetWt × GoldPurity / 100, 3)
//   'GoldValue',      // Gold Value       = ROUND(GoldPurityWt × Gold999Rate, 3)
//   'GoMcAmount',     // Gold Mc Amount   = ROUND(GNetWt × GoMcRate, 3)

//   // FORMULA columns — Platinum
//   'PTPurityWt',     // PT Purity Wt     = ROUND(PNetWt × PTPurity / 100, 3)
//   'PTValue',        // PT Value         = ROUND(PTPurityWt × PT999Rate, 3)
//   'PTMcAmount',     // Platinum Mc Amount = ROUND(PNetWt × PTMcRate, 3)

//   // FORMULA columns — Derived Rates
//   'DiamondRate',    // Diamond Rate     = IF(DCarat > 0, DiamondValue / DCarat, 0)
//   'ClrStnRate',     // ColorStone Rate  = IF(CLSCarat > 0, CSAmount / CLSCarat, 0)

//   // FORMULA columns — Diamond Certificate
//   'CertTaxableAmt', // Taxable Amount   = ROUND(CertQty × CertRate, 3)
//   'certTaxAmt',     // Tax Amount       = ROUND(CertTaxableAmt × CertGST / 100, 3)
//   'CertTotal',      // Total            = ROUND(CertTaxableAmt + certTaxAmt, 3)

//   // FORMULA columns — Gold HallMark
//   'HMTaxableAmt',   // Taxable Amount   = ROUND(HMQty × HMRate, 3)
//   'HmTaxAmt',       // Tax Amount       = ROUND(HMTaxableAmt × HMGST / 100, 3)
//   'HMTotal',        // Total            = ROUND(HMTaxableAmt + HmTaxAmt, 3)

//   // FORMULA columns — Totals
//   'HandleAmount',   // Handle Amount    = ROUND(NetWt × HandleRate, 3)
//   'TotalValue',     // Total Value      = ROUND(sum of all components, 3)
//   'GrandTotal',     // Grand Total      = ROUND(TotalValue + TotalValue × GST / 100, 3)
// ]);


// // ─── COLUMN HEADER MAPPING (Excel display → backend field) ───────────────────
// export const COLUMN_HEADER_MAP = {
//   'Entry Id':                             'id',
//   'Product Name':                         'ProductName',
//   'Metal Type':                           'MetalType',
//   'Weight Mode':                          'WtMode',
//   'Design No':                            'DesignNo',
//   'G Karat':                              'GCarat',
//   'Pcs':                                  'PCS',
//   'Gold Wt':                              'GoldWt',
//   'Gold Net Wt':                          'GNetWt',
//   'Gold Purity':                          'GoldPurity',
//   'Gold Purity Wt':                       'GoldPurityWt',
//   'Gold999Rate (without GST)':            'Gold999Rate',
//   'Gold Value':                           'GoldValue',
//   'PT Wt':                                'PTWt',
//   'Platinum NetWt':                       'PNetWt',
//   'PT Purity':                            'PTPurity',
//   'PT Purity Wt':                         'PTPurityWt',
//   'PT999Rate (without GST)':              'PT999Rate',
//   'PT Value':                             'PTValue',
//   'No of Stones':                         'NoofStone',
//   'Diamond Carat':                        'DCarat',
//   'Diamond Rate':                         'DiamondRate',
//   'Diamond Value':                        'DiamondValue',
//   'Diamond Wt':                           'DiamondWt',
//   'ColorStone PCS':                       'ClrStnPCS',
//   'ColorStone Carat':                     'CLSCarat',
//   'ColorStone Wt':                        'ClrStnWt',
//   'ColorStone Rate':                      'ClrStnRate',
//   'ColorStone Amount':                    'CSAmount',
//   'Gold Mc Type':                         'GoMcType',
//   'Gold Mc Rate':                         'GoMcRate',
//   'Gold Mc Amount':                       'GoMcAmount',
//   'Platinum Mc Type':                     'PTMcType',
//   'Platinum Mc Rate':                     'PTMcRate',
//   'Platinum Mc Amount':                   'PTMcAmount',
//   'Gold Wastage Type':                    'WastageType',
//   'Gold Wastage Weight':                  'WastageWeight',
//   'Gold Wastage Amount':                  'WastageAmt',
//   'Platinum Wastage Type':                'PTWastageType',
//   'Platinum Wastage Weight':              'PTWastageWeight',
//   'Platinum Wastage Amount':              'PTWastageAmt',
//   'Diamond Certificate Type':             'CertType',
//   'Diamond Certificate GST':              'CertGST',
//   'Diamond Certificate Qty':              'CertQty',
//   'Diamond Certificate Rate':             'CertRate',
//   'Diamond Certificate Taxable Amount':   'CertTaxableAmt',
//   'Diamond Certificate Tax Amount':       'certTaxAmt',
//   'Diamond Certificate Total':            'CertTotal',
//   'Gold HallMark Type':                   'HallMarkType',
//   'Gold HallMark GST':                    'HMGST',
//   'GoldHallMark Qty':                     'HMQty',
//   'Gold HallMark Rate':                   'HMRate',
//   'Gold HallMark Taxable Amount':         'HMTaxableAmt',
//   'Gold HallMark Tax Amount':             'HmTaxAmt',
//   'Gold HallMark Total':                  'HMTotal',
//   'HandleRate':                           'HandleRate',
//   'HandleAmount':                         'HandleAmount',
//   'Total Value':                          'TotalValue',
//   'GST':                                  'GST',
//   'Grand Total':                          'GrandTotal',
//   'HUID No':                              'HUID',
//   'IGI Summary No':                       'IgiSummaryNo',
//   'PGI UIN No':                           'PgiUinNo',
// };


// // ─── BACKEND → DISPLAY (reverse map) ─────────────────────────────────────────
// export const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce(
//   (acc, [display, backend]) => { acc[backend] = display; return acc; },
//   {}
// );
// BACKEND_TO_DISPLAY_MAP['SupplierName']  = 'Supplier Name';
// BACKEND_TO_DISPLAY_MAP['suppCode']      = 'Supplier Code';
// BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
// BACKEND_TO_DISPLAY_MAP['invoiceDate']   = 'Invoice Date';
// BACKEND_TO_DISPLAY_MAP['po_number']     = 'PO Number';


// // ─── FIELD DATA TYPES ─────────────────────────────────────────────────────────
// export const FIELD_DATA_TYPES = {
//   'SupplierName': 'string', 'ProductName': 'string', 'MetalType': 'string',
//   'WtMode': 'string', 'DesignNo': 'string', 'GoMcType': 'string',
//   'WastageType': 'string', 'CertType': 'string', 'HallMarkType': 'string',
//   'HUID': 'string', 'suppCode': 'string', 'PTMcType': 'string',
//   'PTWastageType': 'string', 'IgiSummaryNo': 'string', 'PgiUinNo': 'string',
//   'invoiceNumber': 'string', 'invoiceDate': 'string', 'po_number': 'string',
//   'id': 'int', 'PCS': 'int', 'HMQty': 'int', 'NoofStone': 'int', 'ClrStnPCS': 'int',
//   'GCarat': 'decimal', 'GoldWt': 'decimal', 'GoldPurity': 'decimal',
//   'GoldPurityWt': 'decimal', 'Gold999Rate': 'decimal', 'GoldValue': 'decimal',
//   'PTWt': 'decimal', 'PTPurity': 'decimal', 'PTPurityWt': 'decimal',
//   'PT999Rate': 'decimal', 'PTValue': 'decimal', 'GoMcRate': 'decimal',
//   'GoMcAmount': 'decimal', 'WastageWeight': 'decimal', 'WastageAmt': 'decimal',
//   'CertGST': 'decimal', 'CertQty': 'decimal', 'CertRate': 'decimal',
//   'CertTaxableAmt': 'decimal', 'CertTotal': 'decimal', 'HMGST': 'decimal',
//   'HMRate': 'decimal', 'HMTaxableAmt': 'decimal', 'HMTotal': 'decimal',
//   'HandleRate': 'decimal', 'HandleAmount': 'decimal', 'GNetWt': 'decimal',
//   'PNetWt': 'decimal', 'TotalValue': 'decimal', 'GST': 'decimal',
//   'GrandTotal': 'decimal', 'PTMcRate': 'decimal', 'PTMcAmount': 'decimal',
//   'PTWastageWeight': 'decimal', 'PTWastageAmt': 'decimal', 'certTaxAmt': 'decimal',
//   'HmTaxAmt': 'decimal', 'DCarat': 'decimal', 'DiamondRate': 'decimal',
//   'DiamondValue': 'decimal', 'DiamondWt': 'decimal', 'CLSCarat': 'decimal',
//   'ClrStnWt': 'decimal', 'ClrStnRate': 'decimal', 'CSAmount': 'decimal',
// };


// // ─── COLUMN SETS ──────────────────────────────────────────────────────────────
// export const PT_COLUMNS = [
//   'Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'Pcs',
//   'PT Wt', 'Platinum NetWt', 'PT Purity', 'PT Purity Wt',
//   'PT999Rate (without GST)', 'PT Value',
//   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
//   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
//   'Platinum Mc Type', 'Platinum Mc Rate', 'Platinum Mc Amount',
//   'Platinum Wastage Type', 'Platinum Wastage Weight', 'Platinum Wastage Amount',
//   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
//   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
//   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
//   'IGI Summary No', 'PGI UIN No',
// ];


// export const GOLD_COLUMNS = [
//   'Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'G Karat', 'Pcs',
//   'Gold Wt', 'Gold Net Wt', 'Gold Purity', 'Gold Purity Wt',
//   'Gold999Rate (without GST)', 'Gold Value',
//   'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
//   'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
//   'Gold Mc Type', 'Gold Mc Rate', 'Gold Mc Amount',
//   'Gold Wastage Type', 'Gold Wastage Weight', 'Gold Wastage Amount',
//   'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
//   'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
//   'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
//   'Gold HallMark Type', 'Gold HallMark GST', 'GoldHallMark Qty',
//   'Gold HallMark Rate', 'Gold HallMark Taxable Amount', 'Gold HallMark Tax Amount', 'Gold HallMark Total',
//   'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
//   'HUID No', 'IGI Summary No', 'PGI UIN No',
// ];


// export const PURCHASE_COLUMNS_BACKEND = [
//   'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate',
//   'ProductName', 'MetalType', 'WtMode', 'DesignNo',
//   'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'GoldPurityWt', 'Gold999Rate', 'GoldValue',
//   'PTWt', 'PTPurity', 'PTPurityWt', 'PT999Rate', 'PTValue',
//   'NoofStone', 'DCarat', 'DiamondRate', 'DiamondValue', 'DiamondWt',
//   'ClrStnPCS', 'CLSCarat', 'ClrStnWt', 'ClrStnRate', 'CSAmount',
//   'GoMcType', 'GoMcRate', 'GoMcAmount',
//   'PTMcType', 'PTMcRate', 'PTMcAmount',
//   'WastageType', 'WastageWeight', 'WastageAmt',
//   'PTWastageType', 'PTWastageWeight', 'PTWastageAmt',
//   'CertType', 'CertGST', 'CertQty', 'CertRate', 'CertTaxableAmt', 'certTaxAmt', 'CertTotal',
//   'HallMarkType', 'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HmTaxAmt', 'HMTotal',
//   'HandleRate', 'HandleAmount',
//   'GNetWt', 'PNetWt', 'TotalValue', 'GST', 'GrandTotal', 'HUID', 'IgiSummaryNo', 'PgiUinNo',
// ];


// // ─── DROPDOWN OPTIONS (Excel display-name keys — for buildSheet) ──────────────
// export const DROPDOWN_OPTIONS = {
//   'Metal Type':               ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
//   'Weight Mode':              ['Gross Weight', 'Net Weight'],
//   'G Karat':                  ['18K', '20K', '22K', '24K', '14K'],
//   'Gold Mc Type':             ['Percentage', 'Per Gram', 'Fixed'],
//   'Platinum Mc Type':         ['Percentage', 'Per Gram', 'Fixed'],
//   'Gold Wastage Type':        ['Percentage', 'Fixed Weight'],
//   'Platinum Wastage Type':    ['Percentage', 'Fixed Weight'],
//   'Diamond Certificate Type': ['IGI', 'GIA', 'HRD', 'None'],
//   'Gold HallMark Type':       ['HUID', 'BIS', 'None'],
//   'GST':                      ['1.5', '3', '5', '12', '18'],
//   'Diamond Certificate GST':  ['5', '12', '18'],
//   'Gold HallMark GST':        ['5', '12', '18'],
// };


// // ─── DROPDOWN OPTIONS (backend field-name keys — for React table selects) ────
// export const DROPDOWN_OPTIONS_BACKEND = {
//   'MetalType':     ['Gold', 'Platinum', 'Gold & Platinum', 'Silver'],
//   'WtMode':        ['Gross Weight', 'Net Weight'],
//   'GCarat':        ['18K', '20K', '22K', '24K', '14K'],
//   'GoMcType':      ['Percentage', 'Per Gram', 'Fixed'],
//   'PTMcType':      ['Percentage', 'Per Gram', 'Fixed'],
//   'WastageType':   ['Percentage', 'Fixed Weight'],
//   'PTWastageType': ['Percentage', 'Fixed Weight'],
//   'CertType':      ['IGI', 'GIA', 'HRD', 'None'],
//   'HallMarkType':  ['HUID', 'BIS', 'None'],
//   'GST':           ['1.5', '3', '5', '12', '18'],
//   'CertGST':       ['5', '12', '18'],
//   'HMGST':         ['5', '12', '18'],
// };


// // ─── DIAMOND DETAIL SHEET FORMULAS ───────────────────────────────────────────
// // Column layout: A=Entry Id, B=Stone From, C=Diamond Shape,
// //                D=No Of Stones, E=Carat, F=Rate, G=Value, H=Weight
// export const DIAMOND_DETAIL_FORMULAS = {
//   // Value = ROUND(Carat × Rate, 3)
//   'Value': (cols, r) =>
//     cols['Carat'] && cols['Rate']
//       ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',

//   // Weight = ROUND(Carat ÷ 5, 3)  (1 diamond carat = 0.2g)
//   'Weight': (cols, r) =>
//     cols['Carat']
//       ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
// };


// // ─── COLOR STONE DETAIL SHEET FORMULAS ───────────────────────────────────────
// // Column layout: A=Entry Id, B=Color Stone Shape,
// //                C=No Of Stones, D=Carat, E=Rate, F=Value, G=Weight
// export const COLORSTONE_DETAIL_FORMULAS = {
//   // Value = ROUND(Carat × Rate, 3)
//   'Value': (cols, r) =>
//     cols['Carat'] && cols['Rate']
//       ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',

//   // Weight = ROUND(Carat ÷ 5, 3)
//   'Weight': (cols, r) =>
//     cols['Carat']
//       ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
// };


// // ─── FORMULA DEFINITIONS (Purchase Entry sheet) ───────────────────────────────
// //
// // LOOKUP columns (orange header) — auto-sum from detail sheets via SUMIF.
// //   Purchase Entry col A = Entry Id (used as SUMIF lookup key)
// //   Diamond Details:      A=EntryId  D=NoOfStones  E=Carat  G=Value  H=Weight
// //   Color Stone Details:  A=EntryId  C=NoOfStones  D=Carat  F=Value  G=Weight
// //
// // FORMULA columns (green header) — calculated within this sheet.
// //
// export const FORMULA_DEFINITIONS = {

//   // ── Gold ──────────────────────────────────────────────────────────────────
//   // Gold Purity Wt = ROUND(Gold Net Wt × Gold Purity / 100, 3)
//   'Gold Purity Wt': (cols, r) =>
//     cols['Gold Net Wt'] && cols['Gold Purity']
//       ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Purity']}${r}/100,3)` : '',

//   // Gold Value = ROUND(Gold Purity Wt × Gold999Rate, 3)
//   'Gold Value': (cols, r) =>
//     cols['Gold Purity Wt'] && cols['Gold999Rate (without GST)']
//       ? `=ROUND(${cols['Gold Purity Wt']}${r}*${cols['Gold999Rate (without GST)']}${r},2)` : '',

//   // ── Platinum ──────────────────────────────────────────────────────────────
//   // PT Purity Wt = ROUND(PT Net Wt × PT Purity / 100, 3)
//   'PT Purity Wt': (cols, r) =>
//     cols['PT Net Wt'] && cols['PT Purity']
//       ? `=ROUND(${cols['PT Net Wt']}${r}*${cols['PT Purity']}${r}/100,3)` : '',

//   // PT Value = ROUND(PT Purity Wt × PT999Rate, 3)
//   'PT Value': (cols, r) =>
//     cols['PT Purity Wt'] && cols['PT999Rate (without GST)']
//       ? `=ROUND(${cols['PT Purity Wt']}${r}*${cols['PT999Rate (without GST)']}${r},2)` : '',

//   // ── Making Charges ────────────────────────────────────────────────────────
//   // Gold Mc Amount = ROUND(Gold Net Wt × Gold Mc Rate, 3)
//   'Gold Mc Amount': (cols, r) =>
//     cols['Gold Net Wt'] && cols['Gold Mc Rate']
//       ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Mc Rate']}${r},2)` : '',

//   // Platinum Mc Amount = ROUND(Platinum NetWt × Platinum Mc Rate, 3)
//   'Platinum Mc Amount': (cols, r) =>
//     cols['Platinum NetWt'] && cols['Platinum Mc Rate']
//       ? `=ROUND(${cols['Platinum NetWt']}${r}*${cols['Platinum Mc Rate']}${r},2)` : '',

//   // ── Diamond SUMIF lookups (from Diamond Details sheet) ────────────────────
//   'No of Stones': (cols, r) =>
//     `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$D:$D),0)`,

//   'Diamond Carat': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$E:$E),3),0)`,

//   'Diamond Value': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$G:$G),2),0)`,

//   'Diamond Rate': (cols, r) =>
//     cols['Diamond Carat']
//       ? `=IF(${cols['Diamond Carat']}${r}>0,ROUND(${cols['Diamond Value']}${r}/${cols['Diamond Carat']}${r},2),0)` : '',

//   'Diamond Wt': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$H:$H),2),0)`,

//   // ── Color Stone SUMIF lookups (from Color Stone Details sheet) ────────────
//   'ColorStone PCS': (cols, r) =>
//     `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$C:$C),0)`,

//   'ColorStone Carat': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$D:$D),3),0)`,

//   'ColorStone Amount': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$F:$F),2),0)`,

//   'ColorStone Rate': (cols, r) =>
//     cols['ColorStone Carat']
//       ? `=IF(${cols['ColorStone Carat']}${r}>0,ROUND(${cols['ColorStone Amount']}${r}/${cols['ColorStone Carat']}${r},2),0)` : '',

//   'ColorStone Wt': (cols, r) =>
//     `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$G:$G),3),0)`,

//   // ── Diamond Certificate ───────────────────────────────────────────────────
//   // Taxable Amount = ROUND(Qty × Rate, 3)
//   'Diamond Certificate Taxable Amount': (cols, r) =>
//     cols['Diamond Certificate Qty'] && cols['Diamond Certificate Rate']
//       ? `=ROUND(${cols['Diamond Certificate Qty']}${r}*${cols['Diamond Certificate Rate']}${r},2)` : '',

//   // Tax Amount = ROUND(Taxable Amount × GST / 100, 3)
//   'Diamond Certificate Tax Amount': (cols, r) =>
//     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate GST']
//       ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}*${cols['Diamond Certificate GST']}${r}/100,2)` : '',

//   // Total = ROUND(Taxable Amount + Tax Amount, 3)
//   'Diamond Certificate Total': (cols, r) =>
//     cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate Tax Amount']
//       ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}+${cols['Diamond Certificate Tax Amount']}${r},2)` : '',

//   // ── Gold HallMark ─────────────────────────────────────────────────────────
//   // Taxable Amount = ROUND(Qty × Rate, 3)
//   'Gold HallMark Taxable Amount': (cols, r) =>
//     cols['GoldHallMark Qty'] && cols['Gold HallMark Rate']
//       ? `=ROUND(${cols['GoldHallMark Qty']}${r}*${cols['Gold HallMark Rate']}${r},2)` : '',

//   // Tax Amount = ROUND(Taxable Amount × GST / 100, 3)
//   'Gold HallMark Tax Amount': (cols, r) =>
//     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark GST']
//       ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}*${cols['Gold HallMark GST']}${r}/100,2)` : '',

//   // Total = ROUND(Taxable Amount + Tax Amount, 3)
//   'Gold HallMark Total': (cols, r) =>
//     cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark Tax Amount']
//       ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}+${cols['Gold HallMark Tax Amount']}${r},2)` : '',

//   // ── Handle Amount ─────────────────────────────────────────────────────────
//   // Gold sheet → 'Gold Net Wt';  PT sheet → 'PT Net Wt'
//   'HandleAmount': (cols, r) => {
//     const wtCol = cols['Gold Net Wt'] || cols['PT Net Wt'];
//     return wtCol && cols['HandleRate']
//       ? `=ROUND(${wtCol}${r}*${cols['HandleRate']}${r},2)` : '';
//   },

//   // ── Total Value ───────────────────────────────────────────────────────────
//   'Total Value': (cols, r) => {
//     const parts = [
//       cols['Gold Value'],
//       cols['PT Value'],
//       cols['Diamond Value'],
//       cols['ColorStone Amount'],
//       cols['Gold Mc Amount'],
//       cols['Platinum Mc Amount'],
//       cols['Gold Wastage Amount'],
//       cols['Platinum Wastage Amount'],
//       cols['Diamond Certificate Total'],
//       cols['Gold HallMark Total'],
//       cols['HandleAmount'],
//     ].filter(Boolean).map(c => `${c}${r}`);
//     return parts.length ? `=ROUND(${parts.join('+')},2)` : '';
//   },

//   // ── Grand Total ───────────────────────────────────────────────────────────
//   'Grand Total': (cols, r) =>
//     cols['Total Value'] && cols['GST']
//       ? `=ROUND(${cols['Total Value']}${r}+(${cols['Total Value']}${r}*${cols['GST']}${r}/100),2)` : '',
// };


// // ─── LOOKUP COLUMNS SET (for orange header color + locked style in buildSheet) ─
// // These are auto-populated via SUMIF from detail sheets — user must NOT edit them
// export const LOOKUP_COLUMNS = new Set([
//   'No of Stones',
//   'Diamond Carat',
//   'Diamond Value',
//   'Diamond Wt',
//   'ColorStone PCS',
//   'ColorStone Carat',
//   'ColorStone Amount',
//   'ColorStone Wt',
// ]);
// ─── diamondConstants.js ──────────────────────────────────────────────────────

export const NON_EDITABLE_COLS = new Set([
  'id', 'SupplierName', 'suppCode', 'invoiceNumber', 'invoiceDate', 'po_number',
  'NoofStone', 'DCarat', 'DiamondValue', 'DiamondWt',
  'ClrStnPCS', 'CLSCarat', 'CSAmount', 'ClrStnWt',
  'GoldPurityWt', 'GoldValue', 'GoMcAmount',
  'PTPurityWt', 'PTValue', 'PTMcAmount',
  'DiamondRate', 'ClrStnRate',
  'CertTaxableAmt', 'certTaxAmt', 'CertTotal',
  'HMTaxableAmt', 'HmTaxAmt', 'HMTotal',
  'HandleAmount', 'TotalValue', 'GrandTotal',
]);

export const COLUMN_HEADER_MAP = {
  'Entry Id':                             'id',
  'Product Name':                         'ProductName',
  'Metal Type':                           'MetalType',
  'Weight Mode':                          'WtMode',
  'Design No':                            'DesignNo',
  'G Karat':                              'GCarat',
  'Pcs':                                  'PCS',
  'Gold Wt':                              'GoldWt',
  'Gold Net Wt':                          'GNetWt',
  'Gold Purity':                          'GoldPurity',
  'Gold Purity Wt':                       'GoldPurityWt',
  'Gold999Rate (without GST)':            'Gold999Rate',
  'Gold Value':                           'GoldValue',
  'PT Wt':                                'PTWt',
  'Platinum NetWt':                       'PNetWt',
  'PT Purity':                            'PTPurity',
  'PT Purity Wt':                         'PTPurityWt',
  'PT999Rate (without GST)':              'PT999Rate',
  'PT Value':                             'PTValue',
  'No of Stones':                         'NoofStone',
  'Diamond Carat':                        'DCarat',
  'Diamond Rate':                         'DiamondRate',
  'Diamond Value':                        'DiamondValue',
  'Diamond Wt':                           'DiamondWt',
  'ColorStone PCS':                       'ClrStnPCS',
  'ColorStone Carat':                     'CLSCarat',
  'ColorStone Wt':                        'ClrStnWt',
  'ColorStone Rate':                      'ClrStnRate',
  'ColorStone Amount':                    'CSAmount',
  'Gold Mc Type':                         'GoMcType',
  'Gold Mc Rate':                         'GoMcRate',
  'Gold Mc Amount':                       'GoMcAmount',
  'Platinum Mc Type':                     'PTMcType',
  'Platinum Mc Rate':                     'PTMcRate',
  'Platinum Mc Amount':                   'PTMcAmount',
  'Gold Wastage Type':                    'WastageType',
  'Gold Wastage Weight':                  'WastageWeight',
  'Gold Wastage Amount':                  'WastageAmt',
  'Platinum Wastage Type':                'PTWastageType',
  'Platinum Wastage Weight':              'PTWastageWeight',
  'Platinum Wastage Amount':              'PTWastageAmt',
  'Diamond Certificate Type':             'CertType',
  'Diamond Certificate GST':              'CertGST',
  'Diamond Certificate Qty':              'CertQty',
  'Diamond Certificate Rate':             'CertRate',
  'Diamond Certificate Taxable Amount':   'CertTaxableAmt',
  'Diamond Certificate Tax Amount':       'certTaxAmt',
  'Diamond Certificate Total':            'CertTotal',
  'Gold HallMark Type':                   'HallMarkType',
  'Gold HallMark GST':                    'HMGST',
  'GoldHallMark Qty':                     'HMQty',
  'Gold HallMark Rate':                   'HMRate',
  'Gold HallMark Taxable Amount':         'HMTaxableAmt',
  'Gold HallMark Tax Amount':             'HmTaxAmt',
  'Gold HallMark Total':                  'HMTotal',
  'HandleRate':                           'HandleRate',
  'HandleAmount':                         'HandleAmount',
  'Total Value':                          'TotalValue',
  'GST':                                  'GST',
  'Grand Total':                          'GrandTotal',
  'HUID No':                              'HUID',
  'IGI Summary No':                       'IgiSummaryNo',
  'PGI UIN No':                           'PgiUinNo',
};

export const BACKEND_TO_DISPLAY_MAP = Object.entries(COLUMN_HEADER_MAP).reduce(
  (acc, [display, backend]) => { acc[backend] = display; return acc; },
  {}
);
BACKEND_TO_DISPLAY_MAP['SupplierName']  = 'Supplier Name';
BACKEND_TO_DISPLAY_MAP['suppCode']      = 'Supplier Code';
BACKEND_TO_DISPLAY_MAP['invoiceNumber'] = 'Invoice Number';
BACKEND_TO_DISPLAY_MAP['invoiceDate']   = 'Invoice Date';
BACKEND_TO_DISPLAY_MAP['po_number']     = 'PO Number';

export const FIELD_DATA_TYPES = {
  'SupplierName': 'string', 'ProductName': 'string', 'MetalType': 'string',
  'WtMode': 'string', 'DesignNo': 'string', 'GoMcType': 'string',
  'WastageType': 'string', 'CertType': 'string', 'HallMarkType': 'string',
  'HUID': 'string', 'suppCode': 'string', 'PTMcType': 'string',
  'PTWastageType': 'string', 'IgiSummaryNo': 'string', 'PgiUinNo': 'string',
  'invoiceNumber': 'string', 'invoiceDate': 'string', 'po_number': 'string',
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

export const PT_COLUMNS = [
  'Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'Pcs',
  'PT Wt', 'Platinum NetWt', 'PT Purity', 'PT Purity Wt',
  'PT999Rate (without GST)', 'PT Value',
  'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
  'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
  'Platinum Mc Type', 'Platinum Mc Rate', 'Platinum Mc Amount',
  'Platinum Wastage Type', 'Platinum Wastage Weight', 'Platinum Wastage Amount',
  'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
  'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
  'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
  'IGI Summary No', 'PGI UIN No',
];

export const GOLD_COLUMNS = [
  'Entry Id', 'Product Name', 'Metal Type', 'Weight Mode', 'Design No', 'G Karat', 'Pcs',
  'Gold Wt', 'Gold Net Wt', 'Gold Purity', 'Gold Purity Wt',
  'Gold999Rate (without GST)', 'Gold Value',
  'No of Stones', 'Diamond Carat', 'Diamond Rate', 'Diamond Value', 'Diamond Wt',
  'ColorStone PCS', 'ColorStone Carat', 'ColorStone Wt', 'ColorStone Rate', 'ColorStone Amount',
  'Gold Mc Type', 'Gold Mc Rate', 'Gold Mc Amount',
  'Gold Wastage Type', 'Gold Wastage Weight', 'Gold Wastage Amount',
  'Diamond Certificate Type', 'Diamond Certificate GST', 'Diamond Certificate Qty',
  'Diamond Certificate Rate', 'Diamond Certificate Taxable Amount',
  'Diamond Certificate Tax Amount', 'Diamond Certificate Total',
  'Gold HallMark Type', 'Gold HallMark GST', 'GoldHallMark Qty',
  'Gold HallMark Rate', 'Gold HallMark Taxable Amount', 'Gold HallMark Tax Amount', 'Gold HallMark Total',
  'HandleRate', 'HandleAmount', 'Total Value', 'GST', 'Grand Total',
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

// ─── DROPDOWN OPTIONS (Excel display-name keys) ───────────────────────────────
// ORDER MATTERS — the index here controls which column in _DropdownLists sheet
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

export const DIAMOND_DETAIL_FORMULAS = {
  'Value': (cols, r) =>
    cols['Carat'] && cols['Rate']
      ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',
  'Weight': (cols, r) =>
    cols['Carat']
      ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
};

export const COLORSTONE_DETAIL_FORMULAS = {
  'Value': (cols, r) =>
    cols['Carat'] && cols['Rate']
      ? `=ROUND(${cols['Carat']}${r}*${cols['Rate']}${r},3)` : '',
  'Weight': (cols, r) =>
    cols['Carat']
      ? `=ROUND(${cols['Carat']}${r}/5,3)` : '',
};

export const FORMULA_DEFINITIONS = {
  'Gold Purity Wt': (cols, r) =>
    cols['Gold Net Wt'] && cols['Gold Purity']
      ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Purity']}${r}/100,3)` : '',

  'Gold Value': (cols, r) =>
    cols['Gold Purity Wt'] && cols['Gold999Rate (without GST)']
      ? `=ROUND(${cols['Gold Purity Wt']}${r}*${cols['Gold999Rate (without GST)']}${r},2)` : '',

  'PT Purity Wt': (cols, r) =>
    cols['Platinum NetWt'] && cols['PT Purity']
      ? `=ROUND(${cols['Platinum NetWt']}${r}*${cols['PT Purity']}${r}/100,3)` : '',

  'PT Value': (cols, r) =>
    cols['PT Purity Wt'] && cols['PT999Rate (without GST)']
      ? `=ROUND(${cols['PT Purity Wt']}${r}*${cols['PT999Rate (without GST)']}${r},2)` : '',

  'Gold Mc Amount': (cols, r) =>
    cols['Gold Net Wt'] && cols['Gold Mc Rate']
      ? `=ROUND(${cols['Gold Net Wt']}${r}*${cols['Gold Mc Rate']}${r},2)` : '',

  'Platinum Mc Amount': (cols, r) =>
    cols['Platinum NetWt'] && cols['Platinum Mc Rate']
      ? `=ROUND(${cols['Platinum NetWt']}${r}*${cols['Platinum Mc Rate']}${r},2)` : '',

  'No of Stones': (cols, r) =>
    `=IFERROR(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$D:$D),0)`,

  'Diamond Carat': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$E:$E),3),0)`,

  'Diamond Value': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$G:$G),2),0)`,

  'Diamond Rate': (cols, r) =>
    cols['Diamond Carat']
      ? `=IF(${cols['Diamond Carat']}${r}>0,ROUND(${cols['Diamond Value']}${r}/${cols['Diamond Carat']}${r},2),0)` : '',

  'Diamond Wt': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Diamond Details'!$A:$A,$A${r},'Diamond Details'!$H:$H),2),0)`,

  'ColorStone PCS': (cols, r) =>
    `=IFERROR(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$C:$C),0)`,

  'ColorStone Carat': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$D:$D),3),0)`,

  'ColorStone Amount': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$F:$F),2),0)`,

  'ColorStone Rate': (cols, r) =>
    cols['ColorStone Carat']
      ? `=IF(${cols['ColorStone Carat']}${r}>0,ROUND(${cols['ColorStone Amount']}${r}/${cols['ColorStone Carat']}${r},2),0)` : '',

  'ColorStone Wt': (cols, r) =>
    `=IFERROR(ROUND(SUMIF('Color Stone Details'!$A:$A,$A${r},'Color Stone Details'!$G:$G),3),0)`,

  'Diamond Certificate Taxable Amount': (cols, r) =>
    cols['Diamond Certificate Qty'] && cols['Diamond Certificate Rate']
      ? `=ROUND(${cols['Diamond Certificate Qty']}${r}*${cols['Diamond Certificate Rate']}${r},2)` : '',

  'Diamond Certificate Tax Amount': (cols, r) =>
    cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate GST']
      ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}*${cols['Diamond Certificate GST']}${r}/100,2)` : '',

  'Diamond Certificate Total': (cols, r) =>
    cols['Diamond Certificate Taxable Amount'] && cols['Diamond Certificate Tax Amount']
      ? `=ROUND(${cols['Diamond Certificate Taxable Amount']}${r}+${cols['Diamond Certificate Tax Amount']}${r},2)` : '',

  'Gold HallMark Taxable Amount': (cols, r) =>
    cols['GoldHallMark Qty'] && cols['Gold HallMark Rate']
      ? `=ROUND(${cols['GoldHallMark Qty']}${r}*${cols['Gold HallMark Rate']}${r},2)` : '',

  'Gold HallMark Tax Amount': (cols, r) =>
    cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark GST']
      ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}*${cols['Gold HallMark GST']}${r}/100,2)` : '',

  'Gold HallMark Total': (cols, r) =>
    cols['Gold HallMark Taxable Amount'] && cols['Gold HallMark Tax Amount']
      ? `=ROUND(${cols['Gold HallMark Taxable Amount']}${r}+${cols['Gold HallMark Tax Amount']}${r},2)` : '',

  'HandleAmount': (cols, r) => {
    const wtCol = cols['Gold Net Wt'] || cols['Platinum NetWt'];
    return wtCol && cols['HandleRate']
      ? `=ROUND(${wtCol}${r}*${cols['HandleRate']}${r},2)` : '';
  },

  'Total Value': (cols, r) => {
    const parts = [
      cols['Gold Value'],
      cols['PT Value'],
      cols['Diamond Value'],
      cols['ColorStone Amount'],
      cols['Gold Mc Amount'],
      cols['Platinum Mc Amount'],
      cols['Gold Wastage Amount'],
      cols['Platinum Wastage Amount'],
      cols['Diamond Certificate Total'],
      cols['Gold HallMark Total'],
      cols['HandleAmount'],
    ].filter(Boolean).map(c => `${c}${r}`);
    return parts.length ? `=ROUND(${parts.join('+')},2)` : '';
  },

  'Grand Total': (cols, r) =>
    cols['Total Value'] && cols['GST']
      ? `=ROUND(${cols['Total Value']}${r}+(${cols['Total Value']}${r}*${cols['GST']}${r}/100),2)` : '',
};

export const LOOKUP_COLUMNS = new Set([
  'No of Stones',
  'Diamond Carat',
  'Diamond Value',
  'Diamond Wt',
  'ColorStone PCS',
  'ColorStone Carat',
  'ColorStone Amount',
  'ColorStone Wt',
]);
