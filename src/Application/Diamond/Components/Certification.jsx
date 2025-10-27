import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext"; // Import your context
import Autocomplete from "@mui/material/Autocomplete";

function Certification() {
  const { inputFields, handleInputChange,setInputFields } = useContext(DiamondContext);
  const handleChange = (e, value, fieldName) => {
    e.preventDefault();
    setInputFields(prevInputFields => ({
      ...prevInputFields,
      [fieldName]: value
    }));
  };
  
  return (
    <div>
      <div>
        <div className="table-container-certification ml-6 mr-4">
          <form>
          <h3 style={{left:"40%"}}><b>DIAMOND CERTIFICATE</b></h3>

            <table>
              <thead>
                <tr className="header-cell">
                  <th>Cert Type</th>
                  <th>Cert GST</th>
                  <th>Cert Qty</th>
                  <th>Cert Rate</th>
                  <th>Cert Taxable Amt</th>
                  <th>Cert Total</th>
                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="CertType"
                      value={inputFields.CertType}
                      options={["carat", "Pcs"]}
                      sx={{ width: 300, border: "none",paddingTop:"10px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                       }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} />
                      )}
                      style={{
                        display: "inline-block",
                        width: "150px",
                        height:"70px",
                        border: "none",
                      }}
                      onChange={(e, value) => handleChange(e, value, "CertType")}
                      
                      />
                  </td>
                  <td>
                  <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="CertGST"
                      value={inputFields.CertGST}
                      options={["3", "18"]}
                      sx={{ width: 300, border: "none",paddingTop:"10px",
                        '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                       }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} />
                      )}
                      style={{
                        display: "inline-block",
                        width: "150px",
                        height:"70px",
                        border: "none",
                      }}
                      onChange={(e, value) => handleChange(e, value, "CertGST")}
                      />
                    {/* <TextField
                      id="standard-basic"
                      name="CertGST"
                      value={inputFields.CertGST}
                      sx={{ width: "130px" }}
                      onChange={handleInputChange}
                      variant="standard"
                    /> */}
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CertQty"
                      value={inputFields.CertQty}
                      sx={{ width: "50px" }}
                      onChange={handleInputChange}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CertRate"
                      value={inputFields.CertRate}
                      sx={{ width: "65px" }}
                      onChange={handleInputChange}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CertTaxableAmt"
                      value={inputFields.CertTaxableAmt}
                      sx={{ width: "140px" }}
                      onChange={handleInputChange}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CertTotal"
                      value={inputFields.CertTotal}
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

export default Certification;
