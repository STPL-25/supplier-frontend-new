
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { Card, Typography } from "@material-tailwind/react";
// import eyeIcon from "../../Diamond/assets/eyeicon.png";
import { HeaderData } from "../Datas/Data";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function KycView() {
    const { user, KYC_API, userRole, userData } = useContext(KycContext);
    console.log(HeaderData);
    // {
    //     title: "Hallmark Information",
    //     fields: {
    //         'Bis No': "bisLicenseNo",
    //         'Valid From': "certificateValidFrom",
    //         'Valid To': "certificateValidTo",
    //         'Has Insurance': "hasInsurance",
    //         'Insurance Amount': "insuranceAmount",
    //         'Policy Start Date': "policyStartDate",
    //         'Policy Endrosement Date': "endorsementDate",
    //         'Policy End Date': "policyEndDate",
    //         'Bis File': "bisFile",
    //         'Insurance File': "insuranceFile",
    //         'Quotation File': "quotationFile",
    //         'Auth Person Details': "authPersonFile",
          
    //     }
    // },
    // State for tracking open accordions
    const [openAccordions, setOpenAccordions] = useState([]);

    // State for managing KYC data, loading, and errors
    const [kycDatas, setKycDatas] = useState([]);
    const [kycLoading, setKycLoading] = useState(true);
    const [kycError, setKycError] = useState(null);

    // Fetch KYC data inside useEffect
    useEffect(() => {
        const fetchKycData = async () => {
            setKycLoading(true);
            try {
                if (user && userRole) {
                    const encodedUserRole = btoa(userRole)
                    const response = await axios.get(`${KYC_API}/gettingkycdetails/${user}/${encodedUserRole}`);
                    // console.log("Fetched KYC Data:", response.data);
                    setKycDatas(response.data?.length > 0 ? response.data : []);
                    setKycError(null);
                }

            } catch (error) {
                // console.error("Error fetching KYC data:", error);
                setKycError(error);
            } finally {
                setKycLoading(false);
            }
        };

        fetchKycData();
    }, [KYC_API, user, userRole]);

    // Toggle accordion section
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

    // Handle loading states
    if (kycLoading) {
        return (
            <div>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </div>
        );
    }

    // Handle error states
    if (kycError) {
        return (
            <div className="center-data flex items-center justify-center">

                <p><span className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium" role="alert">No Data Found </span></p>

            </div>
        );
    }
    const filteredHeaderData = HeaderData.filter(section => {
        // Only filter out Hallmark Information section if needed
        if (section.title === "Hallmark Information") {
          // Check if supplier category includes hallmark
          return kycDatas.length > 0 && 
          kycDatas[0].supplierCategory && 
          kycDatas[0].supplierCategory.toLowerCase().includes("hallmark");
        }
        return true; // Keep all other sections
      });
    return (
        <Card className=" h-full w-full mt-5 px-4">
            <h3 className="text-2xl text-center font-bold mb-6"><b>KYC Details</b></h3>
            {kycDatas.length > 0 ? (
                <>
                    <div className="w-full max-w-3xl mx-auto">
                        {filteredHeaderData.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="mb-4">
                                <div className="accordion-btn flex items-center justify-between mb-2 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer"onClick={() => toggleAccordion(sectionIndex)}>
                                    <Typography variant="h6" color="white" className="font-bold"  >
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
                                     <div className="overflow-x-auto">
                                    <table className="accordion-content w-full ml-0 min-w-max table-auto text-left mb-4">
                                        <tbody>
                                            {Object.entries(section.fields).map(([header, key], rowIndex) => (
                                                <tr key={rowIndex} className="border-b">
                                                    <td className="p-4">
                                                        <Typography variant="h6" color="blue-gray" className="font-semibold ">
                                                            {header}
                                                        </Typography>
                                                    </td>
                                                    {kycDatas.map((item, colIndex) => (
                                                        <td key={colIndex} className="p-4">
                                                            {item[key] && key.includes("File") ? (
                                                                <a href={item[key].startsWith('"') && item[key].endsWith('"') ? item[key].slice(1, -1) : item[key]} download>
                                                                    <button className="px-3 py-1 bg-blue-500 text-white rounded">{header} </button>
                                                                </a>
                                                            ) : (
                                                                <Typography variant="h6" color="blue-gray" className="font-normal"
                                                                    style={{ maxWidth: '380px', textAlign: "center" }} >
                                                                    {item[key] ?? 'N/A'}
                                                                </Typography>
                                                            )}
                                                        </td>
                                                    ))}

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                   
                </>
            ) : (
                <div className=" flex items-center justify-center">
                    <p>No KYC details available.</p>
                </div>
            )}
        </Card>
    );
}

export default KycView;
