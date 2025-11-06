

// import React, { useState, useEffect, useRef, useContext } from "react";
// import {
//   ChevronRight,
//   ChevronLeft,
//   GripVertical,
//   Search,
//   Calendar,
// } from "lucide-react";
// import axios from "axios";
// import { API } from "../../../config/configData";
// import PurchaseOrderGenerator from "./PurchaseOrderGenerator";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import { PoContext } from "../PoContext/PoContext";
// import PurchaseOrderPreview from "./PurchaseOrderPreview";

// const PurchaseOrderDialog = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   metal_type,
//   orderType,
//   selectedItems,
//   pdftype,
//   selectedDatas,
//   po,
//   supplierId,
//   type
// }) => {
//   const dialogRef = useRef(null);
//   console.log(selectedDatas)

//   const { userRole } = useContext(DashBoardContext);
//   const { COMPANY_PRESETS, initialState, Tct_COMPANY_PRESETS, Parent_COMPANY_PRESETS } =
//     useContext(PoContext);
  
//   const [currentStep, setCurrentStep] = useState(1);
//   const [companyType, setCompanyType] = useState("");
//   const [formData, setFormData] = useState(initialState);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [errors, setErrors] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   useEffect(() => {
//     if (!isOpen) {
//       setFormData(initialState);
//       setCompanyType("");
//       setCurrentStep(1);
//       setErrors({});
//       setSearchQuery("");
//       setSearchResults([]);
//     }
//   }, [isOpen, initialState]);

//   console.log(supplierId);

//   useEffect(() => {
//     const fetchSupplierdetails = async () => {
//       if (!supplierId) return;
      
//       try {
//         const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_details/${supplierId}`);
//         console.log("Supplier details response:", response);
        
//         if (response.data) {
//           const supplierData = response.data.supplierDatas[0];
//           setFormData((prev) => ({
//             ...prev,
//             supplier: {
//               name: supplierData.companyname || "",
//               doorNo: supplierData.doorno || "",
//               streetName: supplierData.street || "",
//               city: supplierData.city || "",
//               area: supplierData.area || "",
//               state: supplierData.state || "",
//               pincode: supplierData.pincode || "",
//               phone: supplierData.mobilenumber || "",
//               email: supplierData.email || "",
//               gstNo: supplierData.gst || "",
//             },
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching supplier details:", error);
//       }
//     };
    
//     fetchSupplierdetails();
//   }, [supplierId, isOpen]);

//   // Auto-reset payment type if Labour Bill becomes invalid
//   useEffect(() => {
//     if (
//       formData.delivery.paymentType === "Labour Bill" &&
//       (po !== "tct" || orderType === "unfix")
//     ) {
//       setFormData((prev) => ({
//         ...prev,
//         delivery: {
//           ...prev.delivery,
//           paymentType: "RTGS",
//         },
//       }));
//     }
//   }, [po, orderType, formData.delivery.paymentType]);

//   useEffect(() => {
//     const fetchNextPoNumber = async () => {
//       try {
//         const companyData = po && po === 'tct' 
//           ? Tct_COMPANY_PRESETS['tct'] 
//           : COMPANY_PRESETS[companyType];
        
//         if (companyData) {
//           setFormData((prev) => ({
//             ...prev,
//             from: {
//               ...companyData,
//               parentCompany: prev.from.parentCompany || "",
//             },
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching PO number:", error);
//       }
//     };

//     if (companyType || (po && po === 'tct')) {
//       fetchNextPoNumber();
//     }
//   }, [companyType, metal_type, orderType, po, COMPANY_PRESETS, Tct_COMPANY_PRESETS]);

//   const handleSupplierSelect = (supplier) => {
//     setFormData((prev) => ({
//       ...prev,
//       supplier: {
//         name: supplier.companyname || "",
//         doorNo: supplier.doorno || "",
//         streetName: supplier.street || "",
//         city: supplier.city || "",
//         area: supplier.area || "",
//         state: supplier.state || "",
//         pincode: supplier.pincode || "",
//         phone: supplier.mobilenumber || "",
//         email: supplier.email || "",
//         gstNo: supplier.gst || "",
//       },
//     }));

//     setSearchQuery(supplier.companyname);
//     setSearchResults([]);

//     const supplierFieldsToValidate = [
//       "name",
//       "doorNo",
//       "streetName",
//       "city",
//       "state",
//       "pincode",
//       "phone",
//       "email",
//       "gstNo",
//     ];

//     const newErrors = {};

//     supplierFieldsToValidate.forEach((field) => {
//       const tempFormData = {
//         ...formData,
//         supplier: {
//           ...formData.supplier,
//           [field]: supplier[fieldMapping[field]] || "",
//         },
//       };
      
//       const error = validateFieldWithData(tempFormData, "supplier", field);

//       if (error) {
//         newErrors[`supplier.${field}`] = error;
//       }
//     });

//     setErrors((prev) => ({
//       ...prev,
//       ...newErrors,
//     }));
//   };

//   const fieldMapping = {
//     name: "companyname",
//     doorNo: "doorno",
//     streetName: "street",
//     city: "city",
//     area: "area",
//     state: "state",
//     pincode: "pincode",
//     phone: "mobilenumber",
//     email: "email",
//     gstNo: "gst",
//   };

//  // Validation rules configuration
// const validationRules = {
//   supplier: {
//     name: {
//       required: true,
//       message: "Name is required",
//     },
//     gstNo: {
//       required: true,
//       pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//       messages: {
//         required: "GST Number is required",
//         invalid: "Invalid GST format",
//       },
//     },
//     phone: {
//       required: true,
//       pattern: /^\d{10}$/,
//       messages: {
//         required: "Phone number is required",
//         invalid: "Phone must be 10 digits",
//       },
//     },
//     email: {
//       required: true,
//       pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//       messages: {
//         required: "Email is required",
//         invalid: "Invalid email format",
//       },
//     },
//     doorNo: {
//       required: true,
//       message: "Door No is required",
//     },
//     streetName: {
//       required: true,
//       message: "Street Name is required",
//     },
//     city: {
//       required: true,
//       message: "City is required",
//     },
//     state: {
//       required: true,
//       message: "State is required",
//     },
//     pincode: {
//       required: true,
//       pattern: /^\d{6}$/,
//       messages: {
//         required: "Pincode is required",
//         invalid: "Pincode must be 6 digits",
//       },
//     },
//   },
//   counterDetails: {
//     purchaseIncharge: {
//       required: true,
//       message: "Purchase Incharge is required",
//     },
//     purchaseManager: {
//       required: true,
//       message: "Purchase Manager is required",
//     },
//   },
//   delivery: {
//     address: {
//       required: true,
//       message: "Delivery address is required",
//     },
//     paymentType: {
//       required: true,
//       message: "Payment Type is required",
//     },
//   },
//   poDetails: {
//     poDate: {
//       required: true,
//       message: "PO Date is required",
//     },
//     dueDate: {
//       required: true,
//       message: "Due Date is required",
//       custom: (value, formData) => {
//         if (value < formData.poDetails.poDate) {
//           return "Due Date cannot be earlier than PO Date";
//         }
//         return null;
//       },
//     },
//   },
// };

// // Generic validation function
// const validateFieldGeneric = (value, rule, formData = null) => {
//   // Check if value is empty
//   const isEmpty = !value || (typeof value === "string" && value.trim() === "");

//   // Required validation
//   if (rule.required && isEmpty) {
//     return rule.messages?.required || rule.message;
//   }

//   // Skip pattern validation if value is empty and not required
//   if (isEmpty) {
//     return null;
//   }

//   // Pattern validation
//   if (rule.pattern && !rule.pattern.test(value)) {
//     return rule.messages?.invalid || rule.message;
//   }

//   // Custom validation
//   if (rule.custom && formData) {
//     return rule.custom(value, formData);
//   }

//   return null;
// };

// // Validate field with external data (for search results)
// const validateFieldWithData = (data, section, field) => {
//   const value = data[section]?.[field];
//   const rule = validationRules[section]?.[field];

//   if (!rule) {
//     return null;
//   }

//   return validateFieldGeneric(value, rule, data);
// };

// // Validate field with formData
// const validateField = (section, field) => {
//   const value = formData[section]?.[field];
//   const rule = validationRules[section]?.[field];

//   if (!rule) {
//     return null;
//   }

//   return validateFieldGeneric(value, rule, formData);
// };

// // Validate entire section
// const validateSection = (section) => {
//   const sectionErrors = {};
//   const rules = validationRules[section];

//   if (!rules) {
//     return sectionErrors;
//   }

//   Object.keys(rules).forEach((field) => {
//     const error = validateField(section, field);
//     if (error) {
//       sectionErrors[field] = error;
//     }
//   });

//   return sectionErrors;
// };

// // Validate entire form
// const validateForm = () => {
//   const allErrors = {};

//   Object.keys(validationRules).forEach((section) => {
//     const sectionErrors = validateSection(section);
//     if (Object.keys(sectionErrors).length > 0) {
//       allErrors[section] = sectionErrors;
//     }
//   });

//   return allErrors;
// };

// // Check if form is valid
// const isFormValid = () => {
//   const errors = validateForm();
//   return Object.keys(errors).length === 0;
// };

// // Handle search change
// const handleSearchChange = (e) => {
//   const query = e.target.value;
//   setSearchQuery(query);
  
//   if (query.length >= 2) {
//     fetchSupplierDetailsByName(query);
//   } else {
//     setSearchResults([]);
//   }
// };

// // Handle input change with validation
// const handleInputChangeWithValidation = (section, field, value) => {
//   // Update form data
//   setFormData((prev) => ({
//     ...prev,
//     [section]: {
//       ...prev[section],
//       [field]: value,
//     },
//   }));

//   // Validate field
//   const error = validateFieldGeneric(
//     value,
//     validationRules[section]?.[field],
//     formData
//   );

//   // Update errors
//   setErrors((prev) => ({
//     ...prev,
//     [section]: {
//       ...prev[section],
//       [field]: error,
//     },
//   }));
// };

// // Clear specific field error
// const clearFieldError = (section, field) => {
//   setErrors((prev) => {
//     const newErrors = { ...prev };
//     if (newErrors[section]) {
//       delete newErrors[section][field];
//       if (Object.keys(newErrors[section]).length === 0) {
//         delete newErrors[section];
//       }
//     }
//     return newErrors;
//   });
// };

// // Validate on blur
// const handleBlur = (section, field) => {
//   const error = validateField(section, field);
  
//   if (error) {
//     setErrors((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: error,
//       },
//     }));
//   } else {
//     clearFieldError(section, field);
//   }
// };

//   const selectedCompany =
//     po === "tct"
//       ? Tct_COMPANY_PRESETS["tct"]
//       : COMPANY_PRESETS[companyType] || {};

//   const validateStep = (step) => {
//     const newErrors = {};

//     if (step === 1) {
//       if (!companyType && !(po && po === "tct")) {
//         newErrors.companyType = "Please select a company";
//       }

//       ["poDate", "dueDate"].forEach(field => {
//         const error = validateField("poDetails", field);
//         if (error) {
//           newErrors[`poDetails.${field}`] = error;
//         }
//       });

//       if (formData?.from?.poPreFix === "TCT" && !formData.from.parentCompany) {
//         newErrors["from.parentCompany"] = "Please select a parent company";
//       }
//     } else if (step === 2) {
//       const supplierFields = [
//         "name",
//         "doorNo",
//         "streetName",
//         "city",
//         "state",
//         "pincode",
//         "phone",
//         "email",
//         "gstNo",
//       ];

//       supplierFields.forEach((field) => {
//         const error = validateField("supplier", field);
//         if (error) {
//           newErrors[`supplier.${field}`] = error;
//         }
//       });
//     } else if (step === 3) {
//       ["purchaseIncharge", "purchaseManager"].forEach((field) => {
//         const error = validateField("counterDetails", field);
//         if (error) {
//           newErrors[`counterDetails.${field}`] = error;
//         }
//       });

//       const deliveryError = validateField("delivery", "address");
//       if (deliveryError) {
//         newErrors["delivery.address"] = deliveryError;
//       }
//       const paymentTypeError = validateField("delivery", "paymentType");
//       if (paymentTypeError) {
//         newErrors["delivery.paymentType"] = paymentTypeError;
//       }
//     }
    

//     return newErrors;
//   };

//   const handleInputChange = (section, field, value, step) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));

//     const errorKey = `${section}.${field}`;
//     const error = validateField(section, field);

//     if (error) {
//       setErrors((prev) => ({
//         ...prev,
//         [errorKey]: error,
//       }));
//     } else if (errors[errorKey]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[errorKey];
//         return newErrors;
//       });
//     }
//   };

//   const handleParentCompanyChange = (selectedParentKey) => {
//     handleInputChange("from", "parentCompany", selectedParentKey, "1");
    
//     const selectedParentPreset = Parent_COMPANY_PRESETS[selectedParentKey];
//     if (selectedParentPreset) {
//       setFormData((prev) => ({
//         ...prev,
//         from: {
//           ...prev.from,
//           parentCompany: selectedParentKey,
//         },
//         parentCompany: {
//           name: selectedParentPreset.name || "",
//           subTitle: selectedParentPreset.subTitle || "",
//           doorNo: selectedParentPreset.doorNo || "",
//           streetName: selectedParentPreset.streetName || "",
//           city: selectedParentPreset.city || "",
//           state: selectedParentPreset.state || "",
//           pincode: selectedParentPreset.pincode || "",
//           phone: selectedParentPreset.phone || "",
//           email: selectedParentPreset.email || "",
//           gstNo: selectedParentPreset.gstNo || "",
//         },
//       }));

//       if (errors["from.parentCompany"]) {
//         setErrors((prev) => {
//           const newErrors = { ...prev };
//           delete newErrors["from.parentCompany"];
//           return newErrors;
//         });
//       }
//     }
//   };

//   const handleNext = () => {
//     const newErrors = validateStep(currentStep);
//     if (Object.keys(newErrors).length === 0) {
//       setCurrentStep((prev) => prev + 1);
//       setErrors({});
//     } else {
//       setErrors(newErrors);
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentStep((prev) => prev - 1);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const step1Errors = validateStep(1);
//     const step2Errors = validateStep(2);
//     const step3Errors = validateStep(3);

//     const allErrors = {
//       ...step1Errors,
//       ...step2Errors,
//       ...step3Errors,
//     };

//     if (Object.keys(allErrors).length === 0) {
//       onSubmit(formData);
//       onClose();
//     } else {
//       setErrors(allErrors);

//       if (Object.keys(step1Errors).length > 0) {
//         setCurrentStep(1);
//       } else if (Object.keys(step2Errors).length > 0 && currentStep > 2) {
//         setCurrentStep(2);
//       }
//     }
//   };

//   const handleCompanyTypeChange = (e) => {
//     const value = e.target.value;
//     setCompanyType(value);

//     if (errors.companyType) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.companyType;
//         return newErrors;
//       });
//     }
//   };

//   const inputClasses = (errorKey) =>
//     `w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
//       errors[errorKey]
//         ? "border-red-500 focus:ring-red-200"
//         : "border-gray-300 focus:border-blue-500"
//     }`;

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 Company Selection
//               </h3>
//               <div className="space-y-2">
//                 <div className="relative">
//                   <select
//                     value={companyType}
//                     onChange={handleCompanyTypeChange}
//                     className="w-full p-3 border rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     disabled={po && po === "tct"}
//                   >
//                     <option value="" disabled>
//                       Select company type
//                     </option>
//                     {(po && po === "tct"
//                       ? Object.entries(Tct_COMPANY_PRESETS)
//                       : Object.entries(COMPANY_PRESETS)
//                     ).map(([key, preset]) => (
//                       <option key={key} value={key} className="py-2">
//                         {preset.name} {preset.subTitle}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                     <svg
//                       className="w-4 h-4 text-gray-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 {companyType && COMPANY_PRESETS[companyType]?.subTitle && (
//                   <p className="text-sm text-gray-500 mt-1">
//                     {COMPANY_PRESETS[companyType].subTitle}
//                   </p>
//                 )}
//                 {errors.companyType && (
//                   <p className="text-sm text-red-600">{errors.companyType}</p>
//                 )}
//               </div>
//             </div>

//             {formData?.from?.poPreFix === "TCT" && (
//               <div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     PO From*
//                   </label>
//                   <select
//                     value={formData.from.parentCompany}
//                     onChange={(e) => handleParentCompanyChange(e.target.value)}
//                     className={`w-full p-3 border rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors["from.parentCompany"] ? "border-red-500" : ""
//                     }`}
//                   >
//                     <option value="" disabled>
//                       Select parent company
//                     </option>
//                     {Object.entries(Parent_COMPANY_PRESETS).map(([key, preset]) => (
//                       <option key={key} value={key} className="py-2">
//                         {preset.name} {preset.subTitle}
//                       </option>
//                     ))}
//                   </select>
//                   <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                     <svg
//                       className="w-4 h-4 text-gray-500"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//                 {errors["from.parentCompany"] && (
//                   <p className="text-sm text-red-600 mt-1">
//                     {errors["from.parentCompany"]}
//                   </p>
//                 )}
//                 {formData.from.parentCompany && formData.parentCompany.name && (
//                   <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
//                     <h4 className="text-sm font-semibold text-blue-700 mb-2">
//                       Selected Parent Company Preview
//                     </h4>
//                     <div className="space-y-1 text-sm text-blue-600">
//                       <p className="font-medium">{formData.parentCompany.name}</p>
//                       <p>
//                         {formData.parentCompany.doorNo}, {formData.parentCompany.streetName}
//                       </p>
//                       <p>
//                         {formData.parentCompany.city} – {formData.parentCompany.pincode}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="bg-white p-4 rounded-lg border border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {formData?.from?.poPreFix === "TCT" ? "Job" : "Purchase"} Order
//                 Details
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {formData?.from?.poPreFix === "TCT"
//                       ? " Issue Date*"
//                       : " PO Date*"}
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.poDetails.poDate}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "poDetails",
//                         "poDate",
//                         e.target.value,
//                         "1"
//                       )
//                     }
//                     className={inputClasses("poDetails.poDate")}
//                   />
//                   {errors["poDetails.poDate"] && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors["poDetails.poDate"]}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Due Date*
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.poDetails.dueDate}
//                     onChange={(e) =>
//                       handleInputChange(
//                         "poDetails",
//                         "dueDate",
//                         e.target.value,
//                         "1"
//                       )
//                     }
//                     className={inputClasses("poDetails.dueDate")}
//                   />
//                   {errors["poDetails.dueDate"] && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors["poDetails.dueDate"]}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {(companyType || (po && po === "tct")) && (
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="text-sm font-semibold text-gray-700 mb-3">
//                   Selected Company Preview
//                 </h3>
//                 <div className="space-y-2 text-sm text-gray-600">
//                   <p>
//                     {selectedCompany.doorNo}, {selectedCompany.streetName}
//                   </p>
//                   <p>
//                     {selectedCompany.city} – {selectedCompany.pincode}
//                   </p>
//                   <p>{selectedCompany.state}</p>
//                   <div className="pt-2 mt-2 border-t border-gray-200">
//                     <p>Phone: {selectedCompany.phone}</p>
//                     <p>Email: {selectedCompany.email}</p>
//                     <p>GST: {selectedCompany.gstNo}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Supplier Information
//             </h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Supplier Name*
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.supplier.name}
//                   disabled={true}
//                   onChange={(e) =>
//                     handleInputChange("supplier", "name", e.target.value, "2")
//                   }
//                   className={inputClasses("supplier.name")}
//                   placeholder="Enter supplier name"
//                 />
//                 {errors["supplier.name"] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors["supplier.name"]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   GST Number*
//                 </label>
//                 <input
//                   type="text"
//                   disabled={true}
//                   value={formData.supplier.gstNo}
//                   onChange={(e) =>
//                     handleInputChange("supplier", "gstNo", e.target.value, "2")
//                   }
//                   className={inputClasses("supplier.gstNo")}
//                   placeholder="Enter GST number"
//                 />
//                 {errors["supplier.gstNo"] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors["supplier.gstNo"]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone*
//                 </label>
//                 <input
//                   type="tel"
//                   value={formData.supplier.phone}
//                   onChange={(e) =>
//                     handleInputChange("supplier", "phone", e.target.value, "2")
//                   }
//                   className={inputClasses("supplier.phone")}
//                   placeholder="Enter phone number"
//                 />
//                 {errors["supplier.phone"] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors["supplier.phone"]}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email*
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.supplier.email}
//                   disabled={true}
//                   onChange={(e) =>
//                     handleInputChange("supplier", "email", e.target.value, "2")
//                   }
//                   className={inputClasses("supplier.email")}
//                   placeholder="Enter email address"
//                 />
//                 {errors["supplier.email"] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors["supplier.email"]}
//                   </p>
//                 )}
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address Details*
//                 </label>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Door No*"
//                       value={formData.supplier.doorNo}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "doorNo",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className={inputClasses("supplier.doorNo")}
//                     />
//                     {errors["supplier.doorNo"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["supplier.doorNo"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Street Name*"
//                       value={formData.supplier.streetName}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "streetName",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className={inputClasses("supplier.streetName")}
//                     />
//                     {errors["supplier.streetName"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["supplier.streetName"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Area"
//                       value={formData.supplier.area}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "area",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="md:col-span-2">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       City*
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.supplier.city}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "city",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className={inputClasses("supplier.city")}
//                       placeholder="Enter city"
//                     />
//                     {errors["supplier.city"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["supplier.city"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       State*
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.supplier.state}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "state",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className={inputClasses("supplier.state")}
//                       placeholder="Enter state"
//                     />
//                     {errors["supplier.state"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["supplier.state"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Pincode*
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.supplier.pincode}
//                       disabled={true}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "supplier",
//                           "pincode",
//                           e.target.value,
//                           "2"
//                         )
//                       }
//                       className={inputClasses("supplier.pincode")}
//                       placeholder="Enter pincode"
//                     />
//                     {errors["supplier.pincode"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["supplier.pincode"]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Authorization Details
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Purchase Incharge*
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.counterDetails.purchaseIncharge}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "counterDetails",
//                           "purchaseIncharge",
//                           e.target.value,
//                           "3"
//                         )
//                       }
//                       className={inputClasses(
//                         "counterDetails.purchaseIncharge"
//                       )}
//                       placeholder="Enter name"
//                     />
//                     {errors["counterDetails.purchaseIncharge"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["counterDetails.purchaseIncharge"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Purchase Manager*
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.counterDetails.purchaseManager}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "counterDetails",
//                           "purchaseManager",
//                           e.target.value,
//                           "3"
//                         )
//                       }
//                       className={inputClasses("counterDetails.purchaseManager")}
//                       placeholder="Enter name"
//                     />
//                     {errors["counterDetails.purchaseManager"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["counterDetails.purchaseManager"]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                   Delivery Details
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Delivery Type
//                     </label>
//                     <div className="flex gap-4 flex-wrap">
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="locationType"
//                           value="direct"
//                           checked={formData.delivery.locationType === "direct"}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "delivery",
//                               "locationType",
//                               e.target.value,
//                               "3"
//                             )
//                           }
//                           className="form-radio h-4 w-4 text-blue-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-700">
//                           Direct
//                         </span>
//                       </label>
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="locationType"
//                           value="courier"
//                           checked={formData.delivery.locationType === "courier"}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "delivery",
//                               "locationType",
//                               e.target.value,
//                               "3"
//                             )
//                           }
//                           className="form-radio h-4 w-4 text-blue-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-700">
//                           Courier
//                         </span>
//                       </label>
//                     </div>
//                   </div>
//                   {console.log(formData?.from)}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Payment Type
//                     </label>
//                     <div className="flex gap-4 flex-wrap">
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="paymentType"
//                           value="RTGS"
//                           checked={formData.delivery.paymentType === "RTGS"}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "delivery",
//                               "paymentType",
//                               e.target.value,
//                               "3"
//                             )
//                           }
//                           className="form-radio h-4 w-4 text-blue-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-700">RTGS</span>
//                       </label>
//                       {formData?.from?.poPreFix !== "TCT"&&
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="paymentType"
//                           value="MSB"
//                           checked={formData.delivery.paymentType === "MSB"}
//                           onChange={(e) =>
//                             handleInputChange(
//                               "delivery",
//                               "paymentType",
//                               e.target.value,
//                               "3"
//                             )
//                           }
//                           className="form-radio h-4 w-4 text-blue-600"
//                         />
//                         <span className="ml-2 text-sm text-gray-700">
//                          MSB
//                         </span>
//                       </label>
//     }
//                       {/* Conditional Labour Bill option */}
//                       {formData?.from?.poPreFix === "TCT" && type !== "unfix" && (
//                         <label className="inline-flex items-center">
//                           <input
//                             type="radio"
//                             name="paymentType"
//                             value="IV"
//                             checked={formData.delivery.paymentType === "IV"}
//                             onChange={(e) =>
//                               handleInputChange(
//                                 "delivery",
//                                 "paymentType",
//                                 e.target.value,
//                                 "3"
//                               )
//                             }
//                             className="form-radio h-4 w-4 text-blue-600"
//                           />
//                           <span className="ml-2 text-sm text-gray-700">
//                            Issue Voucher
//                           </span>
//                         </label>
//                       )}
//                     </div>
//                      {errors["delivery.paymentType"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["delivery.paymentType"]}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Delivery Address*
//                     </label>
//                     <textarea
//                       value={formData.delivery.address}
//                       onChange={(e) =>
//                         handleInputChange(
//                           "delivery",
//                           "address",
//                           e.target.value,
//                           "3"
//                         )
//                       }
//                       className={`${inputClasses(
//                         "delivery.address"
//                       )} resize-none min-h-[100px]`}
//                       placeholder="Enter full delivery address"
//                     ></textarea>
//                     {errors["delivery.address"] && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors["delivery.address"]}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 4:
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               Review Purchase Order
//             </h3>
//             <div className="bg-white rounded-lg border border-gray-200">
//               {console.log("Selected Datas:", selectedDatas)}
//               <PurchaseOrderPreview
//                 datas={selectedDatas}
//                 supplierDetails={formData}
//               />
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   const startDragging = (e) => {
//     if (dialogRef.current) {
//       const rect = dialogRef.current.getBoundingClientRect();
//       setPosition({
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top,
//       });

//       document.addEventListener("mousemove", onDrag);
//       document.addEventListener("mouseup", stopDragging);
//     }
//   };

//   const onDrag = (e) => {
//     if (dialogRef.current) {
//       const newX = e.clientX - position.x;
//       const newY = e.clientY - position.y;

//       dialogRef.current.style.left = `${newX}px`;
//       dialogRef.current.style.top = `${newY}px`;
//     }
//   };

//   const stopDragging = () => {
//     document.removeEventListener("mousemove", onDrag);
//     document.removeEventListener("mouseup", stopDragging);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div
//         ref={dialogRef}
//         className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
//       >
//         <div
//           className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b cursor-move"
//           onMouseDown={startDragging}
//         >
//           <div className="flex items-center">
//             <GripVertical className="w-5 h-5 text-gray-400 mr-3" />
//             <h2 className="text-xl font-semibold text-gray-800">
//               {currentStep === 4 ? "Review" : "Create"} Purchase Order
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 focus:outline-none"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         <div className="px-6 py-4 bg-white border-b">
//           <div className="flex items-center justify-between">
//             {[1, 2, 3, 4].map((step) => (
//               <div
//                 key={step}
//                 className={`flex items-center ${step < 4 ? "flex-1" : ""}`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                     step <= currentStep
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   {step}
//                 </div>
//                 {step < 4 && (
//                   <div
//                     className={`h-1 flex-1 mx-2 ${
//                       step < currentStep ? "bg-blue-600" : "bg-gray-200"
//                     }`}
//                   ></div>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center justify-between mt-2">
//             <div className="flex-1 text-center text-xs text-gray-500">
//               Company & PO
//             </div>
//             <div className="flex-1 text-center text-xs text-gray-500">
//               Supplier Details
//             </div>
//             <div className="flex-1 text-center text-xs text-gray-500">
//               Additional Info
//             </div>
//             <div className="flex-1 text-center text-xs text-gray-500">
//               Review
//             </div>
//           </div>
//         </div>

//         <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-300px)]">
//           {renderStep()}
//         </div>

//         <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <div className="flex space-x-2">
//             {currentStep > 1 && (
//               <button
//                 onClick={handlePrevious}
//                 className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center"
//               >
//                 <ChevronLeft className="w-4 h-4 mr-1" />
//                 Previous
//               </button>
//             )}
//             {currentStep < 4 ? (
//               <button
//                 onClick={handleNext}
//                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
//               >
//                 Next
//                 <ChevronRight className="w-4 h-4 ml-1" />
//               </button>
//             ) : (
//               <button
//                 onClick={handleSubmit}
//                 className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
//               >
//                 Generate PO
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PurchaseOrderDialog;
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ChevronRight,
  ChevronLeft,
  GripVertical,
} from "lucide-react";
import axios from "axios";
import { API } from "../../../config/configData";
import PurchaseOrderGenerator from "./PurchaseOrderGenerator";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { PoContext } from "../PoContext/PoContext";
import PurchaseOrderPreview from "./PurchaseOrderPreview";
import FormInput from "./FormInput";
import { getFormFields } from "./formConfig";

const PurchaseOrderDialog = ({
  isOpen,
  onClose,
  onSubmit,
  metal_type,
  orderType,
  selectedItems,
  pdftype,
  selectedDatas,
  po,
  supplierId,
  type
}) => {
  const dialogRef = useRef(null);
  const { userRole } = useContext(DashBoardContext);
  const { COMPANY_PRESETS, initialState, Tct_COMPANY_PRESETS, Parent_COMPANY_PRESETS } =
    useContext(PoContext);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [companyType, setCompanyType] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [errors, setErrors] = useState({});
  const [isIssueDateToday, setIsIssueDateToday] = useState(true);

  // Check if current context is TCT
  const isTCT = po === "tct" || formData?.from?.poPreFix === "TCT";

  // Get form fields configuration
  const formFields = getFormFields(
    formData,
    po,
    type,
    COMPANY_PRESETS,
    Tct_COMPANY_PRESETS,
    Parent_COMPANY_PRESETS
  );

  const validationRules = {
    supplier: {
      name: { required: true, message: "Name is required" },
      gstNo: {
        required: true,
        pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        messages: { required: "GST Number is required", invalid: "Invalid GST format" },
      },
      phone: {
        required: true,
        pattern: /^\d{10}$/,
        messages: { required: "Phone number is required", invalid: "Phone must be 10 digits" },
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: { required: "Email is required", invalid: "Invalid email format" },
      },
      doorNo: { required: true, message: "Door No is required" },
      streetName: { required: true, message: "Street Name is required" },
      city: { required: true, message: "City is required" },
      state: { required: true, message: "State is required" },
      pincode: {
        required: true,
        pattern: /^\d{6}$/,
        messages: { required: "Pincode is required", invalid: "Pincode must be 6 digits" },
      },
    },
    counterDetails: {
      purchaseIncharge: { required: true, message: "Purchase Incharge is required" },
      purchaseManager: { required: true, message: "Purchase Manager is required" },
    },
    delivery: {
      address: { required: true, message: "Delivery address is required" },
      paymentType: { required: true, message: "Payment Type is required" },
    },
    poDetails: {
      poDate: { required: true, message: "PO Date is required" },
      dueDate: {
        required: true,
        message: "Due Date is required",
        custom: (value, formData) => {
          if (value < formData.poDetails.poDate) {
            return "Due Date cannot be earlier than PO Date";
          }
          return null;
        },
      },
    },
  };

  const validateFieldGeneric = (value, rule, formData = null) => {
    const isEmpty = !value || (typeof value === "string" && value.trim() === "");
    if (rule.required && isEmpty) {
      return rule.messages?.required || rule.message;
    }
    if (isEmpty) return null;
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.messages?.invalid || rule.message;
    }
    if (rule.custom && formData) {
      return rule.custom(value, formData);
    }
    return null;
  };

  const validateField = (section, field) => {
    const value = formData[section]?.[field];
    const rule = validationRules[section]?.[field];
    if (!rule) return null;
    return validateFieldGeneric(value, rule, formData);
  };

  const validateSection = (section) => {
    const sectionErrors = {};
    const rules = validationRules[section];
    if (!rules) return sectionErrors;
    Object.keys(rules).forEach((field) => {
      const error = validateField(section, field);
      if (error) sectionErrors[field] = error;
    });
    return sectionErrors;
  };

  // Function to get today's date or 5 days ago
  const getIssueDate = (isTodayDate) => {
    const today = new Date();
    if (isTodayDate) {
      return today.toISOString().split('T')[0];
    } else {
      const fiveDaysAgo = new Date(today);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      return fiveDaysAgo.toISOString().split('T')[0];
    }
  };

  // Update issue date when checkbox changes (ONLY FOR TCT)
  useEffect(() => {
    if (isTCT && isOpen) {
      const issueDate = getIssueDate(isIssueDateToday);
      setFormData((prev) => ({
        ...prev,
        poDetails: {
          ...prev.poDetails,
          poDate: issueDate,
        },
      }));
      
      // Clear any existing error for poDate when updating automatically
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["poDetails.poDate"];
        return newErrors;
      });
    }
  }, [isIssueDateToday, isTCT, isOpen]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setCompanyType("");
      setCurrentStep(1);
      setErrors({});
      setIsIssueDateToday(true);
    }
  }, [isOpen, initialState]);

  // Fetch supplier details
  useEffect(() => {
    const fetchSupplierdetails = async () => {
      if (!supplierId) return;
      try {
        const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_details/${supplierId}`);
        if (response.data) {
          const supplierData = response.data.supplierDatas[0];
          setFormData((prev) => ({
            ...prev,
            supplier: {
              name: supplierData.companyname || "",
              doorNo: supplierData.doorno || "",
              streetName: supplierData.street || "",
              city: supplierData.city || "",
              area: supplierData.area || "",
              state: supplierData.state || "",
              pincode: supplierData.pincode || "",
              phone: supplierData.mobilenumber || "",
              email: supplierData.email || "",
              gstNo: supplierData.gst || "",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching supplier details:", error);
      }
    };
    fetchSupplierdetails();
  }, [supplierId, isOpen]);

  // Auto-reset payment type if Labour Bill becomes invalid
  useEffect(() => {
    if (
      formData.delivery.paymentType === "Labour Bill" &&
      (po !== "tct" || orderType === "unfix")
    ) {
      setFormData((prev) => ({
        ...prev,
        delivery: { ...prev.delivery, paymentType: "RTGS" },
      }));
    }
  }, [po, orderType, formData.delivery.paymentType]);

  // Fetch company presets
  useEffect(() => {
    const fetchNextPoNumber = async () => {
      try {
        const companyData = po && po === 'tct' 
          ? Tct_COMPANY_PRESETS['tct'] 
          : COMPANY_PRESETS[companyType];
        
        if (companyData) {
          setFormData((prev) => ({
            ...prev,
            from: {
              ...companyData,
              parentCompany: prev.from.parentCompany || "",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching PO number:", error);
      }
    };

    if (companyType || (po && po === 'tct')) {
      fetchNextPoNumber();
    }
  }, [companyType, metal_type, orderType, po, COMPANY_PRESETS, Tct_COMPANY_PRESETS]);

  const handleInputChange = (section, field, value) => {
    // Special handling for companyType
    if (section === 'companyType') {
      setCompanyType(value);
      if (errors.companyType) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.companyType;
          return newErrors;
        });
      }
      return;
    }

    // Special handling for parent company
    if (section === 'from' && field === 'parentCompany') {
      const selectedParentPreset = Parent_COMPANY_PRESETS[value];
      if (selectedParentPreset) {
        setFormData((prev) => ({
          ...prev,
          from: { ...prev.from, parentCompany: value },
          parentCompany: {
            name: selectedParentPreset.name || "",
            subTitle: selectedParentPreset.subTitle || "",
            doorNo: selectedParentPreset.doorNo || "",
            streetName: selectedParentPreset.streetName || "",
            city: selectedParentPreset.city || "",
            state: selectedParentPreset.state || "",
            pincode: selectedParentPreset.pincode || "",
            phone: selectedParentPreset.phone || "",
            email: selectedParentPreset.email || "",
            gstNo: selectedParentPreset.gstNo || "",
          },
        }));

        if (errors["from.parentCompany"]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors["from.parentCompany"];
            return newErrors;
          });
        }
      }
      return;
    }

    // Regular field handling
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));

    // Real-time validation error clearing
    const errorKey = `${section}.${field}`;
    
    // Validate immediately after value change
    const updatedFormData = {
      ...formData,
      [section]: { ...formData[section], [field]: value },
    };
    
    // Re-validate with the new value
    const rule = validationRules[section]?.[field];
    const error = rule ? validateFieldGeneric(value, rule, updatedFormData) : null;

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[errorKey] = error;
      } else {
        delete newErrors[errorKey];
      }
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!companyType && !(po && po === "tct")) {
        newErrors.companyType = "Please select a company";
      }
      ["poDate", "dueDate"].forEach(field => {
        const error = validateField("poDetails", field);
        if (error) newErrors[`poDetails.${field}`] = error;
      });
      if (formData?.from?.poPreFix === "TCT" && !formData.from.parentCompany) {
        newErrors["from.parentCompany"] = "Please select a parent company";
      }
    } else if (step === 2) {
      const supplierFields = ["name", "doorNo", "streetName", "city", "state", "pincode", "phone", "email", "gstNo"];
      supplierFields.forEach((field) => {
        const error = validateField("supplier", field);
        if (error) newErrors[`supplier.${field}`] = error;
      });
    } else if (step === 3) {
      ["purchaseIncharge", "purchaseManager"].forEach((field) => {
        const error = validateField("counterDetails", field);
        if (error) newErrors[`counterDetails.${field}`] = error;
      });
      const deliveryError = validateField("delivery", "address");
      if (deliveryError) newErrors["delivery.address"] = deliveryError;
      const paymentTypeError = validateField("delivery", "paymentType");
      if (paymentTypeError) newErrors["delivery.paymentType"] = paymentTypeError;
    }

    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateStep(currentStep);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const step1Errors = validateStep(1);
    const step2Errors = validateStep(2);
    const step3Errors = validateStep(3);
    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };

    if (Object.keys(allErrors).length === 0) {
      onSubmit(formData);
      onClose();
    } else {
      setErrors(allErrors);
      if (Object.keys(step1Errors).length > 0) {
        setCurrentStep(1);
      } else if (Object.keys(step2Errors).length > 0 && currentStep > 2) {
        setCurrentStep(2);
      }
    }
  };

  const selectedCompany =
    po === "tct"
      ? Tct_COMPANY_PRESETS["tct"]
      : COMPANY_PRESETS[companyType] || {};

  // Dynamic step renderer
  const renderStep = () => {
    const currentFields = formFields[`step${currentStep}`];

    if (currentStep === 4) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Review Purchase Order
          </h3>
          <div className="bg-white rounded-lg border border-gray-200">
            <PurchaseOrderPreview
              datas={selectedDatas}
              supplierDetails={formData}
            />
          </div>
        </div>
      );
    }

    // Group address fields for step 2
    const addressFields = currentFields?.filter(f => f.wrapper === 'address') || [];
    const regularFields = currentFields?.filter(f => !f.wrapper) || [];

    return (
      <div className="space-y-6">
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Company Selection
            </h3>
          </div>
        )}
        
        {currentStep === 2 && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Supplier Information
          </h3>
        )}
        
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Authorization Details
              </h3>
              <div className="space-y-4">
                {regularFields.slice(0, 2).map((field) => (
                  <FormInput
                    key={`${field.section}.${field.field}`}
                    label={field.label}
                    type={field.type}
                    value={
                      field.section === 'companyType'
                        ? companyType
                        : formData[field.section]?.[field.field] || ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(field.section, field.field, value);
                    }}
                    error={errors[`${field.section}.${field.field}`]}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    required={field.required}
                    options={field.options}
                    radioDirection={field.radioDirection}
                    rows={field.rows}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Details
              </h3>
              <div className="space-y-4">
                {regularFields.slice(2).map((field) => (
                  <FormInput
                    key={`${field.section}.${field.field}`}
                    label={field.label}
                    type={field.type}
                    value={
                      field.section === 'companyType'
                        ? companyType
                        : formData[field.section]?.[field.field] || ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(field.section, field.field, value);
                    }}
                    error={errors[`${field.section}.${field.field}`]}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    required={field.required}
                    options={field.options}
                    radioDirection={field.radioDirection}
                    rows={field.rows}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep !== 3 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
            {regularFields.map((field) => {
              // Skip rendering if it's part of address wrapper in step 2
              if (currentStep === 2 && addressFields.some(af => af.field === field.field)) {
                return null;
              }

              // Skip rendering poDetails fields here - they'll be rendered in the PO Details Section
              if (currentStep === 1 && field.section === 'poDetails') {
                return null;
              }

              return (
                <div key={`${field.section}.${field.field}`} className={field.gridClass}>
                  <FormInput
                    label={field.label}
                    type={field.type}
                    value={
                      field.section === 'companyType'
                        ? companyType
                        : formData[field.section]?.[field.field] || ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(field.section, field.field, value);
                    }}
                    error={errors[`${field.section}.${field.field}`] || errors.companyType}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    required={field.required}
                    options={field.options}
                    radioDirection={field.radioDirection}
                    rows={field.rows}
                  />
                </div>
              );
            })}

            {/* Render address fields grouped for step 2 */}
            {currentStep === 2 && addressFields.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Details*
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {addressFields.map((field) => (
                    <FormInput
                      key={`${field.section}.${field.field}`}
                      type={field.type}
                      value={formData[field.section]?.[field.field] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleInputChange(field.section, field.field, value);
                      }}
                      error={errors[`${field.section}.${field.field}`]}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      required={field.required}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Render city, state, pincode for step 2 */}
            {currentStep === 2 && (
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['city', 'state', 'pincode'].map((fieldName) => {
                    const field = regularFields.find(f => f.field === fieldName);
                    if (!field) return null;
                    return (
                      <FormInput
                        key={`${field.section}.${field.field}`}
                        label={field.label}
                        type={field.type}
                        value={formData[field.section]?.[field.field] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleInputChange(field.section, field.field, value);
                        }}
                        error={errors[`${field.section}.${field.field}`]}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        required={field.required}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Parent Company Preview for Step 1 */}
        {currentStep === 1 && formData.from.parentCompany && formData.parentCompany.name && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">
              Selected Parent Company Preview
            </h4>
            <div className="space-y-1 text-sm text-blue-600">
              <p className="font-medium">{formData.parentCompany.name}</p>
              <p>
                {formData.parentCompany.doorNo}, {formData.parentCompany.streetName}
              </p>
              <p>
                {formData.parentCompany.city} – {formData.parentCompany.pincode}
              </p>
            </div>
          </div>
        )}

        {/* PO Details Section for Step 1 */}
        {currentStep === 1 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {isTCT ? "Job" : "Purchase"} Order Details
            </h3>
            
            {/* Checkbox for TCT Issue Date */}
            {isTCT && (
              <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isIssueDateToday}
                    onChange={(e) => setIsIssueDateToday(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Issue Date is Today ({new Date().toLocaleDateString('en-IN')})
                  </span>
                </label>
                
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {regularFields
                .filter(f => f.section === 'poDetails')
                .map((field) => (
                  <FormInput
                    key={`${field.section}.${field.field}`}
                    label={field.label}
                    type={field.type}
                    value={formData[field.section]?.[field.field] || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange(field.section, field.field, value);
                    }}
                    error={errors[`${field.section}.${field.field}`]}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={isTCT && field.field === "poDate"} // Disable manual editing for TCT
                  />
                ))}
            </div>
          </div>
        )}

        {/* Company Preview for Step 1 */}
        {currentStep === 1 && (companyType || (po && po === "tct")) && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Selected Company Preview
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                {selectedCompany.doorNo}, {selectedCompany.streetName}
              </p>
              <p>
                {selectedCompany.city} – {selectedCompany.pincode}
              </p>
              <p>{selectedCompany.state}</p>
              <div className="pt-2 mt-2 border-t border-gray-200">
                <p>Phone: {selectedCompany.phone}</p>
                <p>Email: {selectedCompany.email}</p>
                <p>GST: {selectedCompany.gstNo}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const startDragging = (e) => {
    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDragging);
    }
  };

  const onDrag = (e) => {
    if (dialogRef.current) {
      const newX = e.clientX - position.x;
      const newY = e.clientY - position.y;
      dialogRef.current.style.left = `${newX}px`;
      dialogRef.current.style.top = `${newY}px`;
    }
  };

  const stopDragging = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDragging);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative"
      >
        <div
          className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b cursor-move"
          onMouseDown={startDragging}
        >
          <div className="flex items-center">
            <GripVertical className="w-5 h-5 text-gray-400 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">
              {currentStep === 4 ? "Review" : "Create"} Purchase Order
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? "flex-1" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex-1 text-center text-xs text-gray-500">
              Company & PO
            </div>
            <div className="flex-1 text-center text-xs text-gray-500">
              Supplier Details
            </div>
            <div className="flex-1 text-center text-xs text-gray-500">
              Additional Info
            </div>
            <div className="flex-1 text-center text-xs text-gray-500">
              Review
            </div>
          </div>
        </div>

        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-300px)]">
          {renderStep()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 flex items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
              >
                Generate PO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDialog;

