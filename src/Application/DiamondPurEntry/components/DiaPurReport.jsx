

import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  FileSpreadsheet,
  Filter,
  Calendar,
  RefreshCw,
  Loader2,
  Eye,
  X,
  ChevronDown,
  Diamond,
  Gem,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Download
} from 'lucide-react';
import { DIA_API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import DiamondPDF from '../constants/DiaDealerReceipt';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver'; // npm install file-saver

// ─── QC Config ───────────────────────────────────────────────────────────────
const QC_STATUS_CONFIG = {
  P: { label: 'Pending',  icon: <Clock className="w-3 h-3" />,        badgeClass: 'bg-yellow-100 text-yellow-700 border border-yellow-300', rowClass: '' },
  A: { label: 'QC Pass',  icon: <CheckCircle2 className="w-3 h-3" />, badgeClass: 'bg-green-100 text-green-700 border border-green-300',   rowClass: 'bg-green-50/30' },
  R: { label: 'QC Fail',  icon: <XCircle className="w-3 h-3" />,      badgeClass: 'bg-red-100 text-red-700 border border-red-300',         rowClass: 'bg-red-50/30' },
};
const getQCConfig = (status) => QC_STATUS_CONFIG[status] || {
  label: status || '-', icon: <AlertCircle className="w-3 h-3" />,
  badgeClass: 'bg-gray-100 text-gray-600 border border-gray-300', rowClass: ''
};

// ─── QC Badge ─────────────────────────────────────────────────────────────────
const QCBadge = React.memo(({ status, reason, showReason = false }) => {
  const cfg = getQCConfig(status);
  return (
    <div className="flex flex-col gap-1 items-start">
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badgeClass}`}>
        {cfg.icon} {cfg.label}
      </span>
      {showReason && status === 'R' && reason && (
        <span className="text-xs text-red-600 italic max-w-[160px] leading-tight">⚠ {reason}</span>
      )}
    </div>
  );
});

// ─── Debounce Hook ───────────────────────────────────────────────────────────
const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

// ─── Row component (memoized to skip re-renders) ─────────────────────────────
const TableRow = React.memo(({ item, index, onView, parseStones }) => {
  const diamonds    = parseStones(item.diamonds);
  const colorstones = parseStones(item.colorstones);
  const diamondStones = diamonds.reduce((s, d) => s + (d.NoOfStones || 0), 0);
  const diamondCarat  = diamonds.reduce((s, d) => s + (d.Carat || 0), 0);
  const diamondValue  = diamonds.reduce((s, d) => s + (d.Value || 0), 0);
  const csStones = colorstones.reduce((s, c) => s + (c.NoOfStones || 0), 0);
  const csCarat  = colorstones.reduce((s, c) => s + (c.Carat || 0), 0);
  const csValue  = colorstones.reduce((s, c) => s + (c.Value || 0), 0);
  const rowBg = getQCConfig(item.SupplierStatus).rowClass;

  return (
    <tr className={`border-b hover:bg-gray-50 ${rowBg}`}>
      <td className="px-4 py-3">{index + 1}</td>
      <td className="px-4 py-3">{item.SupplierName || '-'}</td>
      <td className="px-4 py-3 text-xs">{item.invoiceNumber || '-'}</td>
      <td className="px-4 py-3">{item.ProductName || '-'}</td>
      <td className="px-4 py-3 font-mono text-xs">{item.DesignNo || '-'}</td>
      <td className="px-4 py-3 text-right">{item.PCS || 0}</td>
      <td className="px-4 py-3 text-right">{(item.GoldWt || 0).toFixed(3)}</td>
      <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondStones}</td>
      <td className="px-4 py-3 text-right text-blue-700 font-medium">{diamondCarat.toFixed(3)}</td>
      <td className="px-4 py-3 text-right text-blue-700">₹{diamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
      <td className="px-4 py-3 text-right text-purple-700 font-medium">{csStones}</td>
      <td className="px-4 py-3 text-right text-purple-700 font-medium">{csCarat.toFixed(3)}</td>
      <td className="px-4 py-3 text-right text-purple-700">₹{csValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
      <td className="px-4 py-3 text-right font-semibold">₹{(item.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 3 })}</td>
      <td className="px-4 py-3 text-center">
        <QCBadge status={item.SupplierStatus} reason={item.RejectionReason} showReason />
      </td>
      <td className="px-4 py-3 text-xs">
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : '-'}
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={() => onView(item)}
          className="px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-1 mx-auto text-xs transition-colors"
        >
          <Eye className="w-3 h-3" /> View
        </button>
      </td>
    </tr>
  );
});

// ─────────────────────────────────────────────────────────────────────────────

const PurchaseReport = () => {
  const { user, companyName } = useContext(DashBoardContext);
  const [purchaseData, setPurchaseData]       = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry]     = useState(null);
  const [pdfGenerating, setPdfGenerating]     = useState(false);

  const [suppliers, setSuppliers]               = useState([]);
  const [invoices, setInvoices]                 = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [filters, setFilters] = useState({
    supplierName:   '',
    invoiceNumber:  '',
    supplierStatus: '',
    fromDate:       '',
    toDate:         ''
  });

  // ── Debounce date inputs so filtering doesn't fire on every character ──────
  const debouncedFilters = useDebounce(filters, 250);

  // ─── Parse stones (stable reference) ──────────────────────────────────────
  const parseStones = useCallback((stonesString) => {
    try {
      if (!stonesString || stonesString === '[]') return [];
      return JSON.parse(stonesString);
    } catch {
      return [];
    }
  }, []);

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => { fetchPurchaseEntries(); }, []);

  const fetchPurchaseEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${DIA_API}/getPurchaseEntries`);
      const data = response.data.result[0] || [];
      setPurchaseData(data);
    } catch (error) {
      // console.error('Error fetching purchase entries:', error);
      setPurchaseData([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Build supplier list (memoized) ───────────────────────────────────────
  const suppliers_memo = useMemo(() => (
    [...new Set(purchaseData.map(i => i.SupplierName).filter(Boolean))].sort()
  ), [purchaseData]);

  const invoices_memo = useMemo(() => (
    [...new Set(purchaseData.map(i => i.invoiceNumber).filter(Boolean))].sort()
  ), [purchaseData]);

  useEffect(() => {
    setSuppliers(suppliers_memo);
    setInvoices(invoices_memo);
    setFilteredInvoices(invoices_memo);
  }, [suppliers_memo, invoices_memo]);

  // ─── Filter invoices by supplier (memoized) ───────────────────────────────
  const computedFilteredInvoices = useMemo(() => {
    if (!filters.supplierName) return invoices_memo;
    return [...new Set(
      purchaseData
        .filter(i => i.SupplierName === filters.supplierName)
        .map(i => i.invoiceNumber)
        .filter(Boolean)
    )].sort();
  }, [filters.supplierName, purchaseData, invoices_memo]);

  useEffect(() => {
    setFilteredInvoices(computedFilteredInvoices);
    if (filters.invoiceNumber && !computedFilteredInvoices.includes(filters.invoiceNumber)) {
      setFilters(prev => ({ ...prev, invoiceNumber: '', supplierStatus: '' }));
    }
  }, [computedFilteredInvoices]);

  // ─── Reset QC when invoice cleared ────────────────────────────────────────
  useEffect(() => {
    if (!filters.invoiceNumber) {
      setFilters(prev => ({ ...prev, supplierStatus: '' }));
    }
  }, [filters.invoiceNumber]);

  // ─── MAIN FILTER — pure useMemo, no setState, no useEffect ───────────────
  // Uses debounced filters so date typing doesn't thrash
  const filteredData = useMemo(() => {
    let data = purchaseData;

    if (debouncedFilters.supplierName) {
      data = data.filter(i => i.SupplierName === debouncedFilters.supplierName);
    }
    if (debouncedFilters.invoiceNumber) {
      data = data.filter(i => i.invoiceNumber === debouncedFilters.invoiceNumber);
    }
    if (debouncedFilters.invoiceNumber && debouncedFilters.supplierStatus) {
      data = data.filter(i => i.SupplierStatus === debouncedFilters.supplierStatus);
    }
    if (debouncedFilters.fromDate) {
      const from = new Date(debouncedFilters.fromDate).getTime();
      data = data.filter(i => i.createdAt && new Date(i.createdAt).getTime() >= from);
    }
    if (debouncedFilters.toDate) {
      const to = new Date(debouncedFilters.toDate);
      to.setHours(23, 59, 59, 999);
      const toTime = to.getTime();
      data = data.filter(i => i.createdAt && new Date(i.createdAt).getTime() <= toTime);
    }

    return data;
  }, [debouncedFilters, purchaseData]);

  // ─── Summary (memoized) ───────────────────────────────────────────────────
  const summary = useMemo(() => {
    let totalDiamondCarat = 0, totalDiamondValue = 0, totalDiamondStones = 0;
    let totalColorStoneCarat = 0, totalColorStoneValue = 0, totalColorStoneStones = 0;
    let totalGoldWeight = 0, totalPlatinumWeight = 0, totalValue = 0;
    const supplierSet = new Set(), invoiceSet = new Set();
    let qcPass = 0, qcFail = 0, qcPending = 0;

    for (const item of filteredData) {
      totalGoldWeight     += item.GoldWt     || 0;
      totalPlatinumWeight += item.PTWt       || 0;
      totalValue          += item.GrandTotal || 0;
      if (item.SupplierName)   supplierSet.add(item.SupplierName);
      if (item.invoiceNumber)  invoiceSet.add(item.invoiceNumber);

      if      (item.SupplierStatus === 'A') qcPass++;
      else if (item.SupplierStatus === 'R') qcFail++;
      else                                   qcPending++;

      try {
        const diamonds = item.diamonds && item.diamonds !== '[]'
          ? JSON.parse(item.diamonds) : [];
        for (const d of diamonds) {
          totalDiamondStones += d.NoOfStones || 0;
          totalDiamondCarat  += d.Carat      || 0;
          totalDiamondValue  += d.Value      || 0;
        }
      } catch {}

      try {
        const colorstones = item.colorstones && item.colorstones !== '[]'
          ? JSON.parse(item.colorstones) : [];
        for (const c of colorstones) {
          totalColorStoneStones += c.NoOfStones || 0;
          totalColorStoneCarat  += c.Carat      || 0;
          totalColorStoneValue  += c.Value      || 0;
        }
      } catch {}
    }

    return {
      totalEntries: filteredData.length,
      totalGoldWeight, totalPlatinumWeight,
      totalDiamondStones, totalDiamondCarat, totalDiamondValue,
      totalColorStoneStones, totalColorStoneCarat, totalColorStoneValue,
      totalValue,
      uniqueSuppliers: supplierSet.size,
      uniqueInvoices:  invoiceSet.size,
      qcPass, qcFail, qcPending
    };
  }, [filteredData]);

  // ─── PDF Generation — ONLY on button click, using current filteredData ────
  const handleExportPDF = async () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }

    setPdfGenerating(true);
    try {
      // Transform data at click time
      const pdfData = filteredData.map(item => {
        const diamonds    = parseStones(item.diamonds);
        const colorstones = parseStones(item.colorstones);
        return {
          ...item,
          Diamonds: diamonds.map(d => ({
            ShapeShortName: d.DiamondShape || '',
            NoOfStones: d.NoOfStones || 0,
            Carat: d.Carat || 0,
            Rate: d.Rate || 0,
            Value: d.Value || 0
          })),
          ColorStones: colorstones.map(c => ({
            ShapeShortName: c.csShape || '',
            Pcs: c.NoOfStones || 0,
            csCarat: c.Carat || 0,
            csRate: c.Rate || 0,
            Amount: c.Value || 0
          })),
          GNetWt: item.GoldWt || 0,
          PNetWt: item.PTWt || 0,
          GoldPurity: item.GoldPurity || item.GCarat || '',
          PTPurity: item.PTPurity || ''
        };
      });

      // Generate filename
      const supplierName = filteredData[0]?.SupplierName || 'Supplier';
      const invoiceNumber = filteredData[0]?.invoiceNumber || 'Invoice';
      const fileName = `Diamond_Receipt_${supplierName}-${invoiceNumber}.pdf`;

      // Generate PDF blob
      const blob = await pdf(<DiamondPDF data={pdfData} />).toBlob();
      
      // Download using file-saver
      saveAs(blob, fileName);

    } catch (error) {
      // console.error('Error generating PDF:', error);
      alert('Failed to generate PDF');
    } finally {
      setPdfGenerating(false);
    }
  };

  // ─── Stable callbacks ──────────────────────────────────────────────────────
  const viewEntryDetails = useCallback((entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  }, []);

  const handleSupplierChange = useCallback((e) => {
    setFilters(prev => ({ ...prev, supplierName: e.target.value, invoiceNumber: '', supplierStatus: '' }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ supplierName: '', invoiceNumber: '', supplierStatus: '', fromDate: '', toDate: '' });
  }, []);

  const isFiltered = filters.supplierName || filters.invoiceNumber || filters.supplierStatus || filters.fromDate || filters.toDate;

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6" /> Purchase Report
          </h2>
          <div className="flex gap-3">
            <button onClick={fetchPurchaseEntries} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            {filteredData.length > 0 && filters.invoiceNumber && (
              <button
                onClick={handleExportPDF}
                disabled={pdfGenerating}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export to PDF
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

            {/* Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <div className="relative">
                <select value={filters.supplierName} onChange={handleSupplierChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10">
                  <option value="">All Suppliers</option>
                  {suppliers.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Invoice */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
                {filters.supplierName && <span className="text-xs text-gray-500 ml-1">({filteredInvoices.length})</span>}
              </label>
              <div className="relative">
                <select
                  value={filters.invoiceNumber}
                  onChange={(e) => setFilters(prev => ({ ...prev, invoiceNumber: e.target.value, supplierStatus: '' }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white pr-10"
                  disabled={filteredInvoices.length === 0}
                >
                  <option value="">{filters.supplierName ? 'All Invoices (for selected supplier)' : 'All Invoices'}</option>
                  {filteredInvoices.map((inv, i) => <option key={i} value={inv}>{inv}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* QC — only after invoice selected */}
            {filters.invoiceNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> QC Status
                </label>
                <div className="relative">
                  <select
                    value={filters.supplierStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, supplierStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white pr-10"
                  >
                    <option value="">All QC Status</option>
                    <option value="P"> Pending</option>
                    <option value="A"> QC Pass</option>
                    <option value="R"> QC Fail</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="date" value={filters.fromDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
                <input type="date" value={filters.toDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          {/* Filter actions */}
          <div className="flex gap-3 flex-wrap items-center">
            <button onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors">
              <RefreshCw className="w-4 h-4" /> Reset Filters
            </button>
            {isFiltered && (
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">{filteredData.length} of {purchaseData.length} entries shown</span>
              </div>
            )}
            {filters.supplierStatus && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getQCConfig(filters.supplierStatus).badgeClass}`}>
                {getQCConfig(filters.supplierStatus).icon} QC: {getQCConfig(filters.supplierStatus).label}
                <button onClick={() => setFilters(prev => ({ ...prev, supplierStatus: '' }))} className="ml-1 opacity-70 hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Total Entries</div><div className="text-2xl font-bold text-indigo-600">{summary.totalEntries}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Suppliers</div><div className="text-2xl font-bold text-blue-600">{summary.uniqueSuppliers}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Invoices</div><div className="text-2xl font-bold text-green-600">{summary.uniqueInvoices}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Gold Wt (g)</div><div className="text-2xl font-bold text-yellow-600">{summary.totalGoldWeight.toFixed(3)}</div></div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg shadow-sm border border-green-200"><div className="flex items-center gap-2 text-sm text-green-700 font-medium"><CheckCircle2 className="w-4 h-4" /> QC Pass</div><div className="text-2xl font-bold text-green-700">{summary.qcPass}</div></div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg shadow-sm border border-red-200"><div className="flex items-center gap-2 text-sm text-red-700 font-medium"><XCircle className="w-4 h-4" /> QC Fail</div><div className="text-2xl font-bold text-red-700">{summary.qcFail}</div></div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg shadow-sm border border-yellow-200"><div className="flex items-center gap-2 text-sm text-yellow-700 font-medium"><Clock className="w-4 h-4" /> QC Pending</div><div className="text-2xl font-bold text-yellow-700">{summary.qcPending}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Platinum Wt (g)</div><div className="text-2xl font-bold text-gray-600">{summary.totalPlatinumWeight.toFixed(3)}</div></div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200"><div className="flex items-center gap-2 text-sm text-blue-700 font-medium"><Diamond className="w-4 h-4" /> Diamond Stones</div><div className="text-2xl font-bold text-blue-700">{summary.totalDiamondStones}</div></div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200"><div className="flex items-center gap-2 text-sm text-blue-700 font-medium"><Diamond className="w-4 h-4" /> Diamond Carat</div><div className="text-2xl font-bold text-blue-700">{summary.totalDiamondCarat.toFixed(3)}</div></div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm border border-blue-200"><div className="flex items-center gap-2 text-sm text-blue-700 font-medium"><Diamond className="w-4 h-4" /> Diamond Value (₹)</div><div className="text-xl font-bold text-blue-700">{summary.totalDiamondValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Total Value (₹)</div><div className="text-xl font-bold text-emerald-600">{summary.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div></div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200"><div className="flex items-center gap-2 text-sm text-purple-700 font-medium"><Gem className="w-4 h-4" /> CS Stones</div><div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneStones}</div></div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200"><div className="flex items-center gap-2 text-sm text-purple-700 font-medium"><Gem className="w-4 h-4" /> CS Carat</div><div className="text-2xl font-bold text-purple-700">{summary.totalColorStoneCarat.toFixed(3)}</div></div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg shadow-sm border border-purple-200"><div className="flex items-center gap-2 text-sm text-purple-700 font-medium"><Gem className="w-4 h-4" /> CS Value (₹)</div><div className="text-xl font-bold text-purple-700">{summary.totalColorStoneValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div></div>
          <div className="bg-white p-4 rounded-lg shadow-sm border"><div className="text-sm text-gray-600">Grand Total (₹)</div><div className="text-xl font-bold text-emerald-600">{summary.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div></div>
        </div> */}

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
            <p className="text-gray-500">{purchaseData.length === 0 ? 'No purchase entries available.' : 'No entries match the selected filters.'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Sno</th>
                    <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                    <th className="px-4 py-3 text-left font-semibold">Invoice</th>
                    <th className="px-4 py-3 text-left font-semibold">Product</th>
                    <th className="px-4 py-3 text-left font-semibold">Design No</th>
                    <th className="px-4 py-3 text-right font-semibold">Pcs</th>
                    <th className="px-4 py-3 text-right font-semibold">Gold Wt</th>
                    <th className="px-4 py-3 text-right font-semibold">Stones</th>
                    <th className="px-4 py-3 text-right font-semibold">Carat</th>
                    <th className="px-4 py-3 text-right font-semibold">Value</th>
                    <th className="px-4 py-3 text-right font-semibold">Stones</th>
                    <th className="px-4 py-3 text-right font-semibold">Carat</th>
                    <th className="px-4 py-3 text-right font-semibold">Value</th>
                    <th className="px-4 py-3 text-right font-semibold">Grand Total</th>
                    <th className="px-4 py-3 text-center font-semibold">QC Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      item={item}
                      index={index}
                      onView={viewEntryDetails}
                      parseStones={parseStones}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal — keeping your existing modal code */}
      {showDetailModal && selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowDetailModal(false)} />
          <div className="relative z-60 w-full max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <h3 className="text-xl font-bold">Purchase Entry Details</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-white/20 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-auto flex-1">
              <div className="space-y-6">

                <section>
                  <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="text-xs text-gray-600 font-medium">Supplier Name</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.SupplierName || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Invoice Number</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.invoiceNumber || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Supplier Code</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.suppCode || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Product Name</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.ProductName || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Design No</label><div className="mt-1 p-2 bg-gray-50 rounded border font-mono">{selectedEntry.DesignNo || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Metal Type</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.MetalType || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Weight Mode</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.WtMode || '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Pieces</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.PCS || 0}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">HUID</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.HUID || '-'}</div></div>
                  </div>
                </section>

                <section>
                  <h4 className="text-lg font-semibold mb-3 text-indigo-600 border-b pb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> QC Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="text-xs text-gray-600 font-medium">QC Status</label><div className="mt-1 p-2 bg-gray-50 rounded border"><QCBadge status={selectedEntry.SupplierStatus} /></div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Action Date</label><div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{selectedEntry.ActionDate ? new Date(selectedEntry.ActionDate).toLocaleString('en-IN') : '-'}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Processed By</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.processedBy || '-'}</div></div>
                    {selectedEntry.SupplierStatus === 'R' && (
                      <div className="md:col-span-3">
                        <label className="text-xs text-gray-600 font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> Rejection Reason</label>
                        <div className="mt-1 p-3 bg-red-50 rounded border border-red-200 text-red-700 font-medium">{selectedEntry.RejectionReason || 'No reason provided'}</div>
                      </div>
                    )}
                  </div>
                </section>

                {(selectedEntry.GoldWt > 0 || selectedEntry.GoldValue > 0) && (
                  <section>
                    <h4 className="text-lg font-semibold mb-3 text-yellow-600 border-b pb-2">Gold Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div><label className="text-xs text-gray-600 font-medium">Gold Karat</label><div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GCarat || 0}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Gold Weight (g)</label><div className="mt-1 p-2 bg-yellow-50 rounded border">{(selectedEntry.GoldWt || 0).toFixed(3)}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Gold Purity</label><div className="mt-1 p-2 bg-yellow-50 rounded border">{selectedEntry.GoldPurity || 0}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Gold Value</label><div className="mt-1 p-2 bg-yellow-50 rounded border font-semibold">₹{(selectedEntry.GoldValue || 0).toFixed(2)}</div></div>
                    </div>
                  </section>
                )}

                {(selectedEntry.PTWt > 0 || selectedEntry.PTValue > 0 || selectedEntry.PTPurity) && (
                  <section>
                    <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Platinum Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div><label className="text-xs text-gray-600 font-medium">Platinum Purity</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.PTPurity || '-'}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Platinum Weight (g)</label><div className="mt-1 p-2 bg-gray-50 rounded border">{(selectedEntry.PTWt || 0).toFixed(3)}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Platinum Rate</label><div className="mt-1 p-2 bg-gray-50 rounded border">₹{(selectedEntry.PT999Rate || selectedEntry.PTRate || 0).toLocaleString('en-IN')}</div></div>
                      <div><label className="text-xs text-gray-600 font-medium">Platinum Value</label><div className="mt-1 p-2 bg-gray-50 rounded border font-semibold">₹{(selectedEntry.PTValue || 0).toFixed(2)}</div></div>
                    </div>

                    {(selectedEntry.PTMcType || selectedEntry.PTMcRate || selectedEntry.PTMcAmount) && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className="text-xs text-gray-600 font-medium">Platinum MC Type</label><div className="mt-1 p-2 bg-gray-50 rounded border">{selectedEntry.PTMcType || '-'}</div></div>
                        <div><label className="text-xs text-gray-600 font-medium">Platinum MC Rate</label><div className="mt-1 p-2 bg-gray-50 rounded border">₹{(selectedEntry.PTMcRate || 0).toLocaleString('en-IN')}</div></div>
                        <div><label className="text-xs text-gray-600 font-medium">Platinum MC Amount</label><div className="mt-1 p-2 bg-gray-50 rounded border font-semibold">₹{(selectedEntry.PTMcAmount || 0).toLocaleString('en-IN')}</div></div>
                      </div>
                    )}
                  </section>
                )}

                <section>
                  <h4 className="text-lg font-semibold mb-3 text-blue-600 border-b pb-2 flex items-center gap-2"><Diamond className="w-5 h-5" /> Diamonds Details</h4>
                  {(() => {
                    const diamonds = parseStones(selectedEntry.diamonds);
                    return diamonds.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-blue-50"><tr><th className="px-3 py-2 text-left border">Shape</th><th className="px-3 py-2 text-right border">Stones</th><th className="px-3 py-2 text-right border">Carat</th><th className="px-3 py-2 text-right border">Weight (g)</th><th className="px-3 py-2 text-right border">Rate (₹)</th><th className="px-3 py-2 text-right border">Value (₹)</th></tr></thead>
                          <tbody>
                            {diamonds.map((d, idx) => (
                              <tr key={idx} className="hover:bg-blue-50">
                                <td className="px-3 py-2 border">{d.DiamondShape || '-'}</td>
                                <td className="px-3 py-2 text-right border">{d.NoOfStones || 0}</td>
                                <td className="px-3 py-2 text-right border text-blue-700 font-semibold">{(d.Carat || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">{(d.Weight || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">₹{(d.Rate || 0).toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-right border font-bold text-blue-700">₹{(d.Value || 0).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                            <tr className="bg-blue-100 font-bold">
                              <td className="px-3 py-2 border">Total</td>
                              <td className="px-3 py-2 text-right border">{diamonds.reduce((s, d) => s + (d.NoOfStones || 0), 0)}</td>
                              <td className="px-3 py-2 text-right border text-blue-800">{diamonds.reduce((s, d) => s + (d.Carat || 0), 0).toFixed(3)}</td>
                              <td className="px-3 py-2 text-right border">{diamonds.reduce((s, d) => s + (d.Weight || 0), 0).toFixed(3)}</td>
                              <td className="px-3 py-2 border">-</td>
                              <td className="px-3 py-2 text-right border text-blue-800">₹{diamonds.reduce((s, d) => s + (d.Value || 0), 0).toLocaleString('en-IN')}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No diamond details available</div>;
                  })()}
                </section>

                <section>
                  <h4 className="text-lg font-semibold mb-3 text-purple-600 border-b pb-2 flex items-center gap-2"><Gem className="w-5 h-5" /> ColorStones Details</h4>
                  {(() => {
                    const colorstones = parseStones(selectedEntry.colorstones);
                    return colorstones.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border">
                          <thead className="bg-purple-50"><tr><th className="px-3 py-2 text-left border">Shape/Type</th><th className="px-3 py-2 text-right border">Stones</th><th className="px-3 py-2 text-right border">Carat</th><th className="px-3 py-2 text-right border">Weight (g)</th><th className="px-3 py-2 text-right border">Rate (₹)</th><th className="px-3 py-2 text-right border">Value (₹)</th></tr></thead>
                          <tbody>
                            {colorstones.map((c, idx) => (
                              <tr key={idx} className="hover:bg-purple-50">
                                <td className="px-3 py-2 border">{c.csShape || '-'}</td>
                                <td className="px-3 py-2 text-right border">{c.NoOfStones || 0}</td>
                                <td className="px-3 py-2 text-right border text-purple-700 font-semibold">{(c.Carat || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">{(c.Weight || 0).toFixed(3)}</td>
                                <td className="px-3 py-2 text-right border">₹{(c.Rate || 0).toLocaleString('en-IN')}</td>
                                <td className="px-3 py-2 text-right border font-bold text-purple-700">₹{(c.Value || 0).toLocaleString('en-IN')}</td>
                              </tr>
                            ))}
                            <tr className="bg-purple-100 font-bold">
                              <td className="px-3 py-2 border">Total</td>
                              <td className="px-3 py-2 text-right border">{colorstones.reduce((s, c) => s + (c.NoOfStones || 0), 0)}</td>
                              <td className="px-3 py-2 text-right border text-purple-800">{colorstones.reduce((s, c) => s + (c.Carat || 0), 0).toFixed(3)}</td>
                              <td className="px-3 py-2 text-right border">{colorstones.reduce((s, c) => s + (c.Weight || 0), 0).toFixed(3)}</td>
                              <td className="px-3 py-2 border">-</td>
                              <td className="px-3 py-2 text-right border text-purple-800">₹{colorstones.reduce((s, c) => s + (c.Value || 0), 0).toLocaleString('en-IN')}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">No colorstone details available</div>;
                  })()}
                </section>

                <section>
                  <h4 className="text-lg font-semibold mb-3 text-green-600 border-b pb-2">Totals</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="text-xs text-gray-600 font-medium">Total Value</label><div className="mt-1 p-2 bg-green-50 rounded border font-semibold">₹{(selectedEntry.TotalValue || 0).toFixed(2)}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">GST</label><div className="mt-1 p-2 bg-green-50 rounded border">₹{(selectedEntry.GST || 0).toFixed(2)}</div></div>
                    <div><label className="text-xs text-gray-600 font-medium">Grand Total</label><div className="mt-1 p-2 bg-green-100 rounded border font-bold text-lg text-green-700">₹{(selectedEntry.GrandTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div></div>
                  </div>
                </section>

              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReport;
