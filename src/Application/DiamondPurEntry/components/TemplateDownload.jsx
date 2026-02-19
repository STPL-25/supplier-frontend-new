import React, { useState } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import { generateWorkbook } from '../../utils/excelBuilder';
import { COLUMN_HEADER_MAP, PT_COLUMNS, GOLD_COLUMNS } from '../../constants/diamondConstants';

/**
 * Props:
 *   supplierName  – string (pre-filled in Excel B2)
 *   supplierCode  – string (pre-filled in Excel B3)
 *   onSuccess     – (message: string) => void
 */
const TemplateDownload = ({ supplierName = '', supplierCode = '', onSuccess }) => {
  const [open, setOpen] = useState(false);

  const download = (columns, filename, title) => {
    generateWorkbook(columns, supplierName, supplierCode, title, filename);
    setOpen(false);
    onSuccess?.('Template downloaded successfully!');
  };

  const TEMPLATES = [
    {
      label: 'Standard Template',
      desc: 'Gold + Platinum',
      icon: 'text-blue-600',
      onClick: () => download(
        Object.keys(COLUMN_HEADER_MAP),
        'Diamond_Purchase_Standard_Template.xlsx',
        'DIAMOND PURCHASE ENTRY — STANDARD TEMPLATE (Gold + Platinum)'
      ),
    },
    {
      label: 'Platinum Only',
      desc: 'No Gold columns',
      icon: 'text-purple-600',
      onClick: () => download(
        PT_COLUMNS,
        'Diamond_Purchase_Platinum_Template.xlsx',
        'DIAMOND PURCHASE ENTRY — PLATINUM TEMPLATE'
      ),
    },
    {
      label: 'Gold Only Template',
      desc: 'No Platinum columns',
      icon: 'text-yellow-600',
      onClick: () => download(
        GOLD_COLUMNS,
        'Diamond_Purchase_Gold_Template.xlsx',
        'DIAMOND PURCHASE ENTRY — GOLD TEMPLATE'
      ),
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="relative">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50">
            <div className="px-4 py-2 border-b">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Choose Template Type
              </p>
            </div>
            <div className="py-1">
              {TEMPLATES.map(t => (
                <button
                  key={t.label}
                  onClick={t.onClick}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <FileSpreadsheet className={`w-5 h-5 shrink-0 ${t.icon}`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-4 py-2 border-t bg-gray-50 rounded-b-lg">
              <p className="text-xs text-gray-400">
                <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#1E3A5F' }}></span>Normal&nbsp;&nbsp;
                <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#6A1B9A' }}></span>Dropdown&nbsp;&nbsp;
                <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#2E7D32' }}></span>Auto-calc
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TemplateDownload;
