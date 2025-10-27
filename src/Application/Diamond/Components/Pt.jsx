import TextField from "@mui/material/TextField";
import { useContext } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; 
function Pt() {
  const { inputFields,  handleInputChange,handleSubmit,errors,validateFields} = useContext(DiamondContext);
  const handleChange = (e) => {
    handleInputChange(e); 
    console.log(e)
    
    const objectString = JSON.stringify(inputFields);
    console.log(objectString);
      };

    
  return (
    <div>
      <div>
        <div className="table-container-pt ml-3 mb-6">
        <form onSubmit={handleSubmit}>
        <h3><b>PLATINUM</b></h3>

            <table>
              <thead>
                <tr className="header-cell">    
                  <th>PT Gross Wt</th>
                  <th>PT Purity</th>
                  <th>PT Purity Wt</th>
                  <th>PT 999 Rate</th>
                  <th>PT Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="PTWt"
                      value={inputFields.PTWt}
                      sx={{ width: "80px",height:"70px",paddingTop:"20px"  }}
                      onChange={handleChange}
                      variant="standard"
                      error={Boolean(errors.PTWt)} // This will highlight the border in red

                      helperText={errors.PTWt || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop: "2px",  // Adjust margin above the helper text
                          color: "red",      // Set the color (optional)
                        },
                      }}       
                    />
                  </td>
                  {/*  */}
                  <td>
                    <TextField
                      id="standard-basic"
                      name="PTPurity"
                      value={inputFields.PTPurity}
                      sx={{ width: "100px",paddingTop:"20px",height:"70px" }}
                      onChange={handleChange}
                      variant="standard"
                      error={Boolean(errors.PTPurity)} // This will highlight the border in red

                      helperText={errors.PTPurity || ""}
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
                      name="PTPurityWt"
                      value={inputFields.PTPurityWt}
                      disabled
                      sx={{ width: "110px","& input": {
                        fontWeight: "bold",
                      }, }}
                      onChange={handleChange}
                      variant="standard"
                      error={Boolean(errors.PTPurityWt)} // This will highlight the border in red

                      helperText={errors.PTPurityWt || ""}
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
                      name="PT999Rate"
                      value={inputFields.PT999Rate}
                      sx={{ width: "115px", paddingTop:"20px", height:"70px" }}
                      onChange={handleChange}
                      variant="standard"
                      error={Boolean(errors.PT999Rate)} // This will highlight the border in red

                      helperText={errors.PT999Rate || ""}
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
                      name="PTValue"
                      value={inputFields.PTValue}
                      disabled
                      sx={{ width: "140px","& input": {
                        fontWeight: "bold",
                      } }}
                      onChange={handleChange}
                      variant="standard"
                      error={Boolean(errors.PTValue)} // This will highlight the border in red

                      helperText={errors.PTValue || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop: "2px",  // Adjust margin above the helper text
                          color: "red",      // Set the color (optional)
                        },
                      }}       
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

export default Pt;
