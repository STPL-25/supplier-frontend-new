import React, { useEffect, useState, useContext } from "react";
import SubmittedDataComp from "../components/SubmittedDataComp";
import axios from "axios";
import { API } from "../../../config/configData";
import PurchaseOrderGenerator from "../components/PurchaseOrderGenerator";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";

// ADD AXIOS INTERCEPTOR FOR DEBUGGING
axios.interceptors.request.use(request => {
  // console.log('🚀 Starting Request:', {
  //   url: request.url,
  //   method: request.method,
  //   data: request.data,
  //   params: request.params
  // });
  return request;
}, error => {
  // console.error('❌ Request Error:', error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // console.log('✅ Response:', {
  //   status: response.status,
  //   data: response.data,
  //   url: response.config.url
  // });
  return response;
}, error => {
  // console.error('❌ Response Error:', {
  //   status: error.response?.status,
  //   data: error.response?.data,
  //   message: error.message
  // });
  return Promise.reject(error);
});

function GoldPoCreationSupplier() {
  const [poCreationDatas, setPoCreationDatas] = useState([]);
  const [poAddressData, setPoAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPoNumbers, setIsLoadingPoNumbers] = useState(false);
  const [error, setError] = useState(null);
  const [poNumbers, setPoNumbers] = useState([]);
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { user, userRole } = useContext(DashBoardContext);

  // Fetch PO Numbers
  useEffect(() => {
    const fetchPoDetails = async () => {
      if (!user || !userRole) {
        // console.warn('⚠️ Missing user or userRole:', { user, userRole });
        return;
      }

      setIsLoadingPoNumbers(true);
      try {
        // console.log('📞 Fetching PO Numbers for:', { user, userRole });
        
        const response = await axios.get(
          `${API}/gold_po/fetch_po_number/${user}/${userRole}/Accepted`
        );
        
        // console.log("📦 Full PO Numbers Response:", response.data);
        
        // Access nested structure
        const poNumbersArray = response.data?.filteredData?.poNumbers || [];
        
        // console.log("✨ Extracted PO Numbers:", poNumbersArray);
        
        setPoNumbers(Array.isArray(poNumbersArray) ? poNumbersArray : []);
      } catch (error) {
        // console.error("❌ Error fetching PO details:", {
        //   message: error.message,
        //   response: error.response?.data,
        //   status: error.response?.status
        // });
        setPoNumbers([]);
        setError("Failed to fetch PO numbers. Please try again.");
      } finally {
        setIsLoadingPoNumbers(false);
      }
    };
    
    fetchPoDetails();
  }, [user, userRole]);

  // Fetch PO Creation Details
  const fetchPoCreationDetails = async () => {
    if (!selectedPoNumber || !user) {
      // console.warn('⚠️ Missing required data:', { selectedPoNumber, user });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // IMPORTANT: Log what you're sending
      const requestPayload = {
        selectedSupplier: user, // This might be the issue!
        selectedPoNumber: selectedPoNumber,
        userRole: userRole // Add userRole to the payload
      };
      
      // console.log('📤 Sending PO Creation Request:', requestPayload);

      const response = await axios.post(
        `${API}/gold_po/fetch_po_creation`, 
        requestPayload
      );

      // console.log("📦 Full PO Creation Response:", response.data);

      if (response.status === 200 && response.data) {
        const addressData = response.data.address || {};
        const poCreationData = response.data.data || [];

        // console.log("📍 Address Data:", addressData);
        // console.log("📋 PO Creation Data:", poCreationData);

        setFilteredData(Array.isArray(poCreationData) ? poCreationData : []);
        setPoAddressData(addressData);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      // console.error("❌ Error fetching PO creation details:", {
      //   message: error.message,
      //   response: error.response?.data,
      //   status: error.response?.status
      // });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Failed to fetch PO details. Please try again.";
      
      setError(errorMessage);
      setFilteredData([]);
      setPoAddressData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPoNumber) {
      fetchPoCreationDetails();
    } else {
      setFilteredData([]);
      setPoAddressData(null);
    }
  }, [selectedPoNumber, user]);

  const handlePoNumberChange = (event) => {
    const value = event.target.value;
    // console.log('🔄 PO Number changed to:', value);
    setSelectedPoNumber(value);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 lg:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Gold PO Creation
          </h1>
        
         
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="space-y-4">
            <div className="w-full">
              <label
                htmlFor="po-number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select PO Number {poNumbers.length > 0 && `(${poNumbers.length} available)`}
              </label>
              <div className="relative">
                <select
                  id="po-number"
                  value={selectedPoNumber}
                  onChange={handlePoNumberChange}
                  disabled={isLoadingPoNumbers || poNumbers.length === 0}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 
                           text-gray-700 text-sm sm:text-base
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           hover:border-gray-400 transition duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">
                    {isLoadingPoNumbers 
                      ? "Loading PO Numbers..." 
                      : poNumbers.length === 0 
                        ? "No PO Numbers Available" 
                        : "Select PO Number"}
                  </option>
                  {Array.isArray(poNumbers) &&
                    poNumbers.map((poNumber, index) => (
                      <option key={index} value={poNumber}>
                        {poNumber}
                      </option>
                    ))}
                </select>
                
                {/* Dropdown Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                  <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Helper Text */}
              {!isLoadingPoNumbers && poNumbers.length === 0 && (
                <p className="mt-2 text-sm text-amber-600">
                  No PO numbers available. Please check with your administrator.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-xs text-red-600 mt-1">
                    Check browser console for detailed error information
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading PO details...</p>
          </div>
        )}

        {/* Content Section */}
        {!isLoading && selectedPoNumber && filteredData.length > 0 && (
          <>
            {/* Submitted Data Component */}
            <div className="mb-6 sm:mb-8">
              <SubmittedDataComp 
                submittedData={filteredData} 
                ispocreation={true} 
              />
            </div>

            {/* Purchase Order Generator */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <PurchaseOrderGenerator
                submittedData={filteredData}
                poAddressData={poAddressData}
                selectedPoNumber={selectedPoNumber}
              />
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !selectedPoNumber && (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No PO Selected
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Please select a purchase order number to view details
            </p>
          </div>
        )}

        {/* No Data State */}
        {!isLoading && selectedPoNumber && filteredData.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No Data Available
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              No records found for the selected PO number
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoldPoCreationSupplier;
