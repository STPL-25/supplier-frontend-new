// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import {
//   FileSpreadsheet,
//   Filter,
//   RefreshCw,
//   Loader2,
//   Eye,
//   X,
//   ChevronDown,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   ClipboardList,
//   AlertCircle,
//   Save,
//   Diamond,
//   Gem,
// } from 'lucide-react';
// import { DIA_API } from '../../../config/configData';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

// // ---------- Status Badge Helper ----------
// const StatusBadge = ({ status }) => {
//   const map = {
//     Pending:  'bg-yellow-100 text-yellow-700 border-yellow-300',
//     Approved: 'bg-green-100 text-green-700 border-green-300',
//     Rejected: 'bg-red-100 text-red-700 border-red-300',
//     Partial:  'bg-blue-100 text-blue-700 border-blue-300',
//   };
//   return (
//     <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${map[status] || map.Pending}`}>
//       {status || 'Pending'}
//     </span>
//   );
// };

// // ---------- Main Component ----------
// const QCCheckReport = () => {
//   const { user, companyName } = useContext(DashBoardContext);

//   // ── Data States ──────────────────────────────────────────
//   const [purchaseData, setPurchaseData]   = useState([]);
//   const [filteredData, setFilteredData]   = useState([]);
//   const [loading, setLoading]             = useState(false);
//   const [submitting, setSubmitting]       = useState(false);

//   // ── Filter States ─────────────────────────────────────────
//   const [suppliers, setSuppliers]               = useState([]);
//   const [invoices, setInvoices]                 = useState([]);
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
//   const [filters, setFilters] = useState({
//     supplierName: '',
//     invoiceNumber: '',
//     fromDate: '',
//     toDate: '',
//     qcStatus: '',
//   });

//   // ── QC State: { [rowId]: { approvedQty, rejectedQty, reason, status } } ──
//   const [qcData, setQcData] = useState({});

//   // ── Modal States ──────────────────────────────────────────
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedEntry, setSelectedEntry]     = useState(null);
//   const [showQCModal, setShowQCModal]         = useState(false);
//   const [qcModalEntry, setQcModalEntry]       = useState(null);
//   const [qcModalDraft, setQcModalDraft]       = useState({});

//   // ── Helpers ────────────────────────────────────────────────
//   const parseStones = (s) => {
//     try { return !s || s === '[]' ? [] : JSON.parse(s); }
//     catch { return []; }
//   };

//   const getRowId = (item) => item.id || item.purchaseId || item.invoiceNumber + '_' + item.DesignNo;

//   // ── Fetch ─────────────────────────────────────────────────
//   const fetchPurchaseEntries = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${DIA_API}/getPurchaseEntries`);
//       const data = response.data.result[0] || [];
//       setPurchaseData(data);
//       setFilteredData(data);

//       // Initialise QC state for each row (won't overwrite existing)
//       setQcData(prev => {
//         const next = { ...prev };
//         data.forEach(item => {
//           const id = getRowId(item);
//           if (!next[id]) {
//             next[id] = {
//               approvedQty: item.PCS || 0,
//               rejectedQty: 0,
//               reason: '',
//               status: item.qcStatus || 'Pending',
//               savedAt: null,
//             };
//           }
//         });
//         return next;
//       });
//     } catch (error) {
//       console.error('Error fetching purchase entries:', error);
//       setPurchaseData([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Effects ───────────────────────────────────────────────
//   useEffect(() => { fetchPurchaseEntries(); }, []);

//   useEffect(() => {
//     if (purchaseData.length > 0) {
//       const uniqueSuppliers = [...new Set(purchaseData.map(i => i.SupplierName).filter(Boolean))].sort();
//       setSuppliers(uniqueSuppliers);
//       const uniqueInvoices = [...new Set(purchaseData.map(i => i.invoiceNumber).filter(Boolean))].sort();
//       setInvoices(uniqueInvoices);
//       setFilteredInvoices(uniqueInvoices);
//     }
//   }, [purchaseData]);

//   useEffect(() => {
//     if (filters.supplierName) {
//       const si = [...new Set(
//         purchaseData.filter(i => i.SupplierName === filters.supplierName).map(i => i.invoiceNumber).filter(Boolean)
//       )].sort();
//       setFilteredInvoices(si);
//       if (filters.invoiceNumber && !si.includes(filters.invoiceNumber))
//         setFilters(prev => ({ ...prev, invoiceNumber: '' }));
//     } else {
//       setFilteredInvoices(invoices);
//     }
//   }, [filters.supplierName, purchaseData, invoices]);

//   useEffect(() => { applyFilters(); }, [filters, purchaseData, qcData]);

//   // ── Filter Logic ──────────────────────────────────────────
//   const applyFilters = () => {
//     let filtered = [...purchaseData];
//     if (filters.supplierName) filtered = filtered.filter(i => i.SupplierName === filters.supplierName);
//     if (filters.invoiceNumber) filtered = filtered.filter(i => i.invoiceNumber === filters.invoiceNumber);
//     if (filters.fromDate) filtered = filtered.filter(i => i.createdAt && new Date(i.createdAt) >= new Date(filters.fromDate));
//     if (filters.toDate) {
//       filtered = filtered.filter(i => {
//         if (!i.createdAt) return false;
//         const t = new Date(filters.toDate); t.setHours(23, 59, 59, 999);
//         return new Date(i.createdAt) <= t;
//       });
//     }
//     if (filters.qcStatus) {
//       filtered = filtered.filter(i => {
//         const id = getRowId(i);
//         return (qcData[id]?.status || 'Pending') === filters.qcStatus;
//       });
//     }
//     setFilteredData(filtered);
//   };

//   const resetFilters = () => setFilters({ supplierName: '', invoiceNumber: '', fromDate: '', toDate: '', qcStatus: '' });

//   // ── Summary ───────────────────────────────────────────────
//   const calculateSummary = () => {
//     const counts = { total: filteredData.length, pending: 0, approved: 0, rejected: 0, partial: 0 };
//     let totalApproved = 0, totalRejected = 0;
//     filteredData.forEach(item => {
//       const id = getRowId(item);
//       const qc = qcData[id] || {};
//       const status = qc.status || 'Pending';
//       if (status === 'Pending')  counts.pending++;
//       if (status === 'Approved') counts.approved++;
//       if (status === 'Rejected') counts.rejected++;
//       if (status === 'Partial')  counts.partial++;
//       totalApproved += Number(qc.approvedQty || 0);
//       totalRejected += Number(qc.rejectedQty || 0);
//     });
//     return { ...counts, totalApproved, totalRejected };
//   };

//   // ── QC Modal Open ─────────────────────────────────────────
//   const openQCModal = (entry) => {
//     const id = getRowId(entry);
//     setQcModalEntry(entry);
//     setQcModalDraft({
//       approvedQty: qcData[id]?.approvedQty ?? (entry.PCS || 0),
//       rejectedQty: qcData[id]?.rejectedQty ?? 0,
//       reason:      qcData[id]?.reason ?? '',
//     });
//     setShowQCModal(true);
//   };

//   // ── Derive status from qty ─────────────────────────────────
//   const deriveStatus = (approved, rejected, total) => {
//     const a = Number(approved), r = Number(rejected), t = Number(total);
//     if (a === 0 && r === 0) return 'Pending';
//     if (r === 0 && a >= t)  return 'Approved';
//     if (a === 0 && r >= t)  return 'Rejected';
//     if (a + r >= t)         return 'Partial';
//     return 'Pending';
//   };

//   // ── Save QC from Modal ────────────────────────────────────
//   const saveQCFromModal = async () => {
//     const id = getRowId(qcModalEntry);
//     const { approvedQty, rejectedQty, reason } = qcModalDraft;
//     const total = qcModalEntry.PCS || 0;

//     if (Number(approvedQty) + Number(rejectedQty) > total) {
//       alert(`Approved + Rejected (${Number(approvedQty) + Number(rejectedQty)}) cannot exceed total PCS (${total}).`);
//       return;
//     }
//     if (Number(rejectedQty) > 0 && !reason.trim()) {
//       alert('Please provide a rejection reason.');
//       return;
//     }

//     const status = deriveStatus(approvedQty, rejectedQty, total);

//     setSubmitting(true);
//     try {
//       await axios.post(`${DIA_API}/saveQCCheck`, {
//         purchaseId: id,
//         approvedQty: Number(approvedQty),
//         rejectedQty: Number(rejectedQty),
//         reason,
//         status,
//         updatedBy: user?.name || 'QC Officer',
//       });

//       setQcData(prev => ({
//         ...prev,
//         [id]: { approvedQty: Number(approvedQty), rejectedQty: Number(rejectedQty), reason, status, savedAt: new Date() },
//       }));
//       setShowQCModal(false);
//     } catch (error) {
//       console.error('QC save error:', error);
//       alert('Failed to save QC. Try again.');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Quick Approve All (filtered) ──────────────────────────
//   const approveAll = async () => {
//     if (!window.confirm(`Approve all ${filteredData.length} filtered entries?`)) return;
//     const updates = {};
//     filteredData.forEach(item => {
//       const id = getRowId(item);
//       updates[id] = { approvedQty: item.PCS || 0, rejectedQty: 0, reason: '', status: 'Approved', savedAt: new Date() };
//     });
//     setQcData(prev => ({ ...prev, ...updates }));
//   };

//   const summary = calculateSummary();

//   // ────────────────────────────────────────────────────────────
//   return (
//     <div className="p-6 min-h-screen bg-slate-50">
//       <div className="mx-auto space-y-6">

//         {/* ── Header ── */}
//         <div className="flex items-center justify-between flex-wrap gap-3">
//           <h2 className="text-2xl font-semibold flex items-center gap-2">
//             <ClipboardList className="w-6 h-6 text-indigo-600" /> QC Check Report
//           </h2>
//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={fetchPurchaseEntries}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" /> Refresh
//             </button>
//             <button
//               onClick={approveAll}
//               disabled={filteredData.length === 0}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <CheckCircle className="w-4 h-4" /> Approve All
//             </button>
//           </div>
//         </div>

//         {/* ── Filters ── */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <div className="flex items-center gap-2 mb-4">
//             <Filter className="w-5 h-5 text-indigo-600" />
//             <h3 className="text-lg font-semibold">Filters</h3>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">

//             {/* Supplier */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
//               <div className="relative">
//                 <select
//                   value={filters.supplierName}
//                   onChange={e => setFilters({ ...filters, supplierName: e.target.value, invoiceNumber: '' })}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
//                 >
//                   <option value="">All Suppliers</option>
//                   {suppliers.map((s, i) => <option key={i} value={s}>{s}</option>)}
//                 </select>
//                 <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* Invoice */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
//               <div className="relative">
//                 <select
//                   value={filters.invoiceNumber}
//                   onChange={e => setFilters({ ...filters, invoiceNumber: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
//                   disabled={filteredInvoices.length === 0}
//                 >
//                   <option value="">All Invoices</option>
//                   {filteredInvoices.map((inv, i) => <option key={i} value={inv}>{inv}</option>)}
//                 </select>
//                 <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
//               </div>
//             </div>

//             {/* From Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//               <div className="relative">
//                 <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
//                 <input
//                   type="date"
//                   value={filters.fromDate}
//                   onChange={e => setFilters({ ...filters, fromDate: e.target.value })}
//                   className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                 />
//               </div>
//             </div>

//             {/* To Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//               <div className="relative">
//                 <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
//                 <input
//                   type="date"
//                   value={filters.toDate}
//                   onChange={e => setFilters({ ...filters, toDate: e.target.value })}
//                   className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
//                 />
//               </div>
//             </div>

//             {/* QC Status Filter */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">QC Status</label>
//               <div className="relative">
//                 <select
//                   value={filters.qcStatus}
//                   onChange={e => setFilters({ ...filters, qcStatus: e.target.value })}
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Approved">Approved</option>
//                   <option value="Rejected">Rejected</option>
//                   <option value="Partial">Partial</option>
//                 </select>
//                 <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 flex-wrap">
//             <button
//               onClick={resetFilters}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm transition-colors"
//             >
//               <RefreshCw className="w-4 h-4" /> Reset Filters
//             </button>
//             {Object.values(filters).some(Boolean) && (
//               <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
//                 <Filter className="w-4 h-4" />
//                 {filteredData.length} of {purchaseData.length} entries shown
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ── Summary Cards ── */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-xs text-gray-500">Total Entries</div>
//             <div className="text-2xl font-bold text-indigo-600">{summary.total}</div>
//           </div>
//           <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
//             <div className="text-xs text-yellow-700 font-medium flex items-center gap-1">
//               <AlertCircle className="w-3 h-3" /> Pending
//             </div>
//             <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
//           </div>
//           <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
//             <div className="text-xs text-green-700 font-medium flex items-center gap-1">
//               <CheckCircle className="w-3 h-3" /> Approved
//             </div>
//             <div className="text-2xl font-bold text-green-600">{summary.approved}</div>
//           </div>
//           <div className="bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
//             <div className="text-xs text-red-700 font-medium flex items-center gap-1">
//               <XCircle className="w-3 h-3" /> Rejected
//             </div>
//             <div className="text-2xl font-bold text-red-600">{summary.rejected}</div>
//           </div>
//           <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
//             <div className="text-xs text-blue-700 font-medium">Partial</div>
//             <div className="text-2xl font-bold text-blue-600">{summary.partial}</div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-sm border">
//             <div className="text-xs text-gray-500">Approved / Rejected Qty</div>
//             <div className="text-sm font-bold">
//               <span className="text-green-600">{summary.totalApproved} ✓</span>
//               {' / '}
//               <span className="text-red-600">{summary.totalRejected} ✗</span>
//             </div>
//           </div>
//         </div>

//         {/* ── Table ── */}
//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//             <span className="ml-3 text-lg">Loading data...</span>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
//             <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h3>
//             <p className="text-gray-500">No entries match the current filters.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead className="bg-gray-50 border-b sticky top-0 z-10">
//                   <tr>
//                     <th className="px-3 py-3 text-left font-semibold">#</th>
//                     <th className="px-3 py-3 text-left font-semibold">Supplier</th>
//                     <th className="px-3 py-3 text-left font-semibold">Invoice</th>
//                     <th className="px-3 py-3 text-left font-semibold">Product</th>
//                     <th className="px-3 py-3 text-left font-semibold">Design No</th>
//                     <th className="px-3 py-3 text-right font-semibold">Total PCS</th>
//                     <th className="px-3 py-3 text-right font-semibold text-green-700">Approved Qty</th>
//                     <th className="px-3 py-3 text-right font-semibold text-red-700">Rejected Qty</th>
//                     <th className="px-3 py-3 text-left font-semibold">Reason</th>
//                     <th className="px-3 py-3 text-center font-semibold">QC Status</th>
//                     <th className="px-3 py-3 text-left font-semibold">Date</th>
//                     <th className="px-3 py-3 text-center font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredData.map((item, index) => {
//                     const id = getRowId(item);
//                     const qc = qcData[id] || { approvedQty: item.PCS || 0, rejectedQty: 0, reason: '', status: 'Pending' };
//                     const statusColors = {
//                       Approved: 'bg-green-50',
//                       Rejected: 'bg-red-50',
//                       Partial:  'bg-blue-50',
//                       Pending:  '',
//                     };
//                     return (
//                       <tr key={id} className={`border-b hover:bg-gray-50 transition-colors ${statusColors[qc.status] || ''}`}>
//                         <td className="px-3 py-3">{index + 1}</td>
//                         <td className="px-3 py-3 font-medium">{item.SupplierName || '-'}</td>
//                         <td className="px-3 py-3 text-xs text-gray-600">{item.invoiceNumber || '-'}</td>
//                         <td className="px-3 py-3">{item.ProductName || '-'}</td>
//                         <td className="px-3 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
//                         <td className="px-3 py-3 text-right font-semibold">{item.PCS || 0}</td>
//                         <td className="px-3 py-3 text-right font-bold text-green-700">{qc.approvedQty}</td>
//                         <td className="px-3 py-3 text-right font-bold text-red-700">{qc.rejectedQty}</td>
//                         <td className="px-3 py-3 text-xs max-w-[160px] truncate" title={qc.reason}>
//                           {qc.reason || <span className="text-gray-400 italic">—</span>}
//                         </td>
//                         <td className="px-3 py-3 text-center">
//                           <StatusBadge status={qc.status} />
//                         </td>
//                         <td className="px-3 py-3 text-xs text-gray-500">
//                           {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
//                         </td>
//                         <td className="px-3 py-3">
//                           <div className="flex items-center gap-2 justify-center">
//                             {/* View Details */}
//                             <button
//                               onClick={() => { setSelectedEntry(item); setShowDetailModal(true); }}
//                               className="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
//                               title="View Details"
//                             >
//                               <Eye className="w-3.5 h-3.5" />
//                             </button>
//                             {/* QC Check */}
//                             <button
//                               onClick={() => openQCModal(item)}
//                               className="p-1.5 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
//                               title="QC Check"
//                             >
//                               <ClipboardList className="w-3.5 h-3.5" />
//                             </button>
//                             {/* Quick Approve */}
//                             <button
//                               onClick={() => setQcData(prev => ({
//                                 ...prev,
//                                 [id]: { approvedQty: item.PCS || 0, rejectedQty: 0, reason: '', status: 'Approved', savedAt: new Date() }
//                               }))}
//                               className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
//                               title="Quick Approve"
//                             >
//                               <CheckCircle className="w-3.5 h-3.5" />
//                             </button>
//                             {/* Quick Reject */}
//                             <button
//                               onClick={() => openQCModal({ ...item, _forceReject: true })}
//                               className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
//                               title="Reject with Reason"
//                             >
//                               <XCircle className="w-3.5 h-3.5" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ══════════════════════════════════════════════════════
//           QC Modal — Approve / Reject with Qty & Reason
//       ══════════════════════════════════════════════════════ */}
//       {showQCModal && qcModalEntry && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setShowQCModal(false)} />
//           <div className="relative z-60 w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">

//             {/* Modal Header */}
//             <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white">
//               <div>
//                 <h3 className="text-lg font-bold flex items-center gap-2">
//                   <ClipboardList className="w-5 h-5" /> QC Check
//                 </h3>
//                 <p className="text-xs opacity-80">{qcModalEntry.SupplierName} — {qcModalEntry.invoiceNumber}</p>
//               </div>
//               <button onClick={() => setShowQCModal(false)} className="p-2 hover:bg-white/20 rounded-full transition">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 space-y-5">

//               {/* Entry Info */}
//               <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-lg p-3 text-sm">
//                 <div>
//                   <div className="text-xs text-gray-500">Product</div>
//                   <div className="font-medium">{qcModalEntry.ProductName || '-'}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Design No</div>
//                   <div className="font-mono font-medium">{qcModalEntry.DesignNo || '-'}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs text-gray-500">Total PCS</div>
//                   <div className="text-lg font-bold text-indigo-600">{qcModalEntry.PCS || 0}</div>
//                 </div>
//               </div>

//               {/* Qty Inputs */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-green-700 mb-1">
//                     <CheckCircle className="w-4 h-4 inline mr-1" />Approved Qty
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={qcModalEntry.PCS || 0}
//                     value={qcModalDraft.approvedQty}
//                     onChange={e => {
//                       const approved = Number(e.target.value);
//                       const total = qcModalEntry.PCS || 0;
//                       setQcModalDraft(prev => ({
//                         ...prev,
//                         approvedQty: approved,
//                         rejectedQty: Math.max(0, total - approved),
//                       }));
//                     }}
//                     className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-lg font-bold text-green-700"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-red-700 mb-1">
//                     <XCircle className="w-4 h-4 inline mr-1" />Rejected Qty
//                   </label>
//                   <input
//                     type="number"
//                     min={0}
//                     max={qcModalEntry.PCS || 0}
//                     value={qcModalDraft.rejectedQty}
//                     onChange={e => {
//                       const rejected = Number(e.target.value);
//                       const total = qcModalEntry.PCS || 0;
//                       setQcModalDraft(prev => ({
//                         ...prev,
//                         rejectedQty: rejected,
//                         approvedQty: Math.max(0, total - rejected),
//                       }));
//                     }}
//                     className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-lg font-bold text-red-700"
//                   />
//                 </div>
//               </div>

//               {/* Live status preview */}
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="text-gray-500">Preview status:</span>
//                 <StatusBadge status={deriveStatus(qcModalDraft.approvedQty, qcModalDraft.rejectedQty, qcModalEntry.PCS)} />
//                 <span className="text-gray-400 text-xs ml-auto">
//                   Total: {Number(qcModalDraft.approvedQty) + Number(qcModalDraft.rejectedQty)} / {qcModalEntry.PCS || 0}
//                 </span>
//               </div>

//               {/* Rejection Reason */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">
//                   Rejection Reason
//                   {Number(qcModalDraft.rejectedQty) > 0 && <span className="text-red-500 ml-1">*</span>}
//                 </label>
//                 <textarea
//                   rows={3}
//                   value={qcModalDraft.reason}
//                   onChange={e => setQcModalDraft(prev => ({ ...prev, reason: e.target.value }))}
//                   placeholder="e.g. Surface cracks, weight mismatch, missing hallmark..."
//                   className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
//                 />
//               </div>

//               {/* Preset Reasons */}
//               <div>
//                 <p className="text-xs text-gray-500 mb-2">Quick reasons:</p>
//                 <div className="flex flex-wrap gap-2">
//                   {['Surface cracks', 'Weight mismatch', 'Missing hallmark', 'Stone setting issue', 'Finishing defect', 'Wrong design'].map(r => (
//                     <button
//                       key={r}
//                       onClick={() => setQcModalDraft(prev => ({ ...prev, reason: r }))}
//                       className={`px-2 py-1 text-xs rounded-full border transition-colors ${
//                         qcModalDraft.reason === r
//                           ? 'bg-orange-500 text-white border-orange-500'
//                           : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-600'
//                       }`}
//                     >
//                       {r}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-4 border-t bg-gray-50 flex justify-between items-center gap-3">
//               <button onClick={() => setShowQCModal(false)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors">
//                 Cancel
//               </button>
//               <div className="flex gap-2">
//                 {/* Full Approve shortcut */}
//                 <button
//                   onClick={() => setQcModalDraft({ approvedQty: qcModalEntry.PCS || 0, rejectedQty: 0, reason: '' })}
//                   className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-1 text-sm transition-colors"
//                 >
//                   <CheckCircle className="w-4 h-4" /> Full Approve
//                 </button>
//                 {/* Full Reject shortcut */}
//                 <button
//                   onClick={() => setQcModalDraft(prev => ({ ...prev, approvedQty: 0, rejectedQty: qcModalEntry.PCS || 0 }))}
//                   className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-1 text-sm transition-colors"
//                 >
//                   <XCircle className="w-4 h-4" /> Full Reject
//                 </button>
//                 {/* Save */}
//                 <button
//                   onClick={saveQCFromModal}
//                   disabled={submitting}
//                   className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm transition-colors disabled:opacity-60"
//                 >
//                   {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                   Save QC
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════════════════════════════════════════════
//           Detail Modal (same as PurchaseReport)
//       ══════════════════════════════════════════════════════ */}
//       {showDetailModal && selectedEntry && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
//           <div className="relative z-60 w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

//             <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
//               <h3 className="text-xl font-bold">Purchase Entry Details</h3>
//               <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/20 rounded-full">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6 overflow-auto flex-1 space-y-6">

//               {/* Basic Info */}
//               <section>
//                 <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">Basic Information</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//                   {[
//                     ['Supplier Name', selectedEntry.SupplierName],
//                     ['Invoice Number', selectedEntry.invoiceNumber],
//                     ['Supplier Code', selectedEntry.suppCode],
//                     ['Product Name', selectedEntry.ProductName],
//                     ['Design No', selectedEntry.DesignNo],
//                     ['Metal Type', selectedEntry.MetalType],
//                     ['Pieces (PCS)', selectedEntry.PCS],
//                     ['HUID', selectedEntry.HUID],
//                     ['Weight Mode', selectedEntry.WtMode],
//                   ].map(([label, val]) => (
//                     <div key={label}>
//                       <div className="text-xs text-gray-500 font-medium">{label}</div>
//                       <div className="mt-1 p-2 bg-gray-50 rounded border">{val || '-'}</div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Gold Details */}
//               {(selectedEntry.GoldWt > 0 || selectedEntry.GoldValue > 0) && (
//                 <section>
//                   <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                     {[
//                       ['Gold Karat', selectedEntry.GCarat],
//                       ['Gold Weight (g)', (selectedEntry.GoldWt || 0).toFixed(3)],
//                       ['Gold Purity', selectedEntry.GoldPurity],
//                       ['Gold Value', `₹${(selectedEntry.GoldValue || 0).toFixed(2)}`],
//                     ].map(([label, val]) => (
//                       <div key={label}>
//                         <div className="text-xs text-gray-500 font-medium">{label}</div>
//                         <div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">{val || '-'}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </section>
//               )}

//               {/* QC Status Section inside detail */}
//               <section>
//                 <h4 className="text-lg font-semibold mb-3 text-orange-600 border-b pb-2 flex items-center gap-2">
//                   <ClipboardList className="w-5 h-5" /> QC Status
//                 </h4>
//                 {(() => {
//                   const id = getRowId(selectedEntry);
//                   const qc = qcData[id] || {};
//                   return (
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                       <div>
//                         <div className="text-xs text-gray-500">Approved Qty</div>
//                         <div className="mt-1 p-2 bg-green-50 rounded border font-bold text-green-700 text-lg">{qc.approvedQty ?? '-'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Rejected Qty</div>
//                         <div className="mt-1 p-2 bg-red-50 rounded border font-bold text-red-700 text-lg">{qc.rejectedQty ?? '-'}</div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Status</div>
//                         <div className="mt-1 p-2 bg-gray-50 rounded border">
//                           <StatusBadge status={qc.status || 'Pending'} />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-500">Reason</div>
//                         <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">{qc.reason || '—'}</div>
//                       </div>
//                     </div>
//                   );
//                 })()}
//               </section>

//               {/* Diamonds */}
//               <section>
//                 <h4 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2 flex items-center gap-2">
//                   <Diamond className="w-5 h-5" /> Diamonds
//                 </h4>
//                 {(() => {
//                   const diamonds = parseStones(selectedEntry.diamonds);
//                   return diamonds.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full text-sm border">
//                         <thead className="bg-blue-50">
//                           <tr>
//                             {['Shape','Stones','Carat','Weight (g)','Rate (₹)','Value (₹)'].map(h => (
//                               <th key={h} className="px-3 py-2 text-right border first:text-left">{h}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {diamonds.map((d, i) => (
//                             <tr key={i} className="hover:bg-blue-50">
//                               <td className="px-3 py-2 border">{d.DiamondShape || '-'}</td>
//                               <td className="px-3 py-2 text-right border">{d.NoOfStones || 0}</td>
//                               <td className="px-3 py-2 text-right border text-blue-700 font-semibold">{(d.Carat || 0).toFixed(3)}</td>
//                               <td className="px-3 py-2 text-right border">{(d.Weight || 0).toFixed(3)}</td>
//                               <td className="px-3 py-2 text-right border">₹{(d.Rate || 0).toLocaleString('en-IN')}</td>
//                               <td className="px-3 py-2 text-right border font-bold text-blue-700">₹{(d.Value || 0).toLocaleString('en-IN')}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">No diamond details</div>;
//                 })()}
//               </section>

//               {/* ColorStones */}
//               <section>
//                 <h4 className="text-lg font-semibold mb-3 text-purple-600 border-b pb-2 flex items-center gap-2">
//                   <Gem className="w-5 h-5" /> ColorStones
//                 </h4>
//                 {(() => {
//                   const cs = parseStones(selectedEntry.colorstones);
//                   return cs.length > 0 ? (
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full text-sm border">
//                         <thead className="bg-purple-50">
//                           <tr>
//                             {['Shape/Type','Stones','Carat','Weight (g)','Rate (₹)','Value (₹)'].map(h => (
//                               <th key={h} className="px-3 py-2 text-right border first:text-left">{h}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {cs.map((c, i) => (
//                             <tr key={i} className="hover:bg-purple-50">
//                               <td className="px-3 py-2 border">{c.csShape || '-'}</td>
//                               <td className="px-3 py-2 text-right border">{c.NoOfStones || 0}</td>
//                               <td className="px-3 py-2 text-right border text-purple-700 font-semibold">{(c.Carat || 0).toFixed(3)}</td>
//                               <td className="px-3 py-2 text-right border">{(c.Weight || 0).toFixed(3)}</td>
//                               <td className="px-3 py-2 text-right border">₹{(c.Rate || 0).toLocaleString('en-IN')}</td>
//                               <td className="px-3 py-2 text-right border font-bold text-purple-700">₹{(c.Value || 0).toLocaleString('en-IN')}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">No colorstone details</div>;
//                 })()}
//               </section>

//               {/* Totals */}
//               <section>
//                 <h4 className="text-lg font-semibold mb-3 text-green-600 border-b pb-2">Totals</h4>
//                 <div className="grid grid-cols-3 gap-4 text-sm">
//                   <div>
//                     <div className="text-xs text-gray-500">Total Value</div>
//                     <div className="mt-1 p-2 bg-green-50 rounded border font-semibold">₹{(selectedEntry.TotalValue || 0).toFixed(2)}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">GST</div>
//                     <div className="mt-1 p-2 bg-green-50 rounded border">₹{(selectedEntry.GST || 0).toFixed(2)}</div>
//                   </div>
//                   <div>
//                     <div className="text-xs text-gray-500">Grand Total</div>
//                     <div className="mt-1 p-2 bg-green-100 rounded border font-bold text-lg text-green-700">
//                       ₹{(selectedEntry.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
//                     </div>
//                   </div>
//                 </div>
//               </section>
//             </div>

//             <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
//               <button
//                 onClick={() => { setShowDetailModal(false); openQCModal(selectedEntry); }}
//                 className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 text-sm"
//               >
//                 <ClipboardList className="w-4 h-4" /> Do QC Check
//               </button>
//               <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QCCheckReport;
import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet,
  Filter,
  RefreshCw,
  Loader2,
  Eye,
  X,
  ChevronDown,
  Calendar,
  CheckCircle,
  XCircle,
  ClipboardList,
  AlertCircle,
  Save,
  Diamond,
  Gem,
  Scale,
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmt3 = (v) => (v != null && v !== '' ? Number(v).toFixed(3) : '-');
const fmtCur = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

// Gross Wt  = GoldPurityWt  (total gross weight before deductions)
// Cent Wt   = sum of all diamond carats (computed from diamonds JSON)
// Net Wt    = GNetWt (net gold weight after stone deduction)
const getGrossWt  = (item) => item.GoldPurityWt ?? null;
const getNetWt    = (item) => item.GNetWt ?? null;
const getCentWt   = (item) => {
  try {
    const diamonds = item.diamonds && item.diamonds !== '[]' ? JSON.parse(item.diamonds) : [];
    const total = diamonds.reduce((sum, d) => sum + Number(d.Carat || 0), 0);
    return total > 0 ? total : null;
  } catch { return null; }
};

// ─────────────────────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Pending:  'bg-yellow-100 text-yellow-700 border-yellow-300',
    Approved: 'bg-green-100 text-green-700 border-green-300',
    Rejected: 'bg-red-100 text-red-700 border-red-300',
    Partial:  'bg-blue-100 text-blue-700 border-blue-300',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${map[status] || map.Pending}`}>
      {status || 'Pending'}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────
// QC Status Dropdown (clickable badge → QC Pass / Reject)
// ─────────────────────────────────────────────────────────────
const QCStatusDropdown = ({ status, onPass, onReject }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 cursor-pointer group"
        title="Click to update QC status"
      >
        <StatusBadge status={status} />
        <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
      </button>

      {open && (
        <div className="absolute z-50 top-7 left-0 min-w-[150px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <button
            onClick={() => { setOpen(false); onPass(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 transition-colors"
          >
            <CheckCircle className="w-4 h-4" /> QC Pass
          </button>
          <button
            onClick={() => { setOpen(false); onReject(); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors border-t"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
const QCCheckReport = () => {
  const { user } = useContext(DashBoardContext);

  const [purchaseData, setPurchaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  const [suppliers, setSuppliers]               = useState([]);
  const [invoices, setInvoices]                 = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filters, setFilters] = useState({
    supplierName: '', invoiceNumber: '', fromDate: '', toDate: '', qcStatus: '',
  });

  const [qcData, setQcData]         = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry]     = useState(null);

  const [qcActionModal, setQcActionModal] = useState({ open: false, mode: 'pass', ids: [] });
  const [qcReason, setQcReason]           = useState('');

  // ── Helpers ───────────────────────────────────────────────
  const parseStones = (s) => {
    try { return !s || s === '[]' ? [] : JSON.parse(s); }
    catch { return []; }
  };

  const getRowId = (item) =>
    item.id ?? item.purchaseId ?? (item.invoiceNumber + '_' + item.DesignNo);

  // ── Fetch ─────────────────────────────────────────────────
  const fetchPurchaseEntries = async () => {
    setLoading(true);
    try {
      const res  = await axios.get(`${DIA_API}/getPurchaseEntries`);
      const data = res.data.result[0] || [];
      setPurchaseData(data);
      setFilteredData(data);
      setQcData((prev) => {
        const next = { ...prev };
        data.forEach((item) => {
          const id = getRowId(item);
          if (!next[id]) {
            next[id] = {
              approvedQty: item.PCS || 0,
              rejectedQty: 0,
              reason: item.RejectionReason || '',
              status: item.PurchaseStatus || item.SupplierStatus || 'Pending',
              savedAt: null,
            };
          }
        });
        return next;
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setPurchaseData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => { fetchPurchaseEntries(); }, []);

  useEffect(() => {
    if (!purchaseData.length) return;
    setSuppliers([...new Set(purchaseData.map((i) => i.SupplierName).filter(Boolean))].sort());
    const inv = [...new Set(purchaseData.map((i) => i.invoiceNumber).filter(Boolean))].sort();
    setInvoices(inv);
    setFilteredInvoices(inv);
  }, [purchaseData]);

  useEffect(() => {
    if (filters.supplierName) {
      const si = [...new Set(
        purchaseData.filter((i) => i.SupplierName === filters.supplierName)
          .map((i) => i.invoiceNumber).filter(Boolean)
      )].sort();
      setFilteredInvoices(si);
      if (filters.invoiceNumber && !si.includes(filters.invoiceNumber))
        setFilters((p) => ({ ...p, invoiceNumber: '' }));
    } else {
      setFilteredInvoices(invoices);
    }
  }, [filters.supplierName, purchaseData, invoices]);

  useEffect(() => { applyFilters(); }, [filters, purchaseData, qcData]);

  // ── Filter Logic ──────────────────────────────────────────
  const applyFilters = () => {
    let f = [...purchaseData];
    if (filters.supplierName)  f = f.filter((i) => i.SupplierName === filters.supplierName);
    if (filters.invoiceNumber) f = f.filter((i) => i.invoiceNumber === filters.invoiceNumber);
    if (filters.fromDate)      f = f.filter((i) => i.createdAt && new Date(i.createdAt) >= new Date(filters.fromDate));
    if (filters.toDate) {
      f = f.filter((i) => {
        if (!i.createdAt) return false;
        const t = new Date(filters.toDate); t.setHours(23, 59, 59, 999);
        return new Date(i.createdAt) <= t;
      });
    }
    if (filters.qcStatus) {
      f = f.filter((i) => (qcData[getRowId(i)]?.status || 'Pending') === filters.qcStatus);
    }
    setFilteredData(f);
  };

  const resetFilters = () =>
    setFilters({ supplierName: '', invoiceNumber: '', fromDate: '', toDate: '', qcStatus: '' });

  // ── Summary ───────────────────────────────────────────────
  const summary = (() => {
    const c = { total: filteredData.length, pending: 0, approved: 0, rejected: 0, partial: 0 };
    let totalApproved = 0, totalRejected = 0;
    filteredData.forEach((item) => {
      const qc = qcData[getRowId(item)] || {};
      const s  = qc.status || 'Pending';
      if (s === 'Pending')  c.pending++;
      if (s === 'Approved') c.approved++;
      if (s === 'Rejected') c.rejected++;
      if (s === 'Partial')  c.partial++;
      totalApproved += Number(qc.approvedQty || 0);
      totalRejected += Number(qc.rejectedQty || 0);
    });
    return { ...c, totalApproved, totalRejected };
  })();

  // ── Multi-Select ──────────────────────────────────────────
  const toggleSelect = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedIds.size === filteredData.length
        ? new Set()
        : new Set(filteredData.map((i) => getRowId(i)))
    );

  const allSelected  = filteredData.length > 0 && selectedIds.size === filteredData.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  // ── QC Action ─────────────────────────────────────────────
  const openQCAction = (mode, ids) => {
    setQcReason('');
    setQcActionModal({ open: true, mode, ids });
  };

  const closeQCModal = () => setQcActionModal({ open: false, mode: 'pass', ids: [] });

  const saveQCAction = async () => {
    const { mode, ids } = qcActionModal;
    if (mode === 'reject' && !qcReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    setSubmitting(true);
    try {
      const updates = {};
      ids.forEach((id) => {
        const item = purchaseData.find((p) => getRowId(p) === id);
        const pcs  = item?.PCS || 0;
        updates[id] = mode === 'pass'
          ? { approvedQty: pcs, rejectedQty: 0, reason: qcReason.trim() || 'QC Passed', status: 'Approved', savedAt: new Date() }
          : { approvedQty: 0, rejectedQty: pcs, reason: qcReason.trim(), status: 'Rejected', savedAt: new Date() };
      });

      await Promise.all(
        ids.map((id) =>
          axios.post(`${DIA_API}/saveQCCheck`, {
            purchaseId: id,
            ...updates[id],
            updatedBy: user?.name || 'QC Officer',
          })
        )
      );

      setQcData((prev) => ({ ...prev, ...updates }));
      setSelectedIds(new Set());
      closeQCModal();
    } catch (err) {
      console.error('QC save error:', err);
      alert('Failed to save QC. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" /> QC Check Report
          </h2>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={fetchPurchaseEntries}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={() => openQCAction('pass', [...selectedIds])}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" /> QC Pass ({selectedIds.size})
                </button>
                <button
                  onClick={() => openQCAction('reject', [...selectedIds])}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" /> Reject ({selectedIds.size})
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <div className="relative">
                <select
                  value={filters.supplierName}
                  onChange={(e) => setFilters({ ...filters, supplierName: e.target.value, invoiceNumber: '' })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <div className="relative">
                <select
                  value={filters.invoiceNumber}
                  onChange={(e) => setFilters({ ...filters, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
                  disabled={!filteredInvoices.length}
                >
                  <option value="">All Invoices</option>
                  {filteredInvoices.map((inv, i) => <option key={i} value={inv}>{inv}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="date" value={filters.fromDate}
                  onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="date" value={filters.toDate}
                  onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QC Status</label>
              <div className="relative">
                <select
                  value={filters.qcStatus}
                  onChange={(e) => setFilters({ ...filters, qcStatus: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Partial">Partial</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <button onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
            {Object.values(filters).some(Boolean) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                <Filter className="w-4 h-4" />
                {filteredData.length} of {purchaseData.length} entries shown
              </div>
            )}
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Entries', val: summary.total,    cls: 'text-indigo-600', bg: 'bg-white' },
            { label: 'Pending',       val: summary.pending,  cls: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: <AlertCircle className="w-3 h-3" /> },
            { label: 'Approved',      val: summary.approved, cls: 'text-green-600',  bg: 'bg-green-50 border-green-200',   icon: <CheckCircle className="w-3 h-3" /> },
            { label: 'Rejected',      val: summary.rejected, cls: 'text-red-600',    bg: 'bg-red-50 border-red-200',       icon: <XCircle className="w-3 h-3" /> },
            { label: 'Partial',       val: summary.partial,  cls: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
          ].map(({ label, val, cls, bg, icon }) => (
            <div key={label} className={`${bg} p-4 rounded-lg shadow-sm border`}>
              <div className={`text-xs font-medium flex items-center gap-1 ${cls} opacity-80`}>
                {icon} {label}
              </div>
              <div className={`text-2xl font-bold ${cls}`}>{val}</div>
            </div>
          ))}
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-xs text-gray-500">Approved / Rejected</div>
            <div className="text-sm font-bold mt-1">
              <span className="text-green-600">{summary.totalApproved} ✓</span>
              {' / '}
              <span className="text-red-600">{summary.totalRejected} ✗</span>
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-lg">Loading data...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h3>
            <p className="text-gray-500">No entries match the current filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected; }}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">#</th>
                    <th className="px-3 py-3 text-left font-semibold">Supplier</th>
                    <th className="px-3 py-3 text-left font-semibold">Invoice</th>
                    <th className="px-3 py-3 text-left font-semibold">Product</th>
                    <th className="px-3 py-3 text-left font-semibold">Design No</th>
                    <th className="px-3 py-3 text-right font-semibold">PCS</th>
                    {/* ─ Weight columns mapped to actual API fields ─ */}
                    <th className="px-3 py-3 text-right font-semibold text-amber-700">
                      Gross Wt (g)
                      <div className="text-[10px] font-normal text-gray-400">GoldPurityWt</div>
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-blue-700">
                      Cent Wt (ct)
                      <div className="text-[10px] font-normal text-gray-400">Σ Diamond Carat</div>
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-indigo-700">
                      Net Wt (g)
                      <div className="text-[10px] font-normal text-gray-400">GNetWt</div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">QC Status</th>
                    {/* <th className="px-3 py-3 text-left font-semibold">Date</th> */}
                    <th className="px-3 py-3 text-center font-semibold">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const id       = getRowId(item);
                    const qc       = qcData[id] || { approvedQty: item.PCS || 0, rejectedQty: 0, reason: '', status: 'Pending' };
                    const isSelected = selectedIds.has(id);
                    const grossWt  = getGrossWt(item);
                    const centWt   = getCentWt(item);
                    const netWt    = getNetWt(item);
                    const rowBg = {
                      Approved: 'bg-green-50',
                      Rejected: 'bg-red-50',
                      Partial:  'bg-blue-50',
                      Pending:  '',
                    }[qc.status] || '';

                    return (
                      <tr
                        key={id}
                        className={`border-b hover:bg-gray-50 transition-colors ${rowBg} ${isSelected ? 'ring-2 ring-inset ring-indigo-300' : ''}`}
                      >
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(id)}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer"
                          />
                        </td>
                        <td className="px-3 py-3 text-gray-500">{index + 1}</td>
                        <td className="px-3 py-3 font-medium">{item.SupplierName || '-'}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{item.invoiceNumber || '-'}</td>
                        <td className="px-3 py-3">{item.ProductName || '-'}</td>
                        <td className="px-3 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
                        <td className="px-3 py-3 text-right font-semibold">{item.PCS || 0}</td>

                        {/* Gross Wt = GoldPurityWt */}
                        <td className="px-3 py-3 text-right font-semibold text-amber-700">
                          {grossWt != null ? fmt3(grossWt) : '-'}
                        </td>

                        {/* Cent Wt = sum of diamond carats */}
                        <td className="px-3 py-3 text-right font-semibold text-blue-700">
                          {centWt != null ? fmt3(centWt) : '-'}
                        </td>

                        {/* Net Wt = GNetWt */}
                        <td className="px-3 py-3 text-right font-semibold text-indigo-700">
                          {netWt != null ? fmt3(netWt) : '-'}
                        </td>

                        {/* QC Status — clickable */}
                        <td className="px-3 py-3 text-center">
                          <QCStatusDropdown
                            status={qc.status || 'Pending'}
                            onPass={()   => openQCAction('pass',   [id])}
                            onReject={()  => openQCAction('reject', [id])}
                          />
                        </td>

                        {/* <td className="px-3 py-3 text-xs text-gray-500">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
                        </td> */}

                        <td className="px-3 py-3 text-center">
                          <button
                            onClick={() => { setSelectedEntry(item); setShowDetailModal(true); }}
                            className="p-1.5 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          QC Action Modal
      ══════════════════════════════════════════════════════ */}
      {qcActionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeQCModal} />
          <div className="relative z-60 w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

            <div className={`p-4 border-b flex justify-between items-center text-white ${
              qcActionModal.mode === 'pass'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {qcActionModal.mode === 'pass'
                  ? <><CheckCircle className="w-5 h-5" /> QC Pass</>
                  : <><XCircle className="w-5 h-5" /> Reject</>
                }
                {qcActionModal.ids.length > 1 && (
                  <span className="ml-1 text-sm font-normal opacity-80">({qcActionModal.ids.length} items)</span>
                )}
              </h3>
              <button onClick={closeQCModal} className="p-2 hover:bg-white/20 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {qcActionModal.mode === 'pass' ? (
                <>
                  <p className="text-sm text-gray-600">
                    Marking <strong>{qcActionModal.ids.length}</strong> item(s) as{' '}
                    <span className="text-green-600 font-semibold">QC Passed</span>. Note is optional.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={qcReason}
                      onChange={(e) => setQcReason(e.target.value)}
                      placeholder="e.g. All items verified and passed..."
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Quick notes:</p>
                    <div className="flex flex-wrap gap-2">
                      {['All items verified', 'Weight matches', 'Hallmark OK', 'Stone setting OK'].map((n) => (
                        <button key={n} onClick={() => setQcReason(n)}
                          className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                            qcReason === n
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600'
                          }`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    <span className="text-red-600 font-semibold">Rejecting</span>{' '}
                    <strong>{qcActionModal.ids.length}</strong> item(s). Reason is <strong>required</strong>.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={qcReason}
                      onChange={(e) => setQcReason(e.target.value)}
                      placeholder="e.g. Surface cracks, weight mismatch, missing hallmark..."
                      className="w-full px-3 py-2 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Quick reasons:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Surface cracks', 'Weight mismatch', 'Missing hallmark', 'Stone setting issue', 'Finishing defect', 'Wrong design'].map((r) => (
                        <button key={r} onClick={() => setQcReason(r)}
                          className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                            qcReason === r
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:text-red-600'
                          }`}
                        >{r}</button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={closeQCModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveQCAction}
                disabled={submitting || (qcActionModal.mode === 'reject' && !qcReason.trim())}
                className={`px-5 py-2 text-white rounded-lg flex items-center gap-2 text-sm disabled:opacity-60 ${
                  qcActionModal.mode === 'pass'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {submitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : qcActionModal.mode === 'pass'
                    ? <CheckCircle className="w-4 h-4" />
                    : <XCircle className="w-4 h-4" />
                }
                {qcActionModal.mode === 'pass' ? 'Confirm Pass' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          Detail Modal
      ══════════════════════════════════════════════════════ */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDetailModal(false)} />
          <div className="relative z-60 w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <div>
                <h3 className="text-xl font-bold">Purchase Entry Details</h3>
                <p className="text-xs opacity-80">{selectedEntry.SupplierName} — {selectedEntry.invoiceNumber}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-auto flex-1 space-y-6">

              {/* Basic Info */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {[
                    ['Supplier Name',  selectedEntry.SupplierName],
                    ['Supplier Code',  selectedEntry.suppCode],
                    ['Invoice Number', selectedEntry.invoiceNumber],
                    ['Product Name',   selectedEntry.ProductName],
                    ['Design No',      selectedEntry.DesignNo],
                    ['Metal Type',     selectedEntry.MetalType],
                    ['Weight Mode',    selectedEntry.WtMode],
                    ['PCS',            selectedEntry.PCS],
                    ['HUID',           selectedEntry.HUID],
                    ['IGI Summary No', selectedEntry.IgiSummaryNo],
                    ['PGI UIN No',     selectedEntry.PgiUinNo !== '0' ? selectedEntry.PgiUinNo : '-'],
                    ['Created At',     selectedEntry.createdAt ? new Date(selectedEntry.createdAt).toLocaleString('en-IN') : '-'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      <div className="mt-1 p-2 bg-gray-50 rounded border">{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Weight Details (corrected field mapping) ── */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-amber-600 border-b pb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5" /> Weight Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {/* Gross Wt = GoldPurityWt */}
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Gross Wt (g)</div>
                    <div className="text-[10px] text-gray-400 mb-1">field: GoldPurityWt</div>
                    <div className="p-2 bg-amber-50 rounded border font-bold text-lg text-amber-700">
                      {fmt3(selectedEntry.GoldPurityWt)}
                    </div>
                  </div>
                  {/* Cent Wt = sum of diamond carats */}
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Cent Wt (ct)</div>
                    <div className="text-[10px] text-gray-400 mb-1">field: Σ diamonds.Carat</div>
                    <div className="p-2 bg-blue-50 rounded border font-bold text-lg text-blue-700">
                      {fmt3(getCentWt(selectedEntry))}
                    </div>
                  </div>
                  {/* Net Wt = GNetWt */}
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Net Wt (g)</div>
                    <div className="text-[10px] text-gray-400 mb-1">field: GNetWt</div>
                    <div className="p-2 bg-indigo-50 rounded border font-bold text-lg text-indigo-700">
                      {fmt3(selectedEntry.GNetWt)}
                    </div>
                  </div>
                </div>
              </section>

              {/* Gold Details */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    ['Gold Karat',       selectedEntry.GCarat + 'K'],
                    ['Gold Weight (g)',  fmt3(selectedEntry.GoldWt)],
                    ['Gold Purity (%)',  selectedEntry.GoldPurity + '%'],
                    ['Purity Wt (g)',    fmt3(selectedEntry.GoldPurityWt)],
                    ['999 Rate (₹/g)',   fmtCur(selectedEntry.Gold999Rate)],
                    ['Gold Value (₹)',   fmtCur(selectedEntry.GoldValue)],
                    ['MC Type',          selectedEntry.GoMcType],
                    ['MC Rate / Amt',    `${fmtCur(selectedEntry.GoMcRate)} / ${fmtCur(selectedEntry.GoMcAmount)}`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      <div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Charges: Certification & Hallmark */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-teal-600 border-b pb-2">Certification & Hallmark</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    ['Cert Type',        selectedEntry.CertType],
                    ['Cert Qty',         selectedEntry.CertQty],
                    ['Cert Rate',        fmtCur(selectedEntry.CertRate)],
                    ['Cert Total (₹)',   fmtCur(selectedEntry.CertTotal)],
                    ['HM Type',          selectedEntry.HallMarkType],
                    ['HM Qty',           selectedEntry.HMQty],
                    ['HM Rate',          fmtCur(selectedEntry.HMRate)],
                    ['HM Total (₹)',     fmtCur(selectedEntry.HMTotal)],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      <div className="mt-1 p-2 bg-teal-50 rounded border">{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* QC Status */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-orange-600 border-b pb-2 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" /> QC Status
                </h4>
                {(() => {
                  const id = getRowId(selectedEntry);
                  const qc = qcData[id] || {};
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-gray-500">Approved Qty</div>
                        <div className="mt-1 p-2 bg-green-50 rounded border font-bold text-green-700 text-lg">{qc.approvedQty ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Rejected Qty</div>
                        <div className="mt-1 p-2 bg-red-50 rounded border font-bold text-red-700 text-lg">{qc.rejectedQty ?? '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Status</div>
                        <div className="mt-1 p-2 bg-gray-50 rounded border">
                          <StatusBadge status={qc.status || 'Pending'} />
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Reason / Note</div>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">{qc.reason || selectedEntry.RejectionReason || '—'}</div>
                      </div>
                    </div>
                  );
                })()}
              </section>

              {/* Diamonds */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2 flex items-center gap-2">
                  <Diamond className="w-5 h-5" /> Diamonds
                </h4>
                {(() => {
                  const diamonds = parseStones(selectedEntry.diamonds);
                  if (!diamonds.length)
                    return <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">No diamond details</div>;
                  const totalCarat = diamonds.reduce((s, d) => s + Number(d.Carat || 0), 0);
                  const totalValue = diamonds.reduce((s, d) => s + Number(d.Value || 0), 0);
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border">
                        <thead className="bg-blue-50">
                          <tr>
                            {['Shape', 'Stones', 'Carat', 'Weight (g)', 'Rate (₹)', 'Value (₹)'].map((h) => (
                              <th key={h} className="px-3 py-2 text-right border first:text-left font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {diamonds.map((d, i) => (
                            <tr key={i} className="hover:bg-blue-50">
                              <td className="px-3 py-2 border capitalize">{d.DiamondShape || '-'}</td>
                              <td className="px-3 py-2 text-right border">{d.NoOfStones || 0}</td>
                              <td className="px-3 py-2 text-right border text-blue-700 font-semibold">{fmt3(d.Carat)}</td>
                              <td className="px-3 py-2 text-right border">{fmt3(d.Weight)}</td>
                              <td className="px-3 py-2 text-right border">{fmtCur(d.Rate)}</td>
                              <td className="px-3 py-2 text-right border font-bold text-blue-700">{fmtCur(d.Value)}</td>
                            </tr>
                          ))}
                          <tr className="bg-blue-100 font-bold">
                            <td className="px-3 py-2 border" colSpan={2}>Total</td>
                            <td className="px-3 py-2 text-right border text-blue-800">{fmt3(totalCarat)}</td>
                            <td className="px-3 py-2 border" />
                            <td className="px-3 py-2 border" />
                            <td className="px-3 py-2 text-right border text-blue-800">{fmtCur(totalValue)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </section>

              {/* ColorStones */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-purple-600 border-b pb-2 flex items-center gap-2">
                  <Gem className="w-5 h-5" /> ColorStones
                </h4>
                {(() => {
                  const cs = parseStones(selectedEntry.colorstones);
                  if (!cs.length)
                    return <div className="text-center py-4 text-gray-400 bg-gray-50 rounded">No colorstone details</div>;
                  const totalCarat = cs.reduce((s, c) => s + Number(c.Carat || 0), 0);
                  const totalValue = cs.reduce((s, c) => s + Number(c.Value || 0), 0);
                  return (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm border">
                        <thead className="bg-purple-50">
                          <tr>
                            {['Shape/Type', 'Stones', 'Carat', 'Weight (g)', 'Rate (₹)', 'Value (₹)'].map((h) => (
                              <th key={h} className="px-3 py-2 text-right border first:text-left font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {cs.map((c, i) => (
                            <tr key={i} className="hover:bg-purple-50">
                              <td className="px-3 py-2 border">{c.csShape || '-'}</td>
                              <td className="px-3 py-2 text-right border">{c.NoOfStones || 0}</td>
                              <td className="px-3 py-2 text-right border text-purple-700 font-semibold">{fmt3(c.Carat)}</td>
                              <td className="px-3 py-2 text-right border">{fmt3(c.Weight)}</td>
                              <td className="px-3 py-2 text-right border">{fmtCur(c.Rate)}</td>
                              <td className="px-3 py-2 text-right border font-bold text-purple-700">{fmtCur(c.Value)}</td>
                            </tr>
                          ))}
                          <tr className="bg-purple-100 font-bold">
                            <td className="px-3 py-2 border" colSpan={2}>Total</td>
                            <td className="px-3 py-2 text-right border text-purple-800">{fmt3(totalCarat)}</td>
                            <td className="px-3 py-2 border" />
                            <td className="px-3 py-2 border" />
                            <td className="px-3 py-2 text-right border text-purple-800">{fmtCur(totalValue)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </section>

              {/* Totals */}
              <section>
                <h4 className="text-lg font-semibold mb-3 text-green-600 border-b pb-2">Invoice Totals</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    ['Total Value',   fmtCur(selectedEntry.TotalValue),   'bg-green-50'],
                    ['GST (₹)',        fmtCur(selectedEntry.GST),           'bg-green-50'],
                    ['Cert Tax',       fmtCur(selectedEntry.certTaxAmt),    'bg-teal-50'],
                    ['HM Tax',         fmtCur(selectedEntry.HmTaxAmt),      'bg-teal-50'],
                  ].map(([label, val, bg]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500">{label}</div>
                      <div className={`mt-1 p-2 ${bg} rounded border font-semibold`}>{val}</div>
                    </div>
                  ))}
                  <div className="md:col-span-4">
                    <div className="text-xs text-gray-500">Grand Total</div>
                    <div className="mt-1 p-3 bg-green-100 rounded border font-bold text-xl text-green-700">
                      {fmtCur(selectedEntry.GrandTotal)}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QCCheckReport;

