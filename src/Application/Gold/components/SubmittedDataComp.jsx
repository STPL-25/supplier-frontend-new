// import React, { useState, useEffect, useContext } from "react";
// import { Trash2, Edit } from "lucide-react";
// import axios from "axios";
// import { API } from "../../../config/configData";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import { useSendToServer } from "./SendToServer";
// import { useTctSendToServer } from "./TctSendToServer";
// function SubmittedDataComp({
//   submittedData,
//   onEdit,
//   onDelete,
//   handleSelect,
//   selectedItems,
//   ispocreation,
//   ispproval,
//   selectedPoNumber,
//   fetchPoCreationDetails,
// }) {
//   const [activeModal, setActiveModal] = useState(null);
//   const [fairData, setfairData] = useState([]);
//   const [officeData, setOfficeData] = useState([]);
//   const { roleData, names } = useContext(DashBoardContext);
//   //console.log("selectd Items", selectedItems);
//   useEffect(() => {
//     //console.log("Submitted Data:", submittedData); // Log data to verify structure

//     setfairData(
//       submittedData?.filter((item) => item.orderType === "fair") || []
//     );
//     setOfficeData(
//       submittedData?.filter((item) => item.orderType === "office") || []
//     );
//   }, [submittedData]);
//   const { generatePdf, isGenerating, errors } = useSendToServer({
//     // submittedData: filteredSubmittedData,
//     // poAddressData,
//     onPdfGenerated: (pdfFile) => {
//       //console.log(pdfFile);
//       //console.log("PDF generated successfully");
//     },
//   });
//     const { generatePdf:generateTctPdf} = useTctSendToServer({
//     // submittedData: filteredSubmittedData,
//     // poAddressData,
//     onPdfGenerated: (pdfFile) => {
//       //console.log(pdfFile);
//       //console.log("PDF generated successfully");
//     },
//   });
  
//   const renderConfirmModal = (item) =>
//     activeModal === item.sno && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
//         <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
//           <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
//           <p className="mb-4">Are you sure you want to delete this item?</p>
//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={() => setActiveModal(null)}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => {
//                 onDelete(item.sno);
//                 setActiveModal(null);
//               }}
//               className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//             >
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     );

//   const renderMobileCard = (item) => {
//     // //console.log(item);
//     const handleAccept = async (po) => {
//       try {
//         const response = await axios.put(
//           `${API}/gold_po/update/accept/${po}/${names}`
//         );
//         const filteredItems = response.data.findPoDatas;

//         const poData = response.data.poData;
//         const orderTypes = response.data.orderTypes;
//         const poType = response.data.poType;
//         //console.log(filteredItems, poData, orderTypes);
//         const pdfGenerated = await generatePdf(
//           filteredItems,
//           poData,
//           // submittedData,
//           orderTypes,
//           poType.trim()
//         );
//         //console.log(poData.parentPo);
//          if(poData.parentPo.name&&poData.parentPo.subTitle){
//      await generateTctPdf(
//             filteredItems,
//             poData,
//             // submittedData,
//             orderTypes
//           );
//         }
        
//           if (response.status === 200) {
//             fetchPoCreationDetails();
//           }
//           //console.log(response.data);
//         } catch (error) {
//           //console.log(error);
//         }
//       };
//       const handleReject = async (po) => {
//         try {
//           const response = await axios.put(
//           `${API}/gold_po/update/reject/${po}/${names}`
//         );
//         // const filteredItems = response.data.findPoDatas;
//         // const poData = response.data.poData;
//         // const orderTypes = response.data.orderTypes;
//         // //console.log(filteredItems, poData, orderTypes);
//         // const pdfGenerated = await generatePdf(
//         //   filteredItems,
//         //   poData,
//         //   // submittedData,
//         //   orderTypes
//         // );
//         if (response.status === 200) {
//           fetchPoCreationDetails();
//         }
//         //console.log(response.data);
//       } catch (error) {
//         //console.log(error);
//       }
//     };
//     const fields = [
//       { label: "Product", value: item.product_name || "NA" },
//       // { label: "Product Name", value: item.product_name || "NA" },
//       { label: "Pieces", value: item.pieces || 0 },
//       { label: "Product Weightage", value: item.productWeightage || 0 },
//       { label: "Rate", value: item.rate || 0 },
//       { label: "Gross Wt", value: item.gross_weight || 0 },
//       { label: "Stone Wt", value: item.stone_weight || 0 },
//       { label: "Stone Cost", value: item.stone_cost || 0 },
//       { label: "Wax Wt", value: item.wax_weight || 0 },
//       { label: "Net Wt", value: item.net_weight || 0 },
//       { label: "Amount", value: item.amount || 0 },
//       { label: "Melting", value: item.melting || 0 },
//       { label: "Wastage", value: item.wastage || 0 },
//       { label: "Making Charges", value: item.makingCharges || 0 },
//       { label: "Pure Wt", value: item.pure_wt || 0 },
//       { label: "Metal Type", value: item.metal_type || 0 },
//       { label: "Parent PO", value: item.ParentPoNumber || "NA" },
//     ];

//     return (
//       <div
//         key={item.sno}
//         className="bg-white border rounded-lg shadow-md mb-4 p-4"
//       >
//         {roleData === "PM" && selectedPoNumber && (
//           <div className="flex space-x-2 items-center mt-4 mb-4">
//             <button
//               className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center"
//               onClick={() => handleAccept(selectedPoNumber)}
//             >
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 ></path>
//               </svg>
//               Accept
//             </button>

//             <button
//               className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg 
//                           shadow transition-colors duration-200 flex items-center"
//               onClick={() => handleReject(selectedPoNumber)}
//             >
//               <svg
//                 className="w-2 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 ></path>
//               </svg>
//               Reject
//             </button>
//           </div>
//         )}
//         {selectedItems && (
//           <div className="flex items-center mb-4">
//             <input
//               type="checkbox"
//               checked={selectedItems.includes(item.sno)}
//               onChange={() => handleSelect(item.sno, item.orderType)}
//               className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//             />
//           </div>
//         )}

//         {item.product_image && (
//           <div className="flex justify-center mb-4">
//             <img
//               src={item.product_image}
//               alt="Product"
//               className="w-32 h-32 object-cover rounded-lg"
//             />
//           </div>
//         )}

//         <div className="grid grid-cols-2 gap-2">
//           {fields.map(({ label, value }) => (
//             <div key={label} className="flex flex-col">
//               <span className="text-xs text-gray-600 font-semibold">
//                 {label}
//               </span>
//               <span className="text-sm">{value}</span>
//             </div>
//           ))}
//         </div>
//         {selectedItems && (
//           <div className="flex justify-end space-x-2 mt-4">
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => onEdit(item)}
//                 className="text-blue-600 hover:text-blue-800 transition-colors"
//                 title="Edit"
//               >
//                 <Edit size={20} />
//               </button>
//               <button
//                 onClick={() => setActiveModal(item.sno)}
//                 className="text-red-600 hover:text-red-800 transition-colors"
//                 title="Delete"
//               >
//                 <Trash2 size={20} />
//               </button>
//             </div>
//           </div>
//         )}

//         {renderConfirmModal(item)}
//       </div>
//     );
//   };

//   const renderTableContent = (data, title) => {
//     if (data.length === 0) return null;

//     const handleAccept = async (po) => {
//       try {
//         const response = await axios.put(
//           `${API}/gold_po/update/accept/${po}/${names}`
//         );
//         const filteredItems = response.data.findPoDatas;
//         const poData = response.data.poData;
//         const orderTypes = response.data.orderTypes;
//         const poType = response.data.poType;
//         console.log("11111111111111", poType);
//         //console.log(filteredItems, poData, orderTypes);
//         const pdfGenerated = await generatePdf(
//           filteredItems,
//           poData,
//           // submittedData,
//           orderTypes,
//           poType.trim()
//         );

//          if(poData.parentPo.name&&poData.parentPo.subTitle){
//         await generateTctPdf(
//             filteredItems,
//             poData,
//             // submittedData,
//             orderTypes,
//             poType
//           );
//         }
//         if (response.status === 200) {
//           fetchPoCreationDetails();
//         }
//         //console.log(response.data);
//       } catch (error) {
//         //console.log(error);
//       }
//     };
//     const handleReject = async (po) => {
//       try {
//         const response = await axios.put(
//           `${API}/gold_po/update/reject/${po}/${names}`
//         );
//         // const filteredItems = response.data.findPoDatas;
//         // const poData = response.data.poData;
//         // const orderTypes = response.data.orderTypes;
//         // //console.log(filteredItems, poData, orderTypes);
//         // const pdfGenerated = await generatePdf(
//         //   filteredItems,
//         //   poData,
//         //   // submittedData,
//         //   orderTypes
//         // );
//         if (response.status === 200) {
//           fetchPoCreationDetails();
//         }
//         //console.log(response.data);
//       } catch (error) {
//         //console.log(error);
//       }
//     };
//     return (
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-3">{title}</h2>
//         {/* Desktop View */}
//         <div className="hidden md:block overflow-none ">
//           {roleData === "PM" && selectedPoNumber && (
//             <div className="flex space-x-2 items-center mt-4 mb-4">
//               <button
//                 className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors duration-200 flex items-center"
//                 onClick={() => handleAccept(selectedPoNumber)}
//               >
//                 <svg
//                   className="w-4 h-4 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 13l4 4L19 7"
//                   ></path>
//                 </svg>
//                 Accept
//               </button>

//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg 
//                           shadow transition-colors duration-200 flex items-center"
//                 onClick={() => handleReject(selectedPoNumber)}
//               >
//                 <svg
//                   className="w-2 h-4 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   ></path>
//                 </svg>
//                 Reject
//               </button>
//             </div>
//           )}
//           {selectedItems && (
//             <div className="flex items-center justify-center space-x-2">
//               <p className="text-lg font-semibold text-gray-700">
//                 Total Selected:
//                 <span className="ml-2 text-blue-600">
//                   {selectedItems?.length || 0}
//                 </span>
//               </p>
//             </div>
//           )}
//           <table className="w-full bg-white border border-gray-200 text-sm">
//             <thead>
//               <tr className="bg-gray-50">
//                 {selectedItems && (
//                   <th className="px-2 py-1 md:px-4 md:py-2 border">Select</th>
//                 )}
//                 {ispocreation && (
//                   <th className="px-2 py-1 md:px-4 md:py-2 border">
//                     Po Number
//                   </th>
//                 )}
//                 {ispocreation && (
//                   <th className="px-2 py-1 md:px-4 md:py-2 border">Po Date</th>
//                 )}
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Product</th>
//                 {/* <th className="px-2 py-1 md:px-4 md:py-2 border">
//                   Product Name
//                 </th> */}
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Pieces</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Rate</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Gross Wt</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">
//                   Diamond Wt(cent)
//                 </th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Stone Wt</th>
//                 {/* <th className="px-2 py-1 md:px-4 md:py-2 border">Stone Cost</th> */}
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Wax Wt</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Net Wt</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Amount</th>
//                 {}
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Melting</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Wastage</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">MC</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Pure Wt</th>
//                 <th className="px-2 py-1 md:px-4 md:py-2 border">Photo</th>
//                  <th className="px-2 py-1 md:px-4 md:py-2 border">Parent Po</th>
//                 {selectedItems && (
//                   <th className="px-2 py-1 md:px-4 md:py-2 border">Actions</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item) => (
//                 <React.Fragment key={item.sno}>
//                   <tr>
//                     {selectedItems && (
//                       <td className="px-2 py-1 md:px-4 md:py-2 border">
//                         <input
//                           type="checkbox"
//                           checked={selectedItems.includes(item.sno)}
//                           onChange={() => handleSelect(item.sno, item)}
//                           className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                       </td>
//                     )}
//                     {ispocreation && (
//                       <td className="px-2 py-1 md:px-4 md:py-2 border">
//                         {item.poDetails?.poNumber || 0}
//                       </td>
//                     )}
//                     {ispocreation && (
//                       <td className="px-2 py-1 md:px-4 md:py-2 border">
//                         {item.poDetails?.poDate || 0}
//                       </td>
//                     )}
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.product_name || "NA"}
//                     </td>
//                     {/* <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.product_name || "NA"}
//                     </td> */}
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.pieces || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {" "}
//                       {item.rate || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.gross_weight || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.diamondwt || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.stone_weight || 0}
//                     </td>
//                     {/* <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.stone_cost || 0}
//                     </td> */}
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.wax_weight || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.net_weight || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.amount || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.melting || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.wastage || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.makingCharges || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.pure_wt || 0}
//                     </td>
//                     <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.product_image ? (
//                         <img
//                           src={item.product_image}
//                           alt="Product"
//                           className="w-16 h-16 object-cover"
//                         />
//                       ) : (
//                         "NA"
//                       )}
//                     </td>
//                      <td className="px-2 py-1 md:px-4 md:py-2 border">
//                       {item.ParentPoNumber || "NA"}
//                     </td>
//                     {selectedItems && (
//                       <td className="px-2 py-1 md:px-4 md:py-2 border text-center">
//                         <div className="flex space-x-2">
//                           <button
//                             onClick={() => onEdit(item)}
//                             className="text-blue-600 hover:text-blue-800 transition-colors"
//                             title="Edit"
//                           >
//                             <Edit size={20} />
//                           </button>
//                           <button
//                             onClick={() => setActiveModal(item.sno)}
//                             className="text-red-600 hover:text-red-800 transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={20} />
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                   {renderConfirmModal(item)}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Mobile View */}
//         <div className="block md:hidden">{data.map(renderMobileCard)}</div>
//       </div>
//     );
//   };

//   return (
//     <div className="w-full">
//       {fairData?.length > 0 &&
//         renderTableContent(fairData, "Exhibitions Selection")}
//       {officeData?.length > 0 &&
//         renderTableContent(officeData, "Office Selection")}
  
//       {submittedData.length === 0 && (
//         <div className="mt-4 text-center p-4 bg-gray-50 border border-gray-200 rounded">
//           <p>No data available.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default SubmittedDataComp;


import React, { useState, useEffect, useContext } from "react";
import { Trash2, Edit, Package, Weight, DollarSign, Gem } from "lucide-react";
import axios from "axios";
import { API } from "../../../config/configData";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { useSendToServer } from "./SendToServer";
import { useTctSendToServer } from "./TctSendToServer";


function SubmittedDataComp({
  submittedData,
  onEdit,
  onDelete,
  handleSelect,
  selectedItems,
  ispocreation,
  ispproval,
  selectedPoNumber,
  fetchPoCreationDetails,
}) {
  const [activeModal, setActiveModal] = useState(null);
  const [fairData, setfairData] = useState([]);
  const [officeData, setOfficeData] = useState([]);
  const { roleData, names } = useContext(DashBoardContext);

  // Helper function to parse poDetails safely
  const parsePoDetails = (poDetails) => {
    if (!poDetails) return null;
    try {
      return typeof poDetails === 'string' ? JSON.parse(poDetails) : poDetails;
    } catch (error) {
      console.error('Error parsing poDetails:', error);
      return null;
    }
  };

  useEffect(() => {
    setfairData(
      submittedData?.filter((item) => item.orderType === "fair") || []
    );
    setOfficeData(
      submittedData?.filter((item) => item.orderType === "office") || []
    );
  }, [submittedData]);


  const { generatePdf, isGenerating, errors } = useSendToServer({
    onPdfGenerated: (pdfFile) => {
      console.log("PDF generated successfully");
    },
  });


  const { generatePdf: generateTctPdf } = useTctSendToServer({
    onPdfGenerated: (pdfFile) => {
      console.log("PDF generated successfully");
    },
  });


  const renderConfirmModal = (item) =>
    activeModal === item.sno && (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fadeIn">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <Trash2 className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-3 text-gray-800">
            Confirm Deletion
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveModal(null)}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-medium transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(item.sno);
                setActiveModal(null);
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );


  const renderMobileCard = (item) => {
    const poDetails = parsePoDetails(item.poDetails);
    
    const handleAccept = async (po) => {
      try {
        const response = await axios.put(
          `${API}/gold_po/update/accept/${po}/${names}`
        );
        const filteredItems = response.data.findPoDatas;
        const poData = response.data.poData;
        const orderTypes = response.data.orderTypes;
        const poType = response.data.poType;
        console.log(poData)
        if(!poData[0]?.poNumber?.includes("TCT")){
        await generatePdf(filteredItems, poData, orderTypes, poType?.trim());
        }
        
        // if (poData.parentPo.name && poData.parentPo.subTitle) {
        //   await generateTctPdf(filteredItems, poData, orderTypes);
        // }
        
        if (response.status === 200) {
          fetchPoCreationDetails();
        }
      } catch (error) {
        console.log(error);
      }
    };


    const handleReject = async (po) => {
      try {
        const response = await axios.put(
          `${API}/gold_po/update/reject/${po}/${names}`
        );
        if (response.status === 200) {
          fetchPoCreationDetails();
        }
      } catch (error) {
        console.log(error);
      }
    };


    return (
      <div
        key={item.sno}
        className="bg-white border-b-4 border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* Card Header with Image and Selection */}
        <div className="relative">
          {item.product_image && (
            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={item.product_image}
                alt="Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          )}
          
          {selectedItems && (
            <div className="absolute top-3 right-3">
              <label className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.sno)}
                  onChange={() => handleSelect(item.sno, item)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          )}
        </div>


        {/* Product Name - Full Width */}
        <div className="px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-lg font-bold text-white">
            {item.product_name || "Product Name"}
          </h3>
          {ispocreation && poDetails && (
            <div className="text-blue-100 text-xs mt-2 space-y-1">
              <p>PO: {poDetails.poNumber || "N/A"}</p>
              <p>Date: {poDetails.poDate || "N/A"}</p>
            </div>
          )}
        </div>


        {/* Main Content */}
        <div className="px-4 py-4">
          {/* Key Metrics - 2 Column Grid for Pieces and Grams */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Pieces */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <Package className="text-blue-600" size={16} />
                <span className="text-xs font-semibold text-blue-700 uppercase">
                  Pieces
                </span>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {item.pieces || 0}
              </p>
            </div>


            {/* Gross Weight */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-1">
                <Weight className="text-purple-600" size={16} />
                <span className="text-xs font-semibold text-purple-700 uppercase">
                  Gross Wt
                </span>
              </div>
              <p className="text-xl font-bold text-purple-900">
                {item.gross_weight || 0}
                <span className="text-sm ml-1">g</span>
              </p>
            </div>


            {/* Net Weight */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Weight className="text-green-600" size={16} />
                <span className="text-xs font-semibold text-green-700 uppercase">
                  Net Wt
                </span>
              </div>
              <p className="text-xl font-bold text-green-900">
                {item.net_weight || 0}
                <span className="text-sm ml-1">g</span>
              </p>
            </div>


            {/* Amount */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-amber-600" size={16} />
                <span className="text-xs font-semibold text-amber-700 uppercase">
                  Amount
                </span>
              </div>
              <p className="text-xl font-bold text-amber-900">
                ₹{item.amount || 0}
              </p>
            </div>
          </div>


          {/* Detailed Information */}
          <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2 flex items-center gap-2">
              <Gem size={14} className="text-gray-600" />
              Detailed Specifications
            </h4>
            
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                { label: "Rate", value: `₹${item.rate || 0}` },
                { label: "Pure Wt", value: `${item.pure_wt || 0}g` },
                { label: "Stone Wt", value: `${item.stone_weight || 0}g` },
                { label: "Diamond Wt", value: `${item.diamondwt || 0}ct` },
                { label: "Wax Wt", value: `${item.wax_weight || 0}g` },
                { label: "Melting", value: `${item.melting || 0}%` },
                { label: "Wastage", value: `${item.wastage || 0}%` },
                { label: "MC", value: `₹${item.makingCharges || 0}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-0.5">
                    {label}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* Action Buttons */}
          {roleData === "PM" && selectedPoNumber && (
            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => handleAccept(selectedPoNumber)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept
              </button>


              <button
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => handleReject(selectedPoNumber)}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
            </div>
          )}


          {/* Edit/Delete Buttons */}
          {selectedItems && (
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => onEdit(item)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm"
                title="Edit"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setActiveModal(item.sno)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md font-medium text-sm"
                title="Delete"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>


        {renderConfirmModal(item)}
      </div>
    );
  };


  const renderTableContent = (data, title) => {
    if (data.length === 0) return null;


    const handleAccept = async (po) => {
      try {
        const response = await axios.put(
          `${API}/gold_po/update/accept/${po}/${names}`
        );
        const filteredItems = response.data.findPoDatas;
        const poData = response.data.poData;
        const orderTypes = response.data.orderTypes;
        const poType = response.data.poType;
        console.log("11111111111111", poData);
        if (!filteredItems[0].poNumber.includes("TCT")) {
          await generatePdf(filteredItems, poData, orderTypes, poType?.trim());
        }
        // await generatePdf(filteredItems, poData, orderTypes, poType.trim());
        
        // if (poData.parentPo.name && poData.parentPo.subTitle) {
        //   await generateTctPdf(filteredItems, poData, orderTypes, poType);
        // }
        
        if (response.status === 200) {
          fetchPoCreationDetails();
        }
      } catch (error) {
        console.log(error);
      }
    };


    const handleReject = async (po) => {
      try {
        const response = await axios.put(
          `${API}/gold_po/update/reject/${po}/${names}`
        );
        if (response.status === 200) {
          fetchPoCreationDetails();
        }
      } catch (error) {
        console.log(error);
      }
    };


    return (
      <div className="md:mt-8">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 md:rounded-t-2xl p-4 md:p-6 shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={20} />
            </div>
            {title}
          </h2>
        </div>


        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-b-2xl shadow-xl overflow-hidden">
          {roleData === "PM" && selectedPoNumber && (
            <div className="flex gap-4 items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                onClick={() => handleAccept(selectedPoNumber)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept
              </button>


              <button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
                onClick={() => handleReject(selectedPoNumber)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
            </div>
          )}


          {selectedItems && (
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
                <span className="text-gray-700 font-semibold">
                  Total Selected:
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-4 py-1 rounded-full">
                  {selectedItems?.length || 0}
                </span>
              </div>
            </div>
          )}


          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                  {selectedItems && (
                    <th className="px-4 py-4 border-b-2 border-gray-300 text-left font-bold text-gray-700">
                      Select
                    </th>
                  )}
                  {ispocreation && (
                    <>
                      <th className="px-4 py-4 border-b-2 border-gray-300 text-left font-bold text-gray-700 whitespace-nowrap">
                        PO Number
                      </th>
                      <th className="px-4 py-4 border-b-2 border-gray-300 text-left font-bold text-gray-700 whitespace-nowrap">
                        PO Date
                      </th>
                    </>
                  )}
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-left font-bold text-gray-700">
                    Product
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-center font-bold text-gray-700">
                    Pieces
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Rate
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Gross Wt
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700 whitespace-nowrap">
                    Diamond (ct)
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Stone Wt
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Wax Wt
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Net Wt
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Melting
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Wastage
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    MC
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-right font-bold text-gray-700">
                    Pure Wt
                  </th>
                  <th className="px-4 py-4 border-b-2 border-gray-300 text-center font-bold text-gray-700">
                    Photo
                  </th>
                  {selectedItems && (
                    <th className="px-4 py-4 border-b-2 border-gray-300 text-center font-bold text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const poDetails = parsePoDetails(item.poDetails);
                  
                  return (
                    <React.Fragment key={item.sno}>
                      <tr
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors duration-150`}
                      >
                        {selectedItems && (
                          <td className="px-4 py-4 border-b border-gray-200">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.sno)}
                              onChange={() => handleSelect(item.sno, item)}
                              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                        )}

                        {ispocreation && (
                          <>
                            <td className="px-4 py-4 border-b border-gray-200 font-medium text-gray-800">
                              {poDetails?.poNumber || "N/A"}
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200 text-gray-600">
                              {poDetails?.poDate || "N/A"}
                            </td>
                          </>
                        )}
                        <td className="px-4 py-4 border-b border-gray-200 font-semibold text-gray-800">
                          {item.product_name || "NA"}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-center font-semibold text-blue-600">
                          {item.pieces || 0}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          ₹{item.rate || 0}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.gross_weight || 0}g
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.diamondwt || 0}ct
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.stone_weight || 0}g
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.wax_weight || 0}g
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right font-semibold text-green-600">
                          {item.net_weight || 0}g
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right font-bold text-amber-600">
                          ₹{item.amount || 0}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.melting || 0}%
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          {item.wastage || 0}%
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right text-gray-700">
                          ₹{item.makingCharges || 0}
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-right font-semibold text-purple-600">
                          {item.pure_wt || 0}g
                        </td>
                        <td className="px-4 py-4 border-b border-gray-200 text-center">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt="Product"
                              className="w-20 h-20 object-cover rounded-lg shadow-md mx-auto hover:scale-110 transition-transform duration-200 cursor-pointer"
                            />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        {selectedItems && (
                          <td className="px-4 py-4 border-b border-gray-200 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => onEdit(item)}
                                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => setActiveModal(item.sno)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-110 shadow-md"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                      {renderConfirmModal(item)}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>


        {/* Mobile View - Full Width */}
        <div className="block md:hidden">{data.map(renderMobileCard)}</div>
      </div>
    );
  };


  return (
    <div className="w-full md:p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {fairData?.length > 0 &&
        renderTableContent(fairData, "Exhibitions Selection")}
      {officeData?.length > 0 &&
        renderTableContent(officeData, "Office Selection")}


      {submittedData.length === 0 && (
        <div className="mt-8 text-center p-12 bg-white border-2 border-dashed border-gray-300 md:rounded-2xl shadow-lg mx-4 md:mx-0">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="text-gray-400" size={40} />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            No data available at the moment.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Items will appear here once added.
          </p>
        </div>
      )}
    </div>
  );
}


export default SubmittedDataComp;


