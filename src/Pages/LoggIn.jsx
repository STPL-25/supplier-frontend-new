import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '../Components/AxiosClient';
import { useNavigate, Link } from 'react-router-dom';
import { DashBoardContext } from '../DashBoardContext/DashBoardContext';
import { LOGG_API } from "../config/configData";
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import { KycContext } from '../Application/KYC/KycContext/KycContex';
import { ToastContainer, toast } from 'react-toastify';
import "./Toast.css"
function LoggIn() {

const [login, setLogin] = useState({ MobileNo: '', otp: '' });
const [errors, setErrors] = useState("");
const [successMessage, setSuccessMessage] = useState('');
const [isOtpClicked, setIsOtpClicked] = useState(false);
const [timer, setTimer] = useState(0); // Countdown timer in seconds
const  SktPhoto = '/images/Space.png';

const { setUser, setIsLoggin, setUserRole, decryptToken, setNames, names,user ,setLogginToken} = useContext(DashBoardContext);
const navigate = useNavigate();

// Login mutation using react-query
const { mutate, isLoading, isError, isSuccess, error } = useMutation({
  mutationFn: async (loginData) => {
    const response = await axiosInstance.post('/api/login', loginData);
    return response.data;
  },
  onError: (error) => {
    if (error) {
      setIsLoggin(false);
      const { data } = error.response;
      const errorMessage = data.message || "An error occurred. Please try again.";
      toast.error(errorMessage); // Display toast error
    }
  },
  onSuccess: (data=null) => {
    setErrors("");
    setSuccessMessage('Login successful');
    toast.success('Login successful!'); // Display toast success

    localStorage.setItem('token', data.token);
    setLogginToken(data.token)
    // Decode and set user info
    const securedToken = decryptToken(data.token);
    const decodedToken = jwtDecode(securedToken);
    console.log(decodedToken);

    if (decodedToken.role === "Diamond-Supplier") {
      setUser(decodedToken.companyName);
    } else {
      setUser(decodedToken.name);
    }
    setUserRole(decodedToken.role);
    setNames(decodedToken.name);

    navigate('/Dashboard');       
    setIsLoggin(true);
  },
});
console.log(user)

useEffect(() => {
  let interval;
  if (timer > 0) {
    interval = setInterval(() => setTimer((prevTime) => prevTime - 1), 1000);
  } else if (timer === 0 && isOtpClicked) {
    setIsOtpClicked(false);
  }
  return () => clearInterval(interval);
}, [timer, isOtpClicked]);

// Fetch approval status
const fetchUserLogginStatus = async () => {
  if (login.MobileNo) {
    try {
      const response = await axios.get(`${LOGG_API}/gettingapprovalresult/${login.MobileNo}`);
      return response.data;
    } catch (error) {
      throw error; // Let React Query handle the error
    }
  }
  return null;
};

const { data: userData, isError: userError } = useQuery({
  queryKey: [ isSuccess, isError],
  queryFn: fetchUserLogginStatus,
  enabled: !!login.MobileNo,
});

// Form field change handler
const handleChange = (e) => {
  const { name, value } = e.target;
  setLogin((prevLogin) => ({ ...prevLogin, [name]: value }));
  setErrors("");
  setSuccessMessage('');
};

// OTP generation
const handleGenerateOtp = async () => {
  if (login.MobileNo) {
    try {
      setTimer(300); // Set to 5 minutes
      const response = await axios.get(`${LOGG_API}/loginotp/${login.MobileNo}`);
      console.log(response.data);
      if(response.status === 200){
        setIsOtpClicked(true);
        toast.success('OTP sent successfully!'); // Display OTP success message
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ?? "Error sending OTP";
      toast.error(errorMessage); // Display OTP error message
    }
  } else {
    toast.error("Mobile number is required to generate OTP");
  }
};

// Format timer to mm:ss
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const handleSubmit = (e) => {
  e.preventDefault();
  mutate(login);
};
  return (
    <div className="login flex items-center justify-center min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <ToastContainer/>
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 md:mt-10 mt-8">
        <div className="text-center py-5">
          <img src={SktPhoto} className="mx-auto " alt="Logo" />
          <h1 className="text-2xl font-semibold tracking-wide mb-4">Log In</h1>
        </div>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="MobileNo"
            value={login.MobileNo}
            onChange={handleChange}
            maxLength={10}
            placeholder="Mobile No"
            className="w-[80%] py-3 ml-8 rounded-md shadow-lg mb-2 px-4"
          />
          {/* {errors && <span className="text-red-500">{errors}</span>} */}

          {isOtpClicked && (
            <input
              type="text"
              name="otp"
              value={login.otp}
              onChange={handleChange}
              placeholder="OTP"
              className="w-[80%] ml-8 py-3 rounded-md shadow-lg mb-2 px-4"
            />
          )}

          {login.MobileNo && (
          <button
          type="button"
          onClick={handleGenerateOtp}
          className={
            isOtpClicked
              ? ""
              : "w-[80%] ml-8 text-center py-2 rounded-md font-medium shadow-lg transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-400 text-white"
          }
          disabled={isOtpClicked}
        >
          {isOtpClicked ? null : "Generate OTP"}
        </button>
        
          )}

          {isOtpClicked && (
            <div className="text-center text-gray-600 mt-2 font-semibold">
              OTP Expires in: <span className="text-blue-500">{formatTime(timer)}</span>
            </div>
          )}

          {login.otp.length === 6 && (
            <button
              type="submit"
              className="w-[80%] ml-8 text-center bg-blue-500 hover:bg-blue-400 py-2 text-white rounded-md font-medium tracking-wide shadow-lg transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          )}

          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className=" sign-up text-blue-500 cursor-pointer font-medium">Sign Up</Link>
          </p>

          {isError && userError?.response?.data?.status === "Pending" ? (
            <div className="mt-4 text-center bg-red-100 rounded-lg p-2 mb-2 text-xs text-red-700">
              <span className="font-medium">{userError.response.data.Message}</span>
            </div>
          ) : (
            errors && (
              <div className="mt-4 text-center bg-red-100 rounded-lg p-2 mb-2 text-xs text-red-700">
                <span className="font-medium">{errors}</span>
              </div>
            )
          )}

          {isSuccess && (
            <div className="mt-4 text-center bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700">
              <span className="font-medium">Login successful!</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoggIn;
