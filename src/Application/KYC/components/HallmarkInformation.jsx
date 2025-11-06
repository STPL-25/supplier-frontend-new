import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";

function HallmarkInformation() {
    const {
        kycFormData,
        handleInputChange,
        filesDatas,
        handleFileChange,
        validate,
        errors, 
        setErrors,
        handleFileDelete,
        handleViewImage,
        fileSizes,
        fileDatasUrl,
        getFileName,
        hallmarkInfo, 
        setHallmarkInfo,
        handleHallmarkChange,
        validateHallmarkInfo,
        userRole
    } = useContext(KycContext);
    
    const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);

    const handleValidate = () => {
        const validationErrors = validateHallmarkInfo(hallmarkInfo, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));
        return Object.keys(validationErrors).length === 0;
    };

    const handleNext = () => {
        if (handleValidate()) {
            localStorage.setItem("hallmarkInfo", JSON.stringify(hallmarkInfo));
            setActiveComponent("Trade Information");            
        }
    };

    const handleHallmarkInputValidation = (event) => {
        handleHallmarkChange(event);
        const { name, value } = event.target;
        const fieldErrors = validateHallmarkInfo({ ...hallmarkInfo, [name]: value }, filesDatas, fileDatasUrl);
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    const handleFileChangeWithValidation = (event) => {
        handleFileChange(event);
        const { name, files } = event.target;
        const file = files[0];
        const updatedFilesDatas = { ...filesDatas, [name]: file };
        const fieldErrors = validateHallmarkInfo(hallmarkInfo, updatedFilesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    return (
        <div className="flex items-center justify-center px-2 sm:px-4">
            <div className="mx-auto w-full bg-white p-4 sm:p-6">
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Hallmark Information</h3>
                    
                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 mb-6">
                        {/* Left Column */}
                        <div>
                            {/* BIS License No */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    BIS License No:
                                </label>
                                <input
                                    type="text"
                                    name="bisLicenseNo"
                                    value={hallmarkInfo.bisLicenseNo}
                                    onChange={handleHallmarkInputValidation}
                                    placeholder="Enter BIS License Number"
                                    className={`w-full rounded-md border ${errors.bisLicenseNo ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bisLicenseNo && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bisLicenseNo}</p>
                                )}
                            </div>

                            {/* Certificate Valid From */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Certificate Valid From:
                                </label>
                                <input
                                    type="date"
                                    name="certificateValidFrom"
                                    value={hallmarkInfo.certificateValidFrom}
                                    onChange={handleHallmarkInputValidation}
                                    className={`w-full rounded-md border ${errors.certificateValidFrom ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.certificateValidFrom && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.certificateValidFrom}</p>
                                )}
                            </div>

                            {/* Certificate Valid To */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Certificate Valid To:
                                </label>
                                <input
                                    type="date"
                                    name="certificateValidTo"
                                    value={hallmarkInfo.certificateValidTo}
                                    onChange={handleHallmarkInputValidation}
                                    className={`w-full rounded-md border ${errors.certificateValidTo ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.certificateValidTo && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.certificateValidTo}</p>
                                )}
                            </div>

                            {/* Insurance */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Insurance:
                                </label>
                                <select
                                    name="hasInsurance"
                                    value={hallmarkInfo.hasInsurance}
                                    onChange={handleHallmarkInputValidation}
                                    className={`w-full rounded-md border ${errors.hasInsurance ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                >
                                    <option value="">Select Insurance</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                {errors.hasInsurance && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.hasInsurance}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Insurance Fields (Conditional) */}
                        <div>
                            {hallmarkInfo.hasInsurance === "Yes" && (
                                <>
                                    {/* Insurance Company */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                            Insurance Company:
                                        </label>
                                        <input
                                            type="text"
                                            name="insuranceCompany"
                                            value={hallmarkInfo.insuranceCompany}
                                            onChange={handleHallmarkInputValidation}
                                            placeholder="Enter Insurance Company Name"
                                            className={`w-full rounded-md border ${errors.insuranceCompany ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        />
                                        {errors.insuranceCompany && (
                                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.insuranceCompany}</p>
                                        )}
                                    </div>

                                    {/* Insurance Amount */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                            Insurance Amount:
                                        </label>
                                        <input
                                            type="number"
                                            name="insuranceAmount"
                                            value={hallmarkInfo.insuranceAmount}
                                            onChange={handleHallmarkInputValidation}
                                            placeholder="Enter Insurance Amount"
                                            className={`w-full rounded-md border ${errors.insuranceAmount ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        />
                                        {errors.insuranceAmount && (
                                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.insuranceAmount}</p>
                                        )}
                                    </div>

                                    {/* Policy Start Date */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                            Policy Start Date:
                                        </label>
                                        <input
                                            type="date"
                                            name="policyStartDate"
                                            value={hallmarkInfo.policyStartDate}
                                            onChange={handleHallmarkInputValidation}
                                            className={`w-full rounded-md border ${errors.policyStartDate ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        />
                                        {errors.policyStartDate && (
                                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.policyStartDate}</p>
                                        )}
                                    </div>

                                    {/* Endorsement Date */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                            Endorsement Effective Date:
                                        </label>
                                        <input
                                            type="date"
                                            name="endorsementDate"
                                            value={hallmarkInfo.endorsementDate}
                                            onChange={handleHallmarkInputValidation}
                                            className={`w-full rounded-md border ${errors.endorsementDate ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        />
                                        {errors.endorsementDate && (
                                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.endorsementDate}</p>
                                        )}
                                    </div>

                                    {/* Policy End Date */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                            Policy End Date:
                                        </label>
                                        <input
                                            type="date"
                                            name="policyEndDate"
                                            value={hallmarkInfo.policyEndDate}
                                            onChange={handleHallmarkInputValidation}
                                            className={`w-full rounded-md border ${errors.policyEndDate ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        />
                                        {errors.policyEndDate && (
                                            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.policyEndDate}</p>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6'>
                        {/* BIS Certificate Upload */}
                        <div className="mb-5">
                            {filesDatas.bisFile || fileDatasUrl.bisFile ? (
                                <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                    <p className="text-sm sm:text-base font-medium mb-2">Uploaded BIS Certificate:</p>
                                    {filesDatas.bisFile?.type === "application/pdf" || fileDatasUrl.bisFile?.endsWith(".pdf") ? (
                                        <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.bisFile?.name || getFileName(fileDatasUrl?.bisFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.bisFile ? URL.createObjectURL(filesDatas.bisFile) : fileDatasUrl.bisFile}
                                            alt="BIS Certificate Preview"
                                            className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex gap-2 sm:gap-4 mt-2">
                                        <button
                                            onClick={(event) => handleViewImage(filesDatas.bisFile, event, fileDatasUrl.bisFile)}
                                            className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleFileDelete('bisFile', fileDatasUrl.bisFile)}
                                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-xs mt-1">BIS File: {fileSizes["bisFile"]} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-2 block text-sm sm:text-base font-medium">
                                        Upload BIS Certificate
                                    </label>
                                    <input
                                        type="file"
                                        name="bisFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.bisFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.bisFile && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bisFile}</p>
                            )}
                        </div>

                        {/* Insurance Document Upload */}
                        {hallmarkInfo.hasInsurance === "Yes" && (
                            <div className="mb-5">
                                {filesDatas.insuranceFile || fileDatasUrl.insuranceFile ? (
                                    <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                        <p className="text-sm sm:text-base font-medium mb-2">Uploaded Insurance Document:</p>
                                        {filesDatas.insuranceFile?.type === "application/pdf" || fileDatasUrl.insuranceFile?.endsWith(".pdf") ? (
                                            <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.insuranceFile?.name || getFileName(fileDatasUrl?.insuranceFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.insuranceFile ? URL.createObjectURL(filesDatas.insuranceFile) : fileDatasUrl.insuranceFile}
                                                alt="Insurance Document Preview"
                                                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex gap-2 sm:gap-4 mt-2">
                                            <button
                                                onClick={(event) => handleViewImage(filesDatas.insuranceFile, event, fileDatasUrl.insuranceFile)}
                                                className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleFileDelete('insuranceFile', fileDatasUrl.insuranceFile)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <p className="text-xs mt-1">Insurance File: {fileSizes["insuranceFile"]} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm sm:text-base font-medium">
                                            Upload Insurance Document
                                        </label>
                                        <input
                                            type="file"
                                            name="insuranceFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.insuranceFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.insuranceFile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.insuranceFile}</p>
                                )}
                            </div>
                        )}

                        {/* Hallmark Quotation Upload */}
                        <div className="mb-5">
                            {filesDatas.quotationFile || fileDatasUrl.quotationFile ? (
                                <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                    <p className="text-sm sm:text-base font-medium mb-2">Uploaded Hallmark Quotation:</p>
                                    {filesDatas.quotationFile?.type === "application/pdf" || fileDatasUrl.quotationFile?.endsWith(".pdf") ? (
                                        <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.quotationFile?.name || getFileName(fileDatasUrl?.quotationFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.quotationFile ? URL.createObjectURL(filesDatas.quotationFile) : fileDatasUrl.quotationFile}
                                            alt="Quotation Preview"
                                            className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex gap-2 sm:gap-4 mt-2">
                                        <button
                                            onClick={(event) => handleViewImage(filesDatas.quotationFile, event, fileDatasUrl.quotationFile)}
                                            className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleFileDelete('quotationFile', fileDatasUrl.quotationFile)}
                                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-xs mt-1">Quotation File: {fileSizes["quotationFile"]} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-2 block text-sm sm:text-base font-medium">
                                        Upload Hallmark Quotation
                                    </label>
                                    <input
                                        type="file"
                                        name="quotationFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.quotationFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.quotationFile && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.quotationFile}</p>
                            )}
                        </div>

                        {/* Authorized Person Details Upload */}
                        <div className="mb-5">
                            {filesDatas.authPersonFile || fileDatasUrl.authPersonFile ? (
                                <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                    <p className="text-sm sm:text-base font-medium mb-2">Uploaded Auth Person Details:</p>
                                    {filesDatas.authPersonFile?.type === "application/pdf" || fileDatasUrl.authPersonFile?.endsWith(".pdf") ? (
                                        <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.authPersonFile?.name || getFileName(fileDatasUrl?.authPersonFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.authPersonFile ? URL.createObjectURL(filesDatas.authPersonFile) : fileDatasUrl.authPersonFile}
                                            alt="Auth Person Details Preview"
                                            className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex gap-2 sm:gap-4 mt-2">
                                        <button
                                            onClick={(event) => handleViewImage(filesDatas.authPersonFile, event, fileDatasUrl.authPersonFile)}
                                            className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleFileDelete('authPersonFile', fileDatasUrl.authPersonFile)}
                                            className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <p className="text-xs mt-1">Auth Person File: {fileSizes["authPersonFile"]} KB</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-2 block text-sm sm:text-base font-medium">
                                        Upload Authorized Person Details
                                    </label>
                                    <input
                                        type="file"
                                        name="authPersonFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.authPersonFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.authPersonFile && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.authPersonFile}</p>
                            )}
                        </div>
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

export default HallmarkInformation;
