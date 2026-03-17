
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
  
//   // NEW: Section state
//   const [sectionOptions, setSectionOptions] = useState([]);
//   const [selectedSection, setSelectedSection] = useState(null);
//   const [supplierPurityData, setSupplierPurityData] = useState([]);
  
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

//   // Fetch supplier details and populate sections
//   useEffect(() => {
//     if (!selectedSupplier) return;

//     const fetchProductDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_Po/fetch_selected_supplier_details/${selectedSupplier}`
//         );
        
//         const supplierData = response.data.suplierPurityDetails;
//         setSupplierPurityData(supplierData); // Store the full data
        
//         let filteredByCategory = supplierData;
        
//         if (userRole.includes("Silver") && formData.productType) {
//           filteredByCategory = supplierData.filter(
//             (data) => data.CATEGORYNAME === formData.productType
//           );
//         }
        
//         // Extract unique sections using Set
//         const uniqueSections = [...new Set(
//           filteredByCategory.map(data => data.SECTIONNAME)
//         )];
        
//         const sections = uniqueSections.map(sectionName => ({
//           label: sectionName,
//           value: sectionName
//         }));
        
//         setSectionOptions(sections);
        
//         // Reset section and product when supplier changes
//         setSelectedSection(null);
//         setProductDetails([]);
//         setMeltingOptions([]);
//         setWastageOptions([]);
        
//         setFormData((prev) => ({
//           ...prev,
//           product: null,
//           productName: "",
//           melting: null,
//           wastage: null,
//         }));
        
//       } catch (error) {
//         console.error("Error fetching product details:", error);
//         showSnackbar("Failed to fetch product details", "error");
//       }
//     };

//     fetchProductDetails();
//   }, [selectedSupplier, formData.productType, userRole]);

//   // Handle section selection - filter products based on selected section
//   useEffect(() => {
//     if (!selectedSection || !supplierPurityData.length) {
//       setProductDetails([]);
//       return;
//     }

//     let filteredData = supplierPurityData;

//     // Filter by category if Silver user
//     if (userRole.includes("Silver") && formData.productType) {
//       filteredData = filteredData.filter(
//         (data) => data.CATEGORYNAME === formData.productType
//       );
//     }

//     // Filter by selected section
//     filteredData = filteredData.filter(
//       (data) => data.SECTIONNAME === selectedSection
//     );

//     // Extract unique product codes
//     const uniqueProductCodes = [...new Set(
//       filteredData.map(data => data.PRODUCTCODE)
//     )];

//     const products = uniqueProductCodes.map(code => {
//       const product = filteredData.find(
//         data => data.PRODUCTCODE === code
//       );
//       return {
//         label: product.PRODUCTNAME,
//         value: product.PRODUCTCODE
//       };
//     });

//     setProductDetails(products);

//     // Reset product selection when section changes
//     setFormData((prev) => ({
//       ...prev,
//       product: null,
//       productName: "",
//       melting: null,
//       wastage: null,
//     }));

//   }, [selectedSection, supplierPurityData, formData.productType, userRole]);

//   // Handle product selection - populate melting and wastage
//   useEffect(() => {
//     if (!formData.product || !supplierPurityData.length) {
//       setMeltingOptions([]);
//       setWastageOptions([]);
//       return;
//     }

//     let filteredData = supplierPurityData;

//     // Filter by category if Silver user
//     if (userRole.includes("Silver") && formData.productType) {
//       filteredData = filteredData.filter(
//         (data) => data.CATEGORYNAME === formData.productType
//       );
//     }

//     // Filter by selected section
//     if (selectedSection) {
//       filteredData = filteredData.filter(
//         (data) => data.SECTIONNAME === selectedSection
//       );
//     }

//     // Filter by selected product
//     const purityDatas = filteredData.filter(
//       (data) => data.PRODUCTCODE === formData.product
//     );

//     // Extract unique melting values
//     const uniqueMeltingValues = [...new Set(
//       purityDatas.map(item => item.PUR_MELTING_PURITY)
//     )];
//     const melting = uniqueMeltingValues.map(value => ({
//       label: value,
//       value: value
//     }));

//     // Extract unique wastage values
//     const uniqueWastageValues = [...new Set(
//       purityDatas.map(item => item.PUR_WASTAGE)
//     )];
//     const wastage = uniqueWastageValues.map(value => ({
//       label: value,
//       value: value
//     }));

//     setMeltingOptions(melting);
//     setWastageOptions(wastage);

//   }, [formData.product, supplierPurityData, selectedSection, formData.productType, userRole]);

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
//       setSelectedSection(null);
//       setProductDetails([]);
//       setMeltingOptions([]);
//       setWastageOptions([]);
//     }
//   }, [formData.productType, userRole]);

//   // Dynamic field configuration
//   const formFieldsConfig = useMemo(() => {
//     const baseFields = [
//       {
//         name: "section",
//         label: "Section",
//         type: "select",
//         component: CustomSelects,
//         options: sectionOptions,
//         visible: true,
//         span: 1,
//       },
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
//     sectionOptions,
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
        
//         setSelectedSection(null);
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
//       // Handle section selection separately
//       if (field.name === "section") {
//         return (
//           <Component
//             key={field.name}
//             {...commonProps}
//             options={field.options || []}
//             value={selectedSection}
//             onChange={(value) => setSelectedSection(value)}
//           />
//         );
//       }
      
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



import  { useState, useEffect, useRef, useContext, useMemo } from "react";
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
import Snackbar from "../../../Components/Snackbar";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { PoContext } from "../PoContext/PoContext";
import { useValidation } from "../components/useValidation";
import useImageCompression from "../components/useImageCompression";
import poFields from "../../PurchaseOrder/FieldDatas/FieldsDatas";

const RateTypeModal = ({ isOpen, onClose, onSelect, currentRateType,formData,setFormData }) => {
  const [selectedRate, setSelectedRate] = useState(currentRateType || "unfix");

  const [error, setError] = useState("");




  const handleConfirm = () => {
    // Validate fix rate if "fix" is selected
    if (selectedRate === "fix" && (!formData.rate || parseFloat(formData.rate) <= 0)) {
      setError("Please enter a valid fix rate");
      return;
    }
    
    // Validate unfix rate if "unfix" is selected
    if (selectedRate === "unfix" && (!formData.rate || parseFloat(formData.rate) <= 0)) {
      setError("Please enter a valid unfix rate");
      return;
    }
    
    onSelect(selectedRate, formData.rate);
    onClose();
  };

  const handleRateChange = (e, type) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      if (type === "fix") {
        setFormData((prev) => ({
          ...prev,
          rateFixType: "fix",
          rate: value,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          rateFixType: "unfix",
          rate: value,
        }));
      }
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content - FULLY OPTIMIZED FOR MOBILE */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-md w-full transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header - COMPACT */}
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

        {/* Rate Options - OPTIMIZED COMPACT SPACING */}
        <div className="space-y-3 mb-5">
          {/* Fix Option */}
          <div>
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
                onChange={(e) => {
                  setSelectedRate(e.target.value);
                  setError("");
                }}
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

            {/* Fix Rate Input - Shows only when Fix is selected */}
            {selectedRate === "fix" && (
              <div className="mt-2 ml-8 mr-2 p-3 bg-white border-2 border-green-200 rounded-lg animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Fix Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={formData.rate}
                    onChange={(e) => handleRateChange(e, "fix")}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      error && selectedRate === "fix"
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:border-green-500 focus:ring-green-200"
                    }`}
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This fixed rate will be applied to all products for this supplier
                </p>
              </div>
            )}
          </div>

          {/* Unfix Option */}
          <div>
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
                onChange={(e) => {
                  setSelectedRate(e.target.value);
                  setError("");
                }}
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

            {/* Unfix Rate Input - Shows only when Unfix is selected */}
            {selectedRate === "unfix" && (
              <div className="mt-2 ml-8 mr-2 p-3 bg-white border-2 border-orange-200 rounded-lg animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter Unfix Rate <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={formData.rate || ""}
                    onChange={(e) => handleRateChange(e, "unfix")}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      error && selectedRate === "unfix"
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
                        : "border-gray-300 focus:border-orange-500 focus:ring-orange-200"
                    }`}
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This variable rate will be applied to all products for this supplier
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          </div>
        )}

        {/* Action Buttons - COMPACT */}
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
  
  // NEW: Section state
  const [sectionOptions, setSectionOptions] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [supplierPurityData, setSupplierPurityData] = useState([]);
  
  // NEW: Store selected section details
  const [selectedSectionDetails, setSelectedSectionDetails] = useState(null);
  
  const fields = poFields(userRole);
  const photoCaptureRef = useRef(null);
  
  // Rate Type Modal State
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [hasSelectedRateType, setHasSelectedRateType] = useState(false);

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${API}/gold_Po/fetch_all_supplier_for_po/${userRole}`);
        setSupplierOptions(response?.data?.supplierDatas);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, [userRole]);

  // Open rate modal when supplier is selected for the first time
  useEffect(() => {
    if (selectedSupplier && !hasSelectedRateType) {
      setIsRateModalOpen(true);
    }
  }, [selectedSupplier, hasSelectedRateType]);

  // Handle rate type selection - NOW ACCEPTS BOTH FIX AND UNFIX RATES
  const handleRateTypeSelect = (rateType, rate) => {
    setFormData((prev) => ({
      ...prev,
     rate: rate,
    }));
    setHasSelectedRateType(true);
    
    if (rateType === "fix") {
      showSnackbar(`Rate type set to: Fix (₹${formData.rate})`, "success");
    } else {
      showSnackbar(`Rate type set to: Unfix (₹${formData.rate})`, "success");
    }
  };

  // Filter submitted data by selected supplier
  const filteredSubmittedData = useMemo(() => {
    if (!selectedSupplier) {
      return submittedData;
    }
    
    return submittedData.filter(item => 
      item.supplierCode === selectedSupplier
    );
  }, [submittedData, selectedSupplier]);

  // Clear selected items when supplier changes
  useEffect(() => {
    setSelectedItems([]);
    setSelectedDatas([]);
  }, [selectedSupplier]);

  // Fetch supplier details and populate sections
  useEffect(() => {
    if (!selectedSupplier) return;

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_Po/fetch_selected_supplier_details/${selectedSupplier}`
        );
        
        const supplierData = response.data.suplierPurityDetails;
        setSupplierPurityData(supplierData);
        
        let filteredByCategory = supplierData;
        
        if (userRole.includes("Silver") && formData.productType) {
          filteredByCategory = supplierData.filter(
            (data) => data.CATEGORYNAME === formData.productType
          );
        }
        
        // Extract unique sections using Set
        const uniqueSections = [...new Set(
          filteredByCategory.map(data => data.SECTIONNAME)
        )];
        
        const sections = uniqueSections.map(sectionName => {
          // Find the first item with this section name to get codes
          const sectionItem = filteredByCategory.find(
            data => data.SECTIONNAME === sectionName
          );
          
          return {
            label: sectionName,
            value: sectionName,
            sectionCode: sectionItem.SECTIONCODE,
            categoryCode: sectionItem.CATEGORYCODE,
            categoryName: sectionItem.CATEGORYNAME,
          };
        });
        
        setSectionOptions(sections);
        
        // Reset section and product when supplier changes
        setSelectedSection(null);
        setSelectedSectionDetails(null);
        setProductDetails([]);
        setMeltingOptions([]);
        setWastageOptions([]);
        
        setFormData((prev) => ({
          ...prev,
          product: null,
          productName: "",
          melting: null,
          wastage: null,
        }));
        
      } catch (error) {
        console.error("Error fetching product details:", error);
        showSnackbar("Failed to fetch product details", "error");
      }
    };

    fetchProductDetails();
  }, [selectedSupplier, formData.productType, userRole]);

  // Handle section selection - filter products based on selected section
  useEffect(() => {
    if (!selectedSection || !supplierPurityData.length) {
      setProductDetails([]);
      setSelectedSectionDetails(null);
      return;
    }

    // Find the section details
    const sectionDetail = sectionOptions.find(
      section => section.value === selectedSection
    );
    
    // if (sectionDetail) {
    //   setSelectedSectionDetails({
    //     sectionCode: sectionDetail.sectionCode,
    //     sectionName: sectionDetail.label,
    //     categoryCode: sectionDetail.categoryCode,
    //     categoryName: sectionDetail.categoryName,
    //   });
    // }
  setFormData((prev) => ({
      ...prev,
      catagoryCode: sectionDetail.categoryCode,  // Note: Your formData has typo "catagoryCode"
      categoryName: sectionDetail.categoryName,
      sectionCode: sectionDetail.sectionCode,
      sectionName: sectionDetail.label,
    }));
    let filteredData = supplierPurityData;

    // Filter by category if Silver user
    if (userRole.includes("Silver") && formData.productType) {
      filteredData = filteredData.filter(
        (data) => data.CATEGORYNAME === formData.productType
      );
    }

    // Filter by selected section
    filteredData = filteredData.filter(
      (data) => data.SECTIONNAME === selectedSection
    );

    // Extract unique product codes
    const uniqueProductCodes = [...new Set(
      filteredData.map(data => data.PRODUCTCODE)
    )];

    const products = uniqueProductCodes.map(code => {
      const product = filteredData.find(
        data => data.PRODUCTCODE === code
      );
      return {
        label: product.PRODUCTNAME,
        value: product.PRODUCTCODE
      };
    });

    setProductDetails(products);

    // Reset product selection when section changes
    setFormData((prev) => ({
      ...prev,
      product: null,
      productName: "",
      melting: null,
      wastage: null,
    }));

  }, [selectedSection, supplierPurityData, formData.productType, userRole, sectionOptions]);
 console.log(formData)
  // Handle product selection - populate melting and wastage
  useEffect(() => {
    if (!formData.product || !supplierPurityData.length) {
      setMeltingOptions([]);
      setWastageOptions([]);
      return;
    }

    let filteredData = supplierPurityData;

    // Filter by category if Silver user
    if (userRole.includes("Silver") && formData.productType) {
      filteredData = filteredData.filter(
        (data) => data.CATEGORYNAME === formData.productType
      );
    }

    // Filter by selected section
    if (selectedSection) {
      filteredData = filteredData.filter(
        (data) => data.SECTIONNAME === selectedSection
      );
    }

    // Filter by selected product
    const purityDatas = filteredData.filter(
      (data) => data.PRODUCTCODE === formData.product
    );

    // Extract unique melting values
    const uniqueMeltingValues = [...new Set(
      purityDatas.map(item => item.PUR_MELTING_PURITY)
    )];
    const melting = uniqueMeltingValues.map(value => ({
      label: value,
      value: value
    }));

    // Extract unique wastage values
    const uniqueWastageValues = [...new Set(
      purityDatas.map(item => item.PUR_WASTAGE)
    )];
    const wastage = uniqueWastageValues.map(value => ({
      label: value,
      value: value
    }));

    setMeltingOptions(melting);
    setWastageOptions(wastage);

  }, [formData.product, supplierPurityData, selectedSection, formData.productType, userRole]);

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
      setSelectedSection(null);
      setSelectedSectionDetails(null);
      setProductDetails([]);
      setMeltingOptions([]);
      setWastageOptions([]);
    }
  }, [formData.productType, userRole]);

  // Dynamic field configuration
  const formFieldsConfig = useMemo(() => {
    const baseFields = [
      {
        name: "section",
        label: "Section",
        type: "select",
        component: CustomSelects,
        options: sectionOptions,
        visible: true,
        span: 1,
      },
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
    sectionOptions,
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
      fixRate: data.fixRate || "",
      unfixRate: data.unfixRate || "",
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
      rateFixType: data.rateFixType || "unfix",
    });

    setSelectedTypes(data.productAvlTypes);
    
    if (data.supplierCode) {
      setSelectedSupplier(data.supplierCode);
      setHasSelectedRateType(true);
    }
    
    // Set section if available
    if (data.sectionName) {
      setSelectedSection(data.sectionName);
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

    if (formData.orderType === "office" && !formData.product) {
      newErrors.product = "Product is required for office orders";
    }

    if (formData.orderType === "fair" && !formData.productName?.trim()) {
      newErrors.productName = "Product name is required for fair orders";
    }

    if (userRole.includes("Silver") && !formData.productType) {
      newErrors.productType = "Product type is required for Silver orders";
    }
    
    if (!selectedSupplier) {
      newErrors.supplier = "Please select a supplier";
      showSnackbar("Please select a supplier before adding products", "error");
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
    
    // Add section details if available
    if (selectedSectionDetails) {
      formDataToSubmit.append("sectionCode", selectedSectionDetails.sectionCode);
      formDataToSubmit.append("sectionName", selectedSectionDetails.sectionName);
      formDataToSubmit.append("categoryCode", selectedSectionDetails.categoryCode);
      formDataToSubmit.append("categoryName", selectedSectionDetails.categoryName);
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
          fixRate: formData.fixRate || "",
          unfixRate: formData.unfixRate || "",
          goldwt: "",
          platinumWt: "",
          rateFixType: formData.rateFixType || "unfix",
        });
        
        setSelectedTypes({
          Gold: userRole.includes("Diamond"),
          Diamond: userRole.includes("Diamond"),
          Platinum: false,
        });
        
        setSelectedSection(null);
        setSelectedSectionDetails(null);
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
      // Handle section selection separately
      if (field.name === "section") {
        return (
          <Component
            key={field.name}
            {...commonProps}
            options={field.options || []}
            value={selectedSection}
            onChange={(value) => setSelectedSection(value)}
          />
        );
      }
      
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
                    {formData.rateFixType === "fix" 
                      ? `Fix: ₹${formData?.rate}` 
                      : `Unfix: ₹${formData?.rate}`}
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
          
          {selectedSupplier && filteredSubmittedData.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-gray-200">
              <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-semibold mb-2">No Items Found</p>
              <p className="text-sm">No products have been added for the selected supplier yet</p>
              <p className="text-xs text-gray-400 mt-2">Add products using the form above</p>
            </div>
          )}
          
          {selectedSupplier && filteredSubmittedData.length > 0 && (
            <>
              <div className="mb-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-900 font-semibold">
                      Showing <span className="text-base font-bold text-blue-700">{filteredSubmittedData.length}</span> {filteredSubmittedData.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Supplier: <span className="font-semibold">{supplierOptions.find(s => s.value === selectedSupplier)?.label || selectedSupplier}</span>
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
        {selectedItems.length > 0 && selectedSupplier && (
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

      {/* Rate Type Modal - WITH BOTH FIX AND UNFIX RATE INPUTS */}
      <RateTypeModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        onSelect={handleRateTypeSelect}
        currentRateType={formData.rateFixType || "unfix"}
      
        formData={formData}
        setFormData={setFormData}
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

