// import { useState, useContext, useEffect } from 'react';
// import { KycContext } from '../KycContext/KycContex';
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import axios from "axios";

// function SupplierKYC() {
//     const {
//         kycFormData,
//         setKycFormData,
//         handleInputChange,
//         filesDatas,
//         setFilesDatas,
//         handleFileChange,
//         validate,
//         errors,
//         setErrors,
//         handleFileDelete,
//         handleViewImage,
//         extractPANFromGST,
//         fileSizes,
//         fileDatasUrl,
//         getFileName
//     } = useContext(KycContext);

//     const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);
//     const [postalData, setPostalData] = useState([]);

//     const organizationLists = [
//         "",
//         "Public Limited Company",
//         "Private Limited Company",
//         "Joint Hindu Family Business",
//         "Patnership Firm",
//         "Proprietorship",
//         "Unregistered Dealer",
//         "Limited Liability Patnership"
//     ];

//     const handleValidate = () => {
//         const validationErrors = validate(kycFormData, filesDatas, fileDatasUrl);
//         console.log(validationErrors);

//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             ...validationErrors,
//         }));

//         return Object.keys(validationErrors).length === 0;
//     };

//     const handleNext = () => {
//         if (handleValidate()) {
//             localStorage.setItem("kycData", JSON.stringify(kycFormData));
//             setActiveComponent("Principal Address");
//         } else {
//             console.log("Form has errors. Cannot proceed to next section.");
//         }
//     };

//     useEffect(() => {
//         if (kycFormData.gst && kycFormData.gst.length > 0) {
//             const panNo = extractPANFromGST(kycFormData.gst);
//             localStorage.setItem("kycData", JSON.stringify(kycFormData));

//             const fieldErrors = validate({ ...kycFormData, ["pan"]: panNo }, filesDatas, fileDatasUrl);
//             setErrors((prevErrors) => ({
//                 ...prevErrors,
//                 ["pan"]: fieldErrors["pan"]
//             }));
//         }
//     }, [kycFormData.gst]);

//     const handleInputChangeWithValidation = (event) => {
//         handleInputChange(event);
//         const { name, value } = event.target;
//         console.log(name, value);

//         const fieldErrors = validate({ ...kycFormData, [name]: value }, filesDatas, fileDatasUrl);
//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: fieldErrors[name]
//         }));
//     };

//     const handleFileChangeWithValidation = (event) => {
//         handleFileChange(event);
//         const { name, files } = event.target;
//         const file = files[0];

//         const updatedFilesDatas = { ...filesDatas, [name]: file };

//         const fieldErrors = validate(kycFormData, updatedFilesDatas, fileDatasUrl);
//         setErrors((prevErrors) => ({
//             ...prevErrors,
//             [name]: fieldErrors[name]
//         }));
//     };

//     return (
//         <div className="flex items-center justify-center px-2 sm:px-4">
//             <div className="mx-auto w-full bg-white p-4 sm:p-6">
//                 <form className='w-full'>
//                     <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Business Address</h3>
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
//                         {/* Left side fields */}
//                         <div>
//                             {/* Supplier Category */}
//                             <div className="mb-6">
//                                 <label htmlFor="supplier-category" className="block text-black font-bold mb-3 text-sm sm:text-base">
//                                     Supplier Category:
//                                 </label>
//                                 <div className="flex flex-wrap gap-3 sm:gap-4">
//                                     {kycFormData.supplierCategory === 'Gold' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="gold"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Gold"
//                                                 checked={kycFormData.supplierCategory === 'Gold'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="gold" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Gold Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                     {kycFormData.supplierCategory === 'Diamond' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="Diamond"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Diamond"
//                                                 checked={kycFormData.supplierCategory === 'Diamond'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="Diamond" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Diamond Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                     {kycFormData.supplierCategory === 'Platinum' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="platinum"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Platinum"
//                                                 checked={kycFormData.supplierCategory === 'Platinum'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="platinum" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Platinum Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                     {kycFormData.supplierCategory === 'Silver' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="silver"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Silver"
//                                                 checked={kycFormData.supplierCategory === 'Silver'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="silver" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Silver Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                     {kycFormData.supplierCategory === 'Gold Hallmark' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="Gold Hallmark"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Gold Hallmark"
//                                                 checked={kycFormData.supplierCategory === 'Gold Hallmark'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="Gold Hallmark" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Gold Hallmark Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                     {kycFormData.supplierCategory === 'Silver Hallmark' &&
//                                         <div className="flex items-center">
//                                             <input
//                                                 id="Silver Hallmark"
//                                                 name="supplierCategory"
//                                                 type="radio"
//                                                 value="Silver Hallmark"
//                                                 checked={kycFormData.supplierCategory === 'Silver Hallmark'}
//                                                 className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
//                                             />
//                                             <label htmlFor="Silver Hallmark" className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap">
//                                                 Silver Hallmark Supplier
//                                             </label>
//                                         </div>
//                                     }
//                                 </div>
//                                 {errors.supplierCategory && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.supplierCategory}</p>
//                                 )}
//                             </div>
//       {/* GST */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     GST No:
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="gst"
//                                     value={kycFormData.gst}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter GST Number"
//                                     className={`w-full rounded-md border ${errors.gst ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.gst && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gst}</p>
//                                 )}
//                             </div>

//                             {/* PAN */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     PAN:
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="pan"
//                                     value={kycFormData.pan}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter PAN Number"
//                                     disabled
//                                     className={`w-full rounded-md border ${errors.pan ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.pan && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pan}</p>
//                                 )}
//                             </div>
//                             {/* Company Name */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Company Name:
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="companyname"
//                                     value={kycFormData.companyname}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Company Name"
//                                     disabled
//                                     className={`w-full rounded-md border ${errors.companyname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.companyname && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.companyname}</p>
//                                 )}
//                             </div>

//                             {/* Door No */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Door No (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="doorno"
//                                     value={kycFormData.doorno}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Door No"
//                                     maxLength={20}
//                                     className={`w-full rounded-md border ${errors.doorno ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.doorno && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.doorno}</p>
//                                 )}
//                             </div>

//                             {/* Street */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Street (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="street"
//                                     value={kycFormData.street}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Street"
//                                     maxLength={70}
//                                     className={`w-full rounded-md border ${errors.street ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.street && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.street}</p>
//                                 )}
//                             </div>

//                             {/* Pin Code */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Pin Code (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="pincode"
//                                     value={kycFormData.pincode}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Pin Code"
//                                     maxLength={6}
//                                     className={`w-full rounded-md border ${errors.pincode ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.pincode && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pincode}</p>
//                                 )}
//                             </div>

//                             {/* Area */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Area (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="area"
//                                     value={kycFormData.area}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Area"
//                                     className={`w-full rounded-md border ${errors.area ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.area && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.area}</p>
//                                 )}
//                             </div>

//                         </div>

//                         {/* Right side fields */}
//                         <div>
//                                 {/* Taluk */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Taluk (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="taluk"
//                                     value={kycFormData.taluk}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Taluk"
//                                     className={`w-full rounded-md border ${errors.taluk ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.taluk && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.taluk}</p>
//                                 )}
//                             </div>

//                             {/* City */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     City (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="city"
//                                     value={kycFormData.city}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter City"
//                                     className={`w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.city && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>
//                                 )}
//                             </div>
//                             {/* State */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     State (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="state"
//                                     value={kycFormData.state}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter State"
//                                     className={`w-full rounded-md border ${errors.state ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.state && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state}</p>
//                                 )}
//                             </div>

//                             {/* Mobile Number */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Mobile:
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="mobilenumber"
//                                     value={kycFormData.mobilenumber}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Mobile Number"
//                                     maxLength={10}
//                                     className={`w-full rounded-md border ${errors.mobilenumber ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                     disabled
//                                 />
//                                 {errors.mobilenumber && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.mobilenumber}</p>
//                                 )}
//                             </div>

//                             {/* Email */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     E-Mail:
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="email"
//                                     value={kycFormData.email}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter E-mail Address"
//                                     className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
//                                 )}
//                             </div>

//                             {/* Organization */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Organization:
//                                 </label>
//                                 <select
//                                     name='organization'
//                                     value={kycFormData.organization}
//                                     onChange={handleInputChangeWithValidation}
//                                     className={`w-full rounded-md border ${errors.organization ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 >
//                                     {organizationLists.map((data, index) => (
//                                         <option value={data} key={`${data}-${index}`}>
//                                             {data}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 {errors.organization && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.organization}</p>
//                                 )}
//                             </div>

//                             {/* Proprietor Name */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Owner/Authorized Representative Name (as per Gst):
//                                 </label>
//                                 <input
//                                     type="text"
//                                     name="propritorname"
//                                     value={kycFormData.propritorname}
//                                     onChange={handleInputChangeWithValidation}
//                                     placeholder="Enter Proprietor Name"
//                                     maxLength={60}
//                                     className={`w-full rounded-md border ${errors.propritorname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                     disabled
//                                 />
//                                 {errors.propritorname && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.propritorname}</p>
//                                 )}
//                             </div>

//                             {/* Reg Under MSME */}
//                             <div className="mb-6">
//                                 <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                     Reg Under MSME:
//                                 </label>
//                                 <select
//                                     name='regUnderMsme'
//                                     value={kycFormData.regUnderMsme}
//                                     onChange={handleInputChangeWithValidation}
//                                     className={`w-full rounded-md border ${errors.regUnderMsme ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                 >
//                                     <option></option>
//                                     <option>Yes</option>
//                                     <option>No</option>
//                                 </select>
//                                 {errors.regUnderMsme && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.regUnderMsme}</p>
//                                 )}
//                             </div>

//                             {/* MSME */}
//                             {kycFormData.regUnderMsme === "Yes" && (
//                                 <div className="mb-6">
//                                     <label className="mb-2 block text-sm sm:text-base font-medium text-black">
//                                         MSME No:
//                                     </label>
//                                     <input
//                                         type="text"
//                                         name="msmeNo"
//                                         value={kycFormData.msmeNo}
//                                         onChange={handleInputChangeWithValidation}
//                                         placeholder="Enter MSME Number"
//                                         className={`w-full rounded-md border ${errors.msmeNo ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
//                                     />
//                                     {errors.msmeNo && (
//                                         <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.msmeNo}</p>
//                                     )}
//                                 </div>
//                             )}

//                         </div>
//                     </div>

//                     {/* File Uploads */}
//                     <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center mt-6'>
//                         {/* GST File Upload */}
//                         <div className="mb-5">
//                             {filesDatas.gstFile || fileDatasUrl.gstFile ? (
//                                 <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
//                                     <p className="text-sm sm:text-base font-medium mb-2">Uploaded GST file:</p>
//                                     {filesDatas.gstFile?.type === "application/pdf" || fileDatasUrl.gstFile?.endsWith(".pdf") ? (
//                                         <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.gstFile?.name || getFileName(fileDatasUrl?.gstFile)}</p>
//                                     ) : (
//                                         <img
//                                             src={filesDatas.gstFile ? URL.createObjectURL(filesDatas.gstFile) : fileDatasUrl.gstFile}
//                                             alt="Uploaded Preview"
//                                             className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
//                                         />
//                                     )}
//                                     <div className="flex gap-2 sm:gap-4 mt-2">
//                                         <button
//                                             onClick={(event) => handleViewImage(filesDatas.gstFile, event, fileDatasUrl.gstFile)}
//                                             className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
//                                         >
//                                             View
//                                         </button>
//                                         <button
//                                             onClick={() => handleFileDelete('gstFile', fileDatasUrl.gstFile)}
//                                             className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                     <p className="text-xs mt-1">gstFile: {fileSizes["gstFile"]} KB</p>
//                                 </div>
//                             ) : (
//                                 <div>
//                                     <label className="mb-2 block text-sm sm:text-base font-medium">
//                                         Upload GST PDF or Image
//                                     </label>
//                                     <input
//                                         type="file"
//                                         name="gstFile"
//                                         accept="application/pdf, image/*"
//                                         onChange={handleFileChangeWithValidation}
//                                         className={`w-full rounded-md border ${errors.gstFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
//                                     />
//                                 </div>
//                             )}
//                             {errors.gstFile && (
//                                 <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gstFile}</p>
//                             )}
//                         </div>

//                         {/* PAN File Upload */}
//                         <div className="mb-5">
//                             {filesDatas.panFile || fileDatasUrl.panFile ? (
//                                 <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
//                                     <p className="text-sm sm:text-base font-medium mb-2">Uploaded PAN file:</p>
//                                     {filesDatas.panFile?.type === "application/pdf" || fileDatasUrl.panFile?.endsWith(".pdf") ? (
//                                         <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.panFile?.name || getFileName(fileDatasUrl?.panFile)}</p>
//                                     ) : (
//                                         <img
//                                             src={filesDatas.panFile ? URL.createObjectURL(filesDatas.panFile) : fileDatasUrl.panFile}
//                                             alt="PAN Uploaded Preview"
//                                             className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
//                                         />
//                                     )}
//                                     <div className="flex gap-2 sm:gap-4 mt-2">
//                                         <button
//                                             onClick={(event) => handleViewImage(filesDatas.panFile, event, fileDatasUrl.panFile)}
//                                             className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
//                                         >
//                                             View
//                                         </button>
//                                         <button
//                                             onClick={() => handleFileDelete('panFile', fileDatasUrl.panFile)}
//                                             className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                     <p className="text-xs mt-1">panFile: {fileSizes["panFile"]} KB</p>
//                                 </div>
//                             ) : (
//                                 <div>
//                                     <label className="mb-2 block text-sm sm:text-base font-medium">
//                                         Upload PAN PDF or Image
//                                     </label>
//                                     <input
//                                         type="file"
//                                         name="panFile"
//                                         accept="application/pdf, image/*"
//                                         onChange={handleFileChangeWithValidation}
//                                         className={`w-full rounded-md border ${errors.panFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
//                                     />
//                                 </div>
//                             )}
//                             {errors.panFile && (
//                                 <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.panFile}</p>
//                             )}
//                         </div>

//                         {/* MSME File Upload (Conditional) */}
//                         {kycFormData.regUnderMsme === "Yes" && (
//                             <div className="mb-5">
//                                 {filesDatas.msmeFile || fileDatasUrl.msmeFile ? (
//                                     <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
//                                         <p className="text-sm sm:text-base font-medium mb-2">Uploaded MSME file:</p>
//                                         {filesDatas.msmeFile?.type === "application/pdf" || fileDatasUrl.msmeFile?.endsWith(".pdf") ? (
//                                             <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.msmeFile?.name || getFileName(fileDatasUrl?.msmeFile)}</p>
//                                         ) : (
//                                             <img
//                                                 src={filesDatas.msmeFile ? URL.createObjectURL(filesDatas.msmeFile) : fileDatasUrl.msmeFile}
//                                                 alt="MSME Uploaded Preview"
//                                                 className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
//                                             />
//                                         )}
//                                         <div className="flex gap-2 sm:gap-4 mt-2">
//                                             <button
//                                                 onClick={(event) => handleViewImage(filesDatas.msmeFile, event, fileDatasUrl.msmeFile)}
//                                                 className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
//                                             >
//                                                 View
//                                             </button>
//                                             <button
//                                                 onClick={() => handleFileDelete('msmeFile', fileDatasUrl.msmeFile)}
//                                                 className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                         <p className="text-xs mt-1">msmeFile: {fileSizes["msmeFile"]} KB</p>
//                                     </div>
//                                 ) : (
//                                     <div>
//                                         <label className="mb-2 block text-sm sm:text-base font-medium">
//                                             Upload MSME PDF or Image
//                                         </label>
//                                         <input
//                                             type="file"
//                                             name="msmeFile"
//                                             accept="application/pdf, image/*"
//                                             onChange={handleFileChangeWithValidation}
//                                             className={`w-full rounded-md border ${errors.msmeFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
//                                         />
//                                     </div>
//                                 )}
//                                 {errors.msmeFile && (
//                                     <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.msmeFile}</p>
//                                 )}
//                             </div>
//                         )}
//                     </div>

//                     {/* Next Button */}
//                     <div className='flex justify-center mt-4 sm:mt-6'>
//                         <button
//                             type="button"
//                             className="w-full sm:w-auto rounded-md bg-blue-500 py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white outline-none hover:shadow-form hover:bg-blue-600 transition-colors"
//                             onClick={handleNext}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default SupplierKYC;

import { useState, useContext, useEffect } from "react";
import { KycContext } from "../KycContext/KycContex";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import axios from "axios";
import { API } from "../../../config/configData";
function SupplierKYC() {
  const {
    kycFormData,
    setKycFormData,
    handleInputChange,
    filesDatas,
    setFilesDatas,
    handleFileChange,
    validate,
    errors,
    setErrors,
    handleFileDelete,
    handleViewImage,
    extractPANFromGST,
    fileSizes,
    fileDatasUrl,
    getFileName,
    setStatutatoryInfo,
  } = useContext(KycContext);

  const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);
  const [isVerifying, setIsVerifying] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);

  const organizationLists = [
    "",
    "Public Limited Company",
    "Private Limited Company",
    "Joint Hindu Family Business",
    "Patnership Firm",
    "Proprietorship",
    "Unregistered Dealer",
    "Limited Liability Patnership",
  ];

  // State code mapping for Indian states
  const stateCodeMap = {
    1: "Jammu and Kashmir",
    2: "Himachal Pradesh",
    3: "Punjab",
    4: "Chandigarh",
    5: "Uttarakhand",
    6: "Haryana",
    7: "Delhi",
    8: "Rajasthan",
    9: "Uttar Pradesh",
    10: "Bihar",
    11: "Sikkim",
    12: "Arunachal Pradesh",
    13: "Nagaland",
    14: "Manipur",
    15: "Mizoram",
    16: "Tripura",
    17: "Meghalaya",
    18: "Assam",
    19: "West Bengal",
    20: "Jharkhand",
    21: "Odisha",
    22: "Chattisgarh",
    23: "Madhya Pradesh",
    24: "Gujarat",
    25: "Daman and Diu",
    26: "Dadra and Nagar Haveli",
    27: "Maharashtra",
    28: "Andhra Pradesh",
    29: "Karnataka",
    30: "Goa",
    31: "Lakshadweep",
    32: "Kerala",
    33: "Tamil Nadu",
    34: "Puducherry",
    35: "Andaman and Nicobar Islands",
    36: "Telangana",
    37: "Andhra Pradesh",
    38: "Ladakh",
  };

  // GST API Integration - Fetch and update form data
  useEffect(() => {
    const fetchGstData = async () => {
      if (!kycFormData?.gst || kycFormData.gst.length !== 15) {
        return;
      }

      setIsVerifying(true);
      setGstVerified(false);

      try {
        const response = await axios.post(`${API}/Get_GSTN_Details`, {
          gst: kycFormData.gst,
        });
        const supCodeResponse= await axios.get(`${API}/kyc/get_supplier_code/${kycFormData.gst}`)
        if(supCodeResponse?.data?.data?.suppCode){
          setKycFormData((preValue)=>({
            ...preValue,
            Suppcode:supCodeResponse?.data?.data?.suppCode
          }))
        }
        console.log(supCodeResponse)
        const gstData = response.data;

        // Check if GST is active
        if (gstData?.Status !== "ACT") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            gst: "GST is not active",
          }));
          setIsVerifying(false);
          setKycFormData((prevData) => ({
            ...prevData,
            gst: gstData?.Gstin || prevData.gst,
            pan: "",
            companyname: "",
            propritorname: "",
            doorno: "",
            street: "",
            pincode: "",
            area: "",
            taluk: "",
            city: "",
            state: "",
          }));
          setStatutatoryInfo((prevInfo) => ({
            ...prevInfo,
            tradename: "",
            readelegalname: "",
            tradedoorno: "",
            tradestreet: "",
            tradearea: "",
            tradestatecode: "",
            tradepincode: "",
            // tradeDoI: gstData?.DtReg || "",
          }));
          return;
        }

        // Extract PAN from GSTIN
        const panNumber = gstData?.Gstin?.substring(2, 12) || "";

        // Combine address fields for door number
        const doorNo = [gstData?.AddrBnm, gstData?.AddrBno, gstData?.AddrFlno]
          .filter(Boolean)
          .join(", ");

        // Update form data with GST API response
        setKycFormData((prevData) => ({
          ...prevData,
          gst: gstData?.Gstin || prevData.gst,
          pan: panNumber,
          companyname: gstData?.TradeName || gstData?.LegalName || "",
          // propritorname: gstData?.LegalName || "",
          doorno: doorNo || gstData?.AddrBno || "",
          street: gstData?.AddrSt || "",
          pincode: gstData?.AddrPncd ? gstData.AddrPncd.toString() : "",
          area: gstData?.AddrLoc || "",
          taluk: gstData?.AddrLoc || "",
          city: gstData?.AddrLoc || "",
          state: stateCodeMap[gstData?.StateCode] || "",
        }));
        setStatutatoryInfo((prevInfo) => ({
          ...prevInfo,
          tradename: gstData?.TradeName ||gstData?.LegalName|| "",
          readelegalname: gstData?.LegalName || "",
          tradedoorno: gstData?.AddrBno || "",
          tradestreet: gstData?.AddrSt || "",
          tradearea: gstData?.AddrLoc || "",
          tradestatecode: gstData?.StateCode || "",
          tradepincode: gstData?.AddrPncd || "",
          // tradeDoI: gstData?.DtReg || "",
        }));
        // Clear errors for auto-filled fields
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          [
            "gst",
            "pan",
            "companyname",
            "propritorname",
            "doorno",
            "street",
            "pincode",
            "area",
            "city",
            "state",
          ].forEach((field) => {
            delete newErrors[field];
          });
          return newErrors;
        });

        setGstVerified(true);
        console.log("GST data fetched and form updated successfully");
      } catch (error) {
        console.error("GST API Error:", error);
          setKycFormData((prevData) => ({
            ...prevData,
            pan: "",
            companyname: "",
            propritorname: "",
            doorno: "",
            street: "",
            pincode: "",
            area: "",
            taluk: "",
            city: "",
            state: "",
          }));
          setStatutatoryInfo((prevInfo) => ({
            ...prevInfo,
            tradename: "",
            readelegalname: "",
            tradedoorno: "",
            tradestreet: "",
            tradearea: "",
            tradestatecode: "",
            tradepincode: "",
            tradeDoI:  "",
          }));
        setErrors((prevErrors) => ({
          ...prevErrors,
          gst:
            error.response?.data?.message ||
            "Failed to verify GST. Please check the number.",
        }));
      } finally {
        setIsVerifying(false);
      }
    };

    fetchGstData();
  }, [kycFormData?.gst]);
console.log(kycFormData)
  // Original PAN extraction effect
  useEffect(() => {
    if (kycFormData.gst && kycFormData.gst.length > 0 && !gstVerified) {
      const panNo = extractPANFromGST(kycFormData.gst);
      localStorage.setItem("kycData", JSON.stringify(kycFormData));

      const fieldErrors = validate(
        { ...kycFormData, ["pan"]: panNo },
        filesDatas,
        fileDatasUrl
      );
      setErrors((prevErrors) => ({
        ...prevErrors,
        ["pan"]: fieldErrors["pan"],
      }));
    }
  }, [kycFormData.gst, gstVerified]);

  const handleValidate = () => {
    const validationErrors = validate(kycFormData, filesDatas, fileDatasUrl);
    console.log(validationErrors);

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...validationErrors,
    }));

    return Object.keys(validationErrors).length === 0;
  };

  const handleNext = () => {
    if (handleValidate()) {
      localStorage.setItem("kycData", JSON.stringify(kycFormData));
      setActiveComponent("Principal Address");
    } else {
      console.log("Form has errors. Cannot proceed to next section.");
    }
  };

  const handleInputChangeWithValidation = (event) => {
    handleInputChange(event);
    const { name, value } = event.target;
    console.log(name, value);

    const fieldErrors = validate(
      { ...kycFormData, [name]: value },
      filesDatas,
      fileDatasUrl
    );
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name],
    }));
  };

  const handleFileChangeWithValidation = (event) => {
    handleFileChange(event);
    const { name, files } = event.target;
    const file = files[0];

    const updatedFilesDatas = { ...filesDatas, [name]: file };

    const fieldErrors = validate(kycFormData, updatedFilesDatas, fileDatasUrl);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldErrors[name],
    }));
  };

  return (
    <div className="flex items-center justify-center px-2 sm:px-4">
      <div className="mx-auto w-full bg-white p-4 sm:p-6">
        <form className="w-full">
          <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">
            Business Address
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* Left side fields */}
            <div>
              {/* Supplier Category */}
              <div className="mb-6">
                <label
                  htmlFor="supplier-category"
                  className="block text-black font-bold mb-3 text-sm sm:text-base"
                >
                  Supplier Category:
                </label>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {kycFormData.supplierCategory === "Gold" && (
                    <div className="flex items-center">
                      <input
                        id="gold"
                        name="supplierCategory"
                        type="radio"
                        value="Gold"
                        checked={kycFormData.supplierCategory === "Gold"}
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="gold"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Gold Supplier
                      </label>
                    </div>
                  )}
                  {kycFormData.supplierCategory === "Diamond" && (
                    <div className="flex items-center">
                      <input
                        id="Diamond"
                        name="supplierCategory"
                        type="radio"
                        value="Diamond"
                        checked={kycFormData.supplierCategory === "Diamond"}
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="Diamond"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Diamond Supplier
                      </label>
                    </div>
                  )}
                  {kycFormData.supplierCategory === "Platinum" && (
                    <div className="flex items-center">
                      <input
                        id="platinum"
                        name="supplierCategory"
                        type="radio"
                        value="Platinum"
                        checked={kycFormData.supplierCategory === "Platinum"}
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="platinum"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Platinum Supplier
                      </label>
                    </div>
                  )}
                  {kycFormData.supplierCategory === "Silver" && (
                    <div className="flex items-center">
                      <input
                        id="silver"
                        name="supplierCategory"
                        type="radio"
                        value="Silver"
                        checked={kycFormData.supplierCategory === "Silver"}
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="silver"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Silver Supplier
                      </label>
                    </div>
                  )}
                  {kycFormData.supplierCategory === "Gold Hallmark" && (
                    <div className="flex items-center">
                      <input
                        id="Gold Hallmark"
                        name="supplierCategory"
                        type="radio"
                        value="Gold Hallmark"
                        checked={
                          kycFormData.supplierCategory === "Gold Hallmark"
                        }
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="Gold Hallmark"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Gold Hallmark Supplier
                      </label>
                    </div>
                  )}
                  {kycFormData.supplierCategory === "Silver Hallmark" && (
                    <div className="flex items-center">
                      <input
                        id="Silver Hallmark"
                        name="supplierCategory"
                        type="radio"
                        value="Silver Hallmark"
                        checked={
                          kycFormData.supplierCategory === "Silver Hallmark"
                        }
                        className={`h-4 w-4 text-black border-black focus:ring-black ${
                          errors.supplierCategory ? "border-red-500" : ""
                        }`}
                      />
                      <label
                        htmlFor="Silver Hallmark"
                        className="ml-2 text-xs sm:text-sm text-black whitespace-nowrap"
                      >
                        Silver Hallmark Supplier
                      </label>
                    </div>
                  )}
                </div>
                {errors.supplierCategory && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.supplierCategory}
                  </p>
                )}
              </div>

              {/* GST */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  GST No:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="gst"
                    value={kycFormData.gst}
                    onChange={handleInputChangeWithValidation}
                    placeholder="Enter GST Number"
                    maxLength={15}
                    className={`w-full rounded-md border ${
                      errors.gst ? "border-red-500" : "border-gray-400"
                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  />
                  {isVerifying && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                  {gstVerified && !isVerifying && (
                    <div className="absolute right-3 top-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.gst && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.gst}
                  </p>
                )}
                {isVerifying && (
                  <p className="text-blue-500 text-xs sm:text-sm mt-1">
                    Verifying GST...
                  </p>
                )}
                {gstVerified && !isVerifying && (
                  <p className="text-green-500 text-xs sm:text-sm mt-1">
                    ✓ GST verified successfully
                  </p>
                )}
              </div>

              {/* PAN */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  PAN:
                </label>
                <input
                  type="text"
                  name="pan"
                  value={kycFormData.pan}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter PAN Number"
                  disabled
                  className={`w-full rounded-md border ${
                    errors.pan ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.pan && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.pan}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Company Name:
                </label>
                <input
                  type="text"
                  name="companyname"
                  value={kycFormData.companyname}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Company Name"
                  disabled
                  className={`w-full rounded-md border ${
                    errors.companyname ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.companyname && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.companyname}
                  </p>
                )}
              </div>

              {/* Door No */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Door No (as per Gst):
                </label>
                <input
                  type="text"
                  name="doorno"
                  value={kycFormData.doorno}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Door No"
                  maxLength={20}
                  className={`w-full rounded-md border ${
                    errors.doorno ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.doorno && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.doorno}
                  </p>
                )}
              </div>

              {/* Street */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Street (as per Gst):
                </label>
                <input
                  type="text"
                  name="street"
                  value={kycFormData.street}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Street"
                  maxLength={70}
                  className={`w-full rounded-md border ${
                    errors.street ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.street && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.street}
                  </p>
                )}
              </div>

              {/* Pin Code */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Pin Code (as per Gst):
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={kycFormData.pincode}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Pin Code"
                  maxLength={6}
                  className={`w-full rounded-md border ${
                    errors.pincode ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.pincode}
                  </p>
                )}
              </div>

              {/* Area */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Area (as per Gst):
                </label>
                <input
                  type="text"
                  name="area"
                  value={kycFormData.area}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Area"
                  className={`w-full rounded-md border ${
                    errors.area ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.area && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.area}
                  </p>
                )}
              </div>
            </div>

            {/* Right side fields */}
            <div>
              {/* Taluk */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Taluk (as per Gst):
                </label>
                <input
                  type="text"
                  name="taluk"
                  value={kycFormData.taluk}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Taluk"
                  className={`w-full rounded-md border ${
                    errors.taluk ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.taluk && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.taluk}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  City (as per Gst):
                </label>
                <input
                  type="text"
                  name="city"
                  value={kycFormData.city}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter City"
                  className={`w-full rounded-md border ${
                    errors.city ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.city}
                  </p>
                )}
              </div>

              {/* State */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  State (as per Gst):
                </label>
                <input
                  type="text"
                  name="state"
                  value={kycFormData.state}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter State"
                  className={`w-full rounded-md border ${
                    errors.state ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.state}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Mobile:
                </label>
                <input
                  type="text"
                  name="mobilenumber"
                  value={kycFormData.mobilenumber}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  className={`w-full rounded-md border ${
                    errors.mobilenumber ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  disabled
                />
                {errors.mobilenumber && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.mobilenumber}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  E-Mail:
                </label>
                <input
                  type="text"
                  name="email"
                  value={kycFormData.email}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter E-mail Address"
                  className={`w-full rounded-md border ${
                    errors.email ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Organization */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Organization:
                </label>
                <select
                  name="organization"
                  value={kycFormData.organization}
                  onChange={handleInputChangeWithValidation}
                  className={`w-full rounded-md border ${
                    errors.organization ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                >
                  {organizationLists.map((data, index) => (
                    <option value={data} key={`${data}-${index}`}>
                      {data}
                    </option>
                  ))}
                </select>
                {errors.organization && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.organization}
                  </p>
                )}
              </div>

              {/* Proprietor Name */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Owner/Authorized Representative Name (as per Gst):
                </label>
                <input
                  type="text"
                  name="propritorname"
                  value={kycFormData.propritorname}
                  onChange={handleInputChangeWithValidation}
                  placeholder="Enter Proprietor Name"
                  maxLength={60}
                  className={`w-full rounded-md border ${
                    errors.propritorname ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  
                />
                {errors.propritorname && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.propritorname}
                  </p>
                )}
              </div>

              {/* Reg Under MSME */}
              <div className="mb-6">
                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                  Reg Under MSME:
                </label>
                <select
                  name="regUnderMsme"
                  value={kycFormData.regUnderMsme}
                  onChange={handleInputChangeWithValidation}
                  className={`w-full rounded-md border ${
                    errors.regUnderMsme ? "border-red-500" : "border-gray-400"
                  } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                >
                  <option></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
                {errors.regUnderMsme && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.regUnderMsme}
                  </p>
                )}
              </div>

              {/* MSME */}
              {kycFormData.regUnderMsme === "Yes" && (
                <div className="mb-6">
                  <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                    MSME No:
                  </label>
                  <input
                    type="text"
                    name="msmeNo"
                    value={kycFormData.msmeNo}
                    onChange={handleInputChangeWithValidation}
                    placeholder="Enter MSME Number"
                    className={`w-full rounded-md border ${
                      errors.msmeNo ? "border-red-500" : "border-gray-400"
                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  />
                  {errors.msmeNo && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.msmeNo}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* File Uploads Section - Same as before */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center mt-6">
            {/* GST File Upload */}
            <div className="mb-5">
              {filesDatas.gstFile || fileDatasUrl.gstFile ? (
                <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                  <p className="text-sm sm:text-base font-medium mb-2">
                    Uploaded GST file:
                  </p>
                  {filesDatas.gstFile?.type === "application/pdf" ||
                  fileDatasUrl.gstFile?.endsWith(".pdf") ? (
                    <p className="text-xs sm:text-sm text-gray-700 break-all">
                      {filesDatas?.gstFile?.name ||
                        getFileName(fileDatasUrl?.gstFile)}
                    </p>
                  ) : (
                    <img
                      src={
                        filesDatas.gstFile
                          ? URL.createObjectURL(filesDatas.gstFile)
                          : fileDatasUrl.gstFile
                      }
                      alt="Uploaded Preview"
                      className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex gap-2 sm:gap-4 mt-2">
                    <button
                      onClick={(event) =>
                        handleViewImage(
                          filesDatas.gstFile,
                          event,
                          fileDatasUrl.gstFile
                        )
                      }
                      className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleFileDelete("gstFile", fileDatasUrl.gstFile)
                      }
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs mt-1">
                    gstFile: {fileSizes["gstFile"]} KB
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm sm:text-base font-medium">
                    Upload GST PDF or Image
                  </label>
                  <input
                    type="file"
                    name="gstFile"
                    accept="application/pdf, image/*"
                    onChange={handleFileChangeWithValidation}
                    className={`w-full rounded-md border ${
                      errors.gstFile ? "border-red-500" : "border-[#e0e0e0]"
                    } bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                  />
                </div>
              )}
              {errors.gstFile && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.gstFile}
                </p>
              )}
            </div>

            {/* PAN File Upload */}
            <div className="mb-5">
              {filesDatas.panFile || fileDatasUrl.panFile ? (
                <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                  <p className="text-sm sm:text-base font-medium mb-2">
                    Uploaded PAN file:
                  </p>
                  {filesDatas.panFile?.type === "application/pdf" ||
                  fileDatasUrl.panFile?.endsWith(".pdf") ? (
                    <p className="text-xs sm:text-sm text-gray-700 break-all">
                      {filesDatas?.panFile?.name ||
                        getFileName(fileDatasUrl?.panFile)}
                    </p>
                  ) : (
                    <img
                      src={
                        filesDatas.panFile
                          ? URL.createObjectURL(filesDatas.panFile)
                          : fileDatasUrl.panFile
                      }
                      alt="PAN Uploaded Preview"
                      className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex gap-2 sm:gap-4 mt-2">
                    <button
                      onClick={(event) =>
                        handleViewImage(
                          filesDatas.panFile,
                          event,
                          fileDatasUrl.panFile
                        )
                      }
                      className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        handleFileDelete("panFile", fileDatasUrl.panFile)
                      }
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs mt-1">
                    panFile: {fileSizes["panFile"]} KB
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-sm sm:text-base font-medium">
                    Upload PAN PDF or Image
                  </label>
                  <input
                    type="file"
                    name="panFile"
                    accept="application/pdf, image/*"
                    onChange={handleFileChangeWithValidation}
                    className={`w-full rounded-md border ${
                      errors.panFile ? "border-red-500" : "border-[#e0e0e0]"
                    } bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                  />
                </div>
              )}
              {errors.panFile && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">
                  {errors.panFile}
                </p>
              )}
            </div>

            {/* MSME File Upload (Conditional) */}
            {kycFormData.regUnderMsme === "Yes" && (
              <div className="mb-5">
                {filesDatas.msmeFile || fileDatasUrl.msmeFile ? (
                  <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                    <p className="text-sm sm:text-base font-medium mb-2">
                      Uploaded MSME file:
                    </p>
                    {filesDatas.msmeFile?.type === "application/pdf" ||
                    fileDatasUrl.msmeFile?.endsWith(".pdf") ? (
                      <p className="text-xs sm:text-sm text-gray-700 break-all">
                        {filesDatas?.msmeFile?.name ||
                          getFileName(fileDatasUrl?.msmeFile)}
                      </p>
                    ) : (
                      <img
                        src={
                          filesDatas.msmeFile
                            ? URL.createObjectURL(filesDatas.msmeFile)
                            : fileDatasUrl.msmeFile
                        }
                        alt="MSME Uploaded Preview"
                        className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                      />
                    )}
                    <div className="flex gap-2 sm:gap-4 mt-2">
                      <button
                        onClick={(event) =>
                          handleViewImage(
                            filesDatas.msmeFile,
                            event,
                            fileDatasUrl.msmeFile
                          )
                        }
                        className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleFileDelete("msmeFile", fileDatasUrl.msmeFile)
                        }
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-xs mt-1">
                      msmeFile: {fileSizes["msmeFile"]} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="mb-2 block text-sm sm:text-base font-medium">
                      Upload MSME PDF or Image
                    </label>
                    <input
                      type="file"
                      name="msmeFile"
                      accept="application/pdf, image/*"
                      onChange={handleFileChangeWithValidation}
                      className={`w-full rounded-md border ${
                        errors.msmeFile ? "border-red-500" : "border-[#e0e0e0]"
                      } bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                    />
                  </div>
                )}
                {errors.msmeFile && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.msmeFile}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Button */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <button
              type="button"
              className="w-full sm:w-auto rounded-md bg-blue-500 py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white outline-none hover:shadow-form hover:bg-blue-600 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SupplierKYC;
