
import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext';
import PropTypes from 'prop-types';
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import API from "./config";

function DT() {
    const { diamondTypeData, setDiamondTypeData, diamondData, setDiamondData, totalDiamondData, setTotalDiamondData,handleSubmit,setLoopErr,inputFields } = useContext(DiamondContext);
const [diaRate,setDiaRate]=useState(null)
//     useEffect(() => {
//     const response =axios.get(`${API}/diamondRate_masterData/${diamondTypeData.carat}/${diamondTypeData.diamondShape}`)
//     }, [diamondTypeData,diamondTypeData]);
// // console.log(diamondData)
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

    const handleChange = async (index, value, field) => {
        if (value) {
            setLoopErr(true);
        }
    
        // Create a copy of the current state
        let newData = [...totalDiamondData];
        newData[index] = {
            ...newData[index],
        };
    
        // Conditionally update the specified field based on its value
        if (field === "diamondShape" || field === "numberOfStones" || field === "carat" ) {
            newData[index][field] = value === "0" ? "" : value;
            setDiamondData(true);
        }
    
        // Extract the necessary fields from the updated data
        const { carat, diamondShape,numberOfStones } = newData[index];
    console.log(carat/numberOfStones)
        // Perform the asynchronous operation (API call) to get the diamond rate
        try {
            const response = await axios.get(`${API}/diamondRate_masterData/${inputFields.RefNo}/${carat/numberOfStones}/${diamondShape}`);
            console.log(response);
    
            // Assuming response contains the necessary rate data
          console.log(response.data[0])
            const diaRate = response.data[0]?.DPCCNTRTE; // Adjust based on actual response structure
    
            // Calculate diaValue and diaWt based on the updated diaRate
            newData[index].diaRate = diaRate;
            newData[index].diaValue = carat * diaRate;
            newData[index].diaWt = (carat * 0.2).toFixed(3);
            
        } catch (error) {
            console.error("Error fetching diamond rate:", error);
            // Handle error (e.g., set an error state, display a message, etc.)
        }
    
        // Update the state with the new data
        setTotalDiamondData(newData);
        console.log(newData);
    };
    

    const handleDelete = (index) => {
        setTotalDiamondData(prevData => prevData.filter((_, i) => i !== index));
    };

    return (
        <div>
            {diamondData ? (
                
                <form onSubmit={handleSubmit}>
                <Button variant="contained" onClick={handleAddDiamond}>Add Diamond</Button>
                    <table>
                        <thead>
                            <tr className="header-cell">
                                <th style={{ width: "200px" }}>Diamond Shape</th>
                                <th style={{ width: "200px" }}>No of stones</th>
                                <th style={{ width: "200px" }}>Carat</th>
                                <th style={{ width: "200px" }}>Dia Rate</th>
                                <th style={{ width: "200px" }}>Dia Value</th>
                                <th style={{ width: "200px" }}>Dia Wt</th>
                                {/* <th style={{ width: "200px" }}>Add</th> */}
                                <th style={{ width: "200px" }}>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalDiamondData.map((diamond, index) => (
                                <tr key={index}>
                                    <td>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            onChange={(e, v) => handleChange(index, v, 'diamondShape')}
                                            options={["PRINCESS", "BAGUETTE ", "PEAR", "MARQUISE ", "ROUND ","Others" ]}
                                            value={diamond.diamondShape}
                                            sx={{ width: 300, border: "none", height: "70px", paddingTop: "10px" }}
                                            renderInput={(params) => (
                                                <TextField {...params} style={{ border: "none" }} />
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
                                            sx={{ width: "120px" }}
                                            variant="outlined"
                                            onChange={(e) => handleChange(index, e.target.value, 'numberOfStones')}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-basic"
                                            value={diamond.carat}
                                            sx={{ width: "120px" }}
                                            variant="outlined"
                                            onChange={(e) => handleChange(index, e.target.value, 'carat')}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-basic"
                                            value={diamond.diaRate}
                                            sx={{ width: "120px" }}
                                            variant="outlined"
                                            onChange={(e) => handleChange(index, e.target.value, 'diaRate')}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-basic"
                                            value={diamond.diaValue.toFixed(3)}
                                            sx={{ width: "120px" }}
                                            variant="outlined"
                                            onChange={(e) => handleChange(index, e.target.value, 'diaValue')}
                                        />
                                    </td>
                                    <td>
                                        <TextField
                                            id="outlined-basic"
                                            value={diamond.diaWt}
                                            sx={{ width: "120px" }}
                                            variant="outlined"
                                            onChange={(e) => handleChange(index, e.target.value, 'diaWt')}
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
                    </table>
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
