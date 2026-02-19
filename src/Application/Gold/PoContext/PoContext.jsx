import {
  useState,
  createContext,
  useEffect,
  useRef,
  useContext,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { ca } from "date-fns/locale/ca";
const PoContext = createContext();
const PoProvider = ({ children }) => {
  // const navigate = useNavigate();
  const goldMelting = [
    { label: "92", value: "92" },
    { label: "75", value: "75" },
    { label: "99.9", value: "99.9" },
  ];
  const silverMelting = [
    { label: "80", value: "80" },
    { label: "75", value: "75" },
    { label: "93", value: "93" },
    { label: "95", value: "95" },
    { label: "99.9", value: "99.9" },
  ];

  const COMPANY_PRESETS = {
    // tct: {
    //   name: "THE CHENNAI TRADERS",
    //   subTitle: "",
    //   doorNo: "No.966-972",
    //   streetName: "Crosscut Road",
    //   city: "Coimbatore",
    //   state: "Tamil Nadu",
    //   pincode: "641012",
    //   phone: "0422-2490888",
    //   email: "info@sktm.in",
    //   gstNo: "33AAKFK9153A1ZJ",
    //   poPreFix: "TCT",
    // },
    spacetextiles: {
      name: "Sree Kumaran Thangamaligai",
      subTitle: "(A Unit Of Space Textiles Pvt Ltd)",
      doorNo: "A.Ku Towers",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@sktm.in",
      gstNo: "33AAKCS0757M1Z0",
      poPreFix: "STPL",
    },
    garsons: {
      name: "Sree Kumaran Thangamaligai",
      subTitle: "(A Unit of Garsons Private Limited)",
      doorNo: "A.Ku Towers",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@garsons.in",
      gstNo: "33AABCG8863D1ZP",
      poPreFix: "GPL",
    },
     tct: { 
      name: "THE CHENNAI TRADERS",
      subTitle: "",
      doorNo: "No.966-972",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@sktm.in",
      gstNo: "33AAKFK9153A1ZJ",
      poPreFix: "TCT",
    }
  };
  const Tct_COMPANY_PRESETS ={
    tct: { 
      name: "THE CHENNAI TRADERS",
      subTitle: "",
      doorNo: "No.966-972",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@sktm.in",
      gstNo: "33AAKFK9153A1ZJ",
      poPreFix: "TCT",
    }}
    const Parent_COMPANY_PRESETS= {
      spacetextiles: {
      name: "Sree Kumaran Thangamaligai",
      subTitle: "(A Unit Of Space Textiles Pvt Ltd)",
      doorNo: "A.Ku Towers",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@sktm.in",
      gstNo: "33AAKCS0757M1Z0",
      poPreFix: "STPL",
    },
    garsons: {
      name: "Sree Kumaran Thangamaligai",
      subTitle: "(A Unit of Garsons Private Limited)",
      doorNo: "A.Ku Towers",
      streetName: "Crosscut Road",
      city: "Coimbatore",
      state: "Tamil Nadu",
      pincode: "641012",
      phone: "0422-2490888",
      email: "info@garsons.in",
      gstNo: "33AABCG8863D1ZP",
      poPreFix: "GPL",
    },
  };
  const initialState = {
    from: {
      name: "",
      subTitle: "",
      parentCompany: "",
      doorNo: "",
      streetName: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      gstNo: "",
      
    },
    parentCompany: {
      name: "",
      subTitle: "",
      doorNo: "",
      streetName: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      gstNo: "",
    },
    supplier: {
      name: "",
      doorNo: "",
      streetName: "",
      city: "",
      area: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      gstNo: "",
    },
    poDetails: {
      // poNumber: "",
      poDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      mode: "purchase",
    },
    counterDetails: {
      counter: "",
      purchaseIncharge: "",
      purchaseManager: "",
    },
    delivery: {
      locationType: "direct",
      paymentType:'',
      address:
        "A.Ku Towers, Crosscut Road,Coimbatore,Tamil Nadu,641012,0422-2490888",
    },
  };
  const { userRole, user } = useContext(DashBoardContext);
  const [formData, setFormData] = useState({
    sno: "",
    product: null,
    rateFixType:"unfix",
    metal_type: userRole.includes("Gold")
      ? "Gold"
      : userRole.includes("Silver")
      ? "Silver"
      : userRole.includes("Diamond")
      ? "Diamond"
      : "",
    productName: "",
    orderType: "office",
    productType: userRole.includes("Gold")
      ? "GO"
      : userRole.includes("Diamond")
      ? "DIA"
      : userRole.includes("Silver")
      ? "Silver"
      : "GO",
    rate: "",
    pieces: "",
    grossWt: "",
    diacent: "",
    stoneWt: "",
    stoneCost: "",
    waxWt: "",
    netWt: "",
    amount: "",
    mc: "",
    photo: null,
    melting: null,
    wastage: null,
    ptMelting:null,
    pureWt: "",
    ptPureWt:'',
    edit: false,
    photoUrl: "",
    productWeightage: "Gram",
    goldwt: "",
    platinumWt: "",
    catagoryCode: "",
    categoryName: "",
    sectionCode: "",
    sectionName: "",
  
    
  });
  const [errors, setErrors] = useState({});
  const [selectedTypes, setSelectedTypes] = useState({
    Gold: userRole.includes("Diamond") ? true : false,
    Diamond: userRole.includes("Diamond") ? true : false,
    Platinum: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    if (
      (formData?.metal_type === "Silver" ||
        formData?.metal_type === "Airra" ||
        formData?.metal_type === "GA") &&
      formData?.productWeightage?.value === "Pcs"
    ) {
      const amt = parseFloat(formData.pieces) * parseFloat(formData.rate);
      setFormData((prev) => ({
        ...prev,
        amount: isNaN(amt.toFixed(3)) ? 0 : amt.toFixed(3), // This returns a string, make sure that's okay
      }));
    }
  }, [
    formData.rate,
    formData.pieces,
    formData.productWeightage,
    formData.metal_type,
  ]);

  useEffect(() => {
    if (formData.grossWt && !isNaN(formData.grossWt)) {
      const stoneWeight =
        formData.stoneWt && !isNaN(formData.stoneWt)
          ? parseFloat(formData.stoneWt)
          : 0;
      const waxWeights =
        formData.waxWt && !isNaN(formData.waxWt)
          ? parseFloat(formData.waxWt)
          : 0;
      const diamondWtInGrams = parseFloat(formData.diacent) * 0.2;
      let netWeight;
      if (
        selectedTypes.Gold &&
        selectedTypes.Diamond &&
        selectedTypes.Platinum
      ) {
        netWeight =
          parseFloat(formData.platinumWt??0) -
          parseFloat(stoneWeight??0) -
          parseFloat(waxWeights??0) -
          (isNaN(diamondWtInGrams) ? 0 : diamondWtInGrams);
      } else {
        netWeight =
          parseFloat(formData.grossWt??0) -
          parseFloat(stoneWeight??0) -
          parseFloat(waxWeights??0) -
          (isNaN(diamondWtInGrams) ? 0 : diamondWtInGrams);
      }
      setFormData((prev) => ({
        ...prev,
        netWt: netWeight.toFixed(3),
      }));
    }
  }, [
    formData.grossWt,
    formData.stoneWt,
    formData.waxWt,
    formData?.diacent ?? formData.diacent,
    formData.platinumWt,
  ]);

  // Calculate pure weight when net weight, melting, or wastage changes
  useEffect(() => {
    //console.log(formData)
    if (formData.netWt && !isNaN(formData.netWt)||formData.goldwt) {
      const netWeight = parseFloat(formData.netWt);
      const goldNetWt=parseFloat(formData.goldwt)
      const melting = formData.melting?.value
        ? parseFloat(formData.melting.value)
        : 0;
      const wastage = formData.wastage?.value
        ? parseFloat(formData.wastage.value)
        : 0;
        let pureWt
        if(selectedTypes.Platinum&&selectedTypes.Gold){
          pureWt=goldNetWt*(melting/100)
        }
        else {
       pureWt = netWeight * ((melting + wastage) / 100);
        }
      
      setFormData((prev) => ({
        ...prev,
        pureWt: pureWt.toFixed(3),
      }));
    }
  }, [
    formData.netWt,
    formData.melting?.value,
    formData.wastage?.value,
    formData.melting,
    formData.wastage,
    formData.goldwt,
    selectedTypes.Gold,selectedTypes.Platinum
  ]);

  // Function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to hide snackbar
  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };
  //console.log(formData);
  return (
    <PoContext.Provider
      value={{
        formData,
        setFormData,
        snackbar,
        setSnackbar,
        hideSnackbar,
        showSnackbar,
        goldMelting,
        silverMelting,
        errors,
        setErrors,
        selectedTypes,
        setSelectedTypes,COMPANY_PRESETS,initialState,Tct_COMPANY_PRESETS,Parent_COMPANY_PRESETS
      }}
    >
      {children}
    </PoContext.Provider>
  );
};
PoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export { PoProvider, PoContext };
