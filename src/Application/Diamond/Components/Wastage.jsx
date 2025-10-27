import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
function Wastage() {
  const { inputFields,  handleInputChange,setLoopErr } = useContext(DiamondContext);
  const handleChange = (e) => {
    if(e){
      setLoopErr(true)
    }
    handleInputChange(e); 
    console.log(e)
    const objectString = JSON.stringify(inputFields);
    console.log(objectString);
      };
  return (
    <div>
    <div className="table-container-wastage mb-6">
      <form>
      <h3><b>WASTAGE</b></h3>

        <table>
          <thead>
            <tr className='header-cell'>
              <th>Wastage Type</th>
              <th>Wastage Weight</th>
              {/* <th>Wastage Percentage</th> */}

              <th>Wastage Amt</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                //   onChange={() => setDiamondData(true)} // Use onChange instead of onSelect
                  name="WastageType"
                  value={inputFields.WastageType}
                  options={['Gram']}
                  sx={{ width: 300, border: 'none' ,
                  paddingTop:"10px",
                  '& .MuiOutlinedInput-root': {
                          height: '40px', // Set height of the input field
                          '& input': {
                           padding: '10px', // Adjust padding for the input
                          },
                          },
                  }}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} style={{ border: 'none' }} />}
                  style={{ display: 'inline-block', width: "150px",height:"70px", border: "none" }}
                />
              </td>
              <td>
                <TextField id="standard-basic" name="WastageWeight" value={inputFields.WastageWeight} sx={{ width: "65px",height:"50px",paddingTop:"10px" }} onChange={handleChange} variant="standard" />
              </td>
              {/* <td>
                <TextField id="standard-basic" name="WastagePercentage" value={inputFields.WastagePercentage} sx={{ width: "65px",height:"50px",paddingTop:"10px" }} onChange={handleChange} variant="standard" />
              </td> */}
              <td>
                <TextField id="standard-basic" name="WastageAmt"value={inputFields.WastageAmt}sx={{ width: "140px" }} onChange={handleChange}variant="standard" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
  )
}

export default Wastage;
