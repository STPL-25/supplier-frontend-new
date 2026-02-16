
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import { API } from "../.././config/configData";
import {
  Check,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  User,
  Phone,
  Scale,
  TrendingUp,
  Clock,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  FileText,
  Download,
  IndianRupee,
} from "lucide-react";
import useSnackbar from "../../CustomHook/useSnackbar";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Helper function to safely parse images
const parseImages = (images) => {
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  }
  return [];
};

function FixOrderApprovalScreen() {
  const { user } = useContext(DashBoardContext);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // PDF viewer states
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);

  const { showSuccess, showError, showWarning, SnackbarComponent } =
    useSnackbar({ duration: 3000 });

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/pending-fix-orders`);

      if (response.data && response.data.length > 0) {
        setPendingOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      showWarning("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  // const handleApprove = async (order) => {
  //   try {
  //     setProcessing(true);
  //     const response = await axios.post(`${API}/approve-fix-order`, {
  //       orderId: order.sno,
  //       approvedBy: user.name,
  //       approvedAt: new Date().toISOString(),
  //     });

  //     showSuccess("Order approved successfully");
  //     if (response.status === 200) fetchPendingOrders();
  //   } catch (error) {
  //     console.error("Error approving order:", error);
  //     showError(error.response?.data?.message || "Failed to approve order");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  const handleApprove = async (order) => {
  try {
    setProcessing(true);
    
    // Optimistically remove from UI immediately
    setPendingOrders(prev => prev.filter(o => o.sno !== order.sno));
    
    const response = await axios.post(`${API}/approve-fix-order`, {
      orderId: order.sno,
      approvedBy: user.name,
      approvedAt: new Date().toISOString(),
    });

    showSuccess("Order approved successfully");
  } catch (error) {
    console.error("Error approving order:", error);
    showError(error.response?.data?.message || "Failed to approve order");
    
    // Revert on error - refetch to restore accurate state
    fetchPendingOrders();
  } finally {
    setProcessing(false);
  }
};

const handleRejectConfirm = async () => {
  if (!rejectReason.trim()) {
    showWarning("Please provide a rejection reason");
    return;
  }

  try {
    setProcessing(true);
    
    // Optimistically remove from UI immediately
    setPendingOrders(prev => prev.filter(o => o.sno !== selectedOrder.sno));
    
    await axios.post(`${API}/reject-fix-order`, {
      orderId: selectedOrder.sno,
      rejectedBy: user,
      rejectedAt: new Date().toISOString(),
      rejectionReason: rejectReason,
    });

    showSuccess("Order rejected successfully");
    setRejectDialogOpen(false);
    setSelectedOrder(null);
    setRejectReason("");
  } catch (error) {
    console.error("Error rejecting order:", error);
    showError(error.response?.data?.message || "Failed to reject order");
    
    // Revert on error
    fetchPendingOrders();
  } finally {
    setProcessing(false);
  }
};


  const handleRejectClick = (order) => {
    setSelectedOrder(order);
    setRejectDialogOpen(true);
    setRejectReason("");
  };

  // const handleRejectConfirm = async () => {
  //   if (!rejectReason.trim()) {
  //     showWarning("Please provide a rejection reason");
  //     return;
  //   }

  //   try {
  //     setProcessing(true);
  //     await axios.post(`${API}/reject-fix-order`, {
  //       orderId: selectedOrder.sno,
  //       rejectedBy: user.name || user.email,
  //       rejectedAt: new Date().toISOString(),
  //       rejectionReason: rejectReason,
  //     });

  //     showSuccess("Order rejected successfully");
  //     setRejectDialogOpen(false);
  //     setSelectedOrder(null);
  //     setRejectReason("");
  //     fetchPendingOrders();
  //   } catch (error) {
  //     console.error("Error rejecting order:", error);
  //     showError(error.response?.data?.message || "Failed to reject order");
  //   } finally {
  //     setProcessing(false);
  //   }
  // };

  const handleImagePreview = (images, index = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(index);
    setImagePreviewOpen(true);
  };

  const handlePdfPreview = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setPageNumber(1);
    setPdfDialogOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < selectedImages.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : selectedImages.length - 1
    );
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfLoading(false);
    showError("Failed to load PDF document");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalAmount = (qty, rate) => {
    const quantity = parseFloat(qty) || 0;
    const rateValue = parseFloat(rate) || 0;
    return (quantity * rateValue).toFixed(2);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
          <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 animate-spin text-blue-600 relative z-10" />
        </div>
        <p className="mt-6 text-slate-600 font-medium animate-pulse text-sm sm:text-base">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto px-3 sm:px-4 lg:px-8 mt-3 sm:mt-5 pb-8 sm:pb-12">
        {pendingOrders.length === 0 ? (
          <Card className="shadow-2xl border-0 overflow-hidden mx-2 sm:mx-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
              <CardContent className="relative text-center py-12 sm:py-20 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4 sm:mb-6">
                  <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
                  All Caught Up!
                </h3>
                <p className="text-base sm:text-lg text-slate-600">
                  No pending orders require approval
                </p>
              </CardContent>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pendingOrders.map((order, index) => {
              const images = parseImages(order.images);
              const totalAmount = calculateTotalAmount(order.total_qty, order.rate);

              return (
                <div
                  key={order.sno}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredCard(order.sno)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 h-full flex flex-col transform hover:-translate-y-1 sm:hover:-translate-y-2">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute inset-[2px] bg-white rounded-[calc(0.5rem-2px)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <CardHeader className="space-y-2 sm:space-y-3 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                        {/* Title Section */}
                        <div className="flex justify-center items-center w-full py-3 sm:py-4">
                          <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-center leading-tight">
                            PO Against Rate Confirmation
                          </h1>
                        </div>

                        {/* PO Number and Actions Row */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent break-words mb-1">
                              PO No -{order.po_no}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              PO Date -{order.poDate}
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                            {/* PDF Viewer Button */}
                            <Button
                              onClick={() => handlePdfPreview(order.poUrlLink)}
                              size="icon"
                              variant="outline"
                              className="h-7 w-7 sm:h-8 sm:w-8 bg-white hover:bg-blue-50 border-blue-200 transition-colors"
                              title="View PDF"
                            >
                              <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                            </Button>

                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300 whitespace-nowrap text-xs px-2 py-0.5">
                              <Clock className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <Separator className="opacity-50" />

                      <CardContent className="flex-grow pt-4 sm:pt-6 space-y-3 sm:space-y-4 px-4 sm:px-6">
                        {/* Supplier and Contact Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-start gap-2 sm:gap-3 group/item">
                            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg mt-0.5 group-hover/item:bg-blue-100 transition-colors duration-300 flex-shrink-0">
                              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-500 mb-0.5">
                                Supplier
                              </p>
                              <p className="text-sm font-semibold text-slate-800 break-words">
                                {order.sup_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 sm:gap-3 group/item">
                            <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg mt-0.5 group-hover/item:bg-emerald-100 transition-colors duration-300 flex-shrink-0">
                              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-500 mb-0.5">
                                Contact
                              </p>
                              <p className="text-sm font-semibold text-slate-800">
                                {order.mobile_no}
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator className="opacity-30" />

                        {/* Metrics Grid - FIXED: Changed to 3 columns consistently */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                          {/* Quantity */}
                          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50 group-hover:border-blue-200 transition-colors duration-300">
                            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                              <Scale className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 flex-shrink-0" />
                              <p className="text-xs text-slate-600">Quantity</p>
                            </div>
                            <p className="text-sm sm:text-base font-bold text-slate-800 break-words">
                              {order.total_qty} g
                            </p>
                          </div>

                          {/* Purity & Rate */}
                          <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100/50 group-hover:border-amber-200 transition-colors duration-300">
                            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 flex-shrink-0" />
                              <p className="text-xs text-slate-600">Purity & Rate</p>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 break-words">
                              {order.gold_data}
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-amber-700 mt-0.5">
                              {formatCurrency(order.rate || 0)}
                            </p>
                          </div>

                          {/* Total Amount */}
                          <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-100/50 group-hover:border-emerald-200 transition-colors duration-300">
                            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                              <IndianRupee className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 flex-shrink-0" />
                              <p className="text-xs text-slate-600">Total</p>
                            </div>
                            <p className="text-sm sm:text-base font-bold text-emerald-700 break-words">
                              {formatCurrency(totalAmount)}
                            </p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="flex items-center gap-2 pt-2">
                          <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-500 break-words">
                            Submitted: {formatDate(order.created_at)}
                          </p>
                        </div>

                        {/* Images Preview */}
                        {images.length > 0 && (
                          <div className="pt-2">
                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <ImageIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 flex-shrink-0" />
                              <p className="text-xs sm:text-sm font-medium text-slate-700">
                                Attachments ({images.length})
                              </p>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                              {images.slice(0, 4).map((image, imgIndex) => (
                                <button
                                  key={imgIndex}
                                  className="relative aspect-square cursor-pointer group/img overflow-hidden rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  onClick={() =>
                                    handleImagePreview(images, imgIndex)
                                  }
                                  aria-label={`View image ${imgIndex + 1}`}
                                >
                                  <img
                                    src={image}
                                    alt={`Order attachment ${imgIndex + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                                    <div className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transform scale-75 group-hover/img:scale-100 transition-transform duration-300">
                                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-slate-700" />
                                    </div>
                                  </div>
                                  {imgIndex === 3 && images.length > 4 && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                      <span className="text-white font-bold text-sm sm:text-lg">
                                        +{images.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="flex gap-2 sm:gap-3 pt-4 sm:pt-6 pb-4 sm:pb-6 px-4 sm:px-6">
                        <Button
                          onClick={() => handleApprove(order)}
                          disabled={processing}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                        >
                          {processing ? (
                            <>
                              <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                              <span className="hidden sm:inline">Processing</span>
                              <span className="sm:hidden">...</span>
                            </>
                          ) : (
                            <>
                              <Check className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleRejectClick(order)}
                          disabled={processing}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm h-9 sm:h-10"
                        >
                          <X className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Reject
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF Viewer Dialog - FIXED: Improved mobile width */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[95vw] sm:max-w-4xl max-h-[90vh] border-0 shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  Purchase Order Document
                </span>
              </div>
              {selectedPdf && (
                <a
                  href={selectedPdf}
                  download
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  Download
                </a>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="relative bg-slate-100 rounded-lg overflow-auto max-h-[70vh]">
            {selectedPdf && (
              <div className="flex flex-col items-center">
                <Document
                  file={selectedPdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                  }
                  error={
                    <div className="flex flex-col items-center justify-center p-8 text-red-600">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p className="text-sm">Failed to load PDF</p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={
                      typeof window !== "undefined"
                        ? Math.min(
                            window.innerWidth - 64,
                            window.innerWidth < 640 ? window.innerWidth * 0.9 : 800
                          )
                        : 800
                    }
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="mx-auto"
                  />
                </Document>

                {numPages && numPages > 1 && (
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 mb-2 flex-wrap">
                    <Button
                      onClick={() =>
                        setPageNumber((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={pageNumber <= 1}
                      size="sm"
                      variant="outline"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>

                    <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                      Page {pageNumber} of {numPages}
                    </span>

                    <Button
                      onClick={() =>
                        setPageNumber((prev) => Math.min(prev + 1, numPages))
                      }
                      disabled={pageNumber >= numPages}
                      size="sm"
                      variant="outline"
                      className="text-xs sm:text-sm h-8 sm:h-9"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Reason Dialog - FIXED: Improved mobile width */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[550px] border-0 shadow-2xl p-4 sm:p-6">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl flex-shrink-0">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-2xl font-bold text-slate-900">
                  Reject Order
                </DialogTitle>
                <DialogDescription className="text-slate-600 mt-1 text-sm break-words">
                  {selectedOrder?.po_no}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="rejection-reason"
                className="text-sm font-semibold text-slate-700"
              >
                Rejection Reason *
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a detailed reason for rejecting this order..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className={`resize-none transition-all duration-300 text-sm ${
                  rejectReason.trim() === ""
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                }`}
              />
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs sm:text-sm transition-colors duration-300 ${
                    rejectReason.trim() === ""
                      ? "text-red-600 font-medium"
                      : "text-slate-500"
                  }`}
                >
                  {rejectReason.trim() === ""
                    ? "⚠ Rejection reason is required"
                    : `${rejectReason.length} characters`}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setRejectDialogOpen(false)}
              disabled={processing}
              variant="outline"
              className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 transition-colors duration-300 text-sm h-9 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectConfirm}
              disabled={processing || !rejectReason.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm h-9 sm:h-10"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[95vw] sm:max-w-5xl border-0 shadow-2xl bg-slate-900 p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-white flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-sm sm:text-base">Image Preview</span>
              </div>
              <Badge className="ml-0 sm:ml-2 bg-white/10 text-white border-0 text-xs">
                {currentImageIndex + 1} of {selectedImages.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="relative bg-slate-800 rounded-lg overflow-hidden">
            {selectedImages.length > 0 && (
              <>
                <div className="relative group">
                  <img
                    src={selectedImages[currentImageIndex]}
                    alt={`Preview ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[60vh] sm:max-h-[75vh] object-contain"
                  />

                  {selectedImages.length > 1 && (
                    <>
                      <Button
                        onClick={handlePrevImage}
                        size="icon"
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-900 shadow-2xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 sm:h-12 sm:w-12"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                      <Button
                        onClick={handleNextImage}
                        size="icon"
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-900 shadow-2xl opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 h-9 w-9 sm:h-12 sm:w-12"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                      </Button>
                    </>
                  )}
                </div>

                {selectedImages.length > 1 && (
                  <div className="p-2 sm:p-4 bg-slate-900">
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                      {selectedImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative flex-shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-md sm:rounded-lg overflow-hidden transition-all duration-300 ${
                            index === currentImageIndex
                              ? "ring-2 sm:ring-4 ring-blue-500 scale-105 sm:scale-110"
                              : "ring-1 sm:ring-2 ring-slate-700 hover:ring-slate-500 opacity-60 hover:opacity-100"
                          }`}
                          aria-label={`View image ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SnackbarComponent />
    </div>
  );
}

export default FixOrderApprovalScreen;

