import {
  DiamondMasterPage,
  BankingInformation,
  ContactInformation,
  StatutaoryInformation,
  TradeInformation,
  SupplierKYC,
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
  Error,
  Admin,
  kycicon,
  statutatoryimg,
  bankingicon,
  contacticon,
  tradeicon,
  KycView,
  KycViewImage,
  KycApproval,
  FormToCredit,
  Report,
  Consolidate,
  SearchBar,
  rateacceptImage,
  SupplierIndReport,
  KycViewAccepted,
  GoldProductForm,
  GoldPoCreation,
  poentry,
  pocreation,
  GoldPoCreationSupplier,
  supplierpo,
  RatesChart,
  HallmarkInformation,
  hallmark,
  POApproval,
  PoConsolidateReport,
  RetailRates,
  PoEntryPage,
  FixOrderApprovalScreen,
  FundPlanning,
  FundPlanningDashboard,
  SalesReportChart,
  OcrReader,
  FundPlanningConReport,
  POStockAllocation,
  MetalTransferReport,
  KYCReport,
  SupplierKYCOrderStatus,
  DiamondManager,
  GoogleSheetsPurchaseManager,
  PurchaseReport,
  DebitCreditNotePage,
  SupPurchaseReport,
  QCCheckReport,
  DiamondQuotationForm 
} from "../Components/ComponentRoutes";
import { DiamondProvider } from "../Application/Diamond/DiamondGridContext/DiamondGridContext";
import {
  KycDataProvider,
  KycContext,
} from "../Application/KYC/KycContext/KycContex";
import { RateProvider } from "../Application/RateConfirmation/Context/Ratecontext";
import { PoProvider } from "../Application/Gold/PoContext/PoContext";
import { Toaster } from "sonner";
const sectionComponents = {
  "Rate Master": (
    <DiamondProvider>
      <DiamondMasterPage />
    </DiamondProvider>
  ),
  "Diamond Data Entry": (
    <DiamondProvider>
      <CombinationGrid />
    </DiamondProvider>
  ),
  "Diamond View Lists": (
    <DiamondProvider>
      <DiamondLists />
    </DiamondProvider>
  ),
  "Supplier Report": (
    <DiamondProvider>
      <SupplierReport />
    </DiamondProvider>
  ),
  "Kyc View": (
    <KycDataProvider>
      <KycView />
    </KycDataProvider>
  ),
  "Business Address": (
    <KycDataProvider>
      <SupplierKYC />
    </KycDataProvider>
  ),
  "Principal Address": (
    <KycDataProvider>
      <StatutaoryInformation />
    </KycDataProvider>
  ),
  "Banking Information": (
    <KycDataProvider>
      <BankingInformation />
    </KycDataProvider>
  ),
  "Contact Information": (
    <KycDataProvider>
      <ContactInformation />
    </KycDataProvider>
  ),
  "Trade Information": (
    <KycDataProvider>
      <TradeInformation />
    </KycDataProvider>
  ),
  "Rate Data Entry": <FormToCredit />,
  Report: (
    <RateProvider>
      <Report />
    </RateProvider>
  ),
  "Consolidate Report": <Consolidate />,
  "PO Entry": (
    <PoProvider>
      <GoldProductForm />
    </PoProvider>
  ),
  "PO Report": <GoldPoCreation />,

  "Kyc Approval": (
    <KycDataProvider>
      <KycApproval />
    </KycDataProvider>
  ),
  "Approved KYCs": (
    <KycDataProvider>
      <KycViewAccepted />
    </KycDataProvider>
  ),
  "Rate Accept": (
    <RateProvider>
      <SearchBar />
    </RateProvider>
  ),
  "View Report": (
    <RateProvider>
      <SupplierIndReport />
    </RateProvider>
  ),

  "Metal Transferred Report": (
    <PoProvider>
      <MetalTransferReport />
    </PoProvider>
  ),
  "Master Approval": <MasterApproval />,
  "Diamond Lists Approve": <DiamondAdmin />,
  "Admin Page": <Admin />,
  "Supplier PO": <GoldPoCreationSupplier />,
  "Selling Rate Chart": <RatesChart />,
  "Hallmark Information": (
    <KycDataProvider>
      <HallmarkInformation />
    </KycDataProvider>
  ),
  "PO Approval": (
    <PoProvider>
      <POApproval />
    </PoProvider>
  ),
  "Consolidate PO Report": (
    <PoProvider>
      <PoConsolidateReport />
    </PoProvider>
  ),
  "Retail Rates": <RetailRates />,
  "Po Entry Page": <OcrReader />,
  // <PoEntryPage/>,
  "Fix Rate Approval": <FixOrderApprovalScreen />,
  "Fund Planning DashBoard": <FundPlanningConReport />,
  // <FundPlanningDashboard/>,
  "Fund Planning Report ": <FundPlanning />,

  "Fund Transaction Report": <SalesReportChart />,
  "Kyc Status Report":<KYCReport/>,
    "PO Stock Allocation": 
    <>
      <Toaster position="top-right"  />
      <PoProvider>
        <POStockAllocation />
      </PoProvider>
    </>,
    "Supplier KYC Order Status": (
      <KycDataProvider>
        <SupplierKYCOrderStatus />
      </KycDataProvider>
    ),
    "Diamond Excel Uploader": (
      <DiamondProvider>
        <DiamondManager />
      </DiamondProvider>
    ),
    "Diamond Purchase Entry Report": (
      <DiamondProvider>
        <PurchaseReport />
      </DiamondProvider>
    ),

   "Diamond Supplier Purchase Entry Report": (
      <DiamondProvider>
        <SupPurchaseReport />
      </DiamondProvider>
    ),
    "QC Check Report": (
      <DiamondProvider>
        <QCCheckReport />
      </DiamondProvider>
    ),
    
    //   "Diamond Excel Uploader": (
    //   <DiamondProvider>
    //     <GoogleSheetsPurchaseManager />
    //   </DiamondProvider>
    // ),
    "Credit Note And Debit Note": <DebitCreditNotePage />,
    "Diamond Quotation Form": <DiamondQuotationForm />

  
};
const sectionImages = {
  "Rate Master": masterpage,
  "Rate Fixing": masterpage,
  "Diamond Data Entry": entry,
  "Diamond View Lists": list,
  "Supplier Report": report,
  "Kyc View": KycViewImage,
  "Business Address": kycicon,
  "Principal Address": statutatoryimg,
  "Banking Information": bankingicon,
  "Contact Information": contacticon,
  "Trade Information": tradeicon,
  "Rate Data Entry": rateacceptImage,
  Report: statutatoryimg,
  "Consolidate Report": bankingicon,
  "PO Entry": poentry,
  "PO Report": pocreation,
  Print: contacticon,
  "Kyc Approval": adminIcon,
  "Rate Accept": rateacceptImage,
  "Supplier PO": supplierpo,
  "View Report": bankingicon,
  "Master Approval": masterApprovalIcon,
  "Diamond Lists Approve": diamondadmin,
  "Admin Page": adminIcon,
  "Selling Rate Chart": tradeicon,
  "Hallmark Information": hallmark,
  "Customer Order Report": hallmark,
  "Retail Rates": bankingicon,
  "Fund Planning": bankingicon,
  "PO Stock Allocation":masterApprovalIcon ,
  "View Kyc": KycViewImage,
};
export { sectionComponents, sectionImages };
