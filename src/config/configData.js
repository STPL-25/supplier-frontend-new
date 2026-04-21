// const DIA_API= "http://localhost:8080/dia";
// const KYC_API="http://localhost:8080/kyc";
// const LOGG_API = "http://localhost:8080/api";
// const INSTANCEAPI="http://localhost:8080"
const API= import.meta.env.VITE_API_URL;
const ChartAPI= import.meta.env.VITE_API_CHART_URL;
const customerApi= import.meta.env.VITE_API_CHART_URL;

//  const API="https://cust.spacetextiles.net"

const DIA_API= `${API}/dia`;
const KYC_API=`${API}/kyc`;
const LOGG_API = `${API}/api`;
const INSTANCEAPI=`${API}`;


export {DIA_API,KYC_API,LOGG_API,INSTANCEAPI,API,ChartAPI,customerApi}
