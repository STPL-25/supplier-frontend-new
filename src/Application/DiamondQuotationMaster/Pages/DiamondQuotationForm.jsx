import React, { useState, useContext,  } from 'react';
import { FiEdit2, FiCheck, FiX, FiTrash2, FiPlus } from 'react-icons/fi';
import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// Mocking your DashboardContext for demonstration
// In your actual app, import this from your context file

const diamondShapes = [
  'Round', 'Princess', 'Emerald', 'Asscher', 'Cushion', 
  'Marquise', 'Radiant', 'Oval', 'Pear', 'Heart'
];

const DiamondQuotationEntry = () => {
  // 1. Context & State
  const { suppCode } = useContext(DashBoardContext);
  
  // Shared header data (Dates)
  const [headerData, setHeaderData] = useState({
    QuotationDate: new Date().toISOString().split('T')[0],
    ValidityDate: '',
  });

  // Entry Form Data
  const initialFormState = {
    Shape: '',
    Carat_From_Weight: '',
    Carat_T0_Weight: '',
    Rate_Per_Carat: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  
  // Submitted Data Table State
  const [submittedList, setSubmittedList] = useState([]);
  
  // Inline Editing State
  const [editIndex, setEditIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});

  // 2. Validation Logic (Reusable for both Entry and Edit)
  const validateData = (data, isHeaderIncluded = false) => {
    const newErrors = {};

    if (isHeaderIncluded) {
      if (!headerData.QuotationDate) newErrors.QuotationDate = 'Required';
      if (headerData.ValidityDate && new Date(headerData.ValidityDate) < new Date(headerData.QuotationDate)) {
        newErrors.ValidityDate = 'Invalid Date';
      }
    }

    if (!data.Shape) newErrors.Shape = 'Required';
    
    const rate = parseFloat(data.Rate_Per_Carat);
    if (isNaN(rate) || rate <= 0) newErrors.Rate_Per_Carat = 'Invalid rate';

    const fromWeight = parseFloat(data.Carat_From_Weight);
    const toWeight = parseFloat(data.Carat_T0_Weight);

    if (isNaN(fromWeight) || fromWeight < 0) newErrors.Carat_From_Weight = 'Invalid';
    if (isNaN(toWeight) || toWeight < 0) newErrors.Carat_T0_Weight = 'Invalid';

    if (!isNaN(fromWeight) && !isNaN(toWeight) && fromWeight >= toWeight) {
      newErrors.weightRelation = '"From" must be < "To"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 3. Handlers for New Entry
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateData(formData, true)) {
      const newEntry = {
        ...headerData,
        ...formData,
        SuppCode: suppCode,
        Carat_From_Weight: parseFloat(formData.Carat_From_Weight).toFixed(3),
        Carat_T0_Weight: parseFloat(formData.Carat_T0_Weight).toFixed(3),
        Rate_Per_Carat: parseFloat(formData.Rate_Per_Carat).toFixed(3),
        Status: 'P', // Pending
      };
      
      setSubmittedList([newEntry, ...submittedList]);
      
      // Reset only weights and amounts for rapid consecutive entry, keep shape
      setFormData({ ...formData, Carat_From_Weight: '', Carat_T0_Weight: '', Rate_Per_Carat: '' });
      setErrors({});
    }
  };

  // 4. Handlers for Inline Editing
  const startEdit = (index, item) => {
    setEditIndex(index);
    setEditFormData({ ...item });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditIndex(-1);
    setEditFormData({});
    setErrors({});
  };

  const saveEdit = (index) => {
    if (validateData(editFormData, false)) {
      const updatedList = [...submittedList];
      updatedList[index] = {
        ...editFormData,
        Carat_From_Weight: parseFloat(editFormData.Carat_From_Weight).toFixed(3),
        Carat_T0_Weight: parseFloat(editFormData.Carat_T0_Weight).toFixed(3),
        Rate_Per_Carat: parseFloat(editFormData.Rate_Per_Carat).toFixed(3),
      };
      setSubmittedList(updatedList);
      setEditIndex(-1);
      setErrors({});
    }
  };

  const deleteEntry = (index) => {
    const updatedList = submittedList.filter((_, i) => i !== index);
    setSubmittedList(updatedList);
  };

  // 5. Render
  return (
    <div className="w-full max-w-6xl mx-auto mt-6 bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-200">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-6 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Diamond Quotation Master
          </h2>
          <p className="text-sm text-gray-500 mt-1">Supplier: <span className="font-semibold text-blue-600">{suppCode}</span></p>
        </div>
        
        <div className="flex gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Quotation Date *</label>
            <input
              type="date"
              value={headerData.QuotationDate}
              onChange={(e) => setHeaderData({ ...headerData, QuotationDate: e.target.value })}
              className={`p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.QuotationDate ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Validity Date</label>
            <input
              type="date"
              value={headerData.ValidityDate}
              onChange={(e) => setHeaderData({ ...headerData, ValidityDate: e.target.value })}
              min={headerData.QuotationDate}
              className={`p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.ValidityDate ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
        </div>
      </div>

      {/* --- DATA ENTRY FORM --- */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 mb-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-4 uppercase tracking-wider">Quick Add Entry</h3>
        
        {errors.weightRelation && (
          <div className="mb-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
            {errors.weightRelation}
          </div>
        )}

        <form onSubmit={handleAddSubmit} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Shape *</label>
            <select
              value={formData.Shape}
              onChange={(e) => setFormData({ ...formData, Shape: e.target.value })}
              className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Shape ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Shape...</option>
              {diamondShapes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="w-32">
            <label className="block text-xs font-medium text-gray-700 mb-1">From (ct) *</label>
            <input
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData.Carat_From_Weight}
              onChange={(e) => setFormData({ ...formData, Carat_From_Weight: e.target.value })}
              className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Carat_From_Weight ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div className="w-32">
            <label className="block text-xs font-medium text-gray-700 mb-1">To (ct) *</label>
            <input
              type="number"
              step="0.001"
              placeholder="0.000"
              value={formData.Carat_T0_Weight}
              onChange={(e) => setFormData({ ...formData, Carat_T0_Weight: e.target.value })}
              className={`w-full p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Carat_T0_Weight ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>

          <div className="w-40">
            <label className="block text-xs font-medium text-gray-700 mb-1">Amount/Carat *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
              <input
                type="number"
                step="0.001"
                placeholder="0.000"
                value={formData.Rate_Per_Carat}
                onChange={(e) => setFormData({ ...formData, Rate_Per_Carat: e.target.value })}
                className={`w-full pl-7 p-2.5 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors.Rate_Per_Carat ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-[42px] px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition-colors flex items-center gap-2"
          >
            <FiPlus /> Add
          </button>
        </form>
      </div>

      {/* --- SUBMITTED DATA TABLE --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">Quotation Lines ({submittedList.length})</h3>
          {submittedList.length > 0 && (
            <button className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors">
              Save All to Database
            </button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-3 font-medium border-b">Shape</th>
                <th className="p-3 font-medium border-b">From Wt</th>
                <th className="p-3 font-medium border-b">To Wt</th>
                <th className="p-3 font-medium border-b">Rate / Ct</th>
                <th className="p-3 font-medium border-b text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {submittedList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No diamond quotations added yet.
                  </td>
                </tr>
              ) : (
                submittedList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {/* EDIT MODE */}
                    {editIndex === idx ? (
                      <>
                        <td className="p-2">
                          <select
                            value={editFormData.Shape}
                            onChange={(e) => setEditFormData({ ...editFormData, Shape: e.target.value })}
                            className="w-full p-1.5 border border-gray-300 rounded text-sm"
                          >
                            {diamondShapes.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <input
                            type="number" step="0.001"
                            value={editFormData.Carat_From_Weight}
                            onChange={(e) => setEditFormData({ ...editFormData, Carat_From_Weight: e.target.value })}
                            className="w-full p-1.5 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number" step="0.001"
                            value={editFormData.Carat_T0_Weight}
                            onChange={(e) => setEditFormData({ ...editFormData, Carat_T0_Weight: e.target.value })}
                            className={`w-full p-1.5 border rounded text-sm ${errors.weightRelation ? 'border-red-500' : 'border-gray-300'}`}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number" step="0.001"
                            value={editFormData.Rate_Per_Carat}
                            onChange={(e) => setEditFormData({ ...editFormData, Rate_Per_Carat: e.target.value })}
                            className="w-full p-1.5 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => saveEdit(idx)} className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Save">
                              <FiCheck />
                            </button>
                            <button onClick={cancelEdit} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel">
                              <FiX />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      /* READ MODE */
                      <>
                        <td className="p-3 text-gray-800 font-medium">{item.Shape}</td>
                        <td className="p-3 text-gray-600">{item.Carat_From_Weight} ct</td>
                        <td className="p-3 text-gray-600">{item.Carat_T0_Weight} ct</td>
                        <td className="p-3 text-gray-800 font-semibold">${item.Rate_Per_Carat}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => startEdit(idx, item)} 
                              className="text-blue-500 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => deleteEntry(idx)} 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
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
    </div>
  );
};

export default DiamondQuotationEntry;
