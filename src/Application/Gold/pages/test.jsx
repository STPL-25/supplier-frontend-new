
// import React, { useState, useEffect, useRef, useContext } from "react";
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
// const GoldProductForm = () => {
//   const { userRole, user, names } = useContext(DashBoardContext);
//   const {  formData, setFormData, snackbar, setSnackbar, hideSnackbar,showSnackbar, goldMelting, silverMelting, errors, setErrors, selectedTypes, setSelectedTypes,} = useContext(PoContext);
//     let metal = userRole?.split("-")[0];
//   const [submittedData, setSubmittedData] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [isPoDialogOpen, setIsPoDialogOpen] = useState(false);
//   const [productDetails, setProductDetails] = useState([]);
//   const [poAddressData, setPoAddressData] = useState(null);
//   const [selectedDatas, setSelectedDatas] = useState([]);
//   const { validateField } = useValidation();
//   const { compressAndConvertToJPG, isCompressing } = useImageCompression(100);

//   const [meltingOptions, setMeltingOptions] = useState([]);
//    const fields=poFields(userRole)
//    console.log(fields)
 
//   const photoCaptureRef = useRef(null);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_po/fetch_all_products/${userRole}/${
//             formData?.productType ?? ""
//           }`
//         );
//         setProductDetails(response.data);
//       } catch (error) {
//       }
//     };
//     fetchProductDetails();
//   }, [formData?.productType ?? ""]);
//   useEffect(() => {
//     const fetchMeltingDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_po/meltingdetails/${userRole}
//           }`
//         );
//         // console.log(response);
//         setMeltingOptions(response.data);
//       } catch (error) {
//         // console.log(error);
//       }
//     };
//     fetchMeltingDetails();
//   }, [userRole]);
//   // console.log(formData?.productType);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     const numericFields = [   "pieces",  "grossWt",   "stoneWt", "stoneCost",   "waxWt",   "netWt",  "amount", "wastage", ];

//     if (numericFields.includes(name)) {
//       const regex = name === "wastage" ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

//       // Reject if it doesn't match the allowed format
//       if (!regex.test(value)) {
//         return;
//       }

//       // Prevent multiple decimal points
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
//       // Compress the image before storing it
//       if (file) {
//         const compressedImage = await compressAndConvertToJPG(file);

//         // Get the size of the original image in KB
//         const originalSizeKB = (file.size / 1024).toFixed(2);

//         // Get the size of the compressed image in KB
//         const compressedSizeKB = (compressedImage.size / 1024).toFixed(2);
       

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
     
//       setFormData((prev) => ({
//         ...prev,
//         photo: file,
//       }));
//     }
//   };
//   const handleSelect = (itemId, item, orderType) => {
//     // console.log(item);

//     // Update selected item IDs (for checkbox state)
//     setSelectedItems((prev) => {
//       if (prev.includes(itemId)) {
//         return prev.filter((id) => id !== itemId);
//       } else {
//         return [...prev, itemId];
//       }
//     });

//     // Update selected item data
//     setSelectedDatas((prev) => {
//       const exists = prev.some((data) => data.sno === itemId);

//       if (exists) {
//         // Item exists and is being unchecked
//         return prev.filter((data) => data.sno !== itemId);
//       } else {
//         // Item doesn't exist and is being checked
//         return [...prev, { ...item, orderType }];
//       }
//     });
//   };
//   // console.log(selectedDatas);
//   const handleEdit = (event) => {
//     const data = event;
//     // Find the product details
//     const productData = productDetails.find(
//       (opt) => opt.value === data.product
//     );

//     setFormData({
//       sno: data.sno,
//       product: data.product,
//       orderType: data.orderType,
//       metal_type:
//         data.metal_type,
//       productName: data.product_name,
//       pieces: data.pieces,
//       rate:data.rate||"",
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
//     });
      
//     setSelectedTypes(data.productAvlTypes);
//   };
//   // console.log(formData);
//   const handleDelete = async (id) => {
//     try {
//       // console.log(id);
//       const response = await axios.put(`${API}/gold_po/delete/${id}`);
//       if (response.status === 200) {
//         fetchPoUserDetails();
//         showSnackbar("Product deleted successfully!", "error");
//       }
//     } catch (error) {
//       // console.error("Error deleting record:", error);
//       showSnackbar("Failed to delete product", "error");
//     }
//   };

//   const handlePoSubmit = async (poData) => {
//     // console.log(poData);
//     try {
//       const filteredItems = submittedData.filter((item) =>
//         selectedItems.includes(item.sno)
//       );

//       // Ensure we have data to work with
//       if (!filteredItems || filteredItems.length === 0) {
//         throw new Error("No items selected for the purchase order");
//       }
//       const orderTypes = [
//         ...new Set(filteredItems.map((data) => data.orderType)),
//       ];
//       // console.log(filteredItems);
//       // Set the filtered data and PO address data for the PDF generation
//       setPoAddressData(poData);

     
//       let pdfGenerated = true;
//       if (pdfGenerated) {
//         // Now prepare data for updating the PO records
//         const submitDataForUpdate = {
//           items: selectedItems,
//           poDetails: poData,
//         };
//         // console.log(submitDataForUpdate);

//         const response = await axios.put(
//           `${API}/gold_po/update_po_records/${userRole}/${user}`,
//           submitDataForUpdate
//         );

//         if (response.status === 200) {
//           fetchPoUserDetails();
//           setIsPoDialogOpen(false);
//           setSelectedItems([]);
//           showSnackbar(response.data.message);
//         }
//       }
//     } catch (error) {
//       // console.error("Error submitting PO:", error);
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
//       // console.error("Error fetching PO details:", error);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Check if product is required based on order type
//     if (formData.orderType === "office" && !formData.product) {
//       newErrors.product = "Product is required for office orders";
//     }

//     // Check if product name is required based on order type
//     if (formData.orderType === "fair" && !formData.productName?.trim()) {
//       newErrors.productName = "Product name is required for fair orders";
//     }

   
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
//   // console.log(formData.productWeightage);
//   const handleSubmit = async () => {
//     // Validate form before submission
//     if (!validateForm()) {
//       showSnackbar("Please fix the errors before submitting", "error");
//       return;
//     }
//     const formDataToSubmit = new FormData();
//     formDataToSubmit.append("productAvlTypes", JSON.stringify(selectedTypes));
//     formDataToSubmit.append("login", names);
//     // Append all form fields to FormData
//     Object.keys(formData).forEach((key) => {
//       // console.log(formData["productType"]);
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
//         // console.log(key, formData[key]);
//         formDataToSubmit.append(key, formData[key]);
//       }
//     });
//     // console.log(selectedTypes);
//     // Always append metal_type
//     for (let pair of formDataToSubmit.entries()) {
//       // console.log(pair[0], pair[1]);
//     }
//     try {
//       const response = await axios.post(
//         `${API}/gold_po/gold_po`,
//         formDataToSubmit
//       );
//       if (response.status === 201) {
//         if (photoCaptureRef.current) {
//           photoCaptureRef.current.recapture();
//         }
//         // Reset form
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
//             : "GO",
//           productWeightage: "Gram",
//           mc: "",
//         });
//         setSelectedTypes({
//           Gold: userRole.includes("Diamond") ? true : false,
//           Diamond: userRole.includes("Diamond") ? true : false,
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
//       // console.error("Error submitting form:", error);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     fetchPoUserDetails();
//   }, []);
//   useEffect(() => {
//     // console.log("Selected types changed:", selectedTypes);
//     // You can add additional logic here if needed when selectedTypes changes
//   }, [selectedTypes]);

//   return (
//     <div className="p-4 md:p-6 max-w-10xl mx-auto bg-white rounded-xl shadow-lg">
//       <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 ">
//         {userRole?.split("-")[0]} Purchase Order
//       </h2>
//       <div className="flex space-x-6 mb-4">
//         <label className="flex items-center cursor-pointer">
//           <input
//             type="radio"
//             name="orderType"
//             value="office"
//             checked={formData.orderType === "office"}
//             onChange={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                 orderType: "office",
//                 productName: "",
//               }));
//               setErrors((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors.productName;
//                 return newErrors;
//               });
//             }}
//             className="form-radio h-4 w-4 text-blue-600"
//           />
//           <span className="ml-2 text-gray-700">Office Selection</span>
//         </label>
//         <label className="flex items-center cursor-pointer">
//           <input
//             type="radio"
//             name="orderType"
//             value="fair"
//             checked={formData.orderType === "fair"}
//             onChange={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                 orderType: "fair",
//               }));
//               // Clear product error when switching to fair
//               setErrors((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors.product;
//                 return newErrors;
//               });
//             }}
//             className="form-radio h-4 w-4 text-blue-600"
//           />
//           <span className="ml-2 text-gray-700">Exhibition Selection</span>
//         </label>
//       </div>
//          <div className="flex space-x-6 mb-4">
//         <label className="flex items-center cursor-pointer">
//           <input
//             type="radio"
//             name="orderType"
//             value="office"
//             checked={formData.orderType === "fix"}
//             onChange={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                 rateFixType: "fix",
//               }));
//               setErrors((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors.productName;
//                 return newErrors;
//               });
//             }}
//             className="form-radio h-4 w-4 text-blue-600"
//           />
//           <span className="ml-2 text-gray-700">Fix</span>
//         </label>
//         <label className="flex items-center cursor-pointer">
//           <input
//             type="radio"
//             name="orderType"
//             value="fair"
//             checked={formData.orderType === "unfix"}
//             onChange={() => {
//               setFormData((prev) => ({
//                 ...prev,
//                  rateFixType: "unfix",             
//              }));
//               // Clear product error when switching to fair
//               setErrors((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors.product;
//                 return newErrors;
//               });
//             }}
//             className="form-radio h-4 w-4 text-blue-600"
//           />
//           <span className="ml-2 text-gray-700">Un Fix</span>
//         </label>
//       </div>
//       {userRole.includes("Silver") && (
//         <div className="flex space-x-6 mb-4">
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="productType"
//               value="Silver"
//               checked={formData.productType === "Silver"}
//               onChange={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   productType: "Silver",
//                 }));
//                 // Clear product name error when switching to office
//               }}
//               className="form-radio h-4 w-4 text-blue-600"
//             />
//             <span className="ml-2 text-gray-700">Silver</span>
//           </label>
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="productType"
//               value="GA"
//               checked={formData.productType === "GA"}
//               onChange={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   productType: "GA",
//                 }));
//                 // Clear product error when switching to fair
//               }}
//               className="form-radio h-4 w-4 text-blue-600"
//             />
//             <span className="ml-2 text-gray-700">Gift Article</span>
//           </label>
//           <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="productType"
//               value="Airra"
//               checked={formData.productType === "Airra"}
//               onChange={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   productType: "Airra",
//                 }));
//                 // Clear product error when switching to fair
//               }}
//               className="form-radio h-4 w-4 text-blue-600"
//             />
//             <span className="ml-2 text-gray-700">Airra</span>
//           </label>
//            <label className="flex items-center cursor-pointer">
//             <input
//               type="radio"
//               name="productType"
//               value="SilverJewellery"
//               checked={formData.productType === "SilverJewellery"}
//               onChange={() => {
//                 setFormData((prev) => ({
//                   ...prev,
//                   productType: "SilverJewellery",
//                 }));
//                 // Clear product error when switching to fair
//               }}
//               className="form-radio h-4 w-4 text-blue-600"
//             />
//             <span className="ml-2 text-gray-700">SilverJewellery</span>
//           </label>
//         </div>
//       )}
//       {userRole.includes("Diamond") && (
//         <div className="flex space-x-6 mb-4">
//           <label className="flex items-center cursor-pointer">
//             <ProductTypeSelection
//               formData={formData}
//               setFormData={setFormData}
//               selectedTypes={selectedTypes}
//               setSelectedTypes={setSelectedTypes}
//             />
//           </label>
//         </div>
//       )}
//        {/* console.log(formData.productType) */}
//       <div className="p-2">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
//           <CustomSelects
//             label="Product"
//             options={productDetails}
//             value={formData.product}
//             onChange={(value) =>
//               setFormData((prev) => ({ ...prev, product: value }))
//             }
//             error={errors.product}
//           />

//           {formData.orderType === "fair" && (
//             <CustomInput
//               label="Product Name"
//               name="productName"
//               value={formData.productName}
//               onChange={handleInputChange}
//               error={errors.productName}
//             />
//           )}
//           <CustomInput
//             label="Pieces"
//             name="pieces"
//             value={formData.pieces}
//             onChange={handleInputChange}
//             error={errors.pieces}
//           />
//           {formData.metal_type === "Silver" && (
//             <>
//               <CustomSelect
//                 label="Product Weightage"
//                 options={[
//                   { label: "Gram", value: "Gram" },
//                   { label: "Pcs", value: "Pcs" },
//                 ]}
//                 value={formData?.productWeightage || "Gram"}
//                 onChange={(value) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     productWeightage: value || formData?.productWeightage,
//                   }))
//                 }
//                 error={errors.productWeightage}
//               />
//               {/* console.log(formData?.productWeightage) */}
//               {formData?.productWeightage?.value === "Pcs" && (
//                 <CustomInput
//                   label="Rate"
//                   name="rate"
//                   value={formData.rate}
//                   onChange={handleInputChange}
//                   error={errors.rate}
//                 />
//               )}
//             </>
//           )}

//           <CustomInput
//             label="Gross Weight"
//             name="grossWt"
//             value={formData.grossWt}
//             onChange={handleInputChange}
//             error={errors.grossWt}
//           />
//           {selectedTypes.Diamond && (
//             <>
//               <CustomInput
//                 label="Diamond Carat"
//                 name="diacent"
//                 value={formData.diacent}
//                 onChange={handleInputChange}
//                 error={errors.diacent}
//               />
//             </>
//           )}

//           <CustomInput
//             label="Stone Weight in (gm)"
//             name="stoneWt"
//             value={formData.stoneWt}
//             onChange={handleInputChange}
//             error={errors.stoneWt}
//           />
//           <CustomInput
//             label="Stone Cost"
//             name="stoneCost"
//             value={formData.stoneCost}
//             onChange={handleInputChange}
//             error={errors.stoneCost}
//           />
//           <CustomInput
//             label="Wax Weight"
//             name="waxWt"
//             value={formData.waxWt}
//             onChange={handleInputChange}
//             error={errors.waxWt}
//           />
//           {selectedTypes.Gold && selectedTypes.Platinum && (
//             <>
//               <CustomInput
//                 label="Gold net wt"
//                 name="goldwt"
//                 value={formData.goldwt}
//                 onChange={handleInputChange}
//                 error={errors.goldwt}
//               />
//               <CustomInput
//                 label="Platinum Grs wt"
//                 name="platinumWt"
//                 value={formData.platinumWt}
//                 onChange={handleInputChange}
//                 error={errors.platinumWt}
//               />
//               <CustomInput
//                 label="Platinum Net wt"
//                 name="platinumWt"
//                 value={formData.netWt}
//                 onChange={handleInputChange}
//                 error={errors.netWt}
//               />
//             </>
//           )}

//           {/* {(selectedTypes.Gold&&selectedTypes.Platinum) && (
//             <>
//              <CustomInput
//                 label="Gold net wt"
//                 name="goldwt"
//                 value={formData.goldwt}
//                 onChange={handleInputChange}
//                 error={errors.goldwt}
//               />
//                <CustomInput
//                 label="Platinum net wt"
//                 name="platinumWt"
//                 value={formData.platinumWt}
//                 onChange={handleInputChange}
//                 error={errors.platinumWt}
//               />
//             </>
//           )} */}
//           {!selectedTypes.Platinum&&
//           <CustomInput
//             label= "Net Weight"
//             name="netWt"
//             value={formData.netWt}
//             disabled={true}
//             error={errors.netWt}
//           />
//           }
//           <CustomInput
//             label="Amount"
//             name="amount"
//             value={formData.amount}
//             onChange={handleInputChange}
//             error={errors.amount}
//           />
//           {(formData?.productWeightage?.value === "Gram" ||
//             formData.metal_type === "Gold") && (
//             <>
//               <CustomSelect
//                 label="Melting"
//                 options={meltingOptions}
//                 value={formData.melting}
//                 onChange={(value) =>
//                   setFormData((prev) => ({ ...prev, melting: value }))
//                 }
//                 error={errors.melting}
//               />
//               {(!selectedTypes.Diamond&&!selectedTypes.Platinum)&&<>
//               <CustomInput
//                 label="Wastage"
//                 name="wastage"
//                 value={formData.wastage?.value || ""}
//                 onChange={handleInputChange}
//                 error={errors.wastage}
//               />

//               <CustomInput
//                 label="Making Charges"
//                 name="mc"
//                 value={formData.mc}
//                 onChange={handleInputChange}
//                 error={errors.mc}
//               />
//                 </>
//               }
//             </>
//           )}
//           {selectedTypes.Gold  && (
//             <>
//               <CustomSelect
//                 label="Gold Melting"
//                 options={meltingOptions}
//                 value={formData.melting}
//                 onChange={(value) =>
//                   setFormData((prev) => ({ ...prev, melting: value }))
//                 }
//                 error={errors.melting}
//               />
//                 <CustomInput
//               label= "Gold PureWt"
//                name="pureWt"
//               value={formData.pureWt}
//               onChange={handleInputChange}
//               disabled
//               error={errors.pureWt}
//             />
//               {/* <CustomSelect
//                 label="Gold Melting"
//                 options={meltingOptions}
//                 value={formData.melting}
//                 onChange={(value) =>
//                   setFormData((prev) => ({ ...prev, melting: value }))
//                 }
//                 error={errors.melting}
//               /> */}
//               {/* <CustomSelect
//                 label="Platinum Melting"
//                 options={[{ label: 95, value: 95 }]}
//                 value={formData.ptMelting}
//                 onChange={(value) =>
//                   setFormData((prev) => ({ ...prev, ptMelting: value }))
//                 }
//                 error={errors.ptMelting}
//               /> */}
//               {/* <CustomInput
//               label="Gold PureWt"
//               name="pureWt"
//               value={formData.pureWt}
//               onChange={handleInputChange}
//               disabled
//               error={errors.pureWt}
//             /> */}
//               {/* <CustomInput
//                 label="Platinum PureWt"
//                 name="platinumPureWt"
//                 value={formData.platinumPureWt}
//                 onChange={handleInputChange}
//                 disabled
//                 error={errors.platinumPureWt}
//               /> */}
//             </>
//           )}
//           {/* )} */}
//           {(formData.metal_type !== "Silver"&&(!selectedTypes.Platinum&&!selectedTypes.Diamond)) && (
//             <CustomInput
//               label= "PureWt"
//                name="pureWt"
//               value={formData.pureWt}
//               onChange={handleInputChange}
//               disabled
//               error={errors.pureWt}
//             />
//           )}
//         </div>
//         <div className="flex items-end h-full mt-10">
//           <PhotoCapture
//             ref={photoCaptureRef}
//             onPhotoCapture={handlePhotoCapture}
//             photoUrl={formData.photo ? formData.photo : null}
//           />
//         </div>
//         <div className="flex justify-center mt-6">
//           {(formData?.productWeightage?.value === "Pcs" &&
//             formData.rate &&
//             formData.pieces) ||
//           (formData.netWt && parseFloat(formData.netWt) > 0) ? (
//             //
//             // ) :  ? (
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
//             >
//               Add Product
//             </button>
//           ) : null}
//         </div>
//       </div>
//       <SubmittedDataComp
//         submittedData={submittedData}
//         handleSelect={handleSelect}
//         onEdit={handleEdit}
//         onDelete={handleDelete}
//         selectedItems={selectedItems}
//         ispocreation={false}
//       />
//       {selectedItems.length > 0 && (
//         <div className="w-full flex justify-center mt-2">
//           <button
//             onClick={() => setIsPoDialogOpen(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Select Supplier
//           </button>
//         </div>
//       )}
//       {/* <div className="flex justify-center mt-6">
//         {(formData.netWt && parseFloat(formData.netWt) > 0) ||
//         ((formData.metal_type === "Silver" ||
//           formData.metal_type === "Airra" ||
//           formData.metal_type === "GA") &&
//           formData.productWeightage?.value === "Pcs" &&
//           formData.rate &&
//           formData.pieces) ? (
//           <button
//             onClick={handleSubmit}
//             className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
//           >
//             Add Product
//           </button>
//         ) : null}
//       </div> */}
//       <PurchaseOrderDialog
//         isOpen={isPoDialogOpen}
//         metal_type={metal}
//         selectedDatas={selectedDatas}
//         onClose={() => {
//           setIsPoDialogOpen(false);
//           setSelectedItems([]);
//           setSelectedDatas([]);
//         }}
//         onSubmit={handlePoSubmit}
//       />
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
  const [wastageOptions,setWastageOptions]= useState([])
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const fields = poFields(userRole);
  const photoCaptureRef = useRef(null);

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_for_po/${userRole}`);
        console.log("88888888888888888888888888888888888",response?.data?.supplierDatas)
        setSupplierOptions(response?.data?.supplierDatas);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, [userRole]);
  

  // Fetch supplier-specific details when supplier is selected
  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (!selectedSupplier) return;
      
      setSupplierLoading(true);
      try {
        const response = await axios.get(
          `${API}/gold_po/supplier_details/${selectedSupplier.value}`
        );
        
        // Update melting options based on supplier
        if (response.data.meltingOptions) {
          setMeltingOptions(response.data.meltingOptions);
        }
        
        // Auto-fill wastage if supplier has default
        if (response.data.defaultWastage) {
          setFormData((prev) => ({
            ...prev,
            wastage: {
              label: response.data.defaultWastage,
              value: response.data.defaultWastage,
            },
          }));
        }
        
        // Auto-fill melting if supplier has default
        if (response.data.defaultMelting) {
          setFormData((prev) => ({
            ...prev,
            melting: {
              label: response.data.defaultMelting,
              value: response.data.defaultMelting,
            },
          }));
        }
        
        showSnackbar(`Supplier details loaded for ${selectedSupplier.label}`, "success");
      } catch (error) {
        console.error("Error fetching supplier details:", error);
        showSnackbar("Failed to load supplier details", "error");
      } finally {
        setSupplierLoading(false);
      }
    };
    
    fetchSupplierDetails();
  }, [selectedSupplier]);


   useEffect(() => {
  if (!selectedSupplier) return;

const fetchProductDetails = async () => {
  try {
    const response = await axios.get(
      `${API}/gold_Po/fetch_selected_supplier_details/${selectedSupplier}`
    );
    
    // Remove duplicate products based on PRODUCTCODE
    const uniqueProductCodes = [...new Set(
      response.data.suplierPurityDetails.map(data => data.PRODUCTCODE)
    )];
    
    const products = uniqueProductCodes.map(code => {
      const product = response.data.suplierPurityDetails.find(
        data => data.PRODUCTCODE === code
      );
      return {
        label: product.PRODUCTNAME,
        value: product.PRODUCTCODE
      };
    });
    
    setProductDetails(products);
    
    // Only filter if formData.product exists
    if (formData.product) {
      const purityDatas = response.data.suplierPurityDetails.filter(
        (data) => data.PRODUCTCODE === formData.product
      );
      
      // Remove duplicates from melting options
      const uniqueMeltingValues = [...new Set(
        purityDatas.map(item => item.PUR_MELTING_PURITY)
      )];
      const melting = uniqueMeltingValues.map(value => ({
        label: value,
        value: value
      }));
      
      // Remove duplicates from wastage options
      const uniqueWastageValues = [...new Set(
        purityDatas.map(item => item.PUR_WASTAGE)
      )];
      const wastage = uniqueWastageValues.map(value => ({
        label: value,
        value: value
      }));
      
      setMeltingOptions(melting); 
      setWastageOptions(wastage);
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

  
  fetchProductDetails();
}, [selectedSupplier, formData.product]); 

  // useEffect(()=>{
  //   const getMeltingAndWastageDetails=()=>{
      
  //   }
  // })
  // Fetch melting details (fallback if no supplier selected)
  // useEffect(() => {
  //   if (!selectedSupplier) {
  //     const fetchMeltingDetails = async () => {
  //       try {
  //         const response = await axios.get(`${API}/gold_po/meltingdetails/${userRole}`);
  //         setMeltingOptions(response.data);
  //       } catch (error) {
  //         console.error("Error fetching melting details:", error);
  //       }
  //     };
  //     fetchMeltingDetails();
  //   }
  // }, [userRole, selectedSupplier]);
  //  useEffect(() => {
  //   if (!selectedSupplier) {
  //     const fetchMeltingDetails = async () => {
  //       try {
  //         const response = await axios.get(`${API}/gold_po/meltingdetails/${userRole}`);
  //         setMeltingOptions(response.data);
  //       } catch (error) {
  //         console.error("Error fetching melting details:", error);
  //       }
  //     };
  //     fetchMeltingDetails();
  //   }
  // }, [userRole, selectedSupplier]);
     useEffect(() => {
    if (formData.product) {
      const fetchMeltingDetails = async () => {
        try {
          const response = await axios.get(`${API}/gold_po/fetch_selected_by_purity_melting/${formData.product}`);
          setMeltingOptions(response.data.productDetails);
           setWastageOptions(response.data.wastagesvalues)

        } catch (error) {
          console.error("Error fetching melting details:", error);
        }
      };
      fetchMeltingDetails();
    }
  }, [userRole, formData.product]);
  // Fetch PO details on mount
  useEffect(() => {
    fetchPoUserDetails();
  }, []);

  // Dynamic field configuration
  const formFieldsConfig = useMemo(() => {
    const baseFields = [
      {
        name: "product",
        label: "Product",
        type: "select",
        component: CustomSelects,
        options: productDetails,
        visible:true,
        // visible: formData.orderType === "office",
        span: 1,
      },
      {
        name: "productName",
        label: "Product Name",
        type: "input",
        component: CustomInput,
        visible: formData.orderType === "fair",
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
        label: "Stone Weight in (gm)",
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
      melting: { label: data.melting, value: data.melting },
      wastage: { label: data.wastage, value: data.wastage },
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
    });

    setSelectedTypes(data.productAvlTypes);
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

    if (formData.orderType === "office" && !formData.product) {
      newErrors.product = "Product is required for office orders";
    }

    if (formData.orderType === "fair" && !formData.productName?.trim()) {
      newErrors.productName = "Product name is required for fair orders";
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
      formDataToSubmit.append("supplierId", selectedSupplier.value);
    }
    console.log(formData)

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
            : "GO",
          productWeightage: "Gram",
          mc: "",
          rate: "",
          goldwt: "",
          platinumWt: "",
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
console.log(selectedSupplier)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
         
            {supplierLoading && (
              <div className="flex items-center text-blue-600">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading supplier details...
              </div>
            )}
          </div>

          {/* Supplier Selection */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Supplier
            </label>
            <CustomSelects
              options={supplierOptions}
              value={selectedSupplier}
              onChange={(value) => setSelectedSupplier(value)}
              placeholder="Search and select supplier..."
            />
            {selectedSupplier && (
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Supplier selected: {selectedSupplier.label}
              </div>
            )}
          </div>

          {/* Order Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50  rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Order Type
              </label>
              <div className="flex space-x-4">
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
                    className="form-radio h-5 w-5 text-blue-600 transition-all"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
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
                    className="form-radio h-5 w-5 text-blue-600 transition-all"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                    Exhibition
                  </span>
                </label>
              </div>
            </div>

            {/* Rate Fix Type */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Rate Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="rateFixType"
                    value="fix"
                    checked={formData.rateFixType === "fix"}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        rateFixType: "fix",
                      }));
                    }}
                    className="form-radio h-5 w-5 text-green-600 transition-all"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-green-600 transition-colors font-medium">
                    Fix
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="rateFixType"
                    value="unfix"
                    checked={formData.rateFixType === "unfix"}
                    onChange={() => {
                      setFormData((prev) => ({
                        ...prev,
                        rateFixType: "unfix",
                      }));
                    }}
                    className="form-radio h-5 w-5 text-orange-600 transition-all"
                  />
                  <span className="ml-2 text-gray-700 group-hover:text-orange-600 transition-colors font-medium">
                    Un Fix
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Type Selection for Silver */}
          {userRole.includes("Silver") && (
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Silver", "GA", "Airra", "SilverJewellery"].map((type) => (
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
                      }}
                      className="form-radio h-5 w-5 text-purple-600"
                    />
                    <span className="ml-2 text-gray-700 group-hover:text-purple-600 transition-colors font-medium">
                      {type === "GA" ? "Gift Article" : type}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Product Type Selection for Diamond */}
          {userRole.includes("Diamond") && (
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <ProductTypeSelection
                formData={formData}
                setFormData={setFormData}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
              />
            </div>
          )}
        </div>

        {/* Dynamic Form Fields */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {formFieldsConfig.map((field) => renderField(field))}
          </div>

          {/* Photo Capture */}
          <div className="mt-3 border-t pt-3">
            <PhotoCapture
              ref={photoCaptureRef}
              onPhotoCapture={handlePhotoCapture}
              photoUrl={formData.photo ? formData.photo : null}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            {((formData?.productWeightage?.value === "Pcs" &&
              formData.rate &&
              formData.pieces) ||
              (formData.netWt && parseFloat(formData.netWt) > 0)) && (
              <button
                onClick={handleSubmit}
                className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
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

        {/* Submitted Data */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
         
          <SubmittedDataComp
            submittedData={submittedData}
            handleSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            selectedItems={selectedItems}
            ispocreation={false}
          />
        </div>

        {/* Create PO Button */}
        {selectedItems.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsPoDialogOpen(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
            >
              <span className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Select Supplier ({selectedItems.length} items selected)
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Purchase Order Dialog */}
      <PurchaseOrderDialog
        isOpen={isPoDialogOpen}
        metal_type={metal}
        selectedDatas={selectedDatas}
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
