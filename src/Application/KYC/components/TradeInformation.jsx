import { useContext, useState } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TradeInformation() {
    const { handleTradeBusinessInputChange, tradeBusinessInfo,  handleSubmit,
        validateTradeInfo, errors, setErrors, kycFormData, filesDatas, statutatoryInfo,
        validate, validateStatutoryInfo, validateBankingInfo, accInfo, validateContactInfo, contactInfo, validateBusinessInfo, errorMessage, successMsg,fileDatasUrl,validateHallmarkInfo ,userRole,hallmarkInfo} = useContext(KycContext);
  //setTradeBusinessInfo
    const { setActiveSection } = useContext(DashBoardContext);

    // Function to validate the entire form
    const handleValidate = () => {
        setErrors({}); // Reset errors before validation
    
        const validationErrors = validateTradeInfo(tradeBusinessInfo);
        const supplierKYcvalidationErrors = validate(kycFormData, filesDatas, fileDatasUrl);
        const statutaryValidationErrors = validateStatutoryInfo(statutatoryInfo);
        const bankingValidationErrors = validateBankingInfo(accInfo, filesDatas, fileDatasUrl);
        const contactValidationErrors = validateContactInfo(contactInfo, filesDatas, fileDatasUrl);
        let hallmarkValidationErrors
        if(userRole.includes("Hallmark")){
             hallmarkValidationErrors=validateHallmarkInfo(hallmarkInfo,filesDatas, fileDatasUrl)
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
        const isValid = handleValidate(); // Store the result of validation in a variable
        if (isValid) {
            localStorage.setItem("KycTrade",JSON.stringify(tradeBusinessInfo))

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
        handleTradeBusinessInputChange(event); // Update the form data
        const { name, value } = event.target;

        // Validate the specific field
        const fieldErrors = validateTradeInfo({ ...tradeBusinessInfo, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    const mainCatagoryLists = ["", "Bullion", "Gold", "Diamond", "Platinum", "Silver", "Gem Stones", "Gift Articles","Gold Hallmark","Silver Hallmark"];

    return (
        <div className="container mx-auto mt-8 p-4">
            <ToastContainer /> 
            <form>
                <h3 className="font-bold mb-8">Trade Information</h3>
                <div className="flex justify-center gap-4">
                    <div className="form-group">
                        <div className='mb-4'>
                            <label className="block font-medium">Main Category:</label>
                        </div>
                        <div className="md:w-2/3">
                            <select 
                                className={`md:w-full rounded-md border ${errors.maincatogory ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`} 
                                name='maincatogory' 
                                onChange={handleInputChangeWithValidation} 
                                value={tradeBusinessInfo.maincatogory}
                            >
                                {mainCatagoryLists.map((data, index) => (
                                    <option key={index} value={data}>{data}</option>
                                ))}
                            </select>
                            {errors.maincatogory && (
                                <p className="text-red-500 text-sm mt-1">{errors.maincatogory}</p>
                            )}
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ${errors.tradeMetals ? 'border-red-500' : 'border-gray-400'} bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}>
                            {mainCatagoryLists.slice(1).map((category, index) => (
                                <div className="form-group" key={index}>
                                    <label className="flex items-center space-x-2">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox" 
                                            name={category.toLowerCase()} 
                                            onChange={handleInputChangeWithValidation} 
                                            checked={tradeBusinessInfo.tradeMetals.includes(category.toLowerCase())} 
                                        />
                                        <span>{category}</span>
                                    </label>
                                </div>
                            ))}
                            {errors.tradeMetals && (
                                <p className="text-red-500 text-sm mt-1">{errors.tradeMetals}</p>
                            )}
                        </div>
                        <div className='flex justify-center'>
                            <button
                                type="button"
                                className="mt-4 rounded-md bg-blue-500 py-2 px-6 text-base font-semibold text-white outline-none hover:shadow-form"
                                onClick={validationTradeBusiness}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default TradeInformation;
