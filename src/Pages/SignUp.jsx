import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../Components/AxiosClient';
// import SktPhoto from '../assets/Space.png';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LOGG_API } from "../config/configData";
import { ToastContainer, toast } from 'react-toastify';
import './Toast.css'
// import 'react-toastify/dist/ReactToastify.css';
function SignUp() {
  
  const [signup, setSignup] = useState({
    signupCatagory: "SUPPLIER",
    Name: '',
    companyName: '',
    Ecno: '',
    MobileNo: '',
    otp: "",
    // tradeType:''
  });
  const SktPhoto = '/assets/images/Space.png';

  const [errors, setErrors] = useState({});
  const [isOtpClicked, setIsOtpClicked] = useState(false);
  const [timer, setTimer] = useState(0);
  const [signUpError, setSignUpError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: async (signupData) => {
      const response = await axiosInstance.post('/api/signUp', signupData);
      return response.data;
    },
    onError: (error) => {
      if (error.response) {
        const { data } = error.response;
        setSignUpError(data.error);
        setErrors(data);
        toast.error(data.error || "An error occurred");
      } else {
        setErrors({ allFields: 'Server error' });
        toast.error("Server error occurred. Please try again later.");
      }
    },
    onSuccess: () => {
      setSignup({
        signupCatagory: "SUPPLIER",
        Name: '',
        companyName: '',
        Ecno: '',
        MobileNo: '',
        otp: ""
      });
      setErrors({});
      setIsOtpClicked(false);
      setTimer(0);
      setShowSuccessMessage(true);
      toast.success("User created successfully! Please wait for approval.");
    }
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0 && isOtpClicked) {
      setIsOtpClicked(false);
    }
    return () => clearInterval(interval);
  }, [timer, isOtpClicked]);

  useEffect(() => {
    const fetchEmpDetails = async () => {
      try {
        const response = await axios.get(`${LOGG_API}/login/getemployeedetails/${signup.Ecno}`);
        if (signup.signupCatagory === "STAFF" && response.data) {
          setSignup((prevSignup) => ({
            ...prevSignup,
            companyName: "",
            Name: response.data.ENAME || "",
            MobileNo: response.data.OFFICIAL_NUMBER || "",
          }));
        } else if (signup.signupCatagory === "SUPPLIER") {
          setSignup((prevSignup) => ({
            ...prevSignup,
            Ecno: "",
            Name: "",
            MobileNo: "",
            // tradeType:''
          }));
        }
      } catch (error) {
        setSignup((prevSignup) => ({
          ...prevSignup,
          companyName: "",
          Name: "",
          MobileNo: "",
          // tradeType:''
        }));
      }
    };
    fetchEmpDetails();
    if (isOtpClicked) {
      setIsOtpClicked(false);
    }
  }, [signup.Ecno, signup.signupCatagory]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    value=value.toUpperCase(),
    setShowSuccessMessage(false);

    if (name === "MobileNo") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        if (value.length === 1 && !/^[6-9]/.test(value)) return;
        setSignup((prevSignup) => ({ ...prevSignup, [name]: value }));
      }
    } else {
      setSignup((prevSignup) => ({ ...prevSignup, [name]: value }));
      if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };
// console.log(signup)
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (signup.Name.length < 4) newErrors.Name = 'Name must be at least 4 characters';
    if (signup.MobileNo.length !== 10) newErrors.MobileNo = 'Mobile number must be 10 digits';
    if (signup.otp.length !== 6) newErrors.otp = 'OTP must be 6 digits';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
    } else {
      mutate(signup);
    }
  };

  const handleGenerateOtp = async () => {
    if (signup.MobileNo) {
      try {
        const response = await axios.get(`${LOGG_API}/signUpotp/${signup.MobileNo}`);
        if (response.status === 200) {
          setIsOtpClicked(true);
          setTimer(300);
          setSignup((prevValue) => ({ ...prevValue, otp: "" }));
          setSignUpError("");
          toast.success("OTP sent successfully!");
        }
      } catch (error) {
        setSignUpError(error.response.data.message);
        toast.error(error.response.data.message || "Failed to send OTP");
      }
    } else {
      setErrors({ MobileNo: 'Mobile number is required to generate OTP' });
      toast.error("Mobile number is required to generate OTP");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isGenerateOtpEnabled = signup.signupCatagory === 'SUPPLIER'
    ? signup.Name && signup.companyName && signup.MobileNo.length === 10
    : signup.Name && signup.Ecno && signup.MobileNo.length === 10;

  return (
    <div className="signup flex items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer

      />
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 md:mt-10 mt-8">
        <div className="text-center">
          <img src={SktPhoto} className="mx-auto" alt="Logo" />
          <h1 className="text-2xl font-semibold tracking-wide mb-4">SIGN UP</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Radio buttons */}
            <div className="flex items-center justify-between">
  {/* Main Category Selection */}
  <div className="flex items-center">
    <label className="flex items-center">
      <input
        type="radio"
        name="signupCatagory"
        value="SUPPLIER"
        checked={signup.signupCatagory === 'SUPPLIER'}
        onChange={handleChange}
        className="mr-2"
      />
      Supplier
    </label>
    <label className="flex items-center ml-4">
      <input
        type="radio"
        name="signupCatagory"
        value="STAFF"
        checked={signup.signupCatagory === 'STAFF'}
        onChange={handleChange}
        className="mr-2"
      />
      Staff
    </label>

    
  </div>
</div>


            {/* Conditional inputs */}
            {signup.signupCatagory === "SUPPLIER" ? (
              <input
                type="text"
                name="companyName"
                placeholder="Company Name (As Per GST )"
                className="w-full py-3 rounded-md shadow-lg mb-2 px-4"
                value={signup.companyName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only letters (uppercase and lowercase) and spaces
                  if (/^[A-Za-z\s]*$/.test(value)) {
                    handleChange(e); // Call the handleChange function only if input is valid
                  }
                }} />
            ) : (
              <input
                type="text"
                name="Ecno"
                placeholder="Ecno"
                className="w-full py-3 rounded-md shadow-lg mb-2 px-4"
                value={signup.Ecno}
                onChange={handleChange}
              />
            )}

            {/* Name and Mobile No */}
            <input
              type="text"
              name="Name"
              placeholder={signup.signupCatagory === "SUPPLIER" ? "Proprietor Name (As Per GST )" : "Name"}
              className="w-full py-3 rounded-md shadow-lg mb-2 px-4"
              value={signup.Name}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only letters (uppercase and lowercase) and spaces
                if (/^[A-Za-z\s]*$/.test(value)) {
                  handleChange(e); // Call the handleChange function only if input is valid
                }
              }}
              disabled={signup.signupCatagory === "STAFF"}
            />
            {errors.Name && <div className="text-red-500">{errors.Name}</div>}

            <input
              type="text"
              name="MobileNo"
              placeholder="Mobile No"
              className="w-full py-3 rounded-md shadow-lg mb-2 px-4"
              value={signup.MobileNo}
              onChange={handleChange}
              disabled={signup.signupCatagory === "STAFF"}
              maxLength={10}
            />
            {errors.MobileNo && <div className="text-red-500">{errors.MobileNo}</div>}

            {/* OTP Field */}
            {isOtpClicked && (
              <>
                <input
                  type="text"
                  name="otp"
                  placeholder="OTP"
                  className="w-full py-3 rounded-md shadow-lg mb-4 px-4"
                  value={signup.otp}
                  onChange={handleChange}
                />
                {errors.otp && <div className="text-red-500">{errors.otp}</div>}
              </>
            )}

            {/* Generate OTP / Resend OTP Button */}
            {isGenerateOtpEnabled &&
              <button
                type="button"
                className={`${isOtpClicked
                  ? null
                  : "w-full py-2 rounded-md font-medium shadow-lg transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-400 text-white"
                  }`}
                onClick={handleGenerateOtp}
                disabled={isOtpClicked}
              >
                {isOtpClicked ? null : "Generate OTP"}
              </button>
            }
            {/* Timer Display */}
            {isOtpClicked && (
              <div className="text-center text-gray-600 mt-2 font-semibold">
                OTP Expires in: <span className="text-blue-500">{formatTime(timer)}</span>
              </div>
            )}

            {/* Submit Button */}
            {signup.otp.length === 6 && (
              <button
                type="submit"
                className="signup-button w-full text-center bg-blue-500 hover:bg-blue-400 py-2 text-white rounded-md font-medium tracking-wide shadow-lg transition duration-150 ease-in-out"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'SUBMIT'}
              </button>
            )}

            <p className="mt-4 text-center">
              Already have an account?{' '}
              <Link to="/" className="sign-up text-blue-500 cursor-pointer font-medium">Log In</Link>
            </p>

          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
