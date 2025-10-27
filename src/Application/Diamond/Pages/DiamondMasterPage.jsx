import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState,useRef  } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {DIA_API} from '../../../config/configData';
import Button from '@mui/material/Button';
// import { DiamondContext } from '../DiamondGridContext/DiamondGridContext';
import {DashBoardContext} from "../../../DashBoardContext/DashBoardContext"
import { ToastContainer, toast } from 'react-toastify';
import '../../../Pages/Toast.css';
function DiamondMasterPage() {
    const { user } = useContext(DashBoardContext);
    const firstInputRef = useRef(null);
    const [diamondMasterFields, setDiamondMasterFields] = useState({
        supName: user,
        shape: '',
        rangeFrom: '',
        rangeTo: '',
        rate: '',
        id: '',
        action: null
    });
    const [error, setError] = useState("");
    const [fileData, setFileData] = useState([]);
    const [pendingLists, setPendingLists] = useState([]);
    const [approvedLists, setApprovedLists] = useState([]);
    const [rejectedList, setRejectedList] = useState([]);

    useEffect(() => {
        if (diamondMasterFields.action === "edit" && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [diamondMasterFields.action]);

    useEffect(() => {
        fetchMasters();
    }, []);

    const fetchMasters = async () => {
        try {
            const response = await axios.get(`${DIA_API}/gettingmasterdata/${localStorage.getItem("SupName") || diamondMasterFields.supName}`);
            const fetchDatas = response.data;
            setPendingLists(fetchDatas.filter(list => list.Status === "P"));
            setApprovedLists(fetchDatas.filter(list => list.Status === "A"));
            setRejectedList(fetchDatas.filter(list => list.Status === "R"));
            setFileData(fetchDatas);
        } catch (error) {
            console.error("Error fetching master data:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target; // Destructure name and value from the event target
    
        // Regular expressions for field validation
        const validations = {
            shape: /^[A-Za-z]+$/,
            rangeFrom: /^\d*\.?\d*$/, // Allows numbers and decimals
            rangeTo: /^\d*\.?\d*$/,   // Allows numbers and decimals
            rate: /^\d*\.?\d*$/       // Allows numbers and decimals
        };
    
        // Check if the input value matches the corresponding validation regex
        if (!validations[name] || validations[name].test(value)) {
            // Update the state for the input field
            setDiamondMasterFields((prevState) => {
                const updatedFields = { ...prevState, [name]: value };
    
                // Additional check for rangeFrom and rangeTo
                // if (name === "rangeFrom" || name === "rangeTo") {
                //     const rangeFrom = parseFloat(updatedFields.rangeFrom) || 0;
                //     const rangeTo = parseFloat(updatedFields.rangeTo) || 0;
    
                //     if (rangeFrom > rangeTo) {
                //         toast.error("Range From should not be greater than Range To");
                //     }
                // }
    
                return updatedFields;
            });
    
            setError(""); // Clear error state if validation passes
        } else {
            // Show error toast if input is invalid
            toast.error(`Invalid input for ${name}`);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { rangeFrom, rangeTo, supName } = diamondMasterFields;
    
            // Validate range inputs
            if (rangeFrom > rangeTo) {
                toast.error("Range From should not be greater than Range To");
            }
    
            else{
            // Save supplier name in localStorage
            localStorage.setItem("SupName", supName);
    
            // Submit data to API
            const response = await axios.post(`${DIA_API}/ratepost`, diamondMasterFields);
    
            if (response.status === 201) {
                fetchMasters(); // Refresh master data
                clearFields(); // Clear form fields
                toast.success("Data added successfully!");
            }
        }
        } catch (error) {
            console.error("Error submitting data:", error);
    
            // Provide better error message handling
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        }
    };
    const clearFields = () => {
        setDiamondMasterFields({
            supName: user,
            shape: '',
            rangeFrom: '',
            rangeTo: '',
            rate: '',
            id: '',
            action: null
        });
        setError("");
    };

    const handleEdit = (item) => {
        setDiamondMasterFields({
            supName: item.SupName,
            shape: item.shape,
            rangeFrom: item.rangeFrom,
            rangeTo: item.rangeTo,
            rate: item.rate,
            id: item.id,
            action: "edit"
        });
        if (firstInputRef.current) {
            firstInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInputRef.current.focus();
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        try {
            if(confirmed){
            await axios.put(`${DIA_API}/deletemastersrow/${id}`);
            fetchMasters();
            toast.info("Item deleted successfully!");
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error("Error deleting item!");
        }
    };

    return (
        <div className='md:overflow-x-scroll'>
            <div className="table-container-one">
            <ToastContainer/>
                <form onSubmit={handleSubmit}>
                <h3 style={{left:"28%"}}><b>SUPPLIER</b></h3>

                    <table className='relative'  style={{ width: '1000px' }}>
                        <thead>
                            <tr className="header-cell" style={{ height: '50px' }}>
                                <th>Supplier Name</th>
                                <th>Diamond Shape</th>
                                {/* <th>Carat</th> */}
                                <th>Range From</th>
                                <th>Range To</th>
                                <th>Rate</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <TextField
                                        name="supName"
                                        value={diamondMasterFields.supName}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        InputProps={{ readOnly: true }}                                      
                                          sx={{ width: '200px', height: '70px', paddingTop: '20px' }}
                                        inputRef={firstInputRef} // Assign the ref here
                                        
                                    />
                                </td>
                                <td>
                                    <TextField
                                        name="shape"
                                        value={diamondMasterFields.shape}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        sx={{ width: '150px', height: '70px', paddingTop: '20px' }}
                                        required
                                    />
                                </td>
                               
                                <td>
                                    <TextField
                                        name="rangeFrom"
                                        value={diamondMasterFields.rangeFrom}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        sx={{ width: '150px', height: '70px', paddingTop: '20px' }}
                                        required
                                    />
                                </td>
                                <td>
                                    <TextField
                                        name="rangeTo"
                                        value={diamondMasterFields.rangeTo}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        sx={{ width: '150px', height: '70px', paddingTop: '20px' }}
                                        required
                                    />
                                </td>
                                <td>
                                    <TextField
                                        name="rate"
                                        value={diamondMasterFields.rate}
                                        onChange={handleInputChange}
                                        variant="standard"
                                        sx={{ width: '55px' }}
                                    />
                                </td>
                                <td>
                                <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className='pc-button'
                          
                        >
                            ADD
                        </Button>
                        {error ? ( 
    <div className="acceptance-message flex items-center justify-center">
        <div className="bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
            <span className="font-medium">{error}</span>
        </div>
    </div>
):null}
                                </td>


                            </tr>
                        </tbody>
                    </table>
                    {/* <div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className='pc-button md:top-[-225px]'
                            sx={{
                                float:"right",
                                marginRight:"250px",
                                marginTop:"40px",
                                padding: '10px 20px',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                                fontWeight: 'bold',
                                textTransform: 'none',
                                position:"inline-block",
                                bottom:"150px"
                            }}
                        >
                            ADD
                        </Button>
                        {error && ( 
    <div className="acceptance-message flex items-center justify-center" style={{ marginTop: '10px' }}>
        <div className="bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
            <span className="font-medium">{error}</span>
        </div>
    </div>
)}
                    
                    
                    </div> */}

                    {pendingLists.length>0?
                <div className="table-container-two">

                <div className="table-container-two mt-[60px] ml-5">
                <h3 style={{left:"28%"}}><b>PENDING LISTS</b></h3>

                    <table style={{ width: '1000px'}}>
                        <thead>
                            <tr>
                                <th>Diamond Shape</th>
                                <th>Range From</th>
                                <th>Range To</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingLists.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.SupName}</td> */}
                                    <td>{item.shape}</td>
                                    <td>{item.rangeFrom}</td>
                                    <td>{item.rangeTo}</td>
                                    <td>{item.rate}</td>
                                    <td>Pending</td>

                                 
                                    <td style={{ display: "flex", justifyContent: "center"}}>
                                        <Button
                                         className="edit"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(item)}
                                            sx={{ marginRight: '8px' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="delete"

                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                      
                                  

                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div></div>:null}
                {approvedLists.length>0?(
                    <>
                                  
                <div className="table-container-two mt-2 ml-5">
                <h3 style={{left:"28%"}}><b>APPROVED LISTS</b></h3>

                    <table style={{ width: '1000px'}}>
                        <thead>
                            <tr>
                                <th>Shape</th>
                                <th>Range From</th>
                                <th>Range To</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th >Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedLists.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.SupName}</td> */}
                                    <td>{item.shape}</td>
                                    <td>{item.rangeFrom}</td>
                                    <td>{item.rangeTo}</td>
                                    <td>{item.rate}</td>
                                    <td>Accepted</td>

                                 
                                    <td style={{ display: "flex", justifyContent: "center"}}>
                                        <Button
                                         className="edit"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleEdit(item)}
                                            sx={{ marginRight: '8px' }}
                                        >
                                            Edit
                                        </Button>
                                      
                                    </td>
                                      
                                  

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>  </>):null}
                {console.log(rejectedList>0)}
                {rejectedList.length>0? 
                    <>
                                  
                <div className="table-container-two mt-2 ml-5">
                <h3 style={{left:"28%"}}><b>REJECTED LISTS</b></h3>

                    <table style={{ width: '1000px'}}>
                        <thead>
                            <tr>
                                <th>Shape</th>
                                <th>Range From</th>
                                <th>Range To</th>
                                <th>Rate</th>
                                <th >Status</th>
                                <th>Reason</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {rejectedList.map((item, index) => (
                                <tr key={index}>
                                    {/* <td>{item.SupName}</td> */}
                                    <td>{item.shape}</td>
                                    <td>{item.rangeFrom}</td>
                                    <td>{item.rangeTo}</td>
                                    <td>{item.rate}</td>
                                    <td>Rejected</td>
                                    <td>{item.RejectReason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>  </>:null}
                    
                </form>
              
            </div>
        </div>
    );
}

export default DiamondMasterPage;
