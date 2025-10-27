
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Filter, Eye, PrinterCheck , Film } from 'lucide-react';
import moment from "moment";



import { DashBoardContext } from '../../DashBoardContext/DashBoardContext';
import { API } from "../../config/configData";
// import sktmpng from "./assets/images/sktm.png"
function Report() {
  const [datas, setDatas] = useState([]);
  const [supName, setSupName] = useState([]);
  const [supDetails, setSupDetails] = useState("");
  const [errors, setErrors] = useState({});
  const [ErrorMessage, setErrorMessage] = useState(false);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedBillDetails, setSelectedBillDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const { setActiveSection } = useContext(DashBoardContext);
const sktmpng=  "/images/sktm.png"

  // Fetch supplier names
  useEffect(() => {
    const fetchSupplierNames = async () => {
      try {
        const response = await axios.get(`${API}/rate/supplierName`);
        setSupName(response.data);
      } catch (error) {
        console.error("Error fetching supplier names:", error);
      }
    };

    fetchSupplierNames();
  }, [supDetails]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API}/dashboarddetails/${supDetails}`);
      setDatas(response.data || []);
      setErrorMessage(!response.data || response.data.length === 0);
    } catch (error) {
      handleError(error);
    }
  };
console.log(datas)
  // Error handling helper
  const handleError = (error) => {
    const errorMessage = error.response?.data?.message ||
      (!supDetails ? "Please Select the Supplier" : "No data Found");
    setErrors({ message: errorMessage });
    setErrorMessage(true);
  };

  // Handle viewing details
  const handleViewDetails = async (billNo, id) => {
    setLoadingDetails(true);
    try {

      const response =  await axios.get(`${API}/data/${encodeURIComponent(billNo)}/${id}`);
      setSelectedBillDetails(response.data[0]);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching bill details:", error);
      setErrors({ message: "Failed to load bill details" });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handlePrint = (billDetails) => {
    // Create print content
    console.log(billDetails)
   const printContent = `
  <html>
    <head>
      <title>Gold Rate Accknowledgement - ${billDetails.Billno}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
          width: 30%;
        }
        .rejection-section {
          background-color: #fff8f8;
          border: 1px solid #ffcdd2;
          padding: 15px;
          border-radius: 4px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
<img src="${sktmpng}" alt="Sree Kumaran Thangamaligai" />       
 <h2>Gold Rate Acknowledgement</h2>
      </div>

      <table>
        <tr>
          <th>Tax Invoice No</th>
          <td>${billDetails.Billno}</td>
        </tr>
        <tr>
          <th>Supplier Name</th>
          <td>${billDetails.Suppliername}</td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>${billDetails.mobileNumber}</td>
        </tr>
        <tr>
          <th>Pure Rate With Gst(in INR)</th>
          <td>${billDetails.pure999Rate||billDetails.PureRate||billDetails.cRate}</td>
        </tr>
        <tr>
          <th>Pure Weight (in Grams)</th>
          <td>${billDetails.tQty}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>${billDetails.approvedstatus}</td>
        </tr>
      </table>

      ${billDetails.rejectionReason ? `
        <div class="rejection-section">
          <table>
            <tr>
              <th>Rejection Date</th>
              <td>${billDetails.StatusDate}</td>
            </tr>
            <tr>
              <th>Rejection Reason</th>
              <td>${billDetails.rejectionReason}</td>
            </tr>
          </table>
        </div>
      ` : ''}
    </body>
  </html>
`;
  
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      // Close the print window after printing (optional)
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  };

  // Open image dialog
  const handleOpenImageDialog = (images) => {
    setSelectedImages(images);
    setOpenImageDialog(true);
  };

  // Render gold rate
  const renderGoldRate = (supplier) => {
    const rateMap = {
      "9999 Rate": `9999 Rate-${supplier.pure999Rate}`,
      "999 Rate": `999 Rate-${supplier.PureRate}`,
      "995 Rate": `995 Rate-${supplier.cRate}`
    };
    return rateMap[supplier.goldData] || "N/A";
  };

  return (
    <div className="p-4 ">
    {/* Search Card */}
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold text-blue-600 text-center mb-4">
        Supplier Report
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <select
          onChange={(e) => setSupDetails(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Supplier</option>
          {supName.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Filter size={20} />
          Get Details
        </button>
      </form>
    </div>

    {/* Error Message */}
    {ErrorMessage && (
      <p className="text-red-600 text-center mb-4">{errors.message}</p>
    )}

    {/* Results Table */}
    {!ErrorMessage && datas.length > 0 && (
      <div className="bg-white rounded-lg shadow-lg ">
        <table className="min-w-full">
          <thead className="bg-blue-100">
            <tr>
              {[
                "S No", "Supplier Name", "Bill No", "Mobile Number",
                "Gold Rate", "Total Qty", "Status",
                "View Details", "Requested Date","Status Date",  "Images"
              ].map((header) => (
                <th key={header} className="px-4 py-3 text-center font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datas.map((supplier, index) => (
              <tr
                key={supplier.billNo+index}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-center">{supplier.name}</td>
                <td className="px-4 py-3 text-center">{supplier.billNo}</td>
                <td className="px-4 py-3 text-center">{supplier.phone}</td>
                <td className="px-4 py-3 text-center">{renderGoldRate(supplier)}</td>
                <td className="px-4 py-3 text-center">{supplier.tQty}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-semibold ${supplier.approvedstatus === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                    {supplier.approvedstatus === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    {supplier.approvedstatus === 'accepted' && (
                      <Link to={supplier.approvedImages} target="_blank">
                        <Film  className="text-blue-600 w-5 h-5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleViewDetails(supplier.billNo, supplier.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Eye className="text-gray-600 w-5 h-5" />
                    </button>
                  </div>
                </td>
                  <td className="px-4 py-3 text-center">{supplier?.createdAt? moment(supplier.createdAt)
                                          .utcOffset(330)
                                          .format("DD-MM-YY HH:mm:ss")
                                      : "00-00-0000" || 'N/A'}</td>

                <td className="px-4 py-3 text-center">{supplier.rejectionDate || 'N/A'}</td>
                {/* <td className="px-4 py-3 text-center">{supplier.rejectionReason || 'N/A'}</td> */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenImageDialog(supplier.images)}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    View Images
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Details Dialog */}
    {openDetailsDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Bill Details - {selectedBillDetails?.Billno}
            </h3>
            
            {loadingDetails ? (
              <div className="flex justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : selectedBillDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-lg font-semibold mb-2">Supplier Information</h4>
                  <p>Name: {selectedBillDetails.Suppliername}</p>
                  <p>Phone: {selectedBillDetails.mobileNumber}</p>
                  <p>Bill No: {selectedBillDetails.Billno}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="text-lg font-semibold mb-2">Rate Information</h4>
                  <p>Gold Rate: {renderGoldRate(selectedBillDetails)}</p>
                  <p>Pure Weight: {selectedBillDetails.tQty}</p>
                  <p>Status: {selectedBillDetails.approvedstatus}</p>
                </div>
                
                {selectedBillDetails.rejectionReason && (
                  <div className="col-span-2 bg-gray-50 p-4 rounded">
                    <h4 className="text-lg font-semibold mb-2">Rejection Details</h4>
                    <p>Date: {selectedBillDetails.StatusDate}</p>
                    <p>Reason: {selectedBillDetails.rejectionReason}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-600">Failed to load bill details</p>
            )}
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setOpenDetailsDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              {selectedBillDetails && (
                <button
                  onClick={() => handlePrint(selectedBillDetails)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <PrinterCheck size={20} />
                  Print
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Image Dialog */}
    {openImageDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Uploaded Images</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {selectedImages.map((image, idx) => (
                <a
                  key={idx}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={image}
                    alt={`Rate ${idx + 1}`}
                    className="max-w-[200px] max-h-[200px] object-cover rounded"
                  />
                </a>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setOpenImageDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}

export default Report;
