import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import axios from 'axios';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

function BankingInformation() {
    const { 
        accInfo, 
        setAccInfo, 
        handleAccInputChange, 
        validateBankingInfo, 
        errors, 
        setErrors, 
        handleFileChange, 
        filesDatas, 
        validate, 
        handleFileDelete, 
        handleViewImage, 
        fileDatasUrl, 
        getFileName 
    } = useContext(KycContext);
    
    const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);

    const [banckAccDetails, setBankAccDetails] = useState({});

    const handleValidate = () => {
        const validationErrors = validateBankingInfo(accInfo, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));

        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChangeWithValidation = (event) => {
        handleAccInputChange(event);
        const { name, value } = event.target;

        const fieldErrors = validateBankingInfo({ ...accInfo, [name]: value }, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    const handleFileChangeWithValidation = (event) => {
        handleFileChange(event);
        const { name, files } = event.target;
        const file = files[0];

        const updatedFilesDatas = { ...filesDatas, [name]: file };

        const fieldErrors = validateBankingInfo(accInfo, updatedFilesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    const handleNext = () => {
        if (handleValidate()) {
            setActiveComponent("Contact Information");
            localStorage.setItem("KycAcc", JSON.stringify(accInfo));
        } else {
            // console.log("Form has errors. Cannot proceed to next section.");
        }
    };

    useEffect(() => {
        const fetchBankdetails = async () => {
            try {
                const response = await axios.get(`https://ifsc.razorpay.com/${accInfo.ifsc}`);
                // console.log(response.data);
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
                // console.log(error);
                setAccInfo((prevValue) => ({
                    ...prevValue,
                    bankname: "",
                    bankbranchname: "",
                    bankaddress: "",
                }));
            }
        };
        if (accInfo.ifsc) {
            fetchBankdetails();
        }
    }, [accInfo.ifsc]);

    return (
        <div className="flex items-center justify-center px-2 sm:px-4">
            <div className="mx-auto w-full bg-white p-4 sm:p-6">
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Banking Information</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                        {/* Left side fields */}
                        <div>
                            {/* A/c holder Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    A/c holder Name:
                                </label>
                                <input
                                    type="text"
                                    name="acholdername"
                                    value={accInfo.acholdername ? accInfo.acholdername.toUpperCase() : ''}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={60}
                                    placeholder="Enter A/c holder Name"
                                    className={`w-full rounded-md border ${errors.acholdername ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.acholdername && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.acholdername}</p>
                                )}
                            </div>

                            {/* A/c Number */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    A/c Number:
                                </label>
                                <input
                                    type="text"
                                    name="acnumber"
                                    value={accInfo.acnumber ? accInfo.acnumber.replace(/[a-z]/g, (char) => char.toUpperCase()) : ''}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={34}
                                    placeholder="Enter A/c Number"
                                    className={`w-full rounded-md border ${errors.acnumber ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.acnumber && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.acnumber}</p>
                                )}
                            </div>

                            {/* A/c Type */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    A/c Type:
                                </label>
                                <select
                                    className={`w-full rounded-md border ${errors.actype ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name="actype"
                                    value={accInfo.actype}
                                    onChange={handleInputChangeWithValidation}
                                >
                                    <option value="">Select Account Type</option>
                                    <option value="Savings Account">Savings Account</option>
                                    <option value="Current Account">Current Account</option>
                                    <option value="NRI Account">NRI Account</option>
                                </select>
                                {errors.actype && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.actype}</p>
                                )}
                            </div>

                            {/* IFSC */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    IFSC:
                                </label>
                                <input
                                    type="text"
                                    name="ifsc"
                                    value={accInfo.ifsc ? accInfo.ifsc.replace(/[a-z]/g, (char) => char.toUpperCase()) : ''}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={11}
                                    placeholder="Enter IFSC"
                                    className={`w-full rounded-md border ${errors.ifsc ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.ifsc && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ifsc}</p>
                                )}
                            </div>
                        </div>

                        {/* Right side fields */}
                        <div>
                            {/* Bank Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Bank Name:
                                </label>
                                <input
                                    type="text"
                                    name="bankname"
                                    value={accInfo.bankname}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Bank Name"
                                    disabled
                                    className={`w-full rounded-md border ${errors.bankname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bankname && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bankname}</p>
                                )}
                            </div>

                            {/* Bank Branch Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Bank Branch Name:
                                </label>
                                <input
                                    type="text"
                                    name="bankbranchname"
                                    value={accInfo.bankbranchname}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Bank Branch Name"
                                    disabled
                                    className={`w-full rounded-md border ${errors.bankbranchname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bankbranchname && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bankbranchname}</p>
                                )}
                            </div>

                            {/* Bank Address */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Bank Address:
                                </label>
                                <input
                                    type="text"
                                    name="bankaddress"
                                    value={accInfo.bankaddress}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Bank Address"
                                    disabled
                                    className={`w-full rounded-md border ${errors.bankaddress ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bankaddress && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bankaddress}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className='mb-6 w-full'>
                        {filesDatas.chequeFile || fileDatasUrl?.chequeFile ? (
                            <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                <p className="text-sm sm:text-base font-medium mb-2">Uploaded Cancelled Cheque:</p>
                                {filesDatas.chequeFile?.type === "application/pdf" ||
                                    fileDatasUrl.chequeFile?.endsWith(".pdf") ||
                                    fileDatasUrl.chequeFile?.endsWith("blob") ? (
                                    <p className="text-xs sm:text-sm text-gray-700 break-all">
                                        {filesDatas?.chequeFile?.name || getFileName(fileDatasUrl?.chequeFile)}
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
                                        className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                    />
                                )}
                                <div className="flex gap-2 sm:gap-4 mt-2">
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.chequeFile, event, fileDatasUrl.chequeFile)}
                                        className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete("chequeFile", fileDatasUrl.chequeFile)}
                                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="mb-2 block text-sm sm:text-base font-medium">Upload Cancelled Cheque</label>
                                <input
                                    type="file"
                                    name="chequeFile"
                                    accept="application/pdf, image/*"
                                    onChange={handleFileChangeWithValidation}
                                    className={`w-full rounded-md border ${errors.chequeFile ? "border-red-500" : "border-[#e0e0e0]"} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                />
                            </div>
                        )}
                        {errors.chequeFile && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.chequeFile}</p>
                        )}
                    </div>

                    {/* Next Button */}
                    <div className='flex justify-center mt-4 sm:mt-6'>
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

export default BankingInformation;
