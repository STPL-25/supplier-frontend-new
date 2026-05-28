

import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet, Filter, RefreshCw, Loader2, Eye, X,
  ChevronDown, CheckCircle, XCircle, ClipboardList,
  AlertCircle, Save, Diamond, Gem, Scale,
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

const fmt3   = (v) => (v != null && v !== '' ? Number(v).toFixed(3) : '-');
const fmtCur = (v) =>
  `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const getGrossWt = (item) => {
  const g  = Number(item.GoldWt       || 0);
  const pl = Number(item.PlatinumWt   || 0);
  const cs = Number(item.ColorStoneWt || 0);
  const dw = Number(item.DiamondWt    || 0);
  const total = g + pl + cs + dw;
  return total > 0 ? total : null;
};

const getCentWt = (item) => {
  try {
    const diamonds =
      item.diamonds && item.diamonds !== '[]' ? JSON.parse(item.diamonds) : [];
    const total = diamonds.reduce((sum, d) => sum + Number(d.Carat || 0), 0);
    return total > 0 ? total : null;
  } catch {
    return null;
  }
};

const getNetWt = (item) => {
  const g  = Number(item.GoldWt     || 0);
  const pl = Number(item.PlatinumWt || 0);
  const total = g + pl;
  return total > 0 ? total : null;
};

// ─── Status Badge ────────────────────────────────────────────
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

// ─── Per-row QC Status Dropdown ──────────────────────────────
const QCStatusDropdown = ({ status, onPass, onReject, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (disabled) return <StatusBadge status={status} />;

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

// ─── Bulk QC Dropdown ────────────────────────────────────────
const BulkQCDropdown = ({ count, onPass, onReject }) => {
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
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
      >
        <ClipboardList className="w-4 h-4" />
        QC Action ({count})
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute z-50 top-10 right-0 min-w-[170px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
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

// ─── QC Defects Multi-Select (grouped by category, from API) ─
// defectGroups: [{ Category, Status, Defects[] }]
// mode: 'pass' (Status='A') | 'reject' (Status='R')
// selected: string[] of selected defect strings
// onChange: (newSelected: string[]) => void
const QCDefectsSelect = ({ defectGroups, mode, selected, onChange, loading }) => {
  const statusFilter = mode === 'pass' ? 'A' : 'R';
  const filtered     = defectGroups.filter((g) => g.Status === statusFilter);

  const toggle = (defect) => {
    const next = selected.includes(defect)
      ? selected.filter((x) => x !== defect)
      : [...selected, defect];
    onChange(next);
  };

  const toggleCategory = (defects) => {
    const allSelected = defects.every((d) => selected.includes(d));
    if (allSelected) {
      onChange(selected.filter((x) => !defects.includes(x)));
    } else {
      const toAdd = defects.filter((d) => !selected.includes(d));
      onChange([...selected, ...toAdd]);
    }
  };

  // Deduplicate defects within each category
  const dedupe = (arr) => [...new Set(arr)];

  const activeColor   = mode === 'pass' ? 'text-green-700' : 'text-red-700';
  const headingBg     = mode === 'pass' ? 'bg-green-50 border-green-200'  : 'bg-red-50 border-red-200';
  const checkColor    = mode === 'pass' ? 'accent-green-600' : 'accent-red-600';
  const chipActive    = mode === 'pass' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500';
  const chipInactive  = mode === 'pass'
    ? 'bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-700'
    : 'bg-white text-gray-600 border-gray-300 hover:border-red-400 hover:text-red-700';

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading defect options...
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="py-4 text-center text-gray-400 text-sm bg-gray-50 rounded-lg border">
        No defect categories available.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
      {filtered.map((group) => {
        const uniqueDefects    = dedupe(group.Defects || []);
        const allCatSelected   = uniqueDefects.every((d) => selected.includes(d));
        const someCatSelected  = uniqueDefects.some((d) => selected.includes(d)) && !allCatSelected;

        return (
          <div key={group.Category} className={`rounded-lg border ${headingBg}`}>
            {/* Category Header */}
            <div
              className={`flex items-center gap-2 px-3 py-2 border-b ${headingBg} rounded-t-lg cursor-pointer select-none`}
              onClick={() => toggleCategory(uniqueDefects)}
            >
              <input
                type="checkbox"
                checked={allCatSelected}
                ref={(el) => { if (el) el.indeterminate = someCatSelected; }}
                onChange={() => toggleCategory(uniqueDefects)}
                onClick={(e) => e.stopPropagation()}
                className={`w-4 h-4 ${checkColor}`}
              />
              <span className={`text-sm font-semibold ${activeColor}`}>
                {group.Category}
              </span>
              <span className="ml-auto text-xs text-gray-400">
                {uniqueDefects.filter((d) => selected.includes(d)).length}/{uniqueDefects.length}
              </span>
            </div>

            {/* Defect Chips */}
            <div className="flex flex-wrap gap-2 p-3">
              {uniqueDefects.map((defect) => (
                <button
                  key={defect}
                  type="button"
                  onClick={() => toggle(defect)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                    selected.includes(defect) ? chipActive : chipInactive
                  }`}
                >
                  {defect}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────
const QCCheckReport = () => {
  const { user } = useContext(DashBoardContext);

  const [purchaseData, setPurchaseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [suppliers, setSuppliers]       = useState([]);
  const [filters, setFilters]           = useState({ supplierName: '' });

  const [scanValue, setScanValue]         = useState('');
  const [committedScan, setCommittedScan] = useState('');
  const invoiceInputRef = useRef(null);
  const scanBuffer      = useRef('');
  const scanTimer       = useRef(null);
  const lastKeyTime     = useRef(0);

  const [qcData, setQcData]           = useState({});
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry]     = useState(null);

  const [qcActionModal, setQcActionModal] = useState({ open: false, mode: 'pass', ids: [] });
  const [qcChips, setQcChips]             = useState([]);
  const [qcNote, setQcNote]               = useState('');

  // ── QC Defects from API ───────────────────────────────────
  const [defectGroups, setDefectGroups]         = useState([]);
  const [defectsLoading, setDefectsLoading]     = useState(false);

const fetchQCDefects = async () => {
  setDefectsLoading(true);
  try {
    const res        = await axios.get(`${DIA_API}/get_qc_defects`);
    const jsonString = res.data?.qcCheckDetails?.JsonResult;

    if (!jsonString) { setDefectGroups([]); return; }

    const parsed = JSON.parse(jsonString);
    setDefectGroups(parsed?.QCDefects || []);
  } catch (err) {
    // console.error('Failed to fetch QC defects:', err);
    setDefectGroups([]);
  } finally {
    setDefectsLoading(false);
  }
};

  // console.log(defectGroups)

  useEffect(() => { fetchQCDefects(); }, []);

  // ── Helpers ──────────────────────────────────────────────
  const parseStones = (s) => {
    try { return !s || s === '[]' ? [] : JSON.parse(s); }
    catch { return []; }
  };

  const getRowId = (item) =>
    item.id ?? item.purchaseId ?? (item.invoiceNumber + '_' + item.DesignNo);

  const buildReasonPayload = () => {
    const reasons = [...qcChips];
    const note    = qcNote.trim();
    const display = note ? [...reasons, note].join(', ') : reasons.join(', ');
    return { reasons, note, display };
  };

  const getRowStatus = (id) => (qcData[id] || {}).status || 'Pending';
  const isPending    = (id) => {
    const s = getRowStatus(id);
    return s !== 'Approved' && s !== 'Rejected';
  };

  // ── Fetch Purchase Entries ────────────────────────────────
  const fetchPurchaseEntries = async () => {
    setLoading(true);
    try {
      const res  = await axios.get(`${DIA_API}/getPurchaseEntries_for_qc`);
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
              reasons:     [],
              note:        item.RejectionReason || '',
              display:     item.RejectionReason || '',
              status:      item.PurchaseStatus || item.SupplierStatus || 'Pending',
              savedAt:     null,
            };
          }
        });
        return next;
      });
    } catch (err) {
      // console.error('Fetch error:', err);
      setPurchaseData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPurchaseEntries(); }, []);

  useEffect(() => {
    if (!purchaseData.length) return;
    setSuppliers(
      [...new Set(purchaseData.map((i) => i.SupplierName).filter(Boolean))].sort()
    );
  }, [purchaseData]);

  useEffect(() => { applyFilters(); }, [filters, committedScan, purchaseData]);

  // ── Filter Logic ─────────────────────────────────────────
  const applyFilters = () => {
    let f = [...purchaseData];
    if (filters.supplierName)
      f = f.filter((i) => i.SupplierName === filters.supplierName);
    if (committedScan.trim())
      f = f.filter((i) =>
        (i.invoiceNumber || '').toLowerCase().includes(committedScan.trim().toLowerCase())
      );
    setFilteredData(f);
    const visibleIds = new Set(f.map((i) => getRowId(i)));
    setSelectedIds((prev) => new Set([...prev].filter((id) => visibleIds.has(id))));
  };

  const resetFilters = () => {
    setFilters({ supplierName: '' });
    setScanValue('');
    setCommittedScan('');
    scanBuffer.current = '';
    clearTimeout(scanTimer.current);
  };

  // ── Scanner Handler ───────────────────────────────────────
  const SCAN_THRESHOLD      = 50;
  const SCAN_COMPLETE_DELAY = 80;
  const MANUAL_DEBOUNCE     = 600;

  const handleScanKeyDown = (e) => {
    const now = Date.now();
    const gap = now - lastKeyTime.current;
    lastKeyTime.current = now;
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(scanTimer.current);
      const val = invoiceInputRef.current?.value || scanValue;
      setScanValue(val);
      setCommittedScan(val);
      scanBuffer.current = '';
      return;
    }
    if (e.key === 'Backspace') {
      clearTimeout(scanTimer.current);
      scanTimer.current = setTimeout(() => {
        const val = invoiceInputRef.current?.value || '';
        setCommittedScan(val);
      }, MANUAL_DEBOUNCE);
      return;
    }
    if (e.key.length === 1) {
      clearTimeout(scanTimer.current);
      const delay = gap < SCAN_THRESHOLD ? SCAN_COMPLETE_DELAY : MANUAL_DEBOUNCE;
      scanTimer.current = setTimeout(() => {
        const val = invoiceInputRef.current?.value || '';
        setScanValue(val);
        setCommittedScan(val);
        scanBuffer.current = '';
      }, delay);
    }
  };

  const clearScan = () => {
    setScanValue('');
    setCommittedScan('');
    scanBuffer.current = '';
    clearTimeout(scanTimer.current);
    invoiceInputRef.current?.focus();
  };

  // ── Summary ──────────────────────────────────────────────
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

  // ── Multi-Select (ONLY Pending/Partial rows) ─────────────
  const pendingIds   = filteredData.map((i) => getRowId(i)).filter(isPending);
  const allSelected  = pendingIds.length > 0 && pendingIds.every((id) => selectedIds.has(id));
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleSelect = (id) => {
    if (!isPending(id)) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        pendingIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  // ── QC Action ────────────────────────────────────────────
  const openQCAction = (mode, ids) => {
    setQcChips([]);
    setQcNote('');
    setQcActionModal({ open: true, mode, ids });
  };

  const closeQCModal = () => {
    setQcActionModal({ open: false, mode: 'pass', ids: [] });
    setQcChips([]);
    setQcNote('');
  };

  const saveQCAction = async () => {
    const { mode, ids } = qcActionModal;
    const { reasons, note, display } = buildReasonPayload();

    if (mode === 'reject' && reasons.length === 0) {
      alert('Please select at least one rejection reason.');
      return;
    }

    setSubmitting(true);
    try {
      const updates = {};
      ids.forEach((id) => {
        const item = purchaseData.find((p) => getRowId(p) === id);
        const pcs  = item?.PCS || 0;
        updates[id] = mode === 'pass'
          ? {
              approvedQty: pcs,
              rejectedQty: 0,
              reasons:     reasons.length > 0 ? reasons : ['QC Passed'],
              note,
              display:     display || 'QC Passed',
              status:      'Approved',
              savedAt:     new Date(),
            }
          : {
              approvedQty: 0,
              rejectedQty: pcs,
              reasons,
              note,
              display,
              status:  'Rejected',
              savedAt: new Date(),
            };
      });

      const payload = ids.map((id) => ({
        purchaseId:  id,
        approvedQty: updates[id].approvedQty,
        rejectedQty: updates[id].rejectedQty,
        reasons:     Array.isArray(updates[id].reasons)
                       ? updates[id].reasons
                       : (updates[id].reasons || '').split(',').map((s) => s.trim()).filter(Boolean),
        note:        updates[id].note,
        status:      updates[id].status,
        updatedBy:   user,
      }));

      const response = await axios.post(`${DIA_API}/saveQCCheck`, { items: payload });
      // console.log(response);

      setQcData((prev) => ({ ...prev, ...updates }));
      setSelectedIds(new Set());
      closeQCModal();
    } catch (err) {
      // console.error('QC save error:', err);
      alert('Failed to save QC. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" /> QC Check Report
          </h2>
          <button
            onClick={fetchPurchaseEntries}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <div className="relative">
                <select
                  value={filters.supplierName}
                  onChange={(e) => setFilters({ ...filters, supplierName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10 text-sm"
                >
                  <option value="">All Suppliers</option>
                  {suppliers.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                Invoice Number
                <span className="text-xs font-normal text-indigo-500">Scan or type</span>
              </label>
              <div className="relative flex items-center">
                <input
                  ref={invoiceInputRef}
                  type="text"
                  value={scanValue}
                  onChange={(e) => setScanValue(e.target.value)}
                  onKeyDown={handleScanKeyDown}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Scan barcode or type invoice no..."
                  className="w-full pl-9 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                />
                {scanValue && (
                  <button
                    onClick={clearScan}
                    className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {committedScan && (
                <p className="mt-1 text-xs text-indigo-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Filtering by: <span className="font-semibold">{committedScan}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
            {(filters.supplierName || committedScan) && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm">
                <Filter className="w-4 h-4" />
                {filteredData.length} of {purchaseData.length} entries shown
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Entries', val: summary.total,    cls: 'text-indigo-600', bg: 'bg-white' },
            { label: 'Pending',       val: summary.pending,  cls: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', icon: <AlertCircle className="w-3 h-3" /> },
            { label: 'Approved',      val: summary.approved, cls: 'text-green-600',  bg: 'bg-green-50 border-green-200',   icon: <CheckCircle className="w-3 h-3" /> },
            { label: 'Rejected',      val: summary.rejected, cls: 'text-red-600',    bg: 'bg-red-50 border-red-200',       icon: <XCircle className="w-3 h-3" /> },
            { label: 'Partial',       val: summary.partial,  cls: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200' },
          ].map(({ label, val, cls, bg, icon }) => (
            <div key={label} className={`${bg} p-4 rounded-lg shadow-sm border`}>
              <div className={`text-xs font-medium flex items-center gap-1 ${cls} opacity-80`}>{icon} {label}</div>
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

        {/* Table */}
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
                        disabled={pendingIds.length === 0}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold">#</th>
                    <th className="px-3 py-3 text-left font-semibold">Supplier</th>
                    <th className="px-3 py-3 text-left font-semibold">Invoice</th>
                    <th className="px-3 py-3 text-left font-semibold">Product</th>
                    <th className="px-3 py-3 text-left font-semibold">Design No</th>
                    <th className="px-3 py-3 text-right font-semibold">PCS</th>
                    <th className="px-3 py-3 text-right font-semibold text-amber-700">
                      Gross Wt (g)
                      <div className="text-[10px] font-normal text-gray-400">Gold+Plat+CS+Dia</div>
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-blue-700">
                      Cent Wt (ct)
                      <div className="text-[10px] font-normal text-gray-400">Σ Diamond Carat</div>
                    </th>
                    <th className="px-3 py-3 text-right font-semibold text-indigo-700">
                      Net Wt (g)
                      <div className="text-[10px] font-normal text-gray-400">Gold+Plat only</div>
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">
                      {selectedIds.size > 0 ? (
                        <BulkQCDropdown
                          count={selectedIds.size}
                          onPass={() => openQCAction('pass', [...selectedIds])}
                          onReject={() => openQCAction('reject', [...selectedIds])}
                        />
                      ) : 'QC Status'}
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => {
                    const id         = getRowId(item);
                    const qc         = qcData[id] || {
                      approvedQty: item.PCS || 0,
                      rejectedQty: 0,
                      reasons: [],
                      note: '',
                      display: '',
                      status: item.PurchaseStatus || item.SupplierStatus || 'Pending',
                    };
                    const isSelected  = selectedIds.has(id);
                    const isProcessed = qc.status === 'Approved' || qc.status === 'Rejected';
                    const grossWt     = getGrossWt(item);
                    const centWt      = getCentWt(item);
                    const netWt       = getNetWt(item);
                    const rowBg = { Approved: 'bg-green-50', Rejected: 'bg-red-50', Partial: 'bg-blue-50', Pending: '' }[qc.status] || '';

                    return (
                      <tr
                        key={id}
                        className={`border-b hover:bg-gray-50 transition-colors ${rowBg} ${isSelected ? 'ring-2 ring-inset ring-indigo-300' : ''}`}
                      >
                        <td className="px-3 py-3 text-center">
                          {isProcessed ? (
                            <span className="inline-block w-4 h-4" />
                          ) : (
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(id)}
                              className="w-4 h-4 accent-indigo-600 cursor-pointer"
                            />
                          )}
                        </td>
                        <td className="px-3 py-3 text-gray-500">{index + 1}</td>
                        <td className="px-3 py-3 font-medium">{item.SupplierName || '-'}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{item.invoiceNumber || '-'}</td>
                        <td className="px-3 py-3">{item.ProductName || '-'}</td>
                        <td className="px-3 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
                        <td className="px-3 py-3 text-right font-semibold">{item.PCS || 0}</td>
                        <td className="px-3 py-3 text-right font-semibold text-amber-700">
                          {grossWt != null ? fmt3(grossWt) : '-'}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-blue-700">
                          {centWt != null ? fmt3(centWt) : '-'}
                        </td>
                        <td className="px-3 py-3 text-right font-semibold text-indigo-700">
                          {netWt != null ? fmt3(netWt) : '-'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <QCStatusDropdown
                            status={qc.status || 'Pending'}
                            onPass={() => openQCAction('pass', [id])}
                            onReject={() => openQCAction('reject', [id])}
                            disabled={isProcessed}
                          />
                        </td>
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

      {/* ── QC Action Modal ─────────────────────────────────── */}
      {qcActionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={closeQCModal} />
          <div className="relative z-60 w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className={`p-4 border-b flex justify-between items-center text-white ${
              qcActionModal.mode === 'pass'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <h3 className="text-lg font-bold flex items-center gap-2">
                {qcActionModal.mode === 'pass'
                  ? <><CheckCircle className="w-5 h-5" /> QC Pass</>
                  : <><XCircle className="w-5 h-5" /> Reject</>}
                {qcActionModal.ids.length > 1 && (
                  <span className="ml-1 text-sm font-normal opacity-80">
                    ({qcActionModal.ids.length} items)
                  </span>
                )}
              </h3>
              <button onClick={closeQCModal} className="p-2 hover:bg-white/20 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-gray-600">
                {qcActionModal.mode === 'pass' ? (
                  <>Marking <strong>{qcActionModal.ids.length}</strong> item(s) as{' '}
                  <span className="text-green-600 font-semibold">QC Passed</span>.
                  Select pass notes (optional).</>
                ) : (
                  <><span className="text-red-600 font-semibold">Rejecting</span>{' '}
                  <strong>{qcActionModal.ids.length}</strong> item(s).
                  Select defect reason(s) — <strong>required</strong>.</>
                )}
              </p>

              {/* ── Defects Grouped by Category ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {qcActionModal.mode === 'pass' ? 'Pass Notes' : 'Rejection Defects'}
                  {qcActionModal.mode === 'reject' && <span className="text-red-500 ml-1">*</span>}
                  <span className="text-gray-400 text-xs font-normal ml-1">(select multiple)</span>
                </label>

                <QCDefectsSelect
                  defectGroups={defectGroups}
                  mode={qcActionModal.mode}
                  selected={qcChips}
                  onChange={setQcChips}
                  loading={defectsLoading}
                />
              </div>

              {/* Selected Summary */}
              {qcChips.length > 0 && (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border text-xs text-gray-600 break-words">
                  <span className="font-semibold text-gray-500">Selected ({qcChips.length}): </span>
                  {qcChips.join(', ')}
                </div>
              )}

              {/* Additional Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Note <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={qcNote}
                  onChange={(e) => setQcNote(e.target.value)}
                  placeholder={
                    qcActionModal.mode === 'pass'
                      ? 'e.g. All items verified...'
                      : 'e.g. Batch rejected due to supplier error...'
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-none ${
                    qcActionModal.mode === 'pass'
                      ? 'focus:ring-green-400'
                      : 'border-red-200 focus:ring-red-400'
                  }`}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeQCModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveQCAction}
                disabled={submitting || (qcActionModal.mode === 'reject' && qcChips.length === 0)}
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
                    : <XCircle className="w-4 h-4" />}
                {qcActionModal.mode === 'pass' ? 'Confirm Pass' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────── */}
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
              <section>
                <h4 className="text-lg font-semibold mb-3 text-amber-600 border-b pb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5" /> Weight Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Gross Wt (g)</div>
                    <div className="p-2 bg-amber-50 rounded border font-bold text-lg text-amber-700">{fmt3(getGrossWt(selectedEntry))}</div>
                    <div className="mt-1 grid grid-cols-2 gap-1 text-[10px] text-gray-500">
                      <span>Gold: {fmt3(selectedEntry.GoldWt)}</span>
                      <span>Platinum: {fmt3(selectedEntry.PlatinumWt)}</span>
                      <span>ColorStone: {fmt3(selectedEntry.ColorStoneWt)}</span>
                      <span>Diamond: {fmt3(selectedEntry.DiamondWt)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Cent Wt (ct)</div>
                    <div className="p-2 bg-blue-50 rounded border font-bold text-lg text-blue-700">{fmt3(getCentWt(selectedEntry))}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium">Net Wt (g)</div>
                    <div className="p-2 bg-indigo-50 rounded border font-bold text-lg text-indigo-700">{fmt3(getNetWt(selectedEntry))}</div>
                  </div>
                </div>
              </section>
              <section>
                <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    ['Gold Karat',      selectedEntry.GCarat + 'K'],
                    ['Gold Weight (g)', fmt3(selectedEntry.GoldWt)],
                    ['Gold Purity (%)', selectedEntry.GoldPurity + '%'],
                    ['Purity Wt (g)',   fmt3(selectedEntry.GoldPurityWt)],
                    ['999 Rate (₹/g)',  fmtCur(selectedEntry.Gold999Rate)],
                    ['Gold Value (₹)',  fmtCur(selectedEntry.GoldValue)],
                    ['MC Type',         selectedEntry.GoMcType],
                    ['MC Rate / Amt',   `${fmtCur(selectedEntry.GoMcRate)} / ${fmtCur(selectedEntry.GoMcAmount)}`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      <div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>

              {(selectedEntry.PlatinumWt > 0 || selectedEntry.PTWt > 0 || selectedEntry.PTValue > 0 || selectedEntry.PTPurity) && (
                <section>
                  <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Platinum Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {[
                      ['Platinum Purity (%)', selectedEntry.PTPurity ? `${selectedEntry.PTPurity}%` : '-'],
                      ['Platinum Weight (g)', fmt3(selectedEntry.PlatinumWt || selectedEntry.PTWt)],
                      ['Platinum Rate',       fmtCur(selectedEntry.PT999Rate || selectedEntry.PTRate || selectedEntry.PTRatePer)],
                      ['Platinum Value (₹)',  fmtCur(selectedEntry.PTValue || selectedEntry.PlatinumValue)],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div className="text-xs text-gray-500 font-medium">{label}</div>
                        <div className="mt-1 p-2 bg-gray-50 rounded border font-semibold">{val || '-'}</div>
                      </div>
                    ))}
                  </div>

                  {(selectedEntry.PTMcType || selectedEntry.PTMcRate || selectedEntry.PTMcAmount) && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {[
                        ['Platinum MC Type',   selectedEntry.PTMcType || '-'],
                        ['Platinum MC Rate',   fmtCur(selectedEntry.PTMcRate)],
                        ['Platinum MC Amount', fmtCur(selectedEntry.PTMcAmount)],
                      ].map(([label, val]) => (
                        <div key={label}>
                          <div className="text-xs text-gray-500 font-medium">{label}</div>
                          <div className="mt-1 p-2 bg-gray-50 rounded border font-semibold">{val || '-'}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section>
                <h4 className="text-lg font-semibold mb-3 text-teal-600 border-b pb-2">Certification & Hallmark</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {[
                    ['Cert Type', selectedEntry.CertType],
                    ['Cert Qty',  selectedEntry.CertQty],
                    ['Cert Rate', fmtCur(selectedEntry.CertRate)],
                    ['Cert Total (₹)', fmtCur(selectedEntry.CertTotal)],
                    ['HM Type',  selectedEntry.HallMarkType],
                    ['HM Qty',   selectedEntry.HMQty],
                    ['HM Rate',  fmtCur(selectedEntry.HMRate)],
                    ['HM Total (₹)', fmtCur(selectedEntry.HMTotal)],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-xs text-gray-500 font-medium">{label}</div>
                      <div className="mt-1 p-2 bg-teal-50 rounded border">{val || '-'}</div>
                    </div>
                  ))}
                </div>
              </section>
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
                        <div className="mt-1 p-2 bg-gray-50 rounded border"><StatusBadge status={qc.status || 'Pending'} /></div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Reason(s)</div>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-xs">{qc.display || selectedEntry.RejectionReason || '—'}</div>
                      </div>
                    </div>
                  );
                })()}
              </section>
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
                              <td className="px-3 py-2 text-right border">{fmtCur(d.Value)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-blue-50 font-semibold">
                          <tr>
                            <td className="px-3 py-2 border" colSpan={2}>Total</td>
                            <td className="px-3 py-2 text-right border text-blue-700">{fmt3(totalCarat)}</td>
                            <td className="px-3 py-2 border" colSpan={2} />
                            <td className="px-3 py-2 text-right border">{fmtCur(totalValue)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  );
                })()}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QCCheckReport;
