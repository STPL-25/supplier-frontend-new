
// import React, { useContext, useEffect, useState } from "react";
// import SubmittedDataComp from "../components/SubmittedDataComp";
// import axios from "axios";
// import { API } from "../../../config/configData";
// import PurchaseOrderGenerator from "../components/PurchaseOrderGenerator";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import ContentLoader from "../../../DashBoardContext/ContentLoader";
// import Snackbar from "../../../Components/Snackbar";
// import SupplierSelect from "../components/SupplierSelect"

// function GoldPoCreation() {
//   const [poAddressData, setPoAddressData] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [suppliers, setSuppliers] = useState([]);
//   const [poNumbers, setPoNumbers] = useState([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedPoNumber, setSelectedPoNumber] = useState("");
//   const [selectedPoStatus, setSelectedPoStatus] = useState("Pending");
//   const [pdfDwlStatus, setPoDwlStatus] = useState("trial");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const { userRole, roleData } = useContext(DashBoardContext);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // Function to show snackbar
//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   // Function to hide snackbar
//   const hideSnackbar = () => {
//     setSnackbar((prev) => ({
//       ...prev,
//       open: false,
//     }));
//   };

//   // Function to reset all filters
//   const resetFilters = () => {
//     setSelectedSupplier("");
//     setSelectedPoNumber("");
//     setFromDate("");
//     setToDate("");
//     setSelectedPoStatus("Accepted");
//     showSnackbar("Filters have been reset");
//   };

//   useEffect(() => {
//     const fetchSupplier = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_po/fetch_supplier/${userRole}`
//         );
//         setSuppliers(response.data.supplierNames);
//       } catch (error) {
//         console.error("Error fetching supplier and PO details:", error);
//         showSnackbar("Failed to fetch suppliers", "error");
//       }
//     };
//     fetchSupplier();
//   }, [userRole]);

//   useEffect(() => {
//     const fetchPoDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${API}/gold_po/fetch_po_number/${selectedSupplier}/${userRole}/${selectedPoStatus}`
//         );
//         setPoNumbers(response.data.filteredData.poNumbers);
//         setPoDwlStatus(response.data.poStatusData);
//       } catch (error) {
//         console.error("Error fetching supplier and PO details:", error);
//         showSnackbar("Failed to fetch PO numbers", "error");
//       }
//     };

//     if (selectedSupplier) {
//       fetchPoDetails();
//     } else {
//       setPoNumbers([]);
//     }
//   }, [selectedSupplier, selectedPoStatus, userRole]);
//   console.log(selectedPoStatus);

//   const fetchPoCreationDetails = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(
//         `${API}/gold_po/fetch_po_creation?userRole=${userRole}&selectedSupplier=${selectedSupplier}&selectedPoNumber=${selectedPoNumber}&fromDate=${btoa(
//           fromDate
//         )}&toDate=${btoa(toDate)}&selectedPoStatus=${selectedPoStatus}`
//       );

//       if (response.status === 200) {
//         if (!response.data) {
//           showSnackbar("No Data Found", "error");
//           throw new Error("No data received from the API");
//         }

//         const addressData = response.data.address;
//         const poCreationData = response.data.data;

//         if (!poCreationData) {
//           throw new Error("PO creation data is missing");
//         }

//         setFilteredData(response?.data?.data);
//         setPoAddressData(response?.data?.address ? response?.data?.address : {});
//       } else {
//         throw new Error(`Unexpected response status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error fetching PO creation details:", error);
//       showSnackbar("No Data Found", "error");
//       setError(error.message);
//       setFilteredData([]);
//       setPoAddressData({});
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//       fetchPoCreationDetails();
   
//   }, [selectedPoNumber, selectedSupplier, fromDate, toDate, selectedPoStatus, userRole]);

//   const handleSupplierChange = (event) => {
//     setSelectedSupplier(event.target.value);
//     // Reset PO number when supplier changes
//     setSelectedPoNumber("");
//   };

//   const handlePoStatusChange = (event) => {
//     setSelectedPoStatus(event.target.value);
//     // Reset PO number when status changes
//     setSelectedPoNumber("");
//   };

//   const handlePoNumberChange = (event) => {
//     setSelectedPoNumber(event.target.value);
//   };

//   const handleFromDateChange = (event) => {
//     setFromDate(event.target.value);
//   };

//   const handleToDateChange = (event) => {
//     setToDate(event.target.value);
//   };

//   const poStatusOptions = [
//     { value: "Pending", label: "Pending" },
  
//     { value: "Rejected", label: "Rejected" },
//     { value: "Accepted", label: "Accepted" }
//   ];

//   return (
//     <div className=" w-full max-w-full">
//       <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">Gold Purchase Order Creation</h2>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
//           <div className="w-full">
//             <SupplierSelect
//             selectedSupplier={selectedSupplier}
//             setSelectedSupplier={setSelectedSupplier}
//             suppliers={suppliers}
//             />
//           </div>
          
//           <div className="w-full">
//             <label htmlFor="poStatus" className="block text-sm font-medium text-gray-700 mb-1">
//               PO Status
//             </label>
//             <select
//               id="poStatus"
//               value={selectedPoStatus}
//               onChange={handlePoStatusChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               {poStatusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="w-full">
//             <label htmlFor="poNumber" className="block text-sm font-medium text-gray-700 mb-1">
//               PO Number
//             </label>
//             <select
//               id="poNumber"
//               value={selectedPoNumber}
//               onChange={handlePoNumberChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               disabled={!selectedSupplier}
//             >
//               <option value="">Select PO Number</option>
//               {poNumbers.map((poNumber, index) => (
//                 <option key={index} value={poNumber}>
//                   {poNumber}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div className="w-full">
//             <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">
//               From Date
//             </label>
//             <input
//               id="fromDate"
//               type="date"
//               value={fromDate}
//               onChange={handleFromDateChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="w-full">
//             <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">
//               To Date
//             </label>
//             <input
//               id="toDate"
//               type="date"
//               value={toDate}
//               onChange={handleToDateChange}
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>
        
//         <div className="mt-4 flex justify-end">
//           <button
//             onClick={resetFilters}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
//           >
//             Reset Filters
//           </button>
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <ContentLoader variant="skeleton" />
//         </div>
//       ) : error ? (
//         <div className="bg-white rounded-lg shadow-md p-6 text-red-500 text-center">
//           No Data Found
//         </div>
//       ) : filteredData.length > 0 ? (
//         <div className="space-y-6">
//           <div className="bg-white rounded-lg shadow-md overflow-hidden pr-5">
//             <SubmittedDataComp 
//               submittedData={filteredData} 
//               ispocreation={true} 
//             />
//           </div>
          
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <PurchaseOrderGenerator
//               submittedData={filteredData}
//               poAddressData={poAddressData}
//               selectedPoNumber={selectedPoNumber}
//               pdfType={pdfDwlStatus}
//             />
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
//           No data available. Please select filters to view purchase orders.
//         </div>
//       )}
      
//       <Snackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={hideSnackbar}
//         position="top-right"
//         duration={5000}
//       />
//     </div>
//   );
// }

// export default GoldPoCreation;


import React, { useContext, useEffect, useState } from "react";
import SubmittedDataComp from "../components/SubmittedDataComp";
import axios from "axios";
import { API } from "../../../config/configData";
import PurchaseOrderGenerator from "../components/PurchaseOrderGenerator";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import ContentLoader from "../../../DashBoardContext/ContentLoader";
import Snackbar from "../../../Components/Snackbar";
import SupplierSelect from "../components/SupplierSelect"


function GoldPoCreation() {
  const [poCreationDatas, setPoCreationDatas] = useState([]);
  const [poAddressData, setPoAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [poNumbers, setPoNumbers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [selectedPoStatus, setSelectedPoStatus] = useState("Pending");
  const [pdfDwlStatus, setPoDwlStatus] = useState("trial");
  const [selectCompany, setSelectCompany] = useState("")
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { userRole, roleData } = useContext(DashBoardContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });


  // Function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };


  // Function to hide snackbar
  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };


  // Function to reset all filters
  const resetFilters = () => {
    setSelectedSupplier("");
    setSelectedPoNumber("");
    setFromDate("");
    setToDate("");
    setSelectedPoStatus("Pending");
    setFilteredData([]);
    setPoAddressData(null);
    showSnackbar("Filters have been reset");
  };


  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/fetch_supplier/${userRole}`
        );
        setSuppliers(response.data.supplierNames);
      } catch (error) {
        console.error("Error fetching supplier and PO details:", error);
        showSnackbar("Failed to fetch suppliers", "error");
      }
    };
    fetchSupplier();
  }, [userRole]);


  useEffect(() => {
    const fetchPoDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/fetch_po_number/${selectedSupplier}/${userRole}/${selectedPoStatus}`
        );
        setPoNumbers(response.data.filteredData.poNumbers);
        setPoDwlStatus(response.data.poStatusData);
      } catch (error) {
        console.error("Error fetching supplier and PO details:", error);
        showSnackbar("Failed to fetch PO numbers", "error");
      }
    };


    if (selectedSupplier) {
      fetchPoDetails();
    } else {
      setPoNumbers([]);
    }
  }, [selectedSupplier, selectedPoStatus, userRole]);


  const fetchPoCreationDetails = async () => {
    // Don't fetch if supplier is not selected
    if (!selectedSupplier) {
      setFilteredData([]);
      setPoAddressData(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setFilteredData([]);
    try {
      const response = await axios.post(
        `${API}/gold_po/fetch_po_creation`, {
          userRole,
          selectedSupplier,
          selectedPoNumber,
          fromDate: fromDate ? btoa(fromDate) : "",
          toDate: toDate ? btoa(toDate) : "",
          selectedPoStatus,
          selectCompany
        }
      );


      if (response.status === 200) {
        if (!response.data || !response.data.data || response.data.data.length === 0) {
          showSnackbar("No Data Found", "info");
          setFilteredData([]);
          setPoAddressData(null);
          setError("No data found");
          return;
        }


        const addressData = response.data.address;
        const poCreationData = response.data.data;


        setFilteredData(poCreationData);
        setPoAddressData(addressData ? addressData : {});
        showSnackbar("Data loaded successfully", "success");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching PO creation details:", error);
      showSnackbar("No Data Found", "error");
      setError(error.message);
      setFilteredData([]);
      setPoAddressData(null);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // Only fetch if supplier is selected
    if (selectedSupplier) {
      fetchPoCreationDetails();
    }
  }, [selectedPoNumber, selectedSupplier, fromDate, toDate, selectedPoStatus, userRole, selectCompany]);


  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
    // Reset PO number when supplier changes
    setSelectedPoNumber("");
    setFilteredData([]);
    setPoAddressData(null);
  };


  const handlePoStatusChange = (event) => {
    setSelectedPoStatus(event.target.value);
    // Reset PO number when status changes
    setSelectedPoNumber("");
    setFilteredData([]);
    setPoAddressData(null);
  };


  const handlePoNumberChange = (event) => {
    setSelectedPoNumber(event.target.value);
  };


  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };


  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };


  const poStatusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
    { value: "Accepted", label: "Accepted" }
  ];


  return (
    <div className=" w-full max-w-full">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Purchase Order Creation
        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="w-full">
            <SupplierSelect
              selectedSupplier={selectedSupplier}
              setSelectedSupplier={setSelectedSupplier}
              suppliers={suppliers}
            />
          </div>


          <div className="w-full">
            <label
              htmlFor="poStatus"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PO Status
            </label>
            <select
              id="poStatus"
              value={selectedPoStatus}
              onChange={handlePoStatusChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {poStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>


          <div className="w-full">
            <label
              htmlFor="poNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PO Number
            </label>
            <select
              id="poNumber"
              value={selectedPoNumber}
              onChange={handlePoNumberChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedSupplier}
            >
              <option value="">Select PO Number</option>
              {poNumbers.map((poNumber, index) => (
                <option key={index} value={poNumber}>
                  {poNumber}
                </option>
              ))}
            </select>
          </div>
         
          <div className="w-full">
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div className="w-full">
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>


        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filters
          </button>
        </div>
      </div>


      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ContentLoader variant="skeleton" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-red-500 text-center">
          No Data Found
        </div>
      ) : filteredData.length > 0 ? (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-md overflow-hidden pr-5">
      <SubmittedDataComp
        submittedData={filteredData}
        ispocreation={true}
      />
    </div>

    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <PurchaseOrderGenerator
        submittedData={filteredData}
        poAddressData={poAddressData}
        selectedPoNumber={selectedPoNumber}
        pdfType={pdfDwlStatus}
      />
    </div>
  </div>
) 
       : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          {selectedSupplier ? "No data available for the selected filters." : "Please select a supplier to view purchase orders."}
        </div>
      )}


      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
        position="top-right"
        duration={5000}
      />
       {/* <PurchaseOrderGenerator
        submittedData={filteredData}
        poAddressData={poAddressData}
        selectedPoNumber={selectedPoNumber}
        pdfType={pdfDwlStatus}
      /> */}
    </div>
  );
}


export default GoldPoCreation;
