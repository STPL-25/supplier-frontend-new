// import React, { useState, useContext,  } from 'react';
// import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus } from 'react-icons/fi';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// // Mocking your DashboardContext for demonstration
// // In your actual app, import this from your context file

// const diamondShapes = [
//  "PEAR",
//  "PRINCESS",
//  "MARQUISE",
//  "ROUND",
//  "MARQUICE",
//  "BAGUETTE",

// ];

// const DiamondQuotationEntry = () => {
//   // 1. Context & State
//   const { suppCode } = useContext(DashBoardContext);
  
//   // Shared header data (Dates)
//   const [headerData, setHeaderData] = useState({
//     QuotationDate: new Date().toISOString().split('T')[0],
//     ValidityDate: '',
//   });

//   // Entry Form Data
//   const initialFormState = {
//     Shape: '',
//     Carat_From_Weight: '',
//     Carat_T0_Weight: '',
//     Rate_Per_Carat: '',
//   };
//   const [formData, setFormData] = useState(initialFormState);
  
//   // Submitted Data Table State
//   const [submittedList, setSubmittedList] = useState([]);
  
//   // Inline Editing State
//   const [editIndex, setEditIndex] = useState(-1);
//   const [editFormData, setEditFormData] = useState({});
//   const [errors, setErrors] = useState({});

//   // 2. Validation Logic (Reusable for both Entry and Edit)
//   const validateData = (data, isHeaderIncluded = false) => {
//     const newErrors = {};

//     if (isHeaderIncluded) {
//       if (!headerData.QuotationDate) newErrors.QuotationDate = 'Required';
//       if (headerData.ValidityDate && new Date(headerData.ValidityDate) < new Date(headerData.QuotationDate)) {
//         newErrors.ValidityDate = 'Invalid Date';
//       }
//     }

//     if (!data.Shape) newErrors.Shape = 'Required';
    
//     const rate = parseFloat(data.Rate_Per_Carat);
//     if (isNaN(rate) || rate <= 0) newErrors.Rate_Per_Carat = 'Invalid rate';

//     const fromWeight = parseFloat(data.Carat_From_Weight);
//     const toWeight = parseFloat(data.Carat_T0_Weight);

//     if (isNaN(fromWeight) || fromWeight < 0) newErrors.Carat_From_Weight = 'Invalid';
//     if (isNaN(toWeight) || toWeight < 0) newErrors.Carat_T0_Weight = 'Invalid';

//     if (!isNaN(fromWeight) && !isNaN(toWeight) && fromWeight >= toWeight) {
//       newErrors.weightRelation = '"From" must be < "To"';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // 3. Handlers for New Entry
//   const handleAddSubmit = (e) => {
//     e.preventDefault();
//     if (validateData(formData, true)) {
//       const newEntry = {
//         ...headerData,
//         ...formData,
//         SuppCode: suppCode,
//         Carat_From_Weight: parseFloat(formData.Carat_From_Weight).toFixed(3),
//         Carat_T0_Weight: parseFloat(formData.Carat_T0_Weight).toFixed(3),
//         Rate_Per_Carat: parseFloat(formData.Rate_Per_Carat).toFixed(3),
//         Status: 'P', 
//       };
      
//       setSubmittedList([newEntry, ...submittedList]);
      
//       // Reset only weights and amounts for rapid consecutive entry, keep shape
//       setFormData({ ...formData, Carat_From_Weight: '', Carat_T0_Weight: '', Rate_Per_Carat: '' });
//       setErrors({});
//     }
//   };

//   // 4. Handlers for Inline Editing
//   const startEdit = (index, item) => {
//     setEditIndex(index);
//     setEditFormData({ ...item });
//     setErrors({});
//   };

//   const cancelEdit = () => {
//     setEditIndex(-1);
//     setEditFormData({});
//     setErrors({});
//   };

//   const saveEdit = (index) => {
//     if (validateData(editFormData, false)) {
//       const updatedList = [...submittedList];
//       updatedList[index] = {
//         ...editFormData,
//         Carat_From_Weight: parseFloat(editFormData.Carat_From_Weight).toFixed(3),
//         Carat_T0_Weight: parseFloat(editFormData.Carat_T0_Weight).toFixed(3),
//         Rate_Per_Carat: parseFloat(editFormData.Rate_Per_Carat).toFixed(3),
//       };
//       setSubmittedList(updatedList);
//       setEditIndex(-1);
//       setErrors({});
//     }
//   };

//   const deleteEntry = (index) => {
//     const updatedList = submittedList.filter((_, i) => i !== index);
//     setSubmittedList(updatedList);
//   };

//   // 5. Render
//   return (
//     <div className="w-full max-w-6xl mx-auto mt-6 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
      
//       {/* --- HEADER SECTION --- */}
//       <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-6 items-center justify-between">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             Diamond Quotation Master
//           </h2>
//           <p className="text-sm text-gray-500 mt-1">Supplier: <span className="font-semibold text-blue-600">{suppCode}</span></p>
//         </div>
        
//         <div className="flex gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1">Quotation Date *</label>
//             <input
//               type="date"
//               value={headerData.QuotationDate}
//               onChange={(e) => setHeaderData({ ...headerData, QuotationDate: e.target.value })}
//               className={`p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.QuotationDate ? 'border-red-500' : 'border-gray-300'}`}
//             />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1">Validity Date</label>
//             <input
//               type="date"
//               value={headerData.ValidityDate}
//               onChange={(e) => setHeaderData({ ...headerData, ValidityDate: e.target.value })}
//               min={headerData.QuotationDate}
//               className={`p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.ValidityDate ? 'border-red-500' : 'border-gray-300'}`}
//             />
//           </div>
//         </div>
//       </div>

//       {/* --- DATA ENTRY FORM --- */}
//       <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 mb-6">
//         <h3 className="text-sm font-semibold text-blue-800 mb-4 uppercase tracking-wider">Quick Add Entry</h3>
        
//         {errors.weightRelation && (
//           <div className="mb-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
//             {errors.weightRelation}
//           </div>
//         )}

//         <form onSubmit={handleAddSubmit} className="flex flex-wrap items-end gap-4">
//           <div className="flex-1 min-w-[150px]">
//             <label className="block text-xs font-medium text-gray-700 mb-1">Shape *</label>
//             <select
//               value={formData.Shape}
//               onChange={(e) => setFormData({ ...formData, Shape: e.target.value })}
//               className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Shape ? 'border-red-500' : 'border-gray-300'}`}
//             >
//               <option value="">Select Shape...</option>
//               {diamondShapes.map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//           </div>

//           <div className="w-32">
//             <label className="block text-xs font-medium text-gray-700 mb-1">From (ct) *</label>
//             <input
//               type="number"
//               step="0.001"
//               placeholder="0.000"
//               value={formData.Carat_From_Weight}
//               onChange={(e) => setFormData({ ...formData, Carat_From_Weight: e.target.value })}
//               className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Carat_From_Weight ? 'border-red-500' : 'border-gray-300'}`}
//             />
//           </div>

//           <div className="w-32">
//             <label className="block text-xs font-medium text-gray-700 mb-1">To (ct) *</label>
//             <input
//               type="number"
//               step="0.001"
//               placeholder="0.000"
//               value={formData.Carat_T0_Weight}
//               onChange={(e) => setFormData({ ...formData, Carat_T0_Weight: e.target.value })}
//               className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Carat_T0_Weight ? 'border-red-500' : 'border-gray-300'}`}
//             />
//           </div>

//           <div className="w-40">
//             <label className="block text-xs font-medium text-gray-700 mb-1">Amount/Carat *</label>
//             <div className="relative">
//               <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
//               <input
//                 type="number"
//                 step="0.001"
//                 placeholder="0.000"
//                 value={formData.Rate_Per_Carat}
//                 onChange={(e) => setFormData({ ...formData, Rate_Per_Carat: e.target.value })}
//                 className={`w-full pl-7 p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Rate_Per_Carat ? 'border-red-500' : 'border-gray-300'}`}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="h-[42px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
//           >
//             <FiPlus /> Add
//           </button>
//         </form>
//       </div>

//       {/* --- SUBMITTED DATA TABLE --- */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//           <h3 className="text-sm font-semibold text-gray-700">Quotation Lines ({submittedList.length})</h3>
//           {submittedList.length > 0 && (
//             <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors">
//               Save All to Database
//             </button>
//           )}
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
//                 <th className="p-3 font-medium border-b">Shape</th>
//                 <th className="p-3 font-medium border-b">From Wt</th>
//                 <th className="p-3 font-medium border-b">To Wt</th>
//                 <th className="p-3 font-medium border-b">Rate / Ct</th>
//                 <th className="p-3 font-medium border-b text-center w-24">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-sm divide-y divide-gray-100">
//               {submittedList.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-gray-400">
//                     No diamond quotations added yet.
//                   </td>
//                 </tr>
//               ) : (
//                 submittedList.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                     {/* EDIT MODE */}
//                     {editIndex === idx ? (
//                       <>
//                         <td className="p-2">
//                           <select
//                             value={editFormData.Shape}
//                             onChange={(e) => setEditFormData({ ...editFormData, Shape: e.target.value })}
//                             className="w-full p-1.5 border border-gray-300 rounded text-sm"
//                           >
//                             {diamondShapes.map(s => <option key={s} value={s}>{s}</option>)}
//                           </select>
//                         </td>
//                         <td className="p-2">
//                           <input
//                             type="number" step="0.001"
//                             value={editFormData.Carat_From_Weight}
//                             onChange={(e) => setEditFormData({ ...editFormData, Carat_From_Weight: e.target.value })}
//                             className="w-full p-1.5 border border-gray-300 rounded text-sm"
//                           />
//                         </td>
//                         <td className="p-2">
//                           <input
//                             type="number" step="0.001"
//                             value={editFormData.Carat_T0_Weight}
//                             onChange={(e) => setEditFormData({ ...editFormData, Carat_T0_Weight: e.target.value })}
//                             className={`w-full p-1.5 border rounded text-sm ${errors.weightRelation ? 'border-red-500' : 'border-gray-300'}`}
//                           />
//                         </td>
//                         <td className="p-2">
//                           <input
//                             type="number" step="0.001"
//                             value={editFormData.Rate_Per_Carat}
//                             onChange={(e) => setEditFormData({ ...editFormData, Rate_Per_Carat: e.target.value })}
//                             className="w-full p-1.5 border border-gray-300 rounded text-sm"
//                           />
//                         </td>
//                         <td className="p-2">
//                           <div className="flex items-center justify-center gap-2">
//                             <button onClick={() => saveEdit(idx)} className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Save">
//                               <FiCheck />
//                             </button>
//                             <button onClick={cancelEdit} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel">
//                               <FiX />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : (
//                       /* READ MODE */
//                       <>
//                         <td className="p-3 text-gray-800 font-medium">{item.Shape}</td>
//                         <td className="p-3 text-gray-600">{item.Carat_From_Weight} ct</td>
//                         <td className="p-3 text-gray-600">{item.Carat_T0_Weight} ct</td>
//                         <td className="p-3 text-gray-800 font-semibold">${item.Rate_Per_Carat}</td>
//                         <td className="p-3">
//                           <div className="flex items-center justify-center gap-3">
//                             <button 
//                               onClick={() => startEdit(idx, item)} 
//                               className="text-blue-500 hover:text-blue-700 transition-colors"
//                               title="Edit"
//                             >
//                               <FiEdit2 />
//                             </button>
//                             <button 
//                               onClick={() => deleteEntry(idx)} 
//                               className="text-red-500 hover:text-red-700 transition-colors"
//                               title="Delete"
//                             >
//                               <FiTrash2 />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiamondQuotationEntry;
// import React, { useState, useContext } from 'react';
// import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus, FiSave, } from 'react-icons/fi';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import axios from 'axios';
// import { DIA_API } from '../../../config/configData';

// const diamondShapes = ["PEAR", "PRINCESS", "MARQUISE", "ROUND", "MARQUICE", "BAGUETTE"];

// const inputCls = (hasError) =>
//   `w-full px-3 py-2 rounded-lg border text-sm bg-white transition-all duration-200 outline-none
//    focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
//    ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`;

// const DiamondQuotationEntry = () => {
//   const { suppCode } = useContext(DashBoardContext);

//   const [headerData, setHeaderData] = useState({
//     QuotationDate: new Date().toISOString().split('T')[0],
//     ValidityDate: '',
//   });

//   const initialFormState = {
//     Shape: '',
//     Carat_From_Weight: '',
//     Carat_T0_Weight: '',
//     Rate_Per_Carat: '',
//   };

//   const [formData, setFormData]       = useState(initialFormState);
//   const [submittedList, setSubmittedList] = useState([]);
//   const [editIndex, setEditIndex]     = useState(-1);
//   const [editFormData, setEditFormData] = useState({});
//   const [errors, setErrors]           = useState({});
//   const [isSaving, setIsSaving]       = useState(false);
//   const [saveStatus, setSaveStatus]   = useState(null); // 'success' | 'error'

//   // ── Validation ──────────────────────────────────────────────
//   const validateData = (data, isHeaderIncluded = false) => {
//     const newErrors = {};
//     if (isHeaderIncluded) {
//       if (!headerData.QuotationDate) newErrors.QuotationDate = 'Required';
//       if (
//         headerData.ValidityDate &&
//         new Date(headerData.ValidityDate) < new Date(headerData.QuotationDate)
//       ) newErrors.ValidityDate = 'Must be after quotation date';
//     }
//     if (!data.Shape) newErrors.Shape = 'Required';
//     const rate = parseFloat(data.Rate_Per_Carat);
//     if (isNaN(rate) || rate <= 0) newErrors.Rate_Per_Carat = 'Must be > 0';
//     const from = parseFloat(data.Carat_From_Weight);
//     const to   = parseFloat(data.Carat_T0_Weight);
//     if (isNaN(from) || from < 0) newErrors.Carat_From_Weight = 'Invalid';
//     if (isNaN(to)   || to   < 0) newErrors.Carat_T0_Weight   = 'Invalid';
//     if (!isNaN(from) && !isNaN(to) && from >= to)
//       newErrors.weightRelation = '"From" weight must be less than "To" weight';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // ── Add Entry ────────────────────────────────────────────────
//   const handleAddSubmit = (e) => {
//     e.preventDefault();
//     if (!validateData(formData, true)) return;
//     const newEntry = {
//       ...headerData,
//       ...formData,
//       SuppCode: suppCode,
//       Carat_From_Weight: parseFloat(formData.Carat_From_Weight).toFixed(3),
//       Carat_T0_Weight:   parseFloat(formData.Carat_T0_Weight).toFixed(3),
//       Rate_Per_Carat:    parseFloat(formData.Rate_Per_Carat).toFixed(3),
//       Status: 'P',
//     };
//     setSubmittedList([newEntry, ...submittedList]);
//     setFormData({ ...formData, Carat_From_Weight: '', Carat_T0_Weight: '', Rate_Per_Carat: '' });
//     setErrors({});
//     setSaveStatus(null);
//   };

//   // ── Inline Edit ──────────────────────────────────────────────
//   const startEdit  = (i, item) => { setEditIndex(i); setEditFormData({ ...item }); setErrors({}); };
//   const cancelEdit = ()        => { setEditIndex(-1); setEditFormData({}); setErrors({}); };
//   const saveEdit   = (i)       => {
//     if (!validateData(editFormData, false)) return;
//     const list = [...submittedList];
//     list[i] = {
//       ...editFormData,
//       Carat_From_Weight: parseFloat(editFormData.Carat_From_Weight).toFixed(3),
//       Carat_T0_Weight:   parseFloat(editFormData.Carat_T0_Weight).toFixed(3),
//       Rate_Per_Carat:    parseFloat(editFormData.Rate_Per_Carat).toFixed(3),
//     };
//     setSubmittedList(list);
//     setEditIndex(-1);
//     setErrors({});
//   };
//   const deleteEntry = (i) => setSubmittedList(submittedList.filter((_, idx) => idx !== i));

//   // ── Save to DB (API call) ────────────────────────────────────
//   const handleSaveAll = async () => {
//     if (!submittedList.length) return;
//     setIsSaving(true);
//     setSaveStatus(null);
//     try {
//       await axios.post(`${DIA_API}/diamond-quotation/save`, {
//         SuppCode: suppCode,
//         QuotationDate: headerData.QuotationDate,
//         ValidityDate:  headerData.ValidityDate,
//         lines: submittedList,
//       });
//       setSaveStatus('success');
//       setSubmittedList([]);
//     } catch (err) {
//       setSaveStatus('error');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // ── Shape Badge ──────────────────────────────────────────────
//   const shapeColors = {
//     ROUND: 'bg-blue-100 text-blue-700',
//     PEAR: 'bg-purple-100 text-purple-700',
//     PRINCESS: 'bg-pink-100 text-pink-700',
//     MARQUISE: 'bg-amber-100 text-amber-700',
//     MARQUICE: 'bg-orange-100 text-orange-700',
//     BAGUETTE: 'bg-teal-100 text-teal-700',
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
//       <div className=" mx-auto space-y-5">

//         {/* ── PAGE TITLE ── */}
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg">
//             {/* <FiGem className="text-white w-5 h-5" /> */}
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-slate-800 leading-tight">Diamond Quotation Master</h1>
//             <p className="text-xs text-slate-500">
//               Supplier: <span className="font-semibold text-indigo-600">{suppCode}</span>
//             </p>
//           </div>
//         </div>

//         {/* ── HEADER CARD ── */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5">
//           <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
//             Quotation Details
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">
//                 Quotation Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={headerData.QuotationDate}
//                 onChange={(e) => setHeaderData({ ...headerData, QuotationDate: e.target.value })}
//                 className={inputCls(errors.QuotationDate)}
//               />
//               {errors.QuotationDate && <p className="text-red-500 text-xs mt-1">{errors.QuotationDate}</p>}
//             </div>
//             <div>
//               <label className="block text-xs font-medium text-slate-600 mb-1.5">Validity Date</label>
//               <input
//                 type="date"
//                 value={headerData.ValidityDate}
//                 min={headerData.QuotationDate}
//                 onChange={(e) => setHeaderData({ ...headerData, ValidityDate: e.target.value })}
//                 className={inputCls(errors.ValidityDate)}
//               />
//               {errors.ValidityDate && <p className="text-red-500 text-xs mt-1">{errors.ValidityDate}</p>}
//             </div>
//           </div>
//         </div>

//         {/* ── ENTRY FORM CARD ── */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-indigo-100 p-5">
//           <h2 className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">
//             Add Quotation Line
//           </h2>

//           {errors.weightRelation && (
//             <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
//               <FiX className="shrink-0" /> {errors.weightRelation}
//             </div>
//           )}

//           <form onSubmit={handleAddSubmit}>
//             {/* Responsive grid: stacks on mobile, inline on lg */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-3 items-end">
//               <div className="col-span-2 sm:col-span-4 lg:col-span-1">
//                 <label className="block text-xs font-medium text-slate-600 mb-1.5">
//                   Shape <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.Shape}
//                   onChange={(e) => setFormData({ ...formData, Shape: e.target.value })}
//                   className={inputCls(errors.Shape)}
//                 >
//                   <option value="">Select shape…</option>
//                   {diamondShapes.map((s) => <option key={s} value={s}>{s}</option>)}
//                 </select>
//                 {errors.Shape && <p className="text-red-500 text-xs mt-1">{errors.Shape}</p>}
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-600 mb-1.5">From (ct)</label>
//                 <input
//                   type="number" step="0.001" placeholder="0.000"
//                   value={formData.Carat_From_Weight}
//                   onChange={(e) => setFormData({ ...formData, Carat_From_Weight: e.target.value })}
//                   className={inputCls(errors.Carat_From_Weight)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-600 mb-1.5">To (ct)</label>
//                 <input
//                   type="number" step="0.001" placeholder="0.000"
//                   value={formData.Carat_T0_Weight}
//                   onChange={(e) => setFormData({ ...formData, Carat_T0_Weight: e.target.value })}
//                   className={inputCls(errors.Carat_T0_Weight)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-medium text-slate-600 mb-1.5">Rate / Carat</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
//                   <input
//                     type="number" step="0.001" placeholder="0.000"
//                     value={formData.Rate_Per_Carat}
//                     onChange={(e) => setFormData({ ...formData, Rate_Per_Carat: e.target.value })}
//                     className={`${inputCls(errors.Rate_Per_Carat)} pl-7`}
//                   />
//                 </div>
//                 {errors.Rate_Per_Carat && <p className="text-red-500 text-xs mt-1">{errors.Rate_Per_Carat}</p>}
//               </div>

//               <div className="col-span-2 sm:col-span-4 lg:col-span-1">
//                 <button
//                   type="submit"
//                   className="w-full h-[38px] flex items-center justify-center gap-2 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm shadow-indigo-200"
//                 >
//                   <FiPlus className="w-4 h-4" /> Add Line
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* ── TABLE CARD ── */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
//           {/* Table Header */}
//           <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/60">
//             <div className="flex items-center gap-2">
//               <span className="text-sm font-semibold text-slate-700">Quotation Lines</span>
//               <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full">
//                 {submittedList.length}
//               </span>
//             </div>
//             {submittedList.length > 0 && (
//               <button
//                 onClick={handleSaveAll}
//                 disabled={isSaving}
//                 className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm shadow-emerald-200"
//               >
//                 <FiSave className="w-4 h-4" />
//                 {isSaving ? 'Saving…' : 'Save to Database'}
//               </button>
//             )}
//           </div>

//           {/* Save Status Banner */}
//           {saveStatus === 'success' && (
//             <div className="mx-5 mt-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
//               <FiCheck /> All quotation lines saved successfully!
//             </div>
//           )}
//           {saveStatus === 'error' && (
//             <div className="mx-5 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
//               <FiX /> Failed to save. Please try again.
//             </div>
//           )}

//           {/* Desktop Table */}
//           <div className="hidden sm:block overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   {['#', 'Shape', 'From Wt', 'To Wt', 'Rate / Ct', 'Actions'].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {submittedList.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center">
//                       {/* <FiGem className="mx-auto w-8 h-8 text-slate-200 mb-3" /> */}
//                       <p className="text-slate-400 text-sm">No quotation lines added yet</p>
//                     </td>
//                   </tr>
//                 ) : (
//                   submittedList.map((item, idx) => (
//                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
//                       {editIndex === idx ? (
//                         <>
//                           <td className="px-4 py-2 text-slate-400 text-xs">{idx + 1}</td>
//                           <td className="px-2 py-2">
//                             <select
//                               value={editFormData.Shape}
//                               onChange={(e) => setEditFormData({ ...editFormData, Shape: e.target.value })}
//                               className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
//                             >
//                               {diamondShapes.map((s) => <option key={s} value={s}>{s}</option>)}
//                             </select>
//                           </td>
//                           <td className="px-2 py-2">
//                             <input type="number" step="0.001" value={editFormData.Carat_From_Weight}
//                               onChange={(e) => setEditFormData({ ...editFormData, Carat_From_Weight: e.target.value })}
//                               className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
//                             />
//                           </td>
//                           <td className="px-2 py-2">
//                             <input type="number" step="0.001" value={editFormData.Carat_T0_Weight}
//                               onChange={(e) => setEditFormData({ ...editFormData, Carat_T0_Weight: e.target.value })}
//                               className={`w-24 px-2 py-1.5 border rounded-lg text-sm ${errors.weightRelation ? 'border-red-400' : 'border-slate-200'}`}
//                             />
//                           </td>
//                           <td className="px-2 py-2">
//                             <input type="number" step="0.001" value={editFormData.Rate_Per_Carat}
//                               onChange={(e) => setEditFormData({ ...editFormData, Rate_Per_Carat: e.target.value })}
//                               className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
//                             />
//                           </td>
//                           <td className="px-4 py-2">
//                             <div className="flex gap-2">
//                               <button onClick={() => saveEdit(idx)} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors" title="Save"><FiCheck /></button>
//                               <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors" title="Cancel"><FiX /></button>
//                             </div>
//                           </td>
//                         </>
//                       ) : (
//                         <>
//                           <td className="px-4 py-3 text-slate-400 text-xs font-mono">{idx + 1}</td>
//                           <td className="px-4 py-3">
//                             <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${shapeColors[item.Shape] || 'bg-slate-100 text-slate-600'}`}>
//                               {item.Shape}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-slate-600 font-mono text-xs">{item.Carat_From_Weight} ct</td>
//                           <td className="px-4 py-3 text-slate-600 font-mono text-xs">{item.Carat_T0_Weight} ct</td>
//                           <td className="px-4 py-3 font-bold text-slate-800">₹{item.Rate_Per_Carat}</td>
//                           <td className="px-4 py-3">
//                             <div className="flex gap-2">
//                               <button onClick={() => startEdit(idx, item)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><FiEdit2 /></button>
//                               <button onClick={() => deleteEntry(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><FiTrash2 /></button>
//                             </div>
//                           </td>
//                         </>
//                       )}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Mobile Card View */}
//           <div className="sm:hidden divide-y divide-slate-100">
//             {submittedList.length === 0 ? (
//               <div className="py-12 text-center">
//                 {/* <FiGem className="mx-auto w-8 h-8 text-slate-200 mb-2" /> */}
//                 <p className="text-slate-400 text-sm">No quotation lines added yet</p>
//               </div>
//             ) : (
//               submittedList.map((item, idx) => (
//                 <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
//                   <div className="flex justify-between items-start mb-2">
//                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${shapeColors[item.Shape] || 'bg-slate-100 text-slate-600'}`}>
//                       {item.Shape}
//                     </span>
//                     <div className="flex gap-2">
//                       <button onClick={() => startEdit(idx, item)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"><FiEdit2 /></button>
//                       <button onClick={() => deleteEntry(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 /></button>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-3 gap-2 text-sm">
//                     <div>
//                       <p className="text-xs text-slate-400">From</p>
//                       <p className="font-mono text-slate-700">{item.Carat_From_Weight} ct</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">To</p>
//                       <p className="font-mono text-slate-700">{item.Carat_T0_Weight} ct</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-400">Rate</p>
//                       <p className="font-bold text-slate-800">₹{item.Rate_Per_Carat}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiamondQuotationEntry;



import React, { useState, useContext, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus, FiSave, FiRefreshCw } from 'react-icons/fi';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
import axios from 'axios';
import { DIA_API } from '../../../config/configData';

const diamondShapes = ["PEAR", "PRINCESS", "MARQUISE", "ROUND", "MARQUICE", "BAGUETTE"];

const inputCls = (hasError) =>
  `w-full px-3 py-2 rounded-lg border text-sm bg-white transition-all duration-200 outline-none
   focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
   ${hasError ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`;

const STATUS_MAP = {
  P: { label: 'Pending',  cls: 'bg-amber-100  text-amber-700  border border-amber-200'  },
  A: { label: 'Accepted', cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  R: { label: 'Rejected', cls: 'bg-red-100    text-red-600    border border-red-200'    },
};

const shapeColors = {
  ROUND:    'bg-blue-100   text-blue-700',
  PEAR:     'bg-purple-100 text-purple-700',
  PRINCESS: 'bg-pink-100   text-pink-700',
  MARQUISE: 'bg-amber-100  text-amber-700',
  MARQUICE: 'bg-orange-100 text-orange-700',
  BAGUETTE: 'bg-teal-100   text-teal-700',
};

const DiamondQuotationEntry = () => {
  const { suppCode } = useContext(DashBoardContext);

  // ── Header & Form State ──────────────────────────────────────
  const [headerData, setHeaderData] = useState({
    QuotationDate: new Date().toISOString().split('T')[0],
    ValidityDate: '',
  });

  const initialFormState = {
    Shape: '',
    Carat_From_Weight: '',
    Carat_T0_Weight: '',
    Rate_Per_Carat: '',
  };

  const [formData, setFormData]           = useState(initialFormState);
  const [submittedList, setSubmittedList] = useState([]);
  const [editIndex, setEditIndex]         = useState(-1);
  const [editFormData, setEditFormData]   = useState({});
  const [errors, setErrors]               = useState({});
  const [isSaving, setIsSaving]           = useState(false);
  const [saveStatus, setSaveStatus]       = useState(null);

  // ── Saved Quotations List State ──────────────────────────────
  const [quotationList, setQuotationList]     = useState([]);
  const [loadingList, setLoadingList]         = useState(false);
  const [listError, setListError]             = useState(null);
  const [dbEditIndex, setDbEditIndex]         = useState(-1);
  const [dbEditFormData, setDbEditFormData]   = useState({});
  const [dbEditErrors, setDbEditErrors]       = useState({});
  const [dbSaving, setDbSaving]               = useState(false);

  // ── Fetch saved quotations ───────────────────────────────────
  const fetchQuotations = async () => {
    if (!suppCode) return;
    setLoadingList(true);
    setListError(null);
    try {
      const res = await axios.get(`${DIA_API}/diamond-quotation/${suppCode}`);
      setQuotationList(res.data.diamondQuotations || []);
    } catch (err) {
      setListError('Failed to load quotations.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, [suppCode]);

  // ── Validation ───────────────────────────────────────────────
  const validateData = (data, isHeaderIncluded = false, errorSetter = setErrors) => {
    const newErrors = {};
    if (isHeaderIncluded) {
      if (!headerData.QuotationDate) newErrors.QuotationDate = 'Required';
      if (
        headerData.ValidityDate &&
        new Date(headerData.ValidityDate) < new Date(headerData.QuotationDate)
      ) newErrors.ValidityDate = 'Must be after quotation date';
    }
    if (!data.Shape)                              newErrors.Shape = 'Required';
    const rate = parseFloat(data.Rate_Per_Carat);
    if (isNaN(rate) || rate <= 0)                 newErrors.Rate_Per_Carat = 'Must be > 0';
    const from = parseFloat(data.Carat_From_Weight);
    const to   = parseFloat(data.Carat_T0_Weight);
    if (isNaN(from) || from < 0)                  newErrors.Carat_From_Weight = 'Invalid';
    if (isNaN(to)   || to   < 0)                  newErrors.Carat_T0_Weight   = 'Invalid';
    if (!isNaN(from) && !isNaN(to) && from >= to)
      newErrors.weightRelation = '"From" weight must be less than "To" weight';
    errorSetter(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Add Entry (staging list) ─────────────────────────────────
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateData(formData, true)) return;
    const newEntry = {
      ...headerData,
      ...formData,
      SuppCode:          suppCode,
      Carat_From_Weight: parseFloat(formData.Carat_From_Weight).toFixed(3),
      Carat_T0_Weight:   parseFloat(formData.Carat_T0_Weight).toFixed(3),
      Rate_Per_Carat:    parseFloat(formData.Rate_Per_Carat).toFixed(3),
      Status: 'P',
    };
    setSubmittedList([newEntry, ...submittedList]);
    setFormData({ ...formData, Carat_From_Weight: '', Carat_T0_Weight: '', Rate_Per_Carat: '' });
    setErrors({});
    setSaveStatus(null);
  };

  // ── Inline Edit (staging list) ───────────────────────────────
  const startEdit   = (i, item) => { setEditIndex(i); setEditFormData({ ...item }); setErrors({}); };
  const cancelEdit  = ()        => { setEditIndex(-1); setEditFormData({}); setErrors({}); };
  const saveEdit    = (i)       => {
    if (!validateData(editFormData, false)) return;
    const list = [...submittedList];
    list[i] = {
      ...editFormData,
      Carat_From_Weight: parseFloat(editFormData.Carat_From_Weight).toFixed(3),
      Carat_T0_Weight:   parseFloat(editFormData.Carat_T0_Weight).toFixed(3),
      Rate_Per_Carat:    parseFloat(editFormData.Rate_Per_Carat).toFixed(3),
    };
    setSubmittedList(list);
    setEditIndex(-1);
    setErrors({});
  };
  const deleteEntry = (i) => setSubmittedList(submittedList.filter((_, idx) => idx !== i));

  // ── Save staging list to DB ──────────────────────────────────
  const handleSaveAll = async () => {
    if (!submittedList.length) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await axios.post(`${DIA_API}/diamond-quotation/save`, {
        SuppCode:      suppCode,
        QuotationDate: headerData.QuotationDate,
        ValidityDate:  headerData.ValidityDate,
        lines:         submittedList,
      });
      setSaveStatus('success');
      setSubmittedList([]);
      fetchQuotations(); // refresh saved list
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── DB Row Inline Edit (Pending only) ────────────────────────
  const startDbEdit  = (i, row) => { setDbEditIndex(i); setDbEditFormData({ ...row }); setDbEditErrors({}); };
  const cancelDbEdit = ()       => { setDbEditIndex(-1); setDbEditFormData({}); setDbEditErrors({}); };

  const saveDbEdit = async (i) => {
    if (!validateData(dbEditFormData, false, setDbEditErrors)) return;
    setDbSaving(true);
    try {
      await axios.post(`${DIA_API}/diamond-quotation/save`, {
        SuppCode:      suppCode,
        QuotationDate: dbEditFormData.QuotationDate,
        ValidityDate:  dbEditFormData.ValidityDate,
        lines: [{
          ...dbEditFormData,
          Carat_From_Weight: parseFloat(dbEditFormData.Carat_From_Weight).toFixed(3),
          Carat_T0_Weight:   parseFloat(dbEditFormData.Carat_T0_Weight).toFixed(3),
          Rate_Per_Carat:    parseFloat(dbEditFormData.Rate_Per_Carat).toFixed(3),
        }],
      });
      setDbEditIndex(-1);
      fetchQuotations();
    } catch {
      setDbEditErrors({ api: 'Failed to update. Try again.' });
    } finally {
      setDbSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto space-y-5">

        {/* PAGE TITLE */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg" />
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Diamond Quotation Master</h1>
            <p className="text-xs text-slate-500">
              Supplier: <span className="font-semibold text-indigo-600">{suppCode}</span>
            </p>
          </div>
        </div>

        {/* HEADER CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Quotation Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Quotation Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={headerData.QuotationDate}
                onChange={(e) => setHeaderData({ ...headerData, QuotationDate: e.target.value })}
                className={inputCls(errors.QuotationDate)}
              />
              {errors.QuotationDate && <p className="text-red-500 text-xs mt-1">{errors.QuotationDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Validity Date</label>
              <input
                type="date"
                value={headerData.ValidityDate}
                min={headerData.QuotationDate}
                onChange={(e) => setHeaderData({ ...headerData, ValidityDate: e.target.value })}
                className={inputCls(errors.ValidityDate)}
              />
              {errors.ValidityDate && <p className="text-red-500 text-xs mt-1">{errors.ValidityDate}</p>}
            </div>
          </div>
        </div>

        {/* ENTRY FORM CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-indigo-100 p-5">
          <h2 className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">Add Quotation Line</h2>
          {errors.weightRelation && (
            <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              <FiX className="shrink-0" /> {errors.weightRelation}
            </div>
          )}
          <form onSubmit={handleAddSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-[2fr_1fr_1fr_1.5fr_auto] gap-3 items-end">
              <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Shape <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.Shape}
                  onChange={(e) => setFormData({ ...formData, Shape: e.target.value })}
                  className={inputCls(errors.Shape)}
                >
                  <option value="">Select shape…</option>
                  {diamondShapes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.Shape && <p className="text-red-500 text-xs mt-1">{errors.Shape}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">From (ct)</label>
                <input
                  type="number" step="0.001" placeholder="0.000"
                  value={formData.Carat_From_Weight}
                  onChange={(e) => setFormData({ ...formData, Carat_From_Weight: e.target.value })}
                  className={inputCls(errors.Carat_From_Weight)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">To (ct)</label>
                <input
                  type="number" step="0.001" placeholder="0.000"
                  value={formData.Carat_T0_Weight}
                  onChange={(e) => setFormData({ ...formData, Carat_T0_Weight: e.target.value })}
                  className={inputCls(errors.Carat_T0_Weight)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Rate / Carat</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                  <input
                    type="number" step="0.001" placeholder="0.000"
                    value={formData.Rate_Per_Carat}
                    onChange={(e) => setFormData({ ...formData, Rate_Per_Carat: e.target.value })}
                    className={`${inputCls(errors.Rate_Per_Carat)} pl-7`}
                  />
                </div>
                {errors.Rate_Per_Carat && <p className="text-red-500 text-xs mt-1">{errors.Rate_Per_Carat}</p>}
              </div>
              <div className="col-span-2 sm:col-span-4 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full h-[38px] flex items-center justify-center gap-2 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-150 shadow-sm shadow-indigo-200"
                >
                  <FiPlus className="w-4 h-4" /> Add Line
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* STAGING TABLE CARD */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Quotation Lines</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full">
                {submittedList.length}
              </span>
            </div>
            {submittedList.length > 0 && (
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-sm shadow-emerald-200"
              >
                <FiSave className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save to Database'}
              </button>
            )}
          </div>

          {saveStatus === 'success' && (
            <div className="mx-5 mt-4 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
              <FiCheck /> All quotation lines saved successfully!
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="mx-5 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <FiX /> Failed to save. Please try again.
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['#', 'Shape', 'From Wt', 'To Wt', 'Rate / Ct', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {submittedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">No lines added yet</td>
                  </tr>
                ) : (
                  submittedList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      {editIndex === idx ? (
                        <>
                          <td className="px-4 py-2 text-slate-400 text-xs">{idx + 1}</td>
                          <td className="px-2 py-2">
                            <select
                              value={editFormData.Shape}
                              onChange={(e) => setEditFormData({ ...editFormData, Shape: e.target.value })}
                              className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                            >
                              {diamondShapes.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" step="0.001" value={editFormData.Carat_From_Weight}
                              onChange={(e) => setEditFormData({ ...editFormData, Carat_From_Weight: e.target.value })}
                              className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" step="0.001" value={editFormData.Carat_T0_Weight}
                              onChange={(e) => setEditFormData({ ...editFormData, Carat_T0_Weight: e.target.value })}
                              className={`w-24 px-2 py-1.5 border rounded-lg text-sm ${errors.weightRelation ? 'border-red-400' : 'border-slate-200'}`}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input type="number" step="0.001" value={editFormData.Rate_Per_Carat}
                              onChange={(e) => setEditFormData({ ...editFormData, Rate_Per_Carat: e.target.value })}
                              className="w-28 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(idx)} className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg"><FiCheck /></button>
                              <button onClick={cancelEdit} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg"><FiX /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-slate-400 text-xs font-mono">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${shapeColors[item.Shape] || 'bg-slate-100 text-slate-600'}`}>
                              {item.Shape}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600 font-mono text-xs">{item.Carat_From_Weight} ct</td>
                          <td className="px-4 py-3 text-slate-600 font-mono text-xs">{item.Carat_T0_Weight} ct</td>
                          <td className="px-4 py-3 font-bold text-slate-800">₹{item.Rate_Per_Carat}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(idx, item)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg"><FiEdit2 /></button>
                              <button onClick={() => deleteEntry(idx)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── SAVED QUOTATIONS TABLE ── */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between bg-slate-50/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Saved Quotations</span>
              <span className="px-2 py-0.5 text-xs font-bold bg-slate-200 text-slate-600 rounded-full">
                {quotationList.length}
              </span>
            </div>
            <button
              onClick={fetchQuotations}
              disabled={loadingList}
              className="flex items-center gap-2 px-4 py-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-xl transition-all"
            >
              <FiRefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {listError && (
            <div className="mx-5 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <FiX /> {listError}
            </div>
          )}

          {dbEditErrors.api && (
            <div className="mx-5 mt-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-2">
              <FiX /> {dbEditErrors.api}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['#', 'Quot. Date', 'Validity', 'Shape', 'From Wt', 'To Wt', 'Rate / Ct', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loadingList ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 text-sm">
                      <FiRefreshCw className="animate-spin mx-auto mb-2 w-5 h-5" />
                      Loading quotations…
                    </td>
                  </tr>
                ) : quotationList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-400 text-sm">
                      No saved quotations found for {suppCode}
                    </td>
                  </tr>
                ) : (
                  quotationList.map((row, idx) => {
                    const isPending = row.Status === 'P';
                    const isEditing = dbEditIndex === idx;
                    const status    = STATUS_MAP[row.Status] || STATUS_MAP['P'];

                    return (
                      <tr key={row.QuotationID ?? idx} className="hover:bg-slate-50/80 transition-colors">
                        {isEditing ? (
                          <>
                            <td className="px-4 py-2 text-slate-400 text-xs">{idx + 1}</td>
                            {/* Quotation Date */}
                            <td className="px-2 py-2">
                              <input
                                type="date"
                                value={dbEditFormData.QuotationDate?.split('T')[0] || ''}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, QuotationDate: e.target.value })}
                                className="w-36 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                              />
                            </td>
                            {/* Validity Date */}
                            <td className="px-2 py-2">
                              <input
                                type="date"
                                value={dbEditFormData.ValidityDate?.split('T')[0] || ''}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, ValidityDate: e.target.value })}
                                className="w-36 px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                              />
                            </td>
                            {/* Shape */}
                            <td className="px-2 py-2">
                              <select
                                value={dbEditFormData.Shape}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, Shape: e.target.value })}
                                className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-sm"
                              >
                                {diamondShapes.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            {/* From Wt */}
                            <td className="px-2 py-2">
                              <input type="number" step="0.001"
                                value={dbEditFormData.Carat_From_Weight}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, Carat_From_Weight: e.target.value })}
                                className={`w-24 px-2 py-1.5 border rounded-lg text-sm ${dbEditErrors.Carat_From_Weight ? 'border-red-400' : 'border-slate-200'}`}
                              />
                            </td>
                            {/* To Wt */}
                            <td className="px-2 py-2">
                              <input type="number" step="0.001"
                                value={dbEditFormData.Carat_T0_Weight}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, Carat_T0_Weight: e.target.value })}
                                className={`w-24 px-2 py-1.5 border rounded-lg text-sm ${dbEditErrors.weightRelation ? 'border-red-400' : 'border-slate-200'}`}
                              />
                            </td>
                            {/* Rate */}
                            <td className="px-2 py-2">
                              <input type="number" step="0.001"
                                value={dbEditFormData.Rate_Per_Carat}
                                onChange={(e) => setDbEditFormData({ ...dbEditFormData, Rate_Per_Carat: e.target.value })}
                                className={`w-28 px-2 py-1.5 border rounded-lg text-sm ${dbEditErrors.Rate_Per_Carat ? 'border-red-400' : 'border-slate-200'}`}
                              />
                            </td>
                            {/* Status (locked) */}
                            <td className="px-4 py-2">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_MAP['P'].cls}`}>
                                Pending
                              </span>
                            </td>
                            {/* Actions */}
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveDbEdit(idx)}
                                  disabled={dbSaving}
                                  className="p-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg disabled:opacity-50"
                                  title="Save"
                                >
                                  {dbSaving ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
                                </button>
                                <button onClick={cancelDbEdit} className="p-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg" title="Cancel">
                                  <FiX />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-slate-400 text-xs font-mono">{idx + 1}</td>
                            <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                              {row.QuotationDate ? new Date(row.QuotationDate).toLocaleDateString('en-IN') : '—'}
                            </td>
                            <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">
                              {row.ValidityDate ? new Date(row.ValidityDate).toLocaleDateString('en-IN') : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${shapeColors[row.Shape] || 'bg-slate-100 text-slate-600'}`}>
                                {row.Shape}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600 font-mono text-xs">{parseFloat(row.Carat_From_Weight).toFixed(3)} ct</td>
                            <td className="px-4 py-3 text-slate-600 font-mono text-xs">{parseFloat(row.Carat_T0_Weight).toFixed(3)} ct</td>
                            <td className="px-4 py-3 font-bold text-slate-800">₹{parseFloat(row.Rate_Per_Carat).toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.cls}`}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {isPending ? (
                                <button
                                  onClick={() => startDbEdit(idx, row)}
                                  className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <FiEdit2 />
                                </button>
                              ) : (
                                <span className="text-xs text-slate-300 px-2">—</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DiamondQuotationEntry;
