import { useContext, useState } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TradeInformation() {
    const { 
        handleTradeBusinessInputChange, 
        tradeBusinessInfo,  
        handleSubmit,
        validateTradeInfo, 
        errors, 
        setErrors, 
        kycFormData, 
        filesDatas, 
        statutatoryInfo,
        validate, 
        validateStatutoryInfo, 
        validateBankingInfo, 
        accInfo, 
        validateContactInfo, 
        contactInfo, 
        validateBusinessInfo, 
        errorMessage, 
        successMsg,
        fileDatasUrl,
        validateHallmarkInfo,
        userRole,
        hallmarkInfo
    } = useContext(KycContext);
    
    const { setActiveSection } = useContext(DashBoardContext);

    // Function to validate the entire form
    const handleValidate = () => {
        setErrors({});
    
        const validationErrors = validateTradeInfo(tradeBusinessInfo);
        const supplierKYcvalidationErrors = validate(kycFormData, filesDatas, fileDatasUrl);
        const statutaryValidationErrors = validateStatutoryInfo(statutatoryInfo);
        const bankingValidationErrors = validateBankingInfo(accInfo, filesDatas, fileDatasUrl);
        const contactValidationErrors = validateContactInfo(contactInfo, filesDatas, fileDatasUrl);
        let hallmarkValidationErrors = {};
        
        if(userRole.includes("Hallmark")){
            hallmarkValidationErrors = validateHallmarkInfo(hallmarkInfo, filesDatas, fileDatasUrl);
        }
    
        const combinedErrors = {
            ...validationErrors,
            ...supplierKYcvalidationErrors,
            ...statutaryValidationErrors,
            ...bankingValidationErrors,
            ...contactValidationErrors,
            ...hallmarkValidationErrors,
        };
    
        console.log(combinedErrors);
        setErrors(combinedErrors);
    
        return Object.keys(combinedErrors).length === 0;
    };

    // Wrapper function for form submission
    const validationTradeBusiness = async () => {
        const isValid = handleValidate();
        if (isValid) {
            localStorage.setItem("KycTrade", JSON.stringify(tradeBusinessInfo));

            const result = await handleSubmit();
            console.log(result);
            if (result.success) {
                toast.success("KYC Data's submitted successfully!");
            } else {
                toast.error(result.message);
            }
        } else {
            toast.error("Validation errors occurred. Please check your input.");
        }
    };

    // Handle input changes with validation
    const handleInputChangeWithValidation = (event) => {
        handleTradeBusinessInputChange(event);
        const { name, value } = event.target;

        const fieldErrors = validateTradeInfo({ ...tradeBusinessInfo, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    const mainCatagoryLists = ["", "Bullion", "Gold", "Diamond", "Platinum", "Silver", "Gem Stones", "Gift Articles","Gold Hallmark","Silver Hallmark"];

    return (
        <div className="flex items-center justify-center px-2 sm:px-4">
            <div className="mx-auto w-full bg-white p-4 sm:p-6">
                <ToastContainer /> 
                <form className='w-full'>
                    <h3 className="font-bold text-center mb-4 sm:mb-6 text-lg sm:text-xl">Trade Information</h3>
                    
                    <div className="grid grid-cols-1 gap-6 sm:gap-10">
                        {/* Main Category Section */}
                        <div>
                            {/* Main Category Select */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm sm:text-base font-medium text-black">
                                    Main Category:
                                </label>
                                <select 
                                    className={`w-full rounded-md border ${errors.maincatogory ? 'border-red-500' : 'border-gray-400'} bg-white py-2 px-4 text-sm sm:text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} 
                                    name='maincatogory' 
                                    onChange={handleInputChangeWithValidation} 
                                    value={tradeBusinessInfo.maincatogory}
                                >
                                    {mainCatagoryLists.map((data, index) => (
                                        <option key={index} value={data}>
                                            {data || "Select Main Category"}
                                        </option>
                                    ))}
                                </select>
                                {errors.maincatogory && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.maincatogory}</p>
                                )}
                            </div>

                            {/* Trade Metals Checkboxes */}
                            <div className="mb-6">
                                <label className="mb-3 block text-sm sm:text-base font-medium text-black">
                                    Trade Metals:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-400 rounded-md bg-white">
                                    {mainCatagoryLists.slice(1).map((category, index) => (
                                        <div className="flex items-center" key={index}>
                                            <input 
                                                type="checkbox" 
                                                id={`metal-${index}`}
                                                className="h-4 w-4 rounded border-gray-400 text-black focus:ring-black cursor-pointer" 
                                                name={category.toLowerCase()} 
                                                onChange={handleInputChangeWithValidation} 
                                                checked={tradeBusinessInfo.tradeMetals?.includes(category.toLowerCase())} 
                                            />
                                            <label htmlFor={`metal-${index}`} className="ml-2 text-xs sm:text-sm text-black cursor-pointer">
                                                {category}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.tradeMetals && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.tradeMetals}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-center mt-6 sm:mt-8'>
                        <button
                            type="button"
                            className="w-full sm:w-auto rounded-md bg-blue-500 py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base font-semibold text-white outline-none hover:shadow-form hover:bg-blue-600 transition-colors"
                            onClick={validationTradeBusiness}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TradeInformation;
