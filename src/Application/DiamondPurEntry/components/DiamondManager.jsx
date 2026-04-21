// import  { useContext, useEffect,  useState } from 'react';
// import axios from 'axios';
// import {
//   FileSpreadsheet, Eye, Save, RefreshCw, Loader2, ChevronDown,
// } from 'lucide-react';
// import TemplateDownload from './TemplateDownload';
// import TemplateUpload   from './TemplateUpload';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import { DIA_API,API } from '../../../config/configData';

// import {
//   PURCHASE_COLUMNS_BACKEND,
//   BACKEND_TO_DISPLAY_MAP,
//   NON_EDITABLE_COLS,
//   DROPDOWN_OPTIONS_BACKEND,
//   FIELD_DATA_TYPES,
// } from '../constants/diamondConstants';


// const formatNumber = (v, decimals = 2) => {
//   if (v === null || v === undefined || v === '') return '';
//   const n = Number(v);
//   if (Number.isNaN(n)) return String(v);
//   return n.toLocaleString(undefined, {
//     minimumFractionDigits: decimals,
//     maximumFractionDigits: decimals,
//   });
// };

// const THREE_DECIMAL_COLS = new Set([
//   'GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight',
// ]);

// // ─── PO detail field labels ───────────────────────────────────────────────────
// // Adjust keys to match what your API actually returns in each PO object
// const PO_DETAIL_FIELDS = [
//   { key: 'PONumber',      label: 'PO Number' },
//   { key: 'PODate',        label: 'PO Date' },
//   { key: 'SupplierName',  label: 'Supplier Name' },
//   { key: 'SupplierCode',  label: 'Supplier Code' },
//   { key: 'MetalType',     label: 'Metal Type' },
//   { key: 'TotalQuantity', label: 'Total Quantity' },
//   { key: 'TotalValue',    label: 'Total Value' },
//   { key: 'Status',        label: 'Status' },
//   { key: 'Remarks',       label: 'Remarks' },
//   { key: 'CreatedBy',     label: 'Created By' },
//   { key: 'ApprovedBy',    label: 'Approved By' },
//   { key: 'DeliveryDate',  label: 'Delivery Date' },
// ];

// // ─── Loading State ────────────────────────────────────────────────────────────
// const LoadingState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-8">
//       <div className="absolute inset-0 animate-ping opacity-20">
//         <div className="w-24 h-24 bg-indigo-500 rounded-full" />
//       </div>
//       <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
//         <Loader2 className="w-12 h-12 text-white animate-spin" />
//       </div>
//     </div>
//     <div className="text-center space-y-3">
//       <h3 className="text-2xl font-bold text-gray-900">Loading Purchase Entries</h3>
//       <p className="text-gray-500">Processing your Excel file...</p>
//       <div className="flex items-center justify-center gap-2 mt-4">
//         {[0, 150, 300].map(d => (
//           <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
//             style={{ animationDelay: `${d}ms` }} />
//         ))}
//       </div>
//     </div>
//   </div>
// );

// // ─── Empty State ──────────────────────────────────────────────────────────────
// const EmptyState = () => (
//   <div className="flex flex-col items-center justify-center py-24 px-4">
//     <div className="relative mb-6">
//       <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg rotate-3">
//         <div className="-rotate-3">
//           <FileSpreadsheet className="w-14 h-14 text-gray-400" />
//         </div>
//       </div>
//     </div>
//     <h3 className="text-xl font-bold text-gray-900">No Purchase Entries Yet</h3>
//     <p className="text-sm text-gray-500 mt-1">Select a PO, then download the template, fill it in, and upload it.</p>
//   </div>
// );

// // ─── Diamond Sub-table ────────────────────────────────────────────────────────
// const DiamondTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           {['#', 'Stone From', 'Diamond Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'].map(h => (
//             <th key={h} className="p-2 border">{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ? (
//           <tr><td colSpan={8} className="text-center p-4 text-gray-400">No diamond records.</td></tr>
//         ) : records.map((d, i) => (
//           <tr key={i} className="hover:bg-gray-50">
//             <td className="p-2 border text-center">{i + 1}</td>
//             <td className="p-2 border"><input value={d.STONE_FROM   || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.NoOfStones   || 0}  disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.Carat  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.Rate   || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.Value  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={d.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // ─── Color Stone Sub-table ────────────────────────────────────────────────────
// const ColorStoneTable = ({ records }) => (
//   <div className="overflow-auto max-h-72 border rounded">
//     <table className="min-w-full text-sm">
//       <thead className="bg-gray-50 sticky top-0">
//         <tr>
//           {['#', 'Color Stone Shape', 'No Of Stones', 'Carat', 'Rate', 'Value', 'Weight'].map(h => (
//             <th key={h} className="p-2 border">{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {records.length === 0 ? (
//           <tr><td colSpan={7} className="text-center p-4 text-gray-400">No color stone records.</td></tr>
//         ) : records.map((c, i) => (
//           <tr key={i} className="hover:bg-gray-50">
//             <td className="p-2 border text-center">{i + 1}</td>
//             <td className="p-2 border"><input value={c.csShape    || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={c.NoOfStones || 0}  disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={c.Carat  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={c.Rate   || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={c.Value  || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//             <td className="p-2 border"><input value={c.Weight || 0} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // ─── Entry Detail Modal ───────────────────────────────────────────────────────
// const EntryDetailModal = ({ entry, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-start justify-center pt-12">
//     <div className="fixed inset-0 bg-black opacity-40" onClick={onClose} />
//     <div className="relative z-60 w-[95%] max-w-6xl bg-white rounded-lg shadow-xl overflow-auto max-h-[88vh]">
//       <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
//         <h3 className="text-lg font-bold">Entry — ID: {entry.id} | {entry.DesignNo}</h3>
//         <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm">Close</button>
//       </div>
//       <div className="p-4 space-y-6">
//         <section>
//           <h4 className="font-semibold mb-3">Purchase Entry Details</h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {[
//               ['Supplier Name', entry.SupplierName], ['Invoice Number', entry.invoiceNumber],
//               ['Invoice Date',  entry.invoiceDate],  ['Product Name',   entry.ProductName],
//               ['Design No',     entry.DesignNo],     ['Metal Type',     entry.MetalType],
//               ['Grand Total',   entry.GrandTotal ?? 0], ['Gold Weight', entry.GoldWt ?? 0],
//               ['IGI Summary No', entry.IgiSummaryNo],['PGI UIN No',     entry.PgiUinNo],
//             ].map(([label, val]) => (
//               <div key={label}>
//                 <label className="text-xs text-gray-500">{label}</label>
//                 <input value={val || ''} disabled className="w-full border p-1.5 rounded bg-gray-50 text-sm" />
//               </div>
//             ))}
//           </div>
//         </section>
//         <section>
//           <h4 className="font-semibold mb-2">Diamonds ({(entry.diamonds || []).length})</h4>
//           <DiamondTable records={entry.diamonds || []} />
//         </section>
//         <section>
//           <h4 className="font-semibold mb-2">Color Stones ({(entry.colorStones || []).length})</h4>
//           <ColorStoneTable records={entry.colorStones || []} />
//         </section>
//       </div>
//     </div>
//   </div>
// );

// // ─── Purchase Entry Table ─────────────────────────────────────────────────────
// const PurchaseEntryTable = ({ data, onRowClick, onRowChange }) => (
//   <div className="overflow-auto bg-white border rounded shadow-sm">
//     <table className="min-w-full text-xs">
//       <thead>
//         <tr className="bg-gray-100 sticky top-0">
//           {PURCHASE_COLUMNS_BACKEND.map(col => (
//             <th key={col} className="border px-2 py-1.5 text-left whitespace-nowrap font-semibold">
//               {BACKEND_TO_DISPLAY_MAP[col] || col}
//               {NON_EDITABLE_COLS.has(col) && (
//                 <span className="ml-1 text-red-400 font-normal text-[10px]">(locked)</span>
//               )}
//             </th>
//           ))}
//           <th className="border px-2 py-1.5">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map(row => (
//           <tr key={row.id ?? Math.random()} className="hover:bg-blue-50 align-top">
//             {PURCHASE_COLUMNS_BACKEND.map(col => {
//               const raw = row[col];
//               if (NON_EDITABLE_COLS.has(col)) {
//                 const disp = typeof raw === 'number'
//                   ? formatNumber(raw, THREE_DECIMAL_COLS.has(col) ? 3 : 2)
//                   : (raw ?? '');
//                 return (
//                   <td key={col} className="border px-2 py-1 max-w-[140px] truncate bg-gray-50 text-gray-500" title={String(disp)}>
//                     {String(disp)}
//                   </td>
//                 );
//               }
//               if (DROPDOWN_OPTIONS_BACKEND[col]) {
//                 return (
//                   <td key={col} className="border px-1 py-1 min-w-[110px]">
//                     <select
//                       value={raw ?? ''}
//                       onChange={e => onRowChange(row.id, col, e.target.value)}
//                       className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
//                     >
//                       <option value="">--</option>
//                       {DROPDOWN_OPTIONS_BACKEND[col].map(o => (
//                         <option key={o} value={o}>{o}</option>
//                       ))}
//                     </select>
//                   </td>
//                 );
//               }
//               const inputType = ['int', 'decimal'].includes(FIELD_DATA_TYPES[col]) ? 'number' : 'text';
//               return (
//                 <td key={col} className="border px-1 py-1 min-w-[90px]">
//                   <input
//                     type={inputType}
//                     value={raw ?? ''}
//                     onChange={e => onRowChange(row.id, col, e.target.value)}
//                     step={inputType === 'number' ? 'any' : undefined}
//                     className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
//                   />
//                 </td>
//               );
//             })}
//             <td className="border px-2 py-1">
//               <button
//                 onClick={() => onRowClick(row)}
//                 className="px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-1 hover:bg-indigo-700 whitespace-nowrap text-xs"
//               >
//                 <Eye className="w-3.5 h-3.5" /> View
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// // ─── PO Selector + Detail Panel ───────────────────────────────────────────────
// const POSelectorPanel = ({ selectedPO, poDetails, poNumbers, poLoading, poError, onSelectPO }) => (
//   <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
//     <div className="flex items-center gap-2 mb-1">
//       <div className="w-2 h-5 bg-indigo-600 rounded-full" />
//       <h3 className="font-bold text-gray-800 text-sm">Select Purchase Order</h3>
//     </div>

//     {/* PO Dropdown */}
//     <div className="flex items-center gap-3 flex-wrap">
//       <div className="relative min-w-[220px]">
//         <select
//           value={selectedPO}
//           onChange={e => onSelectPO(e.target.value)}
//           disabled={poLoading}
//           className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm
//                      focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm
//                      disabled:bg-gray-100 disabled:cursor-not-allowed"
//         >
//           <option value="">-- Select PO Number --</option>
//           {poNumbers.map(po => (
//             <option key={po} value={po}>{po}</option>
//           ))}
//         </select>
//         <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//       </div>

//       {poLoading && (
//         <div className="flex items-center gap-1.5 text-indigo-600 text-xs">
//           <Loader2 className="w-4 h-4 animate-spin" />
//           <span>Fetching PO numbers...</span>
//         </div>
//       )}
//       {poError && (
//         <span className="text-red-500 text-xs">{poError}</span>
//       )}
//     </div>

//     {/* PO Detail Fields — shown only when a PO is selected */}
//     {selectedPO && poDetails && (
//       <div className="border-t pt-4">
//         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">PO Details</p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//           {PO_DETAIL_FIELDS.map(({ key, label }) => (
//             <div key={key}>
//               <label className="block text-[10px] font-medium text-gray-400 mb-0.5">{label}</label>
//               <input
//                 type="text"
//                 value={poDetails[key] ?? ''}
//                 disabled
//                 className="w-full border border-gray-200 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-700 truncate"
//                 title={String(poDetails[key] ?? '')}
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     )}
//   </div>
// );


// // ─── Main Component ───────────────────────────────────────────────────────────
// const DiamondManager = () => {
//   const { user } = useContext(DashBoardContext);

//   const [suppliers,    setSuppliers]    = useState({});
//   const [data,         setData]         = useState([]);
//   const [saving,       setSaving]       = useState(false);
//   const [saveStatus,   setSaveStatus]   = useState(null);
//   const [modalEntry,   setModalEntry]   = useState(null);

//   // ── PO state ──
//   const [poNumbers,  setPoNumbers]  = useState([]);
//   const [poLoading,  setPoLoading]  = useState(false);
//   const [poError,    setPoError]    = useState(null);
//   const [selectedPO, setSelectedPO] = useState('');
//   const [poDetails,  setPoDetails]  = useState(null);

//   // ── Fetch supplier info ──
//   useEffect(() => {
//     if (!user) return;
//     axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user })
//       .then(res => setSuppliers(res.data))
//       .catch(err => console.error('Supplier fetch error:', err));
//   }, [user]);

//   // ── Fetch PO numbers on mount ──


//   useEffect(() => {
//     const fetchPONumbers = async () => {

//     setPoLoading(true);
//     setPoError(null);
//     const response =await axios.get(`${API}/gold_po/fetch_po_number/${user}/Diamond-Supplier/Accepted`)
    
//     console.log("response",response);
//     if (response.data && response?.data?.filteredData && response?.data?.filteredData?.poNumbers) {
//       setPoNumbers(response?.data?.filteredData?.poNumbers);
//     } else {
//       setPoError("Unexpected API response structure.");
//     }
//     setPoLoading(false);
//   };
//   fetchPONumbers();
//   }, []);
// console.log(poNumbers)
//   // ── Handle PO selection: find details from the fetched list ──
//   // If your API returns full objects (not just strings), store them and look up on select.
//   // Otherwise you can make a secondary API call here for details.
//   const handleSelectPO = async (poNumber) => {
//     setSelectedPO(poNumber);
//     setPoDetails(null);
//     setData([]);
//     setSaveStatus(null);

//     if (!poNumber) return;

//     // Option A: If PO list endpoint already returns full objects, find it:
//     // setPoDetails(poList.find(p => p.PONumber === poNumber));

//     // Option B: Fetch detail for the selected PO number via a detail endpoint.
//     // Replace the URL below with your actual detail endpoint if available.
//     try {
//       const res = await axios.get(
//         `${API}/gold_po/fetch_po_number/${user}/Diamond-Supplier/Accepted`
//       );
//       const list = Array.isArray(res.data) ? res.data : [];
//       // Find matching PO object if list items are objects
//       const matched = list.find(item => {
//         if (typeof item === 'string') return item === poNumber;
//         return (
//           item.PONumber   === poNumber ||
//           item.po_number  === poNumber ||
//           item.poNumber   === poNumber
//         );
//       });
//       setPoDetails(matched && typeof matched !== 'string' ? matched : { PONumber: poNumber });
//     } catch (err) {
//       console.error('PO detail fetch error:', err);
//       setPoDetails({ PONumber: poNumber });
//     }
//   };

//   // ── Inline cell edit ──
//   const handleRowChange = (rowId, col, value) => {
//     setData(prev => prev.map(row => {
//       if (row.id !== rowId) return row;
//       const dataType = FIELD_DATA_TYPES[col];
//       let parsed = value;
//       if (dataType === 'int') {
//         parsed = value === '' ? 0 : parseInt(value, 10);
//         if (isNaN(parsed)) parsed = 0;
//       } else if (dataType === 'decimal') {
//         parsed = value === '' ? 0 : parseFloat(value);
//         if (isNaN(parsed)) parsed = 0;
//       }
//       return { ...row, [col]: parsed };
//     }));
//   };

//   // ── Save all entries to backend ──
//   const handleSave = async () => {
//     if (!data.length) return;
//     setSaving(true);
//     try {
//       // Attach PO number to every entry before saving
//       const payload = data.map(row => ({ ...row, PONumber: selectedPO }));
//       await axios.post(`${DIA_API}/saveDiamondEntries`, payload);
//       setSaveStatus({ type: 'success', message: '✓ Saved successfully!' });
//       setTimeout(() => { setData([]); setSaveStatus(null); }, 1500);
//     } catch (err) {
//       setSaveStatus({
//         type: 'error',
//         message: `✗ ${err.response?.data?.result || err.message || 'Save failed'}`,
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen bg-slate-50 space-y-5">

//       {/* ── Header ── */}
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
//           Diamond Purchase Entries
//         </h2>
//       </div>

//       {/* ── PO Selector Panel ── */}
//       <POSelectorPanel
//         selectedPO={selectedPO}
//         poDetails={poDetails}
//         poNumbers={poNumbers}
//         poLoading={poLoading}
//         poError={poError}
//         onSelectPO={handleSelectPO}
//       />

//       {/* ── Template Download + Upload — shown only after PO is selected ── */}
//       {selectedPO && (
//         <div className="flex items-center gap-3 flex-wrap bg-white border rounded-lg p-4 shadow-sm">
//           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
//             PO: <span className="text-indigo-600 font-bold normal-case">{selectedPO}</span>
//           </span>

//           <TemplateDownload
//             supplierName={suppliers?.companyname || ''}
//             supplierCode={suppliers?.Suppcode || ''}
//             poNumber={selectedPO}
//             poDetails={poDetails}
//             onSuccess={msg => setSaveStatus({ type: 'success', message: msg })}
//           />

//           <TemplateUpload
//             onDataLoaded={grouped => setData(grouped)}
//             onReset={() => setData([])}
//           />
//         </div>
//       )}

//       {/* ── Save status banner ── */}
//       {saveStatus && (
//         <div className={`p-3 rounded flex items-center gap-2 text-sm border-2 ${
//           saveStatus.type === 'error'
//             ? 'bg-red-50 text-red-800 border-red-300'
//             : 'bg-green-50 text-green-800 border-green-300'
//         }`}>
//           <span className="font-medium">{saveStatus.message}</span>
//         </div>
//       )}

//       {/* ── Table / states ── */}
//       {!selectedPO ? (
//         <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border rounded-lg">
//           <FileSpreadsheet className="w-14 h-14 text-gray-300 mb-4" />
//           <p className="text-gray-500 font-medium">Please select a PO number above to continue.</p>
//         </div>
//       ) : saving ? (
//         <LoadingState />
//       ) : data.length === 0 ? (
//         <EmptyState />
//       ) : (
//         <PurchaseEntryTable
//           data={data}
//           onRowClick={setModalEntry}
//           onRowChange={handleRowChange}
//         />
//       )}

//       {/* ── Save / Reset bar ── */}
//       {data.length > 0 && !saving && (
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 text-sm"
//           >
//             <Save className="w-4 h-4" /> Save to System
//           </button>
//           <button
//             onClick={() => { setData([]); setSaveStatus(null); }}
//             className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600 text-sm"
//           >
//             <RefreshCw className="w-4 h-4" /> Reset
//           </button>
//         </div>
//       )}

//       {/* ── Detail modal ── */}
//       {modalEntry && (
//         <EntryDetailModal
//           entry={modalEntry}
//           onClose={() => setModalEntry(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default DiamondManager;



import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet, Eye, Save, RefreshCw, Loader2, ChevronDown,
} from 'lucide-react';
import TemplateDownload from './TemplateDownload';
import TemplateUpload   from './TemplateUpload';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import { DIA_API, API } from '../../../config/configData';

import {
  PURCHASE_COLUMNS_BACKEND,
  BACKEND_TO_DISPLAY_MAP,
  NON_EDITABLE_COLS,
  DROPDOWN_OPTIONS_BACKEND,
  FIELD_DATA_TYPES,
} from '../constants/diamondConstants';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatNumber = (v, decimals = 2) => {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const THREE_DECIMAL_COLS = new Set([
  'GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 'PTWastageWeight',
]);

// ─── Safe JSON parse helper ───────────────────────────────────────────────────
const safeJsonParse = (str, fallback = {}) => {
  if (!str || typeof str !== 'string') return fallback;
  try { return JSON.parse(str); }
  catch { return fallback; }
};

// ─── PO detail field labels ───────────────────────────────────────────────────
const PO_DETAIL_FIELDS = [
  { key: 'poNumber',         label: 'PO Number' },
  { key: 'poDate',           label: 'PO Date' },
  { key: 'dueDate',          label: 'Due Date' },
  { key: 'supplierName',     label: 'Supplier Name' },
  { key: 'supplierCode',     label: 'Supplier Code' },
  { key: 'supplierGst',      label: 'Supplier GST' },
  { key: 'purchaseIncharge', label: 'Purchase Incharge' },
  { key: 'purchaseManager',  label: 'Purchase Manager' },
  { key: 'locationType',     label: 'Location Type' },
  { key: 'paymentType',      label: 'Payment Type' },
  { key: 'mode',             label: 'Mode' },
];

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
          <div key={d} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: `${d}ms` }} />
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
    <p className="text-sm text-gray-500 mt-1">Select a PO, then download the template, fill it in, and upload it.</p>
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
            <td className="p-2 border"><input value={d.STONE_FROM   || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.DiamondShape || ''} disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
            <td className="p-2 border"><input value={d.NoOfStones   || 0}  disabled className="w-full p-1 border rounded bg-gray-100 text-xs" /></td>
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
              ['Supplier Name',  entry.SupplierName],  ['Invoice Number', entry.invoiceNumber],
              ['Invoice Date',   entry.invoiceDate],   ['Product Name',   entry.ProductName],
              ['Design No',      entry.DesignNo],      ['Metal Type',     entry.MetalType],
              ['Grand Total',    entry.GrandTotal ?? 0],['Gold Weight',   entry.GoldWt ?? 0],
              ['IGI Summary No', entry.IgiSummaryNo],  ['PGI UIN No',    entry.PgiUinNo],
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
              // if (DROPDOWN_OPTIONS_BACKEND[col]) {
              //   return (
              //     <td key={col} className="border px-1 py-1 min-w-[110px]">
              //       <select
              //         value={raw ?? ''}
              //         onChange={e => onRowChange(row.id, col, e.target.value)}
              //         className="w-full p-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400 bg-white"
              //       >
              //         <option value="">--</option>
              //         {DROPDOWN_OPTIONS_BACKEND[col].map(o => (
              //           <option key={o} value={o}>{o}</option>
              //         ))}
              //       </select>
              //     </td>
              //   );
              // }
              // const inputType = ['int', 'decimal'].includes(FIELD_DATA_TYPES[col]) ? 'number' : 'text';
              return (
                <td key={col} className="border px-1 py-1 min-w-[90px]">
                  <input
                    // type={inputType}
                    type='text'

                    value={raw ?? ''}
                    onChange={e => onRowChange(row.id, col, e.target.value)}
                    disabled={true}
                    // step={inputType === 'number' ? 'any' : undefined}
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

// ─── productAvlTypes Badge ────────────────────────────────────────────────────
const ProductTypeBadges = ({ avlTypes }) => {
  if (!avlTypes) return null;
  const colors = { Gold: 'bg-yellow-100 text-yellow-800', Diamond: 'bg-blue-100 text-blue-800', Platinum: 'bg-gray-200 text-gray-700' };
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {Object.entries(avlTypes)
        .filter(([, v]) => v === true)
        .map(([k]) => (
          <span key={k} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors[k] || 'bg-gray-100 text-gray-600'}`}>
            {k}
          </span>
        ))}
    </div>
  );
};

// ─── PO Selector + Detail Panel ───────────────────────────────────────────────
const POSelectorPanel = ({
  selectedPO, poDetails, poNumbers, poLoading, poError,
  onSelectPO, poDetailLoading,
}) => (
  <div className="bg-white border rounded-lg shadow-sm p-4 space-y-4">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-2 h-5 bg-indigo-600 rounded-full" />
      <h3 className="font-bold text-gray-800 text-sm">Select Purchase Order</h3>
    </div>

    {/* PO Dropdown */}
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative min-w-[220px]">
        <select
          value={selectedPO}
          onChange={e => onSelectPO(e.target.value)}
          disabled={poLoading}
          className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">-- Select PO Number --</option>
          {poNumbers.map(po => (
            <option key={po} value={po}>{po}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {poLoading && (
        <div className="flex items-center gap-1.5 text-indigo-600 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Fetching PO numbers...</span>
        </div>
      )}
      {poDetailLoading && !poLoading && (
        <div className="flex items-center gap-1.5 text-blue-500 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading PO details...</span>
        </div>
      )}
      {poError && <span className="text-red-500 text-xs">{poError}</span>}
    </div>

    {/* PO Detail Fields — shown only when a PO is selected */}
    {selectedPO && poDetails && !poDetailLoading && (
      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PO Details</p>
          {poDetails.productAvlTypes && (
            <ProductTypeBadges avlTypes={poDetails.productAvlTypes} />
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {PO_DETAIL_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-[10px] font-medium text-gray-400 mb-0.5">{label}</label>
              <input
                type="text"
                value={poDetails[key] ?? ''}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded px-2 py-1.5 text-xs text-gray-700 truncate"
                title={String(poDetails[key] ?? '')}
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const DiamondManager = () => {
  const { user,suppCode } = useContext(DashBoardContext);
// console.log(suppCode)
  const [suppliers,        setSuppliers]        = useState({});
  const [data,             setData]             = useState([]);
  const [saving,           setSaving]           = useState(false);
  const [saveStatus,       setSaveStatus]       = useState(null);
  const [modalEntry,       setModalEntry]       = useState(null);

  // ── PO state ──
  const [poNumbers,        setPoNumbers]        = useState([]);
  const [poLoading,        setPoLoading]        = useState(false);
  const [poDetailLoading,  setPoDetailLoading]  = useState(false);
  const [poError,          setPoError]          = useState(null);
  const [selectedPO,       setSelectedPO]       = useState('');
  const [poDetails,        setPoDetails]        = useState(null);   // flat display object
  const [poLineItems,      setPoLineItems]      = useState([]);     // raw data[] from API → for template
  const [poAddress,        setPoAddress]        = useState(null);   // address block from API

  // ── Fetch supplier info ──
  useEffect(() => {
    if (!user) return;
    axios.post(`${DIA_API}/suppliers/kyc_details`, { SupplierName: user })
      .then(res => setSuppliers(res.data))
      .catch(err => console.error('Supplier fetch error:', err));
  }, [user]);

  // ── Fetch PO numbers on mount ──
  useEffect(() => {
    const fetchPONumbers = async () => {
      setPoLoading(true);
      setPoError(null);
      try {
        const response = await axios.get(
          `${DIA_API}/getQCCheckDetails/${suppCode}`
        );
        const poNums = response?.data?.poNumbers;
        if (Array.isArray(poNums)) {
          setPoNumbers(poNums);
        } else {
          setPoError('Unexpected API response structure.');
        }
      } catch (err) {
        // console.error('PO fetch error:', err);
        setPoError('Failed to load PO numbers.');
      } finally {
        setPoLoading(false);
      }
    };
    fetchPONumbers();
  }, [user]);

  // ── Handle PO selection ──
  // Calls POST /gold_po/fetch_po_creation with supplier name, PO number, and role
  const handleSelectPO = async (poNumber) => {
    setSelectedPO(poNumber);
    setPoDetails(null);
    setPoLineItems([]);
    setPoAddress(null);
    setData([]);
    setSaveStatus(null);

    if (!poNumber) return;

    setPoDetailLoading(true);
    try {
  
   const res = await axios.post(`${API}/gold_po/fetch_po_creation`, {
        selectedSupplier: suppliers?.companyname || user,
        selectedPoNumber: poNumber,
        userRole: 'Diamond-Supplier',
      });
      const responseData  = res.data?.data  || [];
      const addressBlock  = res.data?.address || {};

      // ── Store raw line items for template ──
      setPoLineItems(responseData);
      setPoAddress(addressBlock);

      // ── Flatten into a single display object for the detail panel ──
      // Merge: poDetails + counterDetails + delivery + supplier info from address
      const poDetailsParsed  = addressBlock.poDetails      || {};
      const counterDetails   = addressBlock.counterDetails  || {};
      const delivery         = addressBlock.delivery        || {};
      const supplierAddr     = addressBlock.supplier        || {};

      // Parse productAvlTypes from first line item (they are the same across all items)
      const firstItem        = responseData[0] || {};
      const productAvlTypes  = safeJsonParse(firstItem.productAvlTypes, {});

      setPoDetails({
        poNumber:         poDetailsParsed.poNumber    || poNumber,
        poDate:           poDetailsParsed.poDate      || '',
        dueDate:          poDetailsParsed.dueDate     || '',
        mode:             poDetailsParsed.mode        || '',
        supplierName:     supplierAddr.name           || firstItem.supplierName || '',
        supplierCode:     firstItem.supplierCode      || '',
        supplierGst:      supplierAddr.gstNo          || '',
        purchaseIncharge: counterDetails.purchaseIncharge || '',
        purchaseManager:  counterDetails.purchaseManager  || '',
        locationType:     delivery.locationType       || '',
        paymentType:      delivery.paymentType        || '',
        productAvlTypes,                               // { Gold: true, Diamond: true, Platinum: false }
      });
    } catch (err) {
      // console.error('PO detail fetch error:', err);
      setPoError('Failed to load PO details.');
      // Fallback: at least show PO number
      setPoDetails({ poNumber });
    } finally {
      setPoDetailLoading(false);
    }
  };

  // ── Inline cell edit ──
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

  // ── Save all entries to backend ──
  const handleSave = async () => {
    if (!data.length) return;
    setSaving(true);
    try {
      const payload = data.map(row => ({ ...row, PONumber: selectedPO }));
      await axios.post(`${DIA_API}/saveDiamondEntries`, payload);
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
      </div>

      {/* ── PO Selector Panel ── */}
      <POSelectorPanel
        selectedPO={selectedPO}
        poDetails={poDetails}
        poNumbers={poNumbers}
        poLoading={poLoading}
        poDetailLoading={poDetailLoading}
        poError={poError}
        onSelectPO={handleSelectPO}
      />

      {/* ── Template Download + Upload — shown only after PO is selected ── */}
      {selectedPO && poDetails && !poDetailLoading && (
        <div className="flex items-center gap-3 flex-wrap bg-white border rounded-lg p-4 shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
            PO: <span className="text-indigo-600 font-bold normal-case">{selectedPO}</span>
          </span>

          <TemplateDownload
            supplierName={poDetails.supplierName  || suppliers?.companyname || ''}
            supplierCode={poDetails.supplierCode  || suppliers?.Suppcode    || ''}
            poNumber={selectedPO}
            poDetails={poDetails}
            poLineItems={poLineItems}          // ← full data[] rows for the template
            poAddress={poAddress}              // ← address block (our company + supplier)
            productAvlTypes={poDetails.productAvlTypes || {}} // ← { Gold: true, Diamond: true, Platinum: false }
            onSuccess={msg => setSaveStatus({ type: 'success', message: msg })}
          />

          {/* <TemplateUpload
            onDataLoaded={grouped => setData(grouped)}
            onReset={() => setData([])}
          /> */}
          <TemplateUpload
  onDataLoaded={grouped => setData(grouped)}
  onReset={() => setData([])}
  selectedPO={selectedPO}
  supplierName={poDetails?.supplierName || suppliers?.companyname || ''}
  supplierCode={poDetails?.supplierCode || suppliers?.Suppcode || ''}
/>
        </div>
      )}

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
      {!selectedPO ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white border rounded-lg">
          <FileSpreadsheet className="w-14 h-14 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">Please select a PO number above to continue.</p>
        </div>
      ) : saving ? (
        <LoadingState />
      ) : data.length === 0 ? (
        <EmptyState />
      ) : (
        <PurchaseEntryTable
          data={data}
          onRowClick={setModalEntry}
          onRowChange={handleRowChange}
        />
      )}

      {/* ── Save / Reset bar ── */}
      {data.length > 0 && !saving && (
        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium flex items-center gap-2 hover:bg-blue-700 text-sm"
          >
            <Save className="w-4 h-4" /> Save Data
          </button>
          {/* <button
            onClick={() => { setData([]); setSaveStatus(null); }}
            className="px-4 py-2 bg-gray-500 text-white rounded font-medium flex items-center gap-2 hover:bg-gray-600 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button> */}
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
