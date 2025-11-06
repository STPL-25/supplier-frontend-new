import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import axios from 'axios';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

const ContactInformation = () => {
    const { 
        handleContactInputChange, 
        contactInfo, 
        setContactInfo, 
        validateContactInfo, 
        errors, 
        setErrors, 
        filesDatas, 
        handleFileChange,
        handleFileDelete,
        handleViewImage,
        fileDatasUrl,
        getFileName,
        userRole 
    } = useContext(KycContext);
    
    const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);

    const handleValidate = () => {
        const validationErrors = validateContactInfo(contactInfo, filesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));
        return Object.keys(validationErrors).length === 0;
    };

    const handleNext = () => {
        if (handleValidate()) {
            localStorage.setItem("KycContact", JSON.stringify(contactInfo));
            setActiveComponent(userRole.includes("Hallmark") ? "Hallmark Information" : "Trade Information");
        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };

    const handleInputChangeWithValidation = (event) => {
        handleContactInputChange(event);
        const { name, value } = event.target;

        const fieldErrors = validateContactInfo({ ...contactInfo, [name]: value }, filesDatas, fileDatasUrl);
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

        const fieldErrors = validateContactInfo(contactInfo, updatedFilesDatas, fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    return (
        <div className="flex items-center justify-center px-2 sm:px-4">
            <div className="mx-auto w-full bg-white p-4 sm:p-6">
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Contact Information</h3>
                    
                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 mb-6">
                        {/* Owner Section */}
                        <div>
                            {/* Owner Type */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Owner:
                                </label>
                                <select 
                                    className={`w-full rounded-md border ${errors.owner ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='owner' 
                                    onChange={handleInputChangeWithValidation} 
                                    value={contactInfo.owner}
                                >
                                    <option value="">Select Owner Type</option>
                                    <option value="Director">Director</option>
                                    <option value="Patner">Patner</option>
                                    <option value="Proprietor">Proprietor</option>
                                </select>
                                {errors.owner && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.owner}</p>
                                )}
                            </div>

                            {/* Owner Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Name:
                                </label>
                                <input 
                                    type="text"
                                    name='ownername'
                                    value={contactInfo.ownername}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={50}
                                    placeholder="Enter Owner Name"
                                    className={`w-full rounded-md border ${errors.ownername ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.ownername && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ownername}</p>
                                )}
                            </div>

                            {/* Owner Mobile */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Mobile:
                                </label>
                                <input 
                                    type="text"
                                    name='ownermobile'
                                    value={contactInfo.ownermobile}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={10}
                                    placeholder="Enter Mobile Number"
                                    className={`w-full rounded-md border ${errors.ownermobile ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.ownermobile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ownermobile}</p>
                                )}
                            </div>

                            {/* Owner Email */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    E-Mail:
                                </label>
                                <input 
                                    type="email"
                                    name='owneremail'
                                    value={contactInfo.owneremail}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Email Address"
                                    className={`w-full rounded-md border ${errors.owneremail ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.owneremail && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.owneremail}</p>
                                )}
                            </div>
                        </div>

                        {/* Business Operations Section */}
                        <div>
                            {/* Business Operation Type */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Business Operations:
                                </label>
                                <select 
                                    className={`w-full rounded-md border ${errors.businessoperation ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='businessoperation'
                                    value={contactInfo.businessoperation}
                                    onChange={handleInputChangeWithValidation}
                                >
                                    <option value="">Select Position</option>
                                    <option value="General Manager">General Manager</option>
                                    <option value="Asst General Manager">Asst General Manager</option>
                                    <option value="Sales Manager">Sales Manager</option>
                                    <option value="Marketing Manager">Marketing Manager</option>
                                </select>
                                {errors.businessoperation && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.businessoperation}</p>
                                )}
                            </div>

                            {/* Business Operation Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Name:
                                </label>
                                <input 
                                    type="text"
                                    name='boname'
                                    value={contactInfo.boname}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Name"
                                    className={`w-full rounded-md border ${errors.boname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.boname && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.boname}</p>
                                )}
                            </div>

                            {/* Business Operation Mobile */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Mobile:
                                </label>
                                <input 
                                    type="text"
                                    name='bomobile'
                                    value={contactInfo.bomobile}
                                    maxLength={10}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Mobile Number"
                                    className={`w-full rounded-md border ${errors.bomobile ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bomobile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.bomobile}</p>
                                )}
                            </div>

                            {/* Business Operation Email */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    E-Mail:
                                </label>
                                <input 
                                    type="email"
                                    name='boemail'
                                    value={contactInfo.boemail}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Email Address"
                                    className={`w-full rounded-md border ${errors.boemail ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.boemail && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.boemail}</p>
                                )}
                            </div>
                        </div>

                        {/* Accounts Section */}
                        <div>
                            {/* Accounts Type */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Accounts:
                                </label>
                                <select 
                                    className={`w-full rounded-md border ${errors.accounts ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='accounts' 
                                    onChange={handleInputChangeWithValidation}
                                    value={contactInfo.accounts}
                                >
                                    <option value="">Select Position</option>
                                    <option value="Accounts manager">Accounts manager</option>
                                    <option value="Payment manager">Payment manager</option>
                                    <option value="Accounts Incharge">Accounts Incharge</option>
                                    <option value="Payment Incharge">Payment Incharge</option>
                                </select>
                                {errors.accounts && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.accounts}</p>
                                )}
                            </div>

                            {/* Accounts Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Name:
                                </label>
                                <input 
                                    type="text"
                                    name='accname'
                                    value={contactInfo.accname}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Name"
                                    className={`w-full rounded-md border ${errors.accname ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.accname && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.accname}</p>
                                )}
                            </div>

                            {/* Accounts Mobile */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Mobile:
                                </label>
                                <input 
                                    type="text"
                                    name='accmobile'
                                    value={contactInfo.accmobile}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={10}
                                    placeholder="Enter Mobile Number"
                                    className={`w-full rounded-md border ${errors.accmobile ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.accmobile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.accmobile}</p>
                                )}
                            </div>

                            {/* Accounts Email */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    E-Mail:
                                </label>
                                <input 
                                    type="email"
                                    name='accemail'
                                    value={contactInfo.accemail}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Email Address"
                                    className={`w-full rounded-md border ${errors.accemail ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.accemail && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.accemail}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* File Uploads Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6'>
                        {/* Owner File Upload */}
                        {contactInfo.owner && (
                            <div className="mb-5">
                                {filesDatas.ownerFile || fileDatasUrl.ownerFile ? (
                                    <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                        <p className="text-sm sm:text-base font-medium mb-2">Uploaded {contactInfo.owner} Business Card:</p>
                                        {filesDatas.ownerFile?.type === "application/pdf" || fileDatasUrl.ownerFile?.endsWith(".pdf") || fileDatasUrl.ownerFile?.endsWith("blob") ? (
                                            <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.ownerFile?.name || getFileName(fileDatasUrl?.ownerFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.ownerFile ? URL.createObjectURL(filesDatas.ownerFile) : fileDatasUrl.ownerFile?.startsWith('"') && fileDatasUrl.ownerFile?.endsWith('"')
                                                    ? fileDatasUrl.ownerFile.slice(1, -1)
                                                    : fileDatasUrl.ownerFile}
                                                alt="Owner Card Uploaded Preview"
                                                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex gap-2 sm:gap-4 mt-2">
                                            <button
                                                onClick={(event) => handleViewImage(filesDatas.ownerFile, event, fileDatasUrl.ownerFile)}
                                                className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleFileDelete('ownerFile', fileDatasUrl.ownerFile)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm sm:text-base font-medium">
                                            Upload {contactInfo.owner} Business Card
                                        </label>
                                        <input
                                            type="file"
                                            name="ownerFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.ownerFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.ownerFile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ownerFile}</p>
                                )}
                            </div>
                        )}

                        {/* Business Operation File Upload */}
                        {contactInfo.businessoperation && (
                            <div className="mb-5">
                                {filesDatas.boFile || fileDatasUrl.boFile ? (
                                    <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                        <p className="text-sm sm:text-base font-medium mb-2">Uploaded {contactInfo.businessoperation} Business Card:</p>
                                        {filesDatas.boFile?.type === "application/pdf" || fileDatasUrl.boFile?.endsWith(".pdf") || fileDatasUrl.boFile?.endsWith("blob") ? (
                                            <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.boFile?.name || getFileName(fileDatasUrl?.boFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.boFile ? URL.createObjectURL(filesDatas.boFile) : fileDatasUrl.boFile?.startsWith('"') && fileDatasUrl.boFile?.endsWith('"')
                                                    ? fileDatasUrl.boFile.slice(1, -1)
                                                    : fileDatasUrl.boFile}
                                                alt="Business Operation Card Uploaded Preview"
                                                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex gap-2 sm:gap-4 mt-2">
                                            <button
                                                onClick={(event) => handleViewImage(filesDatas.boFile, event, fileDatasUrl.boFile)}
                                                className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleFileDelete('boFile', fileDatasUrl.boFile)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm sm:text-base font-medium">
                                            Upload {contactInfo.businessoperation} Business Card
                                        </label>
                                        <input
                                            type="file"
                                            name="boFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.boFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.boFile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.boFile}</p>
                                )}
                            </div>
                        )}

                        {/* Accounts File Upload */}
                        {contactInfo.accounts && (
                            <div className="mb-5">
                                {filesDatas.accountsFile || fileDatasUrl.accountsFile ? (
                                    <div className="p-3 sm:p-4 border rounded-md bg-gray-50">
                                        <p className="text-sm sm:text-base font-medium mb-2">Uploaded {contactInfo.accounts} Business Card:</p>
                                        {filesDatas.accountsFile?.type === "application/pdf" || fileDatasUrl.accountsFile?.endsWith(".pdf") || fileDatasUrl.accountsFile?.endsWith("blob") ? (
                                            <p className="text-xs sm:text-sm text-gray-700 break-all">{filesDatas?.accountsFile?.name || getFileName(fileDatasUrl?.accountsFile)}</p>
                                        ) : (
                                            <img
                                                src={filesDatas.accountsFile ? URL.createObjectURL(filesDatas.accountsFile) : fileDatasUrl.accountsFile?.startsWith('"') && fileDatasUrl.accountsFile?.endsWith('"')
                                                    ? fileDatasUrl.accountsFile.slice(1, -1)
                                                    : fileDatasUrl.accountsFile}
                                                alt="Accounts Card Uploaded Preview"
                                                className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md"
                                            />
                                        )}
                                        <div className="flex gap-2 sm:gap-4 mt-2">
                                            <button
                                                onClick={(event) => handleViewImage(filesDatas.accountsFile, event, fileDatasUrl?.accountsFile)}
                                                className="text-green-500 hover:text-green-700 text-xs sm:text-sm"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleFileDelete('accountsFile', fileDatasUrl.accountsFile)}
                                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="mb-2 block text-sm sm:text-base font-medium">
                                            Upload {contactInfo.accounts} Business Card
                                        </label>
                                        <input
                                            type="file"
                                            name="accountsFile"
                                            accept="application/pdf, image/*"
                                            onChange={handleFileChangeWithValidation}
                                            className={`w-full rounded-md border ${errors.accountsFile ? 'border-red-500' : 'border-[#e0e0e0]'} bg-white py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                        />
                                    </div>
                                )}
                                {errors.accountsFile && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.accountsFile}</p>
                                )}
                            </div>
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
};

export default ContactInformation;
