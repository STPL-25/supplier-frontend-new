import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
function   PtMc() {
  const { inputFields,  handleInputChange ,setInputFields,handleSubmit,errors,validateFields} = useContext(DiamondContext);
  const handleChange = (e,v) => {
    setInputFields(preFields=>({...preFields,PTMcType:v}))
    validateFields("PTMcType",v)
      };
  return (
    <div>
      <div>
        <div className="table-container-ptmc my-2 ml-3">
        <form onSubmit={handleSubmit}>
        <h3 style={{left:"35%"}}><b>PLATINUM MAKING CHARGE</b></h3>

            <table>
              <thead>
                <tr className="header-cell">
                  <th>PT Mc Type</th>
                  <th>PT Mc Rate</th>
                  <th>PT Mc Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                  <div style={{ position: 'relative' }}>

                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="PTMcType"
                      value={inputFields.PTMcType}
                      // onSelect={()=>setDiamondData(true)}
                      options={["Gram", "Pcs", ]}
                      sx={{ width: 300, border: "none" ,paddingTop:"10px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                      }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }}
                        error={Boolean(errors.PTMcType)} // This will highlight the border in red
                          helperText={errors.PTMcType && ""}
                         />
                      )}
                      style={{
                        // display: "inline-block",
                        width: "150px",
                        height:"70px",
                        border: "none",
                      }}
                      onChange={handleChange}
                    />
                    {errors.PTMcType && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "53px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.PTMcType}
                      </span>
                    )}
                    </div>
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      value={inputFields.PTMcRate}
                      name="PTMcRate"
                      sx={{ width: "65px",height:"50px" ,paddingTop:"10px"}}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.PTMcRate)} // This will highlight the border in red

                      helperText={errors.PTMcRate || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop: "2px",  // Adjust margin above the helper text
                          color: "red",      // Set the color (optional)
                        },
                      }}         
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="PTMcAmount"
                      value={inputFields.PTMcAmount}
                      sx={{ width: "140px" }}
                      onChange={handleInputChange}
                      variant="standard"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PtMc;
