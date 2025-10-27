import PropTypes from 'prop-types';

const CachedComponent = ({ componentKey, children, useCachedState }) => {
    return React.cloneElement(children, { useCachedState, componentKey });
  };
  
  CachedComponent.propTypes = {
    componentKey: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
    useCachedState: PropTypes.func.isRequired,
  };

  // import { createContext, useState, useEffect, useContext } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import { LOGG_API, KYC_API, API } from "../config/configData.js"
// import { DiamondProvider } from '../Application/Diamond/DiamondGridContext/DiamondGridContext';
// import { KycDataProvider, KycContext } from "../Application/KYC/KycContext/KycContex";
// import { RateProvider } from "../Application/RateConfirmation/Context/Ratecontext.jsx";
// import { useQuery } from "@tanstack/react-query";
// import ContentLoader from "./ContentLoader.jsx";
// import SupplierOrder from "../Application/SupplierOrder/SupplierOrder.jsx";
// import {
//   DiamondMasterPage, BankingInformation, ContactInformation,
//   StatutaoryInformation, TradeInformation, SupplierKYC, CombinationGrid, DiamondAdmin, SupplierReport,
//   MasterApproval, DiamondLists, adminIcon, masterApprovalIcon, masterpage, list, entry, report, diamondadmin,
//   Error, Admin, kycicon, statutatoryimg, bankingicon, contacticon, businessicon, tradeicon, KycView, KycViewImage, KycApproval, FormToCredit,
//   Report, Consolidate, Document, SearchBar, CreditNoteAndDebitNote, SupDebitNoteAndCreditNote, rateacceptImage, debitCreditNoteImage, SupplierIndReport,
//    ImageCard, SupImageCard,SupDebitCreditReport,debitcreditViewImage,KycViewAccepted,GoldProductForm,GoldPoCreation,poentry,pocreation

// } from "../Components/ComponentRoutes.js"
// import {withStatePersistence} from "./withStatePersistence.jsx"
// import { jwtDecode } from "jwt-decode";
// import CryptoJS from 'crypto-js';

// const DashBoardContext = createContext();

// const DashBoardContextProvider = ({ children }) => {
//   const [token, setToken] = useState("");
//   const [user, setUser] = useState("");
//   const [userRole, setUserRole] = useState("");
//   const [isLoggin, setIsLoggin] = useState(false);
//   const [mobileNo, setMobileNo] = useState("");
//   const [approvedData, setApprovedData] = useState(false);
//   const [statusUpdate, setStatusUpdate] = useState(false);
//   const [companyName, setCompanyName] = useState("")
//   const [names, setNames] = useState("")
//   const [signCatagory, setSignCatagory] = useState("")
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [logginToken,setLogginToken]=useState('')
//   const [tk, setTk] = useState("");

 
//   const checkTokenExpiry = () => {
//     if (tk) {
//       const decodedToken = jwtDecode(tk);
//       const currentTime = Date.now() / 1000;
//       if (decodedToken.exp < currentTime) {
//         alert("Session expired. Please login again.");
//         handleLogOut();
//       }
//     }
//   };

//   const decryptToken = (encryptedToken) => {
//     const secretKey = import.meta.env.VITE_API_SECREAT_KEY;
//     const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
//     const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
//     return decryptedToken;
//   };
// console.log(logginToken)
//   useEffect(() => {
//     const intervalId = setInterval(checkTokenExpiry, 3600000);
//     return () => clearInterval(intervalId);
//   }, []);
//   let tokens = localStorage.getItem('token');

//   useEffect(() => {
//     const initializeUser = async () => {
//       setIsLoading(true);
      
//       if (tokens || logginToken) {
//         try {
//           const logToken = logginToken || tokens;
//           const Securedtoken = decryptToken(logToken);
//           const decodedToken = jwtDecode(Securedtoken);
          
//           const role = decodedToken.role;
//           const name = decodedToken.name;
//           const companyName = decodedToken.companyName;
//           const setSignCatagorys = decodedToken.signUpCatagory;
          
//           setTk(Securedtoken);
//           setUserRole(role);
//           setNames(name);
//           setCompanyName(setSignCatagorys === "Supplier" ? companyName : "");
//           setUser(setSignCatagorys === "Supplier" ? companyName : name);
//           setMobileNo(decodedToken.MobileNo);
//           setSignCatagory(setSignCatagorys);
//           setIsInitialized(true);
//         } catch (error) {
//           console.error("Error initializing user:", error);
//         }
//       }
//       setIsLoading(false);
//     };

//     initializeUser();
//   }, [logginToken,tokens]);
//   console.log(companyName, names, userRole)
//   const handleLogOut = async () => {
//     try {
//       const tokens = localStorage.getItem('token');
//       if (tokens) {
//         const Securedtoken = decryptToken(tokens);
//         const decodedToken = jwtDecode(Securedtoken);
//         const mobileNo = decodedToken.MobileNo;
//         const response = await axios.post(`${LOGG_API}/logout`, { mobileNo });
//         if (response.status === 200) {
//           localStorage.clear();
//           window.location.href = "/";
//         }
//       }
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const fetchUserKycData = async () => {
//     try {
//       const tokens = localStorage.getItem('token');

//       const logToken = logginToken || tokens;
//       const Securedtoken = decryptToken(logToken);
//       const decodedToken = jwtDecode(Securedtoken);
     
//       const companyName = decodedToken.companyName;
//       const response = await axios.get(`${KYC_API}/getkycofsupplier/${companyName}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching KYC data:", error);
//       throw error;
//     }
//   };

//   const { data: kycUserData, isLoading: isKycLoading } = useQuery({
//     queryKey: ['kycData', companyName],
//     queryFn: fetchUserKycData,
//     enabled: Boolean(companyName && (userRole === 'Diamond-Supplier' || userRole === 'Gold-Supplier')),
//     staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
//     cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
//     refetchOnWindowFocus: false, // Prevent refetch on window focus
//     refetchOnMount: false, // Prevent refetch on component mount
//     refetchOnReconnect: false, // Prevent refetch on reconnection
//     retry: 1, // Only retry once on failure
//     onError: (error) => {
//       console.error("Error fetching KYC data:", error);
//     }
//   });
// console.log(kycUserData)
// const sectionComponents = {
//   "Rate Master": <DiamondProvider><DiamondMasterPage /></DiamondProvider>,
//   "Diamond Data Entry": <DiamondProvider><CombinationGrid /></DiamondProvider>,
//   "Diamond View Lists": <DiamondProvider><DiamondLists /></DiamondProvider>,
//   "Supplier Report": <DiamondProvider><SupplierReport /></DiamondProvider>,
//   "Supplier Credit Note And Debit Note": <SupDebitNoteAndCreditNote />,
//   "Kyc View": <KycDataProvider><KycView /></KycDataProvider>,
//   "Business Address": <KycDataProvider><SupplierKYC /></KycDataProvider>,
//   "Principal Address": <KycDataProvider><StatutaoryInformation /></KycDataProvider>,
//   "Banking Information": <KycDataProvider><BankingInformation /></KycDataProvider>,
//   "Contact Information": <KycDataProvider><ContactInformation /></KycDataProvider>,
//   "Trade Information": <KycDataProvider><TradeInformation /></KycDataProvider>,
//   "Rate Data Entry": <FormToCredit />,
//   "Report": <RateProvider><Report /></RateProvider>,
//   "Consolidate Report": <Consolidate />,
//   "Gold PO Entry": <GoldProductForm />,
//   "Gold PO Creation": <GoldPoCreation />,
//   // "Print": <Document />,
//   "Credit Note And Debit Note": <CreditNoteAndDebitNote />,
//   "View Credit Note And Debit Note": <ImageCard />,
//   "Kyc Approval": <KycDataProvider><KycApproval /></KycDataProvider>,
//   "Approved KYCs": <KycDataProvider><KycViewAccepted /></KycDataProvider>,
//   "Rate Accept": <RateProvider><SearchBar /></RateProvider>,
//   "View Report": <RateProvider><SupplierIndReport /></RateProvider>,
//   "View Debit Note And Credit Note": <SupImageCard />,
//   "Supplier Order": <SupplierOrder />,
//   "Master Approval": <MasterApproval />,
//   "Diamond Lists Approve": <DiamondAdmin />,
//   "Admin Page": <Admin />
// };  
// const sectionImages = {
//   "Rate Master": masterpage,
//   "Diamond Data Entry": entry,
//   "Diamond View Lists": list,
//   "Supplier Report": report,
//   "Supplier Credit Note And Debit Note": debitCreditNoteImage,
//   "View Credit Note And Debit Note": debitcreditViewImage,
//   "Credit Note And Debit Note":debitCreditNoteImage,
//   "Kyc View": KycViewImage,
//   "Business Address": kycicon,
//   "Principal Address": statutatoryimg,
//   "Banking Information": bankingicon,
//   "Contact Information": contacticon,
//   "Trade Information": tradeicon,
//   "Rate Data Entry": rateacceptImage,
//   "Report": statutatoryimg,
//   "Consolidate Report": bankingicon,
//   "Gold PO Entry": poentry,
//   "Gold PO Creation": pocreation,
//   "Print": contacticon,
//   "Kyc Approval": tradeicon,
//   "Approved KYCs": debitcreditViewImage,
//   "Rate Accept": rateacceptImage,
//   "View Report": bankingicon,
//   "Supplier Order": businessicon,
//   "Master Approval": masterApprovalIcon,
//   "Diamond Lists Approve": diamondadmin,
//   "Admin Page": adminIcon,
// };
// const DiaSupplierDatas = [
//     { element: 'Rate Master', img: masterpage },
//     { element: 'Diamond Data Entry', img: entry },
//     { element: 'Diamond View Lists', img: list },
//     { element: 'Supplier Report', img: report },
//     { element: 'Supplier Credit Note And Debit Note', img: debitCreditNoteImage },
//     { element: 'View Credit Note And Debit Note', img: debitcreditViewImage },
//     { element: 'Kyc View', img: KycViewImage }

//   ];

//   const DiaStaffDatas = [
//     { element: 'Master Approval', img: masterApprovalIcon },
//     { element: 'Diamond Lists Approve', img: diamondadmin },
//     { element: 'Supplier Report', img: report },
//     { element: 'Kyc Approval', img: tradeicon },
//     { element: 'Approved KYCs', img: debitcreditViewImage },

//   ];

//   const AdminDatas = [
//     { element: 'Admin Page', img: adminIcon },
//     { element: 'Kyc Approval', img: tradeicon },
//     { element: 'Approved KYCs', img: debitcreditViewImage },

//   ];

//   const KycDatas = [
//     { element: 'Business Address', img: kycicon },
//     { element: 'Principal Address', img: statutatoryimg },
//     { element: 'Banking Information', img: bankingicon },
//     { element: 'Contact Information', img: contacticon },
//     // { element: 'Business Information', img: businessicon },
//     { element: 'Trade Information', img: tradeicon },
//   ];
//   const rateFixing = [
//     { element: 'Rate Data Entry', img: rateacceptImage },
//     { element: 'Report', img: statutatoryimg },
//     { element: 'Gold PO Entry', img: poentry },
//     { element: 'Gold PO Creation', img: pocreation },

//     { element: 'Consolidate Report', img: bankingicon },
//     // { element: 'Print', img: contacticon },
//       {element: 'Kyc Approval', img: KycViewImage} ,
//       { element: 'Approved KYCs', img: debitcreditViewImage },
    
//   ];

//   const rateFixingSupplier = [
//     { element: 'Rate Acccept', img: rateacceptImage },
//     { element: 'View Report', img: bankingicon },
//     { element: 'Supplier Credit Note And Debit Note', img: debitCreditNoteImage },
//     { element: 'View Credit Note And Debit Note', img: debitcreditViewImage },
//     { element: 'Supplier Order', img: businessicon },
//     { element: 'Kyc View', img: KycViewImage }

    
//     // { element: 'Trade Information', img: tradeicon },
//   ];
//   const AccMngDatas = [{ element: 'Kyc Approval', img: tradeicon },{ element: 'Approved KYCs', img: debitcreditViewImage }];
//   const debitAndCreditNotes = [
//     { element: 'Credit Note And Debit Note', img: debitCreditNoteImage },
//     { element: 'View Credit Note And Debit Note', img: debitcreditViewImage },
//   ]
//   console.log(userRole)
//   const additionalElement = (userRole === "Diamond-Supplier"|| userRole === "Gold-Supplier"||userRole === "Silver-Supplier")
//     ? { element: 'Kyc View', img: KycViewImage }
//     : { element: 'Kyc Approval', img: KycViewImage };

//   KycDatas.push(additionalElement);
// console.log(userRole);
// let roleSections = {};
// if (kycUserData?.status === true) {
//   roleSections['Diamond-Supplier'] = DiaSupplierDatas;
//   roleSections['Gold-Supplier'] = rateFixingSupplier;
// } else if(kycUserData?.status === false) {
//   roleSections['Diamond-Supplier'] = KycDatas;
//   roleSections['Gold-Supplier'] = KycDatas;
//   roleSections['Silver-Supplier'] = KycDatas;
// }

// roleSections['Diamond-Purchase'] = DiaStaffDatas;
// roleSections['Admin'] = AdminDatas;
// roleSections['A/C_Manager'] = AccMngDatas;
// roleSections['Gold-Purchase'] = rateFixing;
// roleSections['A/C_Executive'] = debitAndCreditNotes;


//   const [activeSection, setActiveSection] = useState(() => {
//     const storedSection = localStorage.getItem('activeSection');
//     return storedSection || roleSections[userRole]?.[0]?.element;
//   });

//   useEffect(() => {
//     localStorage.setItem('activeSection', activeSection);
//   }, [activeSection, kycUserData?.status]);

//   const hasAccess = (allowedRoles) => {
//     return allowedRoles.includes(userRole);
//   };

//   const renderContent = () => {
//     if (isKycLoading) {
//       return <ContentLoader variant="wave" />;  
//     }
//     if (!isInitialized) {
//       return <ContentLoader variant="shimmer" />;
//     }
//     if (userRole === 'Diamond-Supplier' && kycUserData?.status===true) {
//       // Only allow rendering Diamond-related sections for dia-supplier if KYC is approved
//       console.log(activeSection)
//       switch (activeSection) {
//         case 'Rate Master':
//           return <DiamondProvider><DiamondMasterPage /></DiamondProvider>;
//         case 'Diamond Data Entry':
//           return <DiamondProvider><CombinationGrid /></DiamondProvider>;
//         case 'Supplier Report':
//           return <DiamondProvider><SupplierReport /></DiamondProvider>;
//         case 'Diamond View Lists':
//           return <DiamondProvider><DiamondLists /></DiamondProvider>;
//         case 'Supplier Credit Note And Debit Note':
//           return <SupDebitNoteAndCreditNote />;
//         case 'View Credit Note And Debit Note':
//           return <SupImageCard />;
//           case 'Kyc View':
//           return <KycDataProvider><KycView /></KycDataProvider>;
//         default:
//           return <Error />;
//       }
//     } else if ((userRole === 'Diamond-Supplier'||userRole === 'Gold-Supplier'||userRole === 'Silver-Supplier') && kycUserData?.status===false) {
//       // Allow KYC-related sections when KYC is not approved
//       switch (activeSection) {
//         case 'Business Address':
//           return <KycDataProvider><SupplierKYC /></KycDataProvider>;
//         case 'Principal Address':
//           return <KycDataProvider><StatutaoryInformation /></KycDataProvider>;
//         case 'Banking Information':
//           return <KycDataProvider><BankingInformation /></KycDataProvider>;
//         case 'Contact Information':
//           return <KycDataProvider><ContactInformation /></KycDataProvider>;
//         // case 'Business Information':
//         //   return <KycDataProvider><BusinessInformation /></KycDataProvider>;
//         case 'Trade Information':
//           return <KycDataProvider><TradeInformation /></KycDataProvider>;
//         case 'Kyc View':
//           return <KycDataProvider><KycView /></KycDataProvider>;
         

//         default:
//           return <Error />;
//       }
//     }
//     else if (userRole === 'Gold-Purchase') {

//       // Allow KYC-related sections when KYC is not approved
//       switch (activeSection) {
//         case 'Rate Data Entry':
//           return <FormToCredit />;
//         case 'Report':
//           return <RateProvider><Report /></RateProvider>;
//         case 'Consolidate Report':
//           return <Consolidate />;
//           case 'Gold PO Entry':
//                 return <GoldProductForm />;
//         case 'Gold PO Creation':
//             return <GoldPoCreation />;
//         case 'Print':
//           return <Document />;
//         case 'Credit Note And Debit Note':
//           return <CreditNoteAndDebitNote />;
//         case 'View Credit Note And Debit Note':
//           return <ImageCard />;
//           case 'Kyc Approval':
//             return <KycDataProvider> <KycApproval /></KycDataProvider>;
//             case 'Approved KYCs':
//             return <KycDataProvider> <KycViewAccepted /></KycDataProvider>;
//         default:
//           return <Error />;
//       }
//     }
//     else if (userRole === 'A/C_Executive') {

//       // Allow KYC-related sections when KYC is not approved
//       switch (activeSection) {

//         case 'Credit Note And Debit Note':
//           return <CreditNoteAndDebitNote />;
//         case 'View Credit Note And Debit Note':
//           return <ImageCard />;
//         default:
//           return <Error />;
//       }
//     }


//     else if (userRole === 'Gold-Supplier'&& kycUserData?.status===true) {

//       // Allow KYC-related sections when KYC is not approved
//       switch (activeSection) {
//         case 'Rate Acccept':
//           return <RateProvider><SearchBar /></RateProvider>;
//         case 'View Report':
//           return <RateProvider><SupplierIndReport /></RateProvider>;
//         case 'Supplier Credit Note And Debit Note':
//           return <SupDebitNoteAndCreditNote />;
//         case 'View Credit Note And Debit Note':
//           return <SupImageCard />;
//           case 'Supplier Order':
//             return <SupplierOrder />;
//             case 'Kyc View':
//               return <KycDataProvider><KycView /></KycDataProvider>;
              
//         default:
//           return <Error />;
//       }
//     }
    
//     else {
//       // Handle rendering for other roles (dia-staff, admin, etc.)
//       switch (activeSection) {
//         case 'Master Approval':
//           return hasAccess(['Diamond-Purchase']) ? <MasterApproval /> : <Error />;
//         case 'Diamond Lists Approve':
//           return hasAccess(['Diamond-Purchase']) ? <DiamondAdmin /> : <Error />;
//         case 'Supplier Report':
//           return <DiamondProvider><SupplierReport /></DiamondProvider>;
//         case 'Kyc Approval':
//           return hasAccess(['Diamond-Purchase', 'Admin', 'A/C_Manager','Gold-Purchase']) && <KycDataProvider> <KycApproval /></KycDataProvider> ;
//           case 'Approved KYCs':
//             return hasAccess(['Diamond-Purchase', 'Admin', 'A/C_Manager',])&& <KycDataProvider><KycViewAccepted /></KycDataProvider>;
//         case 'Credit Note And Debit Note':
//           return hasAccess(['Diamond-Purchase']) ? <CreditNoteAndDebitNote /> : <Error />;
         
//         case 'Admin Page':
//           return hasAccess(['Admin']) ? <Admin /> : <Error />;
//         default:
//           return <Error />;
//       }
//     }
//   };

//   return (<DashBoardContext.Provider value={{
//     token, setToken, user, companyName, names, mobileNo, setUser, userRole, setUserRole, isLoggin, setIsLoggin, handleLogOut, LOGG_API,
//     renderContent, activeSection, setActiveSection, hasAccess, roleSections, kycUserData, setApprovedData, statusUpdate, decryptToken,setLogginToken,sectionComponents,sectionImages
//   }}>
//     {children}
//   </DashBoardContext.Provider>)

// }
// DashBoardContextProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export { DashBoardContext, DashBoardContextProvider };