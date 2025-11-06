// import {  Document,  Page,  Text,  View,  StyleSheet,  Image,  PDFDownloadLink,  Link,  pdf,} from "@react-pdf/renderer";
// import QRCode from "qrcode";
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { API } from "../../../config/configData";
// // import sktmImage from "../../../assets/Skt.png";
// // import tct from "../../../assets/tct.png";
// // import sktmgarsons from "../../../assets/grasons.png";
// // import sktmspace from "../../../assets/stpl.png";
// import styles from "../PdfStyledComponent/PdfStyled";
// import RenderSummary from "../PdfStyledComponent/RenderSummary";
// import moment from "moment";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import { getColumns } from "../PdfStyledComponent/GetCoulmns";
// const QRCodeComponent = ({ value, dataURL }) => {
//   return dataURL ? (
//     <Image src={dataURL} style={{ width: 80, height: 80 }} />
//   ) : null;
// };

// // ✅ Add these instead
// const sktmImage = "/images/Skt.png";
// const tct = "/images/tct.png";
// const sktmgarsons = "/images/grasons.png";
// const sktmspace = "/images/stpl.png";


// const calculateTotals = (data) => {
//   const calcPureWeight = data.some((item) => item.productWeightage !== "Pcs");

//   return data.reduce((acc, item) => {
//     const totals = {
//       totalPieces: (acc.totalPieces || 0) + (parseFloat(item.pieces) || 0),
//       totalGrossWeight:
//         (acc.totalGrossWeight || 0) + (parseFloat(item.gross_weight) || 0),
//       totalNetWeight:
//         (acc.totalNetWeight || 0) + (parseFloat(item.net_weight) || 0),
//       totalAmount: (acc.totalAmount || 0) + (parseFloat(item.amount) || 0),
//     };

//     // Only calculate pure weight for items that are not 'Pcs' weightage
//     if (calcPureWeight) {
//       totals.totalPureWeight =
//         (acc.totalPureWeight || 0) +
//         (item.productWeightage !== "Pcs" ? parseFloat(item.pure_wt) || 0 : 0);
//     }

//     return totals;
//   }, {});
// };



// // Helper Functions
// const formatAddress = (parts) => {
//   return parts.filter((part) => part && part.trim()).join(", ");
// };



// // POPage Component
// const POPage = ({
//   data,
//   pageNumber,
//   totalPages,
//   isLastPage,
//   totals,
//   // columns = DEFAULT_COLUMNS,
//   poAddressData,
//   orderTypes,
// }) => {
//   const columns = getColumns(data);
// console.log(data,pageNumber,totalPages,isLastPage,totals,poAddressData,orderTypes)
//   const phoneNumber =
//     data[0].metal_type === "Gold"
//       ? "+91 9629570888, +91 9789680888"
//       : data[0].metal_type === "Silver"
//       ? "+91 8220576888, +91 9629221888"
//       : "";
//       const isTct = data[0].poNumber.includes("TCT");

//   const approvedBy = data[0].poApprovedBy;
//   const approvedTime = data[0].poApprovedDate;
//   const parsedMoment = moment(approvedTime);
//   const dateOnly = parsedMoment.format("YYYY-MM-DD"); // e.g., "2025-03-31"
//   const timeOnly = parsedMoment.format("HH:mm:ss"); // e.g., "17:15:44"

//   return (
//     <Page size="A4" style={styles.page}>
//       {/* {console.log(orderTypes)} */}
//       {/* Header */}
//       {pageNumber === 1 && (
//         <>
//           {" "}
//           <View
//             style={{
//               position: "absolute",
//               top: 20,
//               right: 20,
//               zIndex: 100,
//             }}
//           >
//             <QRCodeComponent
//               value={`PA${poAddressData?.poDetails?.poNumber}` || "Unknown PO"}
//               dataURL={poAddressData?.qrCodeDataURL}
//             />
//           </View>
//           {console.log(poAddressData?.poDetails)}
        
//           <Image
//             source={
//               poAddressData?.parentPo?.subTitle.includes("Space")
//                 ? sktmspace
//                 : 
//                   poAddressData?.parentPo?.subTitle.includes("Garsons")
//                 ? sktmgarsons
               
//                 : sktmImage
//             }
//             style={
//              styles.headerLogo
//             }
//           />
//           <View style={styles.header}>
//             <View style={styles.headerContainer}>
//               <Text style={styles.headerTitle}>
//                 Purchase Order 
//               </Text>
//             </View>
//           </View>
//         </>
//       )}

// {pageNumber === 1 && (
//   <View style={styles.infoGrid}>
//     {/* From Section */}
//     <View style={styles.infoColumn}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionHeaderText}>From</Text>
//       </View>
//       <View style={styles.sectionContent}>
//         <Text style={styles.value}>
//           {poAddressData?.parentPo?.name || ""}
//         </Text>
//         <Text style={styles.value}>
//           {poAddressData?.parentPo?.subTitle || ""}
//         </Text>
//         <Text style={styles.label}>
//           Address{" "}
//           <Text style={styles.value}>
//             {formatAddress([
//               poAddressData?.parentPo?.doorNo || "",
//               poAddressData?.parentPo?.streetName || "",
//               poAddressData?.parentPo?.city || "",
//               poAddressData?.parentPo?.pincode || "",
//             ])}
//           </Text>
//         </Text>
//         <Text style={styles.label}>
//           Phone{" "}
//           <Text style={styles.value}>
//             {poAddressData?.parentPo?.phone || ""}
//           </Text>
//         </Text>
//         <Text style={styles.label}>
//           GST{" "}
//           <Text style={styles.value}>
//             {poAddressData?.parentPo?.gstNo || ""}
//           </Text>
//         </Text>
//       </View>
//     </View>

//     {/* To Section */}
//     <View style={styles.infoColumn}>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionHeaderText}>To</Text>
//       </View>
//       <View style={styles.sectionContent}>
//         <Text style={styles.label}>
//           Company Name{" "}
//           <Text style={styles.value}>
//             {poAddressData?.from?.name || ""}
//           </Text>
//         </Text>
//         <Text style={styles.label}>
//           Address{" "}
//           <Text style={styles.value}>
//             {formatAddress([
//               poAddressData?.from?.doorNo || "",
//               poAddressData?.from?.streetName || "",
//               poAddressData?.from?.city || "",
//               poAddressData?.from?.pincode || "",
//             ])}
//           </Text>
//         </Text>
//         <Text style={styles.label}>
//           Phone{" "}
//           <Text style={styles.value}>
//             {poAddressData?.from?.phone || ""}
//           </Text>
//         </Text>
//         <Text style={styles.label}>
//           GST{" "}
//           <Text style={styles.value}>
//             {poAddressData?.from?.gstNo || ""}
//           </Text>
//         </Text>
//       </View>
//     </View>
//   </View>
// )}

   

//       {/* PO Details Section */}
//       {pageNumber === 1 && orderTypes !== "fair" && (
//         <View style={styles.cardContainer}>
//           {/* PO Details Card */}
//           <View style={styles.card}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionHeaderText}>PO Details</Text>
//             </View>
//             <View style={styles.sectionContent}>
//               <Text style={styles.label}>
//               PO Number
//                 <Text style={styles.value}>
//                   {`PA${poAddressData?.poDetails?.poNumber}` || ""}
//                 </Text>
//                PO Date
//                 <Text style={styles.value}>
//                   {poAddressData?.poDetails?.poDate || ""}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Due Date:{" "}
//                 <Text style={styles.value}>
//                   {poAddressData?.poDetails?.dueDate || ""}
//                 </Text>
//                 Mode:{" "}
//                 <Text style={styles.value}>
//                   {poAddressData?.poDetails?.mode || ""}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Purchase Manager:{" "}
//                 <Text style={styles.value}>
//                   {poAddressData?.counterDetails?.purchaseManager || "-"}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Purchase Incharge:{" "}
//                 <Text style={styles.value}>
//                   {poAddressData?.counterDetails?.purchaseIncharge || "-"}
//                 </Text>
//               </Text>
//             </View>
//           </View>

//           {/* Delivery Location Card */}
//           <View style={styles.card}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionHeaderText}>Delivery Location</Text>
//             </View>
//             <View style={styles.sectionContent}>
//               <Text style={styles.label}>
//                 Address{" "}
//                 <Text style={styles.value}>
//                   {(() => {
//                     try {
//                       if (poAddressData?.delivery) {
//                         const deliveryData =
//                           typeof poAddressData.delivery === "string"
//                             ? JSON.parse(poAddressData.delivery)
//                             : poAddressData.delivery;
//                         return deliveryData.address || "A.Ku Towers, Crosscut Road,Coimbatore,Tamil Nadu,641012,0422-2490888";
//                       }
//                       return "A.Ku Towers, Crosscut Road,Coimbatore,Tamil Nadu,641012,0422-2490888";
//                     } catch (error) {
//                       return "Error parsing delivery data";
//                     }
//                   })()}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Payment Type{" "}
//                 <Text style={styles.value}>
//                   {(() => {
//                     try {
//                       if (poAddressData?.delivery) {
//                         const deliveryData =
//                           typeof poAddressData.delivery === "string"
//                             ? JSON.parse(poAddressData.delivery)
//                             : poAddressData.delivery;
//                         return deliveryData?.payment_Type || "-";
//                       }
//                       return "-";
//                     } catch (error) {
//                       return "-";
//                     }
//                   })()}
//                 </Text>
//               </Text>
//               <Text style={styles.label}>
//                 Location Type{" "}
//                 <Text style={styles.value}>
//                   {(() => {
//                     try {
//                       if (poAddressData?.delivery) {
//                         const deliveryData =
//                           typeof poAddressData.delivery === "string"
//                             ? JSON.parse(poAddressData.delivery)
//                             : poAddressData.delivery;
//                         return deliveryData.locationType || "-";
//                       }
//                       return "-";
//                     } catch (error) {
//                       return "-";
//                     }
//                   })()}
//                 </Text>
//               </Text>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Products Table */}
//       <View style={styles.table}>
//         <View style={styles.tableHeader}>
//           {columns.map((col, index) => (
//             <View key={index} style={[styles.tableCell, { width: col.width }]}>
//               <Text style={styles.tableHeaderCell}>{col.header}</Text>
//             </View>
//           ))}
//         </View>

//         {Array.isArray(data) &&
//           data.map((item, index) => (
//             <View
//             key={index}
//             style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}
//           >
//             {columns.map((col, colIndex) => {
//               // Skip product_name column for items with orderType === 'office'
//               // if (col.field === "product_name" && item.orderType === "office") {
//               //   return (
//               //     <View
//               //       key={colIndex}
//               //       style={[styles.tableCell, { width: col.width }]}
//               //     >
//               //       <Text style={styles.tableCellContent}>-</Text>
//               //     </View>
//               //   );
//               // }
        
//               // Skip stone cost, fine wt, melting, wastage, making charges for Pcs weightage
//               if (
//                 (col.field === "stone_cost" ||
//                   col.field === "pure_wt" ||
//                   col.field === "melting" ||
//                   col.field === "wastage" ||
//                   col.field === "makingCharges") &&
//                 item.productWeightage === "Pcs"
//               ) {
//                 return (
//                   <View
//                     key={colIndex}
//                     style={[styles.tableCell, { width: col.width }]}
//                   >
//                     <Text style={styles.tableCellContent}>0</Text>
//                   </View>
//                 );
//               }
        
//               // Handle special case for meltingWt and wastageWt - using the body function
//               if ((col.field === "meltingWt" || col.field === "wastageWt") && col.body) {
//                 // Skip calculated fields for Pcs weightage
//                 if (item.productWeightage === "Pcs") {
//                   return (
//                     <View
//                       key={colIndex}
//                       style={[styles.tableCell, { width: col.width }]}
//                     >
//                       <Text style={styles.tableCellContent}>0</Text>
//                     </View>
//                   );
//                 }
                
//                 // Calculate the value using the body function
//                 const calculatedValue = col.body(item);
                
//                 return (
//                   <View
//                     key={colIndex}
//                     style={[styles.tableCell, { width: col.width }]}
//                   >
//                     <Text style={styles.tableCellContent}>
//                       {calculatedValue !== undefined ? calculatedValue.toFixed(2) : "-"}
//                     </Text>
//                   </View>
//                 );
//               }
        
//               // Handle normal fields
//               return (
//                 <View
//                 key={colIndex}
//                 style={[styles.tableCell, { width: col.width }]}
//               >
//                 {col.field === "product_image" ? (
//                   item.product_image ? (
//                     item.product_image.includes("adv.back.spacetextiles.net") ? (
//                       // Show image directly if URL contains adv.back.spacetextiles.net
//                       <Image src={item.product_image} style={styles.productImage} />
//                     ) : (
//                       // Show as link for other URLs
//                       <Link src={item.product_image}>
//                         <Text style={styles.imageLink}>View Image</Text>
//                       </Link>
//                     )
//                   ) : (
//                     // Handle case with no image URL
//                     <Text style={styles.tableCellContent}>No Image</Text>
//                   )
//                 ) : (
//                   <Text style={styles.tableCellContent}>
//                     {col.field === "sno"
//                       ? (pageNumber - 1) * 10 + index + 1
//                       : item[col.field] || "-"}
//                   </Text>
//                 )}
//               </View>
//               );
//             })}
//           </View>
//           ))}
//       </View>

//       {/* Summary Section - Only on last page */}
//       {/* {renderSummary(isLastPage, totals, data)} */}
   

//       <RenderSummary isLastPage={isLastPage} totals={totals} datas={data}/>

//       {/* Footer */}
//       {isLastPage && orderTypes !== "fair" && (
//          <View style={styles.footer}>
//          <Text style={styles.footerTitle}>
//            {isTct ? "JOB" : "PURCHASE"} ORDER TERMS AND CONDITIONS
//          </Text>
//          {isTct
//            ? // Job order conditions
//              [
//                "Goods should be delivered within 15 days from the receipt of the Job order.",
//                "Goods should be delivered in a completely finished manner.",
//                "If any of the products in this Job order fail the hallmark test, the entire quantity in the Job order may be returned at no cost to us.",
//                "The invoice should contain the Job order number.",
//                `For any queries regarding this Job order, please contact: ${phoneNumber}.`,
//              ].map((condition, index) => (
//                <View key={index}>
//                  <Text style={styles.footerText}>
//                    {index + 1}. {condition}
//                  </Text>
//                </View>
//              ))
//            : // Purchase order conditions
//              [
//                "Goods should be delivered within 15 days from the receipt of the purchase order.",
//                "Goods should be delivered in a completely finished manner.",
//                "If any of the products in this purchase order fail the hallmark test, the entire quantity in the purchase order may be returned at no cost to us.",
//                "The invoice should contain the purchase order number.",
//                "The bill set should include the following:",
//                `For any queries regarding this purchase order, please contact: ${phoneNumber}.`,
//              ].map((condition, index) => (
//                <View key={index}>
//                  <Text style={styles.footerText}>
//                    {index + 1}. {condition}
//                  </Text>
//                  {condition.includes("bill set") && (
//                    <View style={{ marginLeft: 10 }}>
//                      {[
//                        "Courier receipt (if applicable) or the authorized person's name and phone number.",
//                        "Original invoice along with three copies.",
//                        "Packing list.",
//                        "Calculation workings.",
//                      ].map((item, subIndex) => (
//                        <Text key={subIndex} style={styles.footerText}>
//                          {String.fromCharCode(97 + subIndex)}) {item}
//                        </Text>
//                      ))}
//                    </View>
//                  )}
//                </View>
//              ))}
//          {approvedBy && (
//            <View style={styles.approvalInfo}>
//              <Text>Digitally Approved By: Balaji.S (Bullion Manager)</Text>
//              {/* <Text>Date: {dateOnly}</Text>
//              <Text>Time: {timeOnly}</Text> */}
//            </View>
//          )}
//        </View>
//       )}

//       <Text style={styles.pageNumber}>
//         Page {pageNumber} of {totalPages}
//       </Text>
//     </Page>
//   );
// };

// // PODocument Component
// const PODocument = ({
//   submittedData = [],
//   // columns = DEFAULT_COLUMNS,
//   poAddressData,
//   orderTypes,
// }) => {
//   // Ensure submittedData is an array
//   const dataArray = Array.isArray(submittedData) ? submittedData : [];
//   console.log(submittedData);
//   // Group data by PO number
//   const groupedData = dataArray.reduce((acc, item) => {
//     const poNumber = item.poNumber || "default";
//     if (!acc[poNumber]) {
//       acc[poNumber] = [];
//     }
//     acc[poNumber].push(item);
//     return acc;
//   }, {});

//   return (
//     <Document>
//       {Object.entries(groupedData).map(([poNumber, poData]) => {
//         // Process data in manageable chunks (e.g., 10 items per page)
//         const ITEMS_PER_PAGE = 10;
//         const chunks = [];

//         for (let i = 0; i < poData.length; i += ITEMS_PER_PAGE) {
//           chunks.push(poData.slice(i, i + ITEMS_PER_PAGE));
//         }

//         // Ensure at least one chunk
//         if (chunks.length === 0) {
//           chunks.push([]);
//         }

//         const totalPages = chunks.length;
//         const totals = calculateTotals(poData);

//         return chunks.map((chunk, index) => (
//           <POPage
//             key={`${poNumber}-${index}`}
//             data={chunk}
//             pageNumber={index + 1}
//             totalPages={totalPages}
//             isLastPage={index === chunks.length - 1}
//             totals={totals}
//             // columns={columns}
//             poAddressData={poAddressData}
//             orderTypes={orderTypes}
//           />
//         ));
//       })}
//     </Document>
//   );
// };

// export const useTctSendToServer = ({
//   submittedData,
//   poAddressData,
//   onPdfGenerated,
// }) => {
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [error, setError] = useState(null);
//   const { userRole } = useContext(DashBoardContext);
//   const generateFilename = (poData) => {
//     const poNumber = poData?.poDetails?.poNumber || "PO";
//     const date = new Date().toISOString().split("T")[0];
//     return `${poNumber}_${date}.pdf`;
//   };
//   const generateQRCodeDataURL = async (value) => {
//     try {
//       return await QRCode.toDataURL(value, {
//         width: 80,
//         margin: 1,
//         color: {
//           dark: "#000000",
//           light: "#ffffff",
//         },
//       });
//     } catch (err) {
//       console.error("Error generating QR code:", err);
//       return null;
//     }
//   };

//   const generatePdf = async (
//     filteredItems,
//     poData,
//     submittedData,
//     orderTypes
//   ) => {
//     try {
//       setIsGenerating(true);
//       setError(null);
//       console.log(filteredItems);
//       console.log(poData);

//       console.log(orderTypes);

//       // Validate data before proceeding
//       if (!Array.isArray(filteredItems) || filteredItems.length === 0) {
//         console.error("Missing submitted data:", filteredItems);
//         throw new Error("No valid data provided for PDF generation");
//       }

//       if (!poData) {
//         console.error("Missing PO address data");
//         throw new Error("No address data provided for PDF generation");
//       }
//       console.log(poData);
//       const qrCodeDataURL = await generateQRCodeDataURL(
//         poData?.poDetails?.poNumber || "Unknown PO"
//       );
//       const doc = (
//         <PODocument
//           submittedData={filteredItems}
//           poAddressData={{ ...poData, qrCodeDataURL }}
//           orderTypes={orderTypes}
//         />
//       );

//       // Generate PDF blob
//       const blob = await pdf(doc).toBlob();

//       // Create a URL for the blob

//       console.log(blob);
//       // Create File object from blob
//       const pdfFile = new File(
//         [blob],
//         generateFilename(filteredItems, poData),
//         {
//           type: "application/pdf",
//           lastModified: new Date().getTime(),
//         }
//       );

//       console.log(poData);
//       // Create form data for sending to server
//       const formData = new FormData();
//       formData.append("file", pdfFile);
//       formData.append("poNumber", `PA${poData?.poDetails?.poNumber ?? ""}`);
//       formData.append("supplierName","THE CHENNAI TRADERS" ?? "");
//       formData.append("phoneNumber",  "7418994888");
//       formData.append("user", userRole);

//       // Send to server
//       const response = await axios.post(`${API}/gold_po/tct_upload_po`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         // Call the callback if provided
//         if (typeof onPdfGenerated === "function") {
//           onPdfGenerated(pdfFile);
//         }
//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Error generating/uploading PDF:", err);
//       setError(err.message || "Failed to generate PDF");
//       return false;
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return { generatePdf, error, isGenerating };
// };
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFDownloadLink,
  Link,
  pdf,
} from "@react-pdf/renderer";
import QRCode from "qrcode";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../config/configData";
import styles from "../PdfStyledComponent/PdfStyled";
import RenderSummary from "../PdfStyledComponent/RenderSummary";
import moment from "moment";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { getColumns } from "../PdfStyledComponent/GetCoulmns";

const QRCodeComponent = ({ value, dataURL }) => {
  return dataURL ? (
    <Image src={dataURL} style={{ width: 80, height: 80 }} />
  ) : null;
};

// Company logos
const sktmImage = "/images/Skt.png";
const tct = "/images/tct.png";
const sktmgarsons = "/images/grasons.png";
const sktmspace = "/images/stpl.png";

// Helper function to check if order is TCT
const isTctOrder = (poNumber) => {
  return poNumber && poNumber.includes("TCT");
};

// Helper function to calculate adjusted wastage for TCT orders
const calculateAdjustedWastage = (wastage, isTct) => {
  if (!wastage) return 0;
  const wastageValue = parseFloat(wastage) || 0;
  // Add 10% to wastage if isTct is true
  return isTct ? wastageValue + wastageValue * 0.1 : wastageValue;
};

// Helper function to calculate wastage weight
const calculateWastageWeight = (netWeight, wastage, isTct) => {
  const adjustedWastage = calculateAdjustedWastage(wastage, isTct);
  const net = parseFloat(netWeight) || 0;
  return (net * adjustedWastage) / 100;
};

// Helper function to calculate melting weight
const calculateMeltingWeight = (netWeight, melting) => {
  const net = parseFloat(netWeight) || 0;
  const melt = parseFloat(melting) || 0;
  return (net * melt) / 100;
};

// Helper function to calculate pure weight
// pure_wt = meltingWt + wastageWt (as per user requirement)
const calculatePureWeight = (netWeight, wastage, melting, isTct) => {
  const wastageWt = calculateWastageWeight(netWeight, wastage, isTct);
  const meltingWt = calculateMeltingWeight(netWeight, melting);
  return wastageWt + meltingWt;
};

// Calculate totals with adjusted wastage
const calculateTotals = (data) => {
  const calcPureWeight = data.some((item) => item.productWeightage !== "Pcs");
  const isTct = data.length > 0 && isTctOrder(data[0].poNumber);

  return data.reduce((acc, item) => {
    const netWeight = parseFloat(item.net_weight) || 0;
    const wastagePercent = parseFloat(item.wastage) || 0;
    const meltingPercent = parseFloat(item.melting) || 0;

    // Calculate pure weight using adjusted wastage
    const pureWt = calculatePureWeight(
      netWeight,
      wastagePercent,
      meltingPercent,
      isTct
    );

    const totals = {
      totalPieces: (acc.totalPieces || 0) + (parseFloat(item.pieces) || 0),
      totalGrossWeight:
        (acc.totalGrossWeight || 0) + (parseFloat(item.gross_weight) || 0),
      totalNetWeight: (acc.totalNetWeight || 0) + netWeight,
      totalAmount: (acc.totalAmount || 0) + (parseFloat(item.amount) || 0),
    };

    // Only calculate pure weight for items that are not 'Pcs' weightage
    if (calcPureWeight && item.productWeightage !== "Pcs") {
      totals.totalPureWeight = (acc.totalPureWeight || 0) + pureWt;
    }

    return totals;
  }, {});
};

// Format date minus one day
const formatDateMinusOne = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
};

// Helper Functions
const formatAddress = (parts) => {
  return parts.filter((part) => part && part.trim()).join(", ");
};

// POPage Component
const POPage = ({
  data,
  pageNumber,
  totalPages,
  isLastPage,
  totals,
  poAddressData,
  orderTypes,
}) => {
  const columns = getColumns(data);
  const isTct = data.length > 0 && isTctOrder(data[0].poNumber);

  const phoneNumber =
    data[0]?.metal_type === "Gold"
      ? "+91 9629570888, +91 9789680888"
      : data[0]?.metal_type === "Silver"
      ? "+91 8220576888, +91 9629221888"
      : "";

  const approvedBy = data[0]?.poApprovedBy;
  const approvedTime = data[0]?.poApprovedDate;
  const parsedMoment = moment(approvedTime);
  const dateOnly = parsedMoment.format("YYYY-MM-DD");
  // const timeOnly = parsedMoment.format("HH:mm:ss");
const randomHours = Math.floor(Math.random() * 3) + 1; // Random number: 1, 2, or 3
const updatedMoment = parsedMoment.clone().add(randomHours, "hours");
const timeOnly = updatedMoment.format("HH:mm:ss");
  return (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      {pageNumber === 1 && (
        <>
          <View
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 100,
            }}
          >
            <QRCodeComponent
              value={`IV${poAddressData?.poDetails?.poNumber}` || "Unknown PO"}
              dataURL={poAddressData?.qrCodeDataURL}
            />
          </View>

          <Image
            source={
              poAddressData?.parentPo?.subTitle.includes("Space")
                ? sktmspace
                : poAddressData?.parentPo?.subTitle.includes("Garsons")
                ? sktmgarsons
                : sktmImage
            }
            style={styles.headerLogo}
          />
          <View style={styles.header}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Purchase Order</Text>
            </View>
          </View>
        </>
      )}

      {pageNumber === 1 && (
        <View style={styles.infoGrid}>
          {/* From Section */}
          <View style={styles.infoColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>From</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.value}>
                {poAddressData?.parentPo?.name || ""}
              </Text>
              <Text style={styles.value}>
                {poAddressData?.parentPo?.subTitle || ""}
              </Text>
              <Text style={styles.label}>
                Address{" "}
                <Text style={styles.value}>
                  {formatAddress([
                    poAddressData?.parentPo?.doorNo || "",
                    poAddressData?.parentPo?.streetName || "",
                    poAddressData?.parentPo?.city || "",
                    poAddressData?.parentPo?.pincode || "",
                  ])}
                </Text>
              </Text>
              <Text style={styles.label}>
                Phone{" "}
                <Text style={styles.value}>
                  {poAddressData?.parentPo?.phone || ""}
                </Text>
              </Text>
              <Text style={styles.label}>
                GST{" "}
                <Text style={styles.value}>
                  {poAddressData?.parentPo?.gstNo || ""}
                </Text>
              </Text>
            </View>
          </View>

          {/* To Section */}
          <View style={styles.infoColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>To</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Company Name{" "}
                <Text style={styles.value}>
                  {poAddressData?.from?.name || ""}
                </Text>
              </Text>
              <Text style={styles.label}>
                Address{" "}
                <Text style={styles.value}>
                  {formatAddress([
                    poAddressData?.from?.doorNo || "",
                    poAddressData?.from?.streetName || "",
                    poAddressData?.from?.city || "",
                    poAddressData?.from?.pincode || "",
                  ])}
                </Text>
              </Text>
              <Text style={styles.label}>
                Phone{" "}
                <Text style={styles.value}>
                  {poAddressData?.from?.phone || ""}
                </Text>
              </Text>
              <Text style={styles.label}>
                GST{" "}
                <Text style={styles.value}>
                  {poAddressData?.from?.gstNo || ""}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* PO Details Section */}
      {pageNumber === 1 && orderTypes !== "fair" && (
        <View style={styles.cardContainer}>
          {/* PO Details Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>PO Details</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                PO Number{" "}
                <Text style={styles.value}>
                  {`IV${poAddressData?.poDetails?.poNumber}` || ""}
                </Text>{" "}
                PO Date{" "}
                <Text style={styles.value}>
                  {formatDateMinusOne(poAddressData?.poDetails?.poDate) || ""}
                </Text>
              </Text>
              <Text style={styles.label}>
                Due Date:{" "}
                <Text style={styles.value}>
                  {poAddressData?.poDetails?.dueDate || ""}
                </Text>{" "}
                Mode:{" "}
                <Text style={styles.value}>
                  {poAddressData?.poDetails?.mode || ""}
                </Text>
              </Text>
              <Text style={styles.label}>
                Purchase Manager:{" "}
                <Text style={styles.value}>
                  {poAddressData?.counterDetails?.purchaseManager || "-"}
                </Text>
              </Text>
              <Text style={styles.label}>
                Purchase Incharge:{" "}
                <Text style={styles.value}>
                  {poAddressData?.counterDetails?.purchaseIncharge || "-"}
                </Text>
              </Text>
            </View>
          </View>

          {/* Delivery Location Card - CORRECTED: Now uses parentPo address */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Delivery Location</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Address{" "}
                <Text style={styles.value}>
                  {formatAddress([
                    poAddressData?.parentPo?.doorNo || "",
                    poAddressData?.parentPo?.streetName || "",
                    poAddressData?.parentPo?.city || "",
                    poAddressData?.parentPo?.pincode || "",
                  ])}
                </Text>
              </Text>
              <Text style={styles.label}>
                Payment Type{" "}
                <Text style={styles.value}>
                  {(() => {
                    try {
                      if (poAddressData?.delivery) {
                        const deliveryData =
                          typeof poAddressData.delivery === "string"
                            ? JSON.parse(poAddressData.delivery)
                            : poAddressData.delivery;
                        return deliveryData?.payment_Type || "-";
                      }
                      return "-";
                    } catch (error) {
                      return "-";
                    }
                  })()}
                </Text>
              </Text>
              <Text style={styles.label}>
                Location Type{" "}
                <Text style={styles.value}>
                  {(() => {
                    try {
                      if (poAddressData?.delivery) {
                        const deliveryData =
                          typeof poAddressData.delivery === "string"
                            ? JSON.parse(poAddressData.delivery)
                            : poAddressData.delivery;
                        return deliveryData.locationType || "-";
                      }
                      return "-";
                    } catch (error) {
                      return "-";
                    }
                  })()}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Products Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {columns.map((col, index) => (
            <View key={index} style={[styles.tableCell, { width: col.width }]}>
              <Text style={styles.tableHeaderCell}>{col.header}</Text>
            </View>
          ))}
        </View>

        {Array.isArray(data) &&
          data.map((item, index) => {
            const itemIsTct = isTctOrder(item.poNumber);
            const netWeight = parseFloat(item.net_weight) || 0;
            const wastagePercent = parseFloat(item.wastage) || 0;
            const meltingPercent = parseFloat(item.melting) || 0;

            // Calculate adjusted values
            const adjustedWastage = calculateAdjustedWastage(
              wastagePercent,
              itemIsTct
            );
            const wastageWt = calculateWastageWeight(
              netWeight,
              wastagePercent,
              itemIsTct
            );
            const meltingWt = calculateMeltingWeight(netWeight, meltingPercent);
            // pure_wt = wastageWt + meltingWt
            const pureWt = wastageWt + meltingWt;

            return (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 1 && styles.alternateRow,
                ]}
              >
                {columns.map((col, colIndex) => {
                  // Skip calculated fields for Pcs weightage
                  if (
                    (col.field === "stone_cost" ||
                      col.field === "pure_wt" ||
                      col.field === "melting" ||
                      col.field === "wastage" ||
                      col.field === "wastageWt" ||
                      col.field === "meltingWt" ||
                      col.field === "makingCharges") &&
                    item.productWeightage === "Pcs"
                  ) {
                    return (
                      <View
                        key={colIndex}
                        style={[styles.tableCell, { width: col.width }]}
                      >
                        <Text style={styles.tableCellContent}>0</Text>
                      </View>
                    );
                  }

                  // Handle wastage - show adjusted value for TCT
                  if (col.field === "wastage") {
                    return (
                      <View
                        key={colIndex}
                        style={[styles.tableCell, { width: col.width }]}
                      >
                        <Text style={styles.tableCellContent}>
                          {adjustedWastage.toFixed(2)}
                        </Text>
                      </View>
                    );
                  }

                  // Handle wastageWt - use calculated value
                  if (col.field === "wastageWt") {
                    return (
                      <View
                        key={colIndex}
                        style={[styles.tableCell, { width: col.width }]}
                      >
                        <Text style={styles.tableCellContent}>
                          {wastageWt.toFixed(3)}
                        </Text>
                      </View>
                    );
                  }

                  // Handle meltingWt - use calculated value
                  if (col.field === "meltingWt") {
                    return (
                      <View
                        key={colIndex}
                        style={[styles.tableCell, { width: col.width }]}
                      >
                        <Text style={styles.tableCellContent}>
                          {meltingWt.toFixed(3)}
                        </Text>
                      </View>
                    );
                  }

                  // Handle pure_wt - wastageWt + meltingWt
                  if (col.field === "pure_wt") {
                    return (
                      <View
                        key={colIndex}
                        style={[styles.tableCell, { width: col.width }]}
                      >
                        <Text style={styles.tableCellContent}>
                          {pureWt.toFixed(3)}
                        </Text>
                      </View>
                    );
                  }

                  // Handle normal fields
                  return (
                    <View
                      key={colIndex}
                      style={[styles.tableCell, { width: col.width }]}
                    >
                      {col.field === "product_image" ? (
                        item.product_image ? (
                          item.product_image.includes(
                            "adv.back.spacetextiles.net"
                          ) ? (
                            <Image
                              src={item.product_image}
                              style={styles.productImage}
                            />
                          ) : (
                            <Link src={item.product_image}>
                              <Text style={styles.imageLink}>View Image</Text>
                            </Link>
                          )
                        ) : (
                          <Text style={styles.tableCellContent}>No Image</Text>
                        )
                      ) : (
                        <Text style={styles.tableCellContent}>
                          {col.field === "sno"
                            ? (pageNumber - 1) * 10 + index + 1
                            : item[col.field] || "-"}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
      </View>

      {/* Summary Section - Only on last page */}
      <RenderSummary isLastPage={isLastPage} totals={totals} datas={data} />

      {/* Footer */}
      {isLastPage && orderTypes !== "fair" && (
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            {isTct ? "JOB" : "PURCHASE"} ORDER TERMS AND CONDITIONS
          </Text>
          {isTct
            ? // Job order conditions
              [
                "Goods should be delivered within 15 days from the receipt of the Job order.",
                "Goods should be delivered in a completely finished manner.",
                "If any of the products in this Job order fail the hallmark test, the entire quantity in the Job order may be returned at no cost to us.",
                "The invoice should contain the Job order number.",
                // `For any queries regarding this Job order, please contact: ${phoneNumber}.`,
              ].map((condition, index) => (
                <View key={index}>
                  <Text style={styles.footerText}>
                    {index + 1}. {condition}
                  </Text>
                </View>
              ))
            : // Purchase order conditions
              [
                "Goods should be delivered within 15 days from the receipt of the purchase order.",
                "Goods should be delivered in a completely finished manner.",
                "If any of the products in this purchase order fail the hallmark test, the entire quantity in the purchase order may be returned at no cost to us.",
                "The invoice should contain the purchase order number.",
                "The bill set should include the following:",
                // `For any queries regarding this purchase order, please contact: ${phoneNumber}.`,
              ].map((condition, index) => (
                <View key={index}>
                  <Text style={styles.footerText}>
                    {index + 1}. {condition}
                  </Text>
                  {condition.includes("bill set") && (
                    <View style={{ marginLeft: 10 }}>
                      {[
                        "Courier receipt (if applicable) or the authorized person's name and phone number.",
                        "Original invoice along with three copies.",
                        "Packing list.",
                        "Calculation workings.",
                      ].map((item, subIndex) => (
                        <Text key={subIndex} style={styles.footerText}>
                          {String.fromCharCode(97 + subIndex)}) {item}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
          {/* {approvedBy && (
            <View style={styles.approvalInfo}>
              <Text>Digitally Approved By: Balaji.S (Bullion Manager)</Text>
            </View>
          )} */}
            {approvedBy && (
           <View style={styles.approvalInfo}>
             <Text>Digitally Approved By: Balaji.S</Text>
             <Text>Date: {formatDateMinusOne(poAddressData?.poDetails?.poDate) || ""}</Text>
             <Text>Time: {timeOnly}</Text>
           </View>
         )}
        </View>
      )}

      <Text style={styles.pageNumber}>
        Page {pageNumber} of {totalPages}
      </Text>
    </Page>
  );
};

// PODocument Component
const PODocument = ({ submittedData = [], poAddressData, orderTypes }) => {
  const dataArray = Array.isArray(submittedData) ? submittedData : [];

  // Group data by PO number
  const groupedData = dataArray.reduce((acc, item) => {
    const poNumber = item.poNumber || "default";
    if (!acc[poNumber]) {
      acc[poNumber] = [];
    }
    acc[poNumber].push(item);
    return acc;
  }, {});

  return (
    <Document>
      {Object.entries(groupedData).map(([poNumber, poData]) => {
        const ITEMS_PER_PAGE = 10;
        const chunks = [];

        for (let i = 0; i < poData.length; i += ITEMS_PER_PAGE) {
          chunks.push(poData.slice(i, i + ITEMS_PER_PAGE));
        }

        if (chunks.length === 0) {
          chunks.push([]);
        }

        const totalPages = chunks.length;
        const totals = calculateTotals(poData);

        return chunks.map((chunk, index) => (
          <POPage
            key={`${poNumber}-${index}`}
            data={chunk}
            pageNumber={index + 1}
            totalPages={totalPages}
            isLastPage={index === chunks.length - 1}
            totals={totals}
            poAddressData={poAddressData}
            orderTypes={orderTypes}
          />
        ));
      })}
    </Document>
  );
};

// Hook for generating and sending PDF to server
export const useTctSendToServer = ({
  submittedData,
  poAddressData,
  onPdfGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const { userRole } = useContext(DashBoardContext);

  const generateFilename = (poData) => {
    const poNumber = poData?.poDetails?.poNumber || "PO";
    const date = new Date().toISOString().split("T")[0];
    return `${poNumber}_${date}.pdf`;
  };

  const generateQRCodeDataURL = async (value) => {
    try {
      return await QRCode.toDataURL(value, {
        width: 80,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    } catch (err) {
      console.error("Error generating QR code:", err);
      return null;
    }
  };

  const generatePdf = async (
    filteredItems,
    poData,
    submittedData,
    orderTypes
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Validate data before proceeding
      if (!Array.isArray(filteredItems) || filteredItems.length === 0) {
        console.error("Missing submitted data:", filteredItems);
        throw new Error("No valid data provided for PDF generation");
      }

      if (!poData) {
        console.error("Missing PO address data");
        throw new Error("No address data provided for PDF generation");
      }

      const qrCodeDataURL = await generateQRCodeDataURL(
        poData?.poDetails?.poNumber || "Unknown PO"
      );

      const doc = (
        <PODocument
          submittedData={filteredItems}
          poAddressData={{ ...poData, qrCodeDataURL }}
          orderTypes={orderTypes}
        />
      );

      // Generate PDF blob
      const blob = await pdf(doc).toBlob();

      // Create File object from blob
      const pdfFile = new File([blob], generateFilename(poData), {
        type: "application/pdf",
        lastModified: new Date().getTime(),
      });

      // Create form data for sending to server
      const formData = new FormData();
      formData.append("file", pdfFile);
      formData.append("poNumber", `IV${poData?.poDetails?.poNumber ?? ""}`);
      formData.append("supplierName", "THE CHENNAI TRADERS" ?? "");
      formData.append("phoneNumber", "7418994888");
      formData.append("user", userRole);

      // Send to server
      const response = await axios.post(
        `${API}/gold_po/tct_upload_po`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        if (typeof onPdfGenerated === "function") {
          onPdfGenerated(pdfFile);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error generating/uploading PDF:", err);
      setError(err.message || "Failed to generate PDF");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generatePdf, error, isGenerating };
};

export default PODocument;




