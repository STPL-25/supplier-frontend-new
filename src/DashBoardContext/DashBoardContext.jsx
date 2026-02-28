import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { LOGG_API,  } from "../config/configData";
import { sectionComponents, sectionImages } from "./Data";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";
const DashBoardContext = createContext();
const DashBoardContextProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isLoggin, setIsLoggin] = useState(false);
  const [mobileNo, setMobileNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [names, setNames] = useState("");
  const [logginToken, setLogginToken] = useState("");
  const [tk, setTk] = useState("");
  const [activeComponent, setActiveComponent] = useState("");
  const [roleData,setRoleData]=useState("")
  const [suppCode,setSuppCode]=useState("")

  const decryptToken = (encryptedToken) => {
    const secretKey = import.meta.env.VITE_API_SECREAT_KEY;
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken;
  };
  console.log(logginToken);
 
 const fetchSupplierData = async (companyname) => {
  try {
     const supplierData = await axios.get(`${LOGG_API}/get_supplier_details/${companyname}`);
  console.log("supplier",supplierData)
  return supplierData;
  } catch (error) {
    console.log(error)
  }
 
 }
   let tokens = localStorage.getItem("token");

  useEffect(() => {
    const initializeUser = async () => {
          if (tokens || logginToken) {
        try {
          const logToken = logginToken || tokens;
          const Securedtoken = decryptToken(logToken);
          const decodedToken = jwtDecode(Securedtoken);
          const role = decodedToken.role;
          const name = decodedToken.name;
          const companyName = decodedToken.companyName;
          const setSignCatagorys = decodedToken.signUpCatagory;
          const managerRoleData=decodedToken.roleData
          let supplierData
          console.log("companyName",companyName)
          if(companyName){
           supplierData = await fetchSupplierData(companyName);
          }
          setSuppCode(supplierData?.data?.Suppcode||"")
          setTk(Securedtoken);
          setUserRole(role);
          setNames(name);
          setCompanyName(setSignCatagorys === "Supplier" ? companyName : "");
          setUser(setSignCatagorys === "Supplier" ? companyName : name);
          setMobileNo(decodedToken.MobileNo);
          setRoleData(managerRoleData)
        } catch (error) {
          console.error("Error initializing user:", error);
        }
      }
    };
    initializeUser();
  }, [logginToken, tokens]);
  console.log(companyName, names, userRole,roleData);
  const handleLogOut = async () => {
    try {
      const tokens = localStorage.getItem("token");
      if (tokens) {
        const Securedtoken = decryptToken(tokens);
        const decodedToken = jwtDecode(Securedtoken);
        const mobileNo = decodedToken.MobileNo;
        const response = await axios.post(`${LOGG_API}/logout`, { mobileNo });
        if (response.status === 200) {
          localStorage.clear();
          window.location.href = "/";
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const [activeSection, setActiveSection] = useState(() => {
    const storedSection = localStorage.getItem("activeSection");
    return storedSection;
  });
console.log(names);
  return (
    <DashBoardContext.Provider
      value={{
        token,
        setToken,
        user,
        companyName,
        names,
        mobileNo,
        setUser,
        userRole,
        setUserRole,
        isLoggin,
        setIsLoggin,
        handleLogOut,
        LOGG_API,
        activeSection,
        setActiveSection,
        decryptToken,
        setLogginToken,
        sectionComponents,
        sectionImages,
        activeComponent, setActiveComponent,
        roleData,suppCode
        //  kycUserData,setApprovedData, statusUpdate,
      }}
    >
      {children}
    </DashBoardContext.Provider>
  );
};
DashBoardContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DashBoardContext, DashBoardContextProvider };
