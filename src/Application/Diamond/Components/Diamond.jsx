import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext, useState,  } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; 
// import DiamondType from "./DiamondType";
import DT from "./DT";
// import { useAutocomplete } from "@refinedev/mui";

function Diamond() {
  const { inputFields,  handleInputChange,diamondData,setDiamondData,handleSubmit,validateFields,errors } = useContext(DiamondContext);
  // const [selectedOption,setSelectedOption]=useState([])
  // const [selectedValue, setSelectedValue] = useState(null);

//   const handleChange = (event, value) => {
//     event.preventDefault();
//         setSelectedValue(value); // Update selected value only if it has changed
//         console.log(selectedValue)
//         if (value) {
//             setDiamondData(true); 
//             setSelectedOption(prevSelectedOption => [...prevSelectedOption, value]);
//             console.log([...selectedOption, value]); // This will log the updated selectedOption
//             console.log(selectedValue);
//         } else {
//             setDiamondData(false); 
//         }
    
//     console.log(selectedValue)
const handleFocus=()=>{
  setDiamondData(true)
}

  return (
    <div>
      <div>
        <div className="table-container-diamond mx-3" style={{width: "1140px", tableLayout: "fixed" }}>
        <form onSubmit={handleSubmit}>
        <h3><b>DIAMOND</b></h3>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr className="header-cell"style={{height:"30px"}}>
                  {/* <th>Diamond Shape</th> */}
                  <th>No of Stone</th>
                  <th>D Carat</th>
                  <th>Diamond Wt</th>
                  <th>Diamond Avg Rate</th>
                  <th>Diamond  Value</th>
                </tr>
              </thead>
              <tbody>
                <tr >
  
                  {/* <td>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      onChange={handleChange}             
                      // options={["Round", "Princess ", "Emerald ","Cushion ","Asscher ","Pear Shaped","Oval Diamonds","Heart Shaped ","Radiant ","Marquise ","Baguette ","Trillion "]}
                      options={["Single","Double","Trible","Fours","Fives"]}
                      value={selectedValue}
                      
                      sx={{ width: 300, border: "none",height:"70px",paddingTop:"10px"  }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} />
                      )}
                      style={{
                        display: "inline-block",
                        width: "150px",
                        border: "none",
                      }}
                    />
                  </td>
                  */}
                  <td>
                    <TextField
                      id="standard-basic"
                      name="NoofStone"
                      value={inputFields.NoofStone}
                      
                      sx={{ width: "100px",height:"70px",paddingTop:"20px","& input": {
                        fontWeight: "bold",
                      } }}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="DCarat"
                      disabled
                      value={inputFields.DCarat}
                      onChange={handleInputChange}
                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      onFocus={handleFocus}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="DiamondWt"
                      disabled
                      value={inputFields.DiamondWt}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="DiamondRate"
                      onFocus={handleFocus}
                      value={inputFields.DiamondRate}
                      onChange={handleInputChange}
                      disabled
                      sx={{ width: "60px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                    />
                  </td>
                  <td>
                    <TextField
                      id="standard-basic"
                      name="DiamondValue"
                      onFocus={handleFocus}
                      value={inputFields.DiamondValue}
                      onChange={handleInputChange}
                      disabled
                      sx={{ width: "100px","& input": {
                        fontWeight: "bold",
                      } }}
                      variant="standard"
                    />
                  </td>
                </tr>
              </tbody>
            </table>  
          </form>
        </div>
      </div>
      <div>
     
      {/* <DiamondType  selectedOption={selectedOption} selectedValue={selectedValue} />   */}
   <DT />
{/* selectedOption={selectedOption} selectedValue={selectedValue} */}
      {/* {selectedOption.map((option, index) => ( */}
  {/* <div key={option+index}>
 <DiamondType option={option} Dindex={index} selectedOption={selectedOption} key={option + index} />  
 </div>
))} */}
</div>
    </div>
  );
}

export default Diamond;
