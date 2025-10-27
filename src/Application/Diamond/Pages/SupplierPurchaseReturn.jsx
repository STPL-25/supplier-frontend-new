import React, { useEffect, useState, useContext } from "react";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import axios from "axios";
import { DIA_API } from "../../../config/configData";
import * as XLSX from "xlsx";
import PDFExportButton from "./ExportToPdf";
import { FileSpreadsheet, FileText, X, Upload } from "lucide-react";

// Diamond Table Component
const DiamondTable = ({ diamonds }) => {
  if (!diamonds?.length)
    return <span className="text-gray-500">No diamond data</span>;

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
              <td className="p-1 border text-left">{diamond.Shape}</td>
              <td className="p-1 border text-right">{diamond.NoOfStones}</td>
              <td className="p-1 border text-right">
                {Number(diamond.Carat).toFixed(2)}
              </td>
              <td className="p-1 border text-right">
                {Number(diamond.Rate).toLocaleString()}
              </td>
              <td className="p-1 border text-right">
                {Number(diamond.Value).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ColorStone Table Component
const ColorStoneTable = ({ colorStones }) => {
  if (!colorStones?.length)
    return <span className="text-gray-500">No colorstone data</span>;

  return (
    <div className="min-w-[500px] mr-10 mb-10 mt-10">
      <table className="w-full text-sm border-collapse table-fixed">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-1 border text-left w-1/5">Type</th>
            <th className="p-1 border text-right w-1/5">Pcs</th>
            <th className="p-1 border text-right w-1/5">Carat</th>
            <th className="p-1 border text-right w-1/5">Rate</th>
            <th className="p-1 border text-right w-1/5">Amount</th>
          </tr>
        </thead>
        <tbody>
          {colorStones.map((stone, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-1 border text-left">{stone.Type}</td>
              <td className="p-1 border text-right">{stone.Pcs}</td>
              <td className="p-1 border text-right">
                {Number(stone.csCarat).toFixed(2)}
              </td>
              <td className="p-1 border text-right">
                {Number(stone.csRate).toLocaleString()}
              </td>
              <td className="p-1 border text-right">
                {Number(stone.Amount).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Return Dialog Component
const ReturnAcceptDialog = ({ isOpen, onClose, onSubmit, rowData }) => {
  const [remarks, setRemarks] = useState("");
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("remarks", remarks);
      images.forEach((image, index) => {
        formData.append("images", image);
      });
      formData.append(
        "rowData",
        JSON.stringify(Array.isArray(rowData) ? rowData : [rowData])
      );

      await onSubmit(formData, images, remarks);
      setRemarks("");
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error submitting return:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setImages([]);
      setRemarks("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Return Entry{" "}
            {Array.isArray(rowData) ? `(${rowData.length} items)` : ""}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks for the return"
            className="w-full p-2 border rounded-md"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 100KB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
            </label>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  disabled={isSubmitting}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 disabled:bg-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!remarks.trim() || images.length === 0 || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? "Submitting..." : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
};
const RejectDialog = ({ isOpen, onClose, onSubmit, rowData }) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const rows = Array.from(rowData);
      await onSubmit({
        rejectReason,
        rowDatas:rows
      });
      setRejectReason("");
    } catch (error) {
      console.error("Error submitting rejection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Reject Entry{" "}
            {Array.isArray(rowData) ? `(${rowData.length} items)` : ""}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reject Reason
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter reason for rejection"
            className="w-full p-2 border rounded-md"
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rejectReason.trim() || isSubmitting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
          >
            {isSubmitting ? "Submitting..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};
// Main PurchaseReturn Component
const SupplierPurchaseReturn = () => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [data, setData] = useState([]);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const { userRole, user } = useContext(DashBoardContext);
  const [selectedInvoice,setSelectedInvoice]=useState('')
  const [invoices,setInvoices]=useState([])
  const columns = [
    { id: "sno", label: "S.No", type: "number" },
    { id: "SupplierName", label: "Supplier Name", type: "text" },
    { id: "invoiceNumber", label: "Invoice Number", type: "text" },
    { id: "ProductName", label: "Product Name", type: "text" },
    { id: "MetalType", label: "Metal Type", type: "text" },
    { id: "WtMode", label: "Weight Mode", type: "text" },
    { id: "DesignNo", label: "Design No", type: "text" },
    { id: "GCarat", label: "Gold Carat", type: "number" },
    { id: "PCS", label: "PCS", type: "number" },
    { id: "GoldWt", label: "Gold Weight", type: "number" },
    { id: "GoldPurity", label: "Gold Purity", type: "text" },
    { id: "GoldPurityWt", label: "Gold Purity Weight", type: "number" },
    { id: "Gold999Rate", label: "Gold 999 Rate", type: "text" },
    { id: "GoldValue", label: "Gold Value", type: "number" },
    { id: "PTWt", label: "Platinum Weight", type: "number" },
    { id: "PTPurity", label: "Platinum Purity", type: "text" },
    { id: "PTPurityWt", label: "Platinum Purity Weight", type: "number" },
    { id: "PT999Rate", label: "Platinum 999 Rate", type: "number" },
    { id: "PTValue", label: "Platinum Value", type: "number" },
    {
      id: "DiamondDatas",
      label: "Diamond Data",
      type: "component",
      render: (value, row) => <DiamondTable diamonds={row.Diamonds} />,
    },
    { id: "NoofStone", label: "Number of Stones", type: "number" },
    { id: "DCarat", label: "Diamond Carat", type: "number" },
    { id: "DiamondWt", label: "Diamond Weight", type: "number" },
    { id: "DiamondRate", label: "Diamond Rate", type: "number" },
    { id: "DiamondValue", label: "Diamond Value", type: "number" },
    {
      id: "ColorStoneDatas",
      label: "Color Stone Data",
      type: "component",
      render: (value, row) => <ColorStoneTable colorStones={row.ColorStones} />,
    },
    { id: "ClrStnPCS", label: "Color Stone PCS", type: "number" },
    { id: "CLSCarat", label: "Color Stone Carat", type: "number" },
    { id: "ClrStnWt", label: "Color Stone Weight", type: "number" },
    { id: "ClrStnRate", label: "Color Stone Rate", type: "number" },
    { id: "CSAmount", label: "Color Stone Amount", type: "number" },
    { id: "GoMcType", label: "Gold Making Charge Type", type: "text" },
    { id: "GoMcRate", label: "Gold Making Charge Rate", type: "number" },
    { id: "GoMcAmount", label: "Gold Making Charge Amount", type: "number" },
    { id: "PTMcType", label: "Platinum Making Charge Type", type: "text" },
    { id: "PTMcRate", label: "Platinum Making Charge Rate", type: "number" },
    {
      id: "PTMcAmount",
      label: "Platinum Making Charge Amount",
      type: "number",
    },
    { id: "WastageType", label: "Wastage Type", type: "text" },
    { id: "WastageWeight", label: "Wastage Weight", type: "number" },
    { id: "WastageAmt", label: "Wastage Amount", type: "number" },
    { id: "CertType", label: "Certificate Type", type: "text" },
    { id: "CertGST", label: "Certificate GST", type: "number" },
    { id: "CertQty", label: "Certificate Quantity", type: "number" },
    { id: "CertRate", label: "Certificate Rate", type: "number" },
    {
      id: "CertTaxableAmt",
      label: "Certificate Taxable Amount",
      type: "number",
    },
    { id: "CertTotal", label: "Certificate Total", type: "number" },
    { id: "HallMarkType", label: "Hallmark Type", type: "text" },
    { id: "HMGST", label: "Hallmark GST", type: "number" },
    { id: "HMQty", label: "Hallmark Quantity", type: "number" },
    { id: "HMRate", label: "Hallmark Rate", type: "number" },
    { id: "HMTaxableAmt", label: "Hallmark Taxable Amount", type: "number" },
    { id: "HMTotal", label: "Hallmark Total", type: "number" },
    { id: "HandleRate", label: "Handle Rate", type: "number" },
    { id: "HandleAmount", label: "Handle Amount", type: "number" },
    { id: "GNetWt", label: "Gold Net Weight", type: "number" },
    { id: "PNetWt", label: "Platinum Net Weight", type: "number" },
    { id: "TotalValue", label: "Total Value", type: "number" },
    { id: "GST", label: "GST", type: "number" },
    { id: "GrandTotal", label: "Grand Total", type: "number" },
    { id: "HUID", label: "HUID", type: "text" },
  ];

  const formatNumber = (value, columnId) => {
    const threeDecimalColumns = [
      "GoldWt",
      "WastageWeight",
      "GNetWt",
      "PTWt",
      "PNetWt",
      "DCarat",
      "DiamondWt",
      "CLSCarat",
      "ClrStnWt",
    ];

    const integerColumns = ["PCS", "NoofStone", "ClrStnPCS"];

    if (threeDecimalColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }

    if (integerColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }

    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(data.map((row, index) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleBulkReturn = (action) => {
    console.log(selectedRows);
    const selectedData = Array.from(selectedRows).map((row) => row);
    setSelectedRow(selectedData);
    if (action === "Accept") setShowReturnDialog(true);
    if (action === "Reject") setIsRejectDialogOpen(true);
  };

  // Calculate totals
  const totals = data.reduce((acc, row) => {
    columns.forEach((col) => {
      if (col.type === "number" && col.id !== "sno") {
        acc[col.id] = (acc[col.id] || 0) + (Number(row[col.id]) || 0);
      }
    });
    return acc;
  }, {});

  useEffect(() => {
   
    fetchData();
  }, [user,selectedInvoice]);
  const fetchData = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `${DIA_API}/supplier/purchase_return/SupplierDetails/${user}/${btoa(selectedInvoice)??""}`
      );
      console.log(response);
      setData(response.data);
      // Clear selected rows when data changes
      setSelectedRows(new Set());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
   
    fetchInvoices();
  }, []);
  const fetchInvoices = async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `${DIA_API}/supplier/purchase_return/invoices/${user}`
      );
      console.log("+++++++++++++++++++++++++++++++",response.data);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Handle return submission
  const handleReturn = async (formData, images, remarks) => {
    console.log(images, remarks);
    try {
     const response= await axios.post(
        `${DIA_API}/supplier/return_purchase/accept_items`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status===200)fetchData()

      // Refresh data after successful return
      if (selectedSupplier) {
        const response = await axios.get(
          `${DIA_API}/purchase_return/SupplierDetails/${selectedSupplier}`
        );
        setData(response.data);
      }
      
  
      setShowReturnDialog(false);
      setSelectedRow(null);
      setSelectedRows(new Set()); // Clear selections after successful return
    } catch (error) {
      console.error("Error processing return:", error);
    }
  };
  const handleReject = async (reason,rowData) => {
    console.log("rowDatarowData",reason,rowData);
    try {
      const response=await axios.post(
        `${DIA_API}/supplier/return_purchase/reject_items`,
        {reason,rowData},
       
      );
      if (response.status===200)fetchData()

      // Refresh data after successful return
      if (selectedSupplier) {
        const response = await axios.get(
          `${DIA_API}/purchase_return/SupplierDetails/${selectedSupplier}`
        );
        setData(response.data);
      }
      
      // setShowReturnDialog(false);
      setIsRejectDialogOpen(false)
      setSelectedRow(null);
      setSelectedRows(new Set()); // Clear selections after successful return
    } catch (error) {
      console.error("Error processing return:", error);
    }
  };
  // Export to Excel
  const handleExport = async () => {
    try {
      const response = await axios.put(`${DIA_API}/excel`, data, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "PurchaseReturn.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
      <div className="w-64">
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedInvoice(e.target.value)}
              value={selectedInvoice || ""}
            >
              <option value="">Select Invoice Number</option>
              {invoices.map((inv) => (
                <option key={inv} value={inv}>
                  {inv}
                </option>
              ))}
            </select>
          </div>
        <div className="flex gap-3">
         
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FileSpreadsheet size={20} />
            Export to Excel
          </button>
          <PDFExportButton data={data} />
          {selectedRows.size > 0 && (
            <>
              <button
                onClick={() => handleBulkReturn("Accept")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept Return ({selectedRows.size})
              </button>
              <button
                onClick={() => handleBulkReturn("Reject")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reject Return ({selectedRows.size})
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Table */}
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedRows.size === data.length && data.length > 0
                    }
                    className="cursor-pointer"
                  />
                </th>
                {columns.map((column) => (
                  <th key={column.id} className="border p-2 text-left">
                    {column.label}
                  </th>
                ))}
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={`border ${column.render ? "p-0" : "p-2"}`}
                    >
                      {column.render
                        ? column.render(row[column.id], row)
                        : column.type === "number" && column.id !== "sno"
                        ? formatNumber(row[column.id], column.id)
                        : column.id === "sno"
                        ? index + 1
                        : row[column.id]}
                    </td>
                  ))}
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setSelectedRow(row);
                        setShowReturnDialog(true);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-bold">
                <td className="border p-2"></td>
                {columns.map((column) => (
                  <td key={column.id} className="border p-2">
                    {column.type === "number" && column.id !== "sno"
                      ? formatNumber(totals[column.id], column.id)
                      : column.id === "sno"
                      ? "Totals"
                      : ""}
                  </td>
                ))}
                <td className="border p-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-100 rounded">
          No data available
        </div>
      )}

      {/* Return Dialog */}
      <ReturnAcceptDialog
        isOpen={showReturnDialog}
        onClose={() => {
          setShowReturnDialog(false);
          setSelectedRow(null);
        }}
        onSubmit={handleReturn}
        rowData={selectedRow}
      />
      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onSubmit={handleReject}
        rowData={selectedRows}
      />
    </div>
  );
};

export default SupplierPurchaseReturn;
