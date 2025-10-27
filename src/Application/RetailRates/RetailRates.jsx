import { useState, useEffect ,useContext} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChartAPI } from '../../config/configData';
import { DashBoardContext } from '../../DashBoardContext/DashBoardContext';
function RetailRates() {
 const {user,mobileNo}=useContext(DashBoardContext);

    const [formValues, setFormValues] = useState({
        // selectedBranch: "CBE3",
        goldRate: "",
        silverRate: "",
        diamondRate: "",
        platinumRate: "",
        onlineGoldRate: "",
        oldGoldRate: 0,
        karat18GoldRate: 0,
        goldPureRate: 0,
        silverPureRate: 0,
        goldPureRate1: 0,
        goldPureRate2: 0,
        otp: "",
        mobileNo:mobileNo,
    });

    console.log("User Context in Retail Rates:", mobileNo);
    // const ChartAPI = "http://localhost:8080";
    // const ChartAPI="https://cust.spacetextiles.net"
    const [errors, setErrors] = useState({});
    const [preRates, setPreRates] = useState([]);
    // const [otp, setOtp] = useState("");  // State to track OTP input
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);  // State for OTP modal visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setErrors((prevErrors) => {
            const updatedErrors = { ...prevErrors };
            delete updatedErrors[name];
            return updatedErrors;
        });
        setFormValues({ ...formValues, [name]: value });
    };

    const validateFields = () => {
        const newErrors = {};
        leftPanel.forEach((field) => {
            if (!formValues[field.name]) {
                newErrors[field.name] = `${field.header} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        fetchPastRates();
    }, []);

    const fetchPastRates = async () => {
        try {
            const response = await axios.get(`${ChartAPI}/dailyrate/getoldrates`, {
                auth: {
                    username: "spacetextilesltd",
                    password: "F2nFpKS5cUXIPvFS4i9H5EzAjt3sdluYObgNfPTMTpo=",
                }});
            setPreRates(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Error fetching past rates");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) return;

        try {
            const response = await axios.post(`${ChartAPI}/dailyrate/postretailrates`, formValues,{
                auth: {
                    username: "spacetextilesltd",
                    password: "F2nFpKS5cUXIPvFS4i9H5EzAjt3sdluYObgNfPTMTpo=",
                }});
            if (response.status === 201) {
                toast.success("Data Submitted Successfully");
                setIsOtpModalOpen(false);
                setFormValues({
                    // selectedBranch: "CBE3",
                     otp: "",
                    goldRate: "",
                    silverRate: "",
                    diamondRate: "",
                    platinumRate: "",
                    onlineGoldRate: "",
                    oldGoldRate: 0,
                    karat18GoldRate: 0,
                    goldPureRate: 0,
                    silverPureRate: 0,
                    goldPureRate1: 0,
                    goldPureRate2: 0,
                     
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error submitting data");
        }
    };

    const goldCalculations = () => {
        const oldGoldRatesData = parseInt(formValues.goldRate) || 0;
        const karat18RatesData = (parseInt(formValues.goldRate) / 22) * 18 || 0;
        const goldPureRateData = (parseInt(formValues.goldRate) / 22) * 24 || 0;
        const silverPureRateData = parseInt(formValues.silverRate) || 0;
        const goldPureRate1Data = (parseInt(formValues.goldRate) / 93.5) * 100 || 0;
        const goldPureRate2Data = (parseInt(formValues.goldRate) / 93) * 100 || 0;
        setFormValues((prevValues) => ({
            ...prevValues,
            oldGoldRate: Math.round(oldGoldRatesData),
            karat18GoldRate: Math.round(karat18RatesData),
            goldPureRate: Math.round(goldPureRateData),
            silverPureRate: Math.round(silverPureRateData),
            goldPureRate1: Math.round(goldPureRate1Data),
            goldPureRate2: Math.round(goldPureRate2Data),
        }));
    };

    useEffect(() => {
        goldCalculations();
    }, [formValues.goldRate, formValues.silverRate]);

    // const Branches = ["CBE3", "MTP", "HSR", "KSR", "MYS"];
    const leftPanel = [
        { header: 'Gold Rate', name: 'goldRate' },
        { header: 'Silver Rate', name: 'silverRate' },
        { header: 'Diamond Rate', name: 'diamondRate' },
        { header: 'Platinum Rate', name: 'platinumRate' },
        { header: 'Online Gold Rate', name: 'onlineGoldRate' },
    ];
    const rightPanel = [
        { header: 'Old Gold Rate', name: 'oldGoldRate' },
        { header: '18 Karat Gold Rate', name: 'karat18GoldRate' },
        { header: 'Gold Pure Rate', name: 'goldPureRate' },
        { header: 'Silver Pure Rate', name: 'silverPureRate' },
        { header: 'Gold Pure Rate 1', name: 'goldPureRate1' },
        { header: 'Gold Pure Rate 2', name: 'goldPureRate2' },
    ];

    const handleGenerateOtp = async () => {
        if (!validateFields()) return;
        try {
            const response = await axios.get(`${ChartAPI}/dailyrate/generateOTP/retailrates/${mobileNo}`,{
                auth: {
                    username: "spacetextilesltd",
                    password: "F2nFpKS5cUXIPvFS4i9H5EzAjt3sdluYObgNfPTMTpo=",
                }});
            console.log(response.data);
            setIsOtpModalOpen(true);  // Show OTP modal on successful OTP generation
        } catch (error) {
            console.log(error);
        }
    };

  

    return (
        <div className="flex items-center justify-center  bg-gradient-to-r from-blue-50 via-gray-100 to-blue-50">
            <div className="mx-auto w-full max-w-10xl bg-white p-2 rounded-lg shadow-lg transition-shadow hover:shadow-xl">
                <ToastContainer autoClose={3000} />
                <form className="w-full" onSubmit={handleSubmit}>
                <h3 className="font-extrabold text-center mb-8 text-xl text-blue-700">Retail Rate Change</h3>
                    {/* Left and Right Panel Input Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-100 p-2 rounded-lg shadow-md">
                            {leftPanel.map((label, index) => (
                                <div className="md:flex md:items-center mb-1" key={index}>
                                    <div className="md:w-1/3">
                                        <label className="mb-3 block text-left text-base font-medium text-gray-800">
                                            {label.header}
                                        </label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input
                                            type="text"
                                            name={label.name}
                                            value={formValues[label.name]}
                                            onChange={handleChange}
                                            placeholder={`Enter ${label.header}`}
                                            className={`rounded-md border ${errors[label.name] ? 'border-red-500' : 'border-gray-300'
                                                } bg-white py-2 px-4 w-full text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all`}
                                        />
                                        {preRates.length > 0 && preRates[0][label.name] && (
                                            <p className="text-blue-800 text-sm text-right mb-1">
                                                Previous Rate: {preRates[0][label.name]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-100 p-2 rounded-lg shadow-md">
                            {rightPanel.map((label, index) => (
                                <div className="md:flex md:items-center mb-1" key={index + 5}>
                                    <div className="md:w-1/3">
                                        <label className="mb-3 block text-left text-base font-medium text-gray-800">
                                            {label.header}
                                        </label>
                                    </div>
                                    <div className="md:w-2/3">
                                        <input
                                            type="text"
                                            name={label.name}
                                            value={formValues[label.name]}
                                            onChange={handleChange}
                                            placeholder={`Enter ${label.header}`}
                                            disabled
                                            className="rounded-md border border-gray-300 bg-white py-2 px-4 w-full text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        />
                                        {preRates.length > 0 && preRates[0][label.name] && (
                                            <p className="text-blue-800 text-sm  text-right mb-1">
                                                Previous Rate: {preRates[0][label.name]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate OTP Button */}
                    <div className="flex justify-center">
                        <button
                            type="button"
                            style={{ borderRadius: "7px" }}
                            onClick={handleGenerateOtp}
                            className="w-full mt-10 bg-blue-600 py-3 px-10 text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform transform hover:scale-105 sm:w-auto"
                        >
                            Generate OTP
                        </button>
                    </div>
                    {isOtpModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-sm">
                                <h3 className="text-xl font-bold mb-4">Enter OTP</h3>
                                <input
                                    type="text"
                                    name="otp"
                                    value={formValues.otp}
                                    onChange={handleChange}
                                    placeholder="Enter OTP"
                                    className="w-full mb-4 p-2 border rounded"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded"
                                        onClick={() => setIsOtpModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    // onClick={handleOtpSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                   
                </form>

                {/* OTP Modal */}

            </div>
        </div>
    );
}

export default RetailRates;
