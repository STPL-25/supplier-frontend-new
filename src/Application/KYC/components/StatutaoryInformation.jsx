// StatutaoryInformation.js
import { useState, useContext, useEffect } from 'react';
import { KycContext } from '../KycContext/KycContex';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import { validateStatutoryInfo } from './validateStatutoryInfo'; // Adjust the path accordingly

function StatutaoryInformation() {
    const { 
        statutatoryInfo, 
        setStatutatoryInfo, 
        handleStatutaoryInputChange ,
        validateStatutoryInfo
        ,errors,setErrors
    } = useContext(KycContext);
    
    const { setActiveSection,setActiveComponent } = useContext(DashBoardContext);
    // const [errors, setErrors] = useState({});

    // Function to validate the entire formsetKycFormData
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
            localStorage.setItem("KycStat",JSON.stringify(statutatoryInfo))

            setActiveComponent("Banking Information");

        } else {
            console.log("Form has errors. Cannot proceed to next section.");
        }
    };

    // Handle input changes with validation
    const handleInputChangeWithValidation = (event) => {
        handleStatutaoryInputChange(event); // Update the form data
        const { name, value } = event.target;

        // Validate the specific field
        const fieldErrors = validateStatutoryInfo({ ...statutatoryInfo, [name]: value });
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: fieldErrors[name]
        }));
    };

    return (
        <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full bg-white p-6">
                <form>
                    <h3 className="font-bold text-center mb-6">Principal Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left side fields */}
                        <div>
                            {/* Trade Name */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 text-center block text-base font-medium text-black">
                                        Trade Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradename"
                                        value={statutatoryInfo.tradename}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Trade Name"
                                        maxLength={70}
                                        className={`md:w-full w-full rounded-md border ${
                                            errors.tradename ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradename && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradename}</p>
                                    )}
                                </div>
                            </div>

                            {/* Legal Name */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Legal Name:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="readelegalname"
                                        value={statutatoryInfo.readelegalname}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Legal Name"
                                        maxLength={70}
                                        className={`md:w-full rounded-md border ${
                                            errors.readelegalname ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.readelegalname && (
                                        <p className="text-red-500 text-sm mt-1">{errors.readelegalname}</p>
                                    )}
                                </div>
                            </div>

                            {/* Door No */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Door No:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradedoorno"
                                        value={statutatoryInfo.tradedoorno}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Door No"
                                        maxLength={30}
                                        className={`md:w-full rounded-md border ${
                                            errors.tradedoorno ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradedoorno && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradedoorno}</p>
                                    )}
                                </div>
                            </div>

                            {/* Street */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Street:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradestreet"
                                        value={statutatoryInfo.tradestreet}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Street"
                                        maxLength={60}
                                        className={`md:w-full rounded-md border ${
                                            errors.tradestreet ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradestreet && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradestreet}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side fields */}
                        <div>
                            {/* Area */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Area:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradearea"
                                        value={statutatoryInfo.tradearea}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Area"
                                        maxLength={30}
                                        className={`md:w-full rounded-md border ${
                                            errors.tradearea ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradearea && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradearea}</p>
                                    )}
                                </div>
                            </div>

                            {/* State Code */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        State Code:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradestatecode"
                                        value={statutatoryInfo.tradestatecode}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter State Code"
                                        disabled
                                        className={`md:w-full rounded-md border ${
                                            errors.tradestatecode ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradestatecode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradestatecode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Pin Code */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Pin Code:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="text"
                                        name="tradepincode"
                                        value={statutatoryInfo.tradepincode}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Pin Code"
                                        maxLength={6}
                                        className={`md:w-full rounded-md border ${
                                            errors.tradepincode ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradepincode && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradepincode}</p>
                                    )}
                                </div>
                            </div>

                            {/* Date Of Incorporation */}
                            <div className="md:flex md:items-center mt-2 mb-6">
                                <div className='md:w-1/3'>
                                    <label className="mb-3 block text-center text-base font-medium text-black">
                                        Date Of Incorporation:
                                    </label>
                                </div>
                                <div className="md:w-2/3">
                                    <input
                                        type="date"
                                        name="tradeDoI"
                                        value={statutatoryInfo.tradeDoI}
                                        onChange={handleInputChangeWithValidation}
                                        placeholder="Enter Date Of Incorporation"
                                        className={`md:w-full rounded-md border ${
                                            errors.tradeDoI ? 'border-red-500' : 'border-gray-400'
                                        } bg-white py-1 px-6 text-base font-medium text-black outline-none focus:border-black focus:shadow-md`}
                                    />
                                    {errors.tradeDoI && (
                                        <p className="text-red-500 text-sm mt-1">{errors.tradeDoI}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Button */}
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

export default StatutaoryInformation;
