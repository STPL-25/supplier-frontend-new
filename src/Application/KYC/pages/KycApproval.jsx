
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

function KycApproval() {
  const { user, KYC_API, userRole, approvedData, setApprovedData, API } =
    useContext(KycContext);
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

  // New state for PAN verification
  const [panVerificationImage, setPanVerificationImage] = useState(null);
  const [openPanDialog, setOpenPanDialog] = useState(false);
  const [panVerificationStatus, setPanVerificationStatus] = useState("");
    console.log("lllllllllllllllllllllllllllll",HeaderData[0]);
  // const hallmarkInfo=  {
  //       title: "Hallmark Information",
  //       fields: {
  //           'Bis No': "bisLicenseNo",
  //           'Valid From': "certificateValidFrom",
  //           'Valid To': "certificateValidTo",
  //           'Has Insurance': "hasInsurance",
  //           'Insurance Amount': "insuranceAmount",
  //           'Policy Start Date': "policyStartDate",
  //           'Policy Endrosement Date': "endorsementDate",
  //           'Policy End Date': "policyEndDate",
  //           'Bis File': "bisFile",
  //           'Insurance File': "insuranceFile",
  //           'Quotation File': "quotationFile",
  //           'Auth Person Details': "authPersonFile",
          
  //       }
  //   },
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
        userRole: userRole
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

  // New PAN verification handling
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
        // Proceed with verification
        // handleVerify("Verify");
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
        `${KYC_API}/kycdatachecking/${supplierId}/${action}`
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

  // Modified handler for A/C Manager verification
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
        `${KYC_API}/kycdatachecking/${supplierId}/Reject`,
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

      localStorage.setItem("openAccordions", JSON.stringify(newOpenAccordions));
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
  const filteredHeaderData = HeaderData.filter(section => {
    // Only filter out Hallmark Information section if needed
    if (section.title === "Hallmark Information") {
      // Check if supplier category includes hallmark
      return datas.length > 0 && 
             datas[0].supplierCategory && 
             datas[0].supplierCategory.toLowerCase().includes("hallmark");
    }
    return true; // Keep all other sections
  });
  return (
    <Card className="h-full w-full p-6" style={{ width: "100%" }}>
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
                  <Typography variant="h6" color="white" className="font-bold">
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
                                  <>
                                    <a
                                      href={
                                        item[key].startsWith('"') &&
                                        item[key].endsWith('"')
                                          ? item[key].slice(1, -1)
                                          : item[key]
                                      }
                                      download
                                    >
                                      <button className="px-3 py-1 bg-blue-500 text-white rounded">
                                        {header}{" "}
                                      </button>
                                    </a>
                                    {key.includes("panFile") &&
                                      userRole === "A/C_Manager" && (
                                        <button
                                          onClick={handleAccountManagerVerify}
                                          className=" px-3 py-1 ml-2 bg-green-500 text-white rounded"
                                          disabled={isVerified}
                                        >
                                          Pan Status
                                        </button>
                                      )}
                                  </>
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
                      className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
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
                      className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
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
                  className="sign-up mt-2 px-4 py-2 bg-red-500 text-white rounded"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="primary">
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
              <Typography variant="subtitle1" className="mb-2">
                PAN Verification Status
              </Typography>
              <select
                value={panVerificationStatus}
                onChange={(e) => setPanVerificationStatus(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Status</option>
                <option value="verified">Verified</option>
                {/* <option value="invalid">Invalid</option>
                                <option value="pending">Pending Further Verification</option> */}
              </select>
            </div>
            <div>
              <Typography variant="subtitle1" className="mb-2">
                Upload PAN Verification Screenshot
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handlePanImageUpload}
                className="w-full p-2 border rounded"
              />
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
    </Card>
  );
}

export default KycApproval;
