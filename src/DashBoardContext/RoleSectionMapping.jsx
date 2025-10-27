import {
    DiamondMasterPage,
    CombinationGrid,
    SupplierReport,
    KycView,
    // Add other components as needed...
  } from "../Components/ComponentRoutes";
  
  export const roleSectionConfig = (role, kycStatus) => {
    const commonSections = {
      Admin: [
        { element: "Admin Page", component: Admin },
        { element: "KYC Approval", component: KycApproval },
      ],
      "Diamond-Supplier": kycStatus
        ? [
            { element: "Rate Master", component: DiamondMasterPage },
            { element: "Diamond Data Entry", component: CombinationGrid },
            { element: "Supplier Report", component: SupplierReport },
          ]
        : [
            { element: "KYC View", component: KycView },
            // Add KYC-related sections
          ],
      // Add other roles...
    };
    return commonSections[role] || [];
  };
  
  export const renderSection = (activeSection, sections) => {
    const section = sections.find((sec) => sec.element === activeSection);
    return section ? React.createElement(section.component) : null;
  };