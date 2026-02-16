import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import { API } from '../../../config/configData';
import axios from 'axios';
import { se } from 'date-fns/locale/se';
function StatutaoryInformation() {
    const { 
        statutatoryInfo, 
        setStatutatoryInfo, 
        handleStatutaoryInputChange,
        validateStatutoryInfo,
        kycFormData,
        errors,
        setErrors
    } = useContext(KycContext);
    
    const { setActiveSection, setActiveComponent } = useContext(DashBoardContext);

    // Function to validate the entire form
    const handleValidate = () => {
        const validationErrors = validateStatutoryInfo(statutatoryInfo);
        setErrors((prevErrors) => ({
            ...prevErrors,
            ...validationErrors,
        }));
        
        return Object.keys(validationErrors).length === 0;
    };

    // Handle navigation to the next section
    const handleNext = () => {
        if (handleValidate()) {
            localStorage.setItem("KycStat", JSON.stringify(statutatoryInfo));
            setActiveComponent("Banking Information");
        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };

    // Handle input changes with validation
    const handleInputChangeWithValidation = (event) => {
        handleStatutaoryInputChange(event);
        const { name, value } = event.target;

        const fieldErrors = validateStatutoryInfo({ ...statutatoryInfo, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    return (
        <div className="flex items-center justify-center px-2 sm:px-4">
            <div className="mx-auto w-full bg-white p-4 sm:p-6">
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Principal Address</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
                        {/* Left side fields */}
                        <div>
                            {/* Trade Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Trade Name:
                                </label>
                                <input
                                    type="text"
                                    name="tradename"
                                    value={statutatoryInfo.tradename}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Trade Name"
                                    maxLength={70}
                                    className={`w-full rounded-md border ${
                                        errors.tradename ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradename && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradename}</p>
                                )}
                            </div>

                            {/* Legal Name */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Legal Name:
                                </label>
                                <input
                                    type="text"
                                    name="readelegalname"
                                    value={statutatoryInfo.readelegalname}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Legal Name"
                                    maxLength={70}
                                    className={`w-full rounded-md border ${
                                        errors.readelegalname ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.readelegalname && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.readelegalname}</p>
                                )}
                            </div>

                            {/* Door No */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Door No:
                                </label>
                                <input
                                    type="text"
                                    name="tradedoorno"
                                    value={statutatoryInfo.tradedoorno}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Door No"
                                    maxLength={30}
                                    className={`w-full rounded-md border ${
                                        errors.tradedoorno ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradedoorno && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradedoorno}</p>
                                )}
                            </div>

                            {/* Street */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Street:
                                </label>
                                <input
                                    type="text"
                                    name="tradestreet"
                                    value={statutatoryInfo.tradestreet}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Street"
                                    maxLength={60}
                                    className={`w-full rounded-md border ${
                                        errors.tradestreet ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradestreet && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradestreet}</p>
                                )}
                            </div>
                        </div>

                        {/* Right side fields */}
                        <div>
                            {/* Area */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Area:
                                </label>
                                <input
                                    type="text"
                                    name="tradearea"
                                    value={statutatoryInfo.tradearea}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Area"
                                    maxLength={30}
                                    className={`w-full rounded-md border ${
                                        errors.tradearea ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradearea && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradearea}</p>
                                )}
                            </div>

                            {/* State Code */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    State Code:
                                </label>
                                <input
                                    type="text"
                                    name="tradestatecode"
                                    value={statutatoryInfo.tradestatecode}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter State Code"
                                    disabled
                                    className={`w-full rounded-md border ${
                                        errors.tradestatecode ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradestatecode && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradestatecode}</p>
                                )}
                            </div>

                            {/* Pin Code */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Pin Code:
                                </label>
                                <input
                                    type="text"
                                    name="tradepincode"
                                    value={statutatoryInfo.tradepincode}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Pin Code"
                                    maxLength={6}
                                    className={`w-full rounded-md border ${
                                        errors.tradepincode ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradepincode && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradepincode}</p>
                                )}
                            </div>

                            {/* Date Of Incorporation */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Date Of Incorporation (As per Pan Card ):
                                </label>
                                <input
                                    type="date"
                                    name="tradeDoI"
                                    value={statutatoryInfo.tradeDoI}
                                    onChange={handleInputChangeWithValidation}
                                    placeholder="Enter Date Of Incorporation"
                                    className={`w-full rounded-md border ${
                                        errors.tradeDoI ? 'border-red-500' : 'border-gray-400'
                                    } bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                />
                                {errors.tradeDoI && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.tradeDoI}</p>
                                )}
                            </div>
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

export default StatutaoryInformation;
