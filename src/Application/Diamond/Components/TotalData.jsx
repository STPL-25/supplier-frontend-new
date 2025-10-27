import TextField from "@mui/material/TextField";
import { useContext } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext"; // Import your context

function TotalData() {
  const { inputFields, handleInputChange,handleSubmit,metalTypeData,setLoopErr,errors } = useContext(DiamondContext);

  return (
    <div>
      <div>
        <div className="table-container-total w-full ml-4">
          <form>
          <h3><b>TOTAL</b></h3>

            <table>
              <thead>
                <tr className="header-cell"style={{height:"30px"}}>
                 {metalTypeData.gold?
                  <th>Go Net Wt</th>:null}
                  {metalTypeData.platinum?
                  <th>PT Net Wt</th>:null}
                  <th>Total Value</th>
                  <th>GST Amt</th>
                  <th>Grand Total</th>
                 
                  {/* <th>Submit</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                 
                  {metalTypeData.gold?
                  <td>
                    <TextField
                      id="standard-basic"
                      name="GNetWt"
                      value={inputFields.GNetWt}
                      sx={{ width: "155px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}
                      error={Boolean(errors.GNetWt)}
                       helperText={errors.GNetWt}

                    />
                  </td>:null}
                 { metalTypeData.platinum?<td>
                    <TextField
                      id="standard-basic"
                      name="PNetWt"
                      value={inputFields.PNetWt}
                      sx={{ width: "150px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}
                      error={Boolean(errors.PNetWt)}
                      helperText={errors.PNetWt}

                    />
                  </td>:null}

                  <td>
                    <TextField
                      id="standard-basic"
                      name="TotalValue"
                      value={inputFields.TotalValue}
                      sx={{ width: "140px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}

                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="GST"
                      value={inputFields.GST}
                      sx={{ width: "130px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}

                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="GrandTotal"
                      value={inputFields.GrandTotal}
                      sx={{ width: "140px",border: "none",paddingTop:"20px" }}
                      onChange={handleInputChange}
                      variant="standard"
                      style={{height:"70px"}}

                    />
                  </td>
                
                  {/* <td >
                    <div className="flex">
                  <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleSubmit}><CheckCircleIcon /></button> */}

                    {/* <button onClick={handleSubmit}></button> */}
                    {/* <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={handleView}><VisibilityIcon/></button> */}

                    {/* <button onClick={handleView}><VisibilityIcon/></button> */}
{/* </div>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </form>
          
        </div>
      </div>
    </div>
  );
}

export default TotalData;
