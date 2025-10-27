import React, { useState, createContext,useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import CryptoJS from 'crypto-js';
import {API}from "../../../config/configData"
const RateContext = createContext();

const RateProvider = ({ children }) => {
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [companyName, setCompanyName] = useState("")
    const [names, setNames] = useState("")
    const [signCatagory, setSignCatagory] = useState("")

    const decryptToken = (encryptedToken) => {
        const secretKey = import.meta.env.VITE_API_SECREAT_KEY;
        const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedToken;
      };
      useEffect(() => {
        const tokens = localStorage.getItem('token');
        if (tokens) {
          const Securedtoken = decryptToken(tokens);
          const decodedToken = jwtDecode(Securedtoken);
          console.log(decodedToken)
          const role = decodedToken.role
          const name = decodedToken.name
          const companyName = decodedToken.companyName
          const setSignCatagorys = decodedToken.signUpCatagory
          console.log(setSignCatagorys === "Supplier")
          setUserRole(role);
          setNames(name)
          setCompanyName(setSignCatagorys === "Supplier" ? companyName : "")
          setUser(setSignCatagorys === "Supplier" ? companyName : name);
          setMobileNo(decodedToken.MobileNo);
          setSignCatagory(setSignCatagorys)
        }
      }, []); 

    return (
        <RateContext.Provider value={{user,userRole,mobileNo,companyName,names ,signCatagory,API }}>
            {children}
        </RateContext.Provider>
    );
};

export { RateProvider, RateContext };
