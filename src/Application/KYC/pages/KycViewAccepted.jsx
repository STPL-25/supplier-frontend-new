import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { KycContext } from '../KycContext/KycContex';
import { Card, Typography } from "@material-tailwind/react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
// import eyeIcon from "../../Diamond/assets/eyeicon.png";
import { HeaderData } from "../Datas/Data";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function KycViewAccepted() {
   
    const { user, KYC_API, userRole, approvedData, setApprovedData, API } = useContext(KycContext);
    const [supplierDetails, setSupplierDetails] = useState("");
    const [datas, setDatas] = useState([]);
    const [openAccordions, setOpenAccordions] = useState([]);
    const [supplierId, setSupplierId] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  
 

    // Fetch KYC data
    const fetchKycData = async () => {
        // console.log(supplierDetails, userRole)
        try {
            if (supplierDetails && userRole) {
                const encodedUserRole = btoa("Accepted")
                const response = await axios.get(`${KYC_API}/gettingkycdetails/${supplierDetails}/${encodedUserRole}`);
                // console.log(response.data);
                setDatas(response.data);
                if (response.data.length > 0) {
                    setSupplierId(response.data[0].id);
                }
            }

           
        } catch (error) {
            
        }
    };

    useEffect(() => {
        if (supplierDetails) { // Fetch only if supplierDetails is selected
            fetchKycData();
        }
    }, [supplierDetails]);

    // Fetch supplier names using React Query
    const fetchSupplierNames = async () => {
        try {
            const response = await axios.post(`${KYC_API}/getsuppliernames`, {
                userRole: "Accepted"
            });
            // Set success message (optional, since fetching supplier names might be routine)
            return response.data; // Assuming this returns an array of supplier names
        } catch (error) {
            // console.error("Error fetching supplier names:", error);
            throw new Error("Failed to fetch supplier names.");
        }
    };

    const { data: supplierNames, error: supplierError, isLoading: supplierLoading } = useQuery({
        queryKey: ['supplierNames'], // Add dynamic keys if userRole changes
        queryFn: () => fetchSupplierNames(userRole), // Pass userRole dynamically
        onError: (error) => {
            // console.error("Error in useQuery:", error.message); // Log for debugging
            setErrorMsg(error.message); // Assuming setErrorMsg updates UI state
            setSnackbarSeverity("error"); // Adjust Snackbar UI to error state
            setOpenSnackbar(true); // Display the error Snackbar
        },
        onSuccess: () => {
          
        }
    });
    // Handle Verify/Check/Approve actions
   
    const toggleAccordion = (index) => {
        setOpenAccordions((prev) => {
            if (prev.includes(index)) {
                // Remove the index if it's already open
                return prev.filter((i) => i !== index);
            } else {
                // Add the index to open it
                return [...prev, index];
            }
        });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
   

    // console.log(supplierDetails);

    return (
        <Card className="h-full w-full p-6" style={{ width: "100%" }}>
            <h3 className="text-xl flex justify-center font-bold mb-6"><b>KYC Details</b></h3>

            {/* Display Snackbar for messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                {snackbarSeverity === "success" ? (
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {successMsg}
                    </Alert>
                ) : (
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
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
                        getOptionLabel={(option) => option.name || option} // Adjust based on your data structure
                        value={supplierDetails}
                        onChange={(event, value) => setSupplierDetails(value)}
                        noOptionsText="No supplier data found for KYC verification"
                        sx={{
                            width: 300, // Adjusted width for better visibility
                            margin: "20px auto",
                            borderRadius: "8px", // Rounded corners
                            backgroundColor: "#f9f9f9", // Light background color for better contrast
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
                            '& .MuiAutocomplete-inputRoot': {
                                padding: "10px", // Add some padding inside
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: "1px solid #ccc", // Subtle border color
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: "#007BFF", // Change border on hover
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: "#007BFF", // Border color when focused
                                boxShadow: "0 0 8px rgba(0, 123, 255, 0.25)", // Focused shadow effect
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
                                        padding: "8px 12px", // Enhance padding
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color: "#555", // Subtle label color
                                    },
                                }}
                            />
                        )}
                    />
                )}
            </div>

            {datas.length > 0 ? (
                <>
                    <div className="w-[600px] ml-[450px]">
                        {filteredHeaderData.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-4 ">
                                <div className="accordion-btn flex items-center justify-between mb-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer" onClick={() => toggleAccordion(sectionIndex)}>
                                    <Typography variant="h6" color="white" className="font-bold">
                                        {section.title}
                                    </Typography>
                                    {/* <img
                                        src={eyeIcon}
                                        onClick={() => toggleAccordion(sectionIndex)}
                                        alt='View Edited Data'
                                        className="ml-2 cursor-pointer w-4 h-4"
                                    /> */}
                                </div>
                                {openAccordions.includes(sectionIndex) && (
                                    <table className="accordion-content w-full ml-0 min-w-max table-auto text-left mb-4">
                                        <tbody>
                                            {Object.entries(section.fields).map(([header, key], rowIndex) => (
                                                <tr key={rowIndex} className="border-b">
                                                    <td className="p-4">
                                                        <Typography variant="h6" color="blue-gray" className="font-semibold">
                                                            {header}
                                                        </Typography>
                                                    </td>
                                                    {datas.map((item, colIndex) => (
                                                        <td key={colIndex} className="p-3">
                                                            {item[key] && key.includes("File") ? (
                                                                <a href={item[key].startsWith('"') && item[key].endsWith('"') ? item[key].slice(1, -1) : item[key]} download>
                                                                    <button className="px-3 py-1 bg-blue-500 text-white rounded">{header} </button>
                                                                </a>
                                                            ) : (
                                                                <Typography variant="h6" color="blue-gray" className="font-normal "
                                                                    style={{ maxWidth: '400px', textAlign: "center" }}>
                                                                    {item[key] ?? 'N/A'}
                                                                </Typography>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        ))}
                    </div>
                   
               
                </>
            ) : (
                <div className="center-data flex items-center justify-center">

                    <p><span className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium" role="alert">No Data Found </span></p>

                </div>
            )}
           
        </Card>
    );
}

export default KycViewAccepted;
