import TextField from "@mui/material/TextField";
import "./Grid.css"
import { useContext } from 'react';
import Autocomplete from "@mui/material/Autocomplete";

import { DiamondContext } from '../DiamondGridContext/DiamondGridContext';
function Gold() {
 const { inputFields,setInputFields,  handleInputChange,handleSubmit,errors,validateFields } = useContext(DiamondContext);
  const handleChange = (e,value) => {
    setInputFields(prevData=>({...prevData,GCarat:value}))
    validateFields("GCarat",value)

    console.log(errors)
      };
  return (
    <div>
      <div className="table-container-gold mt-0 mb-6">
        <form onSubmit={handleSubmit}>
          <h3><b>GOLD</b></h3>

          <table>
            <thead>
              <tr className="header-cell">
                <th>Karat</th>
                <th>PCS</th>
                <th>Gold Gross Wt</th>
                <th>Gold Purity</th>
                <th>Gold Purity Wt</th>
                <th>Gold 999 Rate without Gst</th>
                <th>Gold Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ position: 'relative' }}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="GCarat"
                      value={inputFields.GCarat}
                      onChange={(e, value) => handleChange(e, value?.value || "", "GCarat")}
                      options={[
                        { label: "22K", value: "22" },
                        { label: "18K", value: "18" },
                      ]}
                      sx={{ border: "none", height: "70px", paddingTop: "12px",
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
                          error={Boolean(errors.GCarat)} // This will highlight the border in red
                          helperText={errors.GCarat && ""}
                          style={{

                            border: "none",
                            width: "150px",
                          }}
                        />
                      )}
                    />
                    {errors.GCarat && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "52px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.GCarat}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                    <TextField
                      id="standard-basic"
                      name="PCS"
                      value={inputFields.PCS}
                      disabled
                      sx={{ width: "80px",height: "70px", paddingTop: "20px"  }}
                      onChange={handleInputChange}
                      variant="standard"
                      error={Boolean(errors.PCS)} // This will highlight the border in red

                      helperText={errors.PCS || ""}
                      FormHelperTextProps={{
                        sx: {
                          fontSize: "12px",  // Adjust font size
                          marginTop: "2px",  // Adjust margin above the helper text
                          color: "red",      // Set the color (optional)
                        },
                      }}                    />
                    
                </td>
                <td>

                  <TextField
                    id="standard-basic"
                    name="GoldWt"
                    value={inputFields.GoldWt}
                    onChange={handleInputChange}

                    sx={{ width: "95px", height: "70px", paddingTop: "20px" }}
                    variant="standard"
                    error={Boolean(errors.GoldWt)} // This will highlight the border in red

                    helperText={errors.GoldWt || ""}
                    FormHelperTextProps={{
                      sx: {
                        fontSize: "12px",  // Adjust font size
                        marginTop: "2px",  // Adjust margin above the helper text
                        color: "red",      // Set the color (optional)
                      },
                    }}                      />
                </td>
                <td>
                  <TextField
                    id="standard-basic"
                    name="GoldPurity"
                    value={inputFields.GoldPurity}
                    onChange={handleInputChange}

                    sx={{ width: "110px",height: "70px", paddingTop: "20px"  }}
                    variant="standard"
                    error={Boolean(errors.GoldPurity)} // This will highlight the border in red

                    helperText={errors.GoldPurity || ""}
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
                    name="GoldPurityWt"
                    onChange={handleInputChange}
                    disabled
                    value={inputFields.GoldPurityWt}
                    sx={{
                      width: "110px", "& input": {
                        fontWeight: "bold",
                      },
                    }}
                    variant="standard"
                    // helperText={errors.GoldPurityWt || ""}
                    // FormHelperTextProps={{
                    //   sx: {
                    //     fontSize: "12px",  // Adjust font size
                    //     marginTop: "5px",  // Adjust margin above the helper text
                    //     color: "red",      // Set the color (optional)
                    //   },
                    // }}                 
                  />
                </td>
                <td>
                  <TextField
                    id="standard-basic"
                    name="Gold999Rate"
                    onChange={handleInputChange}

                    value={inputFields.Gold999Rate}
                    sx={{ width: "130px",height: "70px", paddingTop: "20px"  }}
                    variant="standard"
                    helperText={errors.Gold999Rate || ""}
                    error={Boolean(errors.Gold999Rate)} // This will highlight the border in red

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
                    name="GoldValue"
                    onChange={handleInputChange}

                    value={inputFields.GoldValue}
                    disabled
                    sx={{
                      width: "80px",
                      fontWeight: "bold",
                      "& input": {
                        fontWeight: "bold",
                      },
                    }}
                    variant="standard"
                             
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default Gold;
