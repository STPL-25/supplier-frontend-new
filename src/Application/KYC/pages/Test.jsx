
// import axios from "axios";
// import { useContext, useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { KycContext } from "../KycContext/KycContex";
// import { Card, Typography } from "@material-tailwind/react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { HeaderData } from "../Datas/Data";
// import Checkbox from "@mui/material/Checkbox";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";

// function KycApproval() {
//   const { user, KYC_API, userRole, approvedData, setApprovedData, API } =
//     useContext(KycContext);
//   const [supplierDetails, setSupplierDetails] = useState(() => {
//     const saved = localStorage.getItem("supplier");
//     return saved ? JSON.parse(saved) : "";
//   });
//   const [datas, setDatas] = useState([]);
//   const [openAccordions, setOpenAccordions] = useState(() => {
//     const savedAccordions = localStorage.getItem("openAccordions");
//     return savedAccordions ? JSON.parse(savedAccordions) : [];
//   });
//   const [supplierId, setSupplierId] = useState("");
//   const [isChecked, setIsChecked] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [rejectReason, setRejectReason] = useState("");
//   const [openRejectDialog, setOpenRejectDialog] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isRejected, setIsRejected] = useState(false);

//   // New state for PAN verification
//   const [panVerificationImage, setPanVerificationImage] = useState(null);
//   const [openPanDialog, setOpenPanDialog] = useState(false);
//   const [panVerificationStatus, setPanVerificationStatus] = useState("");
//     console.log("lllllllllllllllllllllllllllll",HeaderData[0]);
//   // const hallmarkInfo=  {
//   //       title: "Hallmark Information",
//   //       fields: {
//   //           'Bis No': "bisLicenseNo",
//   //           'Valid From': "certificateValidFrom",
//   //           'Valid To': "certificateValidTo",
//   //           'Has Insurance': "hasInsurance",
//   //           'Insurance Amount': "insuranceAmount",
//   //           'Policy Start Date': "policyStartDate",
//   //           'Policy Endrosement Date': "endorsementDate",
//   //           'Policy End Date': "policyEndDate",
//   //           'Bis File': "bisFile",
//   //           'Insurance File': "insuranceFile",
//   //           'Quotation File': "quotationFile",
//   //           'Auth Person Details': "authPersonFile",
          
//   //       }
//   //   },
//   const handleCheckboxChange = (e) => {
//     setIsChecked(e.target.checked);
//   };

//   useEffect(() => {
//     localStorage.setItem("openAccordions", JSON.stringify(openAccordions));
//   }, [openAccordions]);

//   useEffect(() => {
//     if (supplierDetails) {
//       localStorage.setItem("supplier", JSON.stringify(supplierDetails));
//     }
//   }, [supplierDetails]);

//   const fetchKycData = async () => {
//     console.log(supplierDetails, userRole);
//     try {
//       if (supplierDetails && userRole) {
//         const encodedUserRole = btoa(userRole);
//         const response = await axios.get(
//           `${KYC_API}/gettingkycdetails/${supplierDetails}/${encodedUserRole}`
//         );
//         console.log(response.data);
//         setDatas(response.data);
//         if (response.data.length > 0) {
//           setSupplierId(response.data[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching KYC data:", error);
//     }
//   };

//   useEffect(() => {
//     if (supplierDetails) {
//       fetchKycData();
//     } else {
//       setOpenAccordions([]);
//       localStorage.removeItem("openAccordions");
//     }
//   }, [supplierDetails]);

//   const fetchSupplierNames = async (userRole) => {
//     try {
//       const response = await axios.post(`${KYC_API}/getsuppliernames`, {
//         userRole: userRole
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching supplier names:", error);
//       throw new Error("Failed to fetch supplier names.");
//     }
//   };

//   const {
//     data: supplierNames,
//     error: supplierError,
//     isLoading: supplierLoading,
//     refetch: refetchSupplierNames,
//   } = useQuery({
//     queryKey: ["supplierNames"],
//     queryFn: () => fetchSupplierNames(userRole),
//     onError: (error) => {
//       console.error("Error in useQuery:", error.message);
//       setErrorMsg(error.message);
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     },
//   });

//   // New PAN verification handling
//   const handlePanImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setPanVerificationImage(file);
//     }
//   };

//   const handlePanVerificationSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("panVerificationImage", panVerificationImage);
//       formData.append("supplierId", supplierId);
//       formData.append("status", panVerificationStatus);
//       formData.append("role", userRole);

//       const response = await axios.post(
//         `${KYC_API}/pan-verification`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSuccessMsg("PAN verification completed successfully");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         setOpenPanDialog(false);
//         // Proceed with verification
//         // handleVerify("Verify");
//       }
//     } catch (error) {
//       setErrorMsg("Failed to complete PAN verification");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const handleVerify = async (action) => {
//     try {
//       console.log(supplierId, action);
//       setIsVerified(true);
//       setIsRejected(false);
//       const response = await axios.put(
//         `${KYC_API}/kycdatachecking/${supplierId}/${action}`
//       );
//       if (response.status === 200) {
//         setSuccessMsg(`${action}ed successfully.`);
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         if (action === "Approve") {
//           const res = await axios.get(`${KYC_API}/approved/sms/${supplierId}`);
//           console.log(res.data);
//         }
//         setSupplierDetails("");
//         setDatas([]);
//         setOpenAccordions([]);
//         setIsChecked(false);
//         setSupplierId("");
//         setIsVerified(false);
//         setRejectReason("");

//         localStorage.removeItem("supplier");
//         localStorage.removeItem("openAccordions");

//         await refetchSupplierNames();
//       } else {
//         setErrorMsg(`Unexpected response: ${response.statusText}`);
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//       }
//       console.log(response.data);
//     } catch (error) {
//       console.error(`Error during ${action}:`, error);
//       setErrorMsg(`Failed to ${action.toLowerCase()} KYC data.`);
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   // Modified handler for A/C Manager verification
//   const handleAccountManagerVerify = () => {
//     if (userRole === "A/C_Manager") {
//       setOpenPanDialog(true);
//     } else {
//       setOpenPanDialog(false);
//     }
//   };

//   const handleReject = async () => {
//     try {
//       console.log(userRole);
//       const encodedUserRole = btoa(userRole);
//       console.log(encodedUserRole);

//       const response = await axios.put(
//         `${KYC_API}/kycdatachecking/${supplierId}/Reject`,
//         { reason: rejectReason, RejectectedBy: encodedUserRole }
//       );
//       if (response.status === 200) {
//         const res = await axios.get(`${KYC_API}/rejected/sms/${supplierId}`);
//         console.log(res.data);
//         setSuccessMsg("Rejected successfully.");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         setSupplierDetails("");
//         setDatas([]);
//         setOpenAccordions([]);
//         setIsChecked(false);
//         setSupplierId("");
//         setIsVerified(false);
//         setIsRejected(false);
//         setRejectReason("");
//         setOpenRejectDialog(false);

//         localStorage.removeItem("supplier");
//         localStorage.removeItem("openAccordions");

//         await refetchSupplierNames();
//       }
//     } catch (error) {
//       console.log(error);
//       setErrorMsg("Failed to reject KYC.");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const toggleAccordion = (index) => {
//     setOpenAccordions((prev) => {
//       const newOpenAccordions = prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index];

//       localStorage.setItem("openAccordions", JSON.stringify(newOpenAccordions));
//       return newOpenAccordions;
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const handleOpenRejectDialog = () => {
//     setOpenRejectDialog(true);
//     setIsRejected(true);
//     setIsVerified(false);
//   };

//   const handleCloseRejectDialog = () => {
//     setOpenRejectDialog(false);
//     setIsRejected(false);
//   };
//   const filteredHeaderData = HeaderData.filter(section => {
//     // Only filter out Hallmark Information section if needed
//     if (section.title === "Hallmark Information") {
//       // Check if supplier category includes hallmark
//       return datas.length > 0 && 
//              datas[0].supplierCategory && 
//              datas[0].supplierCategory.toLowerCase().includes("hallmark");
//     }
//     return true; // Keep all other sections
//   });
//   return (
//     <Card className="h-full w-full p-6" style={{ width: "100%" }}>
//       <h3 className="text-xl flex justify-center font-bold mb-6">
//         <b>KYC Details</b>
//       </h3>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "right" }}
//       >
//         {snackbarSeverity === "success" ? (
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity="success"
//             sx={{ width: "100%" }}
//           >
//             {successMsg}
//           </Alert>
//         ) : (
//           <Alert
//             onClose={handleCloseSnackbar}
//             severity="error"
//             sx={{ width: "100%" }}
//           >
//             {errorMsg}
//           </Alert>
//         )}
//       </Snackbar>

//       <div>
//         {userRole !== "Diamond-Supplier" && (
//           <Autocomplete
//             disablePortal
//             id="combo-box-demo"
//             options={supplierNames || []}
//             getOptionLabel={(option) => option.name || option}
//             value={supplierDetails}
//             onChange={(event, value) => setSupplierDetails(value)}
//             noOptionsText="No supplier data found for KYC verification"
//             sx={{
//               width: 300,
//               margin: "20px auto",
//               borderRadius: "8px",
//               backgroundColor: "#f9f9f9",
//               boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//               "& .MuiAutocomplete-inputRoot": {
//                 padding: "10px",
//               },
//               "& .MuiOutlinedInput-notchedOutline": {
//                 border: "1px solid #ccc",
//               },
//               "&:hover .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#007BFF",
//               },
//               "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
//                 borderColor: "#007BFF",
//                 boxShadow: "0 0 8px rgba(0, 123, 255, 0.25)",
//               },
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Filter By"
//                 variant="outlined"
//                 InputProps={{
//                   ...params.InputProps,
//                   style: {
//                     padding: "8px 12px",
//                   },
//                 }}
//                 InputLabelProps={{
//                   style: {
//                     color: "#555",
//                   },
//                 }}
//               />
//             )}
//           />
//         )}
//       </div>

//       {datas.length > 0 ? (
//         <>
//           <div className="w-full max-w-3xl mx-auto">
//             {filteredHeaderData.map((section, sectionIndex) => (
//               <div key={sectionIndex} className="mb-4 ">
//                 <div
//                   className="accordion-btn flex items-center justify-between mb-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
//                   onClick={() => toggleAccordion(sectionIndex)}
//                 >
//                   <Typography variant="h6" color="white" className="font-bold">
//                     {section.title}
//                   </Typography>
//                 </div>
//                 {openAccordions.includes(sectionIndex) && (
//                   <table className="accordion-content w-full ml-0 min-w-max table-auto text-left mb-4">
//                     <tbody>
//                       {Object.entries(section.fields).map(
//                         ([header, key], rowIndex) => (
//                           <tr key={rowIndex} className="border-b">
//                             <td className="p-4">
//                               <Typography
//                                 variant="h6"
//                                 color="blue-gray"
//                                 className="font-semibold"
//                               >
//                                 {header}
//                               </Typography>
//                             </td>
//                             {datas.map((item, colIndex) => (
//                               <td key={colIndex} className="p-3">
//                                 {item[key] && key.includes("File") ? (
//                                   <>
//                                     <a
//                                       href={
//                                         item[key].startsWith('"') &&
//                                         item[key].endsWith('"')
//                                           ? item[key].slice(1, -1)
//                                           : item[key]
//                                       }
//                                       download
//                                     >
//                                       <button className="px-3 py-1 bg-blue-500 text-white rounded">
//                                         {header}{" "}
//                                       </button>
//                                     </a>
//                                     {key.includes("panFile") &&
//                                       userRole === "A/C_Manager" && (
//                                         <button
//                                           onClick={handleAccountManagerVerify}
//                                           className=" px-3 py-1 ml-2 bg-green-500 text-white rounded"
//                                           disabled={isVerified}
//                                         >
//                                           Pan Status
//                                         </button>
//                                       )}
//                                   </>
//                                 ) : (
//                                   <Typography
//                                     variant="h6"
//                                     color="blue-gray"
//                                     className="font-normal"
//                                     style={{
//                                       maxWidth: "400px",
//                                       textAlign: "center",
//                                     }}
//                                   >
//                                     {item[key] ?? "N/A"}
//                                   </Typography>
//                                 )}
//                               </td>
//                             ))}
//                           </tr>
//                         )
//                       )}
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div className="m-auto mt-5 text-center">
//             {userRole === "Diamond-Purchase" ||
//             userRole === "Gold-Purchase" ||
//             userRole === "Silver-Purchase" ? (
//               <>
//                 <Checkbox
//                   checked={isChecked}
//                   onChange={handleCheckboxChange}
//                   color="primary"
//                 />
//                 <span>Above all records are Checked</span>
//                 <br />
//                 {isChecked && (
//                   <>
//                     <button
//                       onClick={() => handleVerify("Check")}
//                       className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                       disabled={isVerified}
//                     >
//                       Checked
//                     </button>
//                     <button
//                       onClick={handleOpenRejectDialog}
//                       className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
//                       disabled={isRejected}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </>
//             ) : userRole === "A/C_Manager" ? (
//               <>
//                 <Checkbox
//                   checked={isChecked}
//                   onChange={handleCheckboxChange}
//                   color="primary"
//                 />
//                 <span>Above all records are Verified</span>
//                 <br />
//                 {isChecked && (
//                   <>
//                     <button
//                       onClick={() => handleVerify("Verify")}
//                       className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                       disabled={isVerified}
//                     >
//                       Checked
//                     </button>
//                     <button
//                       onClick={handleOpenRejectDialog}
//                       className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
//                       disabled={isRejected}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </>
//             ) : userRole === "Admin" ? (
//               <>
//                 <button
//                   onClick={() => handleVerify("Approve")}
//                   className="sign-up px-4 py-2 bg-green-500 text-white rounded"
//                   disabled={isVerified}
//                 >
//                   Approved
//                 </button>
//                 <button
//                   onClick={handleOpenRejectDialog}
//                   className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
//                   disabled={isRejected}
//                 >
//                   Reject
//                 </button>
//               </>
//             ) : null}
//           </div>
//         </>
//       ) : (
//         <div className="center-data flex items-center justify-center">
//           <p>
//             <span
//               className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium"
//               role="alert"
//             >
//               No Data Found{" "}
//             </span>
//           </p>
//         </div>
//       )}

//       {/* Reject Dialog */}
//       <Dialog
//         open={openRejectDialog && isRejected}
//         onClose={handleCloseRejectDialog}
//       >
//         <DialogTitle>Reject KYC</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Reason for Rejection"
//             fullWidth
//             variant="outlined"
//             value={rejectReason}
//             onChange={(e) => setRejectReason(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseRejectDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleReject} color="primary">
//             Reject
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* PAN Verification Dialog */}
//       <Dialog open={openPanDialog} onClose={() => setOpenPanDialog(false)}>
//         <DialogTitle>PAN Card Verification</DialogTitle>
//         <DialogContent>
//           <div className="space-y-4 p-4">
//             <div>
//               <Typography variant="subtitle1" className="mb-2">
//                 PAN Verification Status
//               </Typography>
//               <select
//                 value={panVerificationStatus}
//                 onChange={(e) => setPanVerificationStatus(e.target.value)}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="">Select Status</option>
//                 <option value="verified">Verified</option>
//                 {/* <option value="invalid">Invalid</option>
//                                 <option value="pending">Pending Further Verification</option> */}
//               </select>
//             </div>
//             <div>
//               <Typography variant="subtitle1" className="mb-2">
//                 Upload PAN Verification Screenshot
//               </Typography>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePanImageUpload}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenPanDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handlePanVerificationSubmit}
//             color="primary"
//             disabled={!panVerificationImage || !panVerificationStatus}
//           >
//             Submit & Verify
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Card>
//   );
// }

// export default KycApproval;

import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { KycContext } from "../KycContext/KycContex";
import { Card, Typography } from "@material-tailwind/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { HeaderData } from "../Datas/Data";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DownloadIcon from "@mui/icons-material/Download";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { Document, Page, pdfjs } from "react-pdf";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function KycApproval() {
  const { KYC_API, userRole, approvedData, setApprovedData, API } =
    useContext(KycContext);
  const { user } = useContext(DashBoardContext);
  console.log("user", user);
  
  const [supplierDetails, setSupplierDetails] = useState(() => {
    const saved = localStorage.getItem("supplier");
    return saved ? JSON.parse(saved) : "";
  });
  const [datas, setDatas] = useState([]);
  const [openAccordions, setOpenAccordions] = useState(() => {
    const savedAccordions = localStorage.getItem("openAccordions");
    return savedAccordions ? JSON.parse(savedAccordions) : [];
  });
  const [supplierId, setSupplierId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [rejectReason, setRejectReason] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  // PAN verification state
  const [panVerificationImage, setPanVerificationImage] = useState(null);
  const [openPanDialog, setOpenPanDialog] = useState(false);
  const [panVerificationStatus, setPanVerificationStatus] = useState("");

  // File viewer state
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState("");
  const [currentFileType, setCurrentFileType] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0); // NEW: Rotation state

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    localStorage.setItem("openAccordions", JSON.stringify(openAccordions));
  }, [openAccordions]);

  useEffect(() => {
    if (supplierDetails) {
      localStorage.setItem("supplier", JSON.stringify(supplierDetails));
    }
  }, [supplierDetails]);

  const fetchKycData = async () => {
    console.log(supplierDetails, userRole);
    try {
      if (supplierDetails && userRole) {
        const encodedUserRole = btoa(userRole);
        const response = await axios.get(
          `${KYC_API}/gettingkycdetails/${supplierDetails}/${encodedUserRole}`
        );
        console.log(response.data);
        setDatas(response.data);
        if (response.data.length > 0) {
          setSupplierId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC data:", error);
    }
  };

  useEffect(() => {
    if (supplierDetails) {
      fetchKycData();
    } else {
      setOpenAccordions([]);
      localStorage.removeItem("openAccordions");
    }
  }, [supplierDetails]);

  const fetchSupplierNames = async (userRole) => {
    try {
      const response = await axios.post(`${KYC_API}/getsuppliernames`, {
        userRole: userRole,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching supplier names:", error);
      throw new Error("Failed to fetch supplier names.");
    }
  };

  const {
    data: supplierNames,
    error: supplierError,
    isLoading: supplierLoading,
    refetch: refetchSupplierNames,
  } = useQuery({
    queryKey: ["supplierNames"],
    queryFn: () => fetchSupplierNames(userRole),
    onError: (error) => {
      console.error("Error in useQuery:", error.message);
      setErrorMsg(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
  });

  // File viewer functions
  const handleViewFile = (fileUrl) => {
    const cleanUrl =
      fileUrl.startsWith('"') && fileUrl.endsWith('"')
        ? fileUrl.slice(1, -1)
        : fileUrl;

    const fileType = cleanUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image";

    setCurrentFileUrl(cleanUrl);
    setCurrentFileType(fileType);
    setFileViewerOpen(true);
    setPageNumber(1);
    setScale(1.0);
    setRotation(0); // NEW: Reset rotation
  };

  const handleCloseFileViewer = () => {
    setFileViewerOpen(false);
    setCurrentFileUrl("");
    setCurrentFileType("");
    setPageNumber(1);
    setScale(1.0);
    setNumPages(null);
    setRotation(0); // NEW: Reset rotation
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  // NEW: Rotation functions
  const rotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const rotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = currentFileUrl;
    link.download = currentFileUrl.split("/").pop();
    link.click();
  };

  // PAN verification handling
  const handlePanImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPanVerificationImage(file);
    }
  };

  const handlePanVerificationSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("panVerificationImage", panVerificationImage);
      formData.append("supplierId", supplierId);
      formData.append("status", panVerificationStatus);
      formData.append("role", userRole);

      const response = await axios.post(
        `${KYC_API}/pan-verification`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMsg("PAN verification completed successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setOpenPanDialog(false);
      }
    } catch (error) {
      setErrorMsg("Failed to complete PAN verification");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleVerify = async (action) => {
    try {
      console.log(supplierId, action);
      setIsVerified(true);
      setIsRejected(false);
      const response = await axios.put(
        `${KYC_API}/kycdatachecking/${supplierId}/${action}/${user}`
      );
      if (response.status === 200) {
        setSuccessMsg(`${action}ed successfully.`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        if (action === "Approve") {
          const res = await axios.get(`${KYC_API}/approved/sms/${supplierId}`);
          console.log(res.data);
        }
        setSupplierDetails("");
        setDatas([]);
        setOpenAccordions([]);
        setIsChecked(false);
        setSupplierId("");
        setIsVerified(false);
        setRejectReason("");
        handleCloseFileViewer();

        localStorage.removeItem("supplier");
        localStorage.removeItem("openAccordions");

        await refetchSupplierNames();
      } else {
        setErrorMsg(`Unexpected response: ${response.statusText}`);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      console.log(response.data);
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      setErrorMsg(`Failed to ${action.toLowerCase()} KYC data.`);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleAccountManagerVerify = () => {
    if (userRole === "A/C_Manager") {
      setOpenPanDialog(true);
    } else {
      setOpenPanDialog(false);
    }
  };

  const handleReject = async () => {
    try {
      console.log(userRole);
      const encodedUserRole = btoa(userRole);
      console.log(encodedUserRole);

      const response = await axios.put(
        `${KYC_API}/kycdatachecking/${supplierId}/Reject/${user}`,
        { reason: rejectReason, RejectectedBy: encodedUserRole }
      );
      if (response.status === 200) {
        const res = await axios.get(`${KYC_API}/rejected/sms/${supplierId}`);
        console.log(res.data);
        setSuccessMsg("Rejected successfully.");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setSupplierDetails("");
        setDatas([]);
        setOpenAccordions([]);
        setIsChecked(false);
        setSupplierId("");
        setIsVerified(false);
        setIsRejected(false);
        setRejectReason("");
        setOpenRejectDialog(false);
        handleCloseFileViewer();

        localStorage.removeItem("supplier");
        localStorage.removeItem("openAccordions");

        await refetchSupplierNames();
      }
    } catch (error) {
      console.log(error);
      setErrorMsg("Failed to reject KYC.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => {
      const newOpenAccordions = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];

      localStorage.setItem(
        "openAccordions",
        JSON.stringify(newOpenAccordions)
      );
      return newOpenAccordions;
    });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
    setIsRejected(true);
    setIsVerified(false);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setIsRejected(false);
  };

  const filteredHeaderData = HeaderData.filter((section) => {
    if (section.title === "Hallmark Information") {
      return (
        datas.length > 0 &&
        datas[0].supplierCategory &&
        datas[0].supplierCategory.toLowerCase().includes("hallmark")
      );
    }
    return true;
  });

  const isPdf =
    currentFileType === "pdf" || currentFileUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left Panel - KYC Details */}
      <div
        style={{
          flex: fileViewerOpen ? "0 0 50%" : "1",
          overflowY: "auto",
          transition: "all 0.3s ease",
          borderRight: fileViewerOpen ? "2px solid #e0e0e0" : "none",
        }}
      >
        <Card className="h-full w-full p-6">
          <h3 className="text-xl flex justify-center font-bold mb-6">
            <b>KYC Details</b>
          </h3>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {snackbarSeverity === "success" ? (
              <Alert
                onClose={handleCloseSnackbar}
                severity="success"
                sx={{ width: "100%" }}
              >
                {successMsg}
              </Alert>
            ) : (
              <Alert
                onClose={handleCloseSnackbar}
                severity="error"
                sx={{ width: "100%" }}
              >
                {errorMsg}
              </Alert>
            )}
          </Snackbar>

          <div>
            {userRole !== "Diamond-Supplier" && (
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={supplierNames || []}
                getOptionLabel={(option) => option.name || option}
                value={supplierDetails}
                onChange={(event, value) => setSupplierDetails(value)}
                noOptionsText="No supplier data found for KYC verification"
                sx={{
                  width: 300,
                  margin: "20px auto",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  "& .MuiAutocomplete-inputRoot": {
                    padding: "10px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#007BFF",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#007BFF",
                    boxShadow: "0 0 8px rgba(0, 123, 255, 0.25)",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Filter By"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        padding: "8px 12px",
                      },
                    }}
                    InputLabelProps={{
                      style: {
                        color: "#555",
                      },
                    }}
                  />
                )}
              />
            )}
          </div>

          {datas.length > 0 ? (
            <>
              <div className="w-full max-w-3xl mx-auto">
                {filteredHeaderData.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-4 ">
                    <div
                      className="accordion-btn flex items-center justify-between mb-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
                      onClick={() => toggleAccordion(sectionIndex)}
                    >
                      <Typography
                        variant="h6"
                        color="white"
                        className="font-bold"
                      >
                        {section.title}
                      </Typography>
                    </div>
                    {openAccordions.includes(sectionIndex) && (
                      <table className="accordion-content w-full ml-0 min-w-max table-auto text-left mb-4">
                        <tbody>
                          {Object.entries(section.fields).map(
                            ([header, key], rowIndex) => (
                              <tr key={rowIndex} className="border-b">
                                <td className="p-4">
                                  <Typography
                                    variant="h6"
                                    color="blue-gray"
                                    className="font-semibold"
                                  >
                                    {header}
                                  </Typography>
                                </td>
                                {datas.map((item, colIndex) => (
                                  <td key={colIndex} className="p-3">
                                    {item[key] && key.includes("File") ? (
                                      <div className="flex gap-2 items-center">
                                        <a
                                          href={
                                            item[key].startsWith('"') &&
                                            item[key].endsWith('"')
                                              ? item[key].slice(1, -1)
                                              : item[key]
                                          }
                                          download
                                        >
                                          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                            Download
                                          </button>
                                        </a>
                                        <button
                                          onClick={() =>
                                            handleViewFile(item[key])
                                          }
                                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                        >
                                          View
                                        </button>
                                        {key.includes("panFile") &&
                                          userRole === "A/C_Manager" && (
                                            <button
                                              onClick={
                                                handleAccountManagerVerify
                                              }
                                              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                                              disabled={isVerified}
                                            >
                                              Pan Status
                                            </button>
                                          )}
                                      </div>
                                    ) : (
                                      <Typography
                                        variant="h6"
                                        color="blue-gray"
                                        className="font-normal"
                                        style={{
                                          maxWidth: "400px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {item[key] ?? "N/A"}
                                      </Typography>
                                    )}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>

              <div className="m-auto mt-5 text-center">
                {userRole === "Diamond-Purchase" ||
                userRole === "Gold-Purchase" ||
                userRole === "Silver-Purchase" ? (
                  <>
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                    <span>Above all records are Checked</span>
                    <br />
                    {isChecked && (
                      <>
                        <button
                          onClick={() => handleVerify("Check")}
                          className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
                          disabled={isVerified}
                        >
                          Checked
                        </button>
                        <button
                          onClick={handleOpenRejectDialog}
                          className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
                          disabled={isRejected}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </>
                ) : userRole === "A/C_Manager" ? (
                  <>
                    <Checkbox
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                    <span>Above all records are Verified</span>
                    <br />
                    {isChecked && (
                      <>
                        <button
                          onClick={() => handleVerify("Verify")}
                          className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
                          disabled={isVerified}
                        >
                          Checked
                        </button>
                        <button
                          onClick={handleOpenRejectDialog}
                          className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
                          disabled={isRejected}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </>
                ) : userRole === "Admin" ? (
                  <>
                    <button
                      onClick={() => handleVerify("Approve")}
                      className="sign-up px-4 py-2 bg-green-500 text-white rounded"
                      disabled={isVerified}
                    >
                      Approved
                    </button>
                    <button
                      onClick={handleOpenRejectDialog}
                      className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
                      disabled={isRejected}
                    >
                      Reject
                    </button>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            <div className="center-data flex items-center justify-center">
              <p>
                <span
                  className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium"
                  role="alert"
                >
                  No Data Found{" "}
                </span>
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Right Panel - File Viewer */}
      {fileViewerOpen && (
        <div
          style={{
            flex: "0 0 50%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f5f5f5",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
              {isPdf ? "PDF Viewer" : "Image Viewer"}
            </h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <IconButton
                onClick={handleDownloadFile}
                style={{ color: "white" }}
                title="Download"
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                onClick={handleCloseFileViewer}
                style={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          {/* Controls */}
          {isPdf && (
            <div
              style={{
                backgroundColor: "#e0e0e0",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                flexWrap: "wrap",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconButton
                  onClick={zoomOut}
                  disabled={scale <= 0.5}
                  size="small"
                >
                  <ZoomOutIcon />
                </IconButton>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {Math.round(scale * 100)}%
                </span>
                <IconButton
                  onClick={zoomIn}
                  disabled={scale >= 3.0}
                  size="small"
                >
                  <ZoomInIcon />
                </IconButton>
              </div>
              <div
                style={{
                  borderLeft: "1px solid #999",
                  height: "24px",
                }}
              ></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconButton
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  size="small"
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "100px",
                    textAlign: "center",
                  }}
                >
                  Page {pageNumber} of {numPages || "--"}
                </span>
                <IconButton
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  size="small"
                >
                  <NavigateNextIcon />
                </IconButton>
              </div>
            </div>
          )}

          {/* NEW: Image zoom and rotation controls */}
          {!isPdf && (
            <div
              style={{
                backgroundColor: "#e0e0e0",
                padding: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                borderBottom: "1px solid #ccc",
              }}
            >
              {/* Zoom Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
                  <ZoomOutIcon />
                </IconButton>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {Math.round(scale * 100)}%
                </span>
                <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
                  <ZoomInIcon />
                </IconButton>
              </div>
              
              {/* Divider */}
              <div
                style={{
                  borderLeft: "1px solid #999",
                  height: "24px",
                }}
              ></div>
              
              {/* NEW: Rotation Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <IconButton 
                  onClick={rotateLeft} 
                  size="small"
                  title="Rotate Left 90°"
                >
                  <RotateLeftIcon />
                </IconButton>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    minWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  {rotation}°
                </span>
                <IconButton 
                  onClick={rotateRight} 
                  size="small"
                  title="Rotate Right 90°"
                >
                  <RotateRightIcon />
                </IconButton>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              backgroundColor: "#f5f5f5",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                minHeight: "100%",
              }}
            >
              {isPdf ? (
                <Document
                  file={currentFileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div style={{ textAlign: "center", padding: "32px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          border: "4px solid #f3f3f3",
                          borderTop: "4px solid #1976d2",
                          borderRadius: "50%",
                          margin: "0 auto",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <p style={{ marginTop: "16px", color: "#666" }}>
                        Loading PDF...
                      </p>
                    </div>
                  }
                  error={
                    <div style={{ textAlign: "center", padding: "32px" }}>
                      <p
                        style={{
                          color: "#d32f2f",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        Failed to load PDF file.
                      </p>
                      <p style={{ color: "#666", marginTop: "8px" }}>
                        Please check the file URL or try downloading it.
                      </p>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                  />
                </Document>
              ) : (
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    padding: "16px",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={currentFileUrl}
                    alt="Document"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      transform: `scale(${scale}) rotate(${rotation}deg)`, // NEW: Combined scale and rotation
                      transformOrigin: "center center",
                      transition: "transform 0.3s ease-in-out", // NEW: Smooth animation
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `
                        <div style="text-align: center; padding: 32px;">
                          <p style="color: #d32f2f; font-weight: 600;">Failed to load image</p>
                          <p style="color: #666; margin-top: 8px;">The image could not be displayed</p>
                        </div>
                      `;
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog && isRejected}
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle>Reject KYC</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="primary"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* PAN Verification Dialog */}
      <Dialog open={openPanDialog} onClose={() => setOpenPanDialog(false)}>
        <DialogTitle>PAN Card Verification</DialogTitle>
        <DialogContent>
          <div className="space-y-4 p-4">
            <div>
              <Typography variant="subtitle1" className="mb-2 font-semibold">
                PAN Verification Status
              </Typography>
              <select
                value={panVerificationStatus}
                onChange={(e) => setPanVerificationStatus(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="verified">Verified</option>
                <option value="invalid">Invalid</option>
                <option value="pending">Pending Further Verification</option>
              </select>
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-2 font-semibold">
                Upload PAN Verification Screenshot
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handlePanImageUpload}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {panVerificationImage && (
                <p className="mt-2 text-sm text-green-600">
                  File selected: {panVerificationImage.name}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPanDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handlePanVerificationSubmit}
            color="primary"
            disabled={!panVerificationImage || !panVerificationStatus}
          >
            Submit & Verify
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .flex-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}

export default KycApproval;

// import axios from "axios";
// import { useContext, useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { KycContext } from "../KycContext/KycContex";
// import { Card, Typography } from "@material-tailwind/react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import { HeaderData } from "../Datas/Data";
// import Checkbox from "@mui/material/Checkbox";
// import Alert from "@mui/material/Alert";
// import Snackbar from "@mui/material/Snackbar";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
// import ZoomInIcon from "@mui/icons-material/ZoomIn";
// import ZoomOutIcon from "@mui/icons-material/ZoomOut";
// import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// import DownloadIcon from "@mui/icons-material/Download";
// import { Document, Page, pdfjs } from "react-pdf";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// // Configure PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// function KycApproval() {
//   const {  KYC_API, userRole, approvedData, setApprovedData, API } =
//     useContext(KycContext);
//     const {user}=useContext(DashBoardContext)
//     console.log("user",user)
//   const [supplierDetails, setSupplierDetails] = useState(() => {
//     const saved = localStorage.getItem("supplier");
//     return saved ? JSON.parse(saved) : "";
//   });
//   const [datas, setDatas] = useState([]);
//   const [openAccordions, setOpenAccordions] = useState(() => {
//     const savedAccordions = localStorage.getItem("openAccordions");
//     return savedAccordions ? JSON.parse(savedAccordions) : [];
//   });
//   const [supplierId, setSupplierId] = useState("");
//   const [isChecked, setIsChecked] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [errorMsg, setErrorMsg] = useState("");
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
//   const [rejectReason, setRejectReason] = useState("");
//   const [openRejectDialog, setOpenRejectDialog] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [isRejected, setIsRejected] = useState(false);

//   // PAN verification state
//   const [panVerificationImage, setPanVerificationImage] = useState(null);
//   const [openPanDialog, setOpenPanDialog] = useState(false);
//   const [panVerificationStatus, setPanVerificationStatus] = useState("");

//   // File viewer state
//   const [fileViewerOpen, setFileViewerOpen] = useState(false);
//   const [currentFileUrl, setCurrentFileUrl] = useState("");
//   const [currentFileType, setCurrentFileType] = useState("");
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [scale, setScale] = useState(1.0);

//   const handleCheckboxChange = (e) => {
//     setIsChecked(e.target.checked);
//   };

//   useEffect(() => {
//     localStorage.setItem("openAccordions", JSON.stringify(openAccordions));
//   }, [openAccordions]);

//   useEffect(() => {
//     if (supplierDetails) {
//       localStorage.setItem("supplier", JSON.stringify(supplierDetails));
//     }
//   }, [supplierDetails]);

//   const fetchKycData = async () => {
//     console.log(supplierDetails, userRole);
//     try {
//       if (supplierDetails && userRole) {
//         const encodedUserRole = btoa(userRole);
//         const response = await axios.get(
//           `${KYC_API}/gettingkycdetails/${supplierDetails}/${encodedUserRole}`
//         );
//         console.log(response.data);
//         setDatas(response.data);
//         if (response.data.length > 0) {
//           setSupplierId(response.data[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching KYC data:", error);
//     }
//   };

//   useEffect(() => {
//     if (supplierDetails) {
//       fetchKycData();
//     } else {
//       setOpenAccordions([]);
//       localStorage.removeItem("openAccordions");
//     }
//   }, [supplierDetails]);

//   const fetchSupplierNames = async (userRole) => {
//     try {
//       const response = await axios.post(`${KYC_API}/getsuppliernames`, {
//         userRole: userRole,
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching supplier names:", error);
//       throw new Error("Failed to fetch supplier names.");
//     }
//   };

//   const {
//     data: supplierNames,
//     error: supplierError,
//     isLoading: supplierLoading,
//     refetch: refetchSupplierNames,
//   } = useQuery({
//     queryKey: ["supplierNames"],
//     queryFn: () => fetchSupplierNames(userRole),
//     onError: (error) => {
//       console.error("Error in useQuery:", error.message);
//       setErrorMsg(error.message);
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     },
//   });

//   // File viewer functions
//   const handleViewFile = (fileUrl) => {
//     const cleanUrl =
//       fileUrl.startsWith('"') && fileUrl.endsWith('"')
//         ? fileUrl.slice(1, -1)
//         : fileUrl;

//     const fileType = cleanUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image";

//     setCurrentFileUrl(cleanUrl);
//     setCurrentFileType(fileType);
//     setFileViewerOpen(true);
//     setPageNumber(1);
//     setScale(1.0);
//   };

//   const handleCloseFileViewer = () => {
//     setFileViewerOpen(false);
//     setCurrentFileUrl("");
//     setCurrentFileType("");
//     setPageNumber(1);
//     setScale(1.0);
//     setNumPages(null);
//   };

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//     setPageNumber(1);
//   };

//   const goToPrevPage = () => {
//     setPageNumber((prev) => Math.max(prev - 1, 1));
//   };

//   const goToNextPage = () => {
//     setPageNumber((prev) => Math.min(prev + 1, numPages));
//   };

//   const zoomIn = () => {
//     setScale((prev) => Math.min(prev + 0.2, 3.0));
//   };

//   const zoomOut = () => {
//     setScale((prev) => Math.max(prev - 0.2, 0.5));
//   };

//   const handleDownloadFile = () => {
//     const link = document.createElement("a");
//     link.href = currentFileUrl;
//     link.download = currentFileUrl.split("/").pop();
//     link.click();
//   };

//   // PAN verification handling
//   const handlePanImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setPanVerificationImage(file);
//     }
//   };

//   const handlePanVerificationSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("panVerificationImage", panVerificationImage);
//       formData.append("supplierId", supplierId);
//       formData.append("status", panVerificationStatus);
//       formData.append("role", userRole);


//       const response = await axios.post(
//         `${KYC_API}/pan-verification`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         setSuccessMsg("PAN verification completed successfully");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         setOpenPanDialog(false);
//       }
//     } catch (error) {
//       setErrorMsg("Failed to complete PAN verification");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const handleVerify = async (action) => {
//     try {
//       console.log(supplierId, action);
//       setIsVerified(true);
//       setIsRejected(false);
//       const response = await axios.put(
//         `${KYC_API}/kycdatachecking/${supplierId}/${action}/${user}`
//       );
//       if (response.status === 200) {
//         setSuccessMsg(`${action}ed successfully.`);
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         if (action === "Approve") {
//           const res = await axios.get(`${KYC_API}/approved/sms/${supplierId}`);
//           console.log(res.data);
//         }
//         setSupplierDetails("");
//         setDatas([]);
//         setOpenAccordions([]);
//         setIsChecked(false);
//         setSupplierId("");
//         setIsVerified(false);
//         setRejectReason("");
//         handleCloseFileViewer();

//         localStorage.removeItem("supplier");
//         localStorage.removeItem("openAccordions");

//         await refetchSupplierNames();
//       } else {
//         setErrorMsg(`Unexpected response: ${response.statusText}`);
//         setSnackbarSeverity("error");
//         setOpenSnackbar(true);
//       }
//       console.log(response.data);
//     } catch (error) {
//       console.error(`Error during ${action}:`, error);
//       setErrorMsg(`Failed to ${action.toLowerCase()} KYC data.`);
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const handleAccountManagerVerify = () => {
//     if (userRole === "A/C_Manager") {
//       setOpenPanDialog(true);
//     } else {
//       setOpenPanDialog(false);
//     }
//   };

//   const handleReject = async () => {
//     try {
//       console.log(userRole);
//       const encodedUserRole = btoa(userRole);
//       console.log(encodedUserRole);

//       const response = await axios.put(
//         `${KYC_API}/kycdatachecking/${supplierId}/Reject/${user}`,
//         { reason: rejectReason, RejectectedBy: encodedUserRole }
//       );
//       if (response.status === 200) {
//         const res = await axios.get(`${KYC_API}/rejected/sms/${supplierId}`);
//         console.log(res.data);
//         setSuccessMsg("Rejected successfully.");
//         setSnackbarSeverity("success");
//         setOpenSnackbar(true);
//         setSupplierDetails("");
//         setDatas([]);
//         setOpenAccordions([]);
//         setIsChecked(false);
//         setSupplierId("");
//         setIsVerified(false);
//         setIsRejected(false);
//         setRejectReason("");
//         setOpenRejectDialog(false);
//         handleCloseFileViewer();

//         localStorage.removeItem("supplier");
//         localStorage.removeItem("openAccordions");

//         await refetchSupplierNames();
//       }
//     } catch (error) {
//       console.log(error);
//       setErrorMsg("Failed to reject KYC.");
//       setSnackbarSeverity("error");
//       setOpenSnackbar(true);
//     }
//   };

//   const toggleAccordion = (index) => {
//     setOpenAccordions((prev) => {
//       const newOpenAccordions = prev.includes(index)
//         ? prev.filter((i) => i !== index)
//         : [...prev, index];

//       localStorage.setItem(
//         "openAccordions",
//         JSON.stringify(newOpenAccordions)
//       );
//       return newOpenAccordions;
//     });
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   const handleOpenRejectDialog = () => {
//     setOpenRejectDialog(true);
//     setIsRejected(true);
//     setIsVerified(false);
//   };

//   const handleCloseRejectDialog = () => {
//     setOpenRejectDialog(false);
//     setIsRejected(false);
//   };

//   const filteredHeaderData = HeaderData.filter((section) => {
//     if (section.title === "Hallmark Information") {
//       return (
//         datas.length > 0 &&
//         datas[0].supplierCategory &&
//         datas[0].supplierCategory.toLowerCase().includes("hallmark")
//       );
//     }
//     return true;
//   });

//   const isPdf =
//     currentFileType === "pdf" || currentFileUrl?.toLowerCase().endsWith(".pdf");

//   return (
//     <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
//       {/* Left Panel - KYC Details */}
//       <div
//         style={{
//           flex: fileViewerOpen ? "0 0 50%" : "1",
//           overflowY: "auto",
//           transition: "all 0.3s ease",
//           borderRight: fileViewerOpen ? "2px solid #e0e0e0" : "none",
//         }}
//       >
//         <Card className="h-full w-full p-6">
//           <h3 className="text-xl flex justify-center font-bold mb-6">
//             <b>KYC Details</b>
//           </h3>

//           <Snackbar
//             open={openSnackbar}
//             autoHideDuration={6000}
//             onClose={handleCloseSnackbar}
//             anchorOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             {snackbarSeverity === "success" ? (
//               <Alert
//                 onClose={handleCloseSnackbar}
//                 severity="success"
//                 sx={{ width: "100%" }}
//               >
//                 {successMsg}
//               </Alert>
//             ) : (
//               <Alert
//                 onClose={handleCloseSnackbar}
//                 severity="error"
//                 sx={{ width: "100%" }}
//               >
//                 {errorMsg}
//               </Alert>
//             )}
//           </Snackbar>

//           <div>
//             {userRole !== "Diamond-Supplier" && (
//               <Autocomplete
//                 disablePortal
//                 id="combo-box-demo"
//                 options={supplierNames || []}
//                 getOptionLabel={(option) => option.name || option}
//                 value={supplierDetails}
//                 onChange={(event, value) => setSupplierDetails(value)}
//                 noOptionsText="No supplier data found for KYC verification"
//                 sx={{
//                   width: 300,
//                   margin: "20px auto",
//                   borderRadius: "8px",
//                   backgroundColor: "#f9f9f9",
//                   boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
//                   "& .MuiAutocomplete-inputRoot": {
//                     padding: "10px",
//                   },
//                   "& .MuiOutlinedInput-notchedOutline": {
//                     border: "1px solid #ccc",
//                   },
//                   "&:hover .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "#007BFF",
//                   },
//                   "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
//                     borderColor: "#007BFF",
//                     boxShadow: "0 0 8px rgba(0, 123, 255, 0.25)",
//                   },
//                 }}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     label="Filter By"
//                     variant="outlined"
//                     InputProps={{
//                       ...params.InputProps,
//                       style: {
//                         padding: "8px 12px",
//                       },
//                     }}
//                     InputLabelProps={{
//                       style: {
//                         color: "#555",
//                       },
//                     }}
//                   />
//                 )}
//               />
//             )}
//           </div>

//           {datas.length > 0 ? (
//             <>
//               <div className="w-full max-w-3xl mx-auto">
//                 {filteredHeaderData.map((section, sectionIndex) => (
//                   <div key={sectionIndex} className="mb-4 ">
//                     <div
//                       className="accordion-btn flex items-center justify-between mb-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"
//                       onClick={() => toggleAccordion(sectionIndex)}
//                     >
//                       <Typography
//                         variant="h6"
//                         color="white"
//                         className="font-bold"
//                       >
//                         {section.title}
//                       </Typography>
//                     </div>
//                     {openAccordions.includes(sectionIndex) && (
//                       <table className="accordion-content w-full ml-0 min-w-max table-auto text-left mb-4">
//                         <tbody>
//                           {Object.entries(section.fields).map(
//                             ([header, key], rowIndex) => (
//                               <tr key={rowIndex} className="border-b">
//                                 <td className="p-4">
//                                   <Typography
//                                     variant="h6"
//                                     color="blue-gray"
//                                     className="font-semibold"
//                                   >
//                                     {header}
//                                   </Typography>
//                                 </td>
//                                 {datas.map((item, colIndex) => (
//                                   <td key={colIndex} className="p-3">
//                                     {item[key] && key.includes("File") ? (
//                                       <div className="flex gap-2 items-center">
//                                         <a
//                                           href={
//                                             item[key].startsWith('"') &&
//                                             item[key].endsWith('"')
//                                               ? item[key].slice(1, -1)
//                                               : item[key]
//                                           }
//                                           download
//                                         >
//                                           <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
//                                             Download
//                                           </button>
//                                         </a>
//                                         <button
//                                           onClick={() =>
//                                             handleViewFile(item[key])
//                                           }
//                                           className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
//                                         >
//                                           View
//                                         </button>
//                                         {key.includes("panFile") &&
//                                           userRole === "A/C_Manager" && (
//                                             <button
//                                               onClick={
//                                                 handleAccountManagerVerify
//                                               }
//                                               className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
//                                               disabled={isVerified}
//                                             >
//                                               Pan Status
//                                             </button>
//                                           )}
//                                       </div>
//                                     ) : (
//                                       <Typography
//                                         variant="h6"
//                                         color="blue-gray"
//                                         className="font-normal"
//                                         style={{
//                                           maxWidth: "400px",
//                                           textAlign: "center",
//                                         }}
//                                       >
//                                         {item[key] ?? "N/A"}
//                                       </Typography>
//                                     )}
//                                   </td>
//                                 ))}
//                               </tr>
//                             )
//                           )}
//                         </tbody>
//                       </table>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="m-auto mt-5 text-center">
//                 {userRole === "Diamond-Purchase" ||
//                 userRole === "Gold-Purchase" ||
//                 userRole === "Silver-Purchase" ? (
//                   <>
//                     <Checkbox
//                       checked={isChecked}
//                       onChange={handleCheckboxChange}
//                       color="primary"
//                     />
//                     <span>Above all records are Checked</span>
//                     <br />
//                     {isChecked && (
//                       <>
//                         <button
//                           onClick={() => handleVerify("Check")}
//                           className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                           disabled={isVerified}
//                         >
//                           Checked
//                         </button>
//                         <button
//                           onClick={handleOpenRejectDialog}
//                           className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
//                           disabled={isRejected}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </>
//                 ) : userRole === "A/C_Manager" ? (
//                   <>
//                     <Checkbox
//                       checked={isChecked}
//                       onChange={handleCheckboxChange}
//                       color="primary"
//                     />
//                     <span>Above all records are Verified</span>
//                     <br />
//                     {isChecked && (
//                       <>
//                         <button
//                           onClick={() => handleVerify("Verify")}
//                           className="sign-up mt-2 px-4 py-2 bg-green-500 text-white rounded"
//                           disabled={isVerified}
//                         >
//                           Checked
//                         </button>
//                         <button
//                           onClick={handleOpenRejectDialog}
//                           className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
//                           disabled={isRejected}
//                         >
//                           Reject
//                         </button>
//                       </>
//                     )}
//                   </>
//                 ) : userRole === "Admin" ? (
//                   <>
//                     <button
//                       onClick={() => handleVerify("Approve")}
//                       className="sign-up px-4 py-2 bg-green-500 text-white rounded"
//                       disabled={isVerified}
//                     >
//                       Approved
//                     </button>
//                     <button
//                       onClick={handleOpenRejectDialog}
//                       className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2"
//                       disabled={isRejected}
//                     >
//                       Reject
//                     </button>
//                   </>
//                 ) : null}
//               </div>
//             </>
//           ) : (
//             <div className="center-data flex items-center justify-center">
//               <p>
//                 <span
//                   className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium"
//                   role="alert"
//                 >
//                   No Data Found{" "}
//                 </span>
//               </p>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Right Panel - File Viewer */}
//       {fileViewerOpen && (
//         <div
//           style={{
//             flex: "0 0 50%",
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#f5f5f5",
//             animation: "slideIn 0.3s ease-out",
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               backgroundColor: "#1976d2",
//               color: "white",
//               padding: "16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//             }}
//           >
//             <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
//               {isPdf ? "PDF Viewer" : "Image Viewer"}
//             </h3>
//             <div style={{ display: "flex", gap: "8px" }}>
//               <IconButton
//                 onClick={handleDownloadFile}
//                 style={{ color: "white" }}
//                 title="Download"
//               >
//                 <DownloadIcon />
//               </IconButton>
//               <IconButton
//                 onClick={handleCloseFileViewer}
//                 style={{ color: "white" }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </div>
//           </div>

//           {/* Controls */}
//           {isPdf && (
//             <div
//               style={{
//                 backgroundColor: "#e0e0e0",
//                 padding: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "16px",
//                 flexWrap: "wrap",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <IconButton
//                   onClick={zoomOut}
//                   disabled={scale <= 0.5}
//                   size="small"
//                 >
//                   <ZoomOutIcon />
//                 </IconButton>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     minWidth: "50px",
//                     textAlign: "center",
//                   }}
//                 >
//                   {Math.round(scale * 100)}%
//                 </span>
//                 <IconButton
//                   onClick={zoomIn}
//                   disabled={scale >= 3.0}
//                   size="small"
//                 >
//                   <ZoomInIcon />
//                 </IconButton>
//               </div>
//               <div
//                 style={{
//                   borderLeft: "1px solid #999",
//                   height: "24px",
//                 }}
//               ></div>
//               <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                 <IconButton
//                   onClick={goToPrevPage}
//                   disabled={pageNumber <= 1}
//                   size="small"
//                 >
//                   <NavigateBeforeIcon />
//                 </IconButton>
//                 <span
//                   style={{
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     minWidth: "100px",
//                     textAlign: "center",
//                   }}
//                 >
//                   Page {pageNumber} of {numPages || "--"}
//                 </span>
//                 <IconButton
//                   onClick={goToNextPage}
//                   disabled={pageNumber >= numPages}
//                   size="small"
//                 >
//                   <NavigateNextIcon />
//                 </IconButton>
//               </div>
//             </div>
//           )}

//           {/* Image zoom controls */}
//           {!isPdf && (
//             <div
//               style={{
//                 backgroundColor: "#e0e0e0",
//                 padding: "12px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "16px",
//                 borderBottom: "1px solid #ccc",
//               }}
//             >
//               <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
//                 <ZoomOutIcon />
//               </IconButton>
//               <span
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   minWidth: "50px",
//                   textAlign: "center",
//                 }}
//               >
//                 {Math.round(scale * 100)}%
//               </span>
//               <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
//                 <ZoomInIcon />
//               </IconButton>
//             </div>
//           )}

//           {/* Content Area */}
//           <div
//             style={{
//               flex: 1,
//               overflowY: "auto",
//               backgroundColor: "#f5f5f5",
//               padding: "16px",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 minHeight: "100%",
//               }}
//             >
//               {isPdf ? (
//                 <Document
//                   file={currentFileUrl}
//                   onLoadSuccess={onDocumentLoadSuccess}
//                   loading={
//                     <div style={{ textAlign: "center", padding: "32px" }}>
//                       <div
//                         style={{
//                           width: "48px",
//                           height: "48px",
//                           border: "4px solid #f3f3f3",
//                           borderTop: "4px solid #1976d2",
//                           borderRadius: "50%",
//                           margin: "0 auto",
//                           animation: "spin 1s linear infinite",
//                         }}
//                       ></div>
//                       <p style={{ marginTop: "16px", color: "#666" }}>
//                         Loading PDF...
//                       </p>
//                     </div>
//                   }
//                   error={
//                     <div style={{ textAlign: "center", padding: "32px" }}>
//                       <p
//                         style={{
//                           color: "#d32f2f",
//                           fontWeight: "600",
//                           fontSize: "16px",
//                         }}
//                       >
//                         Failed to load PDF file.
//                       </p>
//                       <p style={{ color: "#666", marginTop: "8px" }}>
//                         Please check the file URL or try downloading it.
//                       </p>
//                     </div>
//                   }
//                 >
//                   <Page
//                     pageNumber={pageNumber}
//                     scale={scale}
//                     renderTextLayer={true}
//                     renderAnnotationLayer={true}
//                     style={{ boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
//                   />
//                 </Document>
//               ) : (
//                 <div
//                   style={{
//                     backgroundColor: "white",
//                     borderRadius: "8px",
//                     boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                     padding: "16px",
//                     display: "inline-block",
//                   }}
//                 >
//                   <img
//                     src={currentFileUrl}
//                     alt="Document"
//                     style={{
//                       maxWidth: "100%",
//                       height: "auto",
//                       transform: `scale(${scale})`,
//                       transformOrigin: "top center",
//                       transition: "transform 0.2s ease-in-out",
//                     }}
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.parentElement.innerHTML = `
//                         <div style="text-align: center; padding: 32px;">
//                           <p style="color: #d32f2f; font-weight: 600;">Failed to load image</p>
//                           <p style="color: #666; margin-top: 8px;">The image could not be displayed</p>
//                         </div>
//                       `;
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Reject Dialog */}
//       <Dialog
//         open={openRejectDialog && isRejected}
//         onClose={handleCloseRejectDialog}
//       >
//         <DialogTitle>Reject KYC</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Reason for Rejection"
//             fullWidth
//             variant="outlined"
//             value={rejectReason}
//             onChange={(e) => setRejectReason(e.target.value)}
//             multiline
//             rows={4}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseRejectDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleReject}
//             color="primary"
//             disabled={!rejectReason.trim()}
//           >
//             Reject
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* PAN Verification Dialog */}
//       <Dialog open={openPanDialog} onClose={() => setOpenPanDialog(false)}>
//         <DialogTitle>PAN Card Verification</DialogTitle>
//         <DialogContent>
//           <div className="space-y-4 p-4">
//             <div>
//               <Typography variant="subtitle1" className="mb-2 font-semibold">
//                 PAN Verification Status
//               </Typography>
//               <select
//                 value={panVerificationStatus}
//                 onChange={(e) => setPanVerificationStatus(e.target.value)}
//                 className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Status</option>
//                 <option value="verified">Verified</option>
//                 <option value="invalid">Invalid</option>
//                 <option value="pending">Pending Further Verification</option>
//               </select>
//             </div>
//             <div>
//               <Typography variant="subtitle1" className="mb-2 font-semibold">
//                 Upload PAN Verification Screenshot
//               </Typography>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handlePanImageUpload}
//                 className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {panVerificationImage && (
//                 <p className="mt-2 text-sm text-green-600">
//                   File selected: {panVerificationImage.name}
//                 </p>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenPanDialog(false)} color="secondary">
//             Cancel
//           </Button>
//           <Button
//             onClick={handlePanVerificationSubmit}
//             color="primary"
//             disabled={!panVerificationImage || !panVerificationStatus}
//           >
//             Submit & Verify
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @media (max-width: 768px) {
//           .flex-container {
//             flex-direction: column !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default KycApproval;



// import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { useReactToPrint } from 'react-to-print';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { 
//   FileText, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
 
//   Search,
//   FileSpreadsheet,
//   Printer,
//   Filter,
//   X,
//   Calendar
// } from 'lucide-react';
// import { API } from '../../../config/configData';

// const KYCReport = () => {
//   const [allKycData, setAllKycData] = useState([]);
//   const [kycData, setKycData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, userRole } = useContext(DashBoardContext);
//   const printRef = useRef();

//   // Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [showFilters, setShowFilters] = useState(false);

//   // Helper function to check if value is valid
//   const isValidValue = (value) => {
//     return value !== null && value !== undefined && value !== '' && value !== 'null' && value !== 'undefined';
//   };

//   const getDisplayValue = (value, fallback = 'N/A') => {
//     return isValidValue(value) ? value : fallback;
//   };

//   useEffect(() => {
//     const fetchKYCData = async () => {
//       try {
//         setLoading(true);
        
//         const response = await axios.get(`${API}/kyc/get_kyc_report/${encodeURIComponent(userRole)}`);
        
//         // If response contains array of data
//         if (Array.isArray(response.data.datas)) {
//           setAllKycData(response.data.datas);
//           setKycData(response.data.datas[0]);
//         } else if (Array.isArray(response.data)) {
//           setAllKycData(response.data);
//           setKycData(response.data[0]);
//         } else {
//           setAllKycData([response.data]);
//           setKycData(response.data);
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch KYC data');
//         console.error('Error fetching KYC data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchKYCData();
//   }, [userRole]);

//   // Filtered Data using useMemo for performance
//   const filteredData = useMemo(() => {
//     return allKycData.filter((item) => {
//       // Search filter
//       const matchesSearch = searchQuery === '' || 
//         (item.SupplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          item.Suppcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          item.companyname?.toLowerCase().includes(searchQuery.toLowerCase()));

//       // Status filter
//       const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

//       // Category filter
//       const matchesCategory = categoryFilter === 'all' || item.supplierCategory === categoryFilter;

//       // Date range filter
//       let matchesDateRange = true;
//       if (startDate && endDate && item.verifydate) {
//         const itemDate = new Date(item.verifydate);
//         matchesDateRange = itemDate >= startDate && itemDate <= endDate;
//       }

//       return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
//     });
//   }, [allKycData, searchQuery, statusFilter, categoryFilter, startDate, endDate]);

//   // Get unique categories for filter dropdown
//   const categories = useMemo(() => {
//     const cats = [...new Set(allKycData.map(item => item.supplierCategory).filter(Boolean))];
//     return cats;
//   }, [allKycData]);

//   // Export to Excel
//   const exportToExcel = () => {
//     const exportData = filteredData.map(item => ({
//       'Supplier Code': getDisplayValue(item.Suppcode),
//       'Supplier Name': getDisplayValue(item.SupplierName),
//       'Company Name': getDisplayValue(item.companyname),
//       'GST Number': getDisplayValue(item.gst),
//       'PAN Number': getDisplayValue(item.pan),
//       'Status': item.status === 'A' ? 'Approved' : item.status === 'P' ? 'Pending' : 'Rejected',
//       'Category': getDisplayValue(item.supplierCategory),
//       'Mobile': getDisplayValue(item.mobilenumber),
//       'Email': getDisplayValue(item.email),
//       'City': getDisplayValue(item.city),
//       'State': getDisplayValue(item.state),
//       'Bank Name': getDisplayValue(item.bankname),
//       'Account Number': getDisplayValue(item.acnumber),
//       'IFSC Code': getDisplayValue(item.ifsc),
//       'Approved Date': item.approveddate ? new Date(item.approveddate).toLocaleDateString() : 'N/A'
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'KYC Report');
    
//     // Set column widths
//     const maxWidth = 20;
//     worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));
    
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { 
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
//     });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const exportData = filteredData.map(item => ({
//       'Supplier Code': getDisplayValue(item.Suppcode),
//       'Supplier Name': getDisplayValue(item.SupplierName),
//       'Company Name': getDisplayValue(item.companyname),
//       'GST Number': getDisplayValue(item.gst),
//       'PAN Number': getDisplayValue(item.pan),
//       'Status': item.status === 'A' ? 'Approved' : item.status === 'P' ? 'Pending' : 'Rejected',
//       'Category': getDisplayValue(item.supplierCategory),
//       'Mobile': getDisplayValue(item.mobilenumber),
//       'Email': getDisplayValue(item.email),
//       'City': getDisplayValue(item.city),
//       'State': getDisplayValue(item.state)
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);
//     const data = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.csv`);
//   };

//   // Print functionality
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `KYC_Report_${kycData?.SupplierName || 'Unknown'}`,
//     pageStyle: `
//       @page {
//         size: A4;
//         margin: 20mm;
//       }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         .no-print { display: none !important; }
//       }
//     `
//   });

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchQuery('');
//     setStatusFilter('all');
//     setCategoryFilter('all');
//     setDateRange([null, null]);
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'A': { label: 'Approved', variant: 'success', icon: CheckCircle },
//      'C': { label: 'Accounts Pending', variant: 'warning', icon: CheckCircle },
//      'V': { label: 'Admin Pending', variant: 'warning', icon: CheckCircle },

//       'P': { label: 'Purchase Pending', variant: 'warning', icon: Clock },
//       'R': { label: 'Rejected', variant: 'destructive', icon: XCircle },
//     };

//     const config = statusConfig[status] || { label: 'Unknown', variant: 'default', icon: Clock };
//     const Icon = config.icon;

//     return (
//       <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
//         <Icon className="w-3 h-3" />
//         {config.label}
//       </Badge>
//     );
//   };

//   const parseMetals = (metalsString) => {
//     if (!isValidValue(metalsString)) return [];
//     try {
//       const parsed = JSON.parse(JSON.parse(metalsString));
//       return Array.isArray(parsed) ? parsed.filter(m => isValidValue(m)) : [];
//     } catch {
//       return [];
//     }
//   };

//   const cleanFileUrl = (url) => {
//     if (!isValidValue(url)) return null;
//     try {
//       const cleaned = JSON.parse(url);
//       return isValidValue(cleaned) ? cleaned : null;
//     } catch {
//       return url;
//     }
//   };

//   const downloadFile = (url, filename) => {
//     const cleanUrl = cleanFileUrl(url);
//     if (!cleanUrl) return;
    
//     const link = document.createElement('a');
//     link.href = cleanUrl;
//     link.download = filename;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading KYC Report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-red-600 flex items-center gap-2">
//               <XCircle className="w-5 h-5" />
//               Error Loading Data
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">{error}</p>
//             <Button onClick={() => window.location.reload()} className="mt-4">
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!kycData && allKycData.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>No Data Found</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">No KYC data available for this user role.</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const metals = parseMetals(kycData?.tradeMetals);
//   const hasInsurance = kycData?.hasInsurance === 'Yes' && isValidValue(kycData?.insurance_company);

//   return (
//     <div className="container mx-auto py-8 ">
//       {/* Filter and Export Section */}
//       <Card className="mb-6 no-print">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5" />
//               <CardTitle>Filters & Export</CardTitle>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? 'Hide' : 'Show'} Filters
//             </Button>
//           </div>
//         </CardHeader>
        
//         {showFilters && (
//           <CardContent className="space-y-4">
//             {/* Search and Filter Row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Search Input */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by name or code..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>

//               {/* Status Filter */}
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="A">Fully Approved</SelectItem>
//                   <SelectItem value="C">Accounts Pending</SelectItem>
//                   <SelectItem value="V">Admin Pending</SelectItem>
//                    <SelectItem value="P">Purchase Pending</SelectItem>
//                   <SelectItem value="R">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Category Filter */}
//               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Date Range Picker */}
//               {userRole.includes('A/C')&&
//               <div className="relative">
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="A"></SelectItem>
//                   <SelectItem value="C"></SelectItem>
//                   <SelectItem value="V"></SelectItem>
                 
//                 </SelectContent>
//               </Select>

//                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={(update) => setDateRange(update)}
//                   isClearable={true}
//                   placeholderText="Select date range"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   dateFormat="dd/MM/yyyy"
//                 />
//               </div>}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-between pt-4 border-t">
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline">
//                   {filteredData.length} of {allKycData.length} records
//                 </Badge>
//                 {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || startDate) && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={clearFilters}
//                     className="text-red-600"
//                   >
//                     <X className="w-4 h-4 mr-1" />
//                     Clear Filters
//                   </Button>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToCSV}
//                   disabled={filteredData.length === 0}
//                 >
//                   <FileText className="w-4 h-4 mr-2" />
//                   Export CSV
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToExcel}
//                   disabled={filteredData.length === 0}
//                 >
//                   <FileSpreadsheet className="w-4 h-4 mr-2" />
//                   Export Excel
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handlePrint}
//                   disabled={!kycData}
//                 >
//                   <Printer className="w-4 h-4 mr-2" />
//                   Print Report
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>

//       {/* Supplier List Table (if multiple records) */}
//       {allKycData.length > 1 && (
//         <Card className="mb-6 no-print">
//           <CardHeader>
//             <CardTitle>All KYC Records</CardTitle>
//             <CardDescription>Click on a row to view details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Supplier Code</TableHead>
//                   <TableHead>Supplier Name</TableHead>
//                   <TableHead>Company</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Category</TableHead>
//                   <TableHead>GST</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredData.map((item, index) => (
//                   <TableRow 
//                     key={index}
//                     className="cursor-pointer hover:bg-gray-50"
//                     onClick={() => setKycData(item)}
//                   >
//                     <TableCell className="font-medium">{getDisplayValue(item.Suppcode)}</TableCell>
//                     <TableCell>{getDisplayValue(item.SupplierName)}</TableCell>
//                     <TableCell>{getDisplayValue(item.companyname)}</TableCell>
//                     <TableCell>{getStatusBadge(item.status)}</TableCell>
//                     <TableCell>
//                       {isValidValue(item.supplierCategory) && (
//                         <Badge variant="outline">{item.supplierCategory}</Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>{getDisplayValue(item.gst)}</TableCell>
                  
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             {filteredData.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>No records match your filters</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

   
//     </div>
//   );
// };

// export default KYCReport;
