import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet, Eye, Save, RefreshCw, Loader2,
} from 'lucide-react';
import TemplateDownload from './TemplateDownload';
import TemplateUpload   from './TemplateUpload';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import { DIA_API } from '../../../config/configData';

import {   PURCHASE_COLUMNS_BACKEND,
  BACKEND_TO_DISPLAY_MAP,
  NON_EDITABLE_COLS,
  DROPDOWN_OPTIONS_BACKEND,
  FIELD_DATA_TYPES, } from '../constants/diamondConstants';


// ─── Format helper ─────────────────────────────────────────────────────────────
const formatNumber = (v, decimals = 2) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const THREE_DECIMAL_COLS = new Set(['GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight']);

// ─── Loading State ────────────────────────────────────────────────────────────
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-8">
      <div className="absolute inset-0 animate-ping opacity-20">
        <div className="w-24 h-24 bg-indigo-500 rounded-full" />
      </div>
      <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    </div>
    <div className="text-center space-y-3">
      <h3 className="text-2xl font-bold text-gray-900">Loading Purchase Entries</h3>
      <p className="text-gray-500">Processing your Excel file...</p>
      <div className="flex items-center justify-center gap-2 mt-4">
        {[0, 150, 300].map(d => (
          <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4">
    <div className="relative mb-6">
      <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg rotate-3">
        <div className="-rotate-3">
          <FileSpreadsheet className="w-14 h-14 text-gray-400" />
        </div>
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-900">No Purchase Entries Yet</h3>
    <p className="text-sm text-gray-500 mt-1">Download a template, fill it in, then upload it above.</p>
  </div>
);

// ─── Diamond Sub-table ────────────────────────────────────────────────────────
const DiamondTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {['#', 'Stone From', 'Diamond Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'].map(h => (
            <th key={h} className="p-2 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr><td colSpan={8} className="text-center p-4 text-gray-400">No diamond records.</td></tr>
        ) : records.map((d, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border text-center">{i + 1}</td>
            <td className="p-2 border"><input value={d.STONE_FROM  || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.NoOfStones  || 0}  disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.Carat  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.Rate   || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.Value  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Color Stone Sub-table ────────────────────────────────────────────────────
const ColorStoneTable = ({ records }) => (
  <div className="overflow-auto max-h-72 border rounded">
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {['#', 'Color Stone Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'].map(h => (
            <th key={h} className="p-2 border">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.length === 0 ? (
          <tr><td colSpan={7} className="text-center p-4 text-gray-400">No color stone records.</td></tr>
        ) : records.map((c, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <td className="p-2 border text-center">{i + 1}</td>
            <td className="p-2 border"><input value={c.csShape    || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={c.NoOfStones || 0}  disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={c.Carat  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={c.Rate   || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={c.Value  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Entry Detail Modal ───────────────────────────────────────────────────────
const EntryDetailModal = ({ entry, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center pt-12">
    <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
    <div className="relative z-60 w-[95%] max-w-6xl bg-white rounded-lg shadow-xl overflow-auto max-h-[88vh]">
      <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
        <h3 className="text-lg font-bold">Entry — ID: {entry.id} | {entry.DesignNo}</h3>
        <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Close</button>
      </div>
      <div className="p-4 space-y-6">
        <section>
          <h4 className="font-semibold mb-3">Purchase Entry Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Supplier Name', entry.SupplierName], ['Invoice Number', entry.invoiceNumber],
              ['Invoice Date', entry.invoiceDate],   ['Product Name', entry.ProductName],
              ['Design No', entry.DesignNo],          ['Metal Type', entry.MetalType],
              ['Grand Total', entry.GrandTotal ?? 0], ['Gold Weight', entry.GoldWt ?? 0],
              ['IGI Summary No', entry.IgiSummaryNo], ['PGI UIN No', entry.PgiUinNo],
            ].map(([label, val]) => (
              <div key={label}>
                <label className="text-xs text-gray-500">{label}</label>
                <input value={val || ''} disabled className="w-full border p-1.5 rounded bg-gray-50 text-sm" />
              </div>
            ))}
          </div>
        </section>
        <section>
          <h4 className="font-semibold mb-2">Diamonds ({(entry.diamonds || []).length})</h4>
          <DiamondTable records={entry.diamonds || []} />
        </section>
        <section>
          <h4 className="font-semibold mb-2">Color Stones ({(entry.colorStones || []).length})</h4>
          <ColorStoneTable records={entry.colorStones || []} />
        </section>
      </div>
    </div>
  </div>
);

// ─── Purchase Entry Table ─────────────────────────────────────────────────────
const PurchaseEntryTable = ({ data, onRowClick, onRowChange }) => (
  <div className="overflow-auto bg-white border rounded shadow-sm">
    <table className="min-w-full text-xs">
      <thead>
        <tr className="bg-gray-100 sticky top-0">
          {PURCHASE_COLUMNS_BACKEND.map(col => (
            <th key={col} className="border px-2 py-1.5 text-left whitespace-nowrap font-semibold">
              {BACKEND_TO_DISPLAY_MAP[col] || col}
              {NON_EDITABLE_COLS.has(col) && (
                <span className="ml-1 text-red-400 font-normal text-[10px]">(locked)</span>
              )}
            </th>
          ))}
          <th className="border px-2 py-1.5">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.id ?? Math.random()} className="hover:bg-blue-50 align-top">
            {PURCHASE_COLUMNS_BACKEND.map(col => {
              const raw = row[col];

              // Locked (read-only) cell
              if (NON_EDITABLE_COLS.has(col)) {
                const disp = typeof raw === 'number'
                  ? formatNumber(raw, THREE_DECIMAL_COLS.has(col) ? 3 : 2)
                  : (raw ?? '');
                return (
                  <td key={col} className="border px-2 py-1 max-w-[140px] truncate bg-gray-50 text-gray-500" title={String(disp)}>
                    {String(disp)}
                  </td>
                );
              }

              // Dropdown cell
              if (DROPDOWN_OPTIONS_BACKEND[col]) {
                return (
                  <td key={col} className="border px-1 py-1 min-w-[110px]">
                    <select
                      value={raw ?? ''}
                      onChange={e => onRowChange(row.id, col, e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
                    >
                      <option value="">--</option>
                      {DROPDOWN_OPTIONS_BACKEND[col].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </td>
                );
              }

              // Regular input cell
              const inputType = ['int', 'decimal'].includes(FIELD_DATA_TYPES[col]) ? 'number' : 'text';
              return (
                <td key={col} className="border px-1 py-1 min-w-[90px]">
                  <input
                    type={inputType}
                    value={raw ?? ''}
                    onChange={e => onRowChange(row.id, col, e.target.value)}
                    step={inputType === 'number' ? 'any' : undefined}
                    className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </td>
              );
            })}
            <td className="border px-2 py-1">
              <button
                onClick={() => onRowClick(row)}
                className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-1 hover:bg-indigo-700 whitespace-nowrap text-xs"
              >
                <Eye className="w-3.5 h-3.5" /> View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const DiamondManager = () => {
  const { user } = useContext(DashBoardContext);
  const [suppliers, setSuppliers]     = useState({});
  const [data, setData]               = useState([]);
  const [saving, setSaving]           = useState(false);
  const [saveStatus, setSaveStatus]   = useState(null);
  const [modalEntry, setModalEntry]   = useState(null);

  // Fetch supplier info
  useEffect(() => {
    if (!user) return;
    axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user })
      .then(res => setSuppliers(res.data))
      .catch(err => console.error('Supplier fetch error:', err));
  }, [user]);

  // Inline cell edit
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

  // Save all entries to backend
  const handleSave = async () => {
    if (!data.length) return;
    setSaving(true);
    try {
      await axios.post(`${DIA_API}/saveDiamondEntries`, data);
      setSaveStatus({ type: 'success', message: '✓ Saved successfully!' });
      setTimeout(() => { setData([]); setSaveStatus(null); }, 1500);
    } catch (err) {
      setSaveStatus({
        type: 'error',
        message: `✗ ${err.response?.data?.result || err.message || 'Save failed'}`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50 space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
          Diamond Purchase Entries
        </h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Template Download (self-contained) */}
          <TemplateDownload
            supplierName={suppliers?.companyname || ''}
            supplierCode={suppliers?.Suppcode || ''}
            onSuccess={msg => setSaveStatus({ type: 'success', message: msg })}
          />

          {/* Template Upload (self-contained — calls back on success) */}
          <TemplateUpload
            onDataLoaded={grouped => setData(grouped)}
            onReset={() => setData([])}
          />
        </div>
      </div>

      {/* ── Save status banner ── */}
      {saveStatus && (
        <div className={`p-3 rounded flex items-center gap-2 text-sm border-2 ${
          saveStatus.type === 'error'
            ? 'bg-red-50 text-red-800 border-red-300'
            : 'bg-green-50 text-green-800 border-green-300'
        }`}>
          <span className="font-medium">{saveStatus.message}</span>
        </div>
      )}

      {/* ── Table / states ── */}
      {saving
        ? <LoadingState />
        : data.length === 0
          ? <EmptyState />
          : (
            <PurchaseEntryTable
              data={data}
              onRowClick={setModalEntry}
              onRowChange={handleRowChange}
            />
          )
      }

      {/* ── Save / Reset bar ── */}
      {data.length > 0 && !saving && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 text-sm"
          >
            <Save className="w-4 h-4" /> Save to System
          </button>
          <button
            onClick={() => { setData([]); setSaveStatus(null); }}
            className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
        </div>
      )}

      {/* ── Detail modal ── */}
      {modalEntry && (
        <EntryDetailModal
          entry={modalEntry}
          onClose={() => setModalEntry(null)}
        />
      )}
    </div>
  );
};

export default DiamondManager;
