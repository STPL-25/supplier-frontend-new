// import * as XLSX from 'xlsx-js-style';
// import {
//   DROPDOWN_OPTIONS,
//   FORMULA_DEFINITIONS,
//   DIAMOND_DETAIL_FORMULAS,
//   COLORSTONE_DETAIL_FORMULAS,
//   LOOKUP_COLUMNS,
// } from '../constants/diamondConstants';


// // ─── Column letter helper ─────────────────────────────────────────────────────
// export const colLetter = (idx) => {
//   let letter = '', n = idx + 1;
//   while (n > 0) {
//     const rem = (n - 1) % 26;
//     letter = String.fromCharCode(65 + rem) + letter;
//     n = Math.floor((n - 1) / 26);
//   }
//   return letter;
// };


// // ─── Protection config ────────────────────────────────────────────────────────
// // No 'password' field — omitting it entirely = no-password protection
// export const makeProtect = () => ({
//   sheet:               true,
//   formatCells:         false,
//   formatColumns:       false,
//   formatRows:          false,
//   insertColumns:       false,
//   insertRows:          true,
//   insertHyperlinks:    false,
//   deleteColumns:       false,
//   deleteRows:          false,
//   selectLockedCells:   true,
//   selectUnlockedCells: true,
//   sort:                true,
//   autoFilter:          false,
//   pivotTables:         false,
//   objects:             false,
//   scenarios:           false,
// });


// // ─── Cell style factories ─────────────────────────────────────────────────────
// // RULE: hidden: false must ALWAYS appear alongside locked — without it,
// // xlsx-js-style silently drops the <protection> XML node and Excel ignores it.

// export const makeLockedHeaderStyle = (fillRgb) => ({
//   protection: { locked: true, hidden: false },
//   font:       { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
//   fill:       { fgColor: { rgb: fillRgb } },
//   alignment:  { horizontal: 'center', vertical: 'center', wrapText: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'FFFFFF' } },
//     bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
//     left:   { style: 'thin', color: { rgb: 'FFFFFF' } },
//     right:  { style: 'thin', color: { rgb: 'FFFFFF' } },
//   },
// });

// // Plain editable cell
// export const makeUnlockedDataStyle = () => ({
//   protection: { locked: false, hidden: false },
//   fill:       { fgColor: { rgb: 'FFFFFF' } },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
//     bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
//     left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
//     right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
//   },
// });

// // Calculated formula cell — unlocked so user can override if needed (green tint)
// export const makeCalcDataStyle = () => ({
//   protection: { locked: false, hidden: false },
//   fill:       { fgColor: { rgb: 'F1F8E9' } },
//   font:       { color: { rgb: '1B5E20' }, italic: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
//     bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
//     left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
//     right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
//   },
// });

// // SUMIF lookup cell — LOCKED so user cannot accidentally overwrite (orange tint)
// export const makeLookupDataStyle = () => ({
//   protection: { locked: true, hidden: false },
//   fill:       { fgColor: { rgb: 'FFF3E0' } },
//   font:       { color: { rgb: 'E65100' }, italic: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'FFCC80' } },
//     bottom: { style: 'thin', color: { rgb: 'FFCC80' } },
//     left:   { style: 'thin', color: { rgb: 'FFCC80' } },
//     right:  { style: 'thin', color: { rgb: 'FFCC80' } },
//   },
// });


// // ─── Build hidden dropdown lists sheet ────────────────────────────────────────
// const buildDropdownListsSheet = () => {
//   const ws = {};
//   const allOptions = Object.entries(DROPDOWN_OPTIONS);

//   allOptions.forEach(([fieldName, options], colIdx) => {
//     const col = colLetter(colIdx);

//     ws[`${col}1`] = {
//       v: fieldName, t: 's',
//       s: {
//         protection: { locked: true, hidden: false },
//         font: { bold: true, sz: 10 },
//         fill: { fgColor: { rgb: 'E3F2FD' } },
//       },
//     };

//     options.forEach((opt, rowIdx) => {
//       ws[`${col}${rowIdx + 2}`] = {
//         v: opt, t: 's',
//         s: {
//           protection: { locked: true, hidden: false },
//           fill: { fgColor: { rgb: 'FFFFFF' } },
//         },
//       };
//     });
//   });

//   const maxRows = Math.max(...Object.values(DROPDOWN_OPTIONS).map(arr => arr.length));
//   ws['!ref']     = `A1:${colLetter(allOptions.length - 1)}${maxRows + 1}`;
//   ws['!cols']    = allOptions.map(() => ({ wch: 20 }));
//   ws['!protect'] = makeProtect();
//   return ws;
// };


// // ─── Build Purchase Entry Sheet ───────────────────────────────────────────────
// export const buildSheet = (columns, supplierName, supplierCode, titleText, poNumber, DATA_ROWS = 200) => {
//   const ws = {};

//   // Build colMap: display name → column letter (e.g. 'Gold Wt' → 'H')
//   const colMap = {};
//   columns.forEach((h, i) => { colMap[h] = colLetter(i); });

//   // ── Row 1: Title (merged A1:F1) ───────────────────────────────────────────
//   const titleColor = titleText.includes('Gold') ? 'B8860B'
//     : titleText.includes('Platinum') ? '6A1B9A' : '1565C0';

//   ws['A1'] = {
//     v: titleText, t: 's',
//     s: {
//       protection: { locked: true, hidden: false },
//       font:       { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
//       fill:       { fgColor: { rgb: titleColor } },
//       alignment:  { horizontal: 'center', vertical: 'center' },
//     },
//   };
//   ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

//   // ── Rows 2–5: Meta labels (locked) ───────────────────────────────────────
//   [
//     ['A2', 'Supplier Name:'],
//     ['A3', 'Supplier Code:'],
//      ['A4', 'Po Number:'],
//     ['A5', 'Invoice Number:'],
//     ['A6', 'Invoice Date:'],
//     // ['C4', 'Po Number:'],
//   ].forEach(([addr, val]) => {
//     ws[addr] = {
//       v: val, t: 's',
//       s: {
//         protection: { locked: true, hidden: false },
//         font:       { bold: true, color: { rgb: '1A237E' }, sz: 10 },
//         fill:       { fgColor: { rgb: 'E8EAF6' } },
//       },
//     };
//   });

//   // B2, B3 — pre-filled supplier info (locked)
//   ws['B2'] = {
//     v: supplierName || '', t: 's',
//     s: {
//       protection: { locked: true, hidden: false },
//       font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFEBEE' } },
//     },
//   };
//   ws['B3'] = {
//     v: supplierCode || '', t: 's',
//     s: {
//       protection: { locked: true, hidden: false },
//       font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFEBEE' } },
//     },
//   };

//   // B4, B5 — invoice inputs (UNLOCKED)

//    ws['B4'] = {
//     v: poNumber || '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '880000' },italic: true, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFEBEE' } },
//     },
//   };
//   ws['B5'] = {
//     v: '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '000000' }, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFFDE7' } },
//     },
//   };
//   ws['B6'] = {
//     v: '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '000000' }, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFFDE7' } },
//     },
//   };
//   // Hints (locked)
//   ws['C2'] = {
//     v: "(Don't change Supplier Name)", t: 's',
//     s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
//   };
//   ws['C3'] = {
//     v: "(Don't change Supplier Code)", t: 's',
//     s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
//   };
//   ws['C6'] = {
//     v: '(Format: YYYY/MM/DD)', t: 's',
//     s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
//   };

//   // ── Row 6: Spacer (locked) ────────────────────────────────────────────────
//   // for (let c = 0; c < columns.length; c++) {
//   //   ws[`${colLetter(c)}7`] = {
//   //     v: '', t: 's',
//   //     s: { protection: { locked: true, hidden: false }, fill: { fgColor: { rgb: 'F5F5F5' } } },
//   //   };
//   // }

//   // ── Row 7: Column headers (locked) ───────────────────────────────────────
//   // Header color legend:
//   //   🟠 E65100 = SUMIF lookup (auto from detail sheets)
//   //   🟢 2E7D32 = formula (calculated within this sheet)
//   //   🟣 6A1B9A = dropdown
//   //   🔵 1E3A5F = plain manual input
//   columns.forEach((header, idx) => {
//     const isLookup   = LOOKUP_COLUMNS.has(header);
//     const isFormula  = !isLookup && Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
//     const isDropdown = Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header);
//     const fillRgb    = isLookup ? 'E65100' : isFormula ? '2E7D32' : isDropdown ? '6A1B9A' : '1E3A5F';

//     ws[`${colLetter(idx)}7`] = {
//       v: header, t: 's',
//       s: makeLockedHeaderStyle(fillRgb),
//     };
//   });

//   // ── Rows 8+: Data rows ────────────────────────────────────────────────────
//   for (let r = 8; r < 8 + DATA_ROWS; r++) {
//     columns.forEach((header, idx) => {
//       const addr      = `${colLetter(idx)}${r}`;
//       const isLookup  = LOOKUP_COLUMNS.has(header);
//       const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);

//       if (isLookup || isFormula) {
//         const formula = FORMULA_DEFINITIONS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           // Lookup cells → locked (orange); formula cells → unlocked (green)
//           const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
//           // v: 0 = cached value so Excel doesn't skip the formula on load
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: style };
//         } else {
//           // Formula couldn't resolve (column absent in this sheet variant)
//           const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
//           ws[addr] = { v: '', t: 's', s: style };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   // ── Dropdown validations (references hidden _DropdownLists sheet) ─────────
//   // Key MUST be '!validations' — '!dataValidations' is silently ignored
//   // All flags MUST be integers (0/1) — booleans are silently ignored
//   const DROPDOWN_SHEET = '_DropdownLists';
//   const validations    = [];

//   columns.forEach((header, idx) => {
//     if (!DROPDOWN_OPTIONS[header]) return;

//     const options        = DROPDOWN_OPTIONS[header];
//     const col            = colLetter(idx);
//     const dropdownColIdx = Object.keys(DROPDOWN_OPTIONS).indexOf(header);
//     const dropdownCol    = colLetter(dropdownColIdx);
//     const dropdownRange  = `${DROPDOWN_SHEET}!$${dropdownCol}$2:$${dropdownCol}$${options.length + 1}`;

//     validations.push({
//       sqref:            `${col}8:${col}${8 + DATA_ROWS - 1}`,
//       type:             'list',
//       formula1:         dropdownRange,
//       allowBlank:       1,
//       showDropDown:     0,   // 0 = show the dropdown arrow (counterintuitive but correct)
//       showErrorMessage: 1,
//       errorStyle:       'stop',
//       errorTitle:       'Invalid Input',
//       error:            `Please select a valid option for "${header}".`,
//       showInputMessage: 1,
//       promptTitle:      header,
//       prompt:           'Select a value from the list.',
//     });
//   });

//   if (validations.length) {
//     ws['!validations'] = validations;
//   }

//   ws['!ref']     = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
//   ws['!cols']    = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
//   ws['!rows']    = [
//     { hpt: 30 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 20 }, { hpt: 20 }, { hpt: 42 },
//   ];
// //   ws['!protect'] = makeProtect();
//   return ws;
// };


// // ─── Build Diamond Details Sheet ──────────────────────────────────────────────
// // Column layout (fixed — SUMIF in Purchase Entry hardcodes these positions):
// //   A = Entry Id     ← links to Purchase Entry Entry Id
// //   B = Stone From
// //   C = Diamond Shape
// //   D = No Of Stones
// //   E = Carat
// //   F = Rate
// //   G = Value        ← FORMULA: E × F
// //   H = Weight       ← FORMULA: E ÷ 5
// export const buildDiamondSheet = (DATA_ROWS = 200) => {
//   const headers = [
//     'Entry Id', 'Stone From', 'Diamond Shape',
//     'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
//   ];
//   const ws     = {};
//   const colMap = {};
//   headers.forEach((h, i) => { colMap[h] = colLetter(i); });

//   // Row 1: Headers
//   headers.forEach((h, i) => {
//     const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, h);
//     ws[`${colLetter(i)}1`] = {
//       v: h, t: 's',
//       s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
//     };
//   });

//   // Rows 2+: Data rows
//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((header, i) => {
//       const addr      = `${colLetter(i)}${r}`;
//       const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, header);

//       if (isFormula) {
//         const formula = DIAMOND_DETAIL_FORMULAS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
//         } else {
//           ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };


// // ─── Build Color Stone Details Sheet ──────────────────────────────────────────
// // Column layout (fixed — SUMIF in Purchase Entry hardcodes these positions):
// //   A = Entry Id          ← links to Purchase Entry Entry Id
// //   B = Color Stone Shape
// //   C = No Of Stones
// //   D = Carat
// //   E = Rate
// //   F = Value             ← FORMULA: D × E
// //   G = Weight            ← FORMULA: D ÷ 5
// export const buildColorStoneSheet = (DATA_ROWS = 200) => {
//   const headers = [
//     'Entry Id', 'Color Stone Shape',
//     'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
//   ];
//   const ws     = {};
//   const colMap = {};
//   headers.forEach((h, i) => { colMap[h] = colLetter(i); });

//   // Row 1: Headers
//   headers.forEach((h, i) => {
//     const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, h);
//     ws[`${colLetter(i)}1`] = {
//       v: h, t: 's',
//       s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
//     };
//   });

//   // Rows 2+: Data rows
//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((header, i) => {
//       const addr      = `${colLetter(i)}${r}`;
//       const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, header);

//       if (isFormula) {
//         const formula = COLORSTONE_DETAIL_FORMULAS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
//         } else {
//           ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };
// // ─── utils/dateUtils.js ───────────────────────────────────────────────────────
// /**
//  * Converts an Excel date serial number to a YYYY-MM-DD string.
//  * If the value is already a string (user typed a date), returns it as-is.
//  */
// export const parseExcelDate = (value) => {
//   if (!value && value !== 0) return '';

//   // Already a string (e.g. user typed "2026-02-19" or "19/02/2026")
//   if (typeof value === 'string') return value.trim();

//   // Excel serial number → UTC date
//   if (typeof value === 'number') {
//     const utcMs = (value - 25569) * 86400 * 1000;
//     const date  = new Date(utcMs);
//     const yyyy  = date.getUTCFullYear();
//     const mm    = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const dd    = String(date.getUTCDate()).padStart(2, '0');
//     return `${yyyy}/${mm}/${dd}`;
//   }

//   return '';
// };


// // ─── Generate & download full workbook ────────────────────────────────────────
// export const generateWorkbook = (columns, supplierName, supplierCode, titleText, filename,poNumber) => {
//   const wb = XLSX.utils.book_new();

//   // Index 0 — main entry sheet
//   XLSX.utils.book_append_sheet(
//     wb,
//     buildSheet(columns, supplierName, supplierCode, titleText,poNumber),
//     'Purchase Entry'
//   );

//   // Index 1 — diamond detail sheet (SUMIF source col D, E, G, H)
//   XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');

//   // Index 2 — color stone detail sheet (SUMIF source col C, D, F, G)
//   XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');

//   // Index 3 — hidden dropdown source sheet
//   XLSX.utils.book_append_sheet(wb, buildDropdownListsSheet(), '_DropdownLists');

//   // Hide the _DropdownLists sheet (Hidden: 1 = hidden, 2 = very hidden)
//   wb.Workbook                  = wb.Workbook               || {};
//   wb.Workbook.Sheets           = wb.Workbook.Sheets        || [];
//   wb.Workbook.Sheets[3]        = wb.Workbook.Sheets[3]     || {};
//   wb.Workbook.Sheets[3].Hidden = 1;

//   XLSX.writeFile(wb, filename);
// };
// ─── utils/excelBuilder.js ────────────────────────────────────────────────────
// ─── utils/excelBuilder.js ────────────────────────────────────────────────────
// import * as XLSX from 'xlsx-js-style';
// import {
//   DROPDOWN_OPTIONS,
//   FORMULA_DEFINITIONS,
//   DIAMOND_DETAIL_FORMULAS,
//   COLORSTONE_DETAIL_FORMULAS,
//   LOOKUP_COLUMNS,
// } from '../constants/diamondConstants';


// // ─── Column letter helper ─────────────────────────────────────────────────────
// export const colLetter = (idx) => {
//   let letter = '', n = idx + 1;
//   while (n > 0) {
//     const rem = (n - 1) % 26;
//     letter = String.fromCharCode(65 + rem) + letter;
//     n = Math.floor((n - 1) / 26);
//   }
//   return letter;
// };


// // ─── Protection config ────────────────────────────────────────────────────────
// export const makeProtect = () => ({
//   sheet:               true,
//   formatCells:         false,
//   formatColumns:       false,
//   formatRows:          false,
//   insertColumns:       false,
//   insertRows:          true,
//   insertHyperlinks:    false,
//   deleteColumns:       false,
//   deleteRows:          false,
//   selectLockedCells:   true,
//   selectUnlockedCells: true,
//   sort:                true,
//   autoFilter:          false,
//   pivotTables:         false,
//   objects:             false,
//   scenarios:           false,
// });


// // ─── Cell style factories ─────────────────────────────────────────────────────
// export const makeLockedHeaderStyle = (fillRgb) => ({
//   protection: { locked: true, hidden: false },
//   font:       { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
//   fill:       { fgColor: { rgb: fillRgb } },
//   alignment:  { horizontal: 'center', vertical: 'center', wrapText: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'FFFFFF' } },
//     bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
//     left:   { style: 'thin', color: { rgb: 'FFFFFF' } },
//     right:  { style: 'thin', color: { rgb: 'FFFFFF' } },
//   },
// });

// export const makeUnlockedDataStyle = () => ({
//   protection: { locked: false, hidden: false },
//   fill:       { fgColor: { rgb: 'FFFFFF' } },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
//     bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
//     left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
//     right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
//   },
// });

// export const makeCalcDataStyle = () => ({
//   protection: { locked: false, hidden: false },
//   fill:       { fgColor: { rgb: 'F1F8E9' } },
//   font:       { color: { rgb: '1B5E20' }, italic: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
//     bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
//     left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
//     right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
//   },
// });

// export const makeLookupDataStyle = () => ({
//   protection: { locked: true, hidden: false },
//   fill:       { fgColor: { rgb: 'FFF3E0' } },
//   font:       { color: { rgb: 'E65100' }, italic: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'FFCC80' } },
//     bottom: { style: 'thin', color: { rgb: 'FFCC80' } },
//     left:   { style: 'thin', color: { rgb: 'FFCC80' } },
//     right:  { style: 'thin', color: { rgb: 'FFCC80' } },
//   },
// });


// // ─── BUILD PURCHASE ENTRY SHEET ───────────────────────────────────────────────
// export const buildSheet = (
//   columns, supplierName, supplierCode, titleText, poNumber, DATA_ROWS = 200
// ) => {
//   const ws = {};

//   const colMap = {};
//   columns.forEach((h, i) => { colMap[h] = colLetter(i); });

//   // ── Row 1: Title ────────────────────────────────────────────────────────
//   const titleColor = titleText.includes('Gold') ? 'B8860B'
//     : titleText.includes('Platinum') ? '6A1B9A' : '1565C0';

//   ws['A1'] = {
//     v: titleText, t: 's',
//     s: {
//       protection: { locked: true, hidden: false },
//       font:       { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
//       fill:       { fgColor: { rgb: titleColor } },
//       alignment:  { horizontal: 'center', vertical: 'center' },
//     },
//   };
//   ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

//   // ── Rows 2–6: Meta labels ───────────────────────────────────────────────
//   const metaLabelStyle = {
//     protection: { locked: true, hidden: false },
//     font:       { bold: true, color: { rgb: '1A237E' }, sz: 10 },
//     fill:       { fgColor: { rgb: 'E8EAF6' } },
//   };
//   [
//     ['A2', 'Supplier Name:'],
//     ['A3', 'Supplier Code:'],
//     ['A4', 'Po Number:'],
//     ['A5', 'Invoice Number:'],
//     ['A6', 'Invoice Date:'],
//   ].forEach(([addr, val]) => {
//     ws[addr] = { v: val, t: 's', s: metaLabelStyle };
//   });

//   const lockedValueStyle = {
//     protection: { locked: true, hidden: false },
//     font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
//     fill:       { fgColor: { rgb: 'FFEBEE' } },
//   };
//   ws['B2'] = { v: supplierName || '', t: 's', s: lockedValueStyle };
//   ws['B3'] = { v: supplierCode || '', t: 's', s: lockedValueStyle };

//   ws['B4'] = {
//     v: poNumber || '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFEBEE' } },
//     },
//   };
//   ws['B5'] = {
//     v: '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '000000' }, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFFDE7' } },
//     },
//   };
//   ws['B6'] = {
//     v: '', t: 's',
//     s: {
//       protection: { locked: false, hidden: false },
//       font:       { color: { rgb: '000000' }, sz: 10 },
//       fill:       { fgColor: { rgb: 'FFFDE7' } },
//     },
//   };

//   const hintStyle = {
//     protection: { locked: true, hidden: false },
//     font:       { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 },
//   };
//   ws['C2'] = { v: "(Don't change Supplier Name)", t: 's', s: hintStyle };
//   ws['C3'] = { v: "(Don't change Supplier Code)", t: 's', s: hintStyle };
//   ws['C6'] = { v: '(Format: YYYY/MM/DD)',          t: 's', s: hintStyle };

//   // ── Row 7: Column headers ───────────────────────────────────────────────
//   columns.forEach((header, idx) => {
//     const isLookup   = LOOKUP_COLUMNS.has(header);
//     const isFormula  = !isLookup && Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
//     const isDropdown = Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header);
//     const fillRgb    = isLookup   ? 'E65100'
//                      : isFormula  ? '2E7D32'
//                      : isDropdown ? '6A1B9A'
//                      : '1E3A5F';

//     ws[`${colLetter(idx)}7`] = {
//       v: header, t: 's',
//       s: makeLockedHeaderStyle(fillRgb),
//     };
//   });

//   // ── Rows 8+: Data rows ──────────────────────────────────────────────────
//   for (let r = 8; r < 8 + DATA_ROWS; r++) {
//     columns.forEach((header, idx) => {
//       const addr      = `${colLetter(idx)}${r}`;
//       const isLookup  = LOOKUP_COLUMNS.has(header);
//       const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);

//       if (isLookup || isFormula) {
//         const formula = FORMULA_DEFINITIONS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: style };
//         } else {
//           const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
//           ws[addr] = { v: '', t: 's', s: style };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   // ── Dropdown validations ────────────────────────────────────────────────
//   // ✅ FIX: Use inline quoted comma-delimited string for formula1.
//   //         xlsx-js-style cannot serialize cross-sheet references correctly.
//   //         Inline format: `"Gold,Platinum,Silver"` — fully supported by
//   //         xlsx-js-style and works in Excel, LibreOffice, Google Sheets.
//   //         All current DROPDOWN_OPTIONS values are well under 255 char limit.
//   const validations = [];

//   columns.forEach((header, idx) => {
//     if (!Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header)) return;

//     const options = DROPDOWN_OPTIONS[header];
//     const dataCol = colLetter(idx);

//     validations.push({
//       sqref:            `${dataCol}8:${dataCol}${8 + DATA_ROWS - 1}`,
//       type:             'list',
//       formula1:         `"${options.join(',')}"`,  // ✅ inline — no cross-sheet ref needed
//       allowBlank:       1,
//       showDropDown:     0,                          // 0 = show arrow (Excel XML is inverted)
//       showErrorMessage: 1,
//       errorStyle:       'stop',
//       errorTitle:       'Invalid Input',
//       error:            `Please select a valid option for "${header}".`,
//       showInputMessage: 1,
//       promptTitle:      header,
//       prompt:           'Select a value from the list.',
//     });
//   });
//   if (validations.length) {
//     console.log('Validations:', ws['!dataValidation'] );

//     ws['!validations'] = validations;
//   }

//   ws['!ref']  = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
//   ws['!cols'] = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
//   ws['!rows'] = [
//     { hpt: 30 }, // row 1 — title
//     { hpt: 18 }, // row 2 — supplier name
//     { hpt: 18 }, // row 3 — supplier code
//     { hpt: 18 }, // row 4 — po number
//     { hpt: 20 }, // row 5 — invoice number
//     { hpt: 20 }, // row 6 — invoice date
//     { hpt: 42 }, // row 7 — column headers
//   ];

//   return ws;
// };


// // ─── BUILD DIAMOND DETAILS SHEET ─────────────────────────────────────────────
// export const buildDiamondSheet = (DATA_ROWS = 200) => {
//   const headers = [
//     'Entry Id', 'Stone From', 'Diamond Shape',
//     'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
//   ];
//   const ws     = {};
//   const colMap = {};
//   headers.forEach((h, i) => { colMap[h] = colLetter(i); });

//   headers.forEach((h, i) => {
//     const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, h);
//     ws[`${colLetter(i)}1`] = {
//       v: h, t: 's',
//       s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
//     };
//   });

//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((header, i) => {
//       const addr      = `${colLetter(i)}${r}`;
//       const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, header);

//       if (isFormula) {
//         const formula = DIAMOND_DETAIL_FORMULAS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
//         } else {
//           ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };


// // ─── BUILD COLOR STONE DETAILS SHEET ─────────────────────────────────────────
// export const buildColorStoneSheet = (DATA_ROWS = 200) => {
//   const headers = [
//     'Entry Id', 'Color Stone Shape',
//     'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
//   ];
//   const ws     = {};
//   const colMap = {};
//   headers.forEach((h, i) => { colMap[h] = colLetter(i); });

//   headers.forEach((h, i) => {
//     const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, h);
//     ws[`${colLetter(i)}1`] = {
//       v: h, t: 's',
//       s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
//     };
//   });

//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((header, i) => {
//       const addr      = `${colLetter(i)}${r}`;
//       const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, header);

//       if (isFormula) {
//         const formula = COLORSTONE_DETAIL_FORMULAS[header](colMap, r);
//         if (formula && formula.startsWith('=')) {
//           ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
//         } else {
//           ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
//         }
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };


// // ─── GENERATE & DOWNLOAD WORKBOOK ─────────────────────────────────────────────
// export const generateWorkbook = (
//   columns, supplierName, supplierCode, titleText, filename, poNumber
// ) => {
//   const wb = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(
//     wb,
//     buildSheet(columns, supplierName, supplierCode, titleText, poNumber),
//     'Purchase Entry'
//   );
//   XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');
//   XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');
//   // ✅ _DropdownLists sheet removed — no longer needed with inline formula1

//   XLSX.writeFile(wb, filename);
// };


// // ─── DATE UTILITY ─────────────────────────────────────────────────────────────
// export const parseExcelDate = (value) => {
//   if (!value && value !== 0) return '';
//   if (typeof value === 'string') return value.trim();
//   if (typeof value === 'number') {
//     const utcMs = (value - 25569) * 86400 * 1000;
//     const date  = new Date(utcMs);
//     const yyyy  = date.getUTCFullYear();
//     const mm    = String(date.getUTCMonth() + 1).padStart(2, '0');
//     const dd    = String(date.getUTCDate()).padStart(2, '0');
//     return `${yyyy}/${mm}/${dd}`;
//   }
//   return '';
// };
import * as XLSX from 'xlsx-js-style';
import {
  DROPDOWN_OPTIONS,
  FORMULA_DEFINITIONS,
  DIAMOND_DETAIL_FORMULAS,
  COLORSTONE_DETAIL_FORMULAS,
  LOOKUP_COLUMNS,
} from '../constants/diamondConstants';


// ─── Column letter helper ─────────────────────────────────────────────────────
export const colLetter = (idx) => {
  let letter = '', n = idx + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    n = Math.floor((n - 1) / 26);
  }
  return letter;
};


// ─── Protection config ────────────────────────────────────────────────────────
export const makeProtect = () => ({
  sheet:               true,
  formatCells:         false,
  formatColumns:       false,
  formatRows:          false,
  insertColumns:       false,
  insertRows:          true,
  insertHyperlinks:    false,
  deleteColumns:       false,
  deleteRows:          false,
  selectLockedCells:   true,
  selectUnlockedCells: true,
  sort:                true,
  autoFilter:          false,
  pivotTables:         false,
  objects:             false,
  scenarios:           false,
});


// ─── Cell style factories ─────────────────────────────────────────────────────
export const makeLockedHeaderStyle = (fillRgb) => ({
  protection: { locked: true, hidden: false },
  font:       { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
  fill:       { fgColor: { rgb: fillRgb } },
  alignment:  { horizontal: 'center', vertical: 'center', wrapText: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'FFFFFF' } },
    bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
    left:   { style: 'thin', color: { rgb: 'FFFFFF' } },
    right:  { style: 'thin', color: { rgb: 'FFFFFF' } },
  },
});

export const makeUnlockedDataStyle = () => ({
  protection: { locked: false, hidden: false },
  fill:       { fgColor: { rgb: 'FFFFFF' } },
  border: {
    top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
    right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
  },
});

export const makeCalcDataStyle = () => ({
  protection: { locked: false, hidden: false },
  fill:       { fgColor: { rgb: 'F1F8E9' } },
  font:       { color: { rgb: '1B5E20' }, italic: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
    bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
    left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
    right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
  },
});

export const makeLookupDataStyle = () => ({
  protection: { locked: true, hidden: false },
  fill:       { fgColor: { rgb: 'FFF3E0' } },
  font:       { color: { rgb: 'E65100' }, italic: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'FFCC80' } },
    bottom: { style: 'thin', color: { rgb: 'FFCC80' } },
    left:   { style: 'thin', color: { rgb: 'FFCC80' } },
    right:  { style: 'thin', color: { rgb: 'FFCC80' } },
  },
});


// ─── BUILD HIDDEN DROPDOWN LIST SHEET ────────────────────────────────────────
// Writes all DROPDOWN_OPTIONS values into a very-hidden sheet "_DropdownLists".
// Each dropdown key gets its own column; rows start at row 1 (no header row
// so the formula1 range is clean: $A$1:$A$N).
// Returns a map: { [header]: { col: 'A', count: 3 } } for formula1 references.
export const buildDropdownListSheet = (wb) => {
  const ws       = {};
  const colMeta  = {}; // { header -> { col, count } }
  const headers  = Object.keys(DROPDOWN_OPTIONS);
  let   maxRows  = 0;

  headers.forEach((header, colIdx) => {
    const options = DROPDOWN_OPTIONS[header];
    const ltr     = colLetter(colIdx);
    colMeta[header] = { col: ltr, count: options.length };
    if (options.length > maxRows) maxRows = options.length;

    options.forEach((opt, rowIdx) => {
      ws[`${ltr}${rowIdx + 1}`] = {
        v: opt, t: 's',
        s: {
          protection: { locked: true, hidden: false },
          fill: { fgColor: { rgb: 'FFF9C4' } },
          font: { sz: 10 },
        },
      };
    });
  });

  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${maxRows}`;
  ws['!protect'] = makeProtect();
  ws['!cols']    = headers.map(() => ({ wch: 20 }));

  XLSX.utils.book_append_sheet(wb, ws, '_DropdownLists');

  // Mark the sheet as "very hidden" (Hidden: 2) — not visible to users at all
  const sheetIdx = wb.SheetNames.indexOf('_DropdownLists');
  if (!wb.Workbook)        wb.Workbook        = {};
  if (!wb.Workbook.Sheets) wb.Workbook.Sheets = [];
  // Pad array so index lines up correctly
  while (wb.Workbook.Sheets.length <= sheetIdx) {
    wb.Workbook.Sheets.push({});
  }
  wb.Workbook.Sheets[sheetIdx] = { Hidden: 2 }; // 2 = xlSheetVeryHidden

  return colMeta; // used by buildSheet to construct formula1 references
};


// ─── BUILD PURCHASE ENTRY SHEET ───────────────────────────────────────────────
export const buildSheet = (
  columns, supplierName, supplierCode, titleText, poNumber,
  dropdownColMeta,   // ← passed from generateWorkbook after hidden sheet is built
  DATA_ROWS = 200
) => {
  const ws = {};

  const colMap = {};
  columns.forEach((h, i) => { colMap[h] = colLetter(i); });

  // ── Row 1: Title ────────────────────────────────────────────────────────
  const titleColor = titleText.includes('Gold')     ? 'B8860B'
                   : titleText.includes('Platinum') ? '6A1B9A'
                   : '1565C0';

  ws['A1'] = {
    v: titleText, t: 's',
    s: {
      protection: { locked: true, hidden: false },
      font:       { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill:       { fgColor: { rgb: titleColor } },
      alignment:  { horizontal: 'center', vertical: 'center' },
    },
  };
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

  // ── Rows 2–6: Meta labels ───────────────────────────────────────────────
  const metaLabelStyle = {
    protection: { locked: true, hidden: false },
    font:       { bold: true, color: { rgb: '1A237E' }, sz: 10 },
    fill:       { fgColor: { rgb: 'E8EAF6' } },
  };
  [
    ['A2', 'Supplier Name:'],
    ['A3', 'Supplier Code:'],
    ['A4', 'Po Number:'],
    ['A5', 'Invoice Number:'],
    ['A6', 'Invoice Date:'],
  ].forEach(([addr, val]) => {
    ws[addr] = { v: val, t: 's', s: metaLabelStyle };
  });

  const lockedValueStyle = {
    protection: { locked: true, hidden: false },
    font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
    fill:       { fgColor: { rgb: 'FFEBEE' } },
  };
  ws['B2'] = { v: supplierName || '', t: 's', s: lockedValueStyle };
  ws['B3'] = { v: supplierCode || '', t: 's', s: lockedValueStyle };

  ws['B4'] = {
    v: poNumber || '', t: 's',
    s: {
      protection: { locked: false, hidden: false },
      font:       { color: { rgb: '880000' }, italic: true, sz: 10 },
      fill:       { fgColor: { rgb: 'FFEBEE' } },
    },
  };
  ws['B5'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false, hidden: false },
      font:       { color: { rgb: '000000' }, sz: 10 },
      fill:       { fgColor: { rgb: 'FFFDE7' } },
    },
  };
  ws['B6'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false, hidden: false },
      font:       { color: { rgb: '000000' }, sz: 10 },
      fill:       { fgColor: { rgb: 'FFFDE7' } },
    },
  };

  const hintStyle = {
    protection: { locked: true, hidden: false },
    font:       { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 },
  };
  ws['C2'] = { v: "(Don't change Supplier Name)", t: 's', s: hintStyle };
  ws['C3'] = { v: "(Don't change Supplier Code)", t: 's', s: hintStyle };
  ws['C6'] = { v: '(Format: YYYY/MM/DD)',          t: 's', s: hintStyle };

  // ── Row 7: Column headers ───────────────────────────────────────────────
  columns.forEach((header, idx) => {
    const isLookup   = LOOKUP_COLUMNS.has(header);
    const isFormula  = !isLookup && Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
    const isDropdown = Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header);
    const fillRgb    = isLookup   ? 'E65100'
                     : isFormula  ? '2E7D32'
                     : isDropdown ? '6A1B9A'
                     : '1E3A5F';

    ws[`${colLetter(idx)}7`] = {
      v: header, t: 's',
      s: makeLockedHeaderStyle(fillRgb),
    };
  });

  // ── Rows 8+: Data rows ──────────────────────────────────────────────────
  for (let r = 8; r < 8 + DATA_ROWS; r++) {
    columns.forEach((header, idx) => {
      const addr      = `${colLetter(idx)}${r}`;
      const isLookup  = LOOKUP_COLUMNS.has(header);
      const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);

      if (isLookup || isFormula) {
        const formula = FORMULA_DEFINITIONS[header](colMap, r);
        if (formula && formula.startsWith('=')) {
          const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
          ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: style };
        } else {
          const style = isLookup ? makeLookupDataStyle() : makeCalcDataStyle();
          ws[addr] = { v: '', t: 's', s: style };
        }
      } else {
        ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
      }
    });
  }

  // ── Dropdown validations ────────────────────────────────────────────────
  // Uses cross-sheet reference to _DropdownLists — no 255-char limit.
  // formula1 format for xlsx-js-style: '_DropdownLists'!$A$1:$A$5
  const validations = [];

  columns.forEach((header, idx) => {
    if (!Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header)) return;

    const dataCol = colLetter(idx);
    const meta    = dropdownColMeta[header]; // { col: 'A', count: 5 }

    if (!meta) return;

    validations.push({
      sqref:            `${dataCol}8:${dataCol}${8 + DATA_ROWS - 1}`,
      type:             'list',
      // ✅ Cross-sheet reference — bypasses 255-char inline limit
      // Single-quotes around sheet name are required by Excel XML spec
      formula1:         `'_DropdownLists'!$${meta.col}$1:$${meta.col}$${meta.count}`,
      allowBlank:       1,
      showDropDown:     0,   // 0 = show dropdown arrow (Excel XML is inverted)
      showErrorMessage: 1,
      errorStyle:       'stop',
      errorTitle:       'Invalid Input',
      error:            `Please select a valid option for "${header}".`,
      showInputMessage: 1,
      promptTitle:      header,
      prompt:           'Select a value from the list.',
    });
  });

  if (validations.length) {
    ws['!validations'] = validations;
  }

  ws['!ref']  = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
  ws['!cols'] = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
  ws['!rows'] = [
    { hpt: 30 }, // row 1 — title
    { hpt: 18 }, // row 2 — supplier name
    { hpt: 18 }, // row 3 — supplier code
    { hpt: 18 }, // row 4 — po number
    { hpt: 20 }, // row 5 — invoice number
    { hpt: 20 }, // row 6 — invoice date
    { hpt: 42 }, // row 7 — column headers
  ];

  return ws;
};


// ─── BUILD DIAMOND DETAILS SHEET ─────────────────────────────────────────────
export const buildDiamondSheet = (DATA_ROWS = 200) => {
  const headers = [
    'Entry Id', 'Stone From', 'Diamond Shape',
    'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
  ];
  const ws     = {};
  const colMap = {};
  headers.forEach((h, i) => { colMap[h] = colLetter(i); });

  headers.forEach((h, i) => {
    const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, h);
    ws[`${colLetter(i)}1`] = {
      v: h, t: 's',
      s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
    };
  });

  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((header, i) => {
      const addr      = `${colLetter(i)}${r}`;
      const isFormula = Object.prototype.hasOwnProperty.call(DIAMOND_DETAIL_FORMULAS, header);

      if (isFormula) {
        const formula = DIAMOND_DETAIL_FORMULAS[header](colMap, r);
        if (formula && formula.startsWith('=')) {
          ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
        } else {
          ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
        }
      } else {
        ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
      }
    });
  }

  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};


// ─── BUILD COLOR STONE DETAILS SHEET ─────────────────────────────────────────
export const buildColorStoneSheet = (DATA_ROWS = 200) => {
  const headers = [
    'Entry Id', 'Color Stone Shape',
    'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight',
  ];
  const ws     = {};
  const colMap = {};
  headers.forEach((h, i) => { colMap[h] = colLetter(i); });

  headers.forEach((h, i) => {
    const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, h);
    ws[`${colLetter(i)}1`] = {
      v: h, t: 's',
      s: makeLockedHeaderStyle(isFormula ? '2E7D32' : '1E3A5F'),
    };
  });

  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((header, i) => {
      const addr      = `${colLetter(i)}${r}`;
      const isFormula = Object.prototype.hasOwnProperty.call(COLORSTONE_DETAIL_FORMULAS, header);

      if (isFormula) {
        const formula = COLORSTONE_DETAIL_FORMULAS[header](colMap, r);
        if (formula && formula.startsWith('=')) {
          ws[addr] = { f: formula.substring(1), t: 'n', v: 0, s: makeCalcDataStyle() };
        } else {
          ws[addr] = { v: '', t: 's', s: makeCalcDataStyle() };
        }
      } else {
        ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
      }
    });
  }

  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(h => ({ wch: h.length > 12 ? 18 : 14 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};


// ─── GENERATE & DOWNLOAD WORKBOOK ─────────────────────────────────────────────
export const generateWorkbook = (
  columns, supplierName, supplierCode, titleText, filename, poNumber
) => {
  const wb = XLSX.utils.book_new();

  // ✅ Step 1: Build the hidden dropdown sheet FIRST so we get colMeta back
  const dropdownColMeta = buildDropdownListSheet(wb);

  // ✅ Step 2: Build Purchase Entry sheet with cross-sheet formula1 references
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(columns, supplierName, supplierCode, titleText, poNumber, dropdownColMeta),
    'Purchase Entry'
  );

  // ✅ Step 3: Append the rest of the sheets
  XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');
  XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');

  XLSX.writeFile(wb, filename);
};


// ─── DATE UTILITY ─────────────────────────────────────────────────────────────
export const parseExcelDate = (value) => {
  if (!value && value !== 0) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') {
    const utcMs = (value - 25569) * 86400 * 1000;
    const date  = new Date(utcMs);
    const yyyy  = date.getUTCFullYear();
    const mm    = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd    = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }
  return '';
};
