// import { createContext, useState } from "react";
// import axios from "axios";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import { useContext } from "react";
// import {
//   validate,
//   validateStatutoryInfo,
//   validateBankingInfo,
//   validateContactInfo,
//   validateTradeInfo,
//   validateHallmarkInfo,
// } from "../Datas/Validation";
// //validateBusinessInfo
// import { useEffect } from "react";
// import { KYC_API } from "../../../config/configData";
// import { Message } from "@mui/icons-material";
// import { jwtDecode } from "jwt-decode";
// import imageCompression from "browser-image-compression";
// // import { PDFDocument } from 'pdf-lib';
// import { Document, Page } from "react-pdf";
// import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
// import BankingInformation from "../components/BankingInformation";

// const KycContext = createContext();

// const KycDataProvider = ({ children }) => {
//   // const kycPost = "http://localhost:8080/kyc"
//   const {
//     user,
//     userRole,
//     userData,
//     decryptToken,
//     companyName: cmpyName,
//   } = useContext(DashBoardContext);
//   const [companyName, setCompanyName] = useState("");
//   const [userName, setUserName] = useState("");
//   // console.log(names,user)

//   const [kycFormData, setKycFormData] = useState({
//     id: "",
//     supplierCategory: "",
//     companyname: "",
//     doorno: "",
//     street: "",
//     pincode: "",
//     area: "",
//     taluk: "",
//     city: "",
//     state: "",
//     mobilenumber: "",
//     email: "",
//     propritorname: "",
//     organization: "",
//     regUnderMsme: "",
//     // purchasecity: '',
//     // location: '',
//     gst: "",
//     pan: "",
//     msmeNo: "",
//   });
//   //pdf files
//   const [filesDatas, setFilesDatas] = useState({
//     gstFile: null,
//     panFile: null,
//     msmeFile: null,
//     chequeFile: null,
//     ownerFile: null,
//     boFile: null,
//     accountsFile: null,
//     bisFile: null,
//     insuranceFile: null,
//     quotationFile: null,
//     authPersonFile: null,
//   });
//   const [fileDatasUrl, setFileDatasUrl] = useState({
//     gstFile: "",
//     panFile: "",
//     msmeFile: "",
//     chequeFile: "",
//     ownerFile: "",
//     boFile: "",
//     accountsFile: "",
//     bisFile: "",
//     insuranceFile: "",
//     quotationFile: "",
//     authPersonFile: "",
//   });
//   console.log(fileDatasUrl.gstFile);
//   const [statutatoryInfo, setStatutatoryInfo] = useState({
//     tradename: "",
//     readelegalname: "",
//     tradedoorno: "",
//     tradestreet: "",
//     tradearea: "",
//     tradestatecode: "",
//     tradepincode: "",
//     tradeDoI: "",
//   });
//   const [accInfo, setAccInfo] = useState({
//     acholdername: "",
//     acnumber: "",
//     actype: "",
//     ifsc: "",
//     bankname: "",
//     bankbranchname: "",
//     bankaddress: "",
//   });
//   const [contactInfo, setContactInfo] = useState({
//     owner: "",
//     ownername: "",
//     ownermobile: "",
//     owneremail: "",
//     businessoperation: "",
//     boname: "",
//     bomobile: "",
//     boemail: "",
//     accounts: "",
//     accname: "",
//     accmobile: "",
//     accemail: "",
//   });
//   const [hallmarkInfo, setHallmarkInfo] = useState({
//     bisLicenseNo: "",
//     certificateValidFrom: "",
//     certificateValidTo: "",
//     hasInsurance: "",
//     insuranceCompany: "",
//     insuranceAmount: "",
//     policyStartDate: "",
//     endorsementDate: "",
//     policyEndDate: "",
//   });
//   const [tradeBusinessInfo, setTradeBusinessInfo] = useState({
//     natureOfBusiness: "",
//     authDistributor: "",
//     retailJeweller: "",
//     maincatogory: "",
//     tradeMetals: [],
//   });
//   const [errors, setErrors] = useState({});
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");
//   const [fileSizes, setFileSizes] = useState({});
//   function capitalizeValue(value, name = "") {
//     if (
//       typeof value === "string" &&
//       value.length > 0 &&
//       !name.includes("email")
//     ) {
//       return value.charAt(0).toUpperCase() + value.slice(1);
//     } else if (
//       typeof value === "string" &&
//       value.length > 0 &&
//       name.includes("email")
//     ) {
//       return value;
//     }
//     return value; // Return as is if not a string
//   }
//   useEffect(() => {
//     if (kycFormData.gst) {
//       const stateCode = kycFormData.gst.substring(0, 2);
//       setStatutatoryInfo((prevState) => ({
//         ...prevState,
//         tradestatecode: stateCode,
//       }));
//     }
//   }, [kycFormData.gst]);

//   console.log(contactInfo);
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       const Securedtoken = decryptToken(token);
//       const decodedToken = jwtDecode(Securedtoken);
//       console.log(decodedToken);
//       const role = decodedToken.role;
//       const name = decodedToken.name;
//       const companyName = decodedToken.companyName;
//       const MobileNo = decodedToken.MobileNo;
//       setCompanyName(companyName);
//       setUserName(name);
//       let supplierCatagories;
//       if (role === "Gold-Supplier") {
//         supplierCatagories = "Gold";
//       }
//       if (role === "Diamond-Supplier") {
//         supplierCatagories = "Diamond";
//       }
//       if (role === "Platinum-Supplier") {
//         supplierCatagories = "Platinum";
//       }
//       if (role === "Silver-Supplier") {
//         supplierCatagories = "Silver";
//       }
//       if (role === "GoldHallmark-Supplier") {
//         supplierCatagories = "Gold Hallmark";
//       }
//       if (role === "SilverHallmark-Supplier") {
//         supplierCatagories = "Silver Hallmark";
//       }
//       setKycFormData((prevState) => ({
//         ...prevState,
//         companyname: companyName,
//         propritorname: name,
//         mobilenumber: MobileNo,
//         supplierCategory: supplierCatagories,
//       }));
//     }
//   }, []);
//   console.log(companyName, userName);

//   console.log(kycFormData);
//   const getFileName = (url) => {
//     console.log(url);
//     return url?.split("/").pop();
//   };
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let token = localStorage.getItem("token");
//         let kycDatasLocal = localStorage.getItem("kycData");
//         let kycDatas = JSON.parse(kycDatasLocal);
//         let kycStat = localStorage.getItem("KycStat");
//         let statutatory = JSON.parse(kycStat);
//         let kycAcc = localStorage.getItem("KycAcc");
//         let accInfo = JSON.parse(kycAcc);
//         let KycContact = localStorage.getItem("KycContact");
//         let contactInfo = JSON.parse(KycContact);
//         let kycTrade = localStorage.getItem("KycTrade");
//         let tradeinfos = JSON.parse(kycTrade);
//         let hallmark=localStorage.getItem("hallmarkInfo");
//         let hallmarkDatas=JSON.parse(hallmark);
//         if (kycDatas) setKycFormData(kycDatas);
//         if (statutatory) setStatutatoryInfo(statutatory);
//         if (accInfo) setAccInfo(accInfo);
//         if (contactInfo) setContactInfo(contactInfo);
//         if (tradeinfos) setTradeBusinessInfo(tradeinfos)
//         if(hallmarkDatas) setHallmarkInfo(hallmarkDatas)
//         const fetchToken = () => {
//           token = localStorage.getItem("token");
//         };
//         if (!token) {
//           console.error("No token found in localStorage");
//           fetchToken();
//           return;
//         }

//         const SecuredToken = decryptToken(token);
//         const decodedToken = jwtDecode(SecuredToken);
//         const companyName = decodedToken.companyName;

//         const response = await axios.get(
//           `${KYC_API}/geteditdata/${companyName}`
//         );
//         const data = response.data;
//         console.log(data);

//         // Update each state with a functional update to ensure proper setting
//         setKycFormData((prevState) => ({
//           ...prevState,
//           id: data.id || prevState.id,
//           supplierCategory: data.supplierCategory || prevState.supplierCategory,
//           companyname: data.SupplierName || prevState.companyname,
//           doorno: data.doorno || prevState.doorno,
//           street: data.street || prevState.street,
//           pincode: data.pincode || prevState.pincode,
//           area: data.area || prevState.area,
//           taluk: data.taluk || prevState.taluk,
//           city: data.city || prevState.city,
//           state: data.state || prevState.state,
//           mobilenumber: data.mobilenumber || prevState.mobilenumber,
//           email: data.email || prevState.email,
//           propritorname: data.propritorname || prevState.propritorname,
//           organization: data.organization || prevState.organization,
//           regUnderMsme: data.regUnderMsme || prevState.regUnderMsme,
//           gst: data.gst || prevState.gst,
//           pan: data.pan || prevState.pan,
//           msmeNo: data.msmeNo || prevState.msmeNo,
//         }));

//         setStatutatoryInfo((prevState) => ({
//           ...prevState,
//           tradename: data.tradename || prevState.tradename,
//           readelegalname: data.readelegalname || prevState.readelegalname,
//           tradedoorno: data.tradedoorno || prevState.tradedoorno,
//           tradestreet: data.tradestreet || prevState.tradestreet,
//           tradearea: data.tradearea || prevState.tradearea,
//           tradestatecode: data.tradestatecode || prevState.tradestatecode,
//           tradepincode: data.tradepincode || prevState.tradepincode,
//           tradeDoI: data.tradeDoI || prevState.tradeDoI,
//         }));

//         setAccInfo((prevState) => ({
//           ...prevState,
//           acholdername: data.acholdername || prevState.acholdername,
//           acnumber: data.acnumber || prevState.acnumber,
//           actype: data.actype || prevState.actype,
//           ifsc: data.ifsc || prevState.ifsc,
//           bankname: data.bankname || prevState.bankname,
//           bankbranchname: data.bankbranchname || prevState.bankbranchname,
//           bankaddress: data.bankaddress || prevState.bankaddress,
//         }));
//         console.log(contactInfo);
//         setContactInfo((prevState) => ({
//           ...prevState,
//           owner: data.owner || prevState.owner,
//           ownername: data.ownername || prevState.ownername,
//           ownermobile: data.ownermobile || prevState.ownermobile,
//           owneremail: data.owneremail || prevState.owneremail,
//           businessoperation:
//             data.businessoperation || prevState.businessoperation,
//           boname: data.boname || prevState.boname,
//           bomobile: data.bomobile || prevState.bomobile,
//           boemail: data.boemail || prevState.boemail,
//           accounts: data.accounts || prevState.accounts,
//           accname: data.accname || prevState.accname,
//           accmobile: data.accmobile || prevState.accmobile,
//           accemail: data.accemail || prevState.accemail,
//         }));
//         if(userRole.includes("Hallmark")){
//           setHallmarkInfo((prevState) => ({
//             ...prevState,
  
//             bisLicenseNo: data.bisLicenseNo || prevState.bisLicenseNo,
//             certificateValidFrom:
//               data.certificateValidFrom || prevState.certificateValidFrom,
//             certificateValidTo:
//               data.certificateValidTo || prevState.certificateValidTo,
//             hasInsurance: data.hasInsurance || prevState.hasInsurance,
//             insuranceCompany: data.insuranceCompany || prevState.insuranceCompany,
//             insuranceAmount: data.insuranceAmount || prevState.insuranceAmount,
//             policyStartDate: data.policyStartDate || prevState.policyStartDate,
//             endorsementDate: data.endorsementDate || prevState.endorsementDate,
//             policyEndDate: data.policyEndDate || prevState.policyEndDate,
//           }));
//         }
       

//         setTradeBusinessInfo((prevState) => ({
//           ...prevState,
//           natureOfBusiness: data.natureOfBusiness || prevState.natureOfBusiness,
//           authDistributor: data.authDistributor || prevState.authDistributor,
//           retailJeweller: data.retailJeweller || prevState.retailJeweller,
//           maincatogory: data.maincatogory || prevState.maincatogory,
//           tradeMetals: data.tradeMetals || prevState.tradeMetals,
//         }));

//         const [fileDatasUrl, setFileDatasUrl] = useState({
//           gstFile: "",
//           panFile: "",
//           msmeFile: "",
//           chequeFile: "",
//           ownerFile: "",
//           boFile: "",
//           accountsFile: "",
//           bisFile: "",
//           insuranceFile: "",
//           quotationFile: "",
//           authPersonFile: "",
//         });

//         // // In your fetchData function
//         console.log(data);
//         setFileDatasUrl({
//           gstFile: data?.gstFile?.replace(/^"+|"+$/g, ""), // Remove extra quotes if present
//           panFile: data?.panFile?.replace(/^"+|"+$/g, ""),
//           msmeFile: data?.msmeFile?.replace(/^"+|"+$/g, ""),
//           chequeFile: data?.chequeFile?.replace(/^"+|"+$/g, ""),
//           ownerFile: data?.ownerFile?.replace(/^"+|"+$/g, ""),
//           boFile: data?.boFile?.replace(/^"+|"+$/g, ""),
//           accountsFile: data?.accountsFile?.replace(/^"+|"+$/g, ""),
//           bisFile:data?.bisFile?.replace(/^"+|"+$/g, ""),
//           insuranceFile:data?.insuranceFile?.replace(/^"+|"+$/g, ""),
//           quotationFile: data?.quotationFile?.replace(/^"+|"+$/g, ""),
//           authPersonFile:data?.authPersonFile?.replace(/^"+|"+$/g, ""),
//         });

//         // Helper function to create URL based on file type
//       } catch (error) {
//         console.error("Error fetching KYC data:", error);
//       }
//     };

//     fetchData();
//   }, []);
//   console.log(fileDatasUrl);
//   const handleInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     console.log(type, name, value);

//     if (name === "gst") {
//       console.log(value);

//       // Assuming the PAN number is derived from the GST.
//       const panNumber = extractPANFromGST(value); // Custom function to extract PAN
//       console.log("Extracted PAN:", panNumber);

//       // Update the state with the PAN number
//       setKycFormData((prevState) => ({
//         ...prevState,
//         pan: panNumber, // Assuming 'pan' is the key for PAN in your state
//         [name]: type === "checkbox" ? checked : value,
//       }));
//       localStorage.setItem("kycData", JSON.stringify(kycFormData));
//     } else {
//       setKycFormData((prevState) => ({
//         ...prevState,
//         [name]:
//           type === "checkbox"
//             ? checked
//             : name === "email"
//             ? value
//             : capitalizeValue(value, name),
//       }));
//       // console.log(capitalizeValue("name"))
//       localStorage.setItem("kycData", JSON.stringify(kycFormData));
//       console.log(kycFormData);
//     }

//     validate(kycFormData, filesDatas, fileDatasUrl);
//   };

//   const extractPANFromGST = (gstValue) => {
//     const panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
//     const panData = gstValue.match(panPattern);
//     return panData ? panData[0] : "";
//   };
//   const compressImage = async (file, targetSizeKB = 100) => {
//     let compressedFile = file;
//     let quality = 0.9;
//     const minQuality = 0.1;

//     while (compressedFile.size > targetSizeKB * 1024 && quality >= minQuality) {
//       const options = {
//         maxSizeMB: targetSizeKB / 1024,
//         maxWidthOrHeight: 800,
//         useWebWorker: true,
//         initialQuality: quality,
//       };

//       try {
//         compressedFile = await imageCompression(compressedFile, options);
//         quality -= 0.1;
//       } catch (error) {
//         console.error("Error compressing image:", error);
//         break;
//       }
//     }

//     return compressedFile;
//   };

//   const handleFileChange = async (event) => {
//     const { name, files } = event.target;

//     if (files && files.length > 0) {
//       const originalFile = files[0];
//       let processedFile = originalFile;

//       // Check file type and process accordingly
//       if (originalFile.type.includes("image")) {
//         // Compress image and convert to JPG
//         processedFile = await compressAndConvertToJPG(originalFile, 300); // Target 100 KB
//       }

//       // Update state
//       setFilesDatas((prevState) => ({
//         ...prevState,
//         [name]: processedFile,
//       }));

//       setFileSizes((prevSizes) => ({
//         ...prevSizes,
//         [name]: (processedFile.size / 1024).toFixed(2), // Store size in KB
//       }));
//     }
//   };

//   // Function to compress and convert image to JPG
//   const compressAndConvertToJPG = async (file, targetSizeKB) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => {
//         const img = new Image();
//         img.src = reader.result;
//         img.onload = async () => {
//           let quality = 0.8; // Start with a high quality
//           let width = img.width;
//           let height = img.height;
//           let blob;

//           do {
//             const canvas = document.createElement("canvas");
//             const ctx = canvas.getContext("2d");

//             // Scale canvas dimensions (if needed)
//             canvas.width = width;
//             canvas.height = height;

//             // Draw the image onto the canvas
//             ctx.drawImage(img, 0, 0, width, height);

//             // Compress and convert to JPG
//             blob = await new Promise((res) =>
//               canvas.toBlob((b) => res(b), "image/jpeg", quality)
//             );

//             // Reduce quality or dimensions iteratively if size is larger
//             if (blob.size / 1024 > targetSizeKB) {
//               quality -= 0.1; // Reduce quality
//               if (quality < 0.2) {
//                 // If quality gets too low, scale down the dimensions
//                 width = Math.round(width * 0.9);
//                 height = Math.round(height * 0.9);
//                 quality = 0.8; // Reset quality
//               }
//             }
//           } while (blob.size / 1024 > targetSizeKB);

//           // Resolve with the final compressed file
//           resolve(
//             new File([blob], `${file.name.split(".")[0]}.jpg`, {
//               type: "image/jpeg",
//             })
//           );
//         };
//       };
//       reader.onerror = reject;
//     });
//   };

//   const handleStatutaoryInputChange = (event) => {
//     const { name, value, type, checked } = event.target;

//     setStatutatoryInfo((prevState) => ({
//       ...prevState,
//       [name]: type === "checkbox" ? checked : capitalizeValue(value),
//     }));
//     localStorage.setItem("KycStat", JSON.stringify(statutatoryInfo));
//   };
//   const handleAccInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setAccInfo((prevState) => ({
//       ...prevState,
//       [name]: type === "checkbox" ? checked : capitalizeValue(value),
//     }));
//     localStorage.setItem("KycAcc", JSON.stringify(accInfo));
//   };
//   const handleContactInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setContactInfo((prevState) => ({
//       ...prevState,
//       [name]: type === "checkbox" ? checked : capitalizeValue(value, name),
//     }));
//     localStorage.setItem("KycContact", JSON.stringify(contactInfo));
//   };
//   const handleTradeBusinessInputChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     setTradeBusinessInfo((prevState) => {
//       if (type === "checkbox") {
//         const updatedTradeMetals = checked
//           ? [...prevState.tradeMetals, name]
//           : prevState.tradeMetals.filter((item) => item !== name);
//         return {
//           ...prevState,
//           tradeMetals: updatedTradeMetals,
//         };
//       } else {
//         return {
//           ...prevState,
//           [name]: capitalizeValue(value),
//         };
//       }
//     });
//     localStorage.setItem("KycTrade", JSON.stringify(tradeBusinessInfo));
//   };
//   const handleHallmarkChange = (event) => {
//     const { name, value } = event.target;
//     setHallmarkInfo((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     localStorage.setItem("hallmarkInfo", JSON.stringify(hallmarkInfo));
//   };
//   console.log(contactInfo);
//   const handleFileDelete = (fileType) => {
//     setFilesDatas((prev) => ({ ...prev, [fileType]: null }));
//     setFileDatasUrl((prev) => ({ ...prev, [fileType]: null }));
//   };
//   const handleViewImage = (file, event, editFile) => {
//     if (event) {
//       event.preventDefault();
//     }

//     if (file) {
//       const fileURL = URL.createObjectURL(file);
//       window.open(fileURL, "_blank");

//       setTimeout(() => URL.revokeObjectURL(fileURL), 100);
//     }
//     if (editFile) {
//       console.log(editFile);
//       const sanitizedUrl = editFile.replace(/^"(.*)"$/, "$1"); // Remove surrounding quotes
//       window.open(sanitizedUrl, "_blank");
//     }
//   };
//   const reset = () => {
//     setKycFormData({
//       id: "",
//       supplierCategory: "",
//       companyname: "",
//       doorno: "",
//       street: "",
//       pincode: "",
//       area: "",
//       taluk: "",
//       city: "",
//       state: "",
//       mobilenumber: "",
//       email: "",
//       propritorname: "",
//       organization: "",
//       regUnderMsme: "",
//       // purchasecity: '',
//       // location: '',
//       gst: "",
//       pan: "",
//       msmeNo: "",
//     });
//     //pdf files
//     setFilesDatas({
//       gstFile: null,
//       panFile: null,
//       msmeFile: null,
//       chequeFile: null,
//       ownerFile: null,
//       boFile: null,
//       accountsFile: null,
//     });
//     setFileDatasUrl({
//       gstFile: "",
//       panFile: "",
//       msmeFile: "",
//       chequeFile: "",
//       ownerFile: "",
//       boFile: "",
//       accountsFile: "",
//     });
//     setStatutatoryInfo({
//       tradename: "",
//       readelegalname: "",
//       tradedoorno: "",
//       tradestreet: "",
//       tradearea: "",
//       tradestatecode: "",
//       tradepincode: "",
//       tradeDoI: "",
//     });
//     setAccInfo({
//       acholdername: "",
//       acnumber: "",
//       actype: "",
//       ifsc: "",
//       bankname: "",
//       bankbranchname: "",
//       bankaddress: "",
//     });
//     setContactInfo({
//       owner: "",
//       ownername: "",
//       ownermobile: "",
//       owneremail: "",
//       businessoperation: "",
//       boname: "",
//       bomobile: "",
//       boemail: "",
//       accounts: "",
//       accname: "",
//       accmobile: "",
//       accemail: "",
//     });
//     setTradeBusinessInfo({
//       natureOfBusiness: "",
//       authDistributor: "",
//       retailJeweller: "",
//       maincatogory: "",
//       tradeMetals: [],
//     });
//     setHallmarkInfo({
//       bisLicenseNo: "",
//       certificateValidFrom: "",
//       certificateValidTo: "",
//       hasInsurance: "",
//       insuranceCompany: "",
//       insuranceAmount: "",
//       policyStartDate: "",
//       endorsementDate: "",
//       policyEndDate: "",
//     });
//     setErrors({});
//     setErrorMessage("");
//     setSuccessMsg("");
//     setFileSizes({});
//   };
//   const handleSubmit = async () => {
//     const isValid = validate(kycFormData, filesDatas, fileDatasUrl);
//     if (!isValid) {
//       return { errorMessage: "Validation failed" }; // Exit if validation fails
//     }

//     const formData = new FormData();

//     // Append all KYC form fields
//     // formData.append("UserData",userData)
//     formData.append("SupplierName", user);
//     for (const key in kycFormData) {
//       formData.append(key, kycFormData[key]);
//     }

//     // Append statutatory info
//     for (const key in statutatoryInfo) {
//       formData.append(key, statutatoryInfo[key]);
//     }

//     // Append account info
//     for (const key in accInfo) {
//       formData.append(key, accInfo[key]);
//     }

//     // Append contact info
//     for (const key in contactInfo) {
     
//       formData.append(key, contactInfo[key]);
//     }
//     console.log("..................",userRole);
//     if (userRole.includes("Hallmark")) {
//       for (const key in hallmarkInfo) {
//         console.log(key, hallmarkInfo[key]);
//         formData.append(key, hallmarkInfo[key]);
//       }
//     }
//     // for (const key in contactInfo) {
//     //     formData.append(key, contactInfo[key]);
//     //   }

//     // Append trade business info
//     for (const key in tradeBusinessInfo) {
//       if (Array.isArray(tradeBusinessInfo[key])) {
//         // Append arrays as JSON strings
//         formData.append(key, JSON.stringify(tradeBusinessInfo[key]));
//       } else {
//         formData.append(key, tradeBusinessInfo[key]);
//       }
//     }
//     const filesToSubmit = {
//       gstFile: filesDatas.gstFile || fileDatasUrl.gstFile,
//       panFile: filesDatas.panFile || fileDatasUrl.panFile,
//       msmeFile: filesDatas.msmeFile || fileDatasUrl.msmeFile,
//       chequeFile: filesDatas.chequeFile || fileDatasUrl.chequeFile,
//       ownerFile: filesDatas.ownerFile || fileDatasUrl.ownerFile,
//       boFile: filesDatas.boFile || fileDatasUrl.boFile,
//       accountsFile: filesDatas.accountsFile || fileDatasUrl.accountsFile,
//       bisFile: filesDatas.bisFile || fileDatasUrl.bisFile,
//       insuranceFile: filesDatas.insuranceFile || fileDatasUrl.insuranceFile,
//       quotationFile: filesDatas.quotationFile || fileDatasUrl.quotationFile,
//       authPersonFile: filesDatas.authPersonFile || fileDatasUrl.authPersonFile,
//     };

//     for (const key in filesToSubmit) {
//       if (filesToSubmit[key]) formData.append(key, filesToSubmit[key]);
//     }

//     // Append PDF files
//     // if (filesDatas.gstFile) formData.append('gstFile', filesDatas.gstFile);
//     // if (filesDatas.panFile) formData.append('panFile', filesDatas.panFile);
//     // if (filesDatas.msmeFile) formData.append('msmeFile', filesDatas.msmeFile);
//     // if (filesDatas.chequeFile) formData.append('chequeFile', filesDatas.chequeFile);
//     // if (filesDatas.ownerFile) formData.append('ownerFile', filesDatas.ownerFile);
//     // if (filesDatas.boFile) formData.append('boFile', filesDatas.boFile);
//     // if (filesDatas.accountsFile) formData.append('accountsFile', filesDatas.accountsFile);

//     try {
//       // Send the FormData object to your backend using axios
//       for (let pair of formData.entries()) {
//         console.log(`${pair[0]}: ${pair[1]}`);
//       }
//       console.log(Object.entries(errors));
//       // if(Object.entries(errors)===0){

//       // }
//       const response = await axios.post(
//         `${KYC_API}/kycpost`,
//         formData,

//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (response.status === 200) {
//         // Set success message
//         setSuccessMsg("Data Saved Successfully");
//         setErrorMessage("");
//         // Set a timeout to reload after 5 seconds
//         // setTimeout(() => {
//         //     window.location.reload();
//         // }, 5000);
//         localStorage.removeItem("kycData");
//         localStorage.removeItem("KycStat");
//         localStorage.removeItem("KycAcc");
//         localStorage.removeItem("KycContact");
//         localStorage.removeItem("KycTrade");
//         localStorage.removeItem("hallmarkInfo");

//         reset();
//         return response.data;
//       }
//       console.log("Response:", response.data);
//     } catch (error) {
//       console.error("Error submitting form data:", error);
//       setErrorMessage(error.response.data.message);
//       setSuccessMsg("");
//       return error.response.data;
//     }
//   };
//   console.log(errors);

//   // const handleTradeInformationInputChange=(event)=>{
//   //     const { name, value, type, checked } = event.target;
//   //     setTradeBusinessInfo(prevState => ({
//   //         ...prevState,
//   //         [name]: type === 'checkbox' ? checked : value
//   //     }));
//   // }
//   // console.log(tradeBusinessInfo,contactInfo,kycFormData,statutatoryInfo,accInfo)
//   //validateBusinessInfo
//   return (
//     <KycContext.Provider
//       value={{
//         kycFormData,
//         setKycFormData,
//         handleInputChange,
//         statutatoryInfo,
//         setStatutatoryInfo,
//         handleStatutaoryInputChange,
//         accInfo,
//         setAccInfo,
//         handleAccInputChange,
//         handleContactInputChange,
//         contactInfo,
//         setContactInfo,
//         tradeBusinessInfo,
//         setTradeBusinessInfo,
//         handleTradeBusinessInputChange,
//         filesDatas,
//         setFilesDatas,
//         KYC_API,
//         handleSubmit,
//         handleFileChange,
//         user,
//         userRole,
//         validate,
//         errors,
//         setErrors,
//         validateStatutoryInfo,
//         validateBankingInfo,
//         validateContactInfo,
//         validateTradeInfo,
//         errorMessage,
//         successMsg,
//         userData,
//         handleFileDelete,
//         companyName,
//         handleViewImage,
//         extractPANFromGST,
//         fileSizes,
//         fileDatasUrl,
//         getFileName,
//         hallmarkInfo,
//         setHallmarkInfo,
//         handleHallmarkChange,
//         validateHallmarkInfo,
//       }}
//     >
//       {children}
//     </KycContext.Provider>
//   );
// };

// export { KycDataProvider, KycContext };
import { createContext, useState } from "react";
import axios from "axios";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { useContext } from "react";
import {
  validate,
  validateStatutoryInfo,
  validateBankingInfo,
  validateContactInfo,
  validateTradeInfo,
  validateHallmarkInfo,
} from "../Datas/Validation";
import { useEffect } from "react";
import { KYC_API } from "../../../config/configData";
import { jwtDecode } from "jwt-decode";
import imageCompression from "browser-image-compression";

import BankingInformation from "../components/BankingInformation";
import { nanoid } from "nanoid"; // Add this import

const KycContext = createContext();

const KycDataProvider = ({ children }) => {
  const {
    user,
    userRole,
    userData,
    decryptToken,
    companyName: cmpyName,
  } = useContext(DashBoardContext);
  const [companyName, setCompanyName] = useState("");
  const [userName, setUserName] = useState("");

  const [kycFormData, setKycFormData] = useState({
    Suppcode:'',
    id: "",
    supplierCategory: "",
    companyname: "",
    doorno: "",
    street: "",
    pincode: "",
    area: "",
    taluk: "",
    city: "",
    state: "",
    mobilenumber: "",
    email: "",
    propritorname: "",
    organization: "",
    regUnderMsme: "",
    gst: "",
    pan: "",
    msmeNo: "",
  });

  // PDF files
  const [filesDatas, setFilesDatas] = useState({
    gstFile: null,
    panFile: null,
    msmeFile: null,
    chequeFile: null,
    ownerFile: null,
    boFile: null,
    accountsFile: null,
    bisFile: null,
    insuranceFile: null,
    quotationFile: null,
    authPersonFile: null,
  });

  const [fileDatasUrl, setFileDatasUrl] = useState({
    gstFile: "",
    panFile: "",
    msmeFile: "",
    chequeFile: "",
    ownerFile: "",
    boFile: "",
    accountsFile: "",
    bisFile: "",
    insuranceFile: "",
    quotationFile: "",
    authPersonFile: "",
  });

  const [statutatoryInfo, setStatutatoryInfo] = useState({
    tradename: "",
    readelegalname: "",
    tradedoorno: "",
    tradestreet: "",
    tradearea: "",
    tradestatecode: "",
    tradepincode: "",
    tradeDoI: "",
  });

  const [accInfo, setAccInfo] = useState({
    acholdername: "",
    acnumber: "",
    actype: "",
    ifsc: "",
    bankname: "",
    bankbranchname: "",
    bankaddress: "",
  });

  const [contactInfo, setContactInfo] = useState({
    owner: "",
    ownername: "",
    ownermobile: "",
    owneremail: "",
    businessoperation: "",
    boname: "",
    bomobile: "",
    boemail: "",
    accounts: "",
    accname: "",
    accmobile: "",
    accemail: "",
  });

  const [hallmarkInfo, setHallmarkInfo] = useState({
    bisLicenseNo: "",
    certificateValidFrom: "",
    certificateValidTo: "",
    hasInsurance: "",
    insuranceCompany: "",
    insuranceAmount: "",
    policyStartDate: "",
    endorsementDate: "",
    policyEndDate: "",
  });

  const [tradeBusinessInfo, setTradeBusinessInfo] = useState({
    natureOfBusiness: "",
    authDistributor: "",
    retailJeweller: "",
    maincatogory: "",
    tradeMetals: [],
  });

  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fileSizes, setFileSizes] = useState({});

  // Helper function to rename file with unique ID
 let uniqueId = localStorage.getItem("uniqueId");
if (!uniqueId) {
  uniqueId = nanoid(10);
  localStorage.setItem("uniqueId", uniqueId);
}

  const renameFileWithUniqueId = (file, stateKey) => {
    if (!file) return null;

// console.log(uniqueId,file.name)
    
     // Generates 10-character unique ID
    const fileExtension = file.name.split(".").pop();
    const newFileName = `${uniqueId}_${stateKey}.${fileExtension}`;

    return new File([file], newFileName, { type: file.type });
  };

  function capitalizeValue(value, name = "") {
    if (
      typeof value === "string" &&
      value.length > 0 &&
      !name.includes("email")
    ) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    } else if (
      typeof value === "string" &&
      value.length > 0 &&
      name.includes("email")
    ) {
      return value;
    }
    return value;
  }

  useEffect(() => {
    if (kycFormData.gst) {
      const stateCode = kycFormData.gst.substring(0, 2);
      setStatutatoryInfo((prevState) => ({
        ...prevState,
        tradestatecode: stateCode,
      }));
    }
  }, [kycFormData.gst]);

  // console.log(contactInfo);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const Securedtoken = decryptToken(token);
      const decodedToken = jwtDecode(Securedtoken);
      // console.log(decodedToken);
      const role = decodedToken.role;
      const name = decodedToken.name;
      const companyName = decodedToken.companyName;
      const MobileNo = decodedToken.MobileNo;
      setCompanyName(companyName);
      setUserName(name);
      let supplierCatagories;
      if (role === "Gold-Supplier") {
        supplierCatagories = "Gold";
      }
      if (role === "Diamond-Supplier") {
        supplierCatagories = "Diamond";
      }
      if (role === "Platinum-Supplier") {
        supplierCatagories = "Platinum";
      }
      if (role === "Silver-Supplier") {
        supplierCatagories = "Silver";
      }
      if (role === "GoldHallmark-Supplier") {
        supplierCatagories = "Gold Hallmark";
      }
      if (role === "SilverHallmark-Supplier") {
        supplierCatagories = "Silver Hallmark";
      }
      
      if (role === "Demo-User") {
        supplierCatagories = "Demo";
      }
      // console.log(role)
      setKycFormData((prevState) => ({
        ...prevState,
        companyname: companyName,
        propritorname: name,
        mobilenumber: MobileNo,
        supplierCategory: supplierCatagories,
      }));
    }
  }, []);

  // console.log(companyName, userName);
  // console.log(kycFormData);

  const getFileName = (url) => {
    // console.log(url);
    return url?.split("/").pop();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("token");
        let kycDatasLocal = localStorage.getItem("kycData");
        let kycDatas = JSON.parse(kycDatasLocal);
        let kycStat = localStorage.getItem("KycStat");
        let statutatory = JSON.parse(kycStat);
        let kycAcc = localStorage.getItem("KycAcc");
        let accInfo = JSON.parse(kycAcc);
        let KycContact = localStorage.getItem("KycContact");
        let contactInfo = JSON.parse(KycContact);
        let kycTrade = localStorage.getItem("KycTrade");
        let tradeinfos = JSON.parse(kycTrade);
        let hallmark = localStorage.getItem("hallmarkInfo");
        let hallmarkDatas = JSON.parse(hallmark);

        if (kycDatas) setKycFormData(kycDatas);
        if (statutatory) setStatutatoryInfo(statutatory);
        if (accInfo) setAccInfo(accInfo);
        if (contactInfo) setContactInfo(contactInfo);
        if (tradeinfos) setTradeBusinessInfo(tradeinfos);
        if (hallmarkDatas) setHallmarkInfo(hallmarkDatas);

        const fetchToken = () => {
          token = localStorage.getItem("token");
        };
        if (!token) {
          // console.error("No token found in localStorage");
          fetchToken();
          return;
        }

        const SecuredToken = decryptToken(token);
        const decodedToken = jwtDecode(SecuredToken);
        const companyName = decodedToken.companyName;

        const response = await axios.get(
          `${KYC_API}/geteditdata/${companyName}`
        );
        const data = response.data;
        // console.log(data);

        setKycFormData((prevState) => ({
          ...prevState,
          id: data.id || prevState.id,
          supplierCategory: data.supplierCategory || prevState.supplierCategory,
          companyname: data.SupplierName || prevState.companyname,
          doorno: data.doorno || prevState.doorno,
          street: data.street || prevState.street,
          pincode: data.pincode || prevState.pincode,
          area: data.area || prevState.area,
          taluk: data.taluk || prevState.taluk,
          city: data.city || prevState.city,
          state: data.state || prevState.state,
          mobilenumber: data.mobilenumber || prevState.mobilenumber,
          email: data.email || prevState.email,
          propritorname: data.propritorname || prevState.propritorname,
          organization: data.organization || prevState.organization,
          regUnderMsme: data.regUnderMsme || prevState.regUnderMsme,
          gst: data.gst || prevState.gst,
          pan: data.pan || prevState.pan,
          msmeNo: data.msmeNo || prevState.msmeNo,
        }));

        setStatutatoryInfo((prevState) => ({
          ...prevState,
          tradename: data.tradename || prevState.tradename,
          readelegalname: data.readelegalname || prevState.readelegalname,
          tradedoorno: data.tradedoorno || prevState.tradedoorno,
          tradestreet: data.tradestreet || prevState.tradestreet,
          tradearea: data.tradearea || prevState.tradearea,
          tradestatecode: data.tradestatecode || prevState.tradestatecode,
          tradepincode: data.tradepincode || prevState.tradepincode,
          tradeDoI: data.tradeDoI || prevState.tradeDoI,
        }));

        setAccInfo((prevState) => ({
          ...prevState,
          acholdername: data.acholdername || prevState.acholdername,
          acnumber: data.acnumber || prevState.acnumber,
          actype: data.actype || prevState.actype,
          ifsc: data.ifsc || prevState.ifsc,
          bankname: data.bankname || prevState.bankname,
          bankbranchname: data.bankbranchname || prevState.bankbranchname,
          bankaddress: data.bankaddress || prevState.bankaddress,
        }));

        // console.log(contactInfo);
        setContactInfo((prevState) => ({
          ...prevState,
          owner: data.owner || prevState.owner,
          ownername: data.ownername || prevState.ownername,
          ownermobile: data.ownermobile || prevState.ownermobile,
          owneremail: data.owneremail || prevState.owneremail,
          businessoperation:
            data.businessoperation || prevState.businessoperation,
          boname: data.boname || prevState.boname,
          bomobile: data.bomobile || prevState.bomobile,
          boemail: data.boemail || prevState.boemail,
          accounts: data.accounts || prevState.accounts,
          accname: data.accname || prevState.accname,
          accmobile: data.accmobile || prevState.accmobile,
          accemail: data.accemail || prevState.accemail,
        }));

        if (userRole.includes("Hallmark")) {
          setHallmarkInfo((prevState) => ({
            ...prevState,
            bisLicenseNo: data.bisLicenseNo || prevState.bisLicenseNo,
            certificateValidFrom:
              data.certificateValidFrom || prevState.certificateValidFrom,
            certificateValidTo:
              data.certificateValidTo || prevState.certificateValidTo,
            hasInsurance: data.hasInsurance || prevState.hasInsurance,
            insuranceCompany:
              data.insuranceCompany || prevState.insuranceCompany,
            insuranceAmount: data.insuranceAmount || prevState.insuranceAmount,
            policyStartDate: data.policyStartDate || prevState.policyStartDate,
            endorsementDate: data.endorsementDate || prevState.endorsementDate,
            policyEndDate: data.policyEndDate || prevState.policyEndDate,
          }));
        }

        setTradeBusinessInfo((prevState) => ({
          ...prevState,
          natureOfBusiness: data.natureOfBusiness || prevState.natureOfBusiness,
          authDistributor: data.authDistributor || prevState.authDistributor,
          retailJeweller: data.retailJeweller || prevState.retailJeweller,
          maincatogory: data.maincatogory || prevState.maincatogory,
          tradeMetals: data.tradeMetals || prevState.tradeMetals,
        }));

        setFileDatasUrl({
          gstFile: data?.gstFile?.replace(/^"+|"+$/g, ""),
          panFile: data?.panFile?.replace(/^"+|"+$/g, ""),
          msmeFile: data?.msmeFile?.replace(/^"+|"+$/g, ""),
          chequeFile: data?.chequeFile?.replace(/^"+|"+$/g, ""),
          ownerFile: data?.ownerFile?.replace(/^"+|"+$/g, ""),
          boFile: data?.boFile?.replace(/^"+|"+$/g, ""),
          accountsFile: data?.accountsFile?.replace(/^"+|"+$/g, ""),
          bisFile: data?.bisFile?.replace(/^"+|"+$/g, ""),
          insuranceFile: data?.insuranceFile?.replace(/^"+|"+$/g, ""),
          quotationFile: data?.quotationFile?.replace(/^"+|"+$/g, ""),
          authPersonFile: data?.authPersonFile?.replace(/^"+|"+$/g, ""),
        });
      } catch (error) {
        // console.error("Error fetching KYC data:", error);
      }
    };

    fetchData();
  }, []);

  // console.log(fileDatasUrl);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    // console.log(type, name, value);

    if (name === "gst") {
      // console.log(value);
      const panNumber = extractPANFromGST(value);
      // console.log("Extracted PAN:", panNumber);

      setKycFormData((prevState) => ({
        ...prevState,
        pan: panNumber,
        [name]: type === "checkbox" ? checked : value,
      }));
      localStorage.setItem("kycData", JSON.stringify(kycFormData));
    } else {
      setKycFormData((prevState) => ({
        ...prevState,
        [name]:
          type === "checkbox"
            ? checked
            : name === "email"
            ? value
            : capitalizeValue(value, name),
      }));
      localStorage.setItem("kycData", JSON.stringify(kycFormData));
      // console.log(kycFormData);
    }

    validate(kycFormData, filesDatas, fileDatasUrl);
  };

  const extractPANFromGST = (gstValue) => {
    const panPattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    const panData = gstValue.match(panPattern);
    return panData ? panData[0] : "";
  };

  const compressImage = async (file, targetSizeKB = 100) => {
    let compressedFile = file;
    let quality = 0.9;
    const minQuality = 0.1;

    while (compressedFile.size > targetSizeKB * 1024 && quality >= minQuality) {
      const options = {
        maxSizeMB: targetSizeKB / 1024,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        initialQuality: quality,
      };

      try {
        compressedFile = await imageCompression(compressedFile, options);
        quality -= 0.1;
      } catch (error) {
        // console.error("Error compressing image:", error);
        break;
      }
    }

    return compressedFile;
  };

  // Updated handleFileChange with unique ID generation
  const handleFileChange = async (event) => {
    const { name, files } = event.target;

    if (files && files.length > 0) {
      const originalFile = files[0];
      let processedFile = originalFile;

      // Check file type and process accordingly
      if (originalFile.type.includes("image")) {
        // Compress image and convert to JPG
        processedFile = await compressAndConvertToJPG(originalFile, 300);
      }

      // Rename file with unique ID and state key
      const renamedFile = renameFileWithUniqueId(processedFile, name);

      // Update state with renamed file
      setFilesDatas((prevState) => ({
        ...prevState,
        [name]: renamedFile,
      }));

      setFileSizes((prevSizes) => ({
        ...prevSizes,
        [name]: (renamedFile.size / 1024).toFixed(2),
      }));

      // console.log(`File renamed to: ${renamedFile.name}`);
    }
  };

  // Function to compress and convert image to JPG
  const compressAndConvertToJPG = async (file, targetSizeKB) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
          let quality = 0.8;
          let width = img.width;
          let height = img.height;
          let blob;

          do {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            blob = await new Promise((res) =>
              canvas.toBlob((b) => res(b), "image/jpeg", quality)
            );

            if (blob.size / 1024 > targetSizeKB) {
              quality -= 0.1;
              if (quality < 0.2) {
                width = Math.round(width * 0.9);
                height = Math.round(height * 0.9);
                quality = 0.8;
              }
            }
          } while (blob.size / 1024 > targetSizeKB && quality > 0.1);

          resolve(
            new File([blob], `${file.name.split(".")[0]}.jpg`, {
              type: "image/jpeg",
            })
          );
        };
      };
      reader.onerror = reject;
    });
  };

  const handleStatutaoryInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setStatutatoryInfo((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : capitalizeValue(value),
    }));
    localStorage.setItem("KycStat", JSON.stringify(statutatoryInfo));
  };

  const handleAccInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAccInfo((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : capitalizeValue(value),
    }));
    localStorage.setItem("KycAcc", JSON.stringify(accInfo));
  };

  const handleContactInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setContactInfo((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : capitalizeValue(value, name),
    }));
    localStorage.setItem("KycContact", JSON.stringify(contactInfo));
  };

  const handleTradeBusinessInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTradeBusinessInfo((prevState) => {
      if (type === "checkbox") {
        const updatedTradeMetals = checked
          ? [...prevState.tradeMetals, name]
          : prevState.tradeMetals.filter((item) => item !== name);
        return {
          ...prevState,
          tradeMetals: updatedTradeMetals,
        };
      } else {
        return {
          ...prevState,
          [name]: capitalizeValue(value),
        };
      }
    });
    localStorage.setItem("KycTrade", JSON.stringify(tradeBusinessInfo));
  };

  const handleHallmarkChange = (event) => {
    const { name, value } = event.target;
    setHallmarkInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    localStorage.setItem("hallmarkInfo", JSON.stringify(hallmarkInfo));
  };

  // console.log(contactInfo);

  const handleFileDelete = (fileType) => {
    setFilesDatas((prev) => ({ ...prev, [fileType]: null }));
    setFileDatasUrl((prev) => ({ ...prev, [fileType]: null }));
  };

  const handleViewImage = (file, event, editFile) => {
    if (event) {
      event.preventDefault();
    }

    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileURL), 100);
    }
    if (editFile) {
      // console.log(editFile);
      const sanitizedUrl = editFile.replace(/^"(.*)"$/, "$1");
      window.open(sanitizedUrl, "_blank");
    }
  };

  const reset = () => {
    setKycFormData({
      id: "",
      supplierCategory: "",
      companyname: "",
      doorno: "",
      street: "",
      pincode: "",
      area: "",
      taluk: "",
      city: "",
      state: "",
      mobilenumber: "",
      email: "",
      propritorname: "",
      organization: "",
      regUnderMsme: "",
      gst: "",
      pan: "",
      msmeNo: "",
    });

    setFilesDatas({
      gstFile: null,
      panFile: null,
      msmeFile: null,
      chequeFile: null,
      ownerFile: null,
      boFile: null,
      accountsFile: null,
      bisFile: null,
      insuranceFile: null,
      quotationFile: null,
      authPersonFile: null,
    });

    setFileDatasUrl({
      gstFile: "",
      panFile: "",
      msmeFile: "",
      chequeFile: "",
      ownerFile: "",
      boFile: "",
      accountsFile: "",
      bisFile: "",
      insuranceFile: "",
      quotationFile: "",
      authPersonFile: "",
    });

    setStatutatoryInfo({
      tradename: "",
      readelegalname: "",
      tradedoorno: "",
      tradestreet: "",
      tradearea: "",
      tradestatecode: "",
      tradepincode: "",
      tradeDoI: "",
    });

    setAccInfo({
      acholdername: "",
      acnumber: "",
      actype: "",
      ifsc: "",
      bankname: "",
      bankbranchname: "",
      bankaddress: "",
    });

    setContactInfo({
      owner: "",
      ownername: "",
      ownermobile: "",
      owneremail: "",
      businessoperation: "",
      boname: "",
      bomobile: "",
      boemail: "",
      accounts: "",
      accname: "",
      accmobile: "",
      accemail: "",
    });

    setTradeBusinessInfo({
      natureOfBusiness: "",
      authDistributor: "",
      retailJeweller: "",
      maincatogory: "",
      tradeMetals: [],
    });

    setHallmarkInfo({
      bisLicenseNo: "",
      certificateValidFrom: "",
      certificateValidTo: "",
      hasInsurance: "",
      insuranceCompany: "",
      insuranceAmount: "",
      policyStartDate: "",
      endorsementDate: "",
      policyEndDate: "",
    });

    setErrors({});
    setErrorMessage("");
    setSuccessMsg("");
    setFileSizes({});
  };

  const handleSubmit = async () => {
    const isValid = validate(kycFormData, filesDatas, fileDatasUrl);
    if (!isValid) {
      return { errorMessage: "Validation failed" };
    }

    const formData = new FormData();

    formData.append("SupplierName", user);
    for (const key in kycFormData) {
      formData.append(key, kycFormData[key]);
    }

    for (const key in statutatoryInfo) {
      formData.append(key, statutatoryInfo[key]);
    }

    for (const key in accInfo) {
      formData.append(key, accInfo[key]);
    }

    for (const key in contactInfo) {
      formData.append(key, contactInfo[key]);
    }

    // console.log("..................", userRole);
    if (userRole.includes("Hallmark")) {
      for (const key in hallmarkInfo) {
        // console.log(key, hallmarkInfo[key]);
        formData.append(key, hallmarkInfo[key]);
      }
    }

    for (const key in tradeBusinessInfo) {
      if (Array.isArray(tradeBusinessInfo[key])) {
        formData.append(key, JSON.stringify(tradeBusinessInfo[key]));
      } else {
        formData.append(key, tradeBusinessInfo[key]);
      }
    }

    const filesToSubmit = {
      gstFile: filesDatas.gstFile || fileDatasUrl.gstFile,
      panFile: filesDatas.panFile || fileDatasUrl.panFile,
      msmeFile: filesDatas.msmeFile || fileDatasUrl.msmeFile,
      chequeFile: filesDatas.chequeFile || fileDatasUrl.chequeFile,
      ownerFile: filesDatas.ownerFile || fileDatasUrl.ownerFile,
      boFile: filesDatas.boFile || fileDatasUrl.boFile,
      accountsFile: filesDatas.accountsFile || fileDatasUrl.accountsFile,
      bisFile: filesDatas.bisFile || fileDatasUrl.bisFile,
      insuranceFile: filesDatas.insuranceFile || fileDatasUrl.insuranceFile,
      quotationFile: filesDatas.quotationFile || fileDatasUrl.quotationFile,
      authPersonFile: filesDatas.authPersonFile || fileDatasUrl.authPersonFile,
    };

    for (const key in filesToSubmit) {
      if (filesToSubmit[key]) formData.append(key, filesToSubmit[key]);
    }

    try {
      for (let pair of formData.entries()) {
        // console.log(`${pair[0]}: ${pair[1]}`);
      }
      // console.log(Object.entries(errors));

      const response = await axios.post(`${KYC_API}/kycpost`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccessMsg("Data Saved Successfully");
        setErrorMessage("");

        localStorage.removeItem("kycData");
        localStorage.removeItem("KycStat");
        localStorage.removeItem("KycAcc");
        localStorage.removeItem("KycContact");
        localStorage.removeItem("KycTrade");
        localStorage.removeItem("hallmarkInfo");

        reset();
        return response.data;
      }
      // console.log("Response:", response.data);
    } catch (error) {
      // console.error("Error submitting form data:", error);
      setErrorMessage(error.response.data.message);
      setSuccessMsg("");
      return error.response.data;
    }
  };

  // console.log(errors);

  return (
    <KycContext.Provider
      value={{
        kycFormData,
        setKycFormData,
        handleInputChange,
        statutatoryInfo,
        setStatutatoryInfo,
        handleStatutaoryInputChange,
        accInfo,
        setAccInfo,
        handleAccInputChange,
        handleContactInputChange,
        contactInfo,
        setContactInfo,
        tradeBusinessInfo,
        setTradeBusinessInfo,
        handleTradeBusinessInputChange,
        filesDatas,
        setFilesDatas,
        KYC_API,
        handleSubmit,
        handleFileChange,
        user,
        userRole,
        validate,
        errors,
        setErrors,
        validateStatutoryInfo,
        validateBankingInfo,
        validateContactInfo,
        validateTradeInfo,
        errorMessage,
        successMsg,
        userData,
        handleFileDelete,
        companyName,
        handleViewImage,
        extractPANFromGST,
        fileSizes,
        fileDatasUrl,
        getFileName,
        hallmarkInfo,
        setHallmarkInfo,
        handleHallmarkChange,
        validateHallmarkInfo,
        renameFileWithUniqueId, // Export if needed elsewhere
      }}
    >
      {children}
    </KycContext.Provider>
  );
};

export { KycDataProvider, KycContext };
