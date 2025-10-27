import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

// Create a new context
const DiamondContext = createContext();

// DiamondProvider component to provide the context value
const DiamondProvider = ({ children }) => {
  const navigate = useNavigate();

  const [inputFields, setInputFields] = useState({
    RefNo: null,
    ProductName: null,
    MetalType: null,
    WtMode: null,
    DesignNo: null,
    GCarat: null,
    PCS: null,
    GoldWt: null,
    GoldPurity: null,
    GoldPurityWt: null,
    Gold999Rate: null,
    GoldValue: null,
    PTWt: null,
    PTPurity: null,
    PTPurityWt: null,
    PT999Rate: null,
    PTValue: 0,
    DiamondShape: [],
    DiNoOfStones: [],
    DiCarat: [],
    diaRate: [],
    diaValue: [],
    diaWt: [],
    NoofStone: null,
    DCarat: null,
    DiamondWt: null,
    DiamondRate: null,
    DiamondValue: null,
    csType: [],
    csPcs: [],
    csCarat: [],
    csRate: [],
    csAmt: [],
    csWt: [],
    ClrStnPCS: null,
    CLSCarat: null,
    ClrStnWt: null,
    ClrStnRate: null,
    CSAmount: null,
    GoMcType: null,
    GoMcRate: null,
    GoMcAmount: null,
    PTMcType: null,
    PTMcRate: null,
    PTMcAmount: 0,
    WastageType: null,
    WastageWeight: null,
    WastageAmt: null,
    CertType: null,
    CertGST: null,
    CertQty: null,
    CertRate: null,
    CertTaxableAmt: null,
    CertTotal: null,
    HallMarkType: null,
    HMGST: null,
    HMQty: null,
    HMRate: null,
    HMTaxableAmt: null,
    HMTotal: null,
    HandleRate: null,
    HandleAmount: null,
    GNetWt: null,
    PNetWt: null,
    TotalValue: null,
    GST: null,
    GrandTotal: null,
    HUID: "",
  });

  const [totalDatas, setTotalDatas] = useState([]);
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
  const [metalTypeData, setMetalTypeData] = useState({
    gold: true,
    platinum: true,
    diamond: true,
  });
  const [loopErr, setLoopErr] = useState(false);

  useEffect(() => {
    localStorage.setItem("refNo", inputFields.RefNo ?? "");
  }, [inputFields.RefNo]);

  useEffect(() => {
    if (loopErr) {
      let DiamondShape = [];
      let numberOfStones = [];
      let carat = [];
      let diaRate = [];
      let diaValue = [];
      let diaWt = [];
      totalDiamondData.forEach((shape) => {
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
      totalClrstnData.forEach((shape) => {
        csType.push(shape.csType);
        csPcs.push(shape.csPcs);
        csCarat.push(shape.csCarat);
        csRate.push(shape.csRate);
        csAmt.push(shape.csAmt);
        csWt.push(shape.csWt);
      });

      const newGoldPurityWt = (parseFloat(inputFields.GoldWt) * parseFloat(inputFields.GoldPurity ?? 0)) / 100;
      const newGoldValue = (parseFloat(inputFields.Gold999Rate) * newGoldPurityWt) ?? 0;
      const newPTPurityWt = (parseFloat(inputFields.PTWt) * parseFloat(inputFields.PTPurity ?? 0)) / 100;
      const GdKaratValue = (parseFloat(inputFields.Gold999Rate) / 24) * parseFloat(inputFields.GCarat ?? 0);
      const newPTValue = (parseFloat(inputFields.PT999Rate) * newPTPurityWt) ?? 0;

      const totalDiamond = totalDiamondData.reduce((acc, curr) => acc + parseInt(curr.numberOfStones ?? 0, 10), 0);
      const totalDiaCarat = totalDiamondData.reduce((acc, curr) => acc + parseFloat(curr.carat ?? 0, 10), 0);
      const totalDiaRate = totalDiamondData.reduce((acc, curr) => acc + parseInt(curr.diaRate ?? 0) * parseFloat(curr.carat ?? 0), 0);
      const averageDiaRate = totalDiaRate / (totalDiaCarat * 100);
      const totalDiaValue = totalDiamondData.reduce((acc, curr) => acc + parseInt(curr.diaValue ?? 0, 10), 0);
      const totalDiaWt = totalDiamondData.reduce((acc, curr) => acc + parseFloat(curr.diaWt ?? 0, 10), 0);

      const totalcsPcs = totalClrstnData.reduce((acc, curr) => acc + parseInt(curr.csPcs ?? 0, 10), 0);
      const totalCSRate = totalClrstnData.reduce((acc, curr) => acc + parseInt(curr.csRate ?? 0) * parseFloat(curr.csCarat ?? 0), 0);
      const totalcsCarat = totalClrstnData.reduce((acc, curr) => acc + parseFloat(curr.csCarat ?? 0, 10), 0);
      const avgCsRate = totalCSRate / (totalcsCarat * 100);
      const totalCSAmount = totalClrstnData.reduce((acc, curr) => acc + parseInt(curr.csAmt ?? 0, 10), 0);
      const totalCSWt = totalClrstnData.reduce((acc, curr) => acc + parseFloat(curr.csWt ?? 0, 10), 0);

      const GdWastageAmt = parseFloat(inputFields.WastageWeight ?? 0) * GdKaratValue;

      const CertTaxableAmt = (parseFloat(inputFields.CertQty ?? 0) * parseFloat(inputFields.CertRate ?? 0) * parseFloat(inputFields.DCarat ?? 0)) ?? 0;
      const CertTotal = CertTaxableAmt + CertTaxableAmt * (parseFloat(inputFields.CertGST ?? 0) / 100);
      const HMTaxableAmt = (parseFloat(inputFields.HMQty ?? 0) * parseFloat(inputFields.HMRate ?? 0)) ?? 0;
      const HMTotal = HMTaxableAmt + HMTaxableAmt * (parseFloat(inputFields.HMGST ?? 0) / 100);

      let GoMcAmount;
      if (inputFields.GoMcType === "Gram") {
        GoMcAmount = parseFloat(inputFields.GoMcRate ?? 0) * parseFloat(inputFields.GNetWt ?? 0);
      } else if (inputFields.GoMcType === "Pcs") {
        GoMcAmount = parseFloat(inputFields.GoMcRate ?? 0);
      }

      let PTMcAmount;
      if (inputFields.PTMcType === "Gram") {
        PTMcAmount = parseFloat(inputFields.PTMcRate ?? 0) * parseFloat(inputFields.PNetWt ?? 0);
      } else if (inputFields.PTMcType === "Pcs") {
        PTMcAmount = parseFloat(inputFields.PTMcRate ?? 0);
      }

      const HandleAmount = parseFloat(inputFields.HandleRate ?? 0) * totalDiaCarat;
      const GNetWt = (parseFloat(inputFields.GoldWt ?? 0) - parseFloat(inputFields.DiamondWt ?? 0) - parseFloat(inputFields.ClrStnWt ?? 0)) ?? 0;
      const PNetWt = parseFloat(inputFields.PTWt ?? 0);

      const calculateTotalValue = (...values) => values.reduce((acc, curr) => acc + (isNaN(curr) || curr === undefined ? 0 : curr), 0);

      const TotalValue = calculateTotalValue(
        parseFloat(newGoldValue ?? 0),
        parseFloat(newPTValue ?? 0),
        parseFloat(totalDiaValue ?? 0),
        parseFloat(totalCSAmount ?? 0),
        parseFloat(GdWastageAmt ?? 0),
        parseFloat(CertTotal ?? 0),
        parseFloat(HMTotal ?? 0),
        parseFloat(GoMcAmount ?? 0),
        parseFloat(PTMcAmount ?? 0),
        parseFloat(HandleAmount ?? 0)
      );

      const GST = parseFloat((parseFloat(TotalValue ?? 0) * 3) / 100);

      const GrandTotal = parseFloat(TotalValue ?? 0) + GST;

      setInputFields((prev) => ({
        ...prev,
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
        GoldPurityWt: newGoldPurityWt,
        GoldValue: newGoldValue,
        PTPurityWt: newPTPurityWt,
        PTValue: newPTValue,
        NoofStone: totalDiamond,
        DCarat: totalDiaCarat,
        DiamondWt: totalDiaWt,
        DiamondRate: averageDiaRate,
        DiamondValue: totalDiaValue,
        ClrStnPCS: totalcsPcs,
        ClrStnRate: avgCsRate,
        CLSCarat: totalcsCarat,
        ClrStnWt: totalCSWt,
        CSAmount: totalCSAmount,
        WastageAmt: GdWastageAmt,
        CertTaxableAmt,
        CertTotal,
        HMTaxableAmt,
        HMTotal,
        GoMcAmount,
        PTMcAmount,
        HandleAmount,
        GNetWt,
        PNetWt,
        TotalValue,
        GST,
        GrandTotal,
      }));

      setLoopErr(false);
    }
  }, [loopErr, totalDiamondData, totalClrstnData, inputFields]);

  const handleSaveClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/app/diamondregister",
        inputFields
      );

      if (response.status === 200) {
        setTotalDatas((prevData) => [...prevData, inputFields]);
        setInputFields((prevFields) => ({
          ...prevFields,
          ProductName: "",
          MetalType: "",
          WtMode: "",
          DesignNo: "",
          GCarat: "",
          PCS: "",
          GoldWt: "",
          GoldPurity: "",
          GoldPurityWt: "",
          Gold999Rate: "",
          GoldValue: "",
          PTWt: "",
          PTPurity: "",
          PTPurityWt: "",
          PT999Rate: "",
          PTValue: "",
          DiamondShape: [],
          DiNoOfStones: [],
          DiCarat: [],
          diaRate: [],
          diaValue: [],
          diaWt: [],
          NoofStone: "",
          DCarat: "",
          DiamondWt: "",
          DiamondRate: "",
          DiamondValue: "",
          csType: [],
          csPcs: [],
          csCarat: [],
          csRate: [],
          csAmt: [],
          csWt: [],
          ClrStnPCS: "",
          CLSCarat: "",
          ClrStnWt: "",
          ClrStnRate: "",
          CSAmount: "",
          GoMcType: "",
          GoMcRate: "",
          GoMcAmount: "",
          PTMcType: "",
          PTMcRate: "",
          PTMcAmount: "",
          WastageType: "",
          WastageWeight: "",
          WastageAmt: "",
          CertType: "",
          CertGST: "",
          CertQty: "",
          CertRate: "",
          CertTaxableAmt: "",
          CertTotal: "",
          HallMarkType: "",
          HMGST: "",
          HMQty: "",
          HMRate: "",
          HMTaxableAmt: "",
          HMTotal: "",
          HandleRate: "",
          HandleAmount: "",
          GNetWt: "",
          PNetWt: "",
          TotalValue: "",
          GST: "",
          GrandTotal: "",
        }));

        navigate("/mainpage");
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <DiamondContext.Provider
      value={{
        inputFields,
        setInputFields,
        handleSaveClick,
        setLoopErr,
        totalDiamondData,
        setTotalDiamondData,
        totalClrstnData,
        setTotalClrstnData,
        setMetalTypeData,
        metalTypeData,
      }}
    >
      {children}
    </DiamondContext.Provider>
  );
};

// Validate the type of props
DiamondProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DiamondContext, DiamondProvider };


import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Components/config";
import PropTypes from "prop-types";
import axios from "axios";

// Create a new context
const DiamondContext = createContext();

// DiamondProvider component to provide the context value
const DiamondProvider = ({ children }) => {
  const navigate = useNavigate();

  const [EstNo, setEstNo] = useState(localStorage.getItem("RefNo"));

  const [inputFields, setInputFields] = useState({
    SupplierName: localStorage.getItem("SupplierName") ?? "",
    EstNo: localStorage.getItem("EstNo"),
    RefNo: null,
    ProductName: "",
    MetalType: null,
    WtMode: null,
    DesignNo: "",
    GCarat: null,
    PCS: 0,
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

  const [totalDatas, setTotalDatas] = useState([]);
  const [diamondData, setDiamondData] = useState(false);
  const [clrStn, setClrStn] = useState(false);
  const [loopErr, setLoopErr] = useState(false);
  const [totalDiamondData, setTotalDiamondData] = useState([
    {
      diamondShape: 0,
      numberOfStones: 0,
      carat: 0,
      diaRate: 0,
      diaValue: 0,
      diaWt: 0,
    },
  ]);
  const [totalClrstnData, setTotalClrstnData] = useState([
    {
      csType: 0,
      csPcs: 0,
      csCarat: 0,
      csRate: 0,
      csAmt: 0,
      csWt: 0,
    },
  ]);
  const [metalTypeData, setMetalTypeData] = useState({
    gold: true,
    platinum: true,
    diamond: true,
  });

  const updateFieldsForWtMode = (wtMode) => {
    const metalTypeUpdates = {
      platinum: true,
      gold: true,
      diamond: true,
    };

    const inputFieldUpdates = {
      PTWt: 0,
      PTPurity: 0,
      PTPurityWt: 0,
      PT999Rate: 0,
      PTValue: 0,
      PTMcType: 0,
      PTMcRate: 0,
      PTMcAmount: 0,
      PNetWt: 0,
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
      DiamondShape: [],
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
    };

    if (
      wtMode === "Gold With Diamond NtWt" ||
      wtMode === "Gold With Diamond GsWt"
    ) {
      metalTypeUpdates.platinum = false;
      setMetalTypeData(metalTypeUpdates);
      setInputFields((prevData) => ({
        ...prevData,
        PTWt: 0,
        PTPurity: 0,
        PTPurityWt: 0,
        PT999Rate: 0,
        PTValue: 0,
        PTMcType: 0,
        PTMcRate: 0,
        PTMcAmount: 0,
        PNetWt: 0,
      }));
    } else if (
      wtMode === "Platinum With Daimond NtWt" ||
      wtMode === "Platinum With Diamond GsWt"
    ) {
      metalTypeUpdates.gold = false;
      setMetalTypeData(metalTypeUpdates);
      setInputFields((prevData) => ({
        ...prevData,
        ...inputFieldUpdates,
      }));
    } else if (wtMode === "Platinum With Gold NtWt") {
      metalTypeUpdates.diamond = false;
      setMetalTypeData(metalTypeUpdates);
      setInputFields((prevData) => ({
        ...prevData,
        DiamondShape: [],
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
    } else if (wtMode === "Platinum NtWt") {
      metalTypeUpdates.gold = false;
      metalTypeUpdates.diamond = false;
      setMetalTypeData(metalTypeUpdates);
      setInputFields((prevData) => ({
        ...prevData,
        ...inputFieldUpdates,
      }));
    } else if (
      wtMode === "Platinum With Gold Diamond NtWt" ||
      wtMode === "Platinum With Gold Diamond GsWt"
    ) {
      setMetalTypeData(metalTypeUpdates);
    }
  };

  // Effect to run the updateFieldsForWtMode function based on inputFields.WtMode
  useEffect(() => {
    if (inputFields.WtMode) {
      updateFieldsForWtMode(inputFields.WtMode);
    }
  }, [inputFields.WtMode]);

  useEffect(() => {
    function generateFormattedDateTime() {
      const now = new Date();
      const isoString = now.toISOString();
      const formattedDateTime = isoString
        .replace(/-/g, '')
        .replace(/:/g, '')
        .replace(/\.\d+Z$/, match => match.replace('.', 'T'))
        .replace('T', 'T');
      localStorage.setItem("EstNo", formattedDateTime);
      setInputFields((prevFields) => ({
        ...prevFields,
        EstNo: localStorage.getItem("EstNo"),
      }));
    }

    if (!localStorage.getItem("EstNo")) {
      generateFormattedDateTime();
    }
  }, [inputFields.SupplierName, localStorage.getItem("EstNo")]);

  useEffect(() => {
    if (loopErr) {
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

      let totalDiaCarat = 0;
      let totalDiaWt = 0;
      let totalDiamond = 0;
      totalDiamondData.map((totalD) => {
        totalDiaCarat += parseFloat(totalD.carat);
        totalDiaWt += parseFloat(totalD.diaWt);
        totalDiamond += parseFloat(totalD.numberOfStones);
      });

      let csType = [];
      let csPcs = [];
      let csCarat = [];
      let csRate = [];
      let csAmt = [];
      let csWt = [];

      totalClrstnData.map((clrstn) => {
        csType.push(clrstn.csType);
        csPcs.push(clrstn.csPcs);
        csCarat.push(clrstn.csCarat);
        csRate.push(clrstn.csRate);
        csAmt.push(clrstn.csAmt);
        csWt.push(clrstn.csWt);
      });

      let totalcsCarat = 0;
      let totalCSWt = 0;
      let totalCSAmount = 0;
      let totalcsPcs = 0;
      totalClrstnData.map((totalcs) => {
        totalcsCarat += parseFloat(totalcs.csCarat);
        totalCSWt += parseFloat(totalcs.csWt);
        totalCSAmount += parseFloat(totalcs.csAmt);
        totalcsPcs += parseFloat(totalcs.csPcs);
      });

      let avgCsRate = totalCSAmount / totalcsCarat;
      const newGoldPurityWt = (inputFields.GoldPurity * inputFields.GoldWt) / 100;
      const newGoldValue = newGoldPurityWt * parseFloat(inputFields.Gold999Rate);

      const newPTPurityWt = (inputFields.PTPurity * inputFields.PTWt) / 100;
      const newPTValue = newPTPurityWt * parseFloat(inputFields.PT999Rate);

      const GdWastageAmt =
        inputFields.WastageType === "Percent"
          ? (inputFields.WastageWeight * inputFields.Gold999Rate) / 100
          : inputFields.WastageWeight * inputFields.Gold999Rate;

      const HMTaxableAmt = inputFields.HMQty * inputFields.HMRate;
      const HMTotal = HMTaxableAmt + (HMTaxableAmt * inputFields.HMGST) / 100;

      let GoMcAmount = 0;
      if (inputFields.GoMcType === "Percent") {
        GoMcAmount = (parseFloat(inputFields.GoMcRate) * newGoldPurityWt) / 100;
      } else if (inputFields.GoMcType === "PerGram") {
        GoMcAmount = parseFloat(inputFields.GoMcRate) * newGoldPurityWt;
      } else if (inputFields.GoMcType === "Pcs") {
        GoMcAmount = parseFloat(inputFields.GoMcRate);
      }

      let PTMcAmount = 0;
      if (inputFields.PTMcType === "Percent") {
        PTMcAmount = (parseFloat(inputFields.PTMcRate) * newPTPurityWt) / 100;
      } else if (inputFields.PTMcType === "PerGram") {
        PTMcAmount = parseFloat(inputFields.PTMcRate) * parseFloat(inputFields.PNetWt);
      } else if (inputFields.PTMcType === "Pcs") {
        PTMcAmount = parseFloat(inputFields.PTMcRate);
      }

      const CertTaxableAmt = +inputFields.CertQty * +inputFields.CertRate;
      const CertTotal = CertTaxableAmt + CertTaxableAmt * (+inputFields.CertGST / 100);

      let newTotalValue = newGoldValue + newPTValue + totalDiaValue + totalCSAmount + GoMcAmount + PTMcAmount + GdWastageAmt;
      let newGST = newTotalValue * 3 / 100;
      let newGrandTotal = newTotalValue + newGST + CertTotal + HMTotal + parseFloat(inputFields.HandleAmount);

      setInputFields((prevFields) => ({
        ...prevFields,
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
        GoldPurityWt: newGoldPurityWt,
        GoldValue: newGoldValue,
        PTPurityWt: newPTPurityWt,
        PTValue: newPTValue,
        DCarat: totalDiaCarat,
        DiamondWt: totalDiaWt,
        DiamondRate: avgCsRate,
        DiamondValue: totalDiaValue,
        NoofStone: totalDiamond,
        CLSCarat: totalcsCarat,
        ClrStnWt: totalCSWt,
        CSAmount: totalCSAmount,
        ClrStnRate: avgCsRate,
        ClrStnPCS: totalcsPcs,
        WastageAmt: GdWastageAmt,
        HMTaxableAmt: HMTaxableAmt,
        HMTotal: HMTotal,
        CertTaxableAmt: CertTaxableAmt,
        CertTotal: CertTotal,
        GoMcAmount: GoMcAmount,
        PTMcAmount: PTMcAmount,
        GNetWt: newGoldPurityWt,
        PNetWt: newPTPurityWt,
        TotalValue: newTotalValue,
        GST: newGST,
        GrandTotal: newGrandTotal,
      }));
    }
  }, [totalDiamondData, totalClrstnData, loopErr]);

  // Function to update the input fields
  const updateInputFields = (newFields) => {
    setInputFields((prevFields) => ({
      ...prevFields,
      ...newFields,
    }));
  };

  // Function to handle navigation and save input fields to localStorage
  const navigateToDetails = () => {
    Object.keys(inputFields).forEach((key) => {
      localStorage.setItem(key, inputFields[key]);
    });
    navigate("/details");
  };

  // Provide the context value to child components
  return (
    <DiamondContext.Provider
      value={{
        inputFields,
        updateInputFields,
        navigateToDetails,
        totalDatas,
        setTotalDatas,
        diamondData,
        setDiamondData,
        clrStn,
        setClrStn,
        totalDiamondData,
        setTotalDiamondData,
        totalClrstnData,
        setTotalClrstnData,
        metalTypeData,
        setMetalTypeData,
        loopErr,
        setLoopErr,
      }}
    >
      {children}
    </DiamondContext.Provider>
  );
};

// Prop types validation
DiamondProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DiamondContext, DiamondProvider };
