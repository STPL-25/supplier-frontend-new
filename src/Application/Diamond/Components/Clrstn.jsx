import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext,useState } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; 
import ClrstnType from "./ClrstnType";
function Clrstn() {
  const { inputFields,  handleInputChange,clrStn,setclrStn } = useContext(DiamondContext);
  // const [selectedValue, setSelectedValue] = useState(null);
  // const [selectedOption,setSelectedOption]=useState([])

const  handleFocus =()=>{
  setclrStn(true)
}                                          

 
//   const handleChange = (event, value) => {
//     event.preventDefault()

//     if (value) {
//       setclrStn(true); 
//       setSelectedValue(value);

//         setSelectedOption(prevSelectedOption => [...prevSelectedOption, value]);
//     } else {
//       setclrStn(false); 
//       setSelectedValue(null);

//     }
// };

  return (
    <div>
      <div >
        <div className="table-container-clrstn mx-3" style={{width: "1200px", tableLayout: "fixed" }}>
          <form>
          <h3><b>COLOR STONE</b></h3>

            <table style={{ width: "100%", borderCollapse: "collapse", marginRight:"10px", marginLeft:"45px"}}>
              <thead>
                <tr className="header-cell" style={{height:"30px"}}>
                  {/* <th>ClrStn Type</th> */}
                  <th>ClrStn PCS</th>
                  <th>CS Carat</th>
                  <th>CS Wt</th>
                  <th>CS Rate</th>
                  <th>CS Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr >
                  {/* <td>
                    <Autocomplete
                      disablePortal
                      onChange={handleChange}
                      value={selectedValue} // Set the value prop to control the selected value
                       id="combo-box-demo"
                       options={["Single","Double","Trible","Fours","Fives"]}                      sx={{ width: 300,paddingTop:"10px" }}
                      renderInput={(params) => <TextField {...params} />}
                      style={{ display: "inline-block", width: "150px",height:"70px",marginRight:"-10px" }}
                    />
   
                  </td> */}
                  <td>
                    <TextField
                      id="standard-basic"
                      name="ClrStnPCS"
                      value={inputFields.ClrStnPCS}
                      onFocus={handleFocus}
                      
                      sx={{ width: "100px",height:"70px",paddingTop:"20px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CSCarat"
                      disabled
                      value={inputFields.CLSCarat}
                      onFocus={handleFocus}

                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                      onChange={handleInputChange}

                    />
                  </td>

                  <td>
                    <TextField
                      id="standard-basic"
                      name="CSWt"
                      disabled
                      value={inputFields.ClrStnWt}
                      onFocus={handleFocus}

                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                      onChange={handleInputChange}

                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CSRate"
                      disabled
                      value={inputFields.ClrStnRate}
                      onFocus={handleFocus}

                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                      onChange={handleInputChange}

                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="CSAmount"
                      value={inputFields.CSAmount}
                      onFocus={handleFocus}
                      disabled
                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
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
      <div>         

</div>
{/* {selectedOption.map((option, index) => (
  <React.Fragment key={index}>
    {clrStn ? <ClrstnType  />:(null)}
  </React.Fragment>
))} */}
<div >
<ClrstnType />
{/* selectedOption={selectedOption} selectedValue={selectedValue}  */}
</div>

  </div>    
  );
}

export default Clrstn;
