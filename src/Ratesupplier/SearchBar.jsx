import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios";
// import { Check, X, ArrowRight, Loader2 } from "lucide-react";
import { API } from "../config/configData";
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { TiTick } from 'react-icons/ti';
import { MdCancel } from 'react-icons/md';
import { AlertCircle, CheckCircle2 } from "lucide-react";

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const mobileNumberData = queryParams.get('m');
  const sktmicon = "/images/Skt.png"
  const [mobileNumber] = useState(mobileNumberData);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [errors, setErrors] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [imageIndex, setImageIndex] = useState("");
  const [imgIncrease, setImgIncrease] = useState(false);
  const [imageData, setImagedata] = useState(0);
  const [showAcceptanceMessage, setShowAcceptanceMessage] = useState(false);
  const [showRejectMessage, setShowRejectMessage] = useState(false);
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("mb", mobileNumber);
  }, [mobileNumber]);

  const handleSearch = async (e) => {
    try {
      if (e) e.preventDefault();
      setLoading(true);
      
      if (!mobileNumber) {
        setDatas([]);
        return;
      }
      
      const response = await axios.get(`${API}/getdetails/${mobileNumberData}`);
      setDatas(response.data);
      setMobileError(false);
      
      if (response.data.length === 0) {
        setShowRejectDialog(false);
      }
    } catch (error) {
      setMobileError(true);
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleZoomImage = (image) => {
    setZoomedImage(image);
  };
  const memoizedHandleSearch = useCallback(handleSearch, [mobileNumber, mobileNumberData]);

  useEffect(() => {
    memoizedHandleSearch();
  }, [memoizedHandleSearch]);

  const handleAccept = async (supplierId, img) => {
    try {
      console.log(supplierId, img)
            
              const response=  await axios.put(
                `${API}/imagesaccepted/accept`,{supplierId,img});
                if (response.status === 200) {
                  // setShowAcceptanceMessage(true); // Show the acceptance message
                  // setTimeout(() => {
                  //   // setShowAcceptanceMessage(false); // Hide the message after 5 seconds
                  //   handleSearch(); // Re-fetch data
                  // }, 5000);
                }
      
      
              handleSearch();
      
            
      
          } catch (error) {
            console.error("Error accepting image:", error);
          }
  };
  const handleReject = (supplierId) => {
    setShowRejectPopup(true);
    setRejectId(supplierId)
  };

  const submitRejectReason = async () => {
    // Implement reject reason submission logic
    try {
            if (!rejectReason.trim()) {
              // setErrors(true);
              return;
            } else {
              // setErrors(false);
            }
      
            const rejectReasonData = {
              id: rejectId,
              reason: rejectReason,
            };
      
            const response = await axios.post(
              `${API}/submit-reject-reason`,
              rejectReasonData
            );
      
            if (response.status === 200) {
              setShowRejectPopup(false);
              handleSearch();
              setRejectReason("");
                // setShowRejectMessage(true); // Show the acceptance message
                setTimeout(() => {
                  // setShowRejectMessage(false); // Hide the message after 5 seconds
                  handleSearch(); // Re-fetch data
                }, 5000);
      
            } else {
              console.error("Unexpected response status:", response.status);
            }
          } catch (error) {
            console.error("Error submitting reject reason:", error);
          }
    // setShowRejectPopup(false);
    // setRejectReason('');
  };

  // Render methods
  const renderRejectPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Reason for Rejection
        </h2>
        <textarea
          className="w-full h-32 p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your rejection reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            onClick={() => {setShowRejectPopup(false) 
                         setRejectReason("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={submitRejectReason}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  const renderSupplierDetails = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (datas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg shadow-sm p-8">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2"> No Rates are found </h3>
          <p className="text-gray-500 text-center max-w-md">
           
          </p>
        </div>
      );
    }
    return (
<div className="container mx-auto px-4 py-6  ">
<div className="flex justify-center w-full">
  <img src={sktmicon} alt="" className="mx-auto" />
</div>      {datas.map((supplier) => (
        <div 
          key={supplier.id} 
          className="m-10 bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 
                     grid grid-cols-1 
                     w-11/12 sm:w-full 
                     mx-auto
                     max-w-2xl "
        >
          {/* Supplier Info Section */}
          <div className="grid grid-cols-2 gap-4 mb-4 lg:ml-[20%] sm:ml-0 ">
            <div>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">Supplier Name</p>
              <p className="font-semibold text-base sm:text-lg ">{supplier.name}</p>
          
              <p className="text-gray-600 text-xs sm:text-sm">Current Rate</p>
              <p className="font-semibold text-base sm:text-lg">{supplier.goldData==="999 Rate"? supplier.PureRate :supplier.goldData==="9999 Rate"?supplier.pure999Rate:supplier.cRate}</p>
            </div>
            <div>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">Bill No</p>
            <p className="font-semibold text-base sm:text-lg">{supplier.billNo}</p>
             
              <p className="text-gray-600 text-xs sm:text-sm mt-2">Total Quantity</p>
              <p className="font-semibold text-base sm:text-lg">{supplier.tQty} grams</p>
            </div>
          </div>

          {/* Images Section */}
          <div className="w-full ml-[2px] sm:ml-0 lg:ml-[15%]">
            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-15 sm:gap-12 mb-6">
              {supplier.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative rounded-lg overflow-hidden cursor-pointer 
                              transition-all duration-300 ease-in-out
                              ${selectedImage === image 
                                ? 'ring-4 ring-blue-500 border-2 border-blue-500 scale-105' 
                                : 'hover:ring-2 ring-blue-300 hover:scale-105'}`}
                  onClick={() => handleImageSelect(image, supplier.id)}
                >
                  <img
                    src={image}
                    alt={`Supplier Image ${index + 1}`}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleZoomImage(image);
                    }}
                  >
                    <ZoomIn size={16} sm:size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Accept/Reject Buttons */}
            <div className="w-full sm:ml-0 lg:ml-[-80px]">
            {supplier.images.includes(selectedImage) && (
              <div className="flex justify-center space-x-2 sm:space-x-4">
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-green-500 text-white rounded-lg 
                             hover:bg-green-600 transition 
                             flex items-center text-sm sm:text-base"
                  onClick={() => handleAccept(supplier.id, selectedImage)}
                >
                  <TiTick className="mr-1 sm:mr-2" /> Accept
                </button>
                <button
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-red-500 text-white rounded-lg 
                             hover:bg-red-600 transition 
                             flex items-center text-sm sm:text-base"
                  onClick={() => handleReject(supplier.id)}
                >
                  <MdCancel className="mr-1 sm:mr-2" /> Reject
                </button>
              </div>
            )}
            </div>  
          </div>
        </div>
      ))}
    </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-0 sm:p-2">
    {/* Reject Popup */}
    {showRejectPopup && renderRejectPopup()}
  
    {/* Zoomed Image Modal */}
    {zoomedImage && (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
        onClick={() => setZoomedImage(null)}
      >
        <img
          src={zoomedImage}
          alt="Zoomed"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    )}
  
    {/* Supplier Details - Fullscreen Cards */}
    <div className="h-full w-full flex flex-col">
      {renderSupplierDetails()}
    </div>
  </div>
  );
};

export default SearchBar;
