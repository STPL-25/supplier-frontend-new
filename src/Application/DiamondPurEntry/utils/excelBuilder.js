// import * as XLSX from 'xlsx-js-style';
// import { DROPDOWN_OPTIONS, FORMULA_DEFINITIONS } from '../constants/diamondConstants';

// // ─── Column letter helper (A, B, ..., AA, AB...) ─────────────────────────────
// export const colLetter = (idx) => {
//   let letter = '', n = idx + 1;
//   while (n > 0) {
//     const rem = (n - 1) % 26;
//     letter = String.fromCharCode(65 + rem) + letter;
//     n = Math.floor((n - 1) / 26);
//   }
//   return letter;
// };

// // ─── Protection config (no algorithmName, no undefined) ──────────────────────
// export const makeProtect = () => ({
//   sheet: true,
//   // ❌ REMOVE: password: '',   ← this was hashing empty string and locking everything
//   formatCells: false,
//   formatColumns: false,
//   formatRows: false,
//   insertColumns: false,
//   insertRows: true,
//   insertHyperlinks: false,
//   deleteColumns: false,
//   deleteRows: false,
//   selectLockedCells: true,
//   selectUnlockedCells: true,
//   sort: true,
//   autoFilter: false,
//   pivotTables: false,
//   objects: false,
//   scenarios: false,
// });

// // ─── Cell style factories (no object spread — avoids xlsx-js-style bug) ───────
// export const makeLockedHeaderStyle = (fillRgb) => ({
//   protection: { locked: true },
//   font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
//   fill: { fgColor: { rgb: fillRgb } },
//   alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'FFFFFF' } },
//     bottom: { style: 'thin', color: { rgb: 'FFFFFF' } },
//     left:   { style: 'thin', color: { rgb: 'FFFFFF' } },
//     right:  { style: 'thin', color: { rgb: 'FFFFFF' } },
//   },
// });

// export const makeUnlockedDataStyle = () => ({
//   protection: { locked: false, hidden: false },  // ← add hidden: false
//   fill: { fgColor: { rgb: 'FFFFFF' } },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
//     bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
//     left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
//     right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
//   },
// });

// export const makeCalcDataStyle = () => ({
//   protection: { locked: false, hidden: false },  // ← add hidden: false
//   fill: { fgColor: { rgb: 'F1F8E9' } },
//   font: { color: { rgb: '1B5E20' }, italic: true },
//   border: {
//     top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
//     bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
//     left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
//     right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
//   },
// });

// // ─── Build Purchase Entry Sheet ───────────────────────────────────────────────
// export const buildSheet = (columns, supplierName, supplierCode, titleText, DATA_ROWS = 200) => {
//   const ws = {};
//   const colMap = {};
//   columns.forEach((h, i) => { colMap[h] = colLetter(i); });

//   // Row 1 — Title
//   const titleColor = titleText.includes('Gold') ? 'B8860B'
//     : titleText.includes('Platinum') ? '6A1B9A' : '1565C0';
//   ws['A1'] = {
//     v: titleText, t: 's',
//     s: {
//       protection: { locked: true },
//       font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
//       fill: { fgColor: { rgb: titleColor } },
//       alignment: { horizontal: 'center', vertical: 'center' },
//     },
//   };
//   ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

//   // Rows 2–5 — Labels
//   [['A2', 'Supplier Name:'], ['A3', 'Supplier Code:'], ['A4', 'Invoice Number:'], ['A5', 'Invoice Date:']].forEach(([addr, val]) => {
//     ws[addr] = {
//       v: val, t: 's',
//       s: { protection: { locked: true }, font: { bold: true, color: { rgb: '1A237E' }, sz: 10 }, fill: { fgColor: { rgb: 'E8EAF6' } } },
//     };
//   });

//   // B2, B3 — Supplier (locked, pre-filled)
//   ws['B2'] = { v: supplierName || '', t: 's', s: { protection: { locked: true }, font: { color: { rgb: '880000' }, italic: true, sz: 10 }, fill: { fgColor: { rgb: 'FFEBEE' } } } };
//   ws['B3'] = { v: supplierCode || '', t: 's', s: { protection: { locked: true }, font: { color: { rgb: '880000' }, italic: true, sz: 10 }, fill: { fgColor: { rgb: 'FFEBEE' } } } };

//   // B4, B5 — Invoice inputs (UNLOCKED)
//   ws['B4'] = { v: '', t: 's', s: { protection: { locked: false }, font: { color: { rgb: '000000' }, sz: 10 }, fill: { fgColor: { rgb: 'FFFDE7' } } } };
//   ws['B5'] = { v: '', t: 's', s: { protection: { locked: false }, font: { color: { rgb: '000000' }, sz: 10 }, fill: { fgColor: { rgb: 'FFFDE7' } } } };

//   // Hint cells
//   ws['C2'] = { v: "(Don't change Supplier Name)", t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };
//   ws['C3'] = { v: "(Don't change Supplier Code)", t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };
//   ws['C5'] = { v: '(Format: YYYY-MM-DD)',         t: 's', s: { protection: { locked: true }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } } };

//   // Row 6 — Spacer
//   for (let c = 0; c < columns.length; c++) {
//     ws[`${colLetter(c)}6`] = { v: '', t: 's', s: { protection: { locked: true }, fill: { fgColor: { rgb: 'F5F5F5' } } } };
//   }

//   // Row 7 — Column headers (locked)
//   columns.forEach((header, idx) => {
//     const isFormula  = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
//     const isDropdown = Object.prototype.hasOwnProperty.call(DROPDOWN_OPTIONS, header);
//     const fillRgb    = isFormula ? '2E7D32' : isDropdown ? '6A1B9A' : '1E3A5F';
//     ws[`${colLetter(idx)}7`] = { v: header, t: 's', s: makeLockedHeaderStyle(fillRgb) };
//   });

//   // Rows 8+ — Data rows (ALL unlocked)
//   const dataValidations = [];
//   for (let r = 8; r < 8 + DATA_ROWS; r++) {
//     columns.forEach((header, idx) => {
//       const addr = `${colLetter(idx)}${r}`;
//       const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);
//       if (isFormula) {
//         const formula = FORMULA_DEFINITIONS[header](colMap, r);
//         ws[addr] = formula && formula.startsWith('=')
//           ? { f: formula.substring(1), t: 'n', s: makeCalcDataStyle() }
//           : { v: '', t: 's', s: makeCalcDataStyle() };
//       } else {
//         ws[addr] = { v: '', t: 's', s: makeUnlockedDataStyle() };
//       }
//     });
//   }

//   // Dropdowns
//   columns.forEach((header, idx) => {
//     if (DROPDOWN_OPTIONS[header]) {
//       dataValidations.push({
//         type: 'list', allowBlank: true, showDropDown: false,
//         sqref: `${colLetter(idx)}8:${colLetter(idx)}${8 + DATA_ROWS - 1}`,
//         formula1: `"${DROPDOWN_OPTIONS[header].join(',')}"`,
//         showErrorMessage: true, errorStyle: 'stop',
//         errorTitle: 'Invalid Input', error: 'Please select from the dropdown list.',
//       });
//     }
//   });
//   if (dataValidations.length) ws['!dataValidations'] = dataValidations;

//   ws['!ref']     = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
//   ws['!cols']    = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
//   ws['!rows']    = [{ hpt: 30 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 6 }, { hpt: 42 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };

// // ─── Build Diamond Details Sheet ──────────────────────────────────────────────
// export const buildDiamondSheet = (DATA_ROWS = 200) => {
//   const headers = ['Entry Id', 'Stone From', 'Diamond Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
//   const ws = {};
//   headers.forEach((h, i) => { ws[`${colLetter(i)}1`] = { v: h, t: 's', s: makeLockedHeaderStyle('1E3A5F') }; });
//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((_, i) => { ws[`${colLetter(i)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() }; });
//   }
//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(() => ({ wch: 16 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };

// // ─── Build Color Stone Details Sheet ─────────────────────────────────────────
// export const buildColorStoneSheet = (DATA_ROWS = 200) => {
//   const headers = ['Entry Id', 'Color Stone Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
//   const ws = {};
//   headers.forEach((h, i) => { ws[`${colLetter(i)}1`] = { v: h, t: 's', s: makeLockedHeaderStyle('1E3A5F') }; });
//   for (let r = 2; r < 2 + DATA_ROWS; r++) {
//     headers.forEach((_, i) => { ws[`${colLetter(i)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() }; });
//   }
//   ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
//   ws['!cols']    = headers.map(() => ({ wch: 16 }));
//   ws['!rows']    = [{ hpt: 36 }];
//   ws['!protect'] = makeProtect();
//   return ws;
// };

// // ─── Generate & download full workbook ───────────────────────────────────────
// export const generateWorkbook = (columns, supplierName, supplierCode, titleText, filename) => {
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, buildSheet(columns, supplierName, supplierCode, titleText), 'Purchase Entry');
//   XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');
//   XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');
//   XLSX.writeFile(wb, filename);
// };
import * as XLSX from 'xlsx-js-style';
import { DROPDOWN_OPTIONS, FORMULA_DEFINITIONS } from '../constants/diamondConstants';

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
// KEY FIX: No password field at all. password:'' was hashing to a value
// that caused Excel to treat ALL cells as locked regardless of per-cell style.
export const makeProtect = () => ({
  sheet: true,
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

// ─── Cell style factories ─────────────────────────────────────────────────────
// KEY FIX: hidden: false must be present alongside locked: false
// so xlsx-js-style emits the correct <xf protection locked="0" hidden="0"/> XML

export const makeLockedHeaderStyle = (fillRgb) => ({
  protection: { locked: true, hidden: false },
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

export const makeUnlockedDataStyle = () => ({
  protection: { locked: false, hidden: false },
  fill: { fgColor: { rgb: 'FFFFFF' } },
  border: {
    top:    { style: 'thin', color: { rgb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
    left:   { style: 'thin', color: { rgb: 'CCCCCC' } },
    right:  { style: 'thin', color: { rgb: 'CCCCCC' } },
  },
});

export const makeCalcDataStyle = () => ({
  protection: { locked: false, hidden: false },
  fill: { fgColor: { rgb: 'F1F8E9' } },
  font: { color: { rgb: '1B5E20' }, italic: true },
  border: {
    top:    { style: 'thin', color: { rgb: 'A5D6A7' } },
    bottom: { style: 'thin', color: { rgb: 'A5D6A7' } },
    left:   { style: 'thin', color: { rgb: 'A5D6A7' } },
    right:  { style: 'thin', color: { rgb: 'A5D6A7' } },
  },
});

// ─── Build Purchase Entry Sheet ───────────────────────────────────────────────
export const buildSheet = (columns, supplierName, supplierCode, titleText, DATA_ROWS = 200) => {
  const ws = {};
  const colMap = {};
  columns.forEach((h, i) => { colMap[h] = colLetter(i); });

  // Row 1 — Title (locked)
  const titleColor = titleText.includes('Gold') ? 'B8860B'
    : titleText.includes('Platinum') ? '6A1B9A' : '1565C0';
  ws['A1'] = {
    v: titleText, t: 's',
    s: {
      protection: { locked: true, hidden: false },
      font: { bold: true, sz: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: titleColor } },
      alignment: { horizontal: 'center', vertical: 'center' },
    },
  };
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

  // Rows 2–5 — Labels (locked)
  [
    ['A2', 'Supplier Name:'],
    ['A3', 'Supplier Code:'],
    ['A4', 'Invoice Number:'],
    ['A5', 'Invoice Date:'],
  ].forEach(([addr, val]) => {
    ws[addr] = {
      v: val, t: 's',
      s: {
        protection: { locked: true, hidden: false },
        font: { bold: true, color: { rgb: '1A237E' }, sz: 10 },
        fill: { fgColor: { rgb: 'E8EAF6' } },
      },
    };
  });

  // B2, B3 — Supplier values (locked, pre-filled)
  ws['B2'] = {
    v: supplierName || '', t: 's',
    s: {
      protection: { locked: true, hidden: false },
      font: { color: { rgb: '880000' }, italic: true, sz: 10 },
      fill: { fgColor: { rgb: 'FFEBEE' } },
    },
  };
  ws['B3'] = {
    v: supplierCode || '', t: 's',
    s: {
      protection: { locked: true, hidden: false },
      font: { color: { rgb: '880000' }, italic: true, sz: 10 },
      fill: { fgColor: { rgb: 'FFEBEE' } },
    },
  };

  // B4, B5 — Invoice inputs (UNLOCKED — user fills these)
  ws['B4'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false, hidden: false },
      font: { color: { rgb: '000000' }, sz: 10 },
      fill: { fgColor: { rgb: 'FFFDE7' } },
    },
  };
  ws['B5'] = {
    v: '', t: 's',
    s: {
      protection: { locked: false, hidden: false },
      font: { color: { rgb: '000000' }, sz: 10 },
      fill: { fgColor: { rgb: 'FFFDE7' } },
    },
  };

  // Hint cells (locked)
  ws['C2'] = {
    v: "(Don't change Supplier Name)", t: 's',
    s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
  };
  ws['C3'] = {
    v: "(Don't change Supplier Code)", t: 's',
    s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
  };
  ws['C5'] = {
    v: '(Format: YYYY-MM-DD)', t: 's',
    s: { protection: { locked: true, hidden: false }, font: { italic: true, color: { rgb: 'AAAAAA' }, sz: 8 } },
  };

  // Row 6 — Spacer (locked)
  for (let c = 0; c < columns.length; c++) {
    ws[`${colLetter(c)}6`] = {
      v: '', t: 's',
      s: { protection: { locked: true, hidden: false }, fill: { fgColor: { rgb: 'F5F5F5' } } },
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

  // Rows 8+ — Data rows (ALL unlocked)
  const dataValidations = [];
  for (let r = 8; r < 8 + DATA_ROWS; r++) {
    columns.forEach((header, idx) => {
      const addr      = `${colLetter(idx)}${r}`;
      const isFormula = Object.prototype.hasOwnProperty.call(FORMULA_DEFINITIONS, header);

      if (isFormula) {
        const formula = FORMULA_DEFINITIONS[header](colMap, r);
        ws[addr] = formula && formula.startsWith('=')
          ? { f: formula.substring(1), t: 'n', s: makeCalcDataStyle() }
          : { v: '', t: 's', s: makeCalcDataStyle() };
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

  ws['!ref']     = `A1:${colLetter(columns.length - 1)}${7 + DATA_ROWS}`;
  ws['!cols']    = columns.map(h => ({ wch: h.length > 15 ? 22 : 15 }));
  ws['!rows']    = [{ hpt: 30 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 18 }, { hpt: 6 }, { hpt: 42 }];
  ws['!protect'] = makeProtect();
  return ws;
};

// ─── Build Diamond Details Sheet ──────────────────────────────────────────────
export const buildDiamondSheet = (DATA_ROWS = 200) => {
  const headers = ['Entry Id', 'Stone From', 'Diamond Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
  const ws = {};
  headers.forEach((h, i) => {
    ws[`${colLetter(i)}1`] = {
      v: h, t: 's',
      s: makeLockedHeaderStyle('1E3A5F'),
    };
  });
  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((_, i) => {
      ws[`${colLetter(i)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() };
    });
  }
  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(() => ({ wch: 16 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};

// ─── Build Color Stone Details Sheet ─────────────────────────────────────────
export const buildColorStoneSheet = (DATA_ROWS = 200) => {
  const headers = ['Entry Id', 'Color Stone Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'];
  const ws = {};
  headers.forEach((h, i) => {
    ws[`${colLetter(i)}1`] = {
      v: h, t: 's',
      s: makeLockedHeaderStyle('1E3A5F'),
    };
  });
  for (let r = 2; r < 2 + DATA_ROWS; r++) {
    headers.forEach((_, i) => {
      ws[`${colLetter(i)}${r}`] = { v: '', t: 's', s: makeUnlockedDataStyle() };
    });
  }
  ws['!ref']     = `A1:${colLetter(headers.length - 1)}${1 + DATA_ROWS}`;
  ws['!cols']    = headers.map(() => ({ wch: 16 }));
  ws['!rows']    = [{ hpt: 36 }];
  ws['!protect'] = makeProtect();
  return ws;
};

// ─── Generate & download full workbook ───────────────────────────────────────
export const generateWorkbook = (columns, supplierName, supplierCode, titleText, filename) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    buildSheet(columns, supplierName, supplierCode, titleText),
    'Purchase Entry'
  );
  XLSX.utils.book_append_sheet(wb, buildDiamondSheet(),    'Diamond Details');
  XLSX.utils.book_append_sheet(wb, buildColorStoneSheet(), 'Color Stone Details');
  XLSX.writeFile(wb, filename);
};
