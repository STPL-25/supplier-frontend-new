import { useState, createContext, useEffect, useRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DIA_API } from "../../../config/configData";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import styles
import Wastage from "../Components/Wastage";

// Create a new context
const DiamondContext = createContext();
// DiamondProvider component to provide the context value
const DiamondProvider = ({ children }) => {
  // const navigate = useNavigate();
  const { user } = useContext(DashBoardContext)


  const [inputFields, setInputFields] = useState({
    SupplierName: user || "",
    EstNo: localStorage.getItem("EstNo") || "",
    ProductName: null,
    MetalType: null,
    WtMode: null,
    DesignNo: null,
    GCarat: null,
    PCS:1,
    GoldWt: 0,
    GoldPurity: 0,
    GoldPurityWt: 0,
    Gold999Rate: 0,
    GoldValue: 0,
    PTWt: 0,
    PTPurity: 0,
    PTPurityWt: 0,
    PT999Rate: 0,
    PTValue: 0,
    DiamondShape: [],
    DiNoOfStones: [],
    DiCarat: [],
    diaRate: [],
    diaValue: [],
    diaWt: [],
    NoofStone: 0,
    DCarat: 0,
    DiamondWt: 0,
    DiamondRate: 0,
    DiamondValue: 0,
    csType: [],
    csPcs: [],
    csCarat: [],
    csRate: [],
    csAmt: [],
    csWt: [],
    ClrStnPCS: 0,
    CLSCarat: 0,
    ClrStnWt: 0,
    ClrStnRate: 0,
    CSAmount: 0,
    GoMcType: null,
    GoMcRate: 0,
    GoMcAmount: 0,
    PTMcType: null,
    PTMcRate: 0,
    PTMcAmount: 0,
    WastageType: "Gram",
    WastageWeight: 0,
    WastageAmt: 0,
    CertType: null,
    CertGST: null,
    CertQty: 0,
    CertRate: 0,
    CertTaxableAmt: 0,
    CertTotal: 0,
    HallMarkType: null,
    HMGST: null,
    HMQty: 0,
    HMRate: 0,
    HMTaxableAmt: 0,
    HMTotal: 0,
    HandleRate: 0,
    HandleAmount: 0,
    GNetWt: 0,
    PNetWt: 0,
    TotalValue: 0,
    GST: 0,
    GrandTotal: 0,
    HUID: "",
  });
  const [errors, setErrors] = useState({});

  // const RefNo = useRef(inputFields.RefNo);
  // console.log(RefNo)
  // console.log(inputFields)
  useEffect(() => {
    if (!localStorage.getItem("EstNo")) {
      generateFormattedDateTime()
    }
  }, [inputFields.SupplierName])
  function generateFormattedDateTime() {
    const now = new Date();
    const isoString = now.toISOString();

    // Remove hyphens and colons, keep the milliseconds and the 'Z' at the end
    const formattedDateTime = isoString
      .replace(/-/g, '') // Remove hyphens
      .replace(/:/g, '') // Remove colons
      .replace(/\.\d+Z$/, match => match.replace('.', 'T')) // Replace the period before milliseconds with 'T'
      .replace('T', 'T'); // Retain the 'T' separator between date and time
    localStorage.setItem("EstNo", formattedDateTime)
    // localStorage.setItem("sCode",inputFields.SupplierName)

    setInputFields((preField) => ({
      ...preField,
      EstNo: localStorage.getItem("EstNo")
    }));
  }
  // console.log(localStorage.getItem("EstNo"))
  const [totalDatas, setTotalDatas] = useState([])
  const [diamondData, setDiamondData] = useState(false);
  const [clrStn, setclrStn] = useState(false);
  const [loopErr, setLoopErr] = useState(false)
  const [totalDiamondData, setTotalDiamondData] = useState([
    {

      diamondShape: null,
      numberOfStones: 0,
      carat: 0,
      diaRate: 0,
      diaValue: 0,
      diaWt: 0,
    },
  ]);
  const [totalClrstnData, setTotalClrstnData] = useState([
    {
      csType: null,
      csPcs: 0,
      csCarat: 0,
      csRate: 0,
      csAmt: 0,
      csWt: 0,
    },
  ]);
  // const [metalTypeData, setMetalTypeData] = useState({
  //   gold: true,
  //   platinum: true,
  //   diamond: true,
  // });
  const [metalTypeData, setMetalTypeData] = useState({
    gold: true,
    platinum: false,
    diamond: false,
    colorstone: false,
    wastage:false
  });
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
// console.log(name,checked)
    // Create a new state object with the current change
    let newMetalTypeData = { ...metalTypeData, [name]: checked };

    // Validation logic
    if ((newMetalTypeData.diamond || newMetalTypeData.colorstone)) {
      // If diamond or colorstone is checked, ensure gold or platinum is also checked
      if (!newMetalTypeData.gold && !newMetalTypeData.platinum) {
        // If neither gold nor platinum is checked, check gold by default
        newMetalTypeData.gold = true;
      }
    }
    if ((!newMetalTypeData.diamond &&!newMetalTypeData.colorstone&&!newMetalTypeData.gold&&!newMetalTypeData.platinum)) {
      
        newMetalTypeData.gold = true;
    
    }

    // Check if the checkbox is being unchecked
    if (!checked) {
      // Show confirmation dialog
      const userConfirmed = window.confirm(`${name.toUpperCase()} is currently selected. By unchecking it, you will lose any 
saved data associated with ${name.toUpperCase()}. 

Do you wish to continue? Press OK to confirm or Cancel to keep it.`);

      // If the user cancels, do nothing (return early)
      if (!userConfirmed) {
        return;
      }
    }

    // Proceed with updating the state
    setMetalTypeData(newMetalTypeData);
  };

  const calculations = () => {


    let DiamondShape = [];
    let numberOfStones = [];
    let carat = [];
    let diaRate = [];
    let diaValue = [];
    let diaWt = [];
    totalDiamondData.map((shape) => {
      DiamondShape.push(shape.diamondShape);
      numberOfStones.push(shape.numberOfStones);
      carat.push(shape.carat);
      diaRate.push(shape.diaRate);
      diaValue.push(shape.diaValue);
      diaWt.push(shape.diaWt);
    });
    let csType = [];
    let csPcs = [];
    let csCarat = [];
    let csRate = [];
    let csAmt = [];
    let csWt = [];
    totalClrstnData.map((shape) => {
      csType.push(shape.csType);
      csPcs.push(shape.csPcs);
      csCarat.push(shape.csCarat);
      csRate.push(shape.csRate);
      csAmt.push(shape.csAmt);
      csWt.push(shape.csWt);
    });

    // const newGoldPurityWt =
    //   parseFloat(inputFields.GoldWt) * parseFloat(inputFields.GoldPurity / 100);
    const newGoldPurityWt =
    parseFloat(inputFields.GNetWt) * parseFloat(inputFields.GoldPurity / 100);
    // const newGoldValue =
    //   parseFloat(inputFields.Gold999Rate) * inputFields.GNetWt;
    const newGoldValue =
      parseFloat(inputFields.Gold999Rate) * inputFields.GoldPurityWt;
    // const newPTPurityWt =
    //   parseFloat(inputFields.PTWt) * parseFloat(inputFields.PTPurity / 100);
    const newPTPurityWt =
    parseFloat(inputFields.PNetWt) * parseFloat(inputFields.PTPurity / 100);
    
    const GdKaratValue = (parseFloat(inputFields.Gold999Rate) / 100) * parseFloat(inputFields.GoldPurity)
    //  console.log(GdKaratValue)
    // const newPTValue = parseFloat(inputFields.PT999Rate) * newPTPurityWt;
    const newPTValue = parseFloat(inputFields.PT999Rate) * newPTPurityWt;

    // console.log(newPTValue,inputFields.PT999Rate,newPTPurityWt)
    let totalDiamond = totalDiamondData.reduce((acc, curr) => {
      return acc + parseInt(curr.numberOfStones, 10);
    }, 0);
    let totalDiaCarat = totalDiamondData.reduce((acc, curr) => {
      return acc + parseFloat(curr.carat, 10);
    }, 0);
    let totalDiaRate = totalDiamondData.reduce((acc, curr) => {
      return acc + parseInt(curr.diaRate) * parseFloat(curr.carat);
    }, 0);

    // let averageDiaRate = totalDiaRate / (totalDiaCarat * 100);


    let totalDiaValue = totalDiamondData.reduce((acc, curr) => {
      return acc + parseInt(curr.diaValue, 10);
    }, 0);
    let averageDiaRate = totalDiaValue / totalDiaCarat;

    let totalDiaWt = totalDiamondData.reduce((acc, curr) => {
      return acc + parseFloat(curr.diaWt, 10);
    }, 0);

    let totalcsPcs = totalClrstnData.reduce((acc, curr) => {
      return acc + parseInt(curr.csPcs, 10);
    }, 0);
    let totalCSRate = totalClrstnData.reduce((acc, curr) => {
      return acc + parseInt(curr.csRate) * parseFloat(curr.csCarat);
    }, 0);

    let totalcsCarat = totalClrstnData.reduce((acc, curr) => {
      return acc + parseFloat(curr.csCarat, 10);
    }, 0);
    // const avgCsRate = totalCSRate / (totalcsCarat * 100);


    let totalCSAmount = totalClrstnData.reduce((acc, curr) => {
      return acc + parseInt(curr.csAmt, 10);
    }, 0);
    const avgCsRate = totalCSAmount / (totalcsCarat );

    let totalCSWt = totalClrstnData.reduce((acc, curr) => {
      return acc + parseFloat(curr.csWt, 10);
    }, 0);

    let GdWastageAmt =
      parseFloat(inputFields.WastageWeight) * GdKaratValue
    const HMTaxableAmt = +inputFields.HMQty * +inputFields.HMRate;
    const HMTotal = HMTaxableAmt + HMTaxableAmt * (+inputFields.HMGST / 100);
    let GoMcAmount;
    if (inputFields.GoMcType === "Gram") {
      GoMcAmount =
        parseFloat(inputFields.GoMcRate) * parseFloat(inputFields.GNetWt);
    } else if (inputFields.GoMcType === "Pcs") {
      GoMcAmount = 1 * parseFloat(inputFields.GoMcRate);
    }
    let PTMcAmount;
    if (inputFields.PTMcType === "Gram") {
      PTMcAmount =
        parseFloat(inputFields.PTMcRate) * parseFloat(inputFields.PNetWt);
    } else if (inputFields.PTMcType === "Pcs") {
      PTMcAmount = parseFloat(inputFields.PTMcRate);
    }
    // let CertTaxableAmt = +inputFields.CertQty * (+inputFields.CertRate)*(inputFields.DCarat);

    let CertType
    let CertQty
    let CertRate
    let CertTaxableAmt
    let CertTotal

    if (totalDiaCarat <= 0.25 && totalDiaCarat > 0) {
      CertType = "Pcs";
      CertQty = 1;
      CertRate = 125;
      CertTaxableAmt = CertQty * CertRate;
      CertTotal = CertTaxableAmt + CertTaxableAmt * (+inputFields.CertGST / 100);
    } else if (totalDiaCarat > 0.25 && totalDiaCarat !== 0) {
      CertType = "carat";
      CertQty = totalDiaCarat;
      CertRate = 500;
      CertTaxableAmt = CertQty * CertRate;
      CertTotal = CertTaxableAmt + CertTaxableAmt * (+inputFields.CertGST / 100);
    } else if (totalDiaCarat === 0.000) {
      CertType = null;
      CertQty = 0;
      CertRate = 0;
      CertTaxableAmt = 0;
      CertTotal = 0;
    }

    const HandleAmount = parseFloat(inputFields.HandleRate) * totalDiaCarat;
    let GNetWt
    let PNetWt

    if (metalTypeData.gold) {
      GNetWt = parseFloat(inputFields.GoldWt) -
        parseFloat(inputFields.DiamondWt) -
        parseFloat(inputFields.ClrStnWt);
      // PNetWt = parseFloat(inputFields.PTWt)
    }
    if (metalTypeData.gold&&metalTypeData.platinum) {
      GNetWt = parseFloat(inputFields.GoldWt) 
      PNetWt = parseFloat(inputFields.PTWt)-
      parseFloat(inputFields.DiamondWt) -
      parseFloat(inputFields.ClrStnWt);
    }


    if (!metalTypeData.gold && metalTypeData.platinum) {
      PNetWt = parseFloat(inputFields.PTWt) - parseFloat(inputFields.DiamondWt) -
        parseFloat(inputFields.ClrStnWt);
    }

    const calculateTotalValue = (...values) => {
      return values.reduce((acc, curr) => {
        // Convert undefined or NaN values to 0
        const numericValue = isNaN(curr) || curr === undefined ? 0 : curr;
        // Add the numeric value to the accumulator
        return acc + numericValue;
      }, 0);
    };
    let TotalValue
    // if((inputFields.HMGST||inputFields.CertGST)==="18"){
    TotalValue = calculateTotalValue(
      // newGoldValue??0,
      // newPTValue??0,
      // totalDiaValue??0,
      // totalCSAmount??0,
      // GoMcAmount??0,
      // PTMcAmount??0,
      // GdWastageAmt??0,
      // CertTaxableAmt??0,
      // // HMTotal,
      // HMTaxableAmt??0,
      // HandleAmount??0
      parseFloat(inputFields.GoldValue),
      parseFloat(inputFields.PTValue),
      parseFloat(inputFields.DiamondValue),
      parseFloat(inputFields.CSAmount),
      parseFloat(inputFields.GoMcAmount),
      parseFloat(inputFields.PTMcAmount),
      parseFloat(inputFields.WastageAmt),
      parseFloat(inputFields.CertTaxableAmt),
      parseFloat(inputFields.HMTaxableAmt),
      parseFloat(inputFields.HandleAmount)



    );
    //  console.log(parseFloat (inputFields.GoldValue),
    //  parseFloat( inputFields.PTValue),
    //  parseFloat (inputFields.DiamondValue),
    //  parseFloat (inputFields.CSAmount),
    //  parseFloat (inputFields.GoMcAmount),
    //  parseFloat  (inputFields.PTMcAmount),
    //  parseFloat (inputFields.WastageAmt),
    //  parseFloat (inputFields.CertTaxableAmt),
    //  parseFloat( inputFields.HMTaxableAmt),
    //  parseFloat( inputFields.HandleAmount))
    const GstValue = calculateTotalValue(
      // newGoldValue,
      // newPTValue,
      // totalDiaValue,
      // totalCSAmount,
      // GoMcAmount,
      // PTMcAmount,
      // GdWastageAmt,
      // HandleAmount
      parseFloat(inputFields.GoldValue),
      parseFloat(inputFields.PTValue),
      parseFloat(inputFields.DiamondValue),
      parseFloat(inputFields.CSAmount),
      parseFloat(inputFields.GoMcAmount),
      parseFloat(inputFields.PTMcAmount),
      parseFloat(inputFields.WastageAmt),
      parseFloat(inputFields.HandleAmount)
    )
    let certGst = parseFloat(inputFields.CertTaxableAmt) * parseInt(inputFields.CertGST) / 100;
    let HmGst = parseFloat(inputFields.HMTaxableAmt) * parseInt(inputFields.HMGST) / 100;
    const certGstAndHmGst = calculateTotalValue(
      certGst,
      HmGst,

    )
    // console.log(certGstAndHmGst)
    let GST = (GstValue * 3 / 100 + certGstAndHmGst)
    // console.log(GstValue,TotalValue)
    // console.log("newGoldValue:"+newGoldValue,"newPTValue:"+newPTValue,"totalDiaValue:"+totalDiaValue,"totalCSAmount:"+totalCSAmount,"GoMcAmount:"+GoMcAmount,"PTMcAmount"+PTMcAmount,"")
    // console.log(TotalValue,newGoldValue,newPTValue,totalDiaValue,totalCSAmount,GoMcAmount,PTMcAmount,GdWastageAmt,CertTaxableAmt,HMTotal,HandleAmount)
    // console.log(isNaN(GoMcAmount)||GoMcAmount==="undefined"?0:  GoMcAmount)
    //   let GST;
    // if (inputFields.HMGST && inputFields.CertGST == "18") {
    //   const value = +TotalValue - +HMTotal - +CertTotal;
    //   GST = (value * 3) / 100;
    // } else {
    //   GST = (TotalValue * 3) / 100;
    // }
    const GrandTotal = +TotalValue + (+GST);

    setInputFields((prevState) => ({
      ...prevState,
      DiamondShape,
      DiNoOfStones: numberOfStones,
      DiCarat: carat,
      diaRate,
      diaValue,
      diaWt,
      csType,
      csPcs,
      csCarat,
      csRate,
      csAmt,
      csWt,
      GoldPurityWt: !isNaN(newGoldPurityWt) ? newGoldPurityWt.toFixed(5) : 0,
      GoldValue: !isNaN(newGoldValue) ? newGoldValue.toFixed(3) : 0,
      PTPurityWt: !isNaN(newPTPurityWt) ? newPTPurityWt.toFixed(3) : 0,
      PTValue: !isNaN(newPTValue) ? newPTValue.toFixed(3) : 0,
      NoofStone: !isNaN(totalDiamond) ? totalDiamond.toFixed(3) : 0,
      DCarat: !isNaN(totalDiaCarat) ? totalDiaCarat.toFixed(3) : 0,
      DiamondRate: !isNaN(averageDiaRate) ? averageDiaRate.toFixed(3) : 0,
      DiamondValue: !isNaN(totalDiaValue) ? totalDiaValue.toFixed(3) : 0,
      DiamondWt: !isNaN(totalDiaWt) ? totalDiaWt.toFixed(3) : 0,
      GoMcAmount: !isNaN(GoMcAmount) ? GoMcAmount.toFixed(3) : 0,
      PTMcAmount: !isNaN(PTMcAmount) ? PTMcAmount.toFixed(3) : 0,
      ClrStnPCS: !isNaN(totalcsPcs) ? totalcsPcs.toFixed(3) : 0,
      CLSCarat: !isNaN(totalcsCarat) ? totalcsCarat.toFixed(3) : 0,
      ClrStnWt: !isNaN(totalCSWt) ? totalCSWt.toFixed(3) : 0,
      ClrStnRate: !isNaN(avgCsRate) ? avgCsRate.toFixed(3) : 0,
      CSAmount: !isNaN(totalCSAmount) ? totalCSAmount.toFixed(3) : 0,
      WastageAmt: !isNaN(GdWastageAmt) ? GdWastageAmt.toFixed(3) : 0,
      CertType,
      CertQty,
      CertRate,
      CertTaxableAmt: !isNaN(CertTaxableAmt) ? CertTaxableAmt.toFixed(3) : 0,
      CertTotal: !isNaN(CertTotal) ? CertTotal.toFixed(3) : 0,
      HMTaxableAmt: !isNaN(HMTaxableAmt) ? HMTaxableAmt.toFixed(3) : 0,
      HMTotal: !isNaN(HMTotal) ? HMTotal.toFixed(3) : 0,
      HandleAmount: !isNaN(HandleAmount) ? HandleAmount.toFixed(3) : 0,
      GNetWt: !isNaN(GNetWt) ? GNetWt.toFixed(3) : 0,
      PNetWt: !isNaN(PNetWt) ? PNetWt.toFixed(3) : 0,
      TotalValue: !isNaN(TotalValue) ? TotalValue.toFixed(3) : 0,
      GST: !isNaN(GST) ? GST.toFixed(3) : 0,
      GrandTotal: !isNaN(GrandTotal) ? GrandTotal.toFixed(3) : 0,
    }));

  }
  const memoizedInputFields = useMemo(() => inputFields, [JSON.stringify(inputFields)]);
  useEffect(() => {
    calculations();
    // console.log("Data")
  }, [memoizedInputFields, totalDiamondData, totalClrstnData, metalTypeData]);
  // totalDiamondData, inputFields, totalClrstnData, metalTypeData
  // console.log(inputFields)
  // useEffect(()=>{
  //   localStorage.setItem("inputFields", JSON.stringify(inputFields));

  // },[inputFields])
  // useEffect(()=>{

  // },[])

  useEffect(() => {
    if (
      // inputFields.WtMode === "Gold With Diamond NtWt" ||
      // inputFields.WtMode === "Gold With Diamond GsWt"
      !metalTypeData.platinum
    ) {
      // setMetalTypeData((prevData) => ({
      //   ...prevData,
      //   platinum: false,
      //   gold: true,
      //   diamond: true,
      // }));
      setInputFields((prevData) => ({
        ...prevData,
        PTWt: 0,
        PTPurity: 0,
        PTPurityWt: 0,
        PT999Rate: 0,
        PTValue: 0,
        PTMcType: null,
        PTMcRate: 0,
        PTMcAmount: 0,
        PNetWt: 0,
      }));
    }
    else if (
      // inputFields.WtMode === "Platinum With Daimond NtWt" ||
      // inputFields.WtMode === "Platinum With Diamond GsWt"
      !metalTypeData.gold
    ) {
      // setMetalTypeData((prevData) => ({
      //   ...prevData,
      //   gold: false,
      //   platinum: true,
      //   diamond: true,
      // }));
      setInputFields((prevData) => ({
        ...prevData,
        GCarat: null,
        PCS: null,
        GoldWt: null,
        GoldPurity: null,
        GoldPurityWt: null,
        Gold999Rate: null,
        GoldValue: null,
        GoMcType: null,
        GoMcRate: null,
        GoMcAmount: null,
        WastageType: null,
        WastageWeight: null,
        WastageAmt: null,
        HallMarkType: null,
        HMGST: null,
        HMQty: null,
        HMRate: null,
        HMTaxableAmt: null,
        HMTotal: null,
        GNetWt: null,
      }));
    }
    if (!metalTypeData.diamond) {
      // inputFields.WtMode === "Platinum With Gold NtWt"
      // setMetalTypeData((prevData) => ({
      //   ...prevData,
      //   diamond: false,
      //   platinum: true,
      //   gold: true,
      // }));
      setInputFields((prevData) => ({
        ...prevData,
        DiamondShape: [],
        PCS: 1,
        // GoldWt: null,
        // GoldPurity: null,
        // GoldPurityWt: null,
        // Gold999Rate: null,
        // GoldValue: null,
        // GoMcType: null,
        // GoMcRate: null,
        // GoMcAmount: null,
        // WastageType: null,
        // WastageWeight: null,
        // WastageAmt: null,
        // HallMarkType: null,
        // HMGST: null,
        // HMQty: null,
        // HMRate: null,
        // HMTaxableAmt: null,
        // HMTotal: null,
        // GNetWt: null,
        DiNoOfStones: [],
        DiCarat: [],
        NoofStone: null,
        DCarat: null,
        DiamondWt: null,
        DiamondRate: null,
        DiamondValue: null,
        CertType: null,
        CertGST: null,
        CertQty: null,
        CertRate: null,
        CertTaxableAmt: null,
        CertTotal: null,
        HandleRate: null,
        HandleAmount: null,
      }));
      setTotalDiamondData([
        {

          diamondShape: null,
          numberOfStones: 0,
          carat: 0,
          diaRate: 0,
          diaValue: 0,
          diaWt: 0,
        },
      ])
    }
    if (!metalTypeData.colorstone) {
      // inputFields.WtMode === "Platinum NtWt"
      // setMetalTypeData((prevData) => ({
      //   ...prevData,
      //   diamond: false,
      //   gold: false,
      //   platinum: true,
      // }));
      setInputFields((prevData) => ({
        ...prevData,
        csType: [],
        csPcs: [],
        csCarat: [],
        csRate: [],
        csAmt: [],
        csWt: [],
        ClrStnPCS: 0,
        CLSCarat: 0,
        ClrStnWt: 0,
        ClrStnRate: 0,
        CSAmount: 0,
        ColorStones: []


      }));
      setTotalClrstnData([
        {
          csType: null,
          csPcs: 0,
          csCarat: 0,
          csRate: 0,
          csAmt: 0,
          csWt: 0,
        },
      ])
    }

  }, [metalTypeData])

  // console.log(inputFields)
  const validateFields = (name, value, index = null) => {
    // console.log(name, value)
    // console.log(metalTypeData.gold)
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      let fieldName = name;

      // If index is provided, append it to the field name
      if (index !== null) {
        fieldName = `${name}_${index}`;
      }

      const alphanumericPattern = /^[a-zA-Z0-9]*$/;

      // Check if the field contains any non-alphanumeric characters
      if (name !== 'HUID' && value && !alphanumericPattern.test(value)) {
        // console.log(name)
        updatedErrors[fieldName] = `${name} cannot contain special characters`;
      }
      else if (["ProductName",
        "MetalType",
        "WtMode",
        "DesignNo"].includes(name) && (!value)) {
        updatedErrors[fieldName] = `${name} is required`;
      }
      // Gold Validation
      if (metalTypeData.gold && [
        'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'Gold999Rate',
        "GoMcType", "GoMcRate", "GoMcAmount", "HallMarkType",
        "HMGST", "HMQty", "HMRate", "HUID"
      ].includes(name) && (!value)) {
        updatedErrors[fieldName] = `${name} is required`;
      }

      // if (metalTypeData.diamond) {
      //   totalDiamondData.forEach((diamond, index) => {
      //     if (diamond.diamondShape === '' || diamond.diamondShape === null || diamond.diamondShape === undefined) {
      //       updatedErrors[`diamondShape_${index}`] = `Diamond shape is required`;
      //     }

      //     if (diamond.numberOfStones <= 0) {
      //       updatedErrors[`numberOfStones_${index}`] = `Number of stones must be greater than 0`;
      //     }

      //     if (diamond.carat <= 0) {
      //       updatedErrors[`carat_${index}`] = `Carat must be greater than 0`;
      //     }

      //     if (diamond.diaRate <= 0) {
      //       updatedErrors[`diaRate_${index}`] = `DiaRate must be greater than 0`;
      //     }

      //     if (diamond.diaValue <= 0) {
      //       updatedErrors[`diaValue_${index}`] = `DiaValue must be greater than 0`;
      //     }

      //     if (diamond.diaWt <= 0) {
      //       updatedErrors[`diaWt_${index}`] = `DiaWt must be greater than 0`;
      //     }

      //     // Check for special characters in Diamond fields
      //     Object.keys(diamond).forEach((key) => {
      //       const diamondValue = diamond[key];
      //       if (diamondValue && !alphanumericPattern.test(diamondValue)) {
      //         updatedErrors[`${key}_${index}`] = `${key} cannot contain special characters`;
      //       }
      //     });
      //   });
      // }

      // Validate Colorstone Fields
      // if (metalTypeData.colorstone) {
      //   totalClrstnData.forEach((cs, index) => {
      //     if (cs.csType === '' || cs.csType === null || cs.csType === undefined) {
      //       updatedErrors[`csType_${index}`] = `Colorstone type is required`;
      //     }

      //     if (cs.csPcs <= 0) {
      //       updatedErrors[`csPcs_${index}`] = `Colorstone pcs must be greater than 0`;
      //     }

      //     if (cs.csCarat <= 0) {
      //       updatedErrors[`csCarat_${index}`] = `Colorstone carat must be greater than 0`;
      //     }

      //     if (cs.csRate <= 0) {
      //       updatedErrors[`csRate_${index}`] = `Colorstone rate must be greater than 0`;
      //     }

      //     if (cs.csAmt <= 0) {
      //       updatedErrors[`csAmt_${index}`] = `Colorstone amount must be greater than 0`;
      //     }

      //     if (cs.csWt <= 0) {
      //       updatedErrors[`csWt_${index}`] = `Colorstone weight must be greater than 0`;
      //     }

      //     // Check for special characters in Colorstone fields
      //     Object.keys(cs).forEach((key) => {
      //       const csValue = cs[key];
      //       if (csValue && !alphanumericPattern.test(csValue)) {
      //         updatedErrors[`${key}_${index}`] = `${key} cannot contain special characters`;
      //       }
      //     });
      //   });
      // }

      if (metalTypeData.platinum && [
        'PTWt', 'PTPurity', 'PT999Rate', "PTMcType", "PTMcRate", "PTMcAmount"
      ].includes(name) && !value) {
        updatedErrors[fieldName] = `${name} is required`;
      }
      // Diamonds Validation
      if (metalTypeData.diamond && [
        'diamondShape', 'numberOfStones', 'carat', 'diaRate', 'diaValue', 'diaWt','CertType','CertGST','CertQty','CertRate','CertTaxableAmt','CertTotal'
      ].includes(name) && (!value || (Array.isArray(value) && value.length === 0))) {
        updatedErrors[fieldName] = `${name} is required`;
      }
     
      // Colorstones Validation
      if (metalTypeData.colorstone && [
        'csType', 'csPcs', 'csCarat', 'csRate', 'csAmt', 'csWt'
      ].includes(name) && (!value || (Array.isArray(value) && value.length === 0))) {
        updatedErrors[fieldName] = `${name} is required`;
      }
      if (name === "GNetWt" && value <= 0 && metalTypeData.gold) {
        // console.log("gm data")
        updatedErrors.GNetWt = "GNetWt cannot be negative or 0";
      }
      else if (name === "PNetWt" && value <= 0 && (!metalTypeData.gold && metalTypeData.platinum)) {
        updatedErrors.PNetWt = "PNetWt cannot be negative or 0";

      }
      else {
        delete updatedErrors[fieldName];
      }
      return updatedErrors;
    });
  };
  // console.log(errors)
  const resetFields = () => {
    // Reset input fields to initial state
    setInputFields({
      SupplierName: user || "",
      EstNo: localStorage.getItem("EstNo") || "",
      ProductName: "",
      MetalType: null,
      WtMode: null,
      DesignNo: "",
      GCarat: null,
      PCS: 1,
      GoldWt: 0,
      GoldPurity: 0,
      GoldPurityWt: 0,
      Gold999Rate: 0,
      GoldValue: 0,
      PTWt: 0,
      PTPurity: 0,
      PTPurityWt: 0,
      PT999Rate: 0,
      PTValue: 0,
      DiamondShape: [],
      DiNoOfStones: [],
      DiCarat: [],
      diaRate: [],
      diaValue: [],
      diaWt: [],
      NoofStone: 0,
      DCarat: 0,
      DiamondWt: 0,
      DiamondRate: 0,
      DiamondValue: 0,
      csType: [],
      csPcs: [],
      csCarat: [],
      csRate: [],
      csAmt: [],
      csWt: [],
      ClrStnPCS: 0,
      CLSCarat: 0,
      ClrStnWt: 0,
      ClrStnRate: 0,
      CSAmount: 0,
      GoMcType: null,
      GoMcRate: 0,
      GoMcAmount: 0,
      PTMcType: null,
      PTMcRate: 0,
      PTMcAmount: 0,
      WastageType: "Gram",
      WastageWeight: 0,
      WastageAmt: 0,
      CertType: null,
      CertGST: null,
      CertQty: 0,
      CertRate: 0,
      CertTaxableAmt: 0,
      CertTotal: 0,
      HallMarkType: null,
      HMGST: null,
      HMQty: 0,
      HMRate: 0,
      HMTaxableAmt: 0,
      HMTotal: 0,
      HandleRate: 0,
      HandleAmount: 0,
      GNetWt: 0,
      PNetWt: 0,
      TotalValue: 0,
      GST: 0,
      GrandTotal: 0,
      HUID: "",
    });
  // console.log(inputFields)
    // Reset diamond data to initial state
    setTotalDiamondData([{
      diamondShape: null,
      numberOfStones: 0,
      carat: 0,
      diaRate: 0,
      diaValue: 0,
      diaWt: 0,
    }]);
  
    // Reset colorstone data to initial state
    setTotalClrstnData([{
      csType: null,
      csPcs: 0,
      csCarat: 0,
      csRate: 0,
      csAmt: 0,
      csWt: 0,
    }]);
  
    // Reset metal type data to initial state
    setMetalTypeData({
      gold: true,
      platinum: false,
      diamond: false,
      colorstone: false,
    });
  
    // Reset error state
    setErrors({});
  
    // Reset related states
    setDiamondData(false);
    setclrStn(false);
    setLoopErr(false);
  
    // Clear any stored EstNo
    // localStorage.removeItem("EstNo");
    
    // Generate new EstNo
    // generateFormattedDateTime();
  };
  const handleInputChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    const numericFields = [
      "PCS",
      "GoldWt",
      "GoldPurity",
      "GoldPurityWt",
      "Gold999Rate",
      "GoldValue",
      "PTWt",
      "PTPurity",
      "PTPurityWt",
      "PT999Rate",
      "PTValue",
      "NoofStone",
      "DCarat",
      "DiamondWt",
      "DiamondRate",
      "DiamondValue",
      "ClrStnPCS",
      "CLSCarat",
      "ClrStnWt",
      "ClrStnRate",
      "CSAmount",
      "GoMcRate",
      "GoMcAmount",
      "PTMcRate",
      "PTMcAmount",
      "WastageWeight",
      "WastageAmt",
      "CertQty",
      "CertRate",
      "CertTaxableAmt",
      "CertTotal",
      "HMQty",
      "HMRate",
      "HMTaxableAmt",
      "HMTotal",
      "HandleRate",
      "HandleAmount",
      "GNetWt",
      "PNetWt",
      "TotalValue",
      "GST",
      "GrandTotal"
    ];

    // Define regex for numeric values and an optional single decimal point
    const numericPattern = /^[0-9]*\.?[0-9]{0,3}$/;

    // Check if the field name is in the numericFields list and the value matches the pattern
    if (numericFields.includes(name) && !numericPattern.test(value)) {
      return; // Prevent updating state if input is invalid
    }

    // Update state if input is valid
    setInputFields((prevInputFields) => ({
      ...prevInputFields,
      [name]: value,
    }));

    validateFields(name, value);

    if (errors.GNetWt) {
      validateFields("GNetWt", inputFields.GNetWt);
    }
    if (errors.PNetWt) {
      validateFields("PNetWt", inputFields.PNetWt);
    }
  };


  // const handleView=()=>{
  //   navigate("/dash")
  // }
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Initialize a new errors object
      const newErrors = {};
      const productFields = ["ProductName",
        "MetalType",
        "WtMode",
        "DesignNo"];
      productFields.forEach(key => {
        if (
          inputFields[key] === '' ||
          inputFields[key] === null ||
          inputFields[key] === undefined ||
          inputFields[key] === 0

        ) {
          newErrors[key] = `${key} is required`;
        }
      });      // 1. Validate Gold Fields
      if (metalTypeData.gold) {
        const goldFields = [
          'GCarat', 'PCS', 'GoldWt', 'GoldPurity', 'Gold999Rate',
          'GoMcType', 'GoMcRate', 'GoMcAmount', 'HallMarkType',
          'HMGST', 'HMQty', 'HMRate', 'HMTaxableAmt', 'HMTotal', 'HUID'
        ];

        goldFields.forEach(key => {
          if (
            inputFields[key] === '' ||
            inputFields[key] === null ||
            inputFields[key] === undefined ||
            inputFields[key] === 0

          ) {
            newErrors[key] = `${key} is required`;
          }
        });
      }

      // 2. Validate Platinum Fields
      if (metalTypeData.platinum) {
        const platinumFields = [
          'PTWt', 'PTPurity', 'PT999Rate',
          'PTMcType', 'PTMcRate', 'PTMcAmount'
        ];

        platinumFields.forEach(key => {
          if (
            inputFields[key] === '' ||
            inputFields[key] === null ||
            inputFields[key] === undefined ||
            inputFields[key] === 0

          ) {
            newErrors[key] = `${key} is required`;
          }
        });
      }

      // 3. Validate Diamond Fields
      if (metalTypeData.diamond) {
        // console.log("Validating Diamond Fields");
        totalDiamondData.forEach((diamond, index) => {
          if (!diamond.diamondShape) {
            newErrors[`diamondShape_${index}`] = `Diamond shape is required`;
          }

          if (
            diamond.numberOfStones === '' ||
            diamond.numberOfStones === null ||
            diamond.numberOfStones === undefined ||
            diamond.numberOfStones === 0

          ) {
            newErrors[`numberOfStones_${index}`] = `Stones is required`;
          }

          if (
            diamond.carat === '' ||
            diamond.carat === null ||
            diamond.carat === undefined ||
            diamond.carat === 0

          ) {
            newErrors[`carat_${index}`] = `Carat is required`;
          }

          // Add more validations for other diamond fields if necessary
        });
      }
      if (metalTypeData.diamond) {
        const diaFields = [
          'CertType','CertGST','CertQty','CertRate','CertTaxableAmt','CertTotal'
        ];

        diaFields.forEach(key => {
          if (
            inputFields[key] === '' ||
            inputFields[key] === null ||
            inputFields[key] === undefined ||
            inputFields[key] === 0

          ) {
            newErrors[key] = `${key} is required`;
          }
        });
      }
      // 4. Validate Colorstone Fields
      if (metalTypeData.colorstone) {
        totalClrstnData.forEach((cs, index) => {
          Object.keys(cs).forEach((key) => {
            const value = cs[key];
            if (
              cs[key] === '' ||
              cs[key] === null ||
              cs[key] === undefined ||
              cs[key] === 0
            ) {
              newErrors[`${key}_${index}`] = `${key} is required`;
            }
          })
        });

      }

      if (metalTypeData.gold && inputFields.GNetWt <= 0) {
        newErrors.GNetWt = "Invalid GNetWt";
      }

      if ((metalTypeData.platinum && !metalTypeData.gold) && inputFields.PNetWt <= 0) {
        newErrors.PNetWt = "Invalid PNetWt";
      }

      // 5. Update the errors state
      setErrors(newErrors);

      // 6. If there are any errors, stop submission
      if (Object.keys(newErrors).length > 0) {
        // console.log("Validation errors occurred:", newErrors);
        toast.error("Please fill Required Fields"); // Show error toast
        return; // Prevent form submission
      }

      // 7. Proceed with form submission
      const response = await axios.post(DIA_API, {
        inputFields,
        metalTypeData,
        totalDiamondData,
        totalClrstnData
      });

      if (response.status === 200) {
        toast.success("Data submitted successfully!", {
          onClose: () => {
            // Reload the page only after the toast message completes
            localStorage.setItem("sCode", inputFields.SupplierName);
            // window.location.reload();
            resetFields()
          }
        });

      }
    } catch (error) {
      toast.error("Error submitting data!"); // Show error toast

      // console.error("Error submitting data:", error);
      // Optionally, set a global error message here
    }
  };

  const handleAddNew = () => {
    localStorage.removeItem("EstNo")
    window.location.reload();
  }
  // console.log(errors)
  // console.log(metalTypeData)
  return (
    <DiamondContext.Provider
      value={{  inputFields, 
        setInputFields,
        handleInputChange,
        diamondData,
        setDiamondData,
        clrStn,
        setclrStn,
        handleSubmit,
        totalDiamondData,
        setTotalDiamondData,
        totalClrstnData,
        setTotalClrstnData,
        metalTypeData,
        setMetalTypeData,
        totalDatas,
        // handleView
        setLoopErr,
        handleAddNew,
        generateFormattedDateTime,
        handleCheckboxChange,
        user,
        validateFields,
        errors,
        setErrors,
        resetFields

      }}
    >
      {children}

    </DiamondContext.Provider>
  );
};
DiamondProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { DiamondProvider, DiamondContext };
