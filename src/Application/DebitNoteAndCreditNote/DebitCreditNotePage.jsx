import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ScanLine, Upload, X, FileText, Loader2,
  AlertCircle, CheckCircle, XCircle, ImageIcon,
  ArrowUp, ArrowDown, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { API } from '../../config/configData';

const DebitCreditNotePage = () => {
  // ─── State ─────────────────────────────────────────────────────────────────
  const [invoiceList, setInvoiceList] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [scannerActive, setScannerActive] = useState(false);
  const [scanBuffer, setScanBuffer] = useState('');
  const scanBufferRef = useRef('');
  const scanTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  const [reasonsConfig, setReasonsConfig] = useState([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  const [reasonsData, setReasonsData] = useState({});

  const [reasonText, setReasonText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchReasons();
    fetchInvoices();
  }, []);

  // ─── Cleanup object URLs ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      Object.values(reasonsData).forEach(d =>
        d.imagePreviews?.forEach(p => URL.revokeObjectURL(p))
      );
    };
  }, []);

  // ─── Fetch Reasons ─────────────────────────────────────────────────────────
  const initReasonsData = (reasons) => {
    const init = {};
    reasons.forEach(r => {
      init[r.key] = {
        id: r.id,
        selected: false,
        noteType: r.isAutoDebit ? 'debit' : '',
        amount: '',
        images: [],
        imagePreviews: [],
      };
    });
    setReasonsData(init);
  };

  const fetchReasons = async () => {
    setIsLoadingReasons(true);
    try {
      const response = await axios.get(`${API}/debit-credit-reasons`);
      const reasons = response.data?.reasons || [];
      const activeReasons = reasons.filter(r => r.isActive !== false);
      setReasonsConfig(activeReasons);
      initReasonsData(activeReasons);
      toast.success(`${activeReasons.length} reasons loaded`);
    } catch (error) {
      // console.error('Error fetching reasons:', error);
      toast.error('Failed to load reasons. Using defaults.');
      const defaultReasons = [
        { id: 1, key: 'rateDifference',   title: 'Rate Difference',    description: 'Price variation adjustment',          isAutoDebit: false },
        { id: 2, key: 'weightDifference', title: 'Weight Difference',  description: 'Quantity / weight mismatch',           isAutoDebit: false },
        { id: 3, key: 'purchaseReturn',   title: 'Purchase Return',    description: 'Goods returned to supplier',          isAutoDebit: true  },
        { id: 4, key: 'hallmarkReturn',   title: 'Hallmark Return',    description: 'Hallmarking failure / rejected items', isAutoDebit: true  },
        { id: 5, key: 'purityDifference', title: 'Purity Difference',  description: 'Gold / metal purity mismatch',        isAutoDebit: false },
      ];
      setReasonsConfig(defaultReasons);
      initReasonsData(defaultReasons);
    } finally {
      setIsLoadingReasons(false);
    }
  };

  // ─── Fetch Invoices ────────────────────────────────────────────────────────
  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const response = await axios.get(`${API}/invoice_for_debit_credit_note`);
      const invoices = response.data?.result?.[0] || [];
      setInvoiceList(invoices);
      setFilteredInvoices(invoices);
      toast.success(`${invoices.length} invoices loaded`);
    } catch (error) {
      // console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices.');
      setInvoiceList([]);
      setFilteredInvoices([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  // ─── Hardware Scanner ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!scannerActive) return;
      const isTextInput =
        ['INPUT', 'TEXTAREA'].includes(e.target.tagName) &&
        !e.target.classList.contains('scanner-input');
      if (isTextInput) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        const scannedData = scanBufferRef.current.trim();
        if (scannedData) {
          setSearchTerm(scannedData);
          toast.success('Code scanned!', { description: `Scanned: ${scannedData.substring(0, 20)}` });
          scanBufferRef.current = '';
          setScanBuffer('');
          setScannerActive(false);
        }
        clearTimeout(scanTimeoutRef.current);
        return;
      }

      if (e.key.length > 1) return;
      e.preventDefault();
      scanBufferRef.current += e.key;
      setScanBuffer(scanBufferRef.current);

      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = setTimeout(() => {
        if (scanBufferRef.current) {
          setSearchTerm(scanBufferRef.current.trim());
          toast.success('Code scanned!');
          scanBufferRef.current = '';
          setScanBuffer('');
          setScannerActive(false);
        }
      }, 100);
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(scanTimeoutRef.current);
    };
  }, [scannerActive]);

  // ─── Auto Search ───────────────────────────────────────────────────────────
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchTerm.trim()) {
        setFilteredInvoices(invoiceList);
      } else {
        const lower = searchTerm.toLowerCase();
        const filtered = invoiceList.filter(inv =>
          inv.Billno?.toLowerCase().includes(lower) ||
          inv.Suppliername?.toLowerCase().includes(lower) ||
          inv.companyname?.toLowerCase().includes(lower) ||
          inv.mobileNumber?.includes(searchTerm)
        );
        setFilteredInvoices(filtered);
        if (filtered.length === 1) handleSelectInvoice(filtered[0]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, invoiceList]);

  // ─── Scanner toggle ────────────────────────────────────────────────────────
  const toggleScanner = () => {
    const next = !scannerActive;
    setScannerActive(next);
    scanBufferRef.current = '';
    setScanBuffer('');
    toast.info(next ? 'Scanner activated! Point and scan.' : 'Scanner deactivated');
  };

  // ─── Invoice handlers ──────────────────────────────────────────────────────
  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setSearchTerm('');
    toast.success('Invoice selected');
  };

  const handleClearInvoice = () => {
    revokeAllPreviews();
    setSelectedInvoice(null);
    setSearchTerm('');
    setFilteredInvoices(invoiceList);
    resetForm();
  };

  // ─── Reason handlers ───────────────────────────────────────────────────────
  const handleReasonChange = (reasonKey, checked) => {
    const reasonConfig = reasonsConfig.find(r => r.key === reasonKey);
    setReasonsData(prev => ({
      ...prev,
      [reasonKey]: {
        ...prev[reasonKey],
        selected: checked,
        noteType: checked && reasonConfig?.isAutoDebit
          ? 'debit'
          : (!checked ? prev[reasonKey]?.noteType : prev[reasonKey]?.noteType || ''),
      },
    }));
  };

  const handleNoteTypeChange = (reasonKey, noteType) => {
    const reasonConfig = reasonsConfig.find(r => r.key === reasonKey);
    if (reasonConfig?.isAutoDebit) return; // locked
    setReasonsData(prev => ({
      ...prev,
      [reasonKey]: { ...prev[reasonKey], noteType },
    }));
  };

  const handleAmountChange = (reasonKey, value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setReasonsData(prev => ({
        ...prev,
        [reasonKey]: { ...prev[reasonKey], amount: value },
      }));
    }
  };

  const handleImageUpload = (reasonKey, e) => {
    const files = Array.from(e.target.files);
    const current = reasonsData[reasonKey]?.images || [];
    if (current.length + files.length > 5) {
      toast.error('Maximum 5 images per reason');
      e.target.value = '';
      return;
    }
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); return false; }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.error(`${file.name} must be JPG or PNG`); return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(f => URL.createObjectURL(f));
      setReasonsData(prev => ({
        ...prev,
        [reasonKey]: {
          ...prev[reasonKey],
          images: [...(prev[reasonKey]?.images || []), ...validFiles],
          imagePreviews: [...(prev[reasonKey]?.imagePreviews || []), ...newPreviews],
        },
      }));
      const title = reasonsConfig.find(r => r.key === reasonKey)?.title || reasonKey;
      toast.success(`${validFiles.length} image(s) added to ${title}`);
    }
    e.target.value = '';
  };

  const removeImage = (reasonKey, index) => {
    setReasonsData(prev => {
      URL.revokeObjectURL(prev[reasonKey].imagePreviews[index]);
      return {
        ...prev,
        [reasonKey]: {
          ...prev[reasonKey],
          images: prev[reasonKey].images.filter((_, i) => i !== index),
          imagePreviews: prev[reasonKey].imagePreviews.filter((_, i) => i !== index),
        },
      };
    });
    toast.info('Image removed');
  };

  // ─── Supporting documents ──────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > 5) {
      toast.error('Maximum 5 supporting documents');
      return;
    }
    const allowed = [
      'application/pdf', 'image/jpeg', 'image/jpg', 'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} exceeds 5MB`); return false; }
      if (!allowed.includes(file.type)) { toast.error(`${file.name} invalid format`); return false; }
      return true;
    });
    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added`);
    }
    e.target.value = '';
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  // ─── Calculations ──────────────────────────────────────────────────────────
  const calculateAmounts = () => {
    let debitTotal = 0, creditTotal = 0;
    Object.values(reasonsData).forEach(d => {
      if (d.selected && d.amount && d.noteType) {
        const amt = parseFloat(d.amount);
        if (d.noteType === 'debit') debitTotal += amt;
        else if (d.noteType === 'credit') creditTotal += amt;
      }
    });
    return { debitTotal, creditTotal, netTotal: debitTotal - creditTotal };
  };

  // ─── CORRECTED LEDGER ENTRIES ──────────────────────────────────────────────
  // Context: Purchase invoice from Supplier → Supplier is a CREDITOR (Payable A/c)
  //
  // DEBIT NOTE (we issue to supplier — we claim money back):
  //   Supplier A/c         Dr  ← reduces our payable to supplier
  //   [Reason/Return] A/c  Cr  ← records the purchase return / price adjustment
  //
  // CREDIT NOTE (supplier gives us credit — we acknowledge benefit received):
  //   [Reason/Expense] A/c Dr  ← records the expense / purchase adjustment
  //   Supplier A/c         Cr  ← increases payable to supplier (or reduces amount recoverable)
  //
  const getLedgerEntries = () => {
    if (!selectedInvoice) return [];

    const supplierName =
      selectedInvoice.Suppliername ||
      selectedInvoice.companyname ||
      'Supplier';

    const entries = [];

    Object.entries(reasonsData).forEach(([reasonKey, d]) => {
      if (!d.selected || !d.amount || !d.noteType) return;

      const title  = reasonsConfig.find(r => r.key === reasonKey)?.title || reasonKey;
      const amt    = parseFloat(d.amount);
      const billNo = selectedInvoice.Billno;

      if (d.noteType === 'debit') {
        // ── Debit Note ──────────────────────────────────────────────────────
        // We issued a Debit Note to supplier → supplier owes us / we deduct from payable
        entries.push({
          particulars: `${supplierName} A/c`,
          narration:   `Being debit note raised against Bill No. ${billNo} — ${title}`,
          type:        'Dr',
          debit:       amt,
          credit:      0,
          reason:      title,
        });
        entries.push({
          particulars: `${title} A/c`,
          narration:   `Being purchase return / price adjustment on Bill No. ${billNo}`,
          type:        'Cr',
          debit:       0,
          credit:      amt,
          reason:      title,
        });
      } else {
        // ── Credit Note ─────────────────────────────────────────────────────
        // Supplier gives us a Credit Note → we record the benefit / expense
        entries.push({
          particulars: `${title} A/c`,
          narration:   `Being credit note received from ${supplierName} — Bill No. ${billNo}`,
          type:        'Dr',
          debit:       amt,
          credit:      0,
          reason:      title,
        });
        entries.push({
          particulars: `${supplierName} A/c`,
          narration:   `Being credit note acknowledged for Bill No. ${billNo} — ${title}`,
          type:        'Cr',
          debit:       0,
          credit:      amt,
          reason:      title,
        });
      }
    });

    return entries;
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validateForm = () => {
    if (!selectedInvoice) { toast.error('Please select an invoice'); return false; }
    const selected = Object.entries(reasonsData).filter(([, d]) => d.selected);
    if (selected.length === 0) { toast.error('Select at least one reason'); return false; }
    for (const [reasonKey, d] of selected) {
      const title = reasonsConfig.find(r => r.key === reasonKey)?.title || reasonKey;
      if (!d.amount || parseFloat(d.amount) <= 0) {
        toast.error(`Enter valid amount for ${title}`); return false;
      }
      if (!d.noteType) {
        toast.error(`Select Debit or Credit for ${title}`); return false;
      }
    }
    if (!reasonText.trim()) { toast.error('Provide a detailed reason'); return false; }
    if (reasonText.trim().length < 10) { toast.error('Reason must be ≥ 10 characters'); return false; }
    return true;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('invoiceId',    selectedInvoice.id);
      formData.append('billNo',       selectedInvoice.Billno);
      formData.append('supplierName', selectedInvoice.Suppliername || selectedInvoice.companyname);
      formData.append('supplierCode', selectedInvoice.SUP_CODE || '');
      formData.append('mobileNumber', selectedInvoice.mobileNumber);
      formData.append('approvedQty',  selectedInvoice.tQty);
      formData.append('invoiceDate',  selectedInvoice.Date);
      formData.append('pure999Rate',  selectedInvoice.pure999Rate);

      const amounts = calculateAmounts();
      formData.append('debitTotal',  amounts.debitTotal.toFixed(2));
      formData.append('creditTotal', amounts.creditTotal.toFixed(2));
      formData.append('netTotal',    amounts.netTotal.toFixed(2));

      const reasonsArray = [];
      Object.entries(reasonsData).forEach(([reasonKey, d]) => {
        if (!d.selected) return;
        const title = reasonsConfig.find(r => r.key === reasonKey)?.title || reasonKey;
        reasonsArray.push({
          reasonId:    d.id,
          reasonKey,
          reasonTitle: title,
          noteType:    d.noteType,
          amount:      parseFloat(d.amount),
          imageCount:  d.images.length,
        });
        d.images.forEach((img, idx) => {
          formData.append(`${reasonKey}_images`, img, `${reasonKey}_${idx}_${img.name}`);
        });
      });

      formData.append('reasons',    JSON.stringify(reasonsArray));
      formData.append('reasonText', reasonText.trim());
      uploadedFiles.forEach(f => formData.append('supportingDocuments', f, f.name));

      const response = await axios.post(`${API}/debit-credit-notes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { netTotal } = amounts;
      toast.success('Note created successfully!', {
        description: `Note ID: ${response.data.noteId || 'Generated'} | Net ${netTotal >= 0 ? 'Debit' : 'Credit'}: ₹${Math.abs(netTotal).toFixed(2)}`,
        duration: 5000,
      });
      handleReset();
    } catch (error) {
      // console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Reset ─────────────────────────────────────────────────────────────────
  const revokeAllPreviews = () => {
    Object.values(reasonsData).forEach(d =>
      d.imagePreviews?.forEach(p => URL.revokeObjectURL(p))
    );
  };

  const resetForm = () => {
    const reset = {};
    reasonsConfig.forEach(r => {
      reset[r.key] = {
        id: r.id,
        selected: false,
        noteType: r.isAutoDebit ? 'debit' : '',
        amount: '',
        images: [],
        imagePreviews: [],
      };
    });
    setReasonsData(reset);
    setReasonText('');
    setUploadedFiles([]);
  };

  const handleReset = () => {
    revokeAllPreviews();
    setSelectedInvoice(null);
    setSearchTerm('');
    setFilteredInvoices(invoiceList);
    resetForm();
    toast.info('Form reset');
  };

  // ─── Formatters ────────────────────────────────────────────────────────────
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
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;

  // ─── Derived ───────────────────────────────────────────────────────────────
  const anyReasonSelected = Object.values(reasonsData).some(d => d.selected);
  const allSelectedHaveNoteType = Object.values(reasonsData)
    .filter(d => d.selected)
    .every(d => d.noteType !== '');

  // ─── Render Reason Card ────────────────────────────────────────────────────
  const renderReasonCard = (reasonConfig) => {
    const { key: reasonKey, title, description, isAutoDebit } = reasonConfig;
    const data = reasonsData[reasonKey];
    if (!data) return null;

    return (
      <Card
        key={reasonKey}
        className={data.selected ? 'border-2 border-blue-500 bg-blue-50' : 'border-slate-200'}
      >
        <CardContent className="p-4 space-y-4">
          {/* Checkbox header */}
          <div
            className="flex items-start space-x-3 cursor-pointer"
            onClick={() => handleReasonChange(reasonKey, !data.selected)}
          >
            <Checkbox
              id={reasonKey}
              checked={data.selected}
              onCheckedChange={(checked) => handleReasonChange(reasonKey, checked)}
            />
            <div className="space-y-1 flex-1">
              <Label htmlFor={reasonKey} className="font-medium cursor-pointer text-base">
                {title}
                {isAutoDebit && (
                  <Badge variant="secondary" className="ml-2 text-xs bg-amber-100 text-amber-800">
                    Auto Debit
                  </Badge>
                )}
              </Label>
              <p className="text-xs text-slate-500">{description}</p>
            </div>
          </div>

          {data.selected && (
            <div className="space-y-4 pl-7">
              {/* Note Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Note Type <span className="text-red-500">*</span>
                  {isAutoDebit && (
                    <Badge variant="secondary" className="ml-2 text-xs">Locked to Debit</Badge>
                  )}
                </Label>
                <RadioGroup
                  value={data.noteType}
                  onValueChange={(v) => handleNoteTypeChange(reasonKey, v)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {/* Debit */}
                    <div
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all
                        ${isAutoDebit ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                        ${data.noteType === 'debit'
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'}`}
                      onClick={() => !isAutoDebit && handleNoteTypeChange(reasonKey, 'debit')}
                    >
                      <RadioGroupItem value="debit" id={`${reasonKey}-debit`} disabled={isAutoDebit} />
                      <Label
                        htmlFor={`${reasonKey}-debit`}
                        className={`text-sm flex items-center gap-1 ${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        Debit Note
                      </Label>
                    </div>
                    {/* Credit */}
                    <div
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg transition-all
                        ${isAutoDebit ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        ${data.noteType === 'credit'
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'}`}
                      onClick={() => !isAutoDebit && handleNoteTypeChange(reasonKey, 'credit')}
                    >
                      <RadioGroupItem value="credit" id={`${reasonKey}-credit`} disabled={isAutoDebit} />
                      <Label
                        htmlFor={`${reasonKey}-credit`}
                        className={`text-sm flex items-center gap-1 ${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <ArrowDown className="h-3 w-3 text-red-600" />
                        Credit Note
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {/* Contextual ledger hint */}
                {data.noteType && (
                  <div className={`text-xs p-2 rounded mt-1 ${
                    data.noteType === 'debit'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {data.noteType === 'debit' ? (
                      <>
                        <strong>Debit Note:</strong> {selectedInvoice?.Suppliername || selectedInvoice?.companyname || 'Supplier'} A/c <strong>Dr</strong> &nbsp;|&nbsp; {title} A/c <strong>Cr</strong>
                      </>
                    ) : (
                      <>
                        <strong>Credit Note:</strong> {title} A/c <strong>Dr</strong> &nbsp;|&nbsp; {selectedInvoice?.Suppliername || selectedInvoice?.companyname || 'Supplier'} A/c <strong>Cr</strong>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={data.amount}
                    onChange={(e) => handleAmountChange(reasonKey, e.target.value)}
                    className="pl-8 h-10"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Upload Images (Max 5)
                  {data.noteType && (
                    <Badge
                      className={`ml-2 text-xs ${
                        data.noteType === 'debit'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {data.noteType === 'debit' ? 'Debit' : 'Credit'}
                    </Badge>
                  )}
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id={`${reasonKey}-images`}
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => handleImageUpload(reasonKey, e)}
                    className="hidden"
                    disabled={data.images.length >= 5}
                  />
                  <Label
                    htmlFor={`${reasonKey}-images`}
                    className={`flex flex-col items-center ${
                      data.images.length >= 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
                  >
                    <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-700">
                      {data.images.length >= 5 ? 'Maximum reached' : 'Click to upload images'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">JPG, PNG (Max 5MB each)</span>
                  </Label>
                </div>

                {data.images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 font-medium">
                      {data.images.length} image(s) uploaded
                      {data.noteType && ` — ${data.noteType === 'debit' ? 'Debit' : 'Credit'} Note`}
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {data.imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                          />
                          {data.noteType && (
                            <Badge
                              className={`absolute bottom-1 left-1 text-xs px-1 py-0 ${
                                data.noteType === 'debit'
                                  ? 'bg-green-600 text-white'
                                  : 'bg-red-600 text-white'
                              }`}
                            >
                              {data.noteType === 'debit' ? 'D' : 'C'}
                            </Badge>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(reasonKey, index)}
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ─── Render Ledger ─────────────────────────────────────────────────────────
  const renderLedger = () => {
    const entries = getLedgerEntries();
    if (entries.length === 0) return null;

    const amounts = calculateAmounts();
    const supplierName =
      selectedInvoice?.Suppliername ||
      selectedInvoice?.companyname ||
      'Supplier';

    // Group entries by reason for visual clarity
    const groupedByReason = {};
    entries.forEach(entry => {
      if (!groupedByReason[entry.reason]) groupedByReason[entry.reason] = [];
      groupedByReason[entry.reason].push(entry);
    });

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <Label className="text-base font-semibold">Journal / Ledger Entries</Label>
          <Badge variant="outline" className="text-xs text-slate-500">
            Double-Entry View
          </Badge>
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-400"></span>
            Debit Note — Supplier A/c Dr (reduces payable to supplier)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-400"></span>
            Credit Note — Supplier A/c Cr (increases payable to supplier)
          </span>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">Reason</th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">Account (Particulars)</th>
                <th className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">Narration</th>
                <th className="text-center px-3 py-2.5 font-semibold text-xs uppercase tracking-wide w-14">Dr/Cr</th>
                <th className="text-right px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">Debit (₹)</th>
                <th className="text-right px-4 py-2.5 font-semibold text-xs uppercase tracking-wide">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(groupedByReason).map(([reason, reasonEntries], groupIdx) => (
                reasonEntries.map((entry, entryIdx) => {
                  const isDebitNote = reasonEntries[0].type === 'Dr' &&
                    reasonEntries[0].particulars.includes(supplierName);
                  const rowBg = isDebitNote
                    ? (entryIdx === 0 ? 'bg-green-50' : 'bg-green-25 bg-opacity-30')
                    : (entryIdx === 0 ? 'bg-red-50' : 'bg-red-25 bg-opacity-30');

                  return (
                    <tr key={`${groupIdx}-${entryIdx}`} className={rowBg}>
                      {entryIdx === 0 && (
                        <td
                          rowSpan={reasonEntries.length}
                          className="px-4 py-2 align-middle border-r border-slate-200"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-slate-700 text-xs">{reason}</span>
                            <Badge
                              className={`text-xs w-fit ${
                                isDebitNote
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {isDebitNote ? '↑ Debit Note' : '↓ Credit Note'}
                            </Badge>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-2 font-semibold text-slate-800">
                        {entry.type === 'Cr' && (
                          <span className="text-slate-400 mr-2">To</span>
                        )}
                        {entry.type === 'Dr' && (
                          <span className="text-slate-400 mr-2">By</span>
                        )}
                        {entry.particulars}
                      </td>
                      <td className="px-4 py-2 text-slate-500 text-xs italic max-w-xs">
                        {entry.narration}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Badge
                          className={`text-xs font-bold ${
                            entry.type === 'Dr'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {entry.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-green-700">
                        {entry.debit > 0 ? formatCurrency(entry.debit) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-medium text-red-700">
                        {entry.credit > 0 ? formatCurrency(entry.credit) : <span className="text-slate-300">—</span>}
                      </td>
                    </tr>
                  );
                })
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-400">
                <td colSpan={4} className="px-4 py-2.5 font-bold text-slate-800 text-right">
                  Total
                </td>
                <td className="px-4 py-2.5 text-right font-bold font-mono text-green-700 text-base">
                  {formatCurrency(amounts.debitTotal)}
                </td>
                <td className="px-4 py-2.5 text-right font-bold font-mono text-red-700 text-base">
                  {formatCurrency(amounts.creditTotal)}
                </td>
              </tr>
              <tr className="bg-indigo-50 border-t border-indigo-200">
                <td colSpan={4} className="px-4 py-2.5 font-bold text-indigo-900 text-right">
                  Net {amounts.netTotal >= 0 ? 'Debit' : 'Credit'} Amount
                </td>
                <td
                  colSpan={2}
                  className={`px-4 py-2.5 text-right font-bold font-mono text-lg ${
                    amounts.netTotal >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {formatCurrency(Math.abs(amounts.netTotal))}
                  <span className="text-xs ml-1 font-normal">
                    ({amounts.netTotal >= 0 ? 'Debit' : 'Credit'})
                  </span>
                </td>
              </tr>
              <tr className="bg-amber-50 border-t border-amber-200">
                <td colSpan={6} className="px-4 py-2 text-xs text-amber-800">
                  <strong>Note:</strong> Debit Note → {supplierName} A/c Dr (we deduct from payable).
                  Credit Note → {supplierName} A/c Cr (supplier's credit increases).
                  Based on Purchase Invoice <strong>{selectedInvoice?.Billno}</strong>.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // ─── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 mb-1">Debit & Credit Note</h1>
          <p className="text-sm text-slate-500">
            Create debit / credit notes against approved purchase invoices
          </p>
        </div>

        {isLoadingReasons && (
          <Card className="mb-6 shadow-lg">
            <CardContent className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-3 text-slate-600">Loading reasons configuration...</span>
            </CardContent>
          </Card>
        )}

        {!isLoadingReasons && (
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle>Invoice Selection</CardTitle>
              <CardDescription>
                Search, scan, or select an approved purchase invoice
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* ── Invoice Search ── */}
              {!selectedInvoice && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Search Invoice</Label>
                    <Button
                      variant="outline" size="sm"
                      onClick={fetchInvoices} disabled={isLoadingInvoices}
                    >
                      {isLoadingInvoices
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : 'Refresh'}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search by invoice no, supplier, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 h-11 scanner-input"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <Button
                      onClick={toggleScanner}
                      variant={scannerActive ? 'default' : 'outline'}
                      className={`h-11 px-4 ${scannerActive ? 'bg-green-600 hover:bg-green-700 animate-pulse' : ''}`}
                    >
                      <ScanLine className="h-5 w-5" />
                      {scannerActive && <span className="ml-2 text-xs">Active</span>}
                    </Button>
                  </div>

                  {scannerActive && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 flex items-center gap-3">
                      <ScanLine className="h-6 w-6 text-green-600 animate-pulse" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">Hardware Scanner Active</p>
                        <p className="text-xs text-green-700">
                          Point your barcode / QR scanner at the code
                          {scanBuffer && <span className="ml-2 font-mono">({scanBuffer.length} chars...)</span>}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={toggleScanner} className="text-green-900">
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    {isLoadingInvoices ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="ml-3 text-slate-600">Loading invoices...</span>
                      </div>
                    ) : filteredInvoices.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-slate-400 mb-3" />
                        <p className="text-slate-600 font-medium">No invoices found</p>
                        <p className="text-sm text-slate-500 mt-1">
                          {searchTerm ? 'Try a different search term' : 'No approved invoices available'}
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredInvoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            onClick={() => handleSelectInvoice(invoice)}
                            className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-slate-900 truncate">{invoice.Billno}</h4>
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    {invoice.approvedstatus}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                  <div className="truncate">
                                    <span className="text-slate-500">Supplier: </span>
                                    <span className="font-medium text-slate-700">
                                      {invoice.Suppliername || invoice.companyname}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Date: </span>
                                    <span className="font-medium text-slate-700">{formatDate(invoice.Date)}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Qty: </span>
                                    <span className="font-medium text-slate-700">{invoice.tQty} gm</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Rate: </span>
                                    <span className="font-medium text-slate-700">
                                      {formatCurrency(invoice.pure999Rate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost" size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Select
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Selected Invoice ── */}
              {selectedInvoice && (
                <>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Selected Invoice</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600 text-white">{selectedInvoice.approvedstatus}</Badge>
                        <Button variant="ghost" size="sm" onClick={handleClearInvoice} className="h-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {[
                        ['Invoice No',    selectedInvoice.Billno],
                        ['Supplier Name', selectedInvoice.Suppliername || selectedInvoice.companyname],
                        ['Mobile Number', selectedInvoice.mobileNumber],
                        ['Invoice Date',  formatDate(selectedInvoice.Date)],
                        ['Approved Qty',  `${selectedInvoice.tQty} gm`],
                        ['999 Rate',      formatCurrency(selectedInvoice.pure999Rate)],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-white rounded p-3 border border-green-100">
                          <span className="text-slate-500 text-xs block mb-1">{label}</span>
                          <span className="font-semibold text-slate-900 truncate block">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* ── Reasons ── */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Select Reason(s) <span className="text-red-500">*</span>
                      </Label>
                      <Button
                        variant="outline" size="sm"
                        onClick={fetchReasons} disabled={isLoadingReasons}
                      >
                        {isLoadingReasons
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : 'Refresh Reasons'}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {reasonsConfig.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                          <AlertCircle className="h-12 w-12 text-slate-400 mb-3" />
                          <p className="text-slate-600 font-medium">No reasons available</p>
                          <p className="text-sm text-slate-500 mt-1">Contact administrator</p>
                        </div>
                      ) : (
                        reasonsConfig.map(rc => renderReasonCard(rc))
                      )}
                    </div>

                    {/* Amount Summary */}
                    {anyReasonSelected && (() => {
                      const { debitTotal, creditTotal, netTotal } = calculateAmounts();
                      return (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-slate-900 mb-3">Amount Summary</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white rounded p-3 border-l-4 border-green-500">
                              <span className="text-xs text-slate-600 block mb-1">Total Debit Notes</span>
                              <span className="text-lg font-bold text-green-600">{formatCurrency(debitTotal)}</span>
                            </div>
                            <div className="bg-white rounded p-3 border-l-4 border-red-500">
                              <span className="text-xs text-slate-600 block mb-1">Total Credit Notes</span>
                              <span className="text-lg font-bold text-red-600">{formatCurrency(creditTotal)}</span>
                            </div>
                            <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                              <span className="text-xs text-slate-600 block mb-1">Net Amount</span>
                              <span className={`text-lg font-bold ${netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(netTotal))}
                                <span className="text-xs ml-1">({netTotal >= 0 ? 'Debit' : 'Credit'})</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── Ledger ── */}
                  {anyReasonSelected && (
                    <>
                      <Separator />
                      {renderLedger()}
                    </>
                  )}

                  {/* ── Detailed reason + docs ── */}
                  {anyReasonSelected && allSelectedHaveNoteType && (
                    <>
                      <Separator />

                      <div className="space-y-3">
                        <Label htmlFor="reasonText" className="text-base font-semibold">
                          Detailed Reason <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="reasonText"
                          placeholder="Provide detailed explanation (min 10 characters)..."
                          value={reasonText}
                          onChange={(e) =>
                            e.target.value.length <= 500 && setReasonText(e.target.value)
                          }
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className={reasonText.length < 10 ? 'text-red-500' : 'text-slate-500'}>
                            Minimum 10 characters required
                          </span>
                          <span className="text-slate-500">{reasonText.length}/500</span>
                        </div>
                      </div>

                      {/* Supporting Docs */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Additional Supporting Documents{' '}
                          <span className="text-slate-400 text-sm font-normal">(Optional)</span>
                        </Label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            id="fileUpload"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploadedFiles.length >= 5}
                          />
                          <Label
                            htmlFor="fileUpload"
                            className={`flex flex-col items-center ${
                              uploadedFiles.length >= 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                          >
                            <Upload className="h-10 w-10 text-slate-400 mb-2" />
                            <span className="text-sm font-medium text-slate-700">
                              {uploadedFiles.length >= 5
                                ? 'Maximum files reached'
                                : 'Click to upload documents'}
                            </span>
                            <span className="text-xs text-slate-500 mt-1 text-center">
                              PDF, JPG, PNG, DOC (Max 5MB each, up to {5 - uploadedFiles.length} more)
                            </span>
                          </Label>
                        </div>

                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-slate-700">
                              Uploaded Files ({uploadedFiles.length}/5)
                            </p>
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost" size="sm"
                                  onClick={() => removeFile(index)}
                                  className="ml-2 flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ── Actions ── */}
                  {anyReasonSelected && allSelectedHaveNoteType && (
                    <>
                      <Separator />
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating Note...</>
                          ) : (
                            'Create Note'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleReset}
                          disabled={isSubmitting}
                          className="sm:w-32 h-12 border-2"
                        >
                          Reset
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DebitCreditNotePage;
