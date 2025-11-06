// import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
// import {
//   CustomSelect,
//   CustomInput,
//   PhotoCapture,
//   CustomSelects,
//   ProductTypeSelection,
// } from "../components/InputComp";
// import SubmittedDataComp from "../components/SubmittedDataComp";
// import PurchaseOrderDialog from "../components/PurchaseOrderDialog";
// import axios from "axios";
// import { API } from "../../../config/configData";
// import { useSendToServer } from "../components/SendToServer";
// import Snackbar from "../../../Components/Snackbar";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import { PoContext } from "../PoContext/PoContext";
// import { useValidation } from "../components/useValidation";
// import useImageCompression from "../components/useImageCompression";
// import poFields from "../../PurchaseOrder/FieldDatas/FieldsDatas";

// const RateTypeModal = ({ isOpen, onClose, onSelect, currentRateType }) => {
//   const [selectedRate, setSelectedRate] = useState(currentRateType || "unfix");

//   useEffect(() => {
//     if (isOpen) {
//       setSelectedRate(currentRateType || "unfix");
//     }
//   }, [isOpen, currentRateType]);

//   const handleConfirm = () => {
//     onSelect(selectedRate);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
      
//       {/* Modal Content - FULLY OPTIMIZED FOR MOBILE */}
//       <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-md w-full transform transition-all">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>

//         {/* Header - COMPACT */}
//         <div className="mb-4">
//           <div className="flex items-center justify-center mb-3">
//             <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-full">
//               <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
//             Select Rate Type
//           </h2>
//           <p className="text-sm text-center text-gray-500">
//             Choose the rate fixation type for this supplier
//           </p>
//         </div>

//         {/* Rate Options - OPTIMIZED COMPACT SPACING */}
//         <div className="space-y-2.5 mb-5">
//           {/* Fix Option */}
//           <label 
//             className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
//               selectedRate === "fix" 
//                 ? "border-green-500 bg-green-50 shadow-md scale-[1.02]" 
//                 : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
//             }`}
//           >
//             <input
//               type="radio"
//               name="rateType"
//               value="fix"
//               checked={selectedRate === "fix"}
//               onChange={(e) => setSelectedRate(e.target.value)}
//               className="form-radio h-5 w-5 text-green-600 transition-all cursor-pointer"
//             />
//             <div className="ml-3 flex-1">
//               <div className="flex items-center">
//                 <span className="text-base font-semibold text-gray-800">Fix Rate</span>
//                 {selectedRate === "fix" && (
//                   <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//               <p className="text-xs text-gray-600 mt-0.5">Fixed price rate for products</p>
//             </div>
//           </label>

//           {/* Unfix Option */}
//           <label 
//             className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
//               selectedRate === "unfix" 
//                 ? "border-orange-500 bg-orange-50 shadow-md scale-[1.02]" 
//                 : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
//             }`}
//           >
//             <input
//               type="radio"
//               name="rateType"
//               value="unfix"
//               checked={selectedRate === "unfix"}
//               onChange={(e) => setSelectedRate(e.target.value)}
//               className="form-radio h-5 w-5 text-orange-600 transition-all cursor-pointer"
//             />
//             <div className="ml-3 flex-1">
//               <div className="flex items-center">
//                 <span className="text-base font-semibold text-gray-800">Unfix Rate</span>
//                 <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
//                   Default
//                 </span>
//                 {selectedRate === "unfix" && (
//                   <svg className="w-5 h-5 ml-1.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </div>
//               <p className="text-xs text-gray-600 mt-0.5">Variable market rate for products</p>
//             </div>
//           </label>
//         </div>

//         {/* Action Buttons - COMPACT */}
//         <div className="flex gap-2.5">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-300 active:scale-95 transition-all"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleConfirm}
//             className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-lg"
//           >
//             Confirm
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const GoldProductForm = () => {
//   const { userRole, user, names } = useContext(DashBoardContext);
//   const {
//     formData,
//     setFormData,
//     snackbar,
//     setSnackbar,
//     hideSnackbar,
//     showSnackbar,
//     goldMelting,
//     silverMelting,
//     errors,
//     setErrors,
//     selectedTypes,
//     setSelectedTypes,
//   } = useContext(PoContext);
  
//   const metal = userRole?.split("-")[0];
//   const [submittedData, setSubmittedData] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isPoDialogOpen, setIsPoDialogOpen] = useState(false);
//   const [productDetails, setProductDetails] = useState([]);
//   const [poAddressData, setPoAddressData] = useState(null);
//   const [selectedDatas, setSelectedDatas] = useState([]);
//   const { validateField } = useValidation();
//   const { compressAndConvertToJPG, isCompressing } = useImageCompression(100);
//   const [meltingOptions, setMeltingOptions] = useState([]);
//   const [wastageOptions, setWastageOptions] = useState([]);
//   const [supplierOptions, setSupplierOptions] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [supplierLoading, setSupplierLoading] = useState(false);
//   const fields = poFields(userRole);
//   const photoCaptureRef = useRef(null);
  
//   // Rate Type Modal State
//   const [isRateModalOpen, setIsRateModalOpen] = useState(false);
//   const [hasSelectedRateType, setHasSelectedRateType] = useState(false);

//   // Fetch suppliers on mount
//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_for_po/${userRole}`);
//         setSupplierOptions(response?.data?.supplierDatas);
//       } catch (error) {
//         console.error("Error fetching suppliers:", error);
//       }
//     };
//     fetchSuppliers();
//   }, [userRole]);

//   // Open rate modal when supplier is selected for the first time
//   useEffect(() => {
//     if (selectedSupplier && !hasSelectedRateType) {
//       setIsRateModalOpen(true);
//     }
//   }, [selectedSupplier, hasSelectedRateType]);

//   // Handle rate type selection
//   const handleRateTypeSelect = (rateType) => {
//     setFormData((prev) => ({
//       ...prev,
//       rateFixType: rateType,
//     }));
//     setHasSelectedRateType(true);
//     showSnackbar(`Rate type set to: ${rateType === "fix" ? "Fix" : "Unfix"}`, "success");
//   };

//   // Filter submitted data by selected supplier
//   const filteredSubmittedData = useMemo(() => {
//     if (!selectedSupplier) {
//       return submittedData;
//     }
    
//     return submittedData.filter(item => 
//       item.supplierCode === selectedSupplier
//     );
//   }, [submittedData, selectedSupplier]);

//   // Clear selected items when supplier changes
//   useEffect(() => {
//     setSelectedItems([]);
//     setSelectedDatas([]);
//   }, [selectedSupplier]);

//   useEffect(() => {
//     if (!selectedSupplier) return;

//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_Po/fetch_selected_supplier_details/${selectedSupplier}`
//         );
        
//         const supplierData = response.data.suplierPurityDetails;
        
//         let filteredByCategory = supplierData;
        
//         if (userRole.includes("Silver") && formData.productType) {
//           filteredByCategory = supplierData.filter(
//             (data) => data.CATEGORYNAME === formData.productType
//           );
//         }
        
//         const uniqueProductCodes = [...new Set(
//           filteredByCategory.map(data => data.PRODUCTCODE)
//         )];
        
//         const products = uniqueProductCodes.map(code => {
//           const product = filteredByCategory.find(
//             data => data.PRODUCTCODE === code
//           );
//           return {
//             label: product.PRODUCTNAME,
//             value: product.PRODUCTCODE
//           };
//         });
        
//         setProductDetails(products);
        
//         if (formData.product) {
//           const purityDatas = filteredByCategory.filter(
//             (data) => data.PRODUCTCODE === formData.product
//           );
          
//           const uniqueMeltingValues = [...new Set(
//             purityDatas.map(item => item.PUR_MELTING_PURITY)
//           )];
//           const melting = uniqueMeltingValues.map(value => ({
//             label: value,
//             value: value
//           }));
          
//           const uniqueWastageValues = [...new Set(
//             purityDatas.map(item => item.PUR_WASTAGE)
//           )];
//           const wastage = uniqueWastageValues.map(value => ({
//             label: value,
//             value: value
//           }));
          
//           setMeltingOptions(melting); 
//           setWastageOptions(wastage);
//         } else {
//           setMeltingOptions([]);
//           setWastageOptions([]);
//         }
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//         showSnackbar("Failed to fetch product details", "error");
//       }
//     };

//     fetchProductDetails();
//   }, [selectedSupplier, formData.product, formData.productType, userRole]);

//   useEffect(() => {
//     if (formData.product && formData.orderType === "office" && productDetails.length > 0) {
//       const selectedProduct = productDetails.find(
//         (product) => product.value === formData.product
//       );
      
//       if (selectedProduct && selectedProduct.label !== formData.productName) {
//         setFormData((prev) => ({
//           ...prev,
//           productName: selectedProduct.label,
//         }));
//       }
//     }
//   }, [formData.product, productDetails, formData.orderType]);

//   // Fetch PO details on mount
//   useEffect(() => {
//     fetchPoUserDetails();
//   }, []);

//   // Reset product selection when product type changes for Silver
//   useEffect(() => {
//     if (userRole.includes("Silver") && formData.productType) {
//       setFormData((prev) => ({
//         ...prev,
//         product: null,
//         productName: "",
//         melting: null,
//         wastage: null,
//       }));
//       setProductDetails([]);
//       setMeltingOptions([]);
//       setWastageOptions([]);
//     }
//   }, [formData.productType, userRole]);

//   // Dynamic field configuration
//   const formFieldsConfig = useMemo(() => {
//     const baseFields = [
//       {
//         name: "product",
//         label: "Product",
//         type: "select",
//         component: CustomSelects,
//         options: productDetails,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "productName",
//         label: "Product Name",
//         type: "input",
//         component: CustomInput,
//         visible: false,
//         span: 1,
//       },
//       {
//         name: "pieces",
//         label: "Pieces",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "productWeightage",
//         label: "Product Weightage",
//         type: "select",
//         component: CustomSelect,
//         options: [
//           { label: "Gram", value: "Gram" },
//           { label: "Pcs", value: "Pcs" },
//         ],
//         visible: formData.metal_type === "Silver",
//         span: 1,
//       },
//       {
//         name: "rate",
//         label: "Rate",
//         type: "input",
//         component: CustomInput,
//         visible: formData.metal_type === "Silver" && formData?.productWeightage?.value === "Pcs",
//         span: 1,
//       },
//       {
//         name: "grossWt",
//         label: "Gross Weight",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "diacent",
//         label: "Diamond Carat",
//         type: "input",
//         component: CustomInput,
//         visible: selectedTypes.Diamond,
//         span: 1,
//       },
//       {
//         name: "stoneWt",
//         label: "Stone Weight in (gm)",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "stoneCost",
//         label: "Stone Cost",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "waxWt",
//         label: "Wax Weight",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "goldwt",
//         label: "Gold Net Wt",
//         type: "input",
//         component: CustomInput,
//         visible: selectedTypes.Gold && selectedTypes.Platinum,
//         span: 1,
//       },
//       {
//         name: "platinumWt",
//         label: "Platinum Grs Wt",
//         type: "input",
//         component: CustomInput,
//         visible: selectedTypes.Gold && selectedTypes.Platinum,
//         span: 1,
//       },
//       {
//         name: "netWt",
//         label: selectedTypes.Platinum ? "Platinum Net Wt" : "Net Weight",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         disabled: !selectedTypes.Platinum,
//         span: 1,
//       },
//       {
//         name: "amount",
//         label: "Amount",
//         type: "input",
//         component: CustomInput,
//         visible: true,
//         span: 1,
//       },
//       {
//         name: "melting",
//         label: selectedTypes.Gold && selectedTypes.Platinum ? "Gold Melting" : "Melting",
//         type: "select",
//         component: CustomSelect,
//         options: meltingOptions,
//         visible: formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold" || selectedTypes.Gold,
//         span: 1,
//       },
//       {
//         name: "wastage",
//         label: "Wastage",
//         type: "select",
//         component: CustomSelect,
//         options: wastageOptions,
//         visible: (formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold") && !selectedTypes.Diamond && !selectedTypes.Platinum,
//         span: 1,
//       },
//       {
//         name: "mc",
//         label: "Making Charges",
//         type: "input",
//         component: CustomInput,
//         visible: (formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold") && !selectedTypes.Diamond && !selectedTypes.Platinum,
//         span: 1,
//       },
//       {
//         name: "pureWt",
//         label: selectedTypes.Gold && selectedTypes.Platinum ? "Gold PureWt" : "PureWt",
//         type: "input",
//         component: CustomInput,
//         visible: formData.metal_type !== "Silver" && (!selectedTypes.Platinum || selectedTypes.Gold),
//         disabled: true,
//         span: 1,
//       },
//     ];

//     return baseFields.filter((field) => field.visible);
//   }, [
//     formData,
//     selectedTypes,
//     productDetails,
//     meltingOptions,
//     wastageOptions,
//   ]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     const numericFields = [
//       "pieces",
//       "grossWt",
//       "stoneWt",
//       "stoneCost",
//       "waxWt",
//       "netWt",
//       "amount",
//       "wastage",
//       "rate",
//       "goldwt",
//       "platinumWt",
//       "diacent",
//       "mc",
//     ];

//     if (numericFields.includes(name)) {
//       const regex = name === "wastage" ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

//       if (!regex.test(value)) {
//         return;
//       }

//       if (value.split(".").length > 2) {
//         return;
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "wastage" ? { label: value, value: value } : value,
//     }));

//     validateField(name, value);
//   };

//   const handlePhotoCapture = async (file, capturedImage, setCapturedImage) => {
//     try {
//       if (file) {
//         const compressedImage = await compressAndConvertToJPG(file);
//         setFormData((prev) => ({
//           ...prev,
//           photo: compressedImage,
//         }));
//       } else {
//         setFormData((prev) => ({
//           ...prev,
//           photo: null,
//         }));
//       }
//     } catch (error) {
//       console.error("Error compressing image:", error);
//       setFormData((prev) => ({
//         ...prev,
//         photo: file,
//       }));
//     }
//   };

//   const handleSelect = (itemId, item, orderType) => {
//     setSelectedItems((prev) => {
//       if (prev.includes(itemId)) {
//         return prev.filter((id) => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });

//     setSelectedDatas((prev) => {
//       const exists = prev.some((data) => data.sno === itemId);

//       if (exists) {
//         return prev.filter((data) => data.sno !== itemId);
//       } else {
//         return [...prev, { ...item, orderType }];
//       }
//     });
//   };

//   const handleEdit = (event) => {
//     const data = event;

//     setFormData({
//       sno: data.sno,
//       product: data.product,
//       orderType: data.orderType,
//       metal_type: data.metal_type,
//       productName: data.product_name,
//       pieces: data.pieces,
//       rate: data.rate || "",
//       grossWt: data.gross_weight,
//       stoneWt: data.stone_weight,
//       stoneCost: data.stone_cost,
//       waxWt: data.wax_weight,
//       amount: data.amount,
//       melting: { label: data.melting, value: data.melting },
//       wastage: { label: data.wastage, value: data.wastage },
//       edit: true,
//       photo: data.product_image,
//       netWt: data.net_weight || "",
//       pureWt: data.pure_weight || "",
//       productWeightage: {
//         label: data.productWeightage || "Gram",
//         value: data.productWeightage || "Gram",
//       },
//       goldwt: data.goldwt,
//       platinumWt: data.platinumWt,
//       diacent: data.diamondwt,
//       productType: data.productType || "GO",
//       mc: data.makingCharges,
//       rateFixType: data.rateFixType || "unfix",
//     });

//     setSelectedTypes(data.productAvlTypes);
    
//     if (data.supplierCode) {
//       setSelectedSupplier(data.supplierCode);
//       setHasSelectedRateType(true);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await axios.put(`${API}/gold_po/delete/${id}`);
//       if (response.status === 200) {
//         fetchPoUserDetails();
//         showSnackbar("Product deleted successfully!", "error");
//       }
//     } catch (error) {
//       console.error("Error deleting record:", error);
//       showSnackbar("Failed to delete product", "error");
//     }
//   };

//   const handlePoSubmit = async (poData) => {
//     try {
//       const filteredItems = submittedData.filter((item) =>
//         selectedItems.includes(item.sno)
//       );

//       if (!filteredItems || filteredItems.length === 0) {
//         throw new Error("No items selected for the purchase order");
//       }

//       const submitDataForUpdate = {
//         items: selectedItems,
//         poDetails: poData,
//       };

//       const response = await axios.put(
//         `${API}/gold_po/update_po_records/${userRole}/${user}`,
//         submitDataForUpdate
//       );

//       if (response.status === 200) {
//         fetchPoUserDetails();
//         setIsPoDialogOpen(false);
//         setSelectedItems([]);
//         setSelectedDatas([]);
//         showSnackbar(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error submitting PO:", error);
//       showSnackbar(error.message || "Failed to submit Purchase Order", "error");
//     }
//   };

//   const fetchPoUserDetails = async () => {
//     try {
//       const response = await axios.get(
//         `${API}/gold_po/Get_Po_Details/${userRole}/${names}`
//       );
//       setSubmittedData(response.data);
//     } catch (error) {
//       console.error("Error fetching PO details:", error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (formData.orderType === "office" && !formData.product) {
//       newErrors.product = "Product is required for office orders";
//     }

//     if (formData.orderType === "fair" && !formData.productName?.trim()) {
//       newErrors.productName = "Product name is required for fair orders";
//     }

//     if (userRole.includes("Silver") && !formData.productType) {
//       newErrors.productType = "Product type is required for Silver orders";
//     }
    
//     if (!selectedSupplier) {
//       newErrors.supplier = "Please select a supplier";
//       showSnackbar("Please select a supplier before adding products", "error");
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       showSnackbar("Please fix the errors before submitting", "error");
//       return;
//     }
    
//     const formDataToSubmit = new FormData();
//     formDataToSubmit.append("productAvlTypes", JSON.stringify(selectedTypes));
//     formDataToSubmit.append("login", names);
    
//     if (selectedSupplier) {
//       formDataToSubmit.append("supplierId", selectedSupplier);
//     }

//     Object.keys(formData).forEach((key) => {
//       if (key === "photo" && formData[key]) {
//         formDataToSubmit.append("photo", formData[key]);
//       } else if (key === "product" && formData[key]) {
//         formDataToSubmit.append(key, formData[key]);
//       } else if (key === "melting" && formData[key]) {
//         formDataToSubmit.append(key, formData[key].value ?? 0);
//       } else if (key === "wastage" && formData[key]) {
//         formDataToSubmit.append(key, formData[key].value ?? 0);
//       } else if (key === "productWeightage" && formData[key]) {
//         formDataToSubmit.append(key, formData[key].value ?? "Gram");
//       } else if (key === "productType" && formData[key]) {
//         formDataToSubmit.append(key, formData[key] ?? "GO");
//       } else if (formData[key] !== null && formData[key] !== undefined) {
//         formDataToSubmit.append(key, formData[key]);
//       }
//     });

//     try {
//       const response = await axios.post(`${API}/gold_po/gold_po`, formDataToSubmit);
      
//       if (response.status === 201) {
//         if (photoCaptureRef.current) {
//           photoCaptureRef.current.recapture();
//         }

//         setFormData({
//           product: null,
//           metal_type: userRole.includes("Gold")
//             ? "Gold"
//             : userRole.includes("Silver")
//             ? "Silver"
//             : userRole.includes("Diamond")
//             ? "Diamond"
//             : "",
//           productName: "",
//           orderType: "office",
//           pieces: "",
//           grossWt: "",
//           stoneWt: "",
//           stoneCost: "",
//           waxWt: "",
//           netWt: "",
//           amount: "",
//           photo: null,
//           melting: null,
//           wastage: null,
//           diacent: "",
//           pureWt: "",
//           edit: false,
//           photoUrl: "",
//           productType: userRole.includes("Gold")
//             ? "GO"
//             : userRole.includes("Diamond")
//             ? "DIA"
//             : "Silver",
//           productWeightage: "Gram",
//           mc: "",
//           rate: "",
//           goldwt: "",
//           platinumWt: "",
//           rateFixType: formData.rateFixType || "unfix",
//         });
        
//         setSelectedTypes({
//           Gold: userRole.includes("Diamond"),
//           Diamond: userRole.includes("Diamond"),
//           Platinum: false,
//         });
        
//         fetchPoUserDetails();
//         setErrors({});
//         showSnackbar("Product added successfully!");
//       }
//     } catch (error) {
//       showSnackbar(
//         error.response?.data?.message || "Failed to add product",
//         "error"
//       );
//       console.error("Error submitting form:", error);
//     }
//   };

//   // Render dynamic fields
//   const renderField = (field) => {
//     const Component = field.component;
//     const commonProps = {
//       label: field.label,
//       error: errors[field.name],
//     };

//     if (field.type === "select") {
//       return (
//         <Component
//           key={field.name}
//           {...commonProps}
//           options={field.options || []}
//           value={formData[field.name]}
//           onChange={(value) =>
//             setFormData((prev) => ({ ...prev, [field.name]: value }))
//           }
//         />
//       );
//     }

//     if (field.type === "input") {
//       return (
//         <CustomInput
//           key={field.name}
//           {...commonProps}
//           name={field.name}
//           value={field.name === "wastage" ? formData[field.name]?.value || "" : formData[field.name] || ""}
//           onChange={handleInputChange}
//           disabled={field.disabled}
//         />
//       );
//     }

//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3">
//       <div className="mx-auto">
//         {/* Header - MOBILE OPTIMIZED PADDING */}
//         <div className="bg-white rounded-2xl shadow-xl p-3 mb-3">
//           <div className="flex items-center justify-between mb-3">
//             {supplierLoading && (
//               <div className="flex items-center text-blue-600">
//                 <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 Loading supplier details...
//               </div>
//             )}
//           </div>

//           {/* Supplier Selection with Rate Type Badge - MOBILE OPTIMIZED */}
//           <div className={`mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border ${errors.supplier ? 'border-red-300 border-2' : 'border-blue-200'}`}>
//             <div className="flex items-center justify-between mb-2">
//               <label className="block text-sm font-semibold text-gray-700">
//                 Select Supplier <span className="text-red-500">*</span>
//               </label>
//               {selectedSupplier && hasSelectedRateType && (
//                 <div className="flex items-center gap-1.5">
//                   <span 
//                     className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                       formData.rateFixType === "fix" 
//                         ? "bg-green-100 text-green-700" 
//                         : "bg-orange-100 text-orange-700"
//                     }`}
//                   >
//                     {formData.rateFixType === "fix" ? "Fix Rate" : "Unfix Rate"}
//                   </span>
//                   <button
//                     onClick={() => setIsRateModalOpen(true)}
//                     className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 active:scale-95 transition-all"
//                   >
//                     Change
//                   </button>
//                 </div>
//               )}
//             </div>
//             <CustomSelects
//               options={supplierOptions}
//               value={selectedSupplier}
//               onChange={(value) => {
//                 setSelectedSupplier(value);
//                 setHasSelectedRateType(false);
//                 setErrors((prev) => {
//                   const newErrors = { ...prev };
//                   delete newErrors.supplier;
//                   return newErrors;
//                 });
//               }}
//               placeholder="Search and select supplier..."
//             />
//             {selectedSupplier && (
//               <div className="mt-2 text-sm text-green-600 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 Supplier selected: {supplierOptions.find(s => s.value === selectedSupplier)?.label || selectedSupplier}
//               </div>
//             )}
//             {errors.supplier && (
//               <p className="mt-2 text-sm text-red-600 flex items-center">
//                 <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//                 {errors.supplier}
//               </p>
//             )}
//           </div>

//           {/* Order Type Selection - COMPACT */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
//             <div className="bg-gray-50 p-3 rounded-xl">
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Order Type
//               </label>
//               <div className="flex gap-4">
//                 <label className="flex items-center cursor-pointer group">
//                   <input
//                     type="radio"
//                     name="orderType"
//                     value="office"
//                     checked={formData.orderType === "office"}
//                     onChange={() => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         orderType: "office",
//                         productName: "",
//                       }));
//                       setErrors((prev) => {
//                         const newErrors = { ...prev };
//                         delete newErrors.productName;
//                         return newErrors;
//                       });
//                     }}
//                     className="form-radio h-4 w-4 text-blue-600 transition-all cursor-pointer"
//                   />
//                   <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
//                     Office Selection
//                   </span>
//                 </label>
//                 <label className="flex items-center cursor-pointer group">
//                   <input
//                     type="radio"
//                     name="orderType"
//                     value="fair"
//                     checked={formData.orderType === "fair"}
//                     onChange={() => {
//                       setFormData((prev) => ({
//                         ...prev,
//                         orderType: "fair",
//                       }));
//                       setErrors((prev) => {
//                         const newErrors = { ...prev };
//                         delete newErrors.product;
//                         return newErrors;
//                       });
//                     }}
//                     className="form-radio h-4 w-4 text-blue-600 transition-all cursor-pointer"
//                   />
//                   <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
//                     Exhibition
//                   </span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Product Type Selection for Silver - COMPACT */}
//           {userRole.includes("Silver") && (
//             <div className={`bg-gray-50 p-3 rounded-xl mb-3 ${errors.productType ? 'border-2 border-red-300' : ''}`}>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Product Type <span className="text-red-500">*</span>
//               </label>
//               <div className="grid grid-cols-2 gap-2">
//                 {["SILVER", "GIFT ARTICLES", "AIRAA SILVER", "SILVER JEWELLERY"].map((type) => (
//                   <label key={type} className="flex items-center cursor-pointer group">
//                     <input
//                       type="radio"
//                       name="productType"
//                       value={type}
//                       checked={formData.productType === type}
//                       onChange={() => {
//                         setFormData((prev) => ({
//                           ...prev,
//                           productType: type,
//                         }));
//                         setErrors((prev) => {
//                           const newErrors = { ...prev };
//                           delete newErrors.productType;
//                           return newErrors;
//                         });
//                       }}
//                       className="form-radio h-4 w-4 text-purple-600 cursor-pointer"
//                     />
//                     <span className="ml-2 text-sm text-gray-700 group-hover:text-purple-600 transition-colors font-medium">
//                       {type === "GA" ? "Gift Article" : type}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//               {errors.productType && (
//                 <p className="mt-2 text-sm text-red-600 flex items-center">
//                   <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {errors.productType}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Product Type Selection for Diamond - COMPACT */}
//           {userRole.includes("Diamond") && (
//             <div className="bg-gray-50 p-3 rounded-xl mb-3">
//               <ProductTypeSelection
//                 formData={formData}
//                 setFormData={setFormData}
//                 selectedTypes={selectedTypes}
//                 setSelectedTypes={setSelectedTypes}
//               />
//             </div>
//           )}
//         </div>

//         {/* Dynamic Form Fields - COMPACT GAP SPACING */}
//         <div className="bg-white rounded-xl shadow-xl p-3 mb-3">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
//             {formFieldsConfig.map((field) => renderField(field))}
//           </div>

//           {/* Photo Capture - COMPACT MARGIN */}
//           <div className="mt-2 border-t pt-2">
//             <PhotoCapture
//               ref={photoCaptureRef}
//               onPhotoCapture={handlePhotoCapture}
//               photoUrl={formData.photo ? formData.photo : null}
//             />
//           </div>

//           {/* Submit Button - COMPACT SPACING */}
//           <div className="flex justify-center mt-3">
//             {((formData?.productWeightage?.value === "Pcs" &&
//               formData.rate &&
//               formData.pieces) ||
//               (formData.netWt && parseFloat(formData.netWt) > 0)) && (
//               <button
//                 onClick={handleSubmit}
//                 className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg"
//               >
//                 <span className="flex items-center">
//                   <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                   </svg>
//                   Add Product
//                 </span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Submitted Data - COMPACT PADDING */}
//         <div className="bg-white rounded-2xl shadow-xl p-3">
//           {!selectedSupplier && (
//             <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-xl border-2 border-amber-200">
//               <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//               <p className="text-lg font-bold mb-2">Please Select a Supplier First</p>
//               <p className="text-sm">Select a supplier from the dropdown above to view and manage items</p>
//             </div>
//           )}
          
//           {selectedSupplier && filteredSubmittedData.length === 0 && (
//             <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
//               <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//               </svg>
//               <p className="text-lg font-semibold mb-2">No Items Found</p>
//               <p className="text-sm">No products have been added for the selected supplier yet</p>
//               <p className="text-xs text-gray-400 mt-2">Add products using the form above</p>
//             </div>
//           )}
          
//           {selectedSupplier && filteredSubmittedData.length > 0 && (
//             <>
//               <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-blue-900 font-semibold">
//                       Showing <span className="text-base font-bold text-blue-700">{filteredSubmittedData.length}</span> {filteredSubmittedData.length === 1 ? 'item' : 'items'}
//                     </p>
//                     <p className="text-xs text-blue-600 mt-1">
//                       Supplier: <span className="font-semibold">{supplierOptions.find(s => s.value === selectedSupplier)?.label || selectedSupplier}</span>
//                     </p>
//                   </div>
//                   {selectedItems.length > 0 && (
//                     <div className="bg-green-100 px-3 py-1.5 rounded-lg border border-green-300">
//                       <p className="text-sm text-green-800 font-semibold">
//                         {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <SubmittedDataComp
//                 submittedData={filteredSubmittedData}
//                 handleSelect={handleSelect}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//                 selectedItems={selectedItems}
//                 ispocreation={false}
//               />
//             </>
//           )}
//         </div>

//         {/* Create PO Button - COMPACT SPACING */}
//         {selectedItems.length > 0 && selectedSupplier && (
//           <div className="mt-3 flex justify-center">
//             <button
//               onClick={() => setIsPoDialogOpen(true)}
//               className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold rounded-xl hover:from-green-700 hover:to-green-800 active:scale-95 transition-all duration-200 shadow-xl"
//             >
//               <span className="flex items-center">
//                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span className="hidden sm:inline">Create Purchase Order ({selectedItems.length} items selected)</span>
//                 <span className="sm:hidden">Create PO ({selectedItems.length})</span>
//               </span>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Rate Type Modal */}
//       <RateTypeModal
//         isOpen={isRateModalOpen}
//         onClose={() => setIsRateModalOpen(false)}
//         onSelect={handleRateTypeSelect}
//         currentRateType={formData.rateFixType || "unfix"}
//       />

//       {/* Purchase Order Dialog */}
//       <PurchaseOrderDialog
//         isOpen={isPoDialogOpen}
//         metal_type={metal}
//         type={formData.rateFixType || "unfix"}
//         selectedDatas={selectedDatas}
//         supplierId={selectedSupplier}
//         onClose={() => {
//           setIsPoDialogOpen(false);
//           setSelectedItems([]);
//           setSelectedDatas([]);
//         }}
//         onSubmit={handlePoSubmit}
//       />

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={hideSnackbar}
//         position="top-right"
//         duration={5000}
//       />
//     </div>
//   );
// };

// export default GoldProductForm;
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import {
  CustomSelect,
  CustomInput,
  PhotoCapture,
  CustomSelects,
  ProductTypeSelection,
} from "../components/InputComp";
import SubmittedDataComp from "../components/SubmittedDataComp";
import PurchaseOrderDialog from "../components/PurchaseOrderDialog";
import axios from "axios";
import { API } from "../../../config/configData";
import { useSendToServer } from "../components/SendToServer";
import Snackbar from "../../../Components/Snackbar";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { PoContext } from "../PoContext/PoContext";
import { useValidation } from "../components/useValidation";
import useImageCompression from "../components/useImageCompression";
import poFields from "../../PurchaseOrder/FieldDatas/FieldsDatas";

const RateTypeModal = ({ isOpen, onClose, onSelect, currentRateType }) => {
  const [selectedRate, setSelectedRate] = useState(currentRateType || "unfix");

  useEffect(() => {
    if (isOpen) {
      setSelectedRate(currentRateType || "unfix");
    }
  }, [isOpen, currentRateType]);

  const handleConfirm = () => {
    onSelect(selectedRate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-md w-full transform transition-all">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2.5 rounded-full">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
            Select Rate Type
          </h2>
          <p className="text-sm text-center text-gray-500">
            Choose the rate fixation type for this supplier
          </p>
        </div>

        <div className="space-y-2.5 mb-5">
          <label 
            className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedRate === "fix" 
                ? "border-green-500 bg-green-50 shadow-md scale-[1.02]" 
                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="rateType"
              value="fix"
              checked={selectedRate === "fix"}
              onChange={(e) => setSelectedRate(e.target.value)}
              className="form-radio h-5 w-5 text-green-600 transition-all cursor-pointer"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-base font-semibold text-gray-800">Fix Rate</span>
                {selectedRate === "fix" && (
                  <svg className="w-5 h-5 ml-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Fixed price rate for products</p>
            </div>
          </label>

          <label 
            className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
              selectedRate === "unfix" 
                ? "border-orange-500 bg-orange-50 shadow-md scale-[1.02]" 
                : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="rateType"
              value="unfix"
              checked={selectedRate === "unfix"}
              onChange={(e) => setSelectedRate(e.target.value)}
              className="form-radio h-5 w-5 text-orange-600 transition-all cursor-pointer"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="text-base font-semibold text-gray-800">Unfix Rate</span>
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                  Default
                </span>
                {selectedRate === "unfix" && (
                  <svg className="w-5 h-5 ml-1.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">Variable market rate for products</p>
            </div>
          </label>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-300 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const GoldProductForm = () => {
  const { userRole, user, names } = useContext(DashBoardContext);
  const {
    formData,
    setFormData,
    snackbar,
    setSnackbar,
    hideSnackbar,
    showSnackbar,
    goldMelting,
    silverMelting,
    errors,
    setErrors,
    selectedTypes,
    setSelectedTypes,
  } = useContext(PoContext);
  
  const metal = userRole?.split("-")[0];
  const [submittedData, setSubmittedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPoDialogOpen, setIsPoDialogOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [poAddressData, setPoAddressData] = useState(null);
  const [selectedDatas, setSelectedDatas] = useState([]);
  const { validateField } = useValidation();
  const { compressAndConvertToJPG, isCompressing } = useImageCompression(100);
  const [meltingOptions, setMeltingOptions] = useState([]);
  const [wastageOptions, setWastageOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const fields = poFields(userRole);
  const photoCaptureRef = useRef(null);
  
  // Rate Type Modal State
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [hasSelectedRateType, setHasSelectedRateType] = useState(false);

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setSupplierLoading(true);
        const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_for_po/${userRole}`);
        setSupplierOptions(response?.data?.supplierDatas);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        showSnackbar("Failed to fetch suppliers", "error");
      } finally {
        setSupplierLoading(false);
      }
    };
    fetchSuppliers();
  }, [userRole]);

  // Fetch sections when supplier is selected
  useEffect(() => {
    if (!selectedSupplier) {
      setSectionOptions([]);
      setSelectedSection(null);
      return;
    }

    const fetchSections = async () => {
      try {
        setSectionLoading(true);
        const response = await axios.get(
          `${API}/gold_Po/fetch_sections_for_supplier/${selectedSupplier}`
        );
        const sections = response?.data?.sections || [];
        const sectionOptions = sections.map(section => ({
          label: section.sectionName || section.SECTION_NAME,
          value: section.sectionId || section.SECTION_ID
        }));
        setSectionOptions(sectionOptions);
        
        if (sectionOptions.length > 0) {
          setSelectedSection(sectionOptions[0].value);
          showSnackbar("Sections loaded successfully", "success");
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        showSnackbar("Failed to fetch sections", "error");
        setSectionOptions([]);
        setSelectedSection(null);
      } finally {
        setSectionLoading(false);
      }
    };

    fetchSections();
  }, [selectedSupplier]);

  // Open rate modal when supplier is selected for the first time
  useEffect(() => {
    if (selectedSupplier && !hasSelectedRateType) {
      setIsRateModalOpen(true);
    }
  }, [selectedSupplier, hasSelectedRateType]);

  // Handle rate type selection
  const handleRateTypeSelect = (rateType) => {
    setFormData((prev) => ({
      ...prev,
      rateFixType: rateType,
    }));
    setHasSelectedRateType(true);
    showSnackbar(`Rate type set to: ${rateType === "fix" ? "Fix" : "Unfix"}`, "success");
  };

  // Filter submitted data by selected supplier and section
  const filteredSubmittedData = useMemo(() => {
    if (!selectedSupplier) {
      return submittedData;
    }
    
    let filtered = submittedData.filter(item => 
      item.supplierCode === selectedSupplier
    );

    if (selectedSection) {
      filtered = filtered.filter(item => 
        item.sectionId === selectedSection
      );
    }

    return filtered;
  }, [submittedData, selectedSupplier, selectedSection]);

  // Clear selected items when supplier or section changes
  useEffect(() => {
    setSelectedItems([]);
    setSelectedDatas([]);
  }, [selectedSupplier, selectedSection]);

  useEffect(() => {
    if (!selectedSupplier || !selectedSection) return;

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_Po/fetch_selected_supplier_details/${selectedSupplier}/${selectedSection}`
        );
        
        const supplierData = response.data.suplierPurityDetails;
        
        let filteredByCategory = supplierData;
        
        if (userRole.includes("Silver") && formData.productType) {
          filteredByCategory = supplierData.filter(
            (data) => data.CATEGORYNAME === formData.productType
          );
        }
        
        const uniqueProductCodes = [...new Set(
          filteredByCategory.map(data => data.PRODUCTCODE)
        )];
        
        const products = uniqueProductCodes.map(code => {
          const product = filteredByCategory.find(
            data => data.PRODUCTCODE === code
          );
          return {
            label: product.PRODUCTNAME,
            value: product.PRODUCTCODE
          };
        });
        
        setProductDetails(products);
        
        if (formData.product) {
          const purityDatas = filteredByCategory.filter(
            (data) => data.PRODUCTCODE === formData.product
          );
          
          const uniqueMeltingValues = [...new Set(
            purityDatas.map(item => item.PUR_MELTING_PURITY)
          )];
          const melting = uniqueMeltingValues.map(value => ({
            label: `${value}%`,
            value: value
          }));
          
          const uniqueWastageValues = [...new Set(
            purityDatas.map(item => item.PUR_WASTAGE)
          )];
          const wastage = uniqueWastageValues.map(value => ({
            label: `${value}%`,
            value: value
          }));
          
          setMeltingOptions(melting); 
          setWastageOptions(wastage);
        } else {
          setMeltingOptions([]);
          setWastageOptions([]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        showSnackbar("Failed to fetch product details", "error");
      }
    };

    fetchProductDetails();
  }, [selectedSupplier, selectedSection, formData.product, formData.productType, userRole]);

  useEffect(() => {
    if (formData.product && formData.orderType === "office" && productDetails.length > 0) {
      const selectedProduct = productDetails.find(
        (product) => product.value === formData.product
      );
      
      if (selectedProduct && selectedProduct.label !== formData.productName) {
        setFormData((prev) => ({
          ...prev,
          productName: selectedProduct.label,
        }));
      }
    }
  }, [formData.product, productDetails, formData.orderType]);

  // Fetch PO details on mount
  useEffect(() => {
    fetchPoUserDetails();
  }, []);

  // Reset product selection when product type changes for Silver
  useEffect(() => {
    if (userRole.includes("Silver") && formData.productType) {
      setFormData((prev) => ({
        ...prev,
        product: null,
        productName: "",
        melting: null,
        wastage: null,
      }));
      setProductDetails([]);
      setMeltingOptions([]);
      setWastageOptions([]);
    }
  }, [formData.productType, userRole]);

  // Dynamic field configuration
  const formFieldsConfig = useMemo(() => {
    const baseFields = [
      {
        name: "product",
        label: "Product",
        type: "select",
        component: CustomSelects,
        options: productDetails,
        visible: true,
        span: 1,
      },
      {
        name: "productName",
        label: "Product Name",
        type: "input",
        component: CustomInput,
        visible: false,
        span: 1,
      },
      {
        name: "pieces",
        label: "Pieces",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "productWeightage",
        label: "Product Weightage",
        type: "select",
        component: CustomSelect,
        options: [
          { label: "Gram", value: "Gram" },
          { label: "Pcs", value: "Pcs" },
        ],
        visible: formData.metal_type === "Silver",
        span: 1,
      },
      {
        name: "rate",
        label: "Rate",
        type: "input",
        component: CustomInput,
        visible: formData.metal_type === "Silver" && formData?.productWeightage?.value === "Pcs",
        span: 1,
      },
      {
        name: "grossWt",
        label: "Gross Weight",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "diacent",
        label: "Diamond Carat",
        type: "input",
        component: CustomInput,
        visible: selectedTypes.Diamond,
        span: 1,
      },
      {
        name: "stoneWt",
        label: "Stone Weight (gm)",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "stoneCost",
        label: "Stone Cost",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "waxWt",
        label: "Wax Weight",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "goldwt",
        label: "Gold Net Wt",
        type: "input",
        component: CustomInput,
        visible: selectedTypes.Gold && selectedTypes.Platinum,
        span: 1,
      },
      {
        name: "platinumWt",
        label: "Platinum Grs Wt",
        type: "input",
        component: CustomInput,
        visible: selectedTypes.Gold && selectedTypes.Platinum,
        span: 1,
      },
      {
        name: "netWt",
        label: selectedTypes.Platinum ? "Platinum Net Wt" : "Net Weight",
        type: "input",
        component: CustomInput,
        visible: true,
        disabled: !selectedTypes.Platinum,
        span: 1,
      },
      {
        name: "amount",
        label: "Amount",
        type: "input",
        component: CustomInput,
        visible: true,
        span: 1,
      },
      {
        name: "melting",
        label: selectedTypes.Gold && selectedTypes.Platinum ? "Gold Melting" : "Melting",
        type: "select",
        component: CustomSelect,
        options: meltingOptions,
        visible: formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold" || selectedTypes.Gold,
        span: 1,
      },
      {
        name: "wastage",
        label: "Wastage",
        type: "select",
        component: CustomSelect,
        options: wastageOptions,
        visible: (formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold") && !selectedTypes.Diamond && !selectedTypes.Platinum,
        span: 1,
      },
      {
        name: "mc",
        label: "Making Charges",
        type: "input",
        component: CustomInput,
        visible: (formData?.productWeightage?.value === "Gram" || formData.metal_type === "Gold") && !selectedTypes.Diamond && !selectedTypes.Platinum,
        span: 1,
      },
      {
        name: "pureWt",
        label: selectedTypes.Gold && selectedTypes.Platinum ? "Gold PureWt" : "PureWt",
        type: "input",
        component: CustomInput,
        visible: formData.metal_type !== "Silver" && (!selectedTypes.Platinum || selectedTypes.Gold),
        disabled: true,
        span: 1,
      },
    ];

    return baseFields.filter((field) => field.visible);
  }, [
    formData,
    selectedTypes,
    productDetails,
    meltingOptions,
    wastageOptions,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = [
      "pieces",
      "grossWt",
      "stoneWt",
      "stoneCost",
      "waxWt",
      "netWt",
      "amount",
      "wastage",
      "rate",
      "goldwt",
      "platinumWt",
      "diacent",
      "mc",
    ];

    if (numericFields.includes(name)) {
      const regex = name === "wastage" ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

      if (!regex.test(value)) {
        return;
      }

      if (value.split(".").length > 2) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "wastage" ? { label: value, value: value } : value,
    }));

    validateField(name, value);
  };

  const handlePhotoCapture = async (file, capturedImage, setCapturedImage) => {
    try {
      if (file) {
        const compressedImage = await compressAndConvertToJPG(file);
        setFormData((prev) => ({
          ...prev,
          photo: compressedImage,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          photo: null,
        }));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleSelect = (itemId, item, orderType) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });

    setSelectedDatas((prev) => {
      const exists = prev.some((data) => data.sno === itemId);

      if (exists) {
        return prev.filter((data) => data.sno !== itemId);
      } else {
        return [...prev, { ...item, orderType }];
      }
    });
  };

  const handleEdit = (event) => {
    const data = event;

    setFormData({
      sno: data.sno,
      product: data.product,
      orderType: data.orderType,
      metal_type: data.metal_type,
      productName: data.product_name,
      pieces: data.pieces,
      rate: data.rate || "",
      grossWt: data.gross_weight,
      stoneWt: data.stone_weight,
      stoneCost: data.stone_cost,
      waxWt: data.wax_weight,
      amount: data.amount,
      melting: { label: `${data.melting}%`, value: data.melting },
      wastage: { label: `${data.wastage}%`, value: data.wastage },
      edit: true,
      photo: data.product_image,
      netWt: data.net_weight || "",
      pureWt: data.pure_weight || "",
      productWeightage: {
        label: data.productWeightage || "Gram",
        value: data.productWeightage || "Gram",
      },
      goldwt: data.goldwt,
      platinumWt: data.platinumWt,
      diacent: data.diamondwt,
      productType: data.productType || "GO",
      mc: data.makingCharges,
      rateFixType: data.rateFixType || "unfix",
    });

    setSelectedTypes(data.productAvlTypes);
    
    if (data.supplierCode) {
      setSelectedSupplier(data.supplierCode);
      setHasSelectedRateType(true);
    }

    if (data.sectionId) {
      setSelectedSection(data.sectionId);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.put(`${API}/gold_po/delete/${id}`);
      if (response.status === 200) {
        fetchPoUserDetails();
        showSnackbar("Product deleted successfully!", "error");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showSnackbar("Failed to delete product", "error");
    }
  };

  const handlePoSubmit = async (poData) => {
    try {
      const filteredItems = submittedData.filter((item) =>
        selectedItems.includes(item.sno)
      );

      if (!filteredItems || filteredItems.length === 0) {
        throw new Error("No items selected for the purchase order");
      }

      const submitDataForUpdate = {
        items: selectedItems,
        poDetails: poData,
      };

      const response = await axios.put(
        `${API}/gold_po/update_po_records/${userRole}/${user}`,
        submitDataForUpdate
      );

      if (response.status === 200) {
        fetchPoUserDetails();
        setIsPoDialogOpen(false);
        setSelectedItems([]);
        setSelectedDatas([]);
        showSnackbar(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting PO:", error);
      showSnackbar(error.message || "Failed to submit Purchase Order", "error");
    }
  };

  const fetchPoUserDetails = async () => {
    try {
      const response = await axios.get(
        `${API}/gold_po/Get_Po_Details/${userRole}/${names}`
      );
      setSubmittedData(response.data);
    } catch (error) {
      console.error("Error fetching PO details:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedSupplier) {
      newErrors.supplier = "Please select a supplier";
      showSnackbar("Please select a supplier before adding products", "error");
    }

    if (!selectedSection) {
      newErrors.section = "Please select a section";
      showSnackbar("Please select a section before adding products", "error");
    }

    if (formData.orderType === "office" && !formData.product) {
      newErrors.product = "Product is required for office orders";
    }

    if (formData.orderType === "fair" && !formData.productName?.trim()) {
      newErrors.productName = "Product name is required for fair orders";
    }

    if (userRole.includes("Silver") && !formData.productType) {
      newErrors.productType = "Product type is required for Silver orders";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar("Please fix the errors before submitting", "error");
      return;
    }
    
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("productAvlTypes", JSON.stringify(selectedTypes));
    formDataToSubmit.append("login", names);
    
    if (selectedSupplier) {
      formDataToSubmit.append("supplierId", selectedSupplier);
    }

    if (selectedSection) {
      formDataToSubmit.append("sectionId", selectedSection);
    }

    Object.keys(formData).forEach((key) => {
      if (key === "photo" && formData[key]) {
        formDataToSubmit.append("photo", formData[key]);
      } else if (key === "product" && formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      } else if (key === "melting" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? 0);
      } else if (key === "wastage" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? 0);
      } else if (key === "productWeightage" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? "Gram");
      } else if (key === "productType" && formData[key]) {
        formDataToSubmit.append(key, formData[key] ?? "GO");
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(`${API}/gold_po/gold_po`, formDataToSubmit);
      
      if (response.status === 201) {
        if (photoCaptureRef.current) {
          photoCaptureRef.current.recapture();
        }

        setFormData({
          product: null,
          metal_type: userRole.includes("Gold")
            ? "Gold"
            : userRole.includes("Silver")
            ? "Silver"
            : userRole.includes("Diamond")
            ? "Diamond"
            : "",
          productName: "",
          orderType: "office",
          pieces: "",
          grossWt: "",
          stoneWt: "",
          stoneCost: "",
          waxWt: "",
          netWt: "",
          amount: "",
          photo: null,
          melting: null,
          wastage: null,
          diacent: "",
          pureWt: "",
          edit: false,
          photoUrl: "",
          productType: userRole.includes("Gold")
            ? "GO"
            : userRole.includes("Diamond")
            ? "DIA"
            : "Silver",
          productWeightage: "Gram",
          mc: "",
          rate: "",
          goldwt: "",
          platinumWt: "",
          rateFixType: formData.rateFixType || "unfix",
        });
        
        setSelectedTypes({
          Gold: userRole.includes("Diamond"),
          Diamond: userRole.includes("Diamond"),
          Platinum: false,
        });
        
        fetchPoUserDetails();
        setErrors({});
        showSnackbar("Product added successfully!");
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to add product",
        "error"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Render dynamic fields
  const renderField = (field) => {
    const Component = field.component;
    const commonProps = {
      label: field.label,
      error: errors[field.name],
    };

    if (field.type === "select") {
      return (
        <Component
          key={field.name}
          {...commonProps}
          options={field.options || []}
          value={formData[field.name]}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, [field.name]: value }))
          }
        />
      );
    }

    if (field.type === "input") {
      return (
        <CustomInput
          key={field.name}
          {...commonProps}
          name={field.name}
          value={field.name === "wastage" ? formData[field.name]?.value || "" : formData[field.name] || ""}
          onChange={handleInputChange}
          disabled={field.disabled}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3">
      <div className="mx-auto">
        {/* Header - MOBILE OPTIMIZED PADDING */}
        <div className="bg-white rounded-2xl shadow-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-3">
            {(supplierLoading || sectionLoading) && (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading details...
              </div>
            )}
          </div>

          {/* Supplier Selection with Rate Type Badge - MOBILE OPTIMIZED */}
          <div className={`mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border ${errors.supplier ? 'border-red-300 border-2' : 'border-blue-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Select Supplier <span className="text-red-500">*</span>
              </label>
              {selectedSupplier && hasSelectedRateType && (
                <div className="flex items-center gap-1.5">
                  <span 
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      formData.rateFixType === "fix" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {formData.rateFixType === "fix" ? "Fix Rate" : "Unfix Rate"}
                  </span>
                  <button
                    onClick={() => setIsRateModalOpen(true)}
                    className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-200 active:scale-95 transition-all"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            <CustomSelects
              options={supplierOptions}
              value={selectedSupplier}
              onChange={(value) => {
                setSelectedSupplier(value);
                setHasSelectedRateType(false);
                setSelectedSection(null);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.supplier;
                  return newErrors;
                });
              }}
              placeholder="Search and select supplier..."
            />
            {selectedSupplier && (
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Supplier selected: {supplierOptions.find(s => s.value === selectedSupplier)?.label || selectedSupplier}
              </div>
            )}
            {errors.supplier && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.supplier}
              </p>
            )}
          </div>

          {/* Section Selection - NEW FEATURE */}
          {selectedSupplier && (
            <div className={`mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border ${errors.section ? 'border-red-300 border-2' : 'border-purple-200'}`}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Section <span className="text-red-500">*</span>
              </label>
              {sectionLoading ? (
                <div className="flex items-center justify-center py-3 text-purple-600">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading sections...
                </div>
              ) : (
                <>
                  <CustomSelects
                    options={sectionOptions}
                    value={selectedSection}
                    onChange={(value) => {
                      setSelectedSection(value);
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.section;
                        return newErrors;
                      });
                    }}
                    placeholder="Search and select section..."
                  />
                  {selectedSection && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Section selected: {sectionOptions.find(s => s.value === selectedSection)?.label || selectedSection}
                    </div>
                  )}
                  {errors.section && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.section}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* Order Type Selection - COMPACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 p-3 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Order Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="orderType"
                    value="office"
                    checked={formData.orderType === "office"}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        orderType: "office",
                        productName: "",
                      }));
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.productName;
                        return newErrors;
                      });
                    }}
                    className="form-radio h-4 w-4 text-blue-600 transition-all cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                    Office Selection
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="orderType"
                    value="fair"
                    checked={formData.orderType === "fair"}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        orderType: "fair",
                      }));
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.product;
                        return newErrors;
                      });
                    }}
                    className="form-radio h-4 w-4 text-blue-600 transition-all cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                    Exhibition
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Type Selection for Silver - COMPACT */}
          {userRole.includes("Silver") && (
            <div className={`bg-gray-50 p-3 rounded-xl mb-3 ${errors.productType ? 'border-2 border-red-300' : ''}`}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["SILVER", "GIFT ARTICLES", "AIRAA SILVER", "SILVER JEWELLERY"].map((type) => (
                  <label key={type} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="productType"
                      value={type}
                      checked={formData.productType === type}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          productType: type,
                        }));
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.productType;
                          return newErrors;
                        });
                      }}
                      className="form-radio h-4 w-4 text-purple-600 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700 group-hover:text-purple-600 transition-colors font-medium">
                      {type === "GA" ? "Gift Article" : type}
                    </span>
                  </label>
                ))}
              </div>
              {errors.productType && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.productType}
                </p>
              )}
            </div>
          )}

          {/* Product Type Selection for Diamond - COMPACT */}
          {userRole.includes("Diamond") && (
            <div className="bg-gray-50 p-3 rounded-xl mb-3">
              <ProductTypeSelection
                formData={formData}
                setFormData={setFormData}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
              />
            </div>
          )}
        </div>

        {/* Dynamic Form Fields - COMPACT GAP SPACING */}
        <div className="bg-white rounded-xl shadow-xl p-3 mb-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {formFieldsConfig.map((field) => renderField(field))}
          </div>

          {/* Photo Capture - COMPACT MARGIN */}
          <div className="mt-2 border-t pt-2">
            <PhotoCapture
              ref={photoCaptureRef}
              onPhotoCapture={handlePhotoCapture}
              photoUrl={formData.photo ? formData.photo : null}
            />
          </div>

          {/* Submit Button - COMPACT SPACING */}
          <div className="flex justify-center mt-3">
            {((formData?.productWeightage?.value === "Pcs" &&
              formData.rate &&
              formData.pieces) ||
              (formData.netWt && parseFloat(formData.netWt) > 0)) && (
              <button
                onClick={handleSubmit}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 active:scale-95 transition-all duration-200 shadow-lg"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Submitted Data - COMPACT PADDING */}
        <div className="bg-white rounded-2xl shadow-xl p-3">
          {!selectedSupplier && (
            <div className="text-center py-8 text-amber-600 bg-amber-50 rounded-xl border-2 border-amber-200">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-bold mb-2">Please Select a Supplier First</p>
              <p className="text-sm">Select a supplier from the dropdown above to view and manage items</p>
            </div>
          )}
          
          {selectedSupplier && !selectedSection && (
            <div className="text-center py-8 text-purple-600 bg-purple-50 rounded-xl border-2 border-purple-200">
              <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-bold mb-2">Please Select a Section</p>
              <p className="text-sm">Select a section to view products for this supplier</p>
            </div>
          )}
          
          {selectedSupplier && selectedSection && filteredSubmittedData.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-semibold mb-2">No Items Found</p>
              <p className="text-sm">No products have been added for this section yet</p>
              <p className="text-xs text-gray-400 mt-2">Add products using the form above</p>
            </div>
          )}
          
          {selectedSupplier && selectedSection && filteredSubmittedData.length > 0 && (
            <>
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-900 font-semibold">
                      Showing <span className="text-base font-bold text-blue-700">{filteredSubmittedData.length}</span> {filteredSubmittedData.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      <span className="font-semibold">
                        Section: {sectionOptions.find(s => s.value === selectedSection)?.label}
                      </span>
                    </p>
                  </div>
                  {selectedItems.length > 0 && (
                    <div className="bg-green-100 px-3 py-1.5 rounded-lg border border-green-300">
                      <p className="text-sm text-green-800 font-semibold">
                        {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <SubmittedDataComp
                submittedData={filteredSubmittedData}
                handleSelect={handleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedItems={selectedItems}
                ispocreation={false}
              />
            </>
          )}
        </div>

        {/* Create PO Button - COMPACT SPACING */}
        {selectedItems.length > 0 && selectedSupplier && selectedSection && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setIsPoDialogOpen(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-bold rounded-xl hover:from-green-700 hover:to-green-800 active:scale-95 transition-all duration-200 shadow-xl"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Create Purchase Order ({selectedItems.length} items selected)</span>
                <span className="sm:hidden">Create PO ({selectedItems.length})</span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Rate Type Modal */}
      <RateTypeModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        onSelect={handleRateTypeSelect}
        currentRateType={formData.rateFixType || "unfix"}
      />

      {/* Purchase Order Dialog */}
      <PurchaseOrderDialog
        isOpen={isPoDialogOpen}
        metal_type={metal}
        type={formData.rateFixType || "unfix"}
        selectedDatas={selectedDatas}
        supplierId={selectedSupplier}
        onClose={() => {
          setIsPoDialogOpen(false);
          setSelectedItems([]);
          setSelectedDatas([]);
        }}
        onSubmit={handlePoSubmit}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
        position="top-right"
        duration={5000}
      />
    </div>
  );
};

export default GoldProductForm;
