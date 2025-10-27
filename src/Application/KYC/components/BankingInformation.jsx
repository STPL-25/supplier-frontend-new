import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import axios from 'axios';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

function BankingInformation() {
    const { accInfo, setAccInfo, handleAccInputChange, validateBankingInfo, errors, setErrors, handleFileChange, filesDatas, validate, handleFileDelete, handleViewImage, fileDatasUrl, getFileName } = useContext(KycContext);
    const { setActiveSection,setActiveComponent } = useContext(DashBoardContext)
    // const [errors, setErrors] = useState({});

    const [banckAccDetails, setBankAccDetails] = useState({})
    const handleValidate = () => {
        const validationErrors = validateBankingInfo(accInfo, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));

        return Object.keys(validationErrors).length === 0;
    };
    const handleInputChangeWithValidation = (event) => {
        handleAccInputChange(event); // Update the form data
        const { name, value } = event.target;

        // Validate the specific field
        const fieldErrors = validateBankingInfo({ ...accInfo, [name]: value }, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };
    const handleFileChangeWithValidation = (event) => {
        handleFileChange(event); // Update the file data
        const { name, files } = event.target;
        const file = files[0];

        // Update the filesDatas with the new file
        const updatedFilesDatas = { ...filesDatas, [name]: file };

        // Validate the specific file field
        const fieldErrors = validateBankingInfo(accInfo, updatedFilesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };
    // Handle navigation to the next section
    const handleNext = () => {
        if (handleValidate()) {
            setActiveComponent("Contact Information");
            localStorage.setItem("KycAcc",JSON.stringify(accInfo))

        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };
    // const handleNext = () => {
    //     setActiveSection("Contact Information") 
    //    }
    console.log(errors)
    useEffect(() => {
        const fetchBankdetails = async () => {
            try {
                const response = await axios.get(`https://ifsc.razorpay.com/${accInfo.ifsc}`)
                console.log(response.data)
                setAccInfo((prevValue) => ({
                    ...prevValue,
                    bankname: response.data.BANK,
                    bankbranchname: response.data.BRANCH,
                    bankaddress: response.data.ADDRESS,
                }));
                setErrors((prevErrors) => {
                    const { bankname, bankbranchname, bankaddress, ...rest } = prevErrors;
                    return rest;
                });
            } catch (error) {
                console.log(error)
                setAccInfo((prevValue) => ({
                    ...prevValue,
                    bankname: "",
                    bankbranchname: "",
                    bankaddress: "",
                }));
            }
        }
        fetchBankdetails()
    }, [accInfo.ifsc])
    return (
        <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full bg-white p-6">

                <form >
                    <h3 className="font-bold text-center mb-6">Banking Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left side fields */}


                        <div>
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        A/c holder Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="acholdername"
                                        value={accInfo.acholdername ? accInfo.acholdername.toUpperCase() : ''}
                                        onChange={handleInputChangeWithValidation}
                                        maxLength={60}
                                        placeholder="Enter A/c holder Name"
                                        className={`md:w-full w-full rounded-md border ${errors.acholdername ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.acholdername && (
                                        <p className="text-red-500 text-sm mt-1">{errors.acholdername}</p>
                                    )}
                                </div>
                            </div>
                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        A/c Number:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="acnumber"
                                        value={accInfo.acnumber ? accInfo.acnumber.replace(/[a-z]/g, (char) => char.toUpperCase()) : ''}

                                        onChange={handleInputChangeWithValidation}
                                        maxLength={34}
                                        placeholder="Enter A/c Number"
                                        className={`md:w-full w-full rounded-md border ${errors.acnumber ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.acnumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.acnumber}</p>
                                    )}
                                </div>
                            </div>

                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        A/c Type:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <select
                                        className={`md:w-full w-full rounded-md border ${errors.actype ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        name="actype"
                                        value={accInfo.actype}
                                        onChange={handleInputChangeWithValidation}
                                    >
                                        <option value="">Select Bank </option>

                                        <option value="Savings Account">Savings Account</option>
                                        <option value="Current Account">Current Account</option>
                                        <option value="NRI Account">NRI Account</option>
                                    </select>
                                    {errors.acnumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.actype}</p>
                                    )}
                                </div>
                            </div>

                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        IFSC:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="ifsc"
                                        value={accInfo.ifsc ? accInfo.ifsc.replace(/[a-z]/g, (char) => char.toUpperCase()) : ''}
                                        onChange={handleInputChangeWithValidation}
                                        maxLength={11}
                                        placeholder="Enter IFSC"
                                        className={`md:w-full w-full rounded-md border ${errors.ifsc ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.acnumber && (
                                        <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        Bank Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="bankname"
                                        value={accInfo.bankname}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Bank Name"
                                        disabled
                                        className={`md:w-full w-full rounded-md border ${errors.bankname ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.bankname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bankname}</p>
                                    )}
                                </div>

                            </div>
                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        Bank Branch Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="bankbranchname"
                                        value={accInfo.bankbranchname}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Bank Branch Name"
                                        disabled
                                        className={`md:w-full w-full rounded-md border ${errors.bankbranchname ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.bankbranchname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bankbranchname}</p>
                                    )}
                                </div>
                                {/* <select className="w-full rounded-md border border-gray-400 bg-white py-1 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md">
                                <option>Select City</option>
                            </select> */}
                            </div>
                            <div className=" md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className=" mb-3 block text-center text-base font-medium text-black">
                                        Bank Address:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="bankaddress"
                                        value={accInfo.bankaddress}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Bank Address"
                                        disabled
                                        className={`md:w-full w-full rounded-md border ${errors.bankaddress ? 'border-red-500' : 'border-gray-400'
                                            } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} />
                                    {errors.bankaddress && (
                                        <p className="text-red-500 text-sm mt-1">{errors.bankaddress}</p>
                                    )}
                                </div>
                                {/* <select className="w-full rounded-md border border-gray-400 bg-white py-1 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md">
                                <option>Select State</option>
                                
                            </select> */}
                            </div>
                        </div>
                    </div>
                    <div className="mb-5 w-[400px]">
                        {filesDatas.chequeFile || fileDatasUrl?.chequeFile ? (
                            <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                <p className="text-base font-medium mb-2">Uploaded Cancelled Cheque:</p>
                                {filesDatas.chequeFile?.type === "application/pdf" ||
                                    fileDatasUrl.chequeFile?.endsWith(".pdf") ||
                                    fileDatasUrl.chequeFile?.endsWith("blob") ? (
                                    <p className="text-sm text-gray-700">
                                        {filesDatas?.chequeFile?.name || getFileName(getFileName(fileDatasUrl?.chequeFile))}
                                    </p>
                                ) : (
                                    <img
                                        src={
                                            filesDatas.chequeFile
                                                ? URL.createObjectURL(filesDatas.chequeFile)
                                                : fileDatasUrl.chequeFile?.startsWith('"') && fileDatasUrl.chequeFile?.endsWith('"')
                                                    ? fileDatasUrl.chequeFile.slice(1, -1)
                                                    : fileDatasUrl.chequeFile
                                        }
                                        alt="Cheque Uploaded Preview"
                                        className="h-32 w-32 object-cover rounded-md"
                                    />
                                )}
                                <div className="mt-2 flex space-x-5">
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.chequeFile, event, fileDatasUrl.chequeFile)}
                                        className="text-green-500 hover:text-green-700 text-sm"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete("chequeFile", fileDatasUrl.chequeFile)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="mb-3 block text-base font-medium">Upload Cancelled Cheque</label>
                                <input
                                    type="file"
                                    name="chequeFile"
                                    accept="application/pdf, image/*"
                                    onChange={handleFileChangeWithValidation}
                                    className={`w-full rounded-md border ${errors.chequeFile ? "border-red-500" : "border-[#e0e0e0]"
                                        } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                />
                            </div>
                        )}
                        {errors.chequeFile && (
                            <p className="text-red-500 text-sm mt-1">{errors.chequeFile}</p>
                        )}
                    </div>


                    <div className='flex justify-center'>
                        <button
                            type="button"
                            className="mt-4 rounded-md bg-blue-500 py-2 px-6 text-base font-semibold text-white outline-none hover:shadow-form"
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

export default BankingInformation;