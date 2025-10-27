import { useContext, useEffect, useState } from "react";
import { TextField, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext';
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import {DIA_API} from "../../../config/configData"
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import Tooltip from '@mui/material/Tooltip';
import 'react-toastify/dist/ReactToastify.css';

function DT() {
    const { diamondTypeData, setDiamondTypeData, diamondData, setDiamondData, totalDiamondData, setTotalDiamondData, handleSubmit, setLoopErr, inputFields, user, updateInputFields, calculations, validateFields, errors, setErrors } = useContext(DiamondContext);
    const {setActiveSection}=useContext(DashBoardContext)
    const [diaShapes, setDiaShapes] = useState([])
    //     useEffect(() => {
    //     const response =axios.get(`${DIA_API}/diamondRate_masterData/${diamondTypeData.carat}/${diamondTypeData.diamondShape}`)
    //     }, [diamondTypeData,diamondTypeData]);
    // // console.log(diamondData)
    const redirect1 = "/images/redirect.png"

    useEffect(() => {
        const fetchShapes = async () => {
            const response = await axios.get(`${DIA_API}/diashape/${user}`)
            console.log(response)
            setDiaShapes(response.data)
        }
        fetchShapes()
    }, [user])
    const handleAddDiamond = () => {

        setTotalDiamondData(prevData => [
            ...prevData,
            {
                diamondShape: null,
                numberOfStones: 0,
                carat: 0,
                diaRate: 0,
                diaValue: 0,
                diaWt: 0,
            }
        ]);
    };

    const handleChange = async (event, index, value, field) => {
        event.preventDefault();
        const numericFields = [ "carat", "diaRate", "diaValue", "diaWt"];
        const integerFields=["numberOfStones"]
        const numericPattern = /^\d*\.?\d{0,3}$/;
        const integerPattern = /^\d*$/; 
        // Validate input for numeric fields
        if (numericFields.includes(field) && !numericPattern.test(value)) {
            return; // Exit if the input is not valid
        }
    if(integerFields.includes(field)&&!integerPattern.test(value)){
        return;
    }
        // Create a copy of the current state
        let newData = [...totalDiamondData];
        // Update the specific field
        newData[index] = {
            ...newData[index],
            [field]: value === "0" ? "" : value,
        };

        // Set initial state changes for UI updates
        setTotalDiamondData(newData);
        validateFields(field, value, index); // Pass index here
        if (field === "diamondShape" || field === "numberOfStones" || field === "carat") {
            // Skip if value is empty or invalid (helps with initial user input)
            if (!value || value == "0") {
                return;
            }

            try {
                // Extract the necessary fields from the updated data
                const { carat, diamondShape, numberOfStones } = newData[index];

                // Perform the asynchronous operation (DIA_API call) to get the diamond rate
                const response = await axios.get(
                    `${DIA_API}/diamondRate_masterData/${inputFields.SupplierName}/${(carat / numberOfStones) || 0}/${diamondShape}`
                );

                // Assuming response contains the necessary rate data
                const diaRate = response.data[0]?.rate || 0;
                if (diaRate === 0) {
                    // If diaRate is 0, set an error
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [`diaRate_${index}`]: "Dia rate not found",
                    }));
                } else {
                    // If diaRate is valid, clear any existing error
                    setErrors((prevErrors) => {
                        const updatedErrors = { ...prevErrors };
                        delete updatedErrors[`diaRate_${index}`];
                        return updatedErrors;
                    });
                }
                // Update the rate, value, and weight based on the DIA_API response
                newData[index].diaRate = diaRate;
                newData[index].diaValue = isNaN(carat * diaRate) ? 0 : carat * diaRate;
                newData[index].diaWt = (carat * 0.2).toFixed(3);
                updateInputFields
            } catch (error) {
                // Handle error (set carat to 0 when the rate/value is not found)
                newData[index].diaRate = 0;
                newData[index].diaValue = 0;
                newData[index].diaWt = 0;
                const diaRate = newData[index].diaRate;
                if (diaRate === 0) {
                    // If diaRate is 0, set an error
                    console.log(errors)
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [`diaRate_${index}`]: "Dia rate not found",
                    }));
                }

                // newData[index].carat = 0;
            }

            // Update the state with the new data after DIA_API call
            setTotalDiamondData(newData);
        }
    };

    const handleDelete = (index) => {
        console.log(index, totalDiamondData)
        setTotalDiamondData(prevData => prevData.filter((_, i) => i !== index));
    };
const handleNavigateToMasterPage=()=>{
    setActiveSection('Rate Master')
}
    return (
        <div className="add-diamond ml-5" style={{ marginRight: "30px" }}>
            {diamondData ? (

                <form onSubmit={handleSubmit}>
                    <Button className="add-diamond-button" variant="contained" style={{ marginLeft: "60px" }} onClick={handleAddDiamond}>Add Diamond</Button>
                    {totalDiamondData.length > 0 ?
                        <table className="add-diamond-table" style={{ width: "100%" }}>
                            <thead>
                                <tr className="header-cell">
                                    <th style={{ width: "180px" }}>Diamond Shape</th>
                                    <th style={{ width: "180px" }}>No of stones</th>
                                    <th style={{ width: "180px" }}>Carat</th>
                                    <th style={{ width: "180px" }}>Dia Rate</th>
                                    <th style={{ width: "180px" }}>Dia Value</th>
                                    <th style={{ width: "180px" }}>Dia Wt</th>
                                    {/* <th style={{ width: "200px" }}>Add</th> */}
                                    <th style={{ width: "180px" }}>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {totalDiamondData.map((diamond, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                onChange={(e, v) => handleChange(e, index, v, 'diamondShape')}
                                                options={diaShapes}
                                                value={diamond.diamondShape}
                                                sx={{
                                                    width: 300, border: "none", height: "70px", paddingTop: "10px",
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '40px', // Set height of the input field
                                                        '& input': {
                                                            padding: '10px', // Adjust padding for the input
                                                        },
                                                    },
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} error={!!errors[`diamondShape_${index}`]} helperText={errors[`diamondShape_${index}`]} />
                                                )}
                                                style={{
                                                    display: "inline-block",
                                                    width: "200px",
                                                    border: "none",
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-basic"
                                                value={diamond.numberOfStones}
                                                sx={{
                                                    width: "120px", height: "70px", paddingTop: "10px",
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '40px', // Set height of the input field
                                                        '& input': {
                                                            padding: '10px', // Adjust padding for the input
                                                        },
                                                    },
                                                }}
                                                variant="outlined"
                                                onChange={(e) => handleChange(e, index, e.target.value, 'numberOfStones')}
                                                error={!!errors[`numberOfStones_${index}`]}
                                                helperText={errors[`numberOfStones_${index}`]}
                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-basic"
                                                value={diamond.carat}
                                                sx={{
                                                    width: "120px", height: "70px", paddingTop: "10px",
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '40px', // Set height of the input field
                                                        '& input': {
                                                            padding: '10px', // Adjust padding for the input
                                                        },
                                                    },
                                                }}
                                                variant="outlined"
                                                onChange={(e) => handleChange(e, index, e.target.value, 'carat')}
                                                error={!!errors[`carat_${index}`]}
                                                helperText={errors[`carat_${index}`]}
                                            />
                                        </td>
                                        <td>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                // Optional: Add spacing between elements
                                                gap={1}
                                            >
                                                <TextField
                                                    id="outlined-basic"
                                                    value={diamond.diaRate ? diamond.diaRate : 0}
                                                    variant="outlined"
                                                    onChange={(e) => handleChange(e, index, e.target.value, 'diaRate')}
                                                    error={!!errors[`diaRate_${index}`]}
                                                    helperText={errors[`diaRate_${index}`]}
                                                    // MUI Box handles width, but you can still customize
                                                    sx={{
                                                        width: "120px",
                                                        height: "70px", paddingTop: "10px",
                                                        // Remove height from TextField to let content dictate height
                                                        // Adjust padding inside the input
                                                        '& .MuiOutlinedInput-root': {
                                                            height: '40px', // Set height of the input field
                                                            '& input': {
                                                                padding: '10px', // Adjust padding for the input
                                                            },
                                                        },
                                                    }}
                                                />
                                                {errors[`diaRate_${index}`]?
                                                <Tooltip title="View masters">
                                                <img
                                                    src={redirect1}
                                                    alt="redirect"
                                                    style={{
                                                        cursor: 'pointer', // Optional: Change cursor to pointer if it's clickable
                                                        width: '24px', // Set desired width
                                                        height: '24px', // Set desired height
                                                        // Optional: Add margin or other styles as needed
                                                    }}
                                                    onClick={handleNavigateToMasterPage }                             
                                                   
                                                /></Tooltip>:null}
                                            </Box>
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-basic"
                                                value={diamond.diaValue.toFixed(3)}
                                                sx={{
                                                    width: "120px", height: "70px", paddingTop: "10px",
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '40px', // Set height of the input field
                                                        '& input': {
                                                            padding: '10px', // Adjust padding for the input
                                                        },
                                                    },
                                                }}
                                                variant="outlined"
                                                onChange={(e) => handleChange(e, index, e.target.value, 'diaValue')}

                                            />
                                        </td>
                                        <td>
                                            <TextField
                                                id="outlined-basic"
                                                value={diamond.diaWt}
                                                sx={{
                                                    width: "120px", height: "70px", paddingTop: "10px",
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '40px', // Set height of the input field
                                                        '& input': {
                                                            padding: '10px', // Adjust padding for the input
                                                        },
                                                    },
                                                }}
                                                variant="outlined"
                                                onChange={(e) => handleChange(e, index, e.target.value, 'diaWt')}
                                            />
                                        </td>
                                        {/* <td>
                                        <Button variant="contained" style={{ backgroundColor: "#ef4444", color: "white" }} onClick={handleAddDiamond}>
                                            Add
                                        </Button>
                                    </td> */}
                                        <td>
                                            <Button variant="contained" style={{ backgroundColor: "#ef4444", color: "white" }} onClick={() => handleDelete(index)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : null}
                </form>
            ) : (null)}
        </div>
    );
}

// DT.propTypes = {
//     selectedOption: PropTypes.array.isRequired,
//     selectedValue: PropTypes.string.isRequired
// };

export default DT;