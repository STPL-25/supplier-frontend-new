// import React, { useState, useEffect, useRef } from 'react';
// import { Search, ScanLine, Upload, X, FileText, Loader2, AlertCircle, CheckCircle, Camera, XCircle, ImageIcon, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Textarea } from '@/components/ui/textarea';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import axios from 'axios';
// import { Html5Qrcode } from 'html5-qrcode';
// import { API } from '../../config/configData';

// const DebitCreditNotePage = () => {
//   // State Management
//   const [invoiceList, setInvoiceList] = useState([]);
//   const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredInvoices, setFilteredInvoices] = useState([]);
  
//   // Scanner states
//   const [isScannerOpen, setIsScannerOpen] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const scannerRef = useRef(null);
//   const html5QrCodeRef = useRef(null);
  
//   // Form states - Updated with 5 separate reasons
//   const [reasonsData, setReasonsData] = useState({
//     rateDifference: {
//       selected: false,
//       noteType: '', // 'debit' or 'credit'
//       amount: '',
//       images: [],
//       imagePreviews: []
//     },
//     weightDifference: {
//       selected: false,
//       noteType: '',
//       amount: '',
//       images: [],
//       imagePreviews: []
//     },
//     purchaseReturn: {
//       selected: false,
//       noteType: '',
//       amount: '',
//       images: [],
//       imagePreviews: []
//     },
//     hallmarkReturn: {
//       selected: false,
//       noteType: '',
//       amount: '',
//       images: [],
//       imagePreviews: []
//     },
//     purityDifference: {
//       selected: false,
//       noteType: '',
//       amount: '',
//       images: [],
//       imagePreviews: []
//     }
//   });
  
//   const [reasonText, setReasonText] = useState('');
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch all invoices on component mount
//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   // Auto-search effect with debounce
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim() === '') {
//         setFilteredInvoices(invoiceList);
//       } else {
//         const filtered = invoiceList.filter(invoice => 
//           invoice.Billno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           invoice.Suppliername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           invoice.companyname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           invoice.mobileNumber?.includes(searchTerm)
//         );
//         setFilteredInvoices(filtered);
        
//         if (filtered.length === 1 && searchTerm.trim() !== '') {
//           handleSelectInvoice(filtered[0]);
//         }
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm, invoiceList]);

//   // Cleanup scanner on unmount
//   useEffect(() => {
//     return () => {
//       stopScanner();
//       // Cleanup image previews
//       Object.values(reasonsData).forEach(data => {
//         data.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
//       });
//     };
//   }, []);

//   // Fetch invoices from API
//   const fetchInvoices = async () => {
//     setIsLoadingInvoices(true);
//     try {
//       const response = await axios.get(`${API}/invoice_for_debit_credit_note`);
      
//       const invoices = response.data?.result?.[0] || [];
//       setInvoiceList(invoices);
//       setFilteredInvoices(invoices);
      
//       toast.success(`${invoices.length} invoices loaded successfully`);
//     } catch (error) {
//       console.error('Error fetching invoices:', error);
//       toast.error('Failed to load invoices. Please try again.');
//       setInvoiceList([]);
//       setFilteredInvoices([]);
//     } finally {
//       setIsLoadingInvoices(false);
//     }
//   };

//   // Start QR/Barcode Scanner
//   const startScanner = async () => {
//     try {
//       setIsScannerOpen(true);
//       setIsScanning(true);

//       await new Promise(resolve => setTimeout(resolve, 100));

//       const html5QrCode = new Html5Qrcode("qr-reader");
//       html5QrCodeRef.current = html5QrCode;

//       const config = {
//         fps: 10,
//         qrbox: { width: 250, height: 250 },
//         aspectRatio: 1.0,
//         formatsToSupport: [
//           Html5Qrcode.SCAN_TYPE_CAMERA
//         ]
//       };

//       await html5QrCode.start(
//         { facingMode: "environment" },
//         config,
//         (decodedText, decodedResult) => {
//           console.log('Scanned:', decodedText);
//           setSearchTerm(decodedText);
//           toast.success('Code scanned successfully!');
//           stopScanner();
//         },
//         (errorMessage) => {
//           // Continuous scanning
//         }
//       );

//     } catch (error) {
//       console.error('Scanner error:', error);
//       toast.error('Failed to start scanner. Please check camera permissions.');
//       setIsScannerOpen(false);
//       setIsScanning(false);
//     }
//   };

//   // Stop Scanner
//   const stopScanner = async () => {
//     try {
//       if (html5QrCodeRef.current && isScanning) {
//         await html5QrCodeRef.current.stop();
//         html5QrCodeRef.current.clear();
//         html5QrCodeRef.current = null;
//       }
//     } catch (error) {
//       console.error('Error stopping scanner:', error);
//     } finally {
//       setIsScanning(false);
//       setIsScannerOpen(false);
//     }
//   };

//   // Select an invoice
//   const handleSelectInvoice = (invoice) => {
//     setSelectedInvoice(invoice);
//     setSearchTerm('');
//     toast.success('Invoice selected');
//   };

//   // Clear invoice selection
//   const handleClearInvoice = () => {
//     setSelectedInvoice(null);
//     handleReset();
//   };

//   // Handle checkbox changes
//   const handleReasonChange = (reason, checked) => {
//     setReasonsData(prev => ({
//       ...prev,
//       [reason]: {
//         ...prev[reason],
//         selected: checked,
//         // Auto-set noteType for purchase return and hallmark return (both are debit)
//         noteType: checked && (reason === 'purchaseReturn' || reason === 'hallmarkReturn') ? 'debit' : prev[reason].noteType
//       }
//     }));
//   };

//   // Handle note type selection for specific reason
//   const handleNoteTypeChange = (reason, noteType) => {
//     setReasonsData(prev => ({
//       ...prev,
//       [reason]: {
//         ...prev[reason],
//         noteType: noteType
//       }
//     }));
//   };

//   // Handle amount input for specific reason
//   const handleAmountChange = (reason, value) => {
//     if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
//       setReasonsData(prev => ({
//         ...prev,
//         [reason]: {
//           ...prev[reason],
//           amount: value
//         }
//       }));
//     }
//   };

//   // Handle image upload for specific reason
//   const handleImageUpload = (reason, e) => {
//     const files = Array.from(e.target.files);
    
//     const currentImages = reasonsData[reason].images;
//     if (currentImages.length + files.length > 5) {
//       toast.error('Maximum 5 images allowed per reason');
//       return;
//     }

//     const validFiles = files.filter(file => {
//       const maxSize = 5 * 1024 * 1024;
//       const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
//       if (file.size > maxSize) {
//         toast.error(`${file.name} is too large. Max size: 5MB`);
//         return false;
//       }
      
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`${file.name} must be JPG, JPEG, or PNG`);
//         return false;
//       }
      
//       return true;
//     });

//     if (validFiles.length > 0) {
//       // Create preview URLs
//       const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      
//       setReasonsData(prev => ({
//         ...prev,
//         [reason]: {
//           ...prev[reason],
//           images: [...prev[reason].images, ...validFiles],
//           imagePreviews: [...prev[reason].imagePreviews, ...newPreviews]
//         }
//       }));
      
//       toast.success(`${validFiles.length} image(s) added to ${getReasonLabel(reason)}`);
//     }
    
//     e.target.value = '';
//   };

//   // Remove image from specific reason
//   const removeImage = (reason, index) => {
//     setReasonsData(prev => {
//       const updatedImages = prev[reason].images.filter((_, i) => i !== index);
//       const updatedPreviews = prev[reason].imagePreviews.filter((_, i) => i !== index);
      
//       // Revoke the URL to prevent memory leaks
//       URL.revokeObjectURL(prev[reason].imagePreviews[index]);
      
//       return {
//         ...prev,
//         [reason]: {
//           ...prev[reason],
//           images: updatedImages,
//           imagePreviews: updatedPreviews
//         }
//       };
//     });
    
//     toast.info('Image removed');
//   };

//   // Get reason label
//   const getReasonLabel = (reason) => {
//     const labels = {
//       rateDifference: 'Rate Difference',
//       weightDifference: 'Weight Difference',
//       purchaseReturn: 'Purchase Return',
//       hallmarkReturn: 'Hallmark Return',
//       purityDifference: 'Purity Difference'
//     };
//     return labels[reason];
//   };

//   // Handle file upload for supporting documents
//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
    
//     if (uploadedFiles.length + files.length > 5) {
//       toast.error('Maximum 5 files allowed');
//       return;
//     }

//     const validFiles = files.filter(file => {
//       const maxSize = 5 * 1024 * 1024;
//       const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
//                            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
//       if (file.size > maxSize) {
//         toast.error(`${file.name} is too large. Max size: 5MB`);
//         return false;
//       }
      
//       if (!allowedTypes.includes(file.type)) {
//         toast.error(`${file.name} has invalid format`);
//         return false;
//       }
      
//       return true;
//     });

//     setUploadedFiles(prev => [...prev, ...validFiles]);
    
//     if (validFiles.length > 0) {
//       toast.success(`${validFiles.length} file(s) added`);
//     }
    
//     e.target.value = '';
//   };

//   // Remove uploaded file
//   const removeFile = (index) => {
//     setUploadedFiles(prev => prev.filter((_, i) => i !== index));
//     toast.info('File removed');
//   };

//   // Calculate total amounts by type
//   const calculateAmounts = () => {
//     let debitTotal = 0;
//     let creditTotal = 0;
    
//     Object.values(reasonsData).forEach(data => {
//       if (data.selected && data.amount && data.noteType) {
//         const amount = parseFloat(data.amount);
//         if (data.noteType === 'debit') {
//           debitTotal += amount;
//         } else if (data.noteType === 'credit') {
//           creditTotal += amount;
//         }
//       }
//     });
    
//     return { debitTotal, creditTotal, netTotal: debitTotal - creditTotal };
//   };

//   // Validate form before submission
//   const validateForm = () => {
//     if (!selectedInvoice) {
//       toast.error('Please select an invoice');
//       return false;
//     }

//     const selectedReasons = Object.entries(reasonsData).filter(([_, data]) => data.selected);
//     if (selectedReasons.length === 0) {
//       toast.error('Please select at least one reason');
//       return false;
//     }

//     // Validate that each selected reason has amount and note type
//     for (const [reason, data] of selectedReasons) {
//       if (!data.amount || parseFloat(data.amount) <= 0) {
//         toast.error(`Please enter a valid amount for ${getReasonLabel(reason)}`);
//         return false;
//       }
      
//       if (!data.noteType) {
//         toast.error(`Please select Debit or Credit for ${getReasonLabel(reason)}`);
//         return false;
//       }
//     }

//     if (!reasonText.trim()) {
//       toast.error('Please provide a detailed reason');
//       return false;
//     }

//     if (reasonText.trim().length < 10) {
//       toast.error('Reason must be at least 10 characters long');
//       return false;
//     }

//     return true;
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
      
//       // Basic invoice data
//       formData.append('invoiceId', selectedInvoice.id);
//       formData.append('billNo', selectedInvoice.Billno);
//       formData.append('supplierName', selectedInvoice.Suppliername || selectedInvoice.companyname);
//       formData.append('supplierCode', selectedInvoice.SUP_CODE || '');
//       formData.append('mobileNumber', selectedInvoice.mobileNumber);
//       formData.append('approvedQty', selectedInvoice.tQty);
//       formData.append('invoiceDate', selectedInvoice.Date);
//       formData.append('pure999Rate', selectedInvoice.pure999Rate);
      
//       const amounts = calculateAmounts();
//       formData.append('debitTotal', amounts.debitTotal.toFixed(2));
//       formData.append('creditTotal', amounts.creditTotal.toFixed(2));
//       formData.append('netTotal', amounts.netTotal.toFixed(2));
      
//       // Prepare reasons data with amounts, noteType and image counts
//       const reasonsArray = [];
//       Object.entries(reasonsData).forEach(([reason, data]) => {
//         if (data.selected) {
//           reasonsArray.push({
//             reason: reason,
//             reasonLabel: getReasonLabel(reason),
//             noteType: data.noteType,
//             amount: parseFloat(data.amount),
//             imageCount: data.images.length
//           });
          
//           // Append images for this reason with noteType in filename
//           data.images.forEach((image, index) => {
//             formData.append(
//               `${reason}_${data.noteType}_images`, 
//               image, 
//               `${reason}_${data.noteType}_${index}_${image.name}`
//             );
//           });
//         }
//       });
      
//       formData.append('reasons', JSON.stringify(reasonsArray));
//       formData.append('reasonText', reasonText.trim());
      
//       // Append supporting documents
//       uploadedFiles.forEach((file) => {
//         formData.append('supportingDocuments', file, file.name);
//       });

//       const response = await axios.post(`${API}/debit-credit-notes`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       const { debitTotal, creditTotal, netTotal } = amounts;
//       const netType = netTotal >= 0 ? 'Debit' : 'Credit';
      
//       toast.success(
//         `Note created successfully!`,
//         {
//           description: `Note ID: ${response.data.noteId || 'Generated'} | Net ${netType}: ₹${Math.abs(netTotal).toFixed(2)}`,
//           duration: 5000,
//         }
//       );
      
//       handleReset();
      
//     } catch (error) {
//       console.error('Submission error:', error);
//       toast.error(error.response?.data?.message || 'Failed to submit note. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form
//   const handleReset = () => {
//     // Cleanup image preview URLs
//     Object.values(reasonsData).forEach(data => {
//       data.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
//     });
    
//     setSelectedInvoice(null);
//     setSearchTerm('');
//     setReasonsData({
//       rateDifference: {
//         selected: false,
//         noteType: '',
//         amount: '',
//         images: [],
//         imagePreviews: []
//       },
//       weightDifference: {
//         selected: false,
//         noteType: '',
//         amount: '',
//         images: [],
//         imagePreviews: []
//       },
//       purchaseReturn: {
//         selected: false,
//         noteType: '',
//         amount: '',
//         images: [],
//         imagePreviews: []
//       },
//       hallmarkReturn: {
//         selected: false,
//         noteType: '',
//         amount: '',
//         images: [],
//         imagePreviews: []
//       },
//       purityDifference: {
//         selected: false,
//         noteType: '',
//         amount: '',
//         images: [],
//         imagePreviews: []
//       }
//     });
//     setReasonText('');
//     setUploadedFiles([]);
//     toast.info('Form reset');
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-IN', { 
//         day: '2-digit', 
//         month: 'short', 
//         year: 'numeric' 
//       });
//     } catch {
//       return dateString;
//     }
//   };

//   // Format currency
//   const formatCurrency = (value) => {
//     if (!value) return '₹0.00';
//     return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
//   };

//   // Check if any reason is selected
//   const anyReasonSelected = Object.values(reasonsData).some(data => data.selected);
  
//   // Check if all selected reasons have noteType
//   const allSelectedHaveNoteType = Object.values(reasonsData)
//     .filter(data => data.selected)
//     .every(data => data.noteType !== '');

//   // Render reason card
//   const renderReasonCard = (reasonKey, title, description, isAutoDebit = false) => {
//     const data = reasonsData[reasonKey];
    
//     return (
//       <Card className={`${data.selected ? 'border-2 border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
//         <CardContent className="p-4 space-y-4">
//           <div 
//             className="flex items-start space-x-3 cursor-pointer"
//             onClick={() => handleReasonChange(reasonKey, !data.selected)}
//           >
//             <Checkbox
//               id={reasonKey}
//               checked={data.selected}
//               onCheckedChange={(checked) => handleReasonChange(reasonKey, checked)}
//             />
//             <div className="space-y-1 flex-1">
//               <Label
//                 htmlFor={reasonKey}
//                 className="font-medium cursor-pointer leading-none text-base"
//               >
//                 {title}
//               </Label>
//               <p className="text-xs text-slate-500">
//                 {description}
//               </p>
//             </div>
//           </div>

//           {data.selected && (
//             <div className="space-y-4 pl-7">
//               {/* Note Type Selection */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">
//                   Note Type <span className="text-red-500">*</span>
//                   {isAutoDebit && (
//                     <Badge variant="secondary" className="ml-2 text-xs">
//                       Auto-set to Debit
//                     </Badge>
//                   )}
//                 </Label>
//                 <RadioGroup 
//                   value={data.noteType} 
//                   onValueChange={(value) =>  handleNoteTypeChange(reasonKey, value)}
//                   // disabled={isAutoDebit}
//                 >
//                   <div className="grid grid-cols-2 gap-3">
//                     <div
//                       className={`flex items-center space-x-2 p-3 border-2 rounded-lg ${
//                         isAutoDebit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
//                       } transition-all ${
//                         data.noteType === 'debit'
//                           ? 'border-green-500 bg-green-50'
//                           : 'border-slate-200 hover:border-slate-300'
//                       }`}
//                       onClick={() =>  handleNoteTypeChange(reasonKey, 'debit')}
//                     >
//                       <RadioGroupItem value="debit" id={`${reasonKey}-debit`} />
//                       <Label htmlFor={`${reasonKey}-debit`} className={`${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'} text-sm flex items-center gap-1`}>
//                         <ArrowUp className="h-3 w-3 text-green-600" />
//                         Debit
//                       </Label>
//                     </div>

//                     <div
//                       className={`flex items-center space-x-2 p-3 border-2 rounded-lg ${
//                         isAutoDebit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
//                       } transition-all ${
//                         data.noteType === 'credit'
//                           ? 'border-red-500 bg-red-50'
//                           : 'border-slate-200 hover:border-slate-300'
//                       }`}
//                       onClick={() => !isAutoDebit && handleNoteTypeChange(reasonKey, 'credit')}
//                     >
//                       <RadioGroupItem value="credit" id={`${reasonKey}-credit`} />
//                       <Label htmlFor={`${reasonKey}-credit`} className={`${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'} text-sm flex items-center gap-1`}>
//                         <ArrowDown className="h-3 w-3 text-red-600" />
//                         Credit
//                       </Label>
//                     </div>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Amount Input */}
//               <div className="space-y-2">
//                 <Label className="text-sm font-medium">
//                   Amount <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
//                     ₹
//                   </span>
//                   <Input
//                     type="text"
//                     placeholder="0.00"
//                     value={data.amount}
//                     onChange={(e) => handleAmountChange(reasonKey, e.target.value)}
//                     className="pl-8 h-10"
//                   />
//                 </div>
//               </div>

//               {/* Image Upload */}
//               {data.noteType && (
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">
//                     Upload Images (Max 5)
//                     {data.noteType && (
//                       <Badge 
//                         variant={data.noteType === 'debit' ? 'success' : 'destructive'} 
//                         className={`ml-2 text-xs ${data.noteType === 'debit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
//                       >
//                         {data.noteType === 'debit' ? 'Debit' : 'Credit'}
//                       </Badge>
//                     )}
//                   </Label>
//                   <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
//                     <input
//                       type="file"
//                       id={`${reasonKey}-images`}
//                       multiple
//                       accept="image/jpeg,image/jpg,image/png"
//                       onChange={(e) => handleImageUpload(reasonKey, e)}
//                       className="hidden"
//                       disabled={data.images.length >= 5}
//                     />
//                     <Label
//                       htmlFor={`${reasonKey}-images`}
//                       className={`flex flex-col items-center ${
//                         data.images.length >= 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
//                       }`}
//                     >
//                       <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
//                       <span className="text-xs font-medium text-slate-700">
//                         {data.images.length >= 5 ? 'Maximum reached' : 'Click to upload images'}
//                       </span>
//                       <span className="text-xs text-slate-500 mt-1">
//                         JPG, PNG (Max 5MB each)
//                       </span>
//                     </Label>
//                   </div>

//                   {/* Image Previews with Note Type Badge */}
//                   {data.images.length > 0 && (
//                     <div className="space-y-2">
//                       <p className="text-xs text-slate-600 font-medium">
//                         {data.images.length} image(s) - {data.noteType === 'debit' ? 'Debit' : 'Credit'} Note
//                       </p>
//                       <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
//                         {data.imagePreviews.map((preview, index) => (
//                           <div key={index} className="relative group">
//                             <div className="relative">
//                               <img
//                                 src={preview}
//                                 alt={`Preview ${index + 1}`}
//                                 className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
//                               />
//                               <Badge 
//                                 className={`absolute bottom-1 left-1 text-xs px-1 py-0 ${
//                                   data.noteType === 'debit' 
//                                     ? 'bg-green-600 text-white' 
//                                     : 'bg-red-600 text-white'
//                                 }`}
//                               >
//                                 {data.noteType === 'debit' ? 'D' : 'C'}
//                               </Badge>
//                             </div>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() => removeImage(reasonKey, index)}
//                               className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
//       <div className=" mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-xl md:text-xl font-bold text-slate-900 mb-2">
//             Debit & Credit Note
//           </h1>
//         </div>

//         {/* Scanner Dialog */}
//         <Dialog open={isScannerOpen} onOpenChange={(open) => {
//           if (!open) {
//             stopScanner();
//           }
//         }}>
//           <DialogContent className="sm:max-w-md">
//             <DialogHeader>
//               <DialogTitle className="flex items-center gap-2">
//                 <Camera className="h-5 w-5" />
//                 Scan QR Code or Barcode
//               </DialogTitle>
//               <DialogDescription>
//                 Position the code within the frame to scan
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div 
//                 id="qr-reader" 
//                 className="w-full rounded-lg overflow-hidden border-2 border-blue-500"
//               />
//               <Button
//                 onClick={stopScanner}
//                 variant="outline"
//                 className="w-full"
//               >
//                 <XCircle className="mr-2 h-4 w-4" />
//                 Cancel Scanning
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Main Card */}
//         <Card className="shadow-lg border-slate-200">
//           <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
//             <CardTitle>Invoice Selection</CardTitle>
//             <CardDescription>
//               Search, scan, or select an approved invoice to create a note
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent className="space-y-6 pt-6">
//             {/* Invoice Search Section */}
//             {!selectedInvoice && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <Label className="text-base font-semibold">
//                     Search Invoice
//                   </Label>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={fetchInvoices}
//                     disabled={isLoadingInvoices}
//                   >
//                     {isLoadingInvoices ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       'Refresh'
//                     )}
//                   </Button>
//                 </div>
                
//                 {/* Search Input with Scanner Button */}
//                 <div className="flex gap-2">
//                   <div className="relative flex-1">
//                     <Input
//                       placeholder="Search by invoice number, supplier name, or mobile..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="pr-10 h-11"
//                     />
//                     <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                   </div>
//                   <Button
//                     onClick={startScanner}
//                     variant="outline"
//                     className="h-11 px-4"
//                     disabled={isScanning}
//                   >
//                     <ScanLine className="h-5 w-5" />
//                   </Button>
//                 </div>

//                 {/* Invoice List */}
//                 <div className="border rounded-lg max-h-96 overflow-y-auto">
//                   {isLoadingInvoices ? (
//                     <div className="flex items-center justify-center p-8">
//                       <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//                       <span className="ml-3 text-slate-600">Loading invoices...</span>
//                     </div>
//                   ) : filteredInvoices.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center p-8 text-center">
//                       <AlertCircle className="h-12 w-12 text-slate-400 mb-3" />
//                       <p className="text-slate-600 font-medium">No invoices found</p>
//                       <p className="text-sm text-slate-500 mt-1">
//                         {searchTerm ? 'Try a different search term' : 'No approved invoices available'}
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="divide-y">
//                       {filteredInvoices.map((invoice) => (
//                         <div
//                           key={invoice.id}
//                           onClick={() => handleSelectInvoice(invoice)}
//                           className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
//                         >
//                           <div className="flex items-start justify-between gap-4">
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center gap-2 mb-2">
//                                 <h4 className="font-semibold text-slate-900 truncate">
//                                   {invoice.Billno}
//                                 </h4>
//                                 <Badge 
//                                   variant="success" 
//                                   className="bg-green-100 text-green-800 text-xs"
//                                 >
//                                   {invoice.approvedstatus}
//                                 </Badge>
//                               </div>
                              
//                               <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
//                                 <div className="truncate">
//                                   <span className="text-slate-500">Supplier:</span>{' '}
//                                   <span className="font-medium text-slate-700">
//                                     {invoice.Suppliername || invoice.companyname}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <span className="text-slate-500">Date:</span>{' '}
//                                   <span className="font-medium text-slate-700">
//                                     {formatDate(invoice.Date)}
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <span className="text-slate-500">Qty:</span>{' '}
//                                   <span className="font-medium text-slate-700">
//                                     {invoice.tQty} gm
//                                   </span>
//                                 </div>
//                                 <div>
//                                   <span className="text-slate-500">Rate:</span>{' '}
//                                   <span className="font-medium text-slate-700">
//                                     {formatCurrency(invoice.pure999Rate)}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               Select
//                             </Button>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Selected Invoice Display */}
//             {selectedInvoice && (
//               <>
//                 <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <CheckCircle className="h-5 w-5 text-green-600" />
//                       <h3 className="font-semibold text-green-900">Selected Invoice</h3>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge variant="success" className="bg-green-600">
//                         {selectedInvoice.approvedstatus}
//                       </Badge>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={handleClearInvoice}
//                         className="h-8"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">Invoice No</span>
//                       <span className="font-semibold text-slate-900">{selectedInvoice.Billno}</span>
//                     </div>
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">Supplier Name</span>
//                       <span className="font-semibold text-slate-900 truncate block">
//                         {selectedInvoice.Suppliername || selectedInvoice.companyname}
//                       </span>
//                     </div>
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">Mobile Number</span>
//                       <span className="font-semibold text-slate-900">{selectedInvoice.mobileNumber}</span>
//                     </div>
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">Invoice Date</span>
//                       <span className="font-semibold text-slate-900">{formatDate(selectedInvoice.Date)}</span>
//                     </div>
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">Approved Qty</span>
//                       <span className="font-semibold text-slate-900">{selectedInvoice.tQty} gm</span>
//                     </div>
//                     <div className="bg-white rounded p-3">
//                       <span className="text-slate-600 block mb-1">999 Rate</span>
//                       <span className="font-semibold text-slate-900">{formatCurrency(selectedInvoice.pure999Rate)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 {/* Reason Selection with Individual Note Types */}
//                 <div className="space-y-4">
//                   <Label className="text-base font-semibold">
//                     Select Reason(s) with Note Type, Amount & Images <span className="text-red-500">*</span>
//                   </Label>
                  
//                   <div className="space-y-4">
//                     {renderReasonCard('rateDifference', 'Rate Difference', 'Price variation adjustment')}
//                     {renderReasonCard('weightDifference', 'Weight Difference', 'Quantity/weight mismatch')}
//                     {renderReasonCard('purchaseReturn', 'Purchase Return', 'Goods returned to supplier', true)}
//                     {renderReasonCard('hallmarkReturn', 'Hallmark Return', 'Hallmarking failure or rejected items', true)}
//                     {renderReasonCard('purityDifference', 'Purity Difference', 'Gold/metal purity mismatch')}
//                   </div>

//                   {/* Total Amounts Display */}
//                   {anyReasonSelected && (() => {
//                     const amounts = calculateAmounts();
//                     return (
//                       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
//                         <h4 className="font-semibold text-slate-900 mb-2">Amount Summary</h4>
//                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                           <div className="bg-white rounded p-3 border-l-4 border-green-500">
//                             <span className="text-xs text-slate-600 block mb-1">Total Debit</span>
//                             <span className="text-lg font-bold text-green-600">
//                               {formatCurrency(amounts.debitTotal)}
//                             </span>
//                           </div>
//                           <div className="bg-white rounded p-3 border-l-4 border-red-500">
//                             <span className="text-xs text-slate-600 block mb-1">Total Credit</span>
//                             <span className="text-lg font-bold text-red-600">
//                               {formatCurrency(amounts.creditTotal)}
//                             </span>
//                           </div>
//                           <div className="bg-white rounded p-3 border-l-4 border-blue-500">
//                             <span className="text-xs text-slate-600 block mb-1">Net Amount</span>
//                             <span className={`text-lg font-bold ${amounts.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                               {formatCurrency(Math.abs(amounts.netTotal))}
//                               <span className="text-xs ml-1">
//                                 ({amounts.netTotal >= 0 ? 'Debit' : 'Credit'})
//                               </span>
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })()}
//                 </div>

//                 {/* Reason Text Area */}
//                 {anyReasonSelected && allSelectedHaveNoteType && (
//                   <>
//                     <Separator />
                    
//                     <div className="space-y-3">
//                       <Label htmlFor="reasonText" className="text-base font-semibold">
//                         Detailed Reason <span className="text-red-500">*</span>
//                       </Label>
//                       <Textarea
//                         id="reasonText"
//                         placeholder="Provide detailed explanation for this note (minimum 10 characters)..."
//                         value={reasonText}
//                         onChange={(e) => {
//                           if (e.target.value.length <= 500) {
//                             setReasonText(e.target.value);
//                           }
//                         }}
//                         rows={4}
//                         className="resize-none"
//                       />
//                       <div className="flex items-center justify-between text-xs">
//                         <span className={reasonText.length < 10 ? 'text-red-500' : 'text-slate-500'}>
//                           Minimum 10 characters required
//                         </span>
//                         <span className="text-slate-500">
//                           {reasonText.length}/500 characters
//                         </span>
//                       </div>
//                     </div>

//                     {/* Additional Supporting Documents */}
//                     <div className="space-y-3">
//                       <Label className="text-base font-semibold">
//                         Additional Supporting Documents (Optional)
//                       </Label>
                      
//                       <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
//                         <input
//                           type="file"
//                           id="fileUpload"
//                           multiple
//                           accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
//                           onChange={handleFileUpload}
//                           className="hidden"
//                           disabled={uploadedFiles.length >= 5}
//                         />
                        
//                         <Label
//                           htmlFor="fileUpload"
//                           className={`flex flex-col items-center ${
//                             uploadedFiles.length >= 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
//                           }`}
//                         >
//                           <Upload className="h-10 w-10 text-slate-400 mb-2" />
//                           <span className="text-sm font-medium text-slate-700">
//                             {uploadedFiles.length >= 5 ? 'Maximum files reached' : 'Click to upload documents'}
//                           </span>
//                           <span className="text-xs text-slate-500 mt-1 text-center">
//                             PDF, JPG, PNG, DOC (Max 5MB each, up to {5 - uploadedFiles.length} more files)
//                           </span>
//                         </Label>
//                       </div>

//                       {uploadedFiles.length > 0 && (
//                         <div className="space-y-2">
//                           <p className="text-sm font-medium text-slate-700">
//                             Uploaded Files ({uploadedFiles.length}/5)
//                           </p>
//                           {uploadedFiles.map((file, index) => (
//                             <div
//                               key={index}
//                               className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
//                             >
//                               <div className="flex items-center space-x-3 flex-1 min-w-0">
//                                 <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
//                                 <div className="flex-1 min-w-0">
//                                   <p className="text-sm font-medium text-slate-900 truncate">
//                                     {file.name}
//                                   </p>
//                                   <p className="text-xs text-slate-500">
//                                     {(file.size / 1024).toFixed(2)} KB
//                                   </p>
//                                 </div>
//                               </div>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeFile(index)}
//                                 className="ml-2 flex-shrink-0 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}

//                 {/* Action Buttons */}
//                 {anyReasonSelected && allSelectedHaveNoteType && (
//                   <>
//                     <Separator />
                    
//                     <div className="flex flex-col sm:flex-row gap-3 pt-2">
//                       <Button
//                         onClick={handleSubmit}
//                         disabled={isSubmitting}
//                         className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//                         size="lg"
//                       >
//                         {isSubmitting ? (
//                           <>
//                             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                             Creating Note...
//                           </>
//                         ) : (
//                           <>
//                             Create Note
//                           </>
//                         )}
//                       </Button>
                      
//                       <Button
//                         variant="outline"
//                         onClick={handleReset}
//                         disabled={isSubmitting}
//                         className="sm:w-32 h-12 border-2"
//                       >
//                         Reset
//                       </Button>
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DebitCreditNotePage;
import React, { useState, useEffect, useRef } from 'react';
import { Search, ScanLine, Upload, X, FileText, Loader2, AlertCircle, CheckCircle, XCircle, ImageIcon, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import axios from 'axios';
import { API } from '../../config/configData';

const DebitCreditNotePage = () => {
  // State Management
  const [invoiceList, setInvoiceList] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  
  // Hardware scanner states
  const [scannerActive, setScannerActive] = useState(false);
  const [scanBuffer, setScanBuffer] = useState('');
  const scanBufferRef = useRef('');
  const scanTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Dynamic reasons from backend
  const [reasonsConfig, setReasonsConfig] = useState([]);
  const [isLoadingReasons, setIsLoadingReasons] = useState(false);
  
  // Form states - Dynamic reasons data
  const [reasonsData, setReasonsData] = useState({});
  
  const [reasonText, setReasonText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reasons and invoices on component mount
  useEffect(() => {
    fetchReasons();
    fetchInvoices();
  }, []);

  // Fetch reasons from backend
  const fetchReasons = async () => {
    setIsLoadingReasons(true);
    try {
      const response = await axios.get(`${API}/debit-credit-reasons`);
      
      // Expected backend response format:
      // {
      //   success: true,
      //   reasons: [
      //     {
      //       id: 1,
      //       key: 'rateDifference',
      //       title: 'Rate Difference',
      //       description: 'Price variation adjustment',
      //       isAutoDebit: false,
      //       isActive: true
      //     },
      //     ...
      //   ]
      // }
      
      const reasons = response.data?.reasons || [];
      
      // Filter only active reasons
      const activeReasons = reasons.filter(reason => reason.isActive !== false);
      
      setReasonsConfig(activeReasons);
      
      // Initialize reasonsData dynamically based on backend reasons
      const initialReasonsData = {};
      activeReasons.forEach(reason => {
        initialReasonsData[reason.key] = {
          id: reason.id,
          selected: false,
          noteType: reason.isAutoDebit ? 'debit' : '',
          amount: '',
          images: [],
          imagePreviews: []
        };
      });
      
      setReasonsData(initialReasonsData);
      
      toast.success(`${activeReasons.length} reasons loaded successfully`);
    } catch (error) {
      console.error('Error fetching reasons:', error);
      toast.error('Failed to load reasons. Using default configuration.');
      
      // Fallback to default reasons if API fails
      const defaultReasons = [
        {
          id: 1,
          key: 'rateDifference',
          title: 'Rate Difference',
          description: 'Price variation adjustment',
          isAutoDebit: false
        },
        {
          id: 2,
          key: 'weightDifference',
          title: 'Weight Difference',
          description: 'Quantity/weight mismatch',
          isAutoDebit: false
        },
        {
          id: 3,
          key: 'purchaseReturn',
          title: 'Purchase Return',
          description: 'Goods returned to supplier',
          isAutoDebit: true
        },
        {
          id: 4,
          key: 'hallmarkReturn',
          title: 'Hallmark Return',
          description: 'Hallmarking failure or rejected items',
          isAutoDebit: true
        },
        {
          id: 5,
          key: 'purityDifference',
          title: 'Purity Difference',
          description: 'Gold/metal purity mismatch',
          isAutoDebit: false
        }
      ];
      
      setReasonsConfig(defaultReasons);
      
      const initialReasonsData = {};
      defaultReasons.forEach(reason => {
        initialReasonsData[reason.key] = {
          id: reason.id,
          selected: false,
          noteType: reason.isAutoDebit ? 'debit' : '',
          amount: '',
          images: [],
          imagePreviews: []
        };
      });
      
      setReasonsData(initialReasonsData);
    } finally {
      setIsLoadingReasons(false);
    }
  };

  // Hardware Scanner - Global keyboard event listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!scannerActive) return;
      
      const isTextInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) && 
                         !e.target.classList.contains('scanner-input');
      
      if (isTextInput) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        
        const scannedData = scanBufferRef.current.trim();
        
        if (scannedData) {
          console.log('Scanned data:', scannedData);
          setSearchTerm(scannedData);
          toast.success('Code scanned successfully!', {
            description: `Scanned: ${scannedData.substring(0, 20)}...`
          });
          
          scanBufferRef.current = '';
          setScanBuffer('');
          setScannerActive(false);
        }
        
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }
        return;
      }

      if (e.key.length > 1 && e.key !== 'Enter') {
        return;
      }

      e.preventDefault();
      scanBufferRef.current += e.key;
      setScanBuffer(scanBufferRef.current);

      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      
      scanTimeoutRef.current = setTimeout(() => {
        if (scanBufferRef.current) {
          const scannedData = scanBufferRef.current.trim();
          console.log('Scanned data (timeout):', scannedData);
          setSearchTerm(scannedData);
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
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, [scannerActive]);

  // Auto-search effect with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredInvoices(invoiceList);
      } else {
        const filtered = invoiceList.filter(invoice => 
          invoice.Billno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.Suppliername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.companyname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.mobileNumber?.includes(searchTerm)
        );
        setFilteredInvoices(filtered);
        
        if (filtered.length === 1 && searchTerm.trim() !== '') {
          handleSelectInvoice(filtered[0]);
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, invoiceList]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(reasonsData).forEach(data => {
        data.imagePreviews?.forEach(preview => URL.revokeObjectURL(preview));
      });
    };
  }, []);

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const response = await axios.get(`${API}/invoice_for_debit_credit_note`);
      
      const invoices = response.data?.result?.[0] || [];
      setInvoiceList(invoices);
      setFilteredInvoices(invoices);
      
      toast.success(`${invoices.length} invoices loaded successfully`);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices. Please try again.');
      setInvoiceList([]);
      setFilteredInvoices([]);
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  // Toggle hardware scanner
  const toggleScanner = () => {
    setScannerActive(!scannerActive);
    scanBufferRef.current = '';
    setScanBuffer('');
    
    if (!scannerActive) {
      toast.info('Scanner activated! Point and scan your barcode/QR code.', {
        duration: 3000
      });
    } else {
      toast.info('Scanner deactivated');
    }
  };

  // Select an invoice
  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setSearchTerm('');
    toast.success('Invoice selected');
  };

  // Clear invoice selection
  const handleClearInvoice = () => {
    setSelectedInvoice(null);
    handleReset();
  };

  // Handle checkbox changes
  const handleReasonChange = (reasonKey, checked) => {
    const reasonConfig = reasonsConfig.find(r => r.key === reasonKey);
    
    setReasonsData(prev => ({
      ...prev,
      [reasonKey]: {
        ...prev[reasonKey],
        selected: checked,
        noteType: checked && reasonConfig?.isAutoDebit ? 'debit' : prev[reasonKey]?.noteType || ''
      }
    }));
  };

  // Handle note type selection for specific reason
  const handleNoteTypeChange = (reason, noteType) => {
    setReasonsData(prev => ({
      ...prev,
      [reason]: {
        ...prev[reason],
        noteType: noteType
      }
    }));
  };

  // Handle amount input for specific reason
  const handleAmountChange = (reason, value) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setReasonsData(prev => ({
        ...prev,
        [reason]: {
          ...prev[reason],
          amount: value
        }
      }));
    }
  };

  // Handle image upload for specific reason
  const handleImageUpload = (reason, e) => {
    const files = Array.from(e.target.files);
    
    const currentImages = reasonsData[reason]?.images || [];
    if (currentImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed per reason');
      return;
    }

    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size: 5MB`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} must be JPG, JPEG, or PNG`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      
      setReasonsData(prev => ({
        ...prev,
        [reason]: {
          ...prev[reason],
          images: [...(prev[reason]?.images || []), ...validFiles],
          imagePreviews: [...(prev[reason]?.imagePreviews || []), ...newPreviews]
        }
      }));
      
      const reasonConfig = reasonsConfig.find(r => r.key === reason);
      toast.success(`${validFiles.length} image(s) added to ${reasonConfig?.title || reason}`);
    }
    
    e.target.value = '';
  };

  // Remove image from specific reason
  const removeImage = (reason, index) => {
    setReasonsData(prev => {
      const updatedImages = prev[reason].images.filter((_, i) => i !== index);
      const updatedPreviews = prev[reason].imagePreviews.filter((_, i) => i !== index);
      
      URL.revokeObjectURL(prev[reason].imagePreviews[index]);
      
      return {
        ...prev,
        [reason]: {
          ...prev[reason],
          images: updatedImages,
          imagePreviews: updatedPreviews
        }
      };
    });
    
    toast.info('Image removed');
  };

  // Handle file upload for supporting documents
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (uploadedFiles.length + files.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 
                           'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size: 5MB`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} has invalid format`);
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) added`);
    }
    
    e.target.value = '';
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.info('File removed');
  };

  // Calculate total amounts by type
  const calculateAmounts = () => {
    let debitTotal = 0;
    let creditTotal = 0;
    
    Object.values(reasonsData).forEach(data => {
      if (data.selected && data.amount && data.noteType) {
        const amount = parseFloat(data.amount);
        if (data.noteType === 'debit') {
          debitTotal += amount;
        } else if (data.noteType === 'credit') {
          creditTotal += amount;
        }
      }
    });
    
    return { debitTotal, creditTotal, netTotal: debitTotal - creditTotal };
  };

  // Validate form before submission
  const validateForm = () => {
    if (!selectedInvoice) {
      toast.error('Please select an invoice');
      return false;
    }

    const selectedReasons = Object.entries(reasonsData).filter(([_, data]) => data.selected);
    if (selectedReasons.length === 0) {
      toast.error('Please select at least one reason');
      return false;
    }

    for (const [reasonKey, data] of selectedReasons) {
      const reasonConfig = reasonsConfig.find(r => r.key === reasonKey);
      const reasonTitle = reasonConfig?.title || reasonKey;
      
      if (!data.amount || parseFloat(data.amount) <= 0) {
        toast.error(`Please enter a valid amount for ${reasonTitle}`);
        return false;
      }
      
      if (!data.noteType) {
        toast.error(`Please select Debit or Credit for ${reasonTitle}`);
        return false;
      }
    }

    if (!reasonText.trim()) {
      toast.error('Please provide a detailed reason');
      return false;
    }

    if (reasonText.trim().length < 10) {
      toast.error('Reason must be at least 10 characters long');
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      formData.append('invoiceId', selectedInvoice.id);
      formData.append('billNo', selectedInvoice.Billno);
      formData.append('supplierName', selectedInvoice.Suppliername || selectedInvoice.companyname);
      formData.append('supplierCode', selectedInvoice.SUP_CODE || '');
      formData.append('mobileNumber', selectedInvoice.mobileNumber);
      formData.append('approvedQty', selectedInvoice.tQty);
      formData.append('invoiceDate', selectedInvoice.Date);
      formData.append('pure999Rate', selectedInvoice.pure999Rate);
      
      const amounts = calculateAmounts();
      formData.append('debitTotal', amounts.debitTotal.toFixed(2));
      formData.append('creditTotal', amounts.creditTotal.toFixed(2));
      formData.append('netTotal', amounts.netTotal.toFixed(2));
      
      const reasonsArray = [];
      Object.entries(reasonsData).forEach(([reasonKey, data]) => {
        if (data.selected) {
          const reasonConfig = reasonsConfig.find(r => r.key === reasonKey);
          
          reasonsArray.push({
            reasonId: data.id,
            reasonKey: reasonKey,
            reasonTitle: reasonConfig?.title || reasonKey,
            noteType: data.noteType,
            amount: parseFloat(data.amount),
            imageCount: data.images.length
          });
          
          data.images.forEach((image, index) => {
            formData.append(
              `${reasonKey}_${data.noteType}_images`, 
              image, 
              `${reasonKey}_${data.noteType}_${index}_${image.name}`
            );
          });
        }
      });
      
      formData.append('reasons', JSON.stringify(reasonsArray));
      formData.append('reasonText', reasonText.trim());
      
      uploadedFiles.forEach((file) => {
        formData.append('supportingDocuments', file, file.name);
      });

      const response = await axios.post(`${API}/debit-credit-notes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const { debitTotal, creditTotal, netTotal } = amounts;
      const netType = netTotal >= 0 ? 'Debit' : 'Credit';
      
      toast.success(
        `Note created successfully!`,
        {
          description: `Note ID: ${response.data.noteId || 'Generated'} | Net ${netType}: ₹${Math.abs(netTotal).toFixed(2)}`,
          duration: 5000,
        }
      );
      
      handleReset();
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    Object.values(reasonsData).forEach(data => {
      data.imagePreviews?.forEach(preview => URL.revokeObjectURL(preview));
    });
    
    setSelectedInvoice(null);
    setSearchTerm('');
    
    // Re-initialize reasonsData from current reasonsConfig
    const resetReasonsData = {};
    reasonsConfig.forEach(reason => {
      resetReasonsData[reason.key] = {
        id: reason.id,
        selected: false,
        noteType: reason.isAutoDebit ? 'debit' : '',
        amount: '',
        images: [],
        imagePreviews: []
      };
    });
    
    setReasonsData(resetReasonsData);
    setReasonText('');
    setUploadedFiles([]);
    toast.info('Form reset');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '₹0.00';
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Check if any reason is selected
  const anyReasonSelected = Object.values(reasonsData).some(data => data.selected);
  
  // Check if all selected reasons have noteType
  const allSelectedHaveNoteType = Object.values(reasonsData)
    .filter(data => data.selected)
    .every(data => data.noteType !== '');

  // Render reason card - DYNAMICALLY from backend
  const renderReasonCard = (reasonConfig) => {
    const { key: reasonKey, title, description, isAutoDebit } = reasonConfig;
    const data = reasonsData[reasonKey];
    
    if (!data) return null;
    
    return (
      <Card key={reasonKey} className={`${data.selected ? 'border-2 border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
        <CardContent className="p-4 space-y-4">
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
              <Label
                htmlFor={reasonKey}
                className="font-medium cursor-pointer leading-none text-base"
              >
                {title}
              </Label>
              <p className="text-xs text-slate-500">
                {description}
              </p>
            </div>
          </div>

          {data.selected && (
            <div className="space-y-4 pl-7">
              {/* Note Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Note Type <span className="text-red-500">*</span>
                  {isAutoDebit && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Auto-set to Debit
                    </Badge>
                  )}
                </Label>
                <RadioGroup 
                  value={data.noteType} 
                  onValueChange={(value) => handleNoteTypeChange(reasonKey, value)}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg ${
                        isAutoDebit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } transition-all ${
                        data.noteType === 'debit'
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => handleNoteTypeChange(reasonKey, 'debit')}
                    >
                      <RadioGroupItem value="debit" id={`${reasonKey}-debit`} />
                      <Label htmlFor={`${reasonKey}-debit`} className={`${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'} text-sm flex items-center gap-1`}>
                        <ArrowUp className="h-3 w-3 text-green-600" />
                        Debit
                      </Label>
                    </div>

                    <div
                      className={`flex items-center space-x-2 p-3 border-2 rounded-lg ${
                        isAutoDebit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                      } transition-all ${
                        data.noteType === 'credit'
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => !isAutoDebit && handleNoteTypeChange(reasonKey, 'credit')}
                    >
                      <RadioGroupItem value="credit" id={`${reasonKey}-credit`} />
                      <Label htmlFor={`${reasonKey}-credit`} className={`${isAutoDebit ? 'cursor-not-allowed' : 'cursor-pointer'} text-sm flex items-center gap-1`}>
                        <ArrowDown className="h-3 w-3 text-red-600" />
                        Credit
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    ₹
                  </span>
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
              {data.noteType && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Upload Images (Max 5)
                    {data.noteType && (
                      <Badge 
                        variant={data.noteType === 'debit' ? 'success' : 'destructive'} 
                        className={`ml-2 text-xs ${data.noteType === 'debit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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
                      <span className="text-xs text-slate-500 mt-1">
                        JPG, PNG (Max 5MB each)
                      </span>
                    </Label>
                  </div>

                  {/* Image Previews */}
                  {data.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 font-medium">
                        {data.images.length} image(s) - {data.noteType === 'debit' ? 'Debit' : 'Credit'} Note
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {data.imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <div className="relative">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                              />
                              <Badge 
                                className={`absolute bottom-1 left-1 text-xs px-1 py-0 ${
                                  data.noteType === 'debit' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-red-600 text-white'
                                }`}
                              >
                                {data.noteType === 'debit' ? 'D' : 'C'}
                              </Badge>
                            </div>
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
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl md:text-xl font-bold text-slate-900 mb-2">
            Debit & Credit Note
          </h1>
        </div>

        {/* Loading Reasons */}
        {isLoadingReasons && (
          <Card className="mb-6 shadow-lg border-slate-200">
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-3 text-slate-600">Loading reasons configuration...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Card */}
        {!isLoadingReasons && (
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle>Invoice Selection</CardTitle>
              <CardDescription>
                Search, scan, or select an approved invoice to create a note
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {/* Invoice Search Section */}
              {!selectedInvoice && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      Search Invoice
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchInvoices}
                      disabled={isLoadingInvoices}
                    >
                      {isLoadingInvoices ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Refresh'
                      )}
                    </Button>
                  </div>
                  
                  {/* Search Input with Hardware Scanner Button */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search by invoice number, supplier name, or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 h-11 scanner-input"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    <Button
                      onClick={toggleScanner}
                      variant={scannerActive ? "default" : "outline"}
                      className={`h-11 px-4 ${scannerActive ? 'bg-green-600 hover:bg-green-700 animate-pulse' : ''}`}
                    >
                      <ScanLine className="h-5 w-5" />
                      {scannerActive && <span className="ml-2 text-xs">Active</span>}
                    </Button>
                  </div>

                  {/* Scanner Status Indicator */}
                  {scannerActive && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3 flex items-center gap-3">
                      <div className="relative">
                        <ScanLine className="h-6 w-6 text-green-600 animate-pulse" />
                        <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full animate-ping"></span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">
                          Hardware Scanner Active
                        </p>
                        <p className="text-xs text-green-700">
                          Point your barcode/QR scanner at the code and scan
                          {scanBuffer && <span className="ml-2 font-mono">({scanBuffer.length} chars...)</span>}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleScanner}
                        className="text-green-900 hover:text-green-700"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Invoice List */}
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
                                  <h4 className="font-semibold text-slate-900 truncate">
                                    {invoice.Billno}
                                  </h4>
                                  <Badge 
                                    variant="success" 
                                    className="bg-green-100 text-green-800 text-xs"
                                  >
                                    {invoice.approvedstatus}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                  <div className="truncate">
                                    <span className="text-slate-500">Supplier:</span>{' '}
                                    <span className="font-medium text-slate-700">
                                      {invoice.Suppliername || invoice.companyname}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Date:</span>{' '}
                                    <span className="font-medium text-slate-700">
                                      {formatDate(invoice.Date)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Qty:</span>{' '}
                                    <span className="font-medium text-slate-700">
                                      {invoice.tQty} gm
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Rate:</span>{' '}
                                    <span className="font-medium text-slate-700">
                                      {formatCurrency(invoice.pure999Rate)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
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

              {/* Selected Invoice Display */}
              {selectedInvoice && (
                <>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-green-900">Selected Invoice</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="success" className="bg-green-600">
                          {selectedInvoice.approvedstatus}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearInvoice}
                          className="h-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">Invoice No</span>
                        <span className="font-semibold text-slate-900">{selectedInvoice.Billno}</span>
                      </div>
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">Supplier Name</span>
                        <span className="font-semibold text-slate-900 truncate block">
                          {selectedInvoice.Suppliername || selectedInvoice.companyname}
                        </span>
                      </div>
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">Mobile Number</span>
                        <span className="font-semibold text-slate-900">{selectedInvoice.mobileNumber}</span>
                      </div>
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">Invoice Date</span>
                        <span className="font-semibold text-slate-900">{formatDate(selectedInvoice.Date)}</span>
                      </div>
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">Approved Qty</span>
                        <span className="font-semibold text-slate-900">{selectedInvoice.tQty} gm</span>
                      </div>
                      <div className="bg-white rounded p-3">
                        <span className="text-slate-600 block mb-1">999 Rate</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(selectedInvoice.pure999Rate)}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Reason Selection - DYNAMICALLY RENDERED FROM BACKEND */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Select Reason(s) with Note Type, Amount & Images <span className="text-red-500">*</span>
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchReasons}
                        disabled={isLoadingReasons}
                      >
                        {isLoadingReasons ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Refresh Reasons'
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {reasonsConfig.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
                          <AlertCircle className="h-12 w-12 text-slate-400 mb-3" />
                          <p className="text-slate-600 font-medium">No reasons available</p>
                          <p className="text-sm text-slate-500 mt-1">
                            Please contact administrator to configure reasons
                          </p>
                        </div>
                      ) : (
                        reasonsConfig.map(reasonConfig => renderReasonCard(reasonConfig))
                      )}
                    </div>

                    {/* Total Amounts Display */}
                    {anyReasonSelected && (() => {
                      const amounts = calculateAmounts();
                      return (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 space-y-3">
                          <h4 className="font-semibold text-slate-900 mb-2">Amount Summary</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white rounded p-3 border-l-4 border-green-500">
                              <span className="text-xs text-slate-600 block mb-1">Total Debit</span>
                              <span className="text-lg font-bold text-green-600">
                                {formatCurrency(amounts.debitTotal)}
                              </span>
                            </div>
                            <div className="bg-white rounded p-3 border-l-4 border-red-500">
                              <span className="text-xs text-slate-600 block mb-1">Total Credit</span>
                              <span className="text-lg font-bold text-red-600">
                                {formatCurrency(amounts.creditTotal)}
                              </span>
                            </div>
                            <div className="bg-white rounded p-3 border-l-4 border-blue-500">
                              <span className="text-xs text-slate-600 block mb-1">Net Amount</span>
                              <span className={`text-lg font-bold ${amounts.netTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(Math.abs(amounts.netTotal))}
                                <span className="text-xs ml-1">
                                  ({amounts.netTotal >= 0 ? 'Debit' : 'Credit'})
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Reason Text Area */}
                  {anyReasonSelected && allSelectedHaveNoteType && (
                    <>
                      <Separator />
                      
                      <div className="space-y-3">
                        <Label htmlFor="reasonText" className="text-base font-semibold">
                          Detailed Reason <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="reasonText"
                          placeholder="Provide detailed explanation for this note (minimum 10 characters)..."
                          value={reasonText}
                          onChange={(e) => {
                            if (e.target.value.length <= 500) {
                              setReasonText(e.target.value);
                            }
                          }}
                          rows={4}
                          className="resize-none"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className={reasonText.length < 10 ? 'text-red-500' : 'text-slate-500'}>
                            Minimum 10 characters required
                          </span>
                          <span className="text-slate-500">
                            {reasonText.length}/500 characters
                          </span>
                        </div>
                      </div>

                      {/* Additional Supporting Documents */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Additional Supporting Documents (Optional)
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
                              {uploadedFiles.length >= 5 ? 'Maximum files reached' : 'Click to upload documents'}
                            </span>
                            <span className="text-xs text-slate-500 mt-1 text-center">
                              PDF, JPG, PNG, DOC (Max 5MB each, up to {5 - uploadedFiles.length} more files)
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
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
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

                  {/* Action Buttons */}
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
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Creating Note...
                            </>
                          ) : (
                            <>
                              Create Note
                            </>
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

