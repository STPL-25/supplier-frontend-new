import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DIA_API } from '../../../config/configData';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { ToastContainer, toast } from 'react-toastify';
import '../../../Pages/Toast.css';
function MasterApproval() {
    const [fetchDatas, setFetchDatas] = useState([]);
    const [supplierNames, setSupplierNames] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [openAccordion, setOpenAccordion] = useState(null);

    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [currentRejectId, setCurrentRejectId] = useState(null);
   const eyeIcon= '/images/eyeicon.png'
    useEffect(() => {
        fetchData();
    }, [selectedSupplier]);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const response = await axios.put(`${DIA_API}/suppliername/masterapproval`);
                setSupplierNames(response.data);
            } catch (error) {
                console.error("Error fetching supplier names:", error);
                toast.error("Failed to fetch supplier names.");
            }
        };
        fetchMasterData();
    }, []);

    const toggleAccordion = (index) => {
        setOpenAccordion((prev) => (prev === index ? null : index));
    };

    const fetchData = async () => {
        try {
            const response = await axios.put(`${DIA_API}/fetchmasterapprovaldata`, { selectedSupplier });
            setFetchDatas(response.data);
        } catch (error) {
            console.error("Error fetching master approval data:", error);
            toast.error("Failed to fetch approval data.");
        }
    };

    const handleAccept = async (id) => {
        try {
            const response = await axios.put(`${DIA_API}/action/${id}/accept`);
            console.log(response.data);
            toast.success("Supplier accepted successfully.");
            fetchData();
        } catch (error) {
            console.error("Error performing accept action:", error);
            toast.error("Failed to accept supplier.");
        }
    };

    const handleRejectOpen = (id) => {
        setCurrentRejectId(id);
        setRejectReason('');
        setRejectDialogOpen(true);
    };

    const handleRejectClose = () => {
        setRejectDialogOpen(false);
        setRejectReason('');
        setCurrentRejectId(null);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            toast.warning("Please provide a reason for rejection.");
            return;
        }
        try {
            const response = await axios.put(`${DIA_API}/action/${currentRejectId}/reject`, { reason: rejectReason });
            console.log(response.data);
            toast.success("Supplier rejected successfully.");
            handleRejectClose();
            fetchData();
        } catch (error) {
            console.error("Error performing reject action:", error);
            toast.error("Failed to reject supplier.");
        }
    };

    const handleSupplierChange = (event, newValue) => {
        setSelectedSupplier(event.target.value);
    };


    return (
        <div className="p-4 mt-5">

            {/* Supplier Name Autocomplete */}
            <ToastContainer/>
            {/* <Autocomplete
                disablePortal
                id="filter-autocomplete"
                value={selectedSupplier}
                onChange={handleSupplierChange}
                options={supplierNames}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} label="Search By Supplier Name" />}
                style={{ margin: "auto", marginTop: "20px", marginBottom: "20px" }}
            /> */}
 <div className="w-64 mb-6">
          <select 
            className="w-full p-2 border rounded"
            onChange={handleSupplierChange}
            value={selectedSupplier || ''}
          >
            <option value="">Select Supplier</option>
            {supplierNames.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>
            {fetchDatas.length > 0 && (
                <>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <div className="overflow-x-auto">
                            <table className="w-[1100px]  bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="py-2 px-4 border-b">Supplier Name</th>
                                        <th className="py-2 px-4 border-b">Shape</th>
                                        <th className="py-2 px-4 border-b">Range From</th>
                                        <th className="py-2 px-4 border-b">Range To</th>
                                        <th className="py-2 px-4 border-b">Rate</th>
                                        <th className="py-2 px-4 border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetchDatas.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <tr className="border-b">
                                                <td className="py-4 px-4 flex items-center">
                                                    {item.SupName}
                                                    {Array.isArray(item.EditedDatas) && item.EditedDatas.length > 0 && item.Status!=="A"&& (
                                                        <img
                                                            src={eyeIcon}
                                                            onClick={() => toggleAccordion(index)}
                                                            alt='View Edited Data'
                                                            className="ml-2 cursor-pointer w-4 h-4"
                                                        />
                                                    )}
                                                </td>
                                                <td className="py-2 px-4">{item.shape}</td>
                                                <td className="py-2 px-4">{item.rangeFrom}</td>
                                                <td className="py-2 px-4">{item.rangeTo}</td>
                                                <td className="py-2 px-4">{item.rate}</td>
                                                {item.Status==="P"&&
                                                <td className="py-2 px-4">
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => handleAccept(item.id)}
                                                        sx={{ marginRight: '8px' }}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() => handleRejectOpen(item.id)}
                                                    >
                                                        Reject
                                                    </Button>
                                                </td>}
                                                {item.Status==="A"&&  
                                                <td className="py-2 px-4">
                                                    <strong>Accepted</strong>
                                                  
                                                </td>
                                                }
                                                
                                            </tr>
                                            {/* Accordion Row */}
                                            {openAccordion === index && Array.isArray(item.EditedDatas) && item.EditedDatas.length > 0 && (
                                                <tr>
                                                    <td colSpan="6" className="py-2 px-4 bg-gray-50">
                                                        <div className="">
                                                            <table className="min-w-full bg-white border border-gray-200">
                                                                <thead>
                                                                    <tr className="bg-gray-200 text-left">
                                                                        <th className="py-2 px-4 border-b">Shape</th>
                                                                        <th className="py-2 px-4 border-b">Range From</th>
                                                                        <th className="py-2 px-4 border-b">Range To</th>
                                                                        <th className="py-2 px-4 border-b">Rate</th>
                                                                        <th className="py-2 px-4 border-b">Edited Date</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.EditedDatas.map((editedItem, edIndex) => (
                                                                        <tr key={edIndex} className="border-b">
                                                                            <td className="py-2 px-4">{editedItem.changes.shape}</td>
                                                                            <td className="py-2 px-4">{editedItem.changes.rangeFrom}</td>
                                                                            <td className="py-2 px-4">{editedItem.changes.rangeTo}</td>
                                                                            <td className="py-2 px-4">{editedItem.changes.value}</td>
                                                                            <td className="py-2 px-4">{editedItem.editedOn}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                        {fetchDatas.map((item, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold">Supplier Name:</span>
                                    {Array.isArray(item.EditedDatas) && item.EditedDatas.length > 0 && (
                                        <img
                                            src={eyeIcon}
                                            onClick={() => toggleAccordion(index)}
                                            alt='View Edited Data'
                                            className="cursor-pointer w-4 h-4"
                                        />
                                    )}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Shape:</span> {item.shape}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Range From:</span> {item.rangeFrom}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Range To:</span> {item.rangeTo}
                                </div>
                                <div className="mb-2">
                                    <span className="font-bold">Rate:</span> {item.rate}
                                </div>
                                {/* Accordion for EditedDatas */}
                                {openAccordion === index && Array.isArray(item.EditedDatas) && item.EditedDatas.length > 0 && (
                                    <div className="mt-4 border-t pt-2">
                                        <span className="font-bold">Edited Details:</span>
                                        {item.EditedDatas.map((editedItem, edIndex) => (
                                            <div key={edIndex} className="mt-2 pl-4">
                                                <div>
                                                    <span className="font-semibold">Shape:</span> {editedItem.changes.shape}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Range From:</span> {editedItem.changes.rangeFrom}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Range To:</span> {editedItem.changes.rangeTo}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Rate:</span> {editedItem.changes.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* Action Buttons */}
                                {item.Status==="P"&&
                                <div className="mt-4">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleAccept(item.id)}
                                        sx={{ marginRight: '8px' }}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRejectOpen(item.id)}
                                    >
                                        Reject
                                    </Button>
                                </div>}
                                {item.Status==="A"&&
                                 <div className="mt-4">
                                <strong>Accepted</strong>
                             </div>}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Reject Reason Dialog */}
            <Dialog open={rejectDialogOpen} onClose={handleRejectClose}>
                <DialogTitle>Reason for Rejection</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reject-reason"
                        label="Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleRejectSubmit} color="error" variant="contained">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>


        </div>
    );
}

export default MasterApproval;
