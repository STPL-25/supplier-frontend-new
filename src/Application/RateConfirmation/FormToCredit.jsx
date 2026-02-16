// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
// import { API } from "../.././config/configData";
// import { Paperclip, X, Upload, Check, Eye, ChevronsUpDown } from "lucide-react";
// import useSnackbar from "../../CustomHook/useSnackbar";
// import { Input } from "@/components/ui/input";
// import { useSendToServer } from "../Gold/components/SendToServer";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { cn } from "@/lib/utils";
// import { set } from "lodash";

// function FormToCredit() {
//   const { user } = useContext(DashBoardContext);
//   const { generatePdf, isGenerating, errors: generatePdfError } = useSendToServer({
//     onPdfGenerated: (pdfFile) => {
//       //console.log(pdfFile);
//       //console.log("PDF generated successfully");
//     },
//   });

//   const [formData, setFormData] = useState({
//     Billno: "",
//     fixPoNumber: "",
//     poDate: "",
//     Suppliername: "",
//     mobileNumber: "",
//     tQty: "",
//     cRate: "",
//     PureRate: "",
//     pure999Rate: "",
//     suppCode:''
   
//   });
//   const [files, setFiles] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [selectedOption, setSelectedOption] = useState("999 Rate");
//   const [orderType, setOrderType] = useState("unfix");
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // New state for cascading dropdowns
//   const [pendingSuppliers, setPendingSuppliers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [supplierInvoices, setSupplierInvoices] = useState([]);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [loadingInvoices, setLoadingInvoices] = useState(false);

//   // Popover states
//   const [openSupplier, setOpenSupplier] = useState(false);
//   const [openInvoice, setOpenInvoice] = useState(false);

//   const { showSuccess, showError, showWarning, showInfo, SnackbarComponent } =
//     useSnackbar({ duration: 3000 });

//   // Fetch pending suppliers on component mount
//   // useEffect(() => {
//   //   const fetchPendingSuppliers = async () => {
//   //     try {
//   //       const response = await axios.get(`${API}/pending-suppliers`);
//   //       setPendingSuppliers(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching pending suppliers:", error);
//   //       showError("Failed to load pending suppliers");
//   //     }
//   //   };
//   //   fetchPendingSuppliers();
//   // }, []);
//  useEffect(() => {
//     const fetchBillDetails = async () => {
//       try {
//         const response = await axios.post(`${API}/get_bill_details`,{inv_no:formData.Billno});

//         const results= response.data.result[0];
//         console.log(results)
//         setFormData((prev) => ({
//               ...prev,
//               Suppliername: results[0]?.SUP_NAME ,
//               mobileNumber: results[0]?.mobilenumber,
//               suppCode: results[0]?.SUP_CODE ,
//               tQty: results[0]?.NETWT ,
//         }));
 
//       } catch (error) {
//         console.error("Error fetching pending suppliers:", error);
//         showError("Failed to load pending suppliers");
//       }
//     };
//     fetchBillDetails();
//   }, [formData?.Billno]);
//   console.log(formData)
//   // useEffect(() => {
//   //   const fetchPoDetails = async () => {
//   //     try {
//   //       const response = await axios.get(
//   //         `${API}/gold_Po/get_po_details_for_rate_fixing/${formData.fixPoNumber}`
//   //       );
//   //       const data = response.data;
//   //       setFormData((prev) => ({
//   //         ...prev,
//   //         poDate: data.poDate,
//   //         Suppliername: data.poSupplierName,
//   //         tQty: data.poPureWt,
//   //       }));
//   //     } catch (error) {
//   //       setFormData((prev) => ({
//   //         ...prev,
//   //         poDate: "",
//   //         Suppliername: "",
//   //         tQty: "",
//   //       }));
//   //       console.log(error);
//   //     }
//   //   };
//   //   fetchPoDetails();
//   // }, [formData.fixPoNumber]);

//   // Fetch invoices when supplier is selected
//   useEffect(() => {
//     const fetchSupplierInvoices = async () => {
//       if (selectedSupplier) {
//         setLoadingInvoices(true);
//         try {
//           const response = await axios.get(
//             `${API}/supplier-invoices/${
//               selectedSupplier.id || selectedSupplier.SM_NAME
//             }`
//           );
//           setSupplierInvoices(response.data);
//         } catch (error) {
//           console.error("Error fetching supplier invoices:", error);
//           showError("Failed to load invoices");
//           setSupplierInvoices([]);
//         } finally {
//           setLoadingInvoices(false);
//         }
//       } else {
//         setSupplierInvoices([]);
//         setSelectedInvoice(null);
//       }
//     };
//     fetchSupplierInvoices();
//   }, [selectedSupplier]);

//   // Auto-fill form when invoice is selected
//   // useEffect(() => {
//   //   if (selectedInvoice) {
//   //     setFormData({
//   //       Billno: selectedInvoice.billNo || "",
//   //       fixPoNumber: selectedInvoice.fixPoNumber || "",
//   //       poDate: selectedInvoice.poDate || "",
//   //       Suppliername:
//   //         selectedInvoice.supplierName || selectedSupplier?.SM_NAME || "",
//   //       mobileNumber: selectedInvoice.mobileNumber || "",
//   //       tQty: selectedInvoice.totalQty || "",
//   //       cRate: selectedInvoice.rate995 || "",
//   //       PureRate: selectedInvoice.rate999 || "",
//   //       pure999Rate: selectedInvoice.rate9999 || "",
//   //     });

//   //     // Set the gold purity option based on invoice data
//   //     if (selectedInvoice.goldPurity) {
//   //       setSelectedOption(selectedInvoice.goldPurity);
//   //     } else if (selectedInvoice.rate9999) {
//   //       setSelectedOption("9999 Rate");
//   //     } else if (selectedInvoice.rate999) {
//   //       setSelectedOption("999 Rate");
//   //     } else if (selectedInvoice.rate995) {
//   //       setSelectedOption("995 Rate");
//   //     }

//   //     // Set order type if available
//   //     if (selectedInvoice.orderType) {
//   //       setOrderType(selectedInvoice.orderType);
//   //     }

//   //     // Clear field errors when auto-filling
//   //     setFieldErrors({});
//   //   }
//   // }, [selectedInvoice, selectedSupplier]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let formattedValue = value;

//     switch (name) {
//       case "mobileNumber":
//         formattedValue = value.replace(/\D/g, "").slice(0, 10);
//         break;
//       case "PureRate":
//       case "cRate":
//       case "pure999Rate":
//         formattedValue = value.replace(/\D/g, "").slice(0, 5);
//         break;
//       case "Billno":
//         const parts = value.split("|");
//         if (parts.length === 2) {
//           const beforePipe = parts[0].replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
//           const afterPipe = parts[1].replace(/[^0-9\/\-_\.]/g, "");
//           formattedValue = `${beforePipe}|${afterPipe}`;
//         } else {
//           formattedValue = parts[0].replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
//         }
//         break;
//       case "fixPoNumber":
//         formattedValue = value.replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
//         break;
//       case "poDate":
//         formattedValue = value.replace(/[^0-9\/]/g, "");
//         break;
//       default:
//         formattedValue = value;
//     }

//     const validInput =
//       name === "tQty" ? /^-?\d*\.?\d{0,3}$/.test(formattedValue) : true;

//     if (validInput || value === "") {
//       setFormData({
//         ...formData,
//         [name]: formattedValue,
//       });

//       const error = validateField(name, formattedValue);
//       if (!error) {
//         setFieldErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors[name];
//           return newErrors;
//         });
//       } else {
//         setFieldErrors((prev) => ({
//           ...prev,
//           [name]: error,
//         }));
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const newFiles = [...files, ...selectedFiles];
//     setFiles(newFiles);
//     if (newFiles.length > 0) {
//       setFieldErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.files;
//         return newErrors;
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();

//     try {
//       const formDataToSend = new FormData();

//       formDataToSend.append("orderType", orderType);

//       if (orderType === "fix") {
//         formDataToSend.append(
//           "fixPoNumber",
//           formData.fixPoNumber.replace(/\s+/g, "")
//         );
//         formDataToSend.append("poDate", formData.poDate);
//         formDataToSend.append("Billno", "");
//       } else {
//         formDataToSend.append("Billno", formData.Billno.replace(/\s+/g, ""));
//         formDataToSend.append("fixPoNumber", "");
//         formDataToSend.append("poDate", "");
//       }
   
//       formDataToSend.append("rateEntryDate", new Date().toISOString());
//       formDataToSend.append("rateEntriedBy", user || "");

//       formDataToSend.append("Suppliername", formData.Suppliername);
//       formDataToSend.append("mobileNumber", formData.mobileNumber);
//       formDataToSend.append("goldRate", selectedOption);
//       formDataToSend.append("tQty", formData.tQty);

//       selectedOption === "9999 Rate"
//         ? formDataToSend.append("pure999Rate", formData.pure999Rate)
//         : formDataToSend.append("pure999Rate", "");

//       selectedOption === "999 Rate"
//         ? formDataToSend.append("PureRate", formData.PureRate)
//         : formDataToSend.append("PureRate", "");

//       selectedOption === "995 Rate"
//         ? formDataToSend.append("cRate", formData.cRate)
//         : formDataToSend.append("cRate", "");

//       files.forEach((file) => {
//         formDataToSend.append("images", file);
//       });

//       let res;
//       if (orderType === "fix") {
//         res = await axios.post(`${API}/po_datapost`, formDataToSend);
//         const filteredItems = res.data.findPoDatas;
//         const poData = res.data.poData;
//         const orderTypes = res.data.orderTypes;
//         const poType = res.data.poType;

//         const pdfGenerated = await generatePdf(
//           filteredItems,
//           poData,
//           orderTypes,
//           poType.trim()
//         );
//         console.log(pdfGenerated);
//         showSuccess("Data Saved Successfully");
//       } else {
//         res = await axios.post(`${API}/datapost`, formDataToSend);
//         showSuccess("Data Saved Successfully");
//       }
//       console.log(res.data);

//       if (res.status === 200) {
//         handleCancel(e);
//       }
//     } catch (error) {
//       showError(error.response?.data?.message || "Failed to submit form");
//     } finally {
//       setFormData({
//         Billno: "",
//         fixPoNumber: "",
//         poDate: "",
//         Suppliername: "",
//         mobileNumber: "",
//         tQty: "",
//         cRate: "",
//         PureRate: "",
//         pure999Rate: "",
//       });
//     }
//     setFiles([]);
//     setFieldErrors({});
//   };

//   const validateField = (name, value) => {
//     const stringValue = value != null ? String(value) : "";

//     switch (name) {
//       case "Suppliername":
//         if (!stringValue.trim()) return "Supplier name is required";
//         return "";

//       case "Billno":
//         if (orderType === "unfix") {
//           if (!stringValue.trim()) return "Bill number is required";
//           if (stringValue.includes("|")) {
//             const [billNo, date] = stringValue.split("|");
//             if (!billNo.trim()) return "Bill number is required";
//             if (!date.trim()) return "Date is required";
//             if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date))
//               return "Invalid date format (DD/MM/YYYY)";
//           }
//         }
//         return "";

//       case "fixPoNumber":
//         if (orderType === "fix" && !stringValue.trim())
//           return "PO number is required";
//         return "";

//       case "poDate":
//         if (orderType === "fix") {
//           if (!stringValue.trim()) return "PO date is required";
//           if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(stringValue))
//             return "Invalid date format (DD/MM/YYYY)";
//         }
//         return "";

//       case "mobileNumber":
//         if (!stringValue.trim()) return "Mobile number is required";
//         if (!/^\d{10}$/.test(stringValue)) return "Must be 10 digits";
//         return "";

//       case "tQty":
//         if (!stringValue.trim()) return "Quantity is required";
//         if (isNaN(stringValue) || parseFloat(stringValue) <= 0)
//           return "Must be a positive number";
//         if (!/^\d*\.?\d{0,3}$/.test(stringValue)) return "Max 3 decimal places";
//         return "";

//       case "pure999Rate":
//       case "PureRate":
//       case "cRate":
//         if (!stringValue.trim()) return "Rate is required";
//         if (isNaN(stringValue) || parseInt(stringValue) <= 0)
//           return "Must be a positive number";
//         if (stringValue.length > 5) return "Maximum 5 digits allowed";
//         return "";

//       default:
//         return "";
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
//     Object.keys(formData).forEach((key) => {
//       if (orderType === "fix" && key === "Billno") return;
//       if (orderType === "unfix" && (key === "fixPoNumber" || key === "poDate"))
//         return;

//       if (
//         selectedOption === "999 Rate" &&
//         (key === "cRate" || key === "pure999Rate")
//       )
//         return;
//       if (
//         selectedOption === "995 Rate" &&
//         (key === "PureRate" || key === "pure999Rate")
//       )
//         return;
//       if (
//         selectedOption === "9999 Rate" &&
//         (key === "PureRate" || key === "cRate")
//       )
//         return;

//       const error = validateField(key, formData[key]);
//       if (error) errors[key] = error;
//     });

//     if (files.length === 0) {
//       errors.files = "At least one image is required";
//       showWarning("At least one image is required");
//     }

//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleCancel = (e) => {
//     e.preventDefault();
//     setFiles([]);
//     setFormData({
//       Billno: "",
//       fixPoNumber: "",
//       poDate: "",
//       Suppliername: "",
//       mobileNumber: "",
//       tQty: "",
//       cRate: "",
//       PureRate: "",
//       pure999Rate: "",
//     });
//     setErrors({});
//     setSelectedOption("999 Rate");
//     setOrderType("unfix");
//     setSelectedSupplier(null);
//     setSelectedInvoice(null);
//     setSupplierInvoices([]);
//     setFieldErrors({});
//   };

//   const handleChange = (event) => {
//     const newSelectedOption = event.target.value;
//     setSelectedOption(newSelectedOption);

//     if (newSelectedOption === "999 Rate") {
//       setFormData({ ...formData, cRate: "", pure999Rate: "" });
//     }
//     if (newSelectedOption === "995 Rate") {
//       setFormData({ ...formData, PureRate: "", pure999Rate: "" });
//     }
//     if (newSelectedOption === "9999 Rate") {
//       setFormData({ ...formData, PureRate: "", cRate: "" });
//     }
//   };

//   const handleOrderTypeChange = (event) => {
//     const newOrderType = event.target.value;
//     setOrderType(newOrderType);

//     if (newOrderType === "fix") {
//       setFormData({ ...formData, Billno: "" });
//       setFieldErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.Billno;
//         return newErrors;
//       });
//     } else {
//       setFormData({ ...formData, fixPoNumber: "", poDate: "" });
//       setFieldErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.fixPoNumber;
//         delete newErrors.poDate;
//         return newErrors;
//       });
//     }
//   };

//   const handleDelete = (i) => {
//     const selectedFiles = [...files.slice(0, i), ...files.slice(i + 1)];
//     setFiles(selectedFiles);
//     document.getElementById("dropzone-file").value = "";
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const droppedFiles = Array.from(event.dataTransfer.files);
//     setFiles(droppedFiles);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-3 sm:p-6 md:p-10">
//       <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl bg-white shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8">
//         <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-800 mb-4 sm:mb-6">
//            Rate Fixing Form
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//           {/* Order Type Radio Buttons */}
//           <div className="mb-3 sm:mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Order Type
//             </label>
//             <div className="flex space-x-4 sm:space-x-6">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="orderType"
//                   value="unfix"
//                   checked={orderType === "unfix"}
//                   onChange={handleOrderTypeChange}
//                   className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
//                 />
//                 <span className="ml-2 text-sm sm:text-base text-gray-700">Unfix</span>
//               </label>
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="radio"
//                   name="orderType"
//                   value="fix"
//                   checked={orderType === "fix"}
//                   onChange={handleOrderTypeChange}
//                   className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
//                 />
//                 <span className="ml-2 text-sm sm:text-base text-gray-700">Fix</span>
//               </label>
//             </div>
//           </div>

//           {/* Cascading Dropdowns - Mobile First */}
//           {orderType === "unfix" && (
//             <div className="space-y-3 sm:space-y-4">
//               {/* Pending Suppliers Combobox */}
//               {/* <div className="w-full">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Pending Supplier
//                 </label>
//                 <Popover open={openSupplier} onOpenChange={setOpenSupplier}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={openSupplier}
//                       className="w-full justify-between h-10 text-sm"
//                     >
//                       {selectedSupplier
//                         ? selectedSupplier.SM_NAME ||
//                           selectedSupplier.supplierName
//                         : "Choose supplier..."}
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0">
//                     <Command>
//                       <CommandInput placeholder="Search supplier..." />
//                       <CommandList>
//                         <CommandEmpty>No supplier found.</CommandEmpty>
//                         <CommandGroup>
//                           {pendingSuppliers.map((supplier) => (
//                             <CommandItem
//                               key={supplier.id || supplier.SM_NAME}
//                               value={
//                                 supplier.SM_NAME || supplier.supplierName
//                               }
//                               onSelect={() => {
//                                 setSelectedSupplier(supplier);
//                                 setSelectedInvoice(null);
//                                 setOpenSupplier(false);
//                               }}
//                             >
//                               {supplier.SM_NAME || supplier.supplierName}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div> */}

//               {/* Invoices Combobox */}
//               <div className="w-full">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Invoice
//                 </label>
//                 <Popover open={openInvoice} onOpenChange={setOpenInvoice}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={openInvoice}
//                       disabled={!selectedSupplier || loadingInvoices}
//                       className="w-full justify-between h-10 text-sm"
//                     >
//                       {selectedInvoice
//                         ? `${selectedInvoice.billNo || ""} - ${
//                             selectedInvoice.date || ""
//                           }`
//                         : selectedSupplier
//                         ? "Choose invoice..."
//                         : "Select supplier first"}
//                       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0">
//                     <Command>
//                       <CommandInput placeholder="Search invoice..." />
//                       <CommandList>
//                         <CommandEmpty>
//                           {loadingInvoices
//                             ? "Loading..."
//                             : "No invoice found."}
//                         </CommandEmpty>
//                         <CommandGroup>
//                           {supplierInvoices.map((invoice) => (
//                             <CommandItem
//                               key={invoice.id || invoice.billNo}
//                               value={`${invoice.billNo} ${invoice.date}`}
//                               onSelect={() => {
//                                 setSelectedInvoice(invoice);
//                                 setOpenInvoice(false);
//                               }}
//                             >
//                               {`${invoice.billNo || ""} - ${
//                                 invoice.date || ""
//                               }`}
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//           )}

//           {/* Conditional Fields Based on Order Type - Mobile First */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             {orderType === "unfix" ? (
//               <div className="w-full">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Bill No | Date
//                 </label>
//                 <Input
//                   type="text"
//                   name="Billno"
//                   placeholder="Enter Bill No"
//                   value={formData.Billno}
//                   onChange={handleInputChange}
//                   className={cn(
//                     "w-full",
//                     fieldErrors.Billno &&
//                       "border-red-500 focus-visible:ring-red-500"
//                   )}
//                 />
//                 {fieldErrors.Billno && (
//                   <p className="mt-1 text-xs sm:text-sm text-red-500">
//                     {fieldErrors.Billno}
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="w-full">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PO Number
//                   </label>
//                   <Input
//                     type="text"
//                     name="fixPoNumber"
//                     placeholder="Enter PO Number"
//                     value={formData.fixPoNumber}
//                     onChange={handleInputChange}
//                     className={cn(
//                       "w-full",
//                       fieldErrors.fixPoNumber &&
//                         "border-red-500 focus-visible:ring-red-500"
//                     )}
//                   />
//                   {fieldErrors.fixPoNumber && (
//                     <p className="mt-1 text-xs sm:text-sm text-red-500">
//                       {fieldErrors.fixPoNumber}
//                     </p>
//                   )}
//                 </div>
//                 <div className="w-full">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     PO Date
//                   </label>
//                   <Input
//                     type="text"
//                     name="poDate"
//                     placeholder="DD/MM/YYYY"
//                     value={formData.poDate}
//                     onChange={handleInputChange}
//                     maxLength={10}
//                     className={cn(
//                       "w-full",
//                       fieldErrors.poDate &&
//                         "border-red-500 focus-visible:ring-red-500"
//                     )}
//                   />
//                   {fieldErrors.poDate && (
//                     <p className="mt-1 text-xs sm:text-sm text-red-500">
//                       {fieldErrors.poDate}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}

//             {orderType === "unfix" && (
//               <div className="w-full">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Supplier Name
//                 </label>
//                 <Input
//                   type="text"
//                   name="Suppliername"
//                   placeholder="Enter Supplier Name"
//                   value={formData.Suppliername}
//                   onChange={handleInputChange}
//                   className={cn(
//                     "w-full",
//                     fieldErrors.Suppliername &&
//                       "border-red-500 focus-visible:ring-red-500"
//                   )}
//                 />
//                 {fieldErrors.Suppliername && (
//                   <p className="mt-1 text-xs sm:text-sm text-red-500">
//                     {fieldErrors.Suppliername}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {orderType === "fix" && (
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Supplier Name
//               </label>
//               <Input
//                 type="text"
//                 name="Suppliername"
//                 placeholder="Enter Supplier Name"
//                 value={formData.Suppliername}
//                 onChange={handleInputChange}
//                 className={cn(
//                   "w-full",
//                   fieldErrors.Suppliername &&
//                     "border-red-500 focus-visible:ring-red-500"
//                 )}
//               />
//               {fieldErrors.Suppliername && (
//                 <p className="mt-1 text-xs sm:text-sm text-red-500">
//                   {fieldErrors.Suppliername}
//                 </p>
//               )}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Mobile Number
//               </label>
//               <Input
//                 type="tel"
//                 name="mobileNumber"
//                 placeholder="Phone Number"
//                 value={formData.mobileNumber}
//                 onChange={handleInputChange}
//                 maxLength={10}
//                 className={cn(
//                   "w-full",
//                   fieldErrors.mobileNumber &&
//                     "border-red-500 focus-visible:ring-red-500"
//                 )}
//               />
//               {fieldErrors.mobileNumber && (
//                 <p className="mt-1 text-xs sm:text-sm text-red-500">
//                   {fieldErrors.mobileNumber}
//                 </p>
//               )}
//             </div>

//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Total Qty In Pure-Grams
//               </label>
//               <Input
//                 type="text"
//                 name="tQty"
//                 placeholder="Enter Qty in g"
//                 value={formData.tQty}
//                 onChange={handleInputChange}
//                 className={cn(
//                   "w-full",
//                   fieldErrors.tQty &&
//                     "border-red-500 focus-visible:ring-red-500"
//                 )}
//               />
//               {fieldErrors.tQty && (
//                 <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldErrors.tQty}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
//             <div className="w-full">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Gold Purity
//               </label>
//               <select
//                 value={selectedOption}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 text-sm"
//               >
//                 <option value="995 Rate">995 Rate</option>
//                 <option value="999 Rate">999 Rate</option>
//                 <option value="9999 Rate">9999 Rate</option>
//               </select>
//             </div>

//             <div className="w-full">
//               {selectedOption === "9999 Rate" && (
//                 <>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Wt 9999 Rate
//                   </label>
//                   <Input
//                     type="text"
//                     name="pure999Rate"
//                     placeholder="Enter 9999 Rate"
//                     value={formData.pure999Rate}
//                     onChange={handleInputChange}
//                     maxLength={5}
//                     className={cn(
//                       "w-full",
//                       fieldErrors.pure999Rate &&
//                         "border-red-500 focus-visible:ring-red-500"
//                     )}
//                   />
//                   {fieldErrors.pure999Rate && (
//                     <p                     className="mt-1 text-xs sm:text-sm text-red-500">
//                       {fieldErrors.pure999Rate}
//                     </p>
//                   )}
//                 </>
//               )}

//               {selectedOption === "999 Rate" && (
//                 <>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Wt 999 Rate
//                   </label>
//                   <Input
//                     type="text"
//                     name="PureRate"
//                     placeholder="Enter 999 Rate"
//                     value={formData.PureRate}
//                     onChange={handleInputChange}
//                     maxLength={5}
//                     className={cn(
//                       "w-full",
//                       fieldErrors.PureRate &&
//                         "border-red-500 focus-visible:ring-red-500"
//                     )}
//                   />
//                   {fieldErrors.PureRate && (
//                     <p className="mt-1 text-xs sm:text-sm text-red-500">
//                       {fieldErrors.PureRate}
//                     </p>
//                   )}
//                 </>
//               )}

//               {selectedOption === "995 Rate" && (
//                 <>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Wt 995 Rate
//                   </label>
//                   <Input
//                     type="text"
//                     name="cRate"
//                     placeholder="Enter 995 Rate"
//                     value={formData.cRate}
//                     onChange={handleInputChange}
//                     maxLength={5}
//                     className={cn(
//                       "w-full",
//                       fieldErrors.cRate &&
//                         "border-red-500 focus-visible:ring-red-500"
//                     )}
//                   />
//                   {fieldErrors.cRate && (
//                     <p className="mt-1 text-xs sm:text-sm text-red-500">
//                       {fieldErrors.cRate}
//                     </p>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* File Upload Section - Mobile Optimized */}
//           <div
//             className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center ${
//               fieldErrors.files ? "border-red-500" : "border-gray-300"
//             }`}
//             onDragOver={handleDragOver}
//             onDrop={handleDrop}
//           >
//             <input
//               type="file"
//               id="dropzone-file"
//               multiple
//               className="hidden"
//               onChange={handleImageChange}
//             />
//             <label
//               htmlFor="dropzone-file"
//               className="cursor-pointer flex flex-col items-center justify-center space-y-2"
//             >
//               <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
//               <p className="text-sm sm:text-base text-gray-600">
//                 Click to upload or drag and drop files
//               </p>
//               <p className="text-xs text-gray-500">
//                 SVG, PNG, JPG (Max 2 files)
//               </p>
//             </label>
//           </div>

//           {/* Image Preview Grid - Mobile Optimized */}
//           {files.length > 0 && (
//             <div className="w-full">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
//                 {files.map((file, index) => (
//                   <div key={index} className="relative group aspect-square">
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`Uploaded ${index + 1}`}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                     <div className="absolute top-1 right-1 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setSelectedImage(URL.createObjectURL(file));
//                           setIsModalOpen(true);
//                         }}
//                         className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
//                         aria-label="Preview image"
//                       >
//                         <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => handleDelete(index)}
//                         className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
//                         aria-label="Delete image"
//                       >
//                         <X className="w-3 h-3 sm:w-4 sm:h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Image Preview Modal - Mobile Optimized */}
//               {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
//                   <div className="bg-white rounded-lg p-3 sm:p-4 max-w-full sm:max-w-3xl max-h-[90vh] w-full relative overflow-hidden">
//                     <button
//                       type="button"
//                       onClick={() => setIsModalOpen(false)}
//                       className="absolute top-2 right-2 bg-gray-100 rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 z-10"
//                       aria-label="Close preview"
//                     >
//                       <X className="w-5 h-5 sm:w-6 sm:h-6" />
//                     </button>
//                     <img
//                       src={selectedImage}
//                       alt="Preview"
//                       className="w-full h-auto max-h-[80vh] object-contain"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//           {fieldErrors.files && (
//             <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldErrors.files}</p>
//           )}

//           {/* Action Buttons - Mobile Optimized */}
//           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
//             <button
//               type="submit"
//               className="w-full flex-1 bg-blue-600 text-white py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base font-medium"
//             >
//               <Check className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Submit
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="w-full flex-1 bg-red-500 text-white py-2.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base font-medium"
//             >
//               <X className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//       <SnackbarComponent />
//     </div>
//   );
// }

// export default FormToCredit;
import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import { API } from "../.././config/configData";
import { Paperclip, X, Upload, Check, Eye, ChevronsUpDown, QrCode, Camera } from "lucide-react";
import useSnackbar from "../../CustomHook/useSnackbar";
import { Input } from "@/components/ui/input";
import { useSendToServer } from "../Gold/components/SendToServer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Html5Qrcode } from 'html5-qrcode';


function FormToCredit() {
  const { user } = useContext(DashBoardContext);
  const { generatePdf, isGenerating, errors: generatePdfError } = useSendToServer({
    onPdfGenerated: (pdfFile) => {
      //console.log(pdfFile);
      //console.log("PDF generated successfully");
    },
  });

  const [formData, setFormData] = useState({
    Billno: "",
    fixPoNumber: "",
    poDate: "",
    Suppliername: "",
    mobileNumber: "",
    smsSendUserName: "",
    tQty: "",
    cRate: "",
    PureRate: "",
    pure999Rate: "",
    suppCode: ''
  });
  const [files, setFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState("999 Rate");
  const [orderType, setOrderType] = useState("unfix");
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New states for mobile number selection
  const [mobileOptions, setMobileOptions] = useState([]);
  const [openMobile, setOpenMobile] = useState(false);

  // QR Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const html5QrCodeRef = useRef(null);
  const scannerRegionId = "qr-reader";

  const { showSuccess, showError, showWarning, showInfo, SnackbarComponent } =
    useSnackbar({ duration: 3000 });

  useEffect(() => {
    const fetchBillDetails = async () => {
      if (!formData.Billno) return;
      
      try {
        const response = await axios.post(`${API}/get_bill_details`, { inv_no: formData.Billno });
        const results = response.data.result[0];
        console.log(results);

        if (results && results.length > 0) {
          const billData = results[0];
          
          // Create mobile options array from the bill data
          const options = [];
          
          if (billData.mobilenumber && billData.SUP_NAME) {
            options.push({
              mobile: billData.mobilenumber,
              name: billData.SUP_NAME,
              role: "Supplier"
            });
          }
          
          if (billData.accmobile && billData.accname) {
            options.push({
              mobile: billData.accmobile,
              name: billData.accname,
              role: "Account"
            });
          }
          
          if (billData.bomobile && billData.boname) {
            options.push({
              mobile: billData.bomobile,
              name: billData.boname,
              role: "Business Owner"
            });
          }
          
          if (billData.ownermobile && billData.ownername) {
            options.push({
              mobile: billData.ownermobile,
              name: billData.ownername,
              role: "Owner"
            });
          }

          setMobileOptions(options);

          setFormData((prev) => ({
            ...prev,
            Suppliername: billData.SUP_NAME || "",
            mobileNumber: billData.mobilenumber || "",
            smsSendUserName: billData.SUP_NAME || "",
            suppCode: billData.SUP_CODE || "",
            tQty: billData.NETWT || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching pending suppliers:", error);
        showError("Failed to load bill details");
      }
    };
    fetchBillDetails();
  }, [formData?.Billno]);

  // Cleanup QR scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(err => console.error("Scanner cleanup error:", err));
        html5QrCodeRef.current.clear().catch(err => console.error("Scanner clear error:", err));
      }
    };
  }, []);

  const startQrScanner = async () => {
    setIsScanning(true);
    
    // Wait for DOM to render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Check if element exists
      const element = document.getElementById(scannerRegionId);
      if (!element) {
        throw new Error("Scanner container not found in DOM");
      }

      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerRegionId);
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          // QR Code successfully scanned
          console.log("QR Code scanned:", decodedText);
          
          setFormData(prev => ({
            ...prev,
            Billno: decodedText
          }));
          
          // Clear error if any
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.Billno;
            return newErrors;
          });

          showSuccess(`Bill No scanned: ${decodedText}`);
          stopQrScanner();
        },
        (errorMessage) => {
          // Parsing error, ignore (this fires continuously)
        }
      );

    } catch (err) {
      console.error("Unable to start scanner:", err);
      showError(err.message || "Failed to start camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopQrScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case "mobileNumber":
        formattedValue = value.replace(/\D/g, "").slice(0, 10);
        break;
      case "PureRate":
      case "cRate":
      case "pure999Rate":
        formattedValue = value.replace(/\D/g, "").slice(0, 5);
        break;
      case "Billno":
        const parts = value.split("|");
        if (parts.length === 2) {
          const beforePipe = parts[0].replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
          const afterPipe = parts[1].replace(/[^0-9\/\-_\.]/g, "");
          formattedValue = `${beforePipe}|${afterPipe}`;
        } else {
          formattedValue = parts[0].replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
        }
        break;
      case "fixPoNumber":
        formattedValue = value.replace(/[^0-9a-zA-Z\/\-_\.]/g, "");
        break;
      case "poDate":
        formattedValue = value.replace(/[^0-9\/]/g, "");
        break;
      default:
        formattedValue = value;
    }

    const validInput =
      name === "tQty" ? /^-?\d*\.?\d{0,3}$/.test(formattedValue) : true;

    if (validInput || value === "") {
      setFormData({
        ...formData,
        [name]: formattedValue,
      });

      const error = validateField(name, formattedValue);
      if (!error) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    if (newFiles.length > 0) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.files;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    console.log(formData);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("orderType", orderType);
      formDataToSend.append("suppCode", formData.suppCode);

      if (orderType === "fix") {
        formDataToSend.append(
          "fixPoNumber",
          formData.fixPoNumber.replace(/\s+/g, "")
        );
        formDataToSend.append("poDate", formData.poDate);
        formDataToSend.append("Billno", "");
      } else {
        formDataToSend.append("Billno", formData.Billno.replace(/\s+/g, ""));
        formDataToSend.append("fixPoNumber", "");
        formDataToSend.append("poDate", "");
      }

      formDataToSend.append("rateEntryDate", new Date().toISOString());
      formDataToSend.append("rateEntriedBy", user || "");

      formDataToSend.append("Suppliername", formData.Suppliername);

      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("goldRate", selectedOption);
      formDataToSend.append("tQty", formData.tQty);

      selectedOption === "9999 Rate"
        ? formDataToSend.append("pure999Rate", formData.pure999Rate)
        : formDataToSend.append("pure999Rate", "");

      selectedOption === "999 Rate"
        ? formDataToSend.append("PureRate", formData.PureRate)
        : formDataToSend.append("PureRate", "");

      selectedOption === "995 Rate"
        ? formDataToSend.append("cRate", formData.cRate)
        : formDataToSend.append("cRate", "");

      files.forEach((file) => {
        formDataToSend.append("images", file);
      });

      let res;
      if (orderType === "fix") {
        res = await axios.post(`${API}/po_datapost`, formDataToSend);
        const filteredItems = res.data.findPoDatas;
        const poData = res.data.poData;
        const orderTypes = res.data.orderTypes;
        const poType = res.data.poType;

        const pdfGenerated = await generatePdf(
          filteredItems,
          poData,
          orderTypes,
          poType.trim()
        );
        console.log(pdfGenerated);
        showSuccess("Data Saved Successfully");
      } else {
        res = await axios.post(`${API}/datapost`, formDataToSend);
        showSuccess("Data Saved Successfully");
      }
      console.log(res.data);

      if (res.status === 200) {
        handleCancel(e);
      }
    } catch (error) {
      showError(error.response?.data?.message || "Failed to submit form");
    } finally {
      setFormData({
        Billno: "",
        fixPoNumber: "",
        poDate: "",
        Suppliername: "",
        mobileNumber: "",
        smsSendUserName: "",
        tQty: "",
        cRate: "",
        PureRate: "",
        pure999Rate: "",
        suppCode: ""
      });
    }
    setFiles([]);
    setFieldErrors([]);
    setMobileOptions([]);
  };

  const validateField = (name, value) => {
    const stringValue = value != null ? String(value) : "";

    switch (name) {
      case "Suppliername":
        if (!stringValue.trim()) return "Supplier name is required";
        return "";

      case "Billno":
        if (orderType === "unfix") {
          if (!stringValue.trim()) return "Bill number is required";
          if (stringValue.includes("|")) {
            const [billNo, date] = stringValue.split("|");
            if (!billNo.trim()) return "Bill number is required";
            if (!date.trim()) return "Date is required";
            if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date))
              return "Invalid date format (DD/MM/YYYY)";
          }
        }
        return "";

      case "fixPoNumber":
        if (orderType === "fix" && !stringValue.trim())
          return "PO number is required";
        return "";

      case "poDate":
        if (orderType === "fix") {
          if (!stringValue.trim()) return "PO date is required";
          if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(stringValue))
            return "Invalid date format (DD/MM/YYYY)";
        }
        return "";

      case "mobileNumber":
        if (!stringValue.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(stringValue)) return "Must be 10 digits";
        return "";

      case "tQty":
        if (!stringValue.trim()) return "Quantity is required";
        if (isNaN(stringValue) || parseFloat(stringValue) <= 0)
          return "Must be a positive number";
        if (!/^\d*\.?\d{0,3}$/.test(stringValue)) return "Max 3 decimal places";
        return "";

      case "pure999Rate":
      case "PureRate":
      case "cRate":
        if (!stringValue.trim()) return "Rate is required";
        if (isNaN(stringValue) || parseInt(stringValue) <= 0)
          return "Must be a positive number";
        if (stringValue.length > 5) return "Maximum 5 digits allowed";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (orderType === "fix" && key === "Billno") return;
      if (orderType === "unfix" && (key === "fixPoNumber" || key === "poDate"))
        return;

      if (
        selectedOption === "999 Rate" &&
        (key === "cRate" || key === "pure999Rate")
      )
        return;
      if (
        selectedOption === "995 Rate" &&
        (key === "PureRate" || key === "pure999Rate")
      )
        return;
      if (
        selectedOption === "9999 Rate" &&
        (key === "PureRate" || key === "cRate")
      )
        return;

      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    if (files.length === 0) {
      errors.files = "At least one image is required";
      showWarning("At least one image is required");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = (e) => {
    e.preventDefault();
    
    // Stop scanner first if running
    if (isScanning) {
      stopQrScanner();
    }
    
    setFiles([]);
    setFormData({
      Billno: "",
      fixPoNumber: "",
      poDate: "",
      Suppliername: "",
      mobileNumber: "",
      smsSendUserName: "",
      tQty: "",
      cRate: "",
      PureRate: "",
      pure999Rate: "",
      suppCode: ""
    });
    setSelectedOption("999 Rate");
    setOrderType("unfix");
    setFieldErrors({});
    setMobileOptions([]);
  };

  const handleChange = (event) => {
    const newSelectedOption = event.target.value;
    setSelectedOption(newSelectedOption);

    if (newSelectedOption === "999 Rate") {
      setFormData({ ...formData, cRate: "", pure999Rate: "" });
    }
    if (newSelectedOption === "995 Rate") {
      setFormData({ ...formData, PureRate: "", pure999Rate: "" });
    }
    if (newSelectedOption === "9999 Rate") {
      setFormData({ ...formData, PureRate: "", cRate: "" });
    }
  };

  const handleOrderTypeChange = (event) => {
    const newOrderType = event.target.value;
    setOrderType(newOrderType);

    // Stop scanner when switching order types
    if (isScanning) {
      stopQrScanner();
    }

    if (newOrderType === "fix") {
      setFormData({ ...formData, Billno: "" });
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.Billno;
        return newErrors;
      });
    } else {
      setFormData({ ...formData, fixPoNumber: "", poDate: "" });
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.fixPoNumber;
        delete newErrors.poDate;
        return newErrors;
      });
    }
  };

  const handleDelete = (i) => {
    const selectedFiles = [...files.slice(0, i), ...files.slice(i + 1)];
    setFiles(selectedFiles);
    document.getElementById("dropzone-file").value = "";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl bg-white shadow-2xl rounded-2xl p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-800 mb-4 sm:mb-6">
          Rate Fixing Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Order Type Radio Buttons */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Type
            </label>
            <div className="flex space-x-4 sm:space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="orderType"
                  value="unfix"
                  checked={orderType === "unfix"}
                  onChange={handleOrderTypeChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700">Unfix</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="orderType"
                  value="fix"
                  checked={orderType === "fix"}
                  onChange={handleOrderTypeChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm sm:text-base text-gray-700">Fix</span>
              </label>
            </div>
          </div>

          {/* Conditional Fields Based on Order Type - Mobile First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {orderType === "unfix" ? (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill No | Date
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="Billno"
                    placeholder="Enter Bill No"
                    value={formData.Billno}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full",
                      fieldErrors.Billno &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <Button
                    type="button"
                    onClick={isScanning ? stopQrScanner : startQrScanner}
                    variant={isScanning ? "destructive" : "outline"}
                    className="shrink-0"
                  >
                    {isScanning ? <X className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                  </Button>
                </div>
                {fieldErrors.Billno && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {fieldErrors.Billno}
                  </p>
                )}
                
                {/* QR Scanner Container - Only render when scanning */}
                {isScanning && (
                  <div className="mt-3 border-2 border-blue-500 rounded-lg overflow-hidden bg-black">
                    <div id={scannerRegionId} className="w-full"></div>
                    <p className="text-xs text-center text-white py-2 bg-blue-600">
                      Position QR code within the frame
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Number
                  </label>
                  <Input
                    type="text"
                    name="fixPoNumber"
                    placeholder="Enter PO Number"
                    value={formData.fixPoNumber}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full",
                      fieldErrors.fixPoNumber &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {fieldErrors.fixPoNumber && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {fieldErrors.fixPoNumber}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO Date
                  </label>
                  <Input
                    type="text"
                    name="poDate"
                    placeholder="DD/MM/YYYY"
                    value={formData.poDate}
                    onChange={handleInputChange}
                    maxLength={10}
                    className={cn(
                      "w-full",
                      fieldErrors.poDate &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {fieldErrors.poDate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {fieldErrors.poDate}
                    </p>
                  )}
                </div>
              </>
            )}

            {orderType === "unfix" && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name
                </label>
                <Input
                  type="text"
                  name="Suppliername"
                  placeholder="Enter Supplier Name"
                  value={formData.Suppliername}
                  onChange={handleInputChange}
                  className={cn(
                    "w-full",
                    fieldErrors.Suppliername &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {fieldErrors.Suppliername && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500">
                    {fieldErrors.Suppliername}
                  </p>
                )}
              </div>
            )}
          </div>

          {orderType === "fix" && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier Name
              </label>
              <Input
                type="text"
                name="Suppliername"
                placeholder="Enter Supplier Name"
                value={formData.Suppliername}
                onChange={handleInputChange}
                className={cn(
                  "w-full",
                  fieldErrors.Suppliername &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {fieldErrors.Suppliername && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {fieldErrors.Suppliername}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Mobile Number Combobox */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
                {formData.smsSendUserName && (
                  <span className="ml-2 text-xs text-blue-600 font-normal">
                    ({formData.smsSendUserName})
                  </span>
                )}
              </label>
              <Popover open={openMobile} onOpenChange={setOpenMobile}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openMobile}
                    className={cn(
                      "w-full justify-between h-10 text-sm",
                      fieldErrors.mobileNumber &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    disabled={mobileOptions.length === 0}
                  >
                    {formData.mobileNumber || "Select mobile number..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] sm:w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search mobile..." />
                    <CommandList>
                      <CommandEmpty>No mobile number found.</CommandEmpty>
                      <CommandGroup>
                        {mobileOptions.map((option, index) => (
                          <CommandItem
                            key={index}
                            value={`${option.name} ${option.role} ${option.mobile}`}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                mobileNumber: option.mobile,
                                smsSendUserName: option.name,
                              }));
                              setOpenMobile(false);
                              setFieldErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.mobileNumber;
                                return newErrors;
                              });
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{option.name}</span>
                              <span className="text-xs text-gray-500">
                                {option.role} - {option.mobile}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {fieldErrors.mobileNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">
                  {fieldErrors.mobileNumber}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Qty In Pure-Grams
              </label>
              <Input
                type="text"
                name="tQty"
                placeholder="Enter Qty in g"
                value={formData.tQty}
                onChange={handleInputChange}
                className={cn(
                  "w-full",
                  fieldErrors.tQty &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {fieldErrors.tQty && (
                <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldErrors.tQty}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gold Purity
              </label>
              <select
                value={selectedOption}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 text-sm"
              >
                <option value="995 Rate">995 Rate</option>
                <option value="999 Rate">999 Rate</option>
                <option value="9999 Rate">9999 Rate</option>
              </select>
            </div>

            <div className="w-full">
              {selectedOption === "9999 Rate" && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wt 9999 Rate
                  </label>
                  <Input
                    type="text"
                    name="pure999Rate"
                    placeholder="Enter 9999 Rate"
                    value={formData.pure999Rate}
                    onChange={handleInputChange}
                    maxLength={5}
                    className={cn(
                      "w-full",
                      fieldErrors.pure999Rate &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {fieldErrors.pure999Rate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {fieldErrors.pure999Rate}
                    </p>
                  )}
                </>
              )}

              {selectedOption === "999 Rate" && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wt 999 Rate
                  </label>
                  <Input
                    type="text"
                    name="PureRate"
                    placeholder="Enter 999 Rate"
                    value={formData.PureRate}
                    onChange={handleInputChange}
                    maxLength={5}
                    className={cn(
                      "w-full",
                      fieldErrors.PureRate &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {fieldErrors.PureRate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {fieldErrors.PureRate}
                    </p>
                  )}
                </>
              )}

              {selectedOption === "995 Rate" && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wt 995 Rate
                  </label>
                  <Input
                    type="text"
                    name="cRate"
                    placeholder="Enter 995 Rate"
                    value={formData.cRate}
                    onChange={handleInputChange}
                    maxLength={5}
                    className={cn(
                      "w-full",
                      fieldErrors.cRate &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {fieldErrors.cRate && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {fieldErrors.cRate}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* File Upload Section - Mobile Optimized */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center ${
              fieldErrors.files ? "border-red-500" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="dropzone-file"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="dropzone-file"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
              <p className="text-sm sm:text-base text-gray-600">
                Click to upload or drag and drop files
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG (Max 2 files)
              </p>
            </label>
          </div>

          {/* Image Preview Grid - Mobile Optimized */}
          {files.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1 right-1 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImage(URL.createObjectURL(file));
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors"
                        aria-label="Preview image"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                        aria-label="Delete image"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image Preview Modal - Mobile Optimized */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
                  <div className="bg-white rounded-lg p-3 sm:p-4 max-w-full sm:max-w-3xl max-h-[90vh] w-full relative overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-2 bg-gray-100 rounded-full p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 z-10"
                      aria-label="Close preview"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          {fieldErrors.files && (
            <p className="mt-1 text-xs sm:text-sm text-red-500">{fieldErrors.files}</p>
          )}

          {/* Action Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              type="submit"
              className="w-full flex-1 bg-blue-600 text-white py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base font-medium"
            >
              <Check className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full flex-1 bg-red-500 text-white py-2.5 sm:py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base font-medium"
            >
              <X className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Cancel
            </button>
          </div>
        </form>
      </div>
      <SnackbarComponent />
    </div>
  );
}

export default FormToCredit;


