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
        hallmarkInfo, setHallmarkInfo,handleHallmarkChange,validateHallmarkInfo,userRole
    } = useContext(KycContext);
    
    const { setActiveSection,setActiveComponent } = useContext(DashBoardContext);


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
console.log(hallmarkInfo,filesDatas);
    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto w-full bg-white p-6">
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-6">Hallmark Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column */}
            <div>
              {/* Basic Information Section */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                    BIS License No:
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    type="text"
                    name="bisLicenseNo"
                    value={hallmarkInfo.bisLicenseNo}
                    onChange={handleHallmarkInputValidation}
                    placeholder="Enter BIS License Number"
                    className={`w-64 rounded-md border ${errors.bisLicenseNo ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  />
                  {errors.bisLicenseNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.bisLicenseNo}</p>
                  )}
                </div>
              </div>

              {/* Certificate Validity */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                    Certificate Valid From:
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    type="date"
                    name="certificateValidFrom"
                    value={hallmarkInfo.certificateValidFrom}
                    onChange={handleHallmarkInputValidation}
                    className={`w-64 rounded-md border ${errors.certificateValidFrom ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  />
                  {errors.certificateValidFrom && (
                    <p className="text-red-500 text-sm mt-1">{errors.certificateValidFrom}</p>
                  )}
                </div>
              </div>

              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                    Certificate Valid To:
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    type="date"
                    name="certificateValidTo"
                    value={hallmarkInfo.certificateValidTo}
                    onChange={handleHallmarkInputValidation}
                    className={`w-64 rounded-md border ${errors.certificateValidTo ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  />
                  {errors.certificateValidTo && (
                    <p className="text-red-500 text-sm mt-1">{errors.certificateValidTo}</p>
                  )}
                </div>
              </div>

              {/* Insurance Section */}
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                    Insurance:
                  </label>
                </div>
                <div className="md:w-2/3">
                  <select
                    name="hasInsurance"
                    value={hallmarkInfo.hasInsurance}
                    onChange={handleHallmarkInputValidation}
                    className={`w-64 rounded-md border ${errors.hasInsurance ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {errors.hasInsurance && (
                    <p className="text-red-500 text-sm mt-1">{errors.hasInsurance}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {hallmarkInfo.hasInsurance === "Yes" && (
                <>
                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                        Insurance Company:
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="text"
                        name="insuranceCompany"
                        value={hallmarkInfo.insuranceCompany}
                        onChange={handleHallmarkInputValidation}
                        placeholder="Enter Insurance Company Name"
                        className={`w-64 rounded-md border ${errors.insuranceCompany ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                      />
                      {errors.insuranceCompany && (
                        <p className="text-red-500 text-sm mt-1">{errors.insuranceCompany}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                        Insurance Amount:
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="number"
                        name="insuranceAmount"
                        value={hallmarkInfo.insuranceAmount}
                        onChange={handleHallmarkInputValidation}
                        placeholder="Enter Insurance Amount"
                        className={`w-64 rounded-md border ${errors.insuranceAmount ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                      />
                      {errors.insuranceAmount && (
                        <p className="text-red-500 text-sm mt-1">{errors.insuranceAmount}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                        Policy Start Date:
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="date"
                        name="policyStartDate"
                        value={hallmarkInfo.policyStartDate}
                        onChange={handleHallmarkInputValidation}
                        className={`w-64 rounded-md border ${errors.policyStartDate ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                      />
                      {errors.policyStartDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.policyStartDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                        Endorsement Effective Date:
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="date"
                        name="endorsementDate"
                        value={hallmarkInfo.endorsementDate}
                        onChange={handleHallmarkInputValidation}
                        className={`w-64 rounded-md border ${errors.endorsementDate ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                      />
                      {errors.endorsementDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.endorsementDate}</p>
                      )}
                    </div>
                  </div>

                  <div className="md:flex md:items-center mb-6">
                    <div className="md:w-1/3">
                      <label className="block text-black font-bold text-center mb-1 md:mb-0 pr-4 text-base font-medium">
                        Policy End Date:
                      </label>
                    </div>
                    <div className="md:w-2/3">
                      <input
                        type="date"
                        name="policyEndDate"
                        value={hallmarkInfo.policyEndDate}
                        onChange={handleHallmarkInputValidation}
                        className={`w-64 rounded-md border ${errors.policyEndDate ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                      />
                      {errors.policyEndDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.policyEndDate}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
                    {/* File Upload Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                        {/* BIS Certificate Upload */}
                        <div className="mb-5">
                            {filesDatas.bisFile || fileDatasUrl.bisFile ? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded BIS Certificate:</p>
                                    {filesDatas.bisFile?.type === "application/pdf" || fileDatasUrl.bisFile?.endsWith(".pdf") ? (
                                        <p className="text-sm text-gray-700">{filesDatas?.bisFile?.name || getFileName(fileDatasUrl?.bisFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.bisFile ? URL.createObjectURL(filesDatas.bisFile) : fileDatasUrl.bisFile}
                                            alt="BIS Certificate Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.bisFile, event, fileDatasUrl.bisFile)}
                                        className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete('bisFile', fileDatasUrl.bisFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <p>
                                        BIS File: {fileSizes["bisFile"]} KB
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload BIS Certificate
                                    </label>
                                    <input
                                        type="file"
                                        name="bisFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.bisFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.bisFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.bisFile}</p>
                            )}
                        </div>

                        {/* Insurance Document Upload */}
                        {hallmarkInfo.hasInsurance === "Yes" && (
                            <div className="mb-5">
                                {filesDatas.insuranceFile || fileDatasUrl.insuranceFile ? (
                                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                        <p className="text-base font-medium mb-2">Uploaded Insurance Document:</p>
                                        {filesDatas.insuranceFile?.type === "application/pdf" || fileDatasUrl.insuranceFile?.endsWith(".pdf") ? (
                                            <p className="text-sm text-gray-700">{filesDatas?.insuranceFile?.name || getFileName(fileDatasUrl?.insuranceFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.insuranceFile ? URL.createObjectURL(filesDatas.insuranceFile) : fileDatasUrl.insuranceFile}
                                                alt="Insurance Document Preview"
                                                className="h-32 w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <button
                                            onClick={(event) => handleViewImage(filesDatas.insuranceFile, event, fileDatasUrl.insuranceFile)}
                                            className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleFileDelete('insuranceFile', fileDatasUrl.insuranceFile)}
                                            className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Delete
                                        </button>
                                        <p>
                                            Insurance File: {fileSizes["insuranceFile"]} KB
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-3 block text-base font-medium">
                                            Upload Insurance Document
                                        </label>
                                        <input
                                            type="file"
                                            name="insuranceFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.insuranceFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.insuranceFile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.insuranceFile}</p>
                                )}
                            </div>
                        )}

                        {/* Hallmark Quotation Upload */}
                        <div className="mb-5">
                            {filesDatas.quotationFile || fileDatasUrl.quotationFile ? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded Hallmark Quotation:</p>
                                    {filesDatas.quotationFile?.type === "application/pdf" || fileDatasUrl.quotationFile?.endsWith(".pdf") ? (
                                        <p className="text-sm text-gray-700">{filesDatas?.quotationFile?.name || getFileName(fileDatasUrl?.quotationFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.quotationFile ? URL.createObjectURL(filesDatas.quotationFile) : fileDatasUrl.quotationFile}
                                            alt="Quotation Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.quotationFile, event, fileDatasUrl.quotationFile)}
                                        className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete('quotationFile', fileDatasUrl.quotationFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <p>
                                        Quotation File: {fileSizes["quotationFile"]} KB
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload Hallmark Quotation
                                    </label>
                                    <input
                                        type="file"
                                        name="quotationFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.quotationFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.quotationFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.quotationFile}</p>
                            )}
                        </div>

                        {/* Authorized Person Details Upload */}
                        <div className="mb-5">
                            {filesDatas.authPersonFile || fileDatasUrl.authPersonFile ? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded Auth Person Details:</p>
                                    {filesDatas.authPersonFile?.type === "application/pdf" || fileDatasUrl.authPersonFile?.endsWith(".pdf") ? (
                                        <p className="text-sm text-gray-700">{filesDatas?.authPersonFile?.name || getFileName(fileDatasUrl?.authPersonFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.authPersonFile ? URL.createObjectURL(filesDatas.authPersonFile) : fileDatasUrl.authPersonFile}
                                            alt="Auth Person Details Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                    <button
                                        onClick={(event) => handleViewImage(filesDatas.authPersonFile, event, fileDatasUrl.authPersonFile)}
                                        className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleFileDelete('authPersonFile', fileDatasUrl.authPersonFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                    <p>
                                        Auth Person File: {fileSizes["authPersonFile"]} KB
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload Authorized Person Details
                                    </label>
                                    <input
                                        type="file"
                                        name="authPersonFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.authPersonFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.authPersonFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.authPersonFile}</p>
                            )}
                        </div>
                    </div>

                    {/* Next Button */}
                    <div className='flex justify-center mt-8'>
                        <button
                            type="button"
                            className="rounded-md bg-blue-500 py-2 px-6 text-base font-semibold text-white outline-none hover:shadow-form"
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