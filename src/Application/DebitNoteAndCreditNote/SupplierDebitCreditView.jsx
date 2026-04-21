import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  FileText, Upload, X, Loader2, ChevronDown, ChevronUp,
  CheckCircle, Clock, AlertCircle, Eye, Paperclip, RefreshCw,
  ArrowUp, ArrowDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { API } from '../../config/configData';
import { DashBoardContext } from '../../DashBoardContext/DashBoardContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return d; }
};

const formatCurrency = (v) =>
  `₹${parseFloat(v || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const NOTE_TYPE_CFG = {
  debit: {
    label: 'Debit Note',
    Icon: ArrowUp,
    bg: 'bg-green-50',
    border: 'border-green-300',
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700',
  },
  credit: {
    label: 'Credit Note',
    Icon: ArrowDown,
    bg: 'bg-red-50',
    border: 'border-red-300',
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-700',
  },
};

const STATUS_CFG = {
  pending:      { label: 'Pending',      Icon: Clock,         badge: 'bg-amber-100 text-amber-800' },
  acknowledged: { label: 'Acknowledged', Icon: CheckCircle,   badge: 'bg-blue-100 text-blue-800'   },
  disputed:     { label: 'Disputed',     Icon: AlertCircle,   badge: 'bg-red-100 text-red-800'     },
  settled:      { label: 'Settled',      Icon: CheckCircle,   badge: 'bg-green-100 text-green-800' },
};

// ─── Component ────────────────────────────────────────────────────────────────
const SupplierDebitCreditView = () => {
  const { mobileNo, suppCode, companyName } = useContext(DashBoardContext);

  const [notes, setNotes]               = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [expandedNote, setExpandedNote] = useState(null);

  // Upload state
  const [uploadingNoteId, setUploadingNoteId] = useState(null);
  const [uploadFiles, setUploadFiles]         = useState([]);
  const [isUploading, setIsUploading]         = useState(false);

  // Filters
  const [filterType,   setFilterType]   = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm,   setSearchTerm]   = useState('');

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (suppCode) params.suppCode = suppCode;
      if (mobileNo) params.mobileNo = mobileNo;
      const res  = await axios.get(`${API}/debit-credit-notes/supplier`, { params });
      const data = res.data?.notes || res.data?.result || [];
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load notes.');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mobileNo || suppCode) fetchNotes();
  }, [mobileNo, suppCode]);

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = notes.filter((n) => {
    const reasons = n.reasons || [];
    const matchType =
      filterType === 'all' ||
      n.noteType === filterType ||
      reasons.some((r) => r.noteType === filterType);
    const matchStatus  = filterStatus === 'all' || n.status === filterStatus;
    const lower        = searchTerm.toLowerCase();
    const matchSearch  =
      !searchTerm ||
      String(n.noteId || n.id || '').includes(searchTerm) ||
      (n.billNo || '').toLowerCase().includes(lower);
    return matchType && matchStatus && matchSearch;
  });

  // ── Totals ────────────────────────────────────────────────────────────────
  const totals = filtered.reduce(
    (acc, n) => {
      acc.debit  += parseFloat(n.debitTotal  || 0);
      acc.credit += parseFloat(n.creditTotal || 0);
      return acc;
    },
    { debit: 0, credit: 0 }
  );

  // ── Expand / collapse ─────────────────────────────────────────────────────
  const toggleExpand = (id) => {
    setExpandedNote((prev) => {
      if (prev === id) { setUploadingNoteId(null); setUploadFiles([]); return null; }
      return id;
    });
  };

  // ── File handlers ─────────────────────────────────────────────────────────
  const ALLOWED = [
    'application/pdf', 'image/jpeg', 'image/jpg', 'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const valid = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024)    { toast.error(`${f.name} exceeds 5 MB`);      return false; }
      if (!ALLOWED.includes(f.type))   { toast.error(`${f.name} — unsupported type`); return false; }
      return true;
    });
    if (uploadFiles.length + valid.length > 5) {
      toast.error('Maximum 5 documents per upload');
      e.target.value = '';
      return;
    }
    setUploadFiles((prev) => [...prev, ...valid]);
    e.target.value = '';
  };

  const removeFile = (idx) => setUploadFiles((prev) => prev.filter((_, i) => i !== idx));

  const submitUpload = async (noteId) => {
    if (!uploadFiles.length) { toast.error('Select at least one document'); return; }
    setIsUploading(true);
    try {
      const fd = new FormData();
      uploadFiles.forEach((f) => fd.append('supportingDocuments', f, f.name));
      if (suppCode) fd.append('suppCode', suppCode);
      if (mobileNo) fd.append('mobileNo', mobileNo);
      await axios.post(`${API}/debit-credit-notes/${noteId}/documents`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Documents uploaded successfully');
      setUploadFiles([]);
      setUploadingNoteId(null);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // ── Render one note card ──────────────────────────────────────────────────
  const NoteCard = ({ note }) => {
    const id       = note.id || note.noteId;
    const isOpen   = expandedNote === id;
    const isUpload = uploadingNoteId === id;
    const reasons  = note.reasons || [];
    const docs     = note.documents || [];

    const hasDebit  = parseFloat(note.debitTotal  || 0) > 0;
    const hasCredit = parseFloat(note.creditTotal || 0) > 0;
    const dominant  = hasDebit && !hasCredit ? 'debit' : hasCredit && !hasDebit ? 'credit' : null;
    const typeCfg   = dominant ? NOTE_TYPE_CFG[dominant] : null;
    const statusCfg = STATUS_CFG[note.status] || STATUS_CFG.pending;
    const { Icon: StatusIcon } = statusCfg;

    return (
      <Card
        className={`transition-all duration-200 shadow-sm hover:shadow
          ${typeCfg ? `border-l-4 ${typeCfg.border}` : 'border-l-4 border-indigo-300'}
          ${isOpen ? 'shadow-md' : ''}`}
      >
        <CardContent className="p-0">
          {/* ── Summary row ── */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer select-none"
            onClick={() => toggleExpand(id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-2 rounded-lg ${typeCfg ? typeCfg.bg : 'bg-indigo-50'}`}>
                <FileText className={`h-5 w-5 ${typeCfg ? typeCfg.text : 'text-indigo-600'}`} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 text-sm">Note #{id}</span>
                  <Badge className={`text-xs ${statusCfg.badge}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />{statusCfg.label}
                  </Badge>
                  {typeCfg
                    ? <Badge className={`text-xs ${typeCfg.badge}`}>{typeCfg.label}</Badge>
                    : <Badge className="text-xs bg-indigo-100 text-indigo-800">Mixed</Badge>
                  }
                  {docs.length > 0 && (
                    <Badge className="text-xs bg-slate-100 text-slate-600">
                      <Paperclip className="h-2.5 w-2.5 mr-1" />{docs.length} doc{docs.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invoice: <span className="font-medium text-slate-700">{note.billNo}</span>
                  {note.invoiceDate && <>&nbsp;·&nbsp;{formatDate(note.invoiceDate)}</>}
                  {note.createdAt   && <>&nbsp;·&nbsp;Raised: {formatDate(note.createdAt)}</>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4 shrink-0">
              {hasDebit && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Debit</p>
                  <p className="font-bold text-green-700 text-sm">{formatCurrency(note.debitTotal)}</p>
                </div>
              )}
              {hasCredit && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-slate-400">Credit</p>
                  <p className="font-bold text-red-700 text-sm">{formatCurrency(note.creditTotal)}</p>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-slate-400">Net</p>
                <p className={`font-bold text-sm ${parseFloat(note.netTotal || 0) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatCurrency(Math.abs(note.netTotal || 0))}
                </p>
              </div>
              {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
            </div>
          </div>

          {/* ── Expanded body ── */}
          {isOpen && (
            <div className="border-t border-slate-100 px-4 pb-4 pt-4 space-y-4">

              {/* Reason breakdown */}
              {reasons.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Reason Breakdown
                  </p>
                  <div className="space-y-2">
                    {reasons.map((r, i) => {
                      const rc = NOTE_TYPE_CFG[r.noteType] || NOTE_TYPE_CFG.debit;
                      const { Icon } = rc;
                      return (
                        <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${rc.bg}`}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-3.5 w-3.5 ${rc.text}`} />
                            <span className="font-medium text-slate-700">{r.reasonTitle}</span>
                            <Badge className={`text-xs ${rc.badge}`}>{rc.label}</Badge>
                          </div>
                          <span className={`font-bold ${rc.text}`}>{formatCurrency(r.amount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Narration */}
              {note.reasonText && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Note from A/C Executive
                  </p>
                  <p className="text-sm text-slate-700 bg-slate-50 rounded p-2.5 border border-slate-200 italic">
                    {note.reasonText}
                  </p>
                </div>
              )}

              {/* Existing documents */}
              {docs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Attached Documents
                  </p>
                  <div className="space-y-1.5">
                    {docs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Paperclip className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="text-sm text-slate-700 truncate">{doc.fileName || doc.name}</span>
                          {doc.uploadedBy === 'supplier' && (
                            <Badge className="text-xs bg-blue-100 text-blue-700 shrink-0">You</Badge>
                          )}
                          {doc.uploadedBy === 'admin' && (
                            <Badge className="text-xs bg-purple-100 text-purple-700 shrink-0">A/C Exec</Badge>
                          )}
                        </div>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-400 hover:text-blue-600">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Upload panel */}
              {!isUpload ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={(e) => { e.stopPropagation(); setUploadingNoteId(id); setUploadFiles([]); }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Supporting Documents
                </Button>
              ) : (
                <div
                  className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-blue-800">Upload Supporting Documents</p>
                    <Button
                      variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400"
                      onClick={() => { setUploadingNoteId(null); setUploadFiles([]); }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Drop zone */}
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-3 bg-white text-center">
                    <input
                      type="file" multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                      id={`upload-${id}`}
                      disabled={uploadFiles.length >= 5}
                    />
                    <Label
                      htmlFor={`upload-${id}`}
                      className={`cursor-pointer ${uploadFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Upload className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                      <p className="text-xs text-slate-600 font-medium">
                        {uploadFiles.length >= 5 ? 'Max 5 files reached' : 'Click to select files'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG, DOC · max 5 MB each</p>
                    </Label>
                  </div>

                  {uploadFiles.length > 0 && (
                    <div className="space-y-1">
                      {uploadFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-white border border-blue-100 rounded px-3 py-1.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <Paperclip className="h-3 w-3 text-blue-400 shrink-0" />
                            <span className="text-xs text-slate-700 truncate">{f.name}</span>
                            <span className="text-xs text-slate-400 shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                          </div>
                          <Button
                            variant="ghost" size="sm"
                            className="h-5 w-5 p-0 text-red-400 hover:text-red-600"
                            onClick={() => removeFile(i)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!uploadFiles.length || isUploading}
                      onClick={() => submitUpload(id)}
                    >
                      {isUploading
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading…</>
                        : <><Upload className="h-4 w-4 mr-2" />Submit</>}
                    </Button>
                    <Button
                      variant="outline" size="sm"
                      onClick={() => { setUploadingNoteId(null); setUploadFiles([]); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Debit & Credit Notes</h1>
            <p className="text-sm text-slate-500">
              {companyName ? `${companyName} · ` : ''}
              View notes raised on your invoices and upload supporting documents
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchNotes} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Input
            placeholder="Search invoice / note ID…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-sm w-52"
          />
          {['all', 'debit', 'credit'].map((t) => (
            <Button
              key={t}
              size="sm"
              className="h-8 capitalize"
              variant={filterType === t ? 'default' : 'outline'}
              onClick={() => setFilterType(t)}
            >
              {t === 'all' ? 'All Types' : t === 'debit' ? 'Debit' : 'Credit'}
            </Button>
          ))}
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

        {/* Summary tiles */}
        {!isLoading && notes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Notes',       value: filtered.length,                                         color: 'text-slate-700',  bg: 'bg-white'     },
              { label: 'Total Debit', value: formatCurrency(totals.debit),                            color: 'text-green-700',  bg: 'bg-green-50'  },
              { label: 'Total Credit',value: formatCurrency(totals.credit),                           color: 'text-red-700',    bg: 'bg-red-50'    },
              {
                label: 'Net',
                value: formatCurrency(Math.abs(totals.debit - totals.credit)),
                sub:   totals.debit >= totals.credit ? 'Net Debit' : 'Net Credit',
                color: totals.debit >= totals.credit ? 'text-green-700' : 'text-red-700',
                bg:    totals.debit >= totals.credit ? 'bg-green-50'   : 'bg-red-50',
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

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-slate-600">Loading your notes…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">
              {notes.length === 0
                ? 'No debit / credit notes found for your account.'
                : 'No notes match the current filters.'}
            </p>
            {notes.length === 0 && (
              <Button variant="ghost" size="sm" className="mt-3" onClick={fetchNotes}>
                <RefreshCw className="h-4 w-4 mr-1" />Try again
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Showing {filtered.length} of {notes.length} note{notes.length !== 1 ? 's' : ''}
            </p>
            {filtered.map((note) => (
              <NoteCard key={note.id || note.noteId} note={note} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SupplierDebitCreditView;
