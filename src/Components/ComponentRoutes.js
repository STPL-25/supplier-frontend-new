
// Diamond Imports
import DiamondMasterPage from "../Application/Diamond/Pages/DiamondMasterPage";
import CombinationGrid from "../Application/Diamond/Pages/CombinationGrid";
import DiamondAdmin from "../Application/Diamond/Pages/DiamondAdmin";
import SupplierReport from "../Application/Diamond/Pages/SupplierReport";
import MasterApproval from "../Application/Diamond/Pages/MasterApproval";
import DiamondLists from "../Application/Diamond/Pages/DiamondLists";
import PoEntryPage from "../Application/PurchaseOrder/Pages/PoEntryPage";
import FixOrderApprovalScreen from "../Application/RateConfirmation/FixOrderApprovalScreen";
import FundPlanning from "../Application/FundPlanning/FundPlanning";
import FundPlanningDashboard from "../Application/FundPlanning/FundPlanningDashboard";
import OcrReader from "../Application/ImageReader/OcrReader";
import FundPlanningConReport from "../Application/FundPlanning/FundPlanningConReport";
import SalesReportChart from "../Application/FundPlanning/SalesReportChart";
import POStockAllocation from "../Application/Gold/pages/POStockAllocation";
import MetalTransferReport from "../Application/Gold/pages/MetalTransferReport";
import KYCReport from "../Application/KYC/pages/KycReport";
import SupplierKYCOrderStatus from "../Application/KYC/pages/SupplierKYCOrderStatus";
// import ExcelUploader from "../Application/Diamond/FunctionalComponents/ExcelUploader";
// import DiamondManager from "../Application/Diamond/FunctionalComponents/ExcelUploader";
import DiamondManager from "../Application/DiamondPurEntry/components/DiamondManager";
import GoogleSheetsPurchaseManager from "../Application/Diamond/FunctionalComponents/GoogleSheetUploader";
import PurchaseReport from "../Application/Diamond/FunctionalComponents/DiaPurchaseReport";
import DebitCreditNotePage from "../Application/DebitNoteAndCreditNote/DebitCreditNotePage";
import SupPurchaseReport from "../Application/Diamond/FunctionalComponents/DiaSupPurchaseReport";
import QCCheckReport from "../Application/DiamondPurEntry/components/QCCheckReport";
// ✅ Use these direct references instead
const adminIcon = "/images/admin.png";
const masterApprovalIcon = "/images/approval.png";
const masterpage = "/images/masterpage.png";
const list = "/images/list.png";
const entry = "/images/entry.png";
const report = "/images/report.png";
const diamondadmin = "/images/diamond.png";
const kycicon = "/images/kyc.png";
const statutatoryimg = "/images/statutatory.png";
const bankingicon = "/images/banking.png";
const contacticon = "/images/contact.png";
const businessicon = "/images/business.png";
const tradeicon = "/images/trade.png";
const KycViewImage = "/images/viewkyc.png";
const rateacceptImage = "/images/rateaccept.png";
const poentry = "/images/poentry.png";
const pocreation = "/images/pocreation.png";
const supplierpo = "/images/supplierpo.png";
const hallmark = "/images/hallmark.png";

// Other Page Imports
import Error from '../Pages/Error';
import Admin from "../Pages/Admin";
import RatesChart from "../Application/Gold/Charts/RatesChart";
// KYC Imports
import BankingInformation from "../Application/KYC/components/BankingInformation";
// import BusinessInformation from "../Application/KYC/components/BusinessInformation";
import ContactInformation from "../Application/KYC/components/ContactInformation";
import SupplierKYC from "../Application/KYC/components/SupplierKYC";
import StatutaoryInformation from "../Application/KYC/components/StatutaoryInformation";
import TradeInformation from "../Application/KYC/components/TradeInformation";
//KYC pages
import KycView from "../Application/KYC/pages/KycView";
import KycApproval from "../Application/KYC/pages/KycApproval"
// Export all components and assets
//Rate Confirmation 
import FormToCredit from "../Application/RateConfirmation/FormToCredit"
import Report from "../Application/RateConfirmation/Report"
import Consolidate from "../Application/RateConfirmation/Consolidate"
// import Document from "../Application/RateConfirmation/Document"
import SearchBar from "../Application/RateConfirmation/SearchBar"
// import CreditNoteAndDebitNote from "../Application/DebitAndCreditNote/CreditNoteAndDebitNote";
// import SupDebitNoteAndCreditNote from "../Application/DebitAndCreditNote/SupDebitNoteAndCreditNote";
import SupplierIndReport from "../Application/RateConfirmation/SupplierIndReport";
// import ImageCard from "../Application/DebitAndCreditNote/ImageCard";
// import SupImageCard from "../Application/DebitAndCreditNote/SupImageCard";
// import SupDebitCreditReport from "../Application/DebitAndCreditNote/SupDebitCreditReport";
import KycViewAccepted from "../Application/KYC/pages/KycViewAccepted";
import GoldProductForm from "../Application/Gold/pages/GoldProductForm";
import GoldPoCreation from "../Application/Gold/pages/GoldPoCreation";
import PurchaseReturn from '../Application/Diamond/Pages/PurchaseReturn';
import GoldPoCreationSupplier from "../Application/Gold/pages/GoldPoCreationSupplier"
// import PendingCustomerOrder from "../Application/SupplierOrder/PendingCustomerOrder";
// import poreturn from "../assets/poreturn.png"
import SupplierPurchaseReturn from "../Application/Diamond/Pages/SupplierPurchaseReturn"
import HallmarkInformation from "../Application/KYC/components/HallmarkInformation";
// import DispatchCustomerOrder from "../Application/SupplierOrder/DispatchCustomerOrder";
// import SupplierDataDisplay from "../Application/SupplierOrder/SupplierDataDisplay";
import POApproval from "../Application/Gold/pages/POApproval"
import PoConsolidateReport from "../Application/Gold/pages/PoConsolidateReport";
import RetailRates from "../Application/RetailRates/RetailRates";
// import ChildPoTct from "../Application/Gold/components/ChildPoTct";
export {
  DiamondMasterPage,
  CombinationGrid,
  DiamondAdmin,
  SupplierReport,
  MasterApproval,
  DiamondLists,
  adminIcon,
  masterApprovalIcon,
  masterpage,
  list,
  entry,
  report,
  diamondadmin,
  kycicon,
  statutatoryimg,
  bankingicon,
  contacticon,
  businessicon,
  tradeicon,
  rateacceptImage,
  // debitCreditNoteImage,
  Error,
  Admin,
  BankingInformation,
  // BusinessInformation,
  ContactInformation,
  SupplierKYC,
  StatutaoryInformation,
  TradeInformation,
  KycView,
  KycApproval,
  FormToCredit,
  Report,
  Consolidate,
  // Document,
  SearchBar,
  // CreditNoteAndDebitNote,
  // SupDebitNoteAndCreditNote,
  KycViewImage,
  // debitcreditViewImage,
  SupplierIndReport,
  // ImageCard,
  // SupImageCard,
  // SupDebitCreditReport,
  KycViewAccepted,
  GoldProductForm,
  GoldPoCreation,
  poentry,
  pocreation,
  PurchaseReturn,
  // poreturn,
  SupplierPurchaseReturn,
  GoldPoCreationSupplier,
  supplierpo,
  RatesChart,
  HallmarkInformation,
  hallmark,
  // PendingCustomerOrder,
  // DispatchCustomerOrder,
  // SupplierDataDisplay,
  POApproval,
  PoConsolidateReport,
  RetailRates,
  PoEntryPage,
  FixOrderApprovalScreen,
  FundPlanning,
  FundPlanningDashboard,
  OcrReader,
  FundPlanningConReport,
  SalesReportChart,
  POStockAllocation,
  MetalTransferReport,
  KYCReport,
  SupplierKYCOrderStatus,
  DiamondManager,
  GoogleSheetsPurchaseManager,
  PurchaseReport,
  DebitCreditNotePage,
  SupPurchaseReport,
  QCCheckReport
  // ChildPoTct
  // SupplierOrder
};




