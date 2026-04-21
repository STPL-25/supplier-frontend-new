import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Loader2, RefreshCw, Printer, ArrowUp, ArrowDown,
  FileText, Calendar, Filter, ChevronDown, ChevronUp, Paperclip, Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { API } from '../../config/configData';
import { DashBoardContext } from '../../DashBoardContext/DashBoardContext';

const fmt = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return d; }
};

const cur = (v) =>
  `₹${parseFloat(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const toInput = (d) => {
  if (!d) return '';
  try { return new Date(d).toISOString().slice(0, 10); } catch { return ''; }
};

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

const STATUS_CFG = {
  pending:      { label: 'Pending',      bg: 'bg-amber-100 text-amber-800'  },
  acknowledged: { label: 'Acknowledged', bg: 'bg-blue-100 text-blue-800'   },
  disputed:     { label: 'Disputed',     bg: 'bg-red-100 text-red-800'     },
  settled:      { label: 'Settled',      bg: 'bg-green-100 text-green-800' },
};

// ─── Component ────────────────────────────────────────────────────────────────
const DebitCreditReport = () => {
  const { userRole, mobileNo, suppCode, companyName, user } = useContext(DashBoardContext);
  const isSupplier = userRole === 'Supplier';

  // Filters
  const [fromDate,      setFromDate]      = useState(monthStart());
  const [toDate,        setToDate]        = useState(today());
  const [filterType,    setFilterType]    = useState('all');  // all | debit | credit
  const [filterStatus,  setFilterStatus]  = useState('all');
  const [supplierSearch,setSupplierSearch]= useState('');

  // Data
  const [notes,     setNotes]     = useState([]);
  const [suppliers, setSuppliers] = useState([]);   // for a/c exec dropdown
  const [isLoading, setIsLoading] = useState(false);

  // Expand row to see reasons
  const [expanded, setExpanded] = useState(null);

  const printRef = useRef(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = { fromDate, toDate };
      if (filterType   !== 'all') params.noteType = filterType;
      if (filterStatus !== 'all') params.status   = filterStatus;
      if (isSupplier) {
        if (suppCode) params.suppCode = suppCode;
        if (mobileNo) params.mobileNo = mobileNo;
      } else if (supplierSearch.trim()) {
        params.supplierSearch = supplierSearch.trim();
      }

      const res  = await axios.get(`${API}/debit-credit-notes/report`, { params });
      const data = res.data?.notes || res.data?.result || [];
      setNotes(Array.isArray(data) ? data : []);

      // Populate supplier list for admin
      if (!isSupplier && res.data?.suppliers) {
        setSuppliers(res.data.suppliers);
      }
    } catch {
      toast.error('Failed to load report data.');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);  // fetch on mount; user triggers re-fetch via button

  // ── Totals ────────────────────────────────────────────────────────────────
  const totals = notes.reduce(
    (acc, n) => {
      acc.debit  += parseFloat(n.debitTotal  || 0);
      acc.credit += parseFloat(n.creditTotal || 0);
      acc.net    += parseFloat(n.netTotal    || 0);
      return acc;
    },
    { debit: 0, credit: 0, net: 0 }
  );

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Debit & Credit Note Report</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
        h2   { text-align: center; margin-bottom: 4px; }
        .sub { text-align: center; color: #555; margin-bottom: 12px; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th    { background: #1e293b; color: #fff; padding: 6px 8px; text-align: left; font-size: 11px; }
        td    { padding: 5px 8px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
        .debit  { color: #15803d; font-weight: 700; }
        .credit { color: #dc2626; font-weight: 700; }
        tfoot td { font-weight: 700; background: #f1f5f9; border-top: 2px solid #94a3b8; }
        @media print { button { display: none; } }
      </style></head><body>
      <h2>Debit &amp; Credit Note Report</h2>
      <div class="sub">
        ${isSupplier ? companyName || user : 'All Suppliers'} &nbsp;|&nbsp;
        ${fmt(fromDate)} – ${fmt(toDate)}
        ${filterType !== 'all' ? ` | ${filterType === 'debit' ? 'Debit Notes' : 'Credit Notes'}` : ''}
      </div>
      ${content}
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Debit &amp; Credit Note Report</h1>
            <p className="text-sm text-slate-500">
              {isSupplier
                ? `${companyName || user} · Your notes summary`
                : 'All suppliers · Full note history'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={!notes.length}>
              <Printer className="h-4 w-4 mr-1.5" />Print
            </Button>
            <Button variant="outline" size="sm" onClick={fetchReport} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-1.5 hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <Card className="mb-5 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 items-end">
              {/* Date range */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">From</Label>
                <Input
                  type="date" value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-8 text-sm w-36"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">To</Label>
                <Input
                  type="date" value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-8 text-sm w-36"
                />
              </div>

              {/* Note type */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Type</Label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-8 text-sm border border-slate-200 rounded-md px-2 bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="debit">Debit Notes</option>
                  <option value="credit">Credit Notes</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <Label className="text-xs text-slate-500">Status</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-8 text-sm border border-slate-200 rounded-md px-2 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="disputed">Disputed</option>
                  <option value="settled">Settled</option>
                </select>
              </div>

              {/* Supplier search — only for a/c exec */}
              {!isSupplier && (
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500">Supplier</Label>
                  <Input
                    placeholder="Name / code…"
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    className="h-8 text-sm w-44"
                  />
                </div>
              )}

              <Button size="sm" className="h-8" onClick={fetchReport} disabled={isLoading}>
                <Filter className="h-3.5 w-3.5 mr-1.5" />Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary tiles ── */}
        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Notes',   value: notes.length,                               color: 'text-slate-700',  bg: 'bg-white'    },
              { label: 'Total Debit',   value: cur(totals.debit),                          color: 'text-green-700',  bg: 'bg-green-50' },
              { label: 'Total Credit',  value: cur(totals.credit),                         color: 'text-red-700',    bg: 'bg-red-50'   },
              {
                label: 'Net Balance',
                value: cur(Math.abs(totals.net)),
                sub:   totals.net >= 0 ? 'Net Debit' : 'Net Credit',
                color: totals.net >= 0 ? 'text-green-700' : 'text-red-700',
                bg:    totals.net >= 0 ? 'bg-green-50'   : 'bg-red-50',
              },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-xl p-3 border border-slate-200`}>
                <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                <p className={`font-bold text-lg leading-tight ${item.color}`}>{item.value}</p>
                {item.sub && <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>}
              </div>
            ))}
          </div>
        )}

        {/* ── Table (printable) ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-slate-600">Loading report…</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No notes found for the selected filters.</p>
            <Button variant="ghost" size="sm" className="mt-3" onClick={fetchReport}>
              <RefreshCw className="h-4 w-4 mr-1" />Try again
            </Button>
          </div>
        ) : (
          <Card className="shadow-sm">
            <div ref={printRef}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide w-8">#</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Note ID</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Invoice No</th>
                      {!isSupplier && (
                        <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Supplier</th>
                      )}
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Date</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Reasons</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Status</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Debit (₹)</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Credit (₹)</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wide">Net (₹)</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wide w-10">Docs</th>
                      <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wide w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {notes.map((note, idx) => {
                      const id       = note.id || note.noteId;
                      const isOpen   = expanded === id;
                      const reasons  = note.reasons || [];
                      const docs     = note.documents || [];
                      const net      = parseFloat(note.netTotal || 0);
                      const statusCf = STATUS_CFG[note.status] || STATUS_CFG.pending;

                      return (
                        <React.Fragment key={id}>
                          <tr
                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${isOpen ? 'bg-indigo-50' : ''}`}
                            onClick={() => setExpanded(isOpen ? null : id)}
                          >
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">#{id}</td>
                            <td className="px-4 py-3 text-slate-700">{note.billNo}</td>
                            {!isSupplier && (
                              <td className="px-4 py-3 text-slate-700">
                                <div className="font-medium">{note.supplierName}</div>
                                {note.supplierCode && (
                                  <div className="text-xs text-slate-400">{note.supplierCode}</div>
                                )}
                              </td>
                            )}
                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{fmt(note.createdAt)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {reasons.slice(0, 2).map((r, i) => (
                                  <Badge
                                    key={i}
                                    className={`text-xs ${
                                      r.noteType === 'debit'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {r.noteType === 'debit'
                                      ? <ArrowUp className="h-2.5 w-2.5 mr-0.5 inline" />
                                      : <ArrowDown className="h-2.5 w-2.5 mr-0.5 inline" />}
                                    {r.reasonTitle}
                                  </Badge>
                                ))}
                                {reasons.length > 2 && (
                                  <Badge className="text-xs bg-slate-100 text-slate-600">
                                    +{reasons.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge className={`text-xs ${statusCf.bg}`}>{statusCf.label}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-green-700">
                              {parseFloat(note.debitTotal || 0) > 0 ? cur(note.debitTotal) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-semibold text-red-700">
                              {parseFloat(note.creditTotal || 0) > 0 ? cur(note.creditTotal) : <span className="text-slate-300">—</span>}
                            </td>
                            <td className={`px-4 py-3 text-right font-mono font-bold ${net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                              {cur(Math.abs(net))}
                              <span className="text-xs font-normal ml-1 text-slate-400">
                                {net >= 0 ? 'Dr' : 'Cr'}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              {docs.length > 0 && (
                                <span className="inline-flex items-center gap-0.5 text-xs text-slate-500">
                                  <Paperclip className="h-3 w-3" />{docs.length}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-3 text-center">
                              {isOpen
                                ? <ChevronUp className="h-4 w-4 text-slate-400 mx-auto" />
                                : <ChevronDown className="h-4 w-4 text-slate-400 mx-auto" />}
                            </td>
                          </tr>

                          {/* Expanded reason / doc detail */}
                          {isOpen && (
                            <tr className="bg-indigo-50">
                              <td colSpan={!isSupplier ? 12 : 11} className="px-6 pb-4 pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">

                                  {/* Reasons */}
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                      Reason Breakdown
                                    </p>
                                    <div className="space-y-1.5">
                                      {reasons.map((r, i) => (
                                        <div
                                          key={i}
                                          className={`flex items-center justify-between rounded p-2 text-sm ${
                                            r.noteType === 'debit' ? 'bg-green-50' : 'bg-red-50'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            {r.noteType === 'debit'
                                              ? <ArrowUp className="h-3.5 w-3.5 text-green-600" />
                                              : <ArrowDown className="h-3.5 w-3.5 text-red-600" />}
                                            <span className="font-medium text-slate-700">{r.reasonTitle}</span>
                                          </div>
                                          <span className={`font-bold text-sm ${
                                            r.noteType === 'debit' ? 'text-green-700' : 'text-red-700'
                                          }`}>{cur(r.amount)}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {note.reasonText && (
                                      <div className="mt-3">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Narration</p>
                                        <p className="text-xs text-slate-600 bg-white rounded p-2 border border-slate-200 italic">
                                          {note.reasonText}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Documents */}
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                      Documents {docs.length > 0 ? `(${docs.length})` : '—'}
                                    </p>
                                    {docs.length === 0 ? (
                                      <p className="text-xs text-slate-400 italic">No documents attached</p>
                                    ) : (
                                      <div className="space-y-1.5">
                                        {docs.map((doc, i) => (
                                          <div
                                            key={i}
                                            className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-1.5"
                                          >
                                            <div className="flex items-center gap-2 min-w-0">
                                              <Paperclip className="h-3 w-3 text-slate-400 shrink-0" />
                                              <span className="text-xs text-slate-700 truncate">{doc.fileName || doc.name}</span>
                                              {doc.uploadedBy === 'supplier' && (
                                                <Badge className="text-xs bg-blue-100 text-blue-700 shrink-0">Supplier</Badge>
                                              )}
                                              {doc.uploadedBy === 'admin' && (
                                                <Badge className="text-xs bg-purple-100 text-purple-700 shrink-0">A/C Exec</Badge>
                                              )}
                                            </div>
                                            {doc.url && (
                                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm" className="h-6 px-1.5 text-slate-400 hover:text-blue-600">
                                                  <Eye className="h-3.5 w-3.5" />
                                                </Button>
                                              </a>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>

                  {/* Footer totals */}
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-400">
                      <td colSpan={!isSupplier ? 7 : 6}
                        className="px-4 py-3 font-bold text-slate-800 text-right text-sm">
                        Totals ({notes.length} notes)
                      </td>
                      <td className="px-4 py-3 text-right font-bold font-mono text-green-700">
                        {cur(totals.debit)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold font-mono text-red-700">
                        {cur(totals.credit)}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold font-mono ${totals.net >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {cur(Math.abs(totals.net))}
                        <span className="text-xs font-normal ml-1">{totals.net >= 0 ? 'Dr' : 'Cr'}</span>
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};

export default DebitCreditReport;
