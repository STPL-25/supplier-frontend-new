import React, { useState, useCallback, useRef, useEffect } from "react";
import { Camera, Upload, RefreshCw, X } from "lucide-react";
import Snackbar from "../../../Components/Snackbar";
import useImageCompression from "./useImageCompression";
const CustomSelect = ({ options, value, onChange, label, error }) => {
  // console.log("opt",options,"val", value,"onc" ,onChange, 'lable',label, error);
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value?.value || ""}
          onChange={(e) => {
            const selected = options.find((opt) => opt.value == e.target.value);
            console.log(e.target.value);
            onChange(selected);
          }}
          className={`
            w-full px-4 py-3 bg-white border-2 rounded-xl 
            text-sm transition duration-300 ease-in-out
            focus:outline-none focus:border-blue-500
            ${
              error
                ? "border-red-400 text-red-600"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            }
            appearance-none
          `}
        >
          <option value="" className="text-gray-400">
            Select...
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-700"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
          <svg
            className="fill-current h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1 animate-pulse">{error}</p>
      )}
    </div>
  );
};

const CustomInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  disabled = false,
  accept,
  capture,
  placeholder,
  icon: Icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          accept={accept}
          capture={capture}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-3 bg-white border-2 rounded-xl 
            text-sm transition duration-300 ease-in-out
            ${Icon ? "pl-12" : ""}
            focus:outline-none focus:border-blue-500
            ${
              error
                ? "border-red-400 text-red-600"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            ${
              type === "file"
                ? "file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                : ""
            }
          `}
        />
        {isFocused && !error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1 animate-pulse">{error}</p>
      )}
    </div>
  );
};


const PhotoCapture = React.forwardRef(
  ({ onPhotoCapture, error, photoUrl }, ref) => {
    const [capturedImage, setCapturedImage] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [productUrls, setProductUrls] = useState(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);
 const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Function to hide snackbar
  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
    // Initialize camera stream
    const startCamera = useCallback(async () => {
      try {
        setCameraActive(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 720 },
            height: { ideal: 480 },
          },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        // alert("Unable to access camera. Please upload instead.");
        showSnackbar("Unable to access camera. Please upload instead.","warning")
        setCameraActive(false);

      }
    }, []);
    
    useEffect(() => {
      setProductUrls(photoUrl);
    }, [photoUrl]);
    
    // Clean up camera stream
    const stopCamera = useCallback(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    }, []);

    // Capture image from camera
    const captureImage = useCallback(() => {
      if (!videoRef.current) return;
      setIsCapturing(true);
      try {
        const video = videoRef.current;
        
        // Use the actual video dimensions instead of hardcoded values
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        const canvas = document.createElement("canvas");
        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // Draw the video frame to the canvas maintaining aspect ratio
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, videoWidth, videoHeight);
          
        const photoData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(photoData);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "captured-image.jpg", {
                type: "image/jpeg",
              });
              if (onPhotoCapture) {
                onPhotoCapture(file, photoData, setCapturedImage);
              }
            } else {
              console.error("Failed to create blob from canvas");
            }
          },
          "image/jpeg",
          0.9
        );
        stopCamera();
      } catch (err) {
        console.error("Error capturing photo:", err);
      }
      setIsCapturing(false);
    }, [onPhotoCapture, stopCamera]);

    // Handle file upload
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setCapturedImage(reader.result);
          if (onPhotoCapture) {
            onPhotoCapture(file, reader.result, setCapturedImage);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const handleRecaptureClick = () => {
      setCapturedImage(null);
      setProductUrls(null);
      stopCamera();
      if (onPhotoCapture) {
        onPhotoCapture(null, null, setCapturedImage);
      }
    };
    
    // Expose capture method to parent component
    React.useImperativeHandle(ref, () => ({
      capture: captureImage,
      recapture: handleRecaptureClick,
    }));

    return (
      <div className="w-full max-w-md mx-auto">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Product Photo
          {error && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          {/* Image Preview Area */}
          <div className="relative w-full h-48 mb-4 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {capturedImage || productUrls ? (
              <>
                <img
                  src={capturedImage || productUrls}
                  alt="Captured product"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={handleRecaptureClick}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                >
                  <RefreshCw size={20} className="text-blue-500" />
                </button>
              </>
            ) : cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <span>No image selected</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!capturedImage && !cameraActive && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  startCamera();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Camera size={20} />
                Capture
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Upload size={20} />
                Upload
              </button>
            </div>
          )}

          {/* Capture Button when Camera is Active */}
          {cameraActive && !capturedImage && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                onClick={captureImage}
                disabled={isCapturing}
                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 transition"
              >
                {isCapturing ? "Capturing..." : "Take Photo"}
              </button>
              <button
                onClick={() => {
                  stopCamera();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
        <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
        position="top-right"
        duration={5000}
      />
      </div>
    );
  }
);
const CustomSelects = ({
  label,
  options,
  value,
  onChange,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
        {error && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Selected value display */}
      <div className="relative">
        <div
          className={`
            w-full px-4 py-3 bg-white border-2 rounded-xl 
            text-sm transition duration-300 ease-in-out
            focus:outline-none
            ${
              error
                ? "border-red-400 text-red-600"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            }
            cursor-pointer flex justify-between items-center
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={!value ? "text-gray-400" : ""}>
            {value ? options.find(opt => opt.value === value)?.label : 'Select...'}
          </span>
          <svg
            className="fill-current h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 pl-1 animate-pulse">{error}</p>
      )}
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-30 bg-white shadow-lg rounded-xl border border-gray-200">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              className="w-30 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Options list */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 text-sm transition duration-200 ${
                    value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
const ProductTypeSelection = ({formData,setFormData,selectedTypes, setSelectedTypes}) => {
 

  const handleChange = (type) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  useEffect(() => {
    let productType = '';
    let metalType=""
    
    // Determine product type based on selected options
    if (selectedTypes.Gold && selectedTypes.Diamond && selectedTypes.Platinum) {
      productType = "GDP";
      metalType="Gold_Diamond_Platinum"
    } else if (selectedTypes.Gold && selectedTypes.Diamond && !selectedTypes.Platinum) {
      productType = "GD";
      metalType="Gold_Diamond"
    } else if (!selectedTypes.Gold && selectedTypes.Diamond && selectedTypes.Platinum) {
      productType = "PD";
      metalType="Platinum_Diamond"
    } else if (!selectedTypes.Gold && !selectedTypes.Diamond && selectedTypes.Platinum) {
      productType = "Pt";
      metalType="Platinum"
    } else if (selectedTypes.Gold && !selectedTypes.Diamond && selectedTypes.Platinum) {
      productType = "GP";
      metalType="Gold_Platinum"
    
    } else {
      productType = ""; // Default for no selection
    }
    
    // Update the parent component's formData with the new productType
    if (productType) {
      setFormData(prev => ({
        ...prev,
        productType: productType,
        metal_type:metalType
      }));
    }
    
    // Log to verify our logic is working
    console.log("Selected types:", selectedTypes);
    console.log("Setting product type to:", productType);
    
  }, [selectedTypes, setFormData]);

  // This function can be used to get the selected values as an array


  return (
    <div className="mb-6">
      <h3 className="mb-3 font-medium text-gray-700">Select Product Types</h3>
      <div className="flex space-x-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="Gold"
            checked={selectedTypes.Gold}
            onChange={() => handleChange("Gold")}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Gold</span>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="Diamond"
            checked={selectedTypes.Diamond}
            onChange={() => handleChange("Diamond")}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Diamond</span>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="Platinum"
            checked={selectedTypes.Platinum}
            onChange={() => handleChange("Platinum")}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Platinum</span>
        </label>
      </div>
      
   
    </div>
  );
};

export { CustomInput, CustomSelect, PhotoCapture ,CustomSelects,ProductTypeSelection};


