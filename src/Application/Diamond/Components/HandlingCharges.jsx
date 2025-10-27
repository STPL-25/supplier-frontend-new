import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext"; // Import your context

function HandlingCharges() {
  const { inputFields, handleInputChange,handleSubmit,ref } = useContext(DiamondContext);
  
  
  return (
    <div>
      <div>
        <div className="table-container-handle">
        <form ref={ref}>
        <h3 style={{left:"10%"}}><b>DIAMOND HANDLING CHARGE</b></h3>

            <table>
              <thead>
                <tr className="header-cell">
                 <th>Handle Rate</th>
                  <th>Handle Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  
                  <td>
                    <TextField
                      id="standard-basic"
                      name="HandleRate"
                      value={inputFields.HandleRate}
                      sx={{ width: 100, border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="HandleAmount"
                      value={inputFields.HandleAmount}
                      sx={{ width: "80px" }}
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

export default HandlingCharges;
