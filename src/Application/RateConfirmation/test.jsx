// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
// import { API } from "../.././config/configData";
// import {  Check, X, Eye, ChevronLeft, ChevronRight,Loader2, Package, Calendar, User, Phone, Scale,
//    TrendingUp, Clock, Image as ImageIcon, AlertCircle, CheckCircle2,} from "lucide-react";
// import useSnackbar from "../../CustomHook/useSnackbar";

// import { Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
// import {  Dialog,  DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";

// function FixOrderApprovalScreen() {
//   const { user } = useContext(DashBoardContext);
//   const [pendingOrders, setPendingOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");
//   const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [processing, setProcessing] = useState(false);
//   const [useMockData, setUseMockData] = useState(false);
//   const [hoveredCard, setHoveredCard] = useState(null);

//   const { showSuccess, showError, showWarning, showInfo, SnackbarComponent } =
//     useSnackbar({ duration: 3000 });

//   useEffect(() => {
//     fetchPendingOrders();
//   }, []);

//   const fetchPendingOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API}/pending-fix-orders`);

//       if (response.data && response.data.length > 0) {
//         setPendingOrders(response.data);
//         setUseMockData(false);
//       }
//     } catch (error) {
//       console.error("Error fetching pending orders:", error);

//       showWarning("Could not connect to server ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (order) => {
//    console.log(order)
//     try {
//       setProcessing(true);
//       const response=await axios.post(`${API}/approve-fix-order`, {
//         orderId: order.sno,
//         approvedBy: user.name ,
//         approvedAt: new Date().toISOString(),
//       });

//       showSuccess("Order approved successfully");
//       if (response.status===200) fetchPendingOrders();

//     } catch (error) {
//       console.error("Error approving order:", error);
//       showError(error.response?.data?.message || "Failed to approve order");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleRejectClick = (order) => {
//     setSelectedOrder(order);
//     setRejectDialogOpen(true);
//     setRejectReason("");
//   };

//   const handleRejectConfirm = async () => {
//     if (!rejectReason.trim()) {
//       showWarning("Please provide a rejection reason");
//       return;
//     }

//     try {
//       setProcessing(true);
//       console.log(selectedOrder)
//       await axios.post(`${API}/reject-fix-order`, {
//         orderId: selectedOrder.sno,
//         rejectedBy: user.name || user.email,
//         rejectedAt: new Date().toISOString(),
//         rejectionReason: rejectReason,
//       });

//       showSuccess("Order rejected successfully");
//       setRejectDialogOpen(false);
//       setSelectedOrder(null);
//       setRejectReason("");
//       fetchPendingOrders();
//     } catch (error) {
//       console.error("Error rejecting order:", error);
//       showError(error.response?.data?.message || "Failed to reject order");
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const handleImagePreview = (images, index = 0) => {
//     setSelectedImages(images);
//     setCurrentImageIndex(index);
//     setImagePreviewOpen(true);
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev < selectedImages.length - 1 ? prev + 1 : 0
//     );
//   };

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) =>
//       prev > 0 ? prev - 1 : selectedImages.length - 1
//     );
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-IN", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-20 blur-xl animate-pulse"></div>
//           <Loader2 className="h-16 w-16 animate-spin text-blue-600 relative z-10" />
//         </div>
//         <p className="mt-6 text-slate-600 font-medium animate-pulse">
//           Loading orders...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Header Section with Gradient Background */}
// <h1 className="text-2xl m-auto bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50">PO Against Advance Payment</h1>

//       {/* Main Content */}
//       <div className=" mx-auto px-4 sm:px-6 lg:px-8 mt-5 pb-12">
//         {pendingOrders.length === 0 ? (
//           <Card className="shadow-2xl border-0 overflow-hidden">
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50"></div>
//               <CardContent className="relative text-center py-20">
//                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
//                   <CheckCircle2 className="h-10 w-10 text-blue-600" />
//                 </div>
//                 <h3 className="text-2xl font-semibold text-slate-800 mb-2">
//                   All Caught Up!
//                 </h3>
//                 <p className="text-lg text-slate-600">
//                   No pending orders require approval at the moment
//                 </p>
//               </CardContent>
//             </div>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {pendingOrders.map((order, index) => (
//               <div
//                 key={order.sno}
//                 className="group animate-fade-in"
//                 style={{ animationDelay: `${index * 100}ms` }}
//                 onMouseEnter={() => setHoveredCard(order.sno)}
//                 onMouseLeave={() => setHoveredCard(null)}
//               >
//                 <Card className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 h-full flex flex-col transform hover:-translate-y-2">
//                   {/* Gradient Border Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                   <div className="absolute inset-[2px] bg-white rounded-[calc(0.5rem-2px)]"></div>

//                   {/* Animated Background Gradient */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

//                   <div className="relative z-10 flex flex-col h-full">
//                     {/* Header with Icon and Status */}
//                     <CardHeader className="space-y-3 pb-4">
//                       <div className="flex justify-between items-start gap-2">
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-2 mb-2">

//                             <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent wrap-text truncate">
//                               {order.po_no}
//                             </CardTitle>
//                           </div>

//                         </div>
//                         <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md hover:shadow-lg transition-shadow duration-300 whitespace-nowrap">
//                           <Clock className="mr-1 h-3 w-3" />
//                           Pending
//                         </Badge>
//                       </div>
//                     </CardHeader>

//                     <Separator className="opacity-50" />

//                     {/* Order Details */}
//                     <CardContent className="flex-grow pt-6 space-y-4">
//                       {/* Supplier Info with Icon */}
//                       <div className="space-y-3">
//                         <div className="flex items-start gap-3 group/item">
//                           <div className="p-2 bg-blue-50 rounded-lg mt-0.5 group-hover/item:bg-blue-100 transition-colors duration-300">
//                             <User className="h-4 w-4 text-blue-600" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs text-slate-500 mb-0.5">
//                               Supplier
//                             </p>
//                             <p className="text-sm font-semibold text-slate-800 truncate">
//                               {order.sup_name}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex items-start gap-3 group/item">
//                           <div className="p-2 bg-emerald-50 rounded-lg mt-0.5 group-hover/item:bg-emerald-100 transition-colors duration-300">
//                             <Phone className="h-4 w-4 text-emerald-600" />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs text-slate-500 mb-0.5">
//                               Contact
//                             </p>
//                             <p className="text-sm font-semibold text-slate-800">
//                               {order.mobile_no}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <Separator className="opacity-30" />

//                       {/* Metrics Grid */}
//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50 group-hover:border-blue-200 transition-colors duration-300">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Scale className="h-3.5 w-3.5 text-blue-600" />
//                             <p className="text-xs text-slate-600">Quantity</p>
//                           </div>
//                           <p className="text-base font-bold text-slate-800">
//                             {order.total_qty} g
//                           </p>
//                         </div>

//                         <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-100/50 group-hover:border-amber-200 transition-colors duration-300">
//                           <div className="flex items-center gap-2 mb-1">
//                             <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
//                             <p className="text-xs text-slate-600">Purity</p>
//                           </div>
//                           <p className="text-base font-bold text-slate-800">
//                             {order.gold_data}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Rate Badge */}
//                       <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md transform group-hover:scale-[1.02] transition-transform duration-300">
//                         <div className="flex justify-between items-center">
//                           <span className="text-xs font-medium text-emerald-50">
//                             Fixed Rate
//                           </span>
//                           <div className="text-right">
//                             <p className="text-2xl font-bold text-white">
//                               ₹
//                               {order.rate ||""
//                                 }
//                             </p>
//                             <p className="text-xs text-emerald-50">per gram</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Timestamp */}
//                       <div className="flex items-center gap-2 pt-2">
//                         <Clock className="h-3.5 w-3.5 text-slate-400" />
//                         <p className="text-xs text-slate-500">
//                           Submitted: {formatDate(order.created_at)}
//                         </p>
//                       </div>

//                       {/* Images Preview */}
//                       {order.images && order.images.length > 0 && (
//                         <div className="pt-2">
//                           <div className="flex items-center gap-2 mb-3">
//                             <ImageIcon className="h-4 w-4 text-slate-600" />
//                             <p className="text-sm font-medium text-slate-700">
//                               Attachments ({order.images.length})
//                             </p>
//                           </div>
//                           <div className="grid grid-cols-4 gap-2">
//                             {order.images.slice(0, 4).map((image, index) => (
//                               <div
//                                 key={index}
//                                 className="relative aspect-square cursor-pointer group/img overflow-hidden rounded-lg"
//                                 onClick={() =>
//                                   handleImagePreview(order.images, index)
//                                 }
//                               >
//                                 <img
//                                   src={image}
//                                   alt={`Order ${index + 1}`}
//                                   className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
//                                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
//                                   <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transform scale-75 group-hover/img:scale-100 transition-transform duration-300">
//                                     <Eye className="h-4 w-4 text-slate-700" />
//                                   </div>
//                                 </div>
//                                 {index === 3 && order.images.length > 4 && (
//                                   <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
//                                     <span className="text-white font-bold text-lg">
//                                       +{order.images.length - 4}
//                                     </span>
//                                   </div>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>

//                     {/* Action Buttons */}
//                     <CardFooter className="flex gap-3 pt-6 pb-6">
//                       <Button
//                         onClick={() => handleApprove(order)}
//                         disabled={processing}
//                         className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         {processing ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Processing
//                           </>
//                         ) : (
//                           <>
//                             <Check className="mr-2 h-4 w-4" />
//                             Approve
//                           </>
//                         )}
//                       </Button>
//                       <Button
//                         onClick={() => handleRejectClick(order)}
//                         disabled={processing}
//                         className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         <X className="mr-2 h-4 w-4" />
//                         Reject
//                       </Button>
//                     </CardFooter>
//                   </div>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Reject Reason Dialog */}
//       <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
//         <DialogContent className="sm:max-w-[550px] border-0 shadow-2xl">
//           <DialogHeader className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-gradient-to-br from-red-100 to-rose-100 rounded-xl">
//                 <AlertCircle className="h-6 w-6 text-red-600" />
//               </div>
//               <div>
//                 <DialogTitle className="text-2xl font-bold text-slate-900">
//                   Reject Order
//                 </DialogTitle>
//                 <DialogDescription className="text-slate-600 mt-1">
//                   {selectedOrder?.fixPoNumber}
//                 </DialogDescription>
//               </div>
//             </div>
//           </DialogHeader>

//           <Separator />

//           <div className="space-y-4 py-4">

//             <div className="space-y-2">
//               <Label
//                 htmlFor="rejection-reason"
//                 className="text-sm font-semibold text-slate-700"
//               >
//                 Rejection Reason *
//               </Label>
//               <Textarea
//                 id="rejection-reason"
//                 placeholder="Please provide a detailed reason for rejecting this order..."
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 rows={5}
//                 className={`resize-none transition-all duration-300 ${
//                   rejectReason.trim() === ""
//                     ? "border-red-300 focus:border-red-500 focus:ring-red-500"
//                     : "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
//                 }`}
//               />
//               <div className="flex items-center justify-between">
//                 <p
//                   className={`text-sm transition-colors duration-300 ${
//                     rejectReason.trim() === ""
//                       ? "text-red-600 font-medium"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   {rejectReason.trim() === ""
//                     ? "⚠ Rejection reason is required"
//                     : `${rejectReason.length} characters`}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <DialogFooter className="gap-2 sm:gap-0">
//             <Button
//               onClick={() => setRejectDialogOpen(false)}
//               disabled={processing}
//               variant="outline"
//               className="border-slate-300 hover:bg-slate-50 transition-colors duration-300"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleRejectConfirm}
//               disabled={processing || !rejectReason.trim()}
//               className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {processing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Rejecting...
//                 </>
//               ) : (
//                 <>
//                   <X className="mr-2 h-4 w-4" />
//                   Confirm Rejection
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Image Preview Modal */}
//       <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
//         <DialogContent className="max-w-5xl border-0 shadow-2xl bg-slate-900">
//           <DialogHeader>
//             <DialogTitle className="text-white flex items-center gap-2">
//               <ImageIcon className="h-5 w-5" />
//               Image Preview
//               <Badge className="ml-2 bg-white/10 text-white border-0">
//                 {currentImageIndex + 1} of {selectedImages.length}
//               </Badge>
//             </DialogTitle>
//           </DialogHeader>

//           <div className="relative bg-slate-800 rounded-lg overflow-hidden">
//             {selectedImages.length > 0 && (
//               <>
//                 <div className="relative group">
//                   <img
//                     src={selectedImages[currentImageIndex]}
//                     alt={`Preview ${currentImageIndex + 1}`}
//                     className="w-full h-auto max-h-[75vh] object-contain"
//                   />

//                   {/* Image Navigation Overlay */}
//                   {selectedImages.length > 1 && (
//                     <>
//                       <Button
//                         onClick={handlePrevImage}
//                         size="icon"
//                         className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-900 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12"
//                       >
//                         <ChevronLeft className="h-6 w-6" />
//                       </Button>
//                       <Button
//                         onClick={handleNextImage}
//                         size="icon"
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm text-slate-900 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12"
//                       >
//                         <ChevronRight className="h-6 w-6" />
//                       </Button>
//                     </>
//                   )}
//                 </div>

//                 {/* Thumbnail Navigation */}
//                 {selectedImages.length > 1 && (
//                   <div className="p-4 bg-slate-900">
//                     <div className="flex gap-2 overflow-x-auto pb-2">
//                       {selectedImages.map((image, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setCurrentImageIndex(index)}
//                           className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
//                             index === currentImageIndex
//                               ? "ring-4 ring-blue-500 scale-110"
//                               : "ring-2 ring-slate-700 hover:ring-slate-500 opacity-60 hover:opacity-100"
//                           }`}
//                         >
//                           <img
//                             src={image}
//                             alt={`Thumbnail ${index + 1}`}
//                             className="w-full h-full object-cover"
//                           />
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <SnackbarComponent />

//       {/* <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//           opacity: 0;
//         }

//         .bg-grid-white\/10 {
//           background-image: linear-gradient(
//               to right,
//               rgba(255, 255, 255, 0.1) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               to bottom,
//               rgba(255, 255, 255, 0.1) 1px,
//               transparent 1px
//             );
//           background-size: 24px 24px;
//         }
//       `}</style> */}
//     </div>
//   );
// }

// export default FixOrderApprovalScreen;

// import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();