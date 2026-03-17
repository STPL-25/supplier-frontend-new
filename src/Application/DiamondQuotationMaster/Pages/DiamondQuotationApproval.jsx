import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FiCheck, FiX, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { DIA_API, API } from '../../../config/configData';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

const STATUS_MAP = {
  P: { label: 'Pending',  cls: 'bg-amber-100  text-amber-700  border border-amber-200'  },
  A: { label: 'Accepted', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  R: { label: 'Rejected', cls: 'bg-red-100    text-red-600    border border-red-200'    },
};

const shapeColors = {
  ROUND:    'bg-blue-100   text-blue-700',
  PEAR:     'bg-purple-100 text-purple-700',
  PRINCESS: 'bg-pink-100   text-pink-700',
  MARQUISE: 'bg-amber-100  text-amber-700',
  MARQUICE: 'bg-orange-100 text-orange-700',
  BAGUETTE: 'bg-teal-100   text-teal-700',
};

const DiamondQuotationApproval = () => {
  const { userRole,suppCode } = useContext(DashBoardContext);

  const [suppliers, setSuppliers]           = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [quotationList, setQuotationList]   = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingList, setLoadingList]       = useState(false);
  const [actionLoading, setActionLoading]   = useState(null); 
  const [listError, setListError]           = useState(null);
  const [toast, setToast]                   = useState(null); // { msg, type }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch Supplier List ──────────────────────────────────────
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const res = await axios.get(`${API}/gold_po/fetch_supplier/${userRole}`);
        setSuppliers(res.data.supplierNames || []);
      } catch {
        showToast('Failed to load suppliers', 'error');
      } finally {
        setLoadingSuppliers(false);
      }
    };
    if (userRole) fetchSuppliers();
  }, [userRole]);

  // ── Fetch Quotations for selected supplier ───────────────────
  const fetchQuotations = async (suppCode) => {
    if (!suppCode) { setQuotationList([]); return; }
    setLoadingList(true);
    setListError(null);
    try {
      const res = await axios.get(`${DIA_API}/diamond-quotation/${suppCode}`);
      setQuotationList(res.data.diamondQuotations || []);
    } catch {
      setListError('Failed to load quotations.');
      setQuotationList([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchQuotations(selectedSupplier);
  }, [selectedSupplier]);

  // ── Approve / Reject ─────────────────────────────────────────
  const handleStatusChange = async (row, newStatus) => {
    const id = row.QuotationID ?? row._id;
    setActionLoading(id + newStatus);
    try {
      await axios.post(`${DIA_API}/diamond-quotation/approve`, {
        QuotationID: id,
        SuppCode:    suppCode,
        Status:      newStatus,
      });
      showToast(newStatus === 'A' ? 'Quotation accepted.' : 'Quotation rejected.');
      fetchQuotations(selectedSupplier);
    } catch {
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const pendingList  = quotationList.filter((r) => r.Status === 'P');
  const acceptedList = quotationList.filter((r) => r.Status === 'A');
  const rejectedList = quotationList.filter((r) => r.Status === 'R');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto space-y-5">

        {/* PAGE TITLE */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Diamond Quotation Approval</h1>
            <p className="text-xs text-slate-500">Review and approve / reject supplier quotations</p>
          </div>
        </div>

        {/* TOAST */}
        {toast && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg transition-all
            ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {toast.msg}
          </div>
        )}

        {/* SUPPLIER SELECTOR CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Select Supplier</h2>
          <div className="relative max-w-sm">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              disabled={loadingSuppliers}
              className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 disabled:opacity-60 cursor-pointer"
            >
              <option value="">{loadingSuppliers ? 'Loading suppliers…' : '— Select Supplier —'}</option>
              {suppliers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>

        {selectedSupplier && (
          <>
            {/* ── PENDING QUOTATIONS ── */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-amber-100 flex flex-wrap gap-3 items-center justify-between bg-amber-50/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">Pending Approval</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-200 text-amber-700 rounded-full">
                    {pendingList.length}
                  </span>
                </div>
                <button
                  onClick={() => fetchQuotations(selectedSupplier)}
                  disabled={loadingList}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <FiRefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {listError && (
                <div className="mx-5 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
                  <FiX /> {listError}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {['#', 'Quot. Date', 'Validity', 'Shape', 'From (ct)', 'To (ct)', 'Rate / ct', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loadingList ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                          <FiRefreshCw className="animate-spin mx-auto mb-2 w-5 h-5" />
                          Loading quotations…
                        </td>
                      </tr>
                    ) : pendingList.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                          No pending quotations for <span className="font-semibold text-slate-600">{selectedSupplier}</span>
                        </td>
                      </tr>
                    ) : (
                      pendingList.map((row, idx) => {
                        const id = row.QuotationID ?? row._id ?? idx;
                        const isAccepting = actionLoading === id + 'A';
                        const isRejecting = actionLoading === id + 'R';
                        const busy = isAccepting || isRejecting;
                        return (
                          <tr key={id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                              {row.QuotationDate?.split('T')[0] || row.QuotationDate || '—'}
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {row.ValidityDate?.split('T')[0] || row.ValidityDate || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${shapeColors[row.Shape] || 'bg-slate-100 text-slate-600'}`}>
                                {row.Shape}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_From_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_T0_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono font-semibold">
                              ₹{parseFloat(row.Rate_Per_Carat).toFixed(3)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStatusChange(row, 'A')}
                                  disabled={busy}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                                >
                                  {isAccepting
                                    ? <FiRefreshCw className="w-3 h-3 animate-spin" />
                                    : <FiCheck className="w-3 h-3" />}
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleStatusChange(row, 'R')}
                                  disabled={busy}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                                >
                                  {isRejecting
                                    ? <FiRefreshCw className="w-3 h-3 animate-spin" />
                                    : <FiX className="w-3 h-3" />}
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── ACCEPTED QUOTATIONS ── */}
            {acceptedList.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-emerald-100 flex items-center gap-2 bg-emerald-50/60">
                  <span className="text-sm font-semibold text-slate-700">Accepted Quotations</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-200 text-emerald-700 rounded-full">
                    {acceptedList.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['#', 'Quot. Date', 'Validity', 'Shape', 'From (ct)', 'To (ct)', 'Rate / ct', 'Status'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {acceptedList.map((row, idx) => {
                        const id = row.QuotationID ?? row._id ?? idx;
                        return (
                          <tr key={id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                              {row.QuotationDate?.split('T')[0] || row.QuotationDate || '—'}
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {row.ValidityDate?.split('T')[0] || row.ValidityDate || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${shapeColors[row.Shape] || 'bg-slate-100 text-slate-600'}`}>
                                {row.Shape}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_From_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_T0_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono font-semibold">
                              ₹{parseFloat(row.Rate_Per_Carat).toFixed(3)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_MAP['A'].cls}`}>
                                {STATUS_MAP['A'].label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── REJECTED QUOTATIONS ── */}
            {rejectedList.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2 bg-red-50/60">
                  <span className="text-sm font-semibold text-slate-700">Rejected Quotations</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-200 text-red-600 rounded-full">
                    {rejectedList.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['#', 'Quot. Date', 'Validity', 'Shape', 'From (ct)', 'To (ct)', 'Rate / ct', 'Status'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {rejectedList.map((row, idx) => {
                        const id = row.QuotationID ?? row._id ?? idx;
                        return (
                          <tr key={id} className="hover:bg-red-50/30 transition-colors">
                            <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                              {row.QuotationDate?.split('T')[0] || row.QuotationDate || '—'}
                            </td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                              {row.ValidityDate?.split('T')[0] || row.ValidityDate || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${shapeColors[row.Shape] || 'bg-slate-100 text-slate-600'}`}>
                                {row.Shape}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_From_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono">
                              {parseFloat(row.Carat_T0_Weight).toFixed(3)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 font-mono font-semibold">
                              ₹{parseFloat(row.Rate_Per_Carat).toFixed(3)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_MAP['R'].cls}`}>
                                {STATUS_MAP['R'].label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {!selectedSupplier && !loadingSuppliers && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-sm">
            Select a supplier above to view their diamond quotations
          </div>
        )}
      </div>
    </div>
  );
};

export default DiamondQuotationApproval;
