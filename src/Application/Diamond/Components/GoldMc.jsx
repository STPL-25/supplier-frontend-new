import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
function GoldMc() {
  const { inputFields,  handleInputChange,setInputFields,handleSubmit,validateFields,errors } = useContext(DiamondContext);
  const handleChange = (e, v) => {
    setInputFields(prevFields => ({ ...prevFields, GoMcType: v }));
    validateFields("GoMcType",v)
  };
  
  return (
    <div>
      <div>
        <div className="table-container-goldmc mb-6">
        <form onSubmit={handleSubmit}>
        <h3 style={{left:"40%"}}><b>GOLD MAKING CHARGE</b></h3>

            <table>
              <thead>
                <tr className="header-cell">
                  <th>Go Mc Type</th>
                  <th>Go Mc Rate</th>
                  <th>Go Mc Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{ position: 'relative' }}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="GoMcType" 
                      value={inputFields.GoMcType}
                      options={["Gram", "Pcs", ]}
                      sx={{ width: 300, border: "none",height:"70px",paddingTop:"12px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                       }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }}
                        error={Boolean(errors.GoMcType)} // This will highlight the border in red
                          helperText={errors.GoMcType && ""}
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
                      {errors.GoMcType && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "52px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.GoMcType}
                      </span>
                    )}
                    </div>
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="GoMcRate"
                      value={inputFields.GoMcRate}
                      
                      sx={{ width: "65px",height:"50px",paddingTop:"10px" }}
                      variant="standard"
                      onChange={handleInputChange}
                      error={Boolean(errors.GoMcRate)} // This will highlight the border in red

                      helperText={errors.GoMcRate || ""}
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
                      name="GoMcAmount"
                      value={inputFields.GoMcAmount}
                      sx={{ width: "140px"}}
                      variant="standard"
                      onChange={handleInputChange}
                     
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

export default GoldMc;
