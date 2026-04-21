import Product from "../Components/Product";
import { useContext,useState } from 'react';
import Gold from "../Components/Gold";
import Diamond from "../Components/Diamond";
import Clrstn from "../Components/Clrstn";
import GoldMc from "../Components/GoldMc";
import PtMc from "../Components/PtMc";
import Pt from "../Components/Pt";
import Wastage from "../Components/Wastage";

import TotalData from "../Components/TotalData";
import Certification from "../Components/Certification";
import HallMark from "../Components/HallMark";
import { Card } from "@material-tailwind/react";

// import { DiamondProvider } from "../DiamondGridContext/DiamondGridContext"; // Import DiamondProvider
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
import HandlingCharges from "../Components/HandlingCharges";
import SupplierDetails from "../Components/SupplierDetails";

function Combine() {
  const { metalTypeData } = useContext(DiamondContext);
  // console.log(metalTypeData.gold)
 
  
  const [isImageRotated, setIsImageRotated] = useState(false);

  const rotateImage = () => {
    setIsImageRotated(true);
  };
  // console.log("combine grid")
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {" "}
        <div
          style={{
            position: "fixed",
            display: "flex",
            flexDirection: "row",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >

          {" "}
       
        </div>
      </div>
      <div >
      <Card className="h-full w-full ">
        
      <div className="flex-item " style={{ height: "100px", marginTop: "180px",marginLeft:"30px" }}>
              <SupplierDetails />
            </div>
          <div className="flex flex-row">
          
            <div className="flex-item " style={{ height: "100px" }}>
              <Product />
            </div>
            {metalTypeData.gold?
           ( <div className="flex-item" style={{ marginLeft: "-39px" }}>
              <Gold />
              {/* <GoldMc />
              <HallMark/> */}
            </div>):null}
          {metalTypeData.platinum? (<div className="flex-item" style={{ marginLeft: "-39px" }}>
            <Pt />
            {/* <PtMc /> */}
          </div>):null}

           {metalTypeData.diamond? (<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <Diamond />
            </div>):null}
            {metalTypeData.colorstone?
            <div className="flex-item" style={{ marginLeft: "-39px" }}>
              <Clrstn />
            </div>:null}

          { metalTypeData.gold? (<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <GoldMc />
            </div>):null}
          { metalTypeData.platinum ?(<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <PtMc />
            </div>):null}
          {metalTypeData.gold?(<div className="flex-item" style={{ marginLeft: "-39px" }}>
            <Wastage />
          </div>):null}

            {metalTypeData.diamond?(<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <Certification/>
            </div>):null}
            {metalTypeData.gold?(<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <HallMark/>
            </div>):null}
            {metalTypeData.diamond?(<div className="flex-item" style={{ marginLeft: "-39px" }}>
              <HandlingCharges/>
            </div>):null}
            <div className="flex-item" style={{ marginLeft: "-39px" }}>
              <TotalData/>
            </div>
          </div>
          {/* {diamondData?(<div><DiamondType/></div>):(null)} */}
         
         </Card> 
      </div>

      {/* <div className="flex flex-col items-center justify-center h-[40rem]  ">
    
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
      
      </div>
    </div> */}
    </div>
  );
}

export default Combine;



const handleEditRow = (index) => {
  // 1. Select the specific row data by index
  const selectedRow = rows[index];
  // console.log(selectedRow);

  // 2. Handle potential errors gracefully
  if (!selectedRow) {
    // console.error("Invalid row index provided. Please check your input.");
    return; // Exit the function if no valid row is found
  }

  // 3. Extract diamond/color stone data with optional handling
  let mappedDiamondData, mappedClrstnData;
  try {
    if (Array.isArray(selectedRow.Diamonds)) {
      mappedDiamondData = selectedRow.Diamonds.map(diamond => ({
        diamondShape: diamond.Shape,
        numberOfStones: diamond.NoOfStones,
        carat: diamond.Carat,
        diaRate: diamond.Rate,
        diaValue: diamond.Value,
        diaWt: diamond.Weight
      }));
      setDiamondData(true); // Assuming this sets a diamond data flag

    }

    if (Array.isArray(selectedRow.ColorStones)) {
      mappedClrstnData = selectedRow.ColorStones.map(clrstn => ({
        csType: clrstn.Type,
        csPcs: clrstn.Pcs,
        csCarat: clrstn.csCarat,
        csRate: clrstn.csRate,
        csAmt: clrstn.Amount,
        csWt: clrstn.csWeight
      }));
      setclrStn(true)
    }
  } catch (error) {
    // console.error("Error processing diamond/color stone data:", error);
    // Handle the error appropriately, e.g., display an error message to the user
    return; // Optionally, exit the function if the error is critical
  }

  // 4. Update state variables (assuming appropriate state management)
  setInputFields(selectedRow);
  setTotalDiamondData(mappedDiamondData);
  setTotalClrstnData(mappedClrstnData);
  setActiveSection("Diamond Data Entry");
  setMetalTypeData(selectedRow.metalTypeData)
};