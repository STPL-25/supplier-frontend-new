import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import axios from "axios";
// import { validate } from './validate'; // Adjust the path accordingly

function SupplierKYC() {
    const {
        kycFormData,
        setKycFormData,
        handleInputChange,
        filesDatas,
        setFilesDatas,

        handleFileChange,
        validate
        , errors, setErrors,
        handleFileDelete,
        handleViewImage,
        extractPANFromGST,
        fileSizes,
        fileDatasUrl,
        getFileName
    } = useContext(KycContext);
   console.log(kycFormData)
    const { setActiveSection ,setActiveComponent} = useContext(DashBoardContext);
    const [postalData, setPostalData] = useState([]);
    console.log(kycFormData.supplierCategory)
    // const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     const postalFetchData = async () => {
    //         if (!kycFormData.pincode) return; // Skip fetching if pincode is empty

    //         try {
    //             const response = await axios.get(`https://api.postalpincode.in/pincode/${kycFormData.pincode}`);
    //             const postOffices = response.data[0].PostOffice;
    //             setPostalData(postOffices);

    //             const selectedPostOffice = postOffices.find((data) => data.Pincode === kycFormData.pincode) || {};
    //             const area = selectedPostOffice.Name || "";
    //             const taluk = selectedPostOffice.Block || '';
    //             const city = selectedPostOffice.District || '';
    //             const state = selectedPostOffice.State || '';

    //             setKycFormData((prevValue) => ({
    //                 ...prevValue,
    //                 area,
    //                 taluk,
    //                 city,
    //                 state
    //             }));
    //             setErrors((prevErrors) => {
    //                 const { taluk, city, state, ...rest } = prevErrors;
    //                 return rest;
    //             });
    //         } catch (error) {
    //             console.error('Error fetching postal data:', error);
    //             // Optionally set an error related to pincode fetch failure
    //             setKycFormData((prevValue) => ({
    //                 ...prevValue,
    //                 taluk: "",
    //                 city: "",
    //                 state: ""
    //             }));
    //             setErrors((prevErrors) => ({
    //                 ...prevErrors,
    //             }));
    //         }
    //     };
    //     postalFetchData();
    // }, [kycFormData.pincode, setKycFormData]);
   
    const organizationLists = [
        "",
        "Public Limited Company",
        "Private Limited Company",
        "Joint Hindu Family Business",
        "Patnership Firm",
        "Proprietorship",
        "Unregistered Dealer",
        "Limited Liability Patnership"
    ];

    // Function to validate the entire form
    const handleValidate = () => {
        const validationErrors = validate(kycFormData, filesDatas,fileDatasUrl);
        console.log(validationErrors)

        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));

        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     if (handleValidate()) {
    //         // Proceed with form submission
    //         console.log("Form is valid. Submitting...");
    //         contextHandleSubmit(event); // Call context's handleSubmit if necessary
    //     } else {
    //         console.log("Form has errors.");
    //     }
    // };

    // Handle navigation to the next section
    const handleNext = () => {
        if (handleValidate()) {
            localStorage.setItem("kycData", JSON.stringify(kycFormData));

            // setActiveSection("Principal Address");
            setActiveComponent("Principal Address")
            
        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };

    // Handle input changes with validation
    useEffect(() => {
        if (kycFormData.gst && kycFormData.gst.length > 0) {
            const panNo = extractPANFromGST(kycFormData.gst);
            localStorage.setItem("kycData", JSON.stringify(kycFormData));

            const fieldErrors = validate({ ...kycFormData, ["pan"]: panNo }, filesDatas,fileDatasUrl);
            setErrors((prevErrors) => ({
                ...prevErrors,
                ["pan"]: fieldErrors["pan"]
            }));
        }
    }, [kycFormData.gst]);
    const handleInputChangeWithValidation = (event) => {
        handleInputChange(event); // Update the form data
        const { name, value } = event.target;
        console.log(name, value)
        // Validate the specific field
        const fieldErrors = validate({ ...kycFormData, [name]: value }, filesDatas,fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };
    console.log(errors, kycFormData,fileDatasUrl)
    // Handle file changes with validation
    const handleFileChangeWithValidation = (event) => {
        handleFileChange(event); // Update the file data
        const { name, files } = event.target;
        const file = files[0];

        // Update the filesDatas with the new file
        const updatedFilesDatas = { ...filesDatas, [name]: file };

        // Validate the specific file field
        const fieldErrors = validate(kycFormData, updatedFilesDatas,fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };
    // console.log(errors)

    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto w-full bg-white p-6">
                <form className='w-full '>
                    <h3 className="font-bold text-center mb-6">Business Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
                        {/* Left side fields */}
                        <div>
                            {/* Supplier Category */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label htmlFor="supplier-category" className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                                        Supplier Category:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <div className="flex items-center">
                                        {kycFormData.supplierCategory === 'Gold'&&
                                        <div className="flex items-center">
                                            <input
                                                id="gold"
                                                name="supplierCategory"
                                                type="radio"
                                                value="Gold"
                                                checked={kycFormData.supplierCategory === 'Gold'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="gold" className="ml-2 block text-sm text-black">
                                                Gold Supplier
                                            </label>
                                        </div>}
                                        {kycFormData.supplierCategory === 'Diamond'&&
                                        <div className="flex items-center ml-4">
                                            <input
                                                id="Diamond"
                                                name="supplierCategory"
                                                type="radio"
                                                value="Diamond"
                                                checked={kycFormData.supplierCategory === 'Diamond'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="Diamond" className="ml-2 block text-sm text-black">
                                                Diamond Supplier
                                            </label>
                                        </div>
                                         }
                                         {kycFormData.supplierCategory === 'Platinum'&&
                                        <div className="flex items-center ml-4">
                                            <input
                                                id="platinum"
                                                name="supplierCategory"
                                                type="radio"
                                                value="Platinum"
                                                checked={kycFormData.supplierCategory === 'Platinum'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="platinum" className="ml-2 block text-sm text-black">
                                                Platinum Supplier
                                            </label>
                                        </div>
                                        }
                                        {kycFormData.supplierCategory === 'Silver'&&
                                        <div className="flex items-center ml-4">
                                            <input
                                                id="silver"
                                                name="supplierCategory"
                                                type="radio"
                                                value="silver"
                                                checked={kycFormData.supplierCategory === 'Silver'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="silver" className="ml-2 block text-sm text-black">
                                                Silver Supplier
                                            </label>
                                        </div>
                                          } 
                                          {kycFormData.supplierCategory === 'Gold Hallmark'&&
                                        <div className="flex items-center ml-4">
                                            <input
                                                id="Gold Hallmark"
                                                name="supplierCategory"
                                                type="radio"
                                                value="Gold Hallmark"
                                                checked={kycFormData.supplierCategory === 'Gold Hallmark'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="Gold Hallmark" className="ml-2 block text-sm text-black">
                                            Gold Hallmark Supplier
                                            </label>
                                        </div>
                                          } 
                                            {kycFormData.supplierCategory === 'Silver Hallmark'&&
                                        <div className="flex items-center ml-4">
                                            <input
                                                id="Silver Hallmark"
                                                name="supplierCategory"
                                                type="radio"
                                                value="Silver Hallmark"
                                                checked={kycFormData.supplierCategory === 'Silver Hallmark'}
                                                // onChange={handleInputChangeWithValidation}
                                                className={`h-4 w-4 text-black border-black focus:ring-black ${errors.supplierCategory ? 'border-red-500' : ''}`}
                                            />
                                            <label htmlFor="Silver Hallmark" className="ml-2 block text-sm text-black">
                                            Silver Hallmark Supplier
                                            </label>
                                        </div>
                                          } 
                                    </div>
                                    {errors.supplierCategory && (
                                        <p className="text-red-500 text-sm mt-1">{errors.supplierCategory}</p>
                                    )}
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Company Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="companyname"
                                        value={kycFormData.companyname}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Company Name"
                                        disabled
                                        className={`rounded-md border ${errors.companyname ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.companyname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.companyname}</p>
                                    )}
                                </div>
                            </div>

                            {/* Door No */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Door No (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="doorno"
                                        value={kycFormData.doorno}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Door No "
                                        maxLength={20}
                                        className={`rounded-md border ${errors.doorno ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.doorno && (
                                        <p className="text-red-500 text-sm mt-1">{errors.doorno}</p>
                                    )}
                                </div>
                            </div>

                            {/* Street */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Street (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="street"
                                        value={kycFormData.street}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Street"
                                        maxLength={70}
                                        className={`rounded-md border ${errors.street ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.street && (
                                        <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                                    )}
                                </div>
                            </div>

                            {/* Pin Code */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Pin Code (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={kycFormData.pincode}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Pin Code"
                                        maxLength={6}
                                        className={`rounded-md border ${errors.pincode ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.pincode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Area */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Area (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    {/* <select
                                        name='area'
                                        value={kycFormData.area}
                                        onChange={handleInputChangeWithValidation}
                                        className={`w-64 rounded-md border ${errors.area ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-4 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    >
                                        {Array.isArray(postalData) && postalData.length > 0 ? (
                                            postalData.map((data, index) => (
                                                <option key={`${data.Name}-${index}`} value={data.Name}>
                                                    {data.Name}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No areas available</option>
                                        )}
                                    </select> */}
                                      <input
                                        type="text"
                                        name="area"
                                        value={kycFormData.area}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Area"
                                        // maxLength={6}
                                        className={`rounded-md border ${errors.area ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.area && (
                                        <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                                    )}
                                </div>
                            </div>


                            {/* Taluk */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Taluk (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="taluk"
                                        value={kycFormData.taluk}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Taluk"
                                        className={`rounded-md border ${errors.taluk ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.taluk && (
                                        <p className="text-red-500 text-sm mt-1">{errors.taluk}</p>
                                    )}
                                </div>
                            </div>

                            {/* City */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        City (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="city"
                                        value={kycFormData.city}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter City"
                                        className={`rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side fields */}
                        <div>
                            {/* State */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        State (as per Gst):
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="state"
                                        value={kycFormData.state}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter State"
                                        className={`rounded-md border ${errors.state ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.state && (
                                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Number */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Mobile:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="mobilenumber"
                                        value={kycFormData.mobilenumber}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Mobile Number"
                                        maxLength={10}
                                        className={`rounded-md border ${errors.mobilenumber ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        disabled
                                    />
                                    {errors.mobilenumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.mobilenumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        E-Mail:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="email"
                                        value={kycFormData.email}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter E-mail Address"
                                        className={`rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                            {/* Organization */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Organization:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <select
                                        name='organization'
                                        value={kycFormData.organization}
                                        onChange={handleInputChangeWithValidation}
                                        className={`rounded-md border ${errors.organization ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-2 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    >
                                        {organizationLists.map((data, index) => (
                                            <option value={data} key={`${data}-${index}`}>
                                                {data}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.organization && (
                                        <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
                                    )}
                                </div>
                            </div>
                            {/* Proprietor Name */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                    Owner/Authorized Representative Name (as per Gst):                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="propritorname"
                                        value={kycFormData.propritorname}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Proprietor Name"
                                        maxLength={60}
                                        className={`rounded-md border ${errors.propritorname ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        disabled
                                    />
                                    {errors.propritorname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.propritorname}</p>
                                    )}
                                </div>
                            </div>



                            {/* Reg Under MSME */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Reg Under MSME:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <select
                                        name='regUnderMsme'
                                        value={kycFormData.regUnderMsme}
                                        onChange={handleInputChangeWithValidation}
                                        className={`w-64 rounded-md border ${errors.regUnderMsme ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-10 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    >
                                        {/* className={`w-64 rounded-md border ${errors.area ? 'border-red-500' : 'border-gray-400'} 
                                        bg-white py-1 px-10 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} */}

                                        <option></option>
                                        <option>Yes</option>
                                        <option>No</option>
                                    </select>
                                    {errors.regUnderMsme && (
                                        <p className="text-red-500 text-sm mt-1">{errors.regUnderMsme}</p>
                                    )}
                                </div>
                            </div>
                            {/* MSME */}
                            {/* {console.log(kycFormData.msmeNo)} */}
                            {kycFormData.regUnderMsme === "Yes" && <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        MSME No:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="msmeNo"
                                        value={kycFormData.msmeNo}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter MSME Number"
                                        className={`rounded-md border ${errors.msmeNo ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.gst && (
                                        <p className="text-red-500 text-sm mt-1">{errors.msmeNo}</p>
                                    )}
                                </div>
                            </div>}

                            {/* GST */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        GST No:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="gst"
                                        value={kycFormData.gst}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter GST Number"
                                        className={`rounded-md border ${errors.gst ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.gst && (
                                        <p className="text-red-500 text-sm mt-1">{errors.gst}</p>
                                    )}
                                </div>
                            </div>
                            {/* PAN */}
                            <div className="md:flex md:items-center mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        PAN:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="pan"
                                        value={kycFormData.pan}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter PAN Number"
                                        disabled

                                        className={`rounded-md border ${errors.pan ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.pan && (
                                        <p className="text-red-500 text-sm mt-1">{errors.pan}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* File Uploads and Next Button */}



                    <div className='flex flex-row grid grid-cols-3 gap-12 justify-center'>
                        {/* GST File Upload */}
                        {/* <div className="flex flex-row grid grid-cols-3 gap-12 justify-center"> */}
                        <div className="mb-5">
                            {/* Conditionally render either the file preview or the file input */}
                            {filesDatas.gstFile||fileDatasUrl.gstFile ? (
                                // Display the uploaded image or PDF information
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded GST file:</p>
                                    {filesDatas.gstFile?.type === "application/pdf" ||fileDatasUrl.gstFile?.endsWith(".pdf")? (
                                        <p className="text-sm text-gray-700">{filesDatas?.gstFile?.name||getFileName(fileDatasUrl?.gstFile)}</p>
                                        // {console.log()}https://backendrate.s3.ap-south-1.amazonaws.com
                                    ) : (
                                        <img
                                            src={filesDatas.gstFile?URL.createObjectURL(filesDatas.gstFile):fileDatasUrl.gstFile}
                                            alt="Uploaded Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.gstFile, event,fileDatasUrl.gstFile)}
                                        className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete('gstFile',fileDatasUrl.gstFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <p >
                                        gstFile: {fileSizes["gstFile"]} KB
                                    </p>
                                </div>
                            ) : (
                                // Display the file input if there’s no uploaded file
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload GST PDF or Image
                                    </label>
                                    <input
                                        type="file"
                                        name="gstFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.gstFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                            } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}

                            {/* Display error message if validation fails */}
                            {errors.gstFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.gstFile}</p>
                            )}
                        </div>
                        {/* </div> */}


                    
                        {console.log(fileDatasUrl)}
                        <div className="mb-5">

                            {filesDatas.panFile ||fileDatasUrl.panFile? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded PAN file:</p>
                                    {filesDatas.panFile?.type === "application/pdf"||fileDatasUrl.panFile?.endsWith(".pdf") ? (
                                        <p className="text-sm text-gray-700">{filesDatas?.panFile?.name||getFileName(fileDatasUrl?.panFile)}</p>
                                    ) : (
                                        <img
                                        src={filesDatas.panFile ? URL.createObjectURL(filesDatas.panFile) : fileDatasUrl.panFile}
                                        alt="PAN Uploaded Preview"
                                        className="h-32 w-32 object-cover rounded-md"
                                    />
                                    )}
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.panFile, event,fileDatasUrl.panFile)}
                                        className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete('panFile',fileDatasUrl.panFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <p >
                                        panFile: {fileSizes["panFile"]} KB
                                    </p>

                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload PAN PDF or Image
                                    </label>
                                    <input
                                        type="file"
                                        name="panFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.panFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                            } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.panFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.panFile}</p>
                            )}
                        </div>

                        {/* MSME File Upload (Conditional) */}
                        {kycFormData.regUnderMsme === "Yes" && (
                            <div className="mb-5">

                                {filesDatas.msmeFile||fileDatasUrl.msmeFile ? (
                                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                        <p className="text-base font-medium mb-2">Uploaded MSME file:</p>
                                        {filesDatas.msmeFile?.type === "application/pdf"||fileDatasUrl.msmeFile?.endsWith(".pdf") ? (
                                            <p className="text-sm text-gray-700">{filesDatas?.msmeFile?.name||getFileName(fileDatasUrl?.msmeFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.msmeFile?URL.createObjectURL(filesDatas.msmeFile):fileDatasUrl.msmeFile}
                                                alt="MSME Uploaded Preview"
                                                className="h-32 w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <button
                                            onClick={(event) => handleViewImage(filesDatas.msmeFile, event,fileDatasUrl.msmeFile)}
                                            className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleFileDelete('msmeFile',fileDatasUrl.msmeFile)}
                                            className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                        <p >
                                            msmeFile: {fileSizes["msmeFile"]} KB
                                        </p>

                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-3 block text-base font-medium">
                                            Upload MSME PDF or Image
                                        </label>

                                        <input
                                            type="file"
                                            name="msmeFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.msmeFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                                } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.msmeFile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.msmeFile}</p>
                                )}
                            </div>
                        )}
                        {/* </div> */}

                        {/* Next Button */}

                    </div>
                    <div className='flex justify-center'>
                        <button
                            type="button"
                            className="center mt-4 rounded-md bg-blue-500 py-2 px-6 text-base font-semibold text-white outline-none hover:shadow-form"
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
