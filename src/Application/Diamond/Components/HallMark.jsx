import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext"; // Import your context
import Autocomplete from "@mui/material/Autocomplete";

function HallMark() {
  const { inputFields, handleInputChange,setInputFields,handleSubmit,validateFields,errors } = useContext(DiamondContext);
  const handleChange = (e, value, fieldName) => {
    e.preventDefault();
    setInputFields(prevInputFields => ({
      ...prevInputFields,
      [fieldName]: value
    }));
    validateFields(fieldName,value)
  };
  
  return (
    <div>
      <div>
        <div className="table-container-hallmark mb-10">
        <form onSubmit={handleSubmit}>
        <h3><b>HALLMARK</b></h3>

            <table>
              <thead>
                <tr className="header-cell">
                  
                  <th>HallMark Type</th>
                  <th>HM GST</th>
                  <th>HM Qty</th>
                  <th>HM Rate</th>
                  <th>HM Taxable Amt</th>
                  <th>HM Total</th>
                  <th>HUID</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  <td>
                  <div style={{ position: 'relative' }}>

                     <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="HallMarkType"
                      value={inputFields.HallMarkType}
                      options={["Pcs"]}
                      sx={{ width: 300,height: "70px", border: "none",paddingTop:"12px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                       }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(errors.HallMarkType)} // This will highlight the border in red
                          helperText={errors.HallMarkType && ""}
                          style={{
                            border: "none",
                            width: "150px",
                          }}
                        />
                      )}
                      style={{
                        // display: "inline-block",
                        width: "150px",
                        border: "none",
                      }}
                      onChange={(e, value) => handleChange(e, value, "HallMarkType")}
                      
                      />
                      {errors.HallMarkType && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "53px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.HallMarkType}
                      </span>
                    )}
                      </div>
                  </td>
                  <td>
                  <div style={{ position: 'relative' }}>
                     <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="HMGST"
                      value={inputFields.HMGST}
                      options={["3", "18"]}
                      sx={{ width: 300, border: "none",paddingTop:"12px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                       }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} 
                        error={Boolean(errors.HMGST)} // This will highlight the border in red
                        helperText={errors.HMGST && ""}
                        />
                      )}
                      style={{
                        // display: "inline-block",
                        width: "150px",
                        height:"70px",
                        border: "none",
                      }}
                      onChange={(e, value) => handleChange(e, value, "HMGST")}
                      />
                       {errors.HMGST && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "53px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.HMGST}
                      </span>
                    )}
                       </div>
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="HMQty"
                      value={inputFields.HMQty}
                      sx={{ width: "100px" ,height: "70px",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.HMQty)} // This will highlight the border in red

                      helperText={errors.HMQty || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop:"2px",
                          marginBottom:"1px",
                          color: "red",      // Set the color (optional)
                        },
                      }}           
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="HMRate"
                      value={inputFields.HMRate}
                      sx={{ width: "100px",height: "70px",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.HMRate)} // This will highlight the border in red

                      helperText={errors.HMRate || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop:"2px",
                          marginBottom:"1px",
                          color: "red",      // Set the color (optional)
                        },
                      }}           
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="HMTaxableAmt"
                      value={inputFields.HMTaxableAmt}
                      sx={{ width: "140px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.HMTaxableAmt)} // This will highlight the border in red

                      helperText={errors.HMTaxableAmt || ""}
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
                      name="HMTotal"
                      value={inputFields.HMTotal}
                      sx={{ width: "140px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.HMTotal)} // This will highlight the border in red

                      helperText={errors.HMTotal || ""}
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
                      name="HUID"
                      value={inputFields.HUID}
                      sx={{ width: "100px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}
                      error={Boolean(errors.HUID)}
                      helperText={errors.HUID}
                      inputProps={{
                        maxLength: 6, // Restrict maximum length to 6 characters
                        inputMode: "text", // Enable both letters and numbers
                        pattern: "[A-Za-z0-9]*", // Alphanumeric only
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

export default HallMark;
