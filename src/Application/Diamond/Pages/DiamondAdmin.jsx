

// import React, { useEffect, useState, useContext } from 'react';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import axios from 'axios';
// import { DIA_API } from '../../../config/configData';
// import * as XLSX from 'xlsx';
// import PDFExportButton from "./ExportToPdf"
// import { FileSpreadsheet, FileText } from 'lucide-react';

// const DiamondTable = ({ diamonds }) => {
//   if (!diamonds?.length) return <span className="text-gray-500">No diamond data</span>;

//   return (
//     <div className="min-w-[500px] mr-10 mb-10 mt-10">
//       <table className="w-full text-sm border-collapse table-fixed">
//         <thead>
//           <tr className="bg-gray-50">
//             <th className="p-1 border text-left w-1/5">Shape</th>
//             <th className="p-1 border text-right w-1/5">Stones</th>
//             <th className="p-1 border text-right w-1/5">Carat</th>
//             <th className="p-1 border text-right w-1/5">Rate</th>
//             <th className="p-1 border text-right w-1/5">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {diamonds.map((diamond, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-1 border text-left w-1/5">{diamond.Shape}</td>
//               <td className="p-1 border text-left w-1/5">{diamond.NoOfStones}</td>
//               <td className="p-1 border text-left w-1/5">{Number(diamond.Carat).toFixed(2)}</td>
//               <td className="p-1 border text-left w-1/5">{Number(diamond.Rate).toLocaleString()}</td>
//               <td className="p-1 border text-left w-1/5">{Number(diamond.Value).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };


// // ColorStone Table Component
// const ColorStoneTable = ({ colorStones }) => {
//   if (!colorStones?.length) return <span className="text-gray-500">No colorstone data</span>;

//   return (
//     <div className="min-w-[500px] mr-10 mb-10 mt-10">
//       <table className="w-full text-sm border-collapse table-fixed">
//         <thead>
//           <tr className="bg-gray-50">
//             <th className="p-1 border text-left w-1/5">Type</th>
//             <th className="p-1 border text-left w-1/5">Pcs</th>
//             <th className="p-1 border text-left w-1/5">Carat</th>
//             <th className="p-1 border text-left w-1/5">Rate</th>
//             <th className="p-1 border text-left w-1/5">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {colorStones.map((stone, idx) => (
//             <tr key={idx} className="hover:bg-gray-50">
//               <td className="p-1 border text-left w-1/5">{stone.Type}</td>
//               <td className="p-1 border text-left w-1/5">{stone.Pcs}</td>
//               <td className="p-1 border text-left w-1/5">{Number(stone.csCarat).toFixed(2)}</td>
//               <td className="p-1 border text-left w-1/5">{Number(stone.csRate).toLocaleString()}</td>
//               <td className="p-1 border text-left w-1/5">{Number(stone.Amount).toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
// const DiamondAdmin = () => {
//   const [selectedSupplier, setSelectedSupplier] = useState(null);
//   const [suppliers, setSuppliers] = useState([]);
//   const [data, setData] = useState([]);
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [rejectReason, setRejectReason] = useState('');
//   const [selectedId, setSelectedId] = useState(null);
//   const [selectedDiamonds, setSelectedDiamonds] = useState(null);
//   const { userRole } = useContext(DashBoardContext);
//   console.log(data)
//   const columns = [
//     { id: 'sno', label: 'S.No', type: 'number' },
//     { id: 'SupplierName', label: 'Supplier Name', type: 'text' },
//     { id: 'EstNo', label: 'Estimate No', type: 'text' },
//     { id: 'ProductName', label: 'Product Name', type: 'text' },
//     { id: 'MetalType', label: 'Metal Type', type: 'text' },
//     { id: 'WtMode', label: 'Weight Mode', type: 'text' },
//     { id: 'DesignNo', label: 'Design No', type: 'text' },
//     { id: 'GCarat', label: 'Gold Carat', type: 'number' },
//     { id: 'PCS', label: 'PCS', type: 'number' },
//     { id: 'GoldWt', label: 'Gold Weight', type: 'number' },
//     { id: 'GoldPurity', label: 'Gold Purity', type: 'text' },
//     { id: 'GoldPurityWt', label: 'Gold Purity Weight', type: 'number' },
//     { id: 'Gold999Rate', label: 'Gold 999 Rate', type: 'text' },
//     { id: 'GoldValue', label: 'Gold Value', type: 'number' },
//     { id: 'PTWt', label: 'Platinum Weight', type: 'number' },
//     { id: 'PTPurity', label: 'Platinum Purity', type: 'text' },
//     { id: 'PTPurityWt', label: 'Platinum Purity Weight', type: 'number' },
//     { id: 'PT999Rate', label: 'Platinum 999 Rate', type: 'number' },
//     { id: 'PTValue', label: 'Platinum Value', type: 'number' },
//     { 
//       id: 'DiamondDatas', 
//       label: 'Diamond Data', 
//       type: 'component',
//       render: (value, row) => <DiamondTable diamonds={row.Diamonds} />
//     },
//     { id: 'NoofStone', label: 'Number of Stones', type: 'number' },
//     { id: 'DCarat', label: 'Diamond Carat', type: 'number' },
//     { id: 'DiamondWt', label: 'Diamond Weight', type: 'number' },
//     { id: 'DiamondRate', label: 'Diamond Rate', type: 'number' },
//     { id: 'DiamondValue', label: 'Diamond Value', type: 'number' },
//     { 
//       id: 'ColorStoneDatas', 
//       label: 'Color Stone Data', 
//       type: 'component',
//       render: (value, row) => <ColorStoneTable colorStones={row.ColorStones} />
//     },
//         { id: 'ClrStnPCS', label: 'Color Stone PCS', type: 'number' },
//     { id: 'CLSCarat', label: 'Color Stone Carat', type: 'number' },
//     { id: 'ClrStnWt', label: 'Color Stone Weight', type: 'number' },
//     { id: 'ClrStnRate', label: 'Color Stone Rate', type: 'number' },
//     { id: 'CSAmount', label: 'Color Stone Amount', type: 'number' },
//     { id: 'GoMcType', label: 'Gold Making Charge Type', type: 'text' },
//     { id: 'GoMcRate', label: 'Gold Making Charge Rate', type: 'number' },
//     { id: 'GoMcAmount', label: 'Gold Making Charge Amount', type: 'number' },
//     { id: 'PTMcType', label: 'Platinum Making Charge Type', type: 'text' },
//     { id: 'PTMcRate', label: 'Platinum Making Charge Rate', type: 'number' },
//     { id: 'PTMcAmount', label: 'Platinum Making Charge Amount', type: 'number' },
//     { id: 'WastageType', label: 'Wastage Type', type: 'text' },
//     { id: 'WastageWeight', label: 'Wastage Weight', type: 'number' },
//     { id: 'WastageAmt', label: 'Wastage Amount', type: 'number' },
//     { id: 'CertType', label: 'Certificate Type', type: 'text' },
//     { id: 'CertGST', label: 'Certificate GST', type: 'number' },
//     { id: 'CertQty', label: 'Certificate Quantity', type: 'number' },
//     { id: 'CertRate', label: 'Certificate Rate', type: 'number' },
//     { id: 'CertTaxableAmt', label: 'Certificate Taxable Amount', type: 'number' },
//     { id: 'CertTotal', label: 'Certificate Total', type: 'number' },
//     { id: 'HallMarkType', label: 'Hallmark Type', type: 'text' },
//     { id: 'HMGST', label: 'Hallmark GST', type: 'number' },
//     { id: 'HMQty', label: 'Hallmark Quantity', type: 'number' },
//     { id: 'HMRate', label: 'Hallmark Rate', type: 'number' },
//     { id: 'HMTaxableAmt', label: 'Hallmark Taxable Amount', type: 'number' },
//     { id: 'HMTotal', label: 'Hallmark Total', type: 'number' },
//     { id: 'HandleRate', label: 'Handle Rate', type: 'number' },
//     { id: 'HandleAmount', label: 'Handle Amount', type: 'number' },
//     { id: 'GNetWt', label: 'Gold Net Weight', type: 'number' },
//     { id: 'PNetWt', label: 'Platinum Net Weight', type: 'number' },
//     { id: 'TotalValue', label: 'Total Value', type: 'number' },
//     { id: 'GST', label: 'GST', type: 'number' },
//     { id: 'GrandTotal', label: 'Grand Total', type: 'number' },
//     { id: 'HUID', label: 'HUID', type: 'text' },
//     // { id: 'AcceptReject', label: 'Accept/Reject', type: 'text' },
//   ];
  
 
    

//   // Calculate totals
//   const totals = data.reduce((acc, row) => {
//     console.log(acc, row)
//     columns.forEach(col => {
//       if (col.type === 'number' && col.id !== 'sno') {
//         acc[col.id] = (acc[col.id] || 0) + (Number(row[col.id]) || 0);
//       }
//     });
//     return acc;
//   }, {});

//   // Fetch suppliers
//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const response = await axios.get(`${DIA_API}/supplierNames`);
//         setSuppliers(response.data.filter(Boolean));
//       } catch (error) {
//         console.error('Error fetching suppliers:', error);
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   // Fetch data when supplier changes
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!selectedSupplier) return;
//       try {
//         const response = await axios.get(`${DIA_API}/submitted/SupplierDetails/${selectedSupplier}`);
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, [selectedSupplier]);

//   // Handle actions (Accept/Reject)
//   const handleAction = async (id, action) => {
//     try {
//       const payload = action === 'reject' 
//         ? { status: action, reason: rejectReason } 
//         : { status: action };
        
//       await axios.put(`${DIA_API}/data/action/${id}`, payload);
      
//       // Refresh data after action
//       if (selectedSupplier) {
//         const response = await axios.get(`${DIA_API}/submitted/SupplierDetails/${selectedSupplier}`);
//         setData(response.data);
//       }
      
//       // Reset reject dialog
//       setShowRejectDialog(false);
//       setRejectReason('');
//       setSelectedId(null);
//     } catch (error) {
//       console.error('Error processing action:', error);
//     }
//   };

//   // Export to Excel
//   const handleExport = async () => {
//     try {
//       const response = await axios.put(`${DIA_API}/excel`, data, {
//         responseType: 'blob'
//       });
      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'DiamondDealerReceipt.xlsx';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error('Export failed:', error);
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Header Section */}
//       <div className="mb-6 flex justify-between items-center">
//         <div className="w-64">
//           <select 
//             className="w-full p-2 border rounded"
//             onChange={(e) => setSelectedSupplier(e.target.value)}
//             value={selectedSupplier || ''}
//           >
//             <option value="">Select Supplier</option>
//             {suppliers.map(supplier => (
//               <option key={supplier} value={supplier}>{supplier}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex gap-3">
//         <button
//           onClick={handleExport}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Export to Excel
//         </button>
//         <PDFExportButton data={data} />
//       </div>
//       </div>

//       {/* Main Table */}
//       {data.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border">
//             <thead>
//               <tr className="bg-gray-100">
//                 {columns.map(column => (
//                   <th key={column.id} className="border pr-2 text-left">
//                     {column.label}
//                   </th>
//                 ))}
//                 <th className="border p-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, index) => (
//                 <tr key={row.id || index} className="hover:bg-gray-50">
//                   {columns.map(column => (
//                     <td key={column.id} className={`border ${column.render? "p-0":"p-2"}  `}>
//                       {column.render ? 
//                         column.render(row[column.id], row) :
//                         column.type === 'number' && column.id !== 'sno'
//                           ? Number(row[column.id]).toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2
//                             })
//                           : column.id === 'sno'
//                           ? index + 1
//                           : row[column.id]}
//                     </td>
//                   ))}
//                   <td className="border p-2">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleAction(row.id, 'accept')}
//                         className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => {
//                           setSelectedId(row.id);
//                           setShowRejectDialog(true);
//                         }}
//                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr className="bg-gray-50 font-bold">
//                 {columns.map(column => (
//                   <td key={column.id} className="border p-2">
//                     {column.type === 'number' && column.id !== 'sno'
//                       ? totals[column.id]?.toLocaleString(undefined, {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })
//                       : column.id === 'sno'
//                       ? 'Totals'
//                       : ''}
//                   </td>
//                 ))}
//               </tr>
//             </tfoot>
//           </table>
         
//         </div>
//       ) : (
//         <div className="text-center p-4 bg-gray-100 rounded">
//           No data available
//         </div>
//       )}

//       {/* Reject Dialog */}
//       {showRejectDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg max-w-md w-full">
//             <h3 className="text-lg font-bold mb-4">Reject Entry</h3>
//             <textarea
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//               placeholder="Enter reason for rejection"
//               className="w-full p-2 border rounded mb-4"
//               rows={3}
//             />
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowRejectDialog(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleAction(selectedId, 'reject')}
//                 disabled={!rejectReason.trim()}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DiamondAdmin;



import React, { useEffect, useState, useContext } from 'react';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import axios from 'axios';
import { DIA_API } from '../../../config/configData';
import * as XLSX from 'xlsx';
import PDFExportButton from "./ExportToPdf"
import { FileSpreadsheet, FileText } from 'lucide-react';

const DiamondTable = ({ diamonds }) => {
  if (!diamonds?.length) return <span className="text-gray-500">No diamond data</span>;

  return (
    <div className="min-w-[500px] mr-10 mb-10 mt-10">
      <table className="w-full text-sm border-collapse table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1 border text-left w-1/5">Shape</th>
            <th className="p-1 border text-right w-1/5">Stones</th>
            <th className="p-1 border text-right w-1/5">Carat</th>
            <th className="p-1 border text-right w-1/5">Rate</th>
            <th className="p-1 border text-right w-1/5">Value</th>
          </tr>
        </thead>
        <tbody>
          {diamonds.map((diamond, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-1 border text-left w-1/5">{diamond.Shape}</td>
              <td className="p-1 border text-left w-1/5">{diamond.NoOfStones}</td>
              <td className="p-1 border text-left w-1/5">{Number(diamond.Carat).toFixed(2)}</td>
              <td className="p-1 border text-left w-1/5">{Number(diamond.Rate).toLocaleString()}</td>
              <td className="p-1 border text-left w-1/5">{Number(diamond.Value).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// ColorStone Table Component
const ColorStoneTable = ({ colorStones }) => {
  if (!colorStones?.length) return <span className="text-gray-500">No colorstone data</span>;

  return (
    <div className="min-w-[500px] mr-10 mb-10 mt-10">
      <table className="w-full text-sm border-collapse table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1 border text-left w-1/5">Type</th>
            <th className="p-1 border text-left w-1/5">Pcs</th>
            <th className="p-1 border text-left w-1/5">Carat</th>
            <th className="p-1 border text-left w-1/5">Rate</th>
            <th className="p-1 border text-left w-1/5">Amount</th>
          </tr>
        </thead>
        <tbody>
          {colorStones.map((stone, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-1 border text-left w-1/5">{stone.Type}</td>
              <td className="p-1 border text-left w-1/5">{stone.Pcs}</td>
              <td className="p-1 border text-left w-1/5">{Number(stone.csCarat).toFixed(2)}</td>
              <td className="p-1 border text-left w-1/5">{Number(stone.csRate).toLocaleString()}</td>
              <td className="p-1 border text-left w-1/5">{Number(stone.Amount).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const DiamondAdmin = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [data, setData] = useState([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDiamonds, setSelectedDiamonds] = useState(null);
  const { userRole } = useContext(DashBoardContext);
  console.log(data)
  
  const columns = [
    { id: 'sno', label: 'S.No', type: 'number' },
    { id: 'SupplierName', label: 'Supplier Name', type: 'text' },
    { id: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
    { id: 'ProductName', label: 'Product Name', type: 'text' },
    { id: 'MetalType', label: 'Metal Type', type: 'text' },
    { id: 'WtMode', label: 'Weight Mode', type: 'text' },
    { id: 'DesignNo', label: 'Design No', type: 'text' },
    { id: 'GCarat', label: 'Gold Carat', type: 'number' },
    { id: 'PCS', label: 'PCS', type: 'number' },
    { id: 'GoldWt', label: 'Gold Weight', type: 'number' },
    { id: 'GoldPurity', label: 'Gold Purity', type: 'text' },
    { id: 'GoldPurityWt', label: 'Gold Purity Weight', type: 'number' },
    { id: 'Gold999Rate', label: 'Gold 999 Rate', type: 'text' },
    { id: 'GoldValue', label: 'Gold Value', type: 'number' },
    { id: 'PTWt', label: 'Platinum Weight', type: 'number' },
    { id: 'PTPurity', label: 'Platinum Purity', type: 'text' },
    { id: 'PTPurityWt', label: 'Platinum Purity Weight', type: 'number' },
    { id: 'PT999Rate', label: 'Platinum 999 Rate', type: 'number' },
    { id: 'PTValue', label: 'Platinum Value', type: 'number' },
    { 
      id: 'DiamondDatas', 
      label: 'Diamond Data', 
      type: 'component',
      render: (value, row) => <DiamondTable diamonds={row.Diamonds} />
    },
    { id: 'NoofStone', label: 'Number of Stones', type: 'number' },
    { id: 'DCarat', label: 'Diamond Carat', type: 'number' },
    { id: 'DiamondWt', label: 'Diamond Weight', type: 'number' },
    { id: 'DiamondRate', label: 'Diamond Rate', type: 'number' },
    { id: 'DiamondValue', label: 'Diamond Value', type: 'number' },
    { 
      id: 'ColorStoneDatas', 
      label: 'Color Stone Data', 
      type: 'component',
      render: (value, row) => <ColorStoneTable colorStones={row.ColorStones} />
    },
        { id: 'ClrStnPCS', label: 'Color Stone PCS', type: 'number' },
    { id: 'CLSCarat', label: 'Color Stone Carat', type: 'number' },
    { id: 'ClrStnWt', label: 'Color Stone Weight', type: 'number' },
    { id: 'ClrStnRate', label: 'Color Stone Rate', type: 'number' },
    { id: 'CSAmount', label: 'Color Stone Amount', type: 'number' },
    { id: 'GoMcType', label: 'Gold Making Charge Type', type: 'text' },
    { id: 'GoMcRate', label: 'Gold Making Charge Rate', type: 'number' },
    { id: 'GoMcAmount', label: 'Gold Making Charge Amount', type: 'number' },
    { id: 'PTMcType', label: 'Platinum Making Charge Type', type: 'text' },
    { id: 'PTMcRate', label: 'Platinum Making Charge Rate', type: 'number' },
    { id: 'PTMcAmount', label: 'Platinum Making Charge Amount', type: 'number' },
    { id: 'WastageType', label: 'Wastage Type', type: 'text' },
    { id: 'WastageWeight', label: 'Wastage Weight', type: 'number' },
    { id: 'WastageAmt', label: 'Wastage Amount', type: 'number' },
    { id: 'CertType', label: 'Certificate Type', type: 'text' },
    { id: 'CertGST', label: 'Certificate GST', type: 'number' },
    { id: 'CertQty', label: 'Certificate Quantity', type: 'number' },
    { id: 'CertRate', label: 'Certificate Rate', type: 'number' },
    { id: 'CertTaxableAmt', label: 'Certificate Taxable Amount', type: 'number' },
    { id: 'CertTotal', label: 'Certificate Total', type: 'number' },
    { id: 'HallMarkType', label: 'Hallmark Type', type: 'text' },
    { id: 'HMGST', label: 'Hallmark GST', type: 'number' },
    { id: 'HMQty', label: 'Hallmark Quantity', type: 'number' },
    { id: 'HMRate', label: 'Hallmark Rate', type: 'number' },
    { id: 'HMTaxableAmt', label: 'Hallmark Taxable Amount', type: 'number' },
    { id: 'HMTotal', label: 'Hallmark Total', type: 'number' },
    { id: 'HandleRate', label: 'Handle Rate', type: 'number' },
    { id: 'HandleAmount', label: 'Handle Amount', type: 'number' },
    { id: 'GNetWt', label: 'Gold Net Weight', type: 'number' },
    { id: 'PNetWt', label: 'Platinum Net Weight', type: 'number' },
    { id: 'TotalValue', label: 'Total Value', type: 'number' },
    { id: 'GST', label: 'GST', type: 'number' },
    { id: 'GrandTotal', label: 'Grand Total', type: 'number' },
    { id: 'HUID', label: 'HUID', type: 'text' },
    // { id: 'AcceptReject', label: 'Accept/Reject', type: 'text' },
  ];
  
  const formatNumber = (value, columnId) => {
    // Columns requiring 3 decimal places
    const threeDecimalColumns = [
      'GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 
      'DCarat', 'DiamondWt', 'CLSCarat', 'ClrStnWt'
    ];

    // Columns requiring no decimal places (integers)
    const integerColumns = ['PCS', 'NoofStone', 'ClrStnPCS'];

    if (threeDecimalColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    }

    if (integerColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }

    // Default formatting for other number columns
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
    

  // Calculate totals
  const totals = data.reduce((acc, row) => {
    console.log(acc, row)
    columns.forEach(col => {
      if (col.type === 'number' && col.id !== 'sno') {
        acc[col.id] = (acc[col.id] || 0) + (Number(row[col.id]) || 0);
      }
    });
    return acc;
  }, {});

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${DIA_API}/supplierNames`);
        setSuppliers(response.data.filter(Boolean));
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    fetchSuppliers();
  }, []);

  // Fetch data when supplier changes
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedSupplier) return;
      try {
        const response = await axios.get(`${DIA_API}/submitted/SupplierDetails/${selectedSupplier}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [selectedSupplier]);

  // Handle actions (Accept/Reject)
  const handleAction = async (id, action) => {
    try {
      const payload = action === 'reject' 
        ? { status: action, reason: rejectReason } 
        : { status: action };
        
      await axios.put(`${DIA_API}/data/action/${id}`, payload);
      
      // Refresh data after action
      if (selectedSupplier) {
        const response = await axios.get(`${DIA_API}/submitted/SupplierDetails/${selectedSupplier}`);
        setData(response.data);
      }
      
      // Reset reject dialog
      setShowRejectDialog(false);
      setRejectReason('');
      setSelectedId(null);
    } catch (error) {
      console.error('Error processing action:', error);
    }
  };

  // Export to Excel
  const handleExport = async () => {
    try {
      const response = await axios.put(`${DIA_API}/excel`, data, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DiamondDealerReceipt.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="w-64">
          <select 
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedSupplier(e.target.value)}
            value={selectedSupplier || ''}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export to Excel
        </button>
        <PDFExportButton data={data} />
      </div>
      </div>

      {/* Main Table */}
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                {columns.map(column => (
                  <th key={column.id} className="border pr-2 text-left">
                    {column.label}
                  </th>
                ))}
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td key={column.id} className={`border ${column.render? "p-0":"p-2"}  `}>
                      {column.render ? 
                        column.render(row[column.id], row) :
                        column.type === 'number' && column.id !== 'sno'
                          ? formatNumber(row[column.id],column.id)
                          : column.id === 'sno'
                          ? index + 1
                          : row[column.id]}
                    </td>
                  ))}
                  <td className="border p-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(row.id, 'accept')}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(row.id);
                          setShowRejectDialog(true);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                {columns.map(column => (
                  <td key={column.id} className="border p-2">
                    {column.type === 'number' && column.id !== 'sno'
                      ? formatNumber(totals[column.id], column.id)
                      : column.id === 'sno'
                      ? 'Totals'
                      : ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
         
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded">
          No data available
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Reject Entry</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection"
              className="w-full p-2 border rounded mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectDialog(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedId, 'reject')}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiamondAdmin;

