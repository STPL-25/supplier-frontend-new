import Product from "../Components/Product";
import { useContext, useState } from 'react';
import Gold from "../Components/Gold";
import Diamond from "../Components/Diamond";
import Clrstn from "../Components/Clrstn";
import GoldMc from "../Components/GoldMc";
import PtMc from "../Components/PtMc";
import Pt from "../Components/Pt";
import Wastage from "../Components/Wastage";

// import DiamondType from "./DiamondType";
import TotalData from "../Components/TotalData";
import Certification from "../Components/Certification";
import HallMark from "../Components/HallMark";
import { Card } from "@material-tailwind/react";
import MetalTypeCheckboxes from "../Components/MetalTypeCheckboxes "

// import { DiamondProvider } from "../DiamondGridContext/DiamondGridContext"; // Import DiamondProvider
import { DiamondContext } from '../DiamondGridContext/DiamondGridContext'; // Import your context
import HandlingCharges from "../Components/HandlingCharges";
import SupplierDetails from "../Components/SupplierDetails";
import Submit from "../Components/Submit";
import Reset from "../Components/Reset";
import { ToastContainer, toast } from 'react-toastify';

function CombinationGrid() {
  const { metalTypeData } = useContext(DiamondContext) || {};


  return (
    <div className="combination-grid">

      <div>
        <ToastContainer />
        <div className="checkbox-container flex-item flex-direction-row" style={{ height: "60px", marginTop: "15px", marginLeft: "30px" }}>
          <MetalTypeCheckboxes />
          {/* <Reset /> */}
        </div>
        <div className="flex-item" style={{ marginLeft: "5px" }}>
          <Submit />

        </div>
        {/* <div className="flex-item" style={{ marginLeft: "1px" }}>
         
        </div> */}

        <div className="products-container flex flex-row">
          <Product />
          {metalTypeData.gold ?
            (<div className="flex-item" style={{ marginLeft: "1px" }}>
              <Gold />
              <GoldMc />
              {metalTypeData.wastage&&
              <Wastage />
              }
              <HallMark />
            </div>) : null}
          {metalTypeData.platinum ? (<div className="flex-item" style={{ marginLeft: "1px" }}>
            <Pt />
            <PtMc />
          </div>) : null}

          {metalTypeData.diamond ? (<div className="flex-item" style={{ marginLeft: "1px" }}>
            <Diamond />
          </div>) : null}
          {metalTypeData.colorstone ?
            <div className="flex-item" style={{ marginLeft: "-39px" }}>
              <Clrstn />
            </div> : null}


          {metalTypeData.diamond ? (<div className="flex-item" style={{ marginLeft: "1px" }}>
            <Certification />
          </div>) : null}

          {metalTypeData.diamond &&metalTypeData.handlingCharges? (<div className="flex-item" style={{ marginLeft: "1px" }}>
            <HandlingCharges />
          </div>) : null}
          <div className="flex-item" style={{ marginLeft: "1px" }}>
            <TotalData />
          </div>

        </div>

      </div>


    </div>
  );
}

export default CombinationGrid;
