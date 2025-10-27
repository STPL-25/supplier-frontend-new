import TextField from '@mui/material/TextField';
import "./Grid.css"
import { useContext, useEffect, useState } from 'react';
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
import Autocomplete from "@mui/material/Autocomplete";


function Product() {
    const { inputFields,  handleInputChange,setInputFields,handleSubmit,setLoopErr,ref,generateFormattedDateTime,errors,validateFields } = useContext(DiamondContext);
    const [wtModeData,setWtModeData]=useState([])
    useEffect(()=>{
      if(inputFields.MetalType==="Yellow Gold"||inputFields.MetalType==="Rose Gold"||inputFields.MetalType==="White Gold"){
        setWtModeData(["Gold With Diamond NtWt"]);
      }
      if(inputFields.MetalType==="Platinum"){
        setWtModeData(["Platinum With Daimond NtWt"
         ,,"Platinum With Gold NtWt","Platinum With Gold Diamond NtWt",
         ,"Platinum NtWt"]);

      }
    },[inputFields.MetalType])
    const handleChange = (e, value, fieldName) => {
      e.preventDefault();
      // if(e){
      //   setLoopErr(true)
      // }
     
      setInputFields(prevInputFields => ({
        ...prevInputFields,
        
        [fieldName]: value
      }));
      validateFields(fieldName,value)

    };
//  console.log(wtModeData)
    return (
    <div>

<div className="product-table-container mr-3">

      <form ref={ref}>
      <h3><b>PRODUCT</b></h3>

          <table>
            <thead>
              <tr className='header-cell'>
              {/* <th>Estimation Number</th> */}
                {/* <th>Supplier Code</th> */}
                <th>Product Name</th>
                <th >Metal Type</th>
                <th>Wt Mode</th>
                <th>Design No</th>
               
              </tr>
            </thead>
            <tbody>
              <tr>
              {/* <td>
                  <TextField id="standard-basic" name='EstNo' value={inputFields.EstNo} sx={{ width: "200px",height:"70px",paddingTop:"20px", }}onChange={handleInputChange} variant="standard" />  
                </td> */}
              {/* <td>
                  <TextField id="standard-basic" name='RefNo' value={inputFields.RefNo} sx={{ width: "150px",height:"70px",paddingTop:"20px", }}onChange={handleInputChange} variant="standard" />  
                </td> */}
                <td>
                  <TextField id="standard-basic" name='ProductName'  value={inputFields.ProductName} 
                  sx={{ width: "150px",height:"70px",paddingTop:"20px", }}onChange={handleInputChange} variant="standard" 
                   error={Boolean(errors.ProductName)} // This will highlight the border in red

                   helperText={errors.ProductName || ""}
                   FormHelperTextProps={{
                     sx: {
                       fontSize: "12px",  // Adjust font size
                       marginTop: "2px",  // Adjust margin above the helper text
                       color: "red",      // Set the color (optional)
                     }}}
                  />  
                </td>
                {/* border:"1px solid grey",borderRadius:"10px" */}
              
                <td>
                  {/* <TextField id="standard-basic"name='MetalType' value={inputFields.MetalType} sx={{ width: "100px", }}onChange={handleChange} variant="standard" /> */}
                  <div style={{ position: 'relative' }}>
                  <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="MetalType"
                      value={inputFields.MetalType}
                      onChange={(e, value) => handleChange(e, value, "MetalType")}
                      options={["","Yellow Gold", "Rose Gold", "White Gold"
                  ,"Platinum","Gem Stones"
                      ]}
                      // value={selectedValue}
                      sx={{ width: 300, border: "none",height:"70px",paddingTop:"10px",
                        '& .MuiOutlinedInput-root': {
                        height: '40px', // Set height of the input field
                        '& input': {
                         padding: '10px', // Adjust padding for the input
                        },
                        },
                        }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} 
                        error={Boolean(errors.MetalType)} // This will highlight the border in red
                        helperText={errors.MetalType && ""}
                        />
                      )}
                      style={{
                        // display: "inline-block",
                        width: "200px",
                        border: "none",
                      }}
                    />
                     {errors.MetalType && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "52px",
                          left: "0",
                           // Adjust this to position error message under the input field
                        }}
                      >
                        {errors.MetalType}
                      </span>
                    )}
                    </div>
                </td>
                <td>
                  {/* <TextField id="standard-basic" name='WtMode' value={inputFields.WtMode} sx={{ width: "80px" }}onChange={handleChange} variant="standard" /> */}
                  <div style={{ position: 'relative' }}>
                  <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      name="WtMode"
                      value={inputFields.WtMode}
                      onChange={(e, value) => handleChange(e, value, "WtMode")}
                      // options={["Gold With Diamond NtWt", "Gold With Diamond GsWt ", "Platinum With Daimond NtWt"
                      // ,"Platinum With Diamond GsWt","Platinum With Gold NtWt","Platinum With Gold Diamond NtWt","Platinum With Gold Diamond GsWt"
                      // ,"Platinum NtWt"]}
                      // value={selectedValue}
                      options={wtModeData}
                      sx={{ width: "270px", 
                        border: "none",
                        height:"70px",
                        paddingTop:"12px",
                        '& .MuiOutlinedInput-root': {
                        height: '40px', // Set height of the input field
                        '& input': {
                         padding: '10px', // Adjust padding for the input
                        },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }}
                        error={Boolean(errors.WtMode)} // This will highlight the border in red
                        helperText={errors.WtMode && ""}
                        />
                      )}
                      style={{
                        
                        
                        border: "none",
                      }}
                    />
                     {errors.WtMode && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "12px",
                          position: "absolute",
                          top: "52px", // Adjust this to position error message under the input field
                          left: "0"
                        }}
                      >
                        {errors.WtMode}
                      </span>
                    )}
                    </div>
                </td>
                <td>
                  <TextField id="standard-basic" name='DesignNo' value={inputFields.DesignNo} sx={{ width: "110px" ,height:"70px",paddingTop:"20px" }}onChange={handleInputChange} variant="standard"
                   error={Boolean(errors.DesignNo)} // This will highlight the border in red

                   helperText={errors.DesignNo || ""}
                   FormHelperTextProps={{
                     sx: {
                       fontSize: "12px",  // Adjust font size
                       marginTop: "2px",  // Adjust margin above the helper text
                       color: "red",      // Set the color (optional)
                     }}}
                  />
                  {/* <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                     onChange={handleChange}             
                      options={["Round", "Princess ", "Emerald ","Cushion ","Asscher ","Pear Shaped","Oval Diamonds","Heart Shaped ","Radiant ","Marquise ","Baguette ","Trillion "]}
                      // value={selectedValue}
                      sx={{ width: 300, border: "none",height:"70px",paddingTop:"10px"  }}
                      renderInput={(params) => (
                        <TextField {...params} style={{ border: "none" }} />
                      )}
                      style={{
                        display: "inline-block",
                        width: "150px",
                        border: "none",
                      }}
                    /> */}
                </td>
                
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  );
}

export default Product;
