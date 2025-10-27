import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import axios from 'axios';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';

const ContactInformation = () => {
    const { handleContactInputChange, contactInfo, setContactInfo, validateContactInfo, errors, setErrors, filesDatas, handleFileChange,handleFileDelete,handleViewImage,fileDatasUrl,getFileName,userRole } = useContext(KycContext);
    const { setActiveSection,setActiveComponent } = useContext(DashBoardContext)
    // const [errors, setErrors] = useState({});
console.log(fileDatasUrl?.accountsFile)
    const handleValidate = () => {
        const validationErrors = validateContactInfo(contactInfo, filesDatas,fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));
        return Object.keys(validationErrors).length === 0;
    };
    console.log(fileDatasUrl)
    const handleNext = () => {
        if (handleValidate()) {
            localStorage.setItem("KycContact",JSON.stringify(contactInfo))

            setActiveComponent(userRole.includes("Hallmark")?"Hallmark Information":"Trade Information");
            // setActiveSection("Business Information");
        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };
    const handleInputChangeWithValidation = (event) => {
        handleContactInputChange(event); // Update the form data
        const { name, value } = event.target;

        // Validate the specific field
        const fieldErrors = validateContactInfo({ ...contactInfo, [name]: value }, filesDatas,fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    }; console.log(errors)
    const handleFileChangeWithValidation = (event) => {
        handleFileChange(event); // Update the file data
        const { name, files } = event.target;
        const file = files[0];

        // Update the filesDatas with the new file
        const updatedFilesDatas = { ...filesDatas, [name]: file };

        // Validate the specific file field
        const fieldErrors = validateContactInfo(contactInfo, updatedFilesDatas,fileDatasUrl);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };
    return (
        <div className="container mx-auto p-4">
            <form >
                <h3 className="font-bold text-center mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="form-group">
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Owner</label>
                            </div>
                            <div className="md:w-2/3">
                                <select className={`md:w-full w-full rounded-md border ${errors.owner ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='owner' onChange={handleInputChangeWithValidation} value={contactInfo.owner}>
                                    <option></option>
                                    <option value="Director">Director</option>
                                    <option value="Patner">Patner</option>
                                    <option value="Proprietor">Proprietor</option>
                                </select>
                                {errors.owner && (
                                    <p className="text-red-500 text-sm mt-1">{errors.owner}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Name     </label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='ownername'
                                    value={contactInfo.ownername}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={50}
                                    className={`md:w-full w-full rounded-md border ${errors.ownername ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.ownername && (
                                    <p className="text-red-500 text-sm mt-1">{errors.ownername}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Mobile</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='ownermobile'
                                    value={contactInfo.ownermobile}
                                    onChange={handleInputChangeWithValidation}
                                    maxLength={10}
                                    className={`md:w-full w-full rounded-md border ${errors.ownermobile ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.ownermobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.ownermobile}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>E-Mail</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="email"
                                    name='owneremail'
                                    value={contactInfo.owneremail}
                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.owneremail ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.owneremail && (
                                    <p className="text-red-500 text-sm mt-1">{errors.owneremail}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Business Operations</label>
                            </div>
                            <div className="md:w-2/3">
                                <select className={`md:w-full w-full rounded-md border ${errors.businessoperation ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='businessoperation'
                                    value={contactInfo.businessoperation}
                                    onChange={handleInputChangeWithValidation}>
                                    <option value=""></option>

                                    <option value="General Manager">General Manager</option>
                                    <option value="Asst General Manager">Asst General Manager</option>
                                    <option value="Sales Manager">Sales Manager</option>
                                    <option value="Marketing Manager">Marketing Manager</option>
                                </select>
                                {errors.businessoperation && (
                                    <p className="text-red-500 text-sm mt-1">{errors.businessoperation}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Name</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='boname'
                                    value={contactInfo.boname}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation}
                                    className={`md:w-full w-full rounded-md border ${errors.boname ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.boname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.boname}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Mobile</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='bomobile'
                                    value={contactInfo.bomobile}
                                    maxLength={10}

                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.bomobile ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.bomobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.bomobile}</p>
                                )}
                            </div>
                        </div>
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>E-Mail</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="email"
                                    name='boemail'
                                    value={contactInfo.boemail}

                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.boemail ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.boemail && (
                                    <p className="text-red-500 text-sm mt-1">{errors.boemail}</p>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="form-group">
                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label className="block font-medium">Accounts</label>
                            </div>
                            <div className="md:w-2/3">
                                <select className={`md:w-full w-full rounded-md border ${errors.accounts ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    name='accounts' onChange={handleInputChangeWithValidation}
                                    value={contactInfo.accounts}>
                                    <option value="" ></option>

                                    <option value="Accounts manager" >Accounts manager</option>
                                    <option value="Payment manager">Payment manager</option>
                                    <option value="Accounts Incharge"> Accounts Incharge</option>
                                    <option value="Payment Incharge">Payment Incharge</option>

                                </select>
                                {errors.accounts && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accounts}</p>
                                )}
                            </div>
                        </div>

                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Name</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='accname'
                                    value={contactInfo.accname}
                                    maxLength={50}
                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.accname ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.accname && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accname}</p>
                                )}
                            </div>
                        </div>

                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>Mobile</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="text"
                                    name='accmobile'
                                    value={contactInfo.accmobile}
                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.accmobile ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                        maxLength={10}

                                />
                                {errors.accmobile && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accmobile}</p>
                                )}
                            </div>
                        </div>

                        <div className="md:flex md:items-center mt-2 mb-6">
                            <div className='md:w-1/3 text-center block font-medium'>
                                <label>E-Mail</label>
                            </div>
                            <div className="md:w-2/3">
                                <input type="email"
                                    name='accemail'
                                    value={contactInfo.accemail}
                                    onChange={handleInputChangeWithValidation} className={`md:w-full w-full rounded-md border ${errors.accemail ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.accemail && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accemail}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row grid grid-cols-3 gap-12 justify-center items-center'>
                    {contactInfo.owner && (
                        <div className="mb-5 w-[400px]">

                            {filesDatas.ownerFile||fileDatasUrl.ownerFile ? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded {contactInfo.owner} Business  Card:</p>
                                    {filesDatas.ownerFile?.type === "application/pdf" ||fileDatasUrl.ownerFile?.endsWith(".pdf")||fileDatasUrl.ownerFile?.endsWith("blob")? (
                                        <p className="text-sm text-gray-700">{filesDatas?.ownerFile?.name||getFileName(fileDatasUrl?.ownerFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.ownerFile?URL.createObjectURL(filesDatas.ownerFile) : fileDatasUrl.ownerFile?.startsWith('"') && fileDatasUrl.ownerFile?.endsWith('"')
                                                ? fileDatasUrl.ownerFile.slice(1, -1)
                                                : fileDatasUrl.ownerFile}
                                            alt="Owner Card Uploaded Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                   
                    
                                     <button
                                    onClick={(event) => handleViewImage(filesDatas.ownerFile,event,fileDatasUrl.ownerFile)}
                                    className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                >
                                    View
                                </button>
                                    <button
                                        onClick={() => handleFileDelete('ownerFile',fileDatasUrl.ownerFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload {contactInfo.owner} Business Card
                                    </label>

                                    <input
                                        type="file"
                                        name="ownerFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.ownerFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                            } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.ownerFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.ownerFile}</p>
                            )}
                        </div>
                    )}

                    {contactInfo.businessoperation&& (
                        <div className="mb-5 w-[400px]">

                            {filesDatas.boFile ||fileDatasUrl.boFile? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded {contactInfo.businessoperation} Business  Card:</p>
                                    {filesDatas.boFile?.type === "application/pdf"||fileDatasUrl.boFile?.endsWith(".pdf")||fileDatasUrl.boFile?.endsWith("blob") ? (
                                        <p className="text-sm text-gray-700">{filesDatas?.boFile?.name||getFileName(fileDatasUrl?.boFile)}</p>
                                    ) : (
                                        <img
                                            src={filesDatas.boFile?URL.createObjectURL(filesDatas.boFile) : fileDatasUrl.boFile?.startsWith('"') && fileDatasUrl.boFile?.endsWith('"')
                                                ? fileDatasUrl.boFile.slice(1, -1)
                                                : fileDatasUrl.boFile}
                                            alt="Business Operation Card Uploaded Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                    
                                     <button
                                    onClick={(event) => handleViewImage(filesDatas.boFile,event,fileDatasUrl.boFile)}
                                    className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                >
                                    View
                                </button>
                                    <button
                                        onClick={() => handleFileDelete('boFile',fileDatasUrl.boFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>

                                </div>
                            ) : (
                                <div>  <label className="mb-3 block text-base font-medium">
                                    Upload {contactInfo.businessoperation} Business  Card
                                </label>

                                    <input
                                        type="file"
                                        name="boFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.boFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                            } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.boFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.boFile}</p>
                            )}
                        </div>
                    )}

                    {contactInfo.accounts && (
                        <div className="mb-5 w-[400px]">

                            {filesDatas.accountsFile ||fileDatasUrl.accountsFile? (
                                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                                    <p className="text-base font-medium mb-2">Uploaded  {contactInfo.accounts} Business Card:</p>
                                    {filesDatas.accountsFile?.type === "application/pdf" ||fileDatasUrl.accountsFile?.endsWith(".pdf")||fileDatasUrl.accountsFile?.endsWith("blob")? (
                                        <p className="text-sm text-gray-700">{filesDatas?.accountsFile?.name||getFileName(fileDatasUrl?.accountsFile)}</p>

                                    ) : (
                                        <img
                                            src={filesDatas.accountsFile?URL.createObjectURL(filesDatas.accountsFile) : fileDatasUrl.accountsFile?.startsWith('"') && fileDatasUrl.accountsFile?.endsWith('"')
                                                ? fileDatasUrl.accountsFile.slice(1, -1)
                                                : fileDatasUrl.accountsFile}
                                            alt="Accounts Card Uploaded Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                    )}
                                       <button
                                    onClick={(event) => handleViewImage(filesDatas.accountsFile,event,fileDatasUrl?.accountsFile)}
                                    className="mt-2 text-green-500 hover:text-green-700 text-sm mr-5"
                                >
                                    View
                                </button>
                                    <button
                                        onClick={() => handleFileDelete('accountsFile',fileDatasUrl.accountsFile)}
                                        className="mt-2 text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Delete
                                    </button>
                                   
                                </div>
                            ) : (
                                <div>
                                    <label className="mb-3 block text-base font-medium">
                                        Upload {contactInfo.accounts} Business Card
                                    </label>
                                    <input
                                        type="file"
                                        name="accountsFile"
                                        accept="application/pdf, image/*"
                                        onChange={handleFileChangeWithValidation}
                                        className={`w-full rounded-md border ${errors.accountsFile ? 'border-red-500' : 'border-[#e0e0e0]'
                                            } bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-black focus:shadow-md`}
                                    />
                                </div>
                            )}
                            {errors.accountsFile && (
                                <p className="text-red-500 text-sm mt-1">{errors.accountsFile}</p>
                            )}
                        </div>
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



                {/* <div className="mt-4 flex justify-end space-x-2">
                <button className="bg-green-500 text-white p-1 rounded-md">New</button>
                <button className="bg-blue-500 text-white p-1 rounded-md">Save</button>
                <button className="bg-gray-500 text-white p-1 rounded-md">Search</button>
                <button className="bg-red-500 text-white p-1 rounded-md">Delete</button>
                <button className="bg-yellow-500 text-white p-1 rounded-md">Cancel</button>
                <button className="bg-blue-500 text-white p-1 rounded-md">Exit</button>
                <button className="bg-purple-500 text-white p-1 rounded-md">RePrint</button>
            </div> */}
            </form>
        </div>
    );
};

export default ContactInformation;
