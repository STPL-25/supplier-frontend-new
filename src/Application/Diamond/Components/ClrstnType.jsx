import { useContext,useEffect, useState, } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; 
import PropTypes from 'prop-types';
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { API } from "../../../config/configData";
// { selectedOption,selectedValue, }
function ClrstnType() { 
  const { clrstnTypeData, setclrstnTypeData ,clrStn,setclrStn,totalClrstnData, setTotalClrstnData,validateFields,
    errors} = useContext(DiamondContext);
  const [colorStoneOptions,setColorStoneOptions]=useState([])
    useEffect(()=>{
        const fetchColorStoneOptions=async()=>{
            try {
                const response= await axios.get(`${API}/dia/findAll_colorstone_options`)
                setColorStoneOptions(response.data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchColorStoneOptions()
    },[])


  const handleAddClrstn = () => {
    setTotalClrstnData(prevData => [
        ...prevData,
        {
            csType: null,
            csPcs: 0,
            csCarat: 0,
            csRate: 0,
            csAmt: 0,
            csWt: 0,
        }
    ]);
  };


// // console.log(totalClrstnData)
const handleChange = (index, value, field) => {
    console.log(index, value, field);
    
    const numericFields = ["csPcs", "csCarat", "csRate", "csWt"];
    
    // Different patterns for different field types
    const decimalPattern = /^\d*\.?\d{0,3}$/;  // Modified to allow empty value and partial decimals
    const integerPattern = /^\d*$/;            // Modified to allow empty value
    
    // Allow empty values
    if (value === "" || value === null) {
        setTotalClrstnData(prevState => {
            const newData = [...prevState];
            newData[index] = {...newData[index]};
            newData[index][field] = "";
            
            // Reset dependent calculations
            if (field === "csCarat" || field === "csRate") {
                newData[index].csAmt = 0;
                newData[index].csWt = "0.000";
            }
            
            return newData;
        });
        return;
    }
    
    // Validate input based on field type
    if (numericFields.includes(field)) {
        let isValid = false;
        
        if (field === "csPcs") {
            // For csPcs: only allow integers
            isValid = integerPattern.test(value);
        } else {
            // For other numeric fields: allow up to 3 decimal places
            isValid = decimalPattern.test(value);
        }
        
        if (!isValid) {
            return; // Exit if the input is not valid
        }
    }
    
    validateFields(field, value, index);
    
    setTotalClrstnData(prevState => {
        const newData = [...prevState];
        newData[index] = {...newData[index]};
        
        if (field === "csType" || field === "csPcs" || field === "csCarat" || field === "csRate") {
            newData[index][field] = value;
        }
        
        const { csCarat } = newData[index];
        
        // Calculate amounts only if both values are present
        if (csCarat && newData[index].csRate) {
            newData[index].csAmt = parseFloat(csCarat) * parseFloat(newData[index].csRate);
            newData[index].csWt = (parseFloat(csCarat) * 0.2).toFixed(3);
        } else {
            newData[index].csAmt = 0;
            newData[index].csWt = "0.000";
        }
        
        return newData;
    });
};
  const handleDelete = (index) => {
    setTotalClrstnData(prevData => prevData.filter((_, i) => i !== index));
  };
  
  
  return (
    <div className="add-clrstn ml-3" style={{ marginLeft: "35px" }}>
    {clrStn ? (
        <>
        
            <form>
            <Button className="add-clrstn-button" style={{marginLeft:"60px"}} variant="contained" onClick={handleAddClrstn}>Add Color Stones</Button>
{totalClrstnData.length>0?
                <table className="add-clrstn-table" style={{width:"100%"}}>
                    <thead>
                        <tr className="header-cell">
                            <th style={{ width: "180px" }}>Cs Type</th>
                            <th style={{ width: "180px" }}>Cs Pcs</th>
                            <th style={{ width: "180px" }}>Cs carat</th>
                            <th style={{ width: "180px" }}>Cs Rate</th>
                            <th style={{ width: "180px" }}>Cs Amt</th>
                            <th style={{ width: "180px" }}>Cs wt</th>
                            <th style={{ width: "180px" }}>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {totalClrstnData.map((clrStn, index) => (
                            <tr key={index}>
                                <td>
                                <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            onChange={(e, v) => handleChange(index, v, 'csType')}
                                            // options={["Blue Shappire", "Coral ", "Emerald ", "FancyStone ", "Hesonite ", "Nv Bangle", "Nv Bracelet", "Nv Necklace ", "Nv Pendant ", "Nv Ring ", "Nv Set ", "Nv Stud ","Pearls","Ruby","Tanzanite","YellowShappire","Others"]}
                                            options={colorStoneOptions}
                                            value={clrStn.csType}
                                            sx={{ width: 300, border: "none", height: "70px", paddingTop: "10px",
                                                '& .MuiOutlinedInput-root': {
                                            height: '40px', // Set height of the input field
                                            '& input': {
                                            padding: '10px', // Adjust padding for the input
                                            },
                                            },
                                             }}
                                            renderInput={(params) => (
                                                <TextField {...params} style={{ border: "none" }} error={!!errors[`csType_${index}`]} helperText={errors[`csType_${index}`]} />
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
                                        value={clrStn.csPcs}
                                        sx={{ width: "120px", height: "70px", paddingTop: "10px",
                                        '& .MuiOutlinedInput-root': {
                                        height: '40px', // Set height of the input field
                                        '& input': {
                                        padding: '10px', // Adjust padding for the input
                                        },
                                        },
                                         }}
                                        variant="outlined"
                                        onChange={(e) => handleChange(index, e.target.value, 'csPcs')}
                                        error={!!errors[`csPcs_${index}`]}
                                            helperText={errors[`csPcs_${index}`]}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="outlined-basic"
                                        value={clrStn.csCarat}
                                        sx={{ width: "120px", height: "70px", paddingTop: "10px",
                                            '& .MuiOutlinedInput-root': {
                                        height: '40px', // Set height of the input field
                                        '& input': {
                                        padding: '10px', // Adjust padding for the input
                                        },
                                        },
                                         }}
                                        variant="outlined"
                                        onChange={(e) => handleChange(index, e.target.value, 'csCarat')}
                                        error={!!errors[`csCarat_${index}`]}
                                            helperText={errors[`csCarat_${index}`]}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="outlined-basic"
                                        value={clrStn.csRate}
                                        sx={{ width: "120px", height: "70px", paddingTop: "10px",
                                            '& .MuiOutlinedInput-root': {
                                        height: '40px', // Set height of the input field
                                        '& input': {
                                        padding: '10px', // Adjust padding for the input
                                        },
                                        },
                                         }}
                                        variant="outlined"
                                        onChange={(e) => handleChange(index, e.target.value, 'csRate')}
                                        error={!!errors[`csRate_${index}`]}
                                            helperText={errors[`csRate_${index}`]}
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="outlined-basic"
                                        value={clrStn.csAmt}
                                        sx={{ width: "120px", height: "70px", paddingTop: "10px",
                                            '& .MuiOutlinedInput-root': {
                                        height: '40px', // Set height of the input field
                                        '& input': {
                                        padding: '10px', // Adjust padding for the input
                                        },
                                        },
                                         }}
                                        variant="outlined"
                                        onChange={(e) => handleChange(index, e.target.value, 'csAmt')}
                                       
                                    />
                                </td>
                                <td>
                                    <TextField
                                        id="outlined-basic"
                                        value={clrStn.csWt}
                                        sx={{ width: "120px", height: "70px", paddingTop: "10px",
                                            '& .MuiOutlinedInput-root': {
                                        height: '40px', // Set height of the input field
                                        '& input': {
                                        padding: '10px', // Adjust padding for the input
                                        },
                                        },
                                         }}
                                        variant="outlined"
                                        onChange={(e) => handleChange(index, e.target.value, 'csWt')}
                                       
                                    />
                                </td>
                                <td>
                                    <Button variant="contained" style={{ backgroundColor: "#ef4444", color: "white" }} onClick={() => handleDelete(index)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>:null}
            </form>
        </>
    ):(null)}
</div>


  );
}
// ClrstnType.propTypes = {
//   // option: PropTypes.string.isRequired ,
//   // Dindex: PropTypes.number.isRequired ,
//   selectedOption: PropTypes.array.isRequired,
// };
export default ClrstnType;



   