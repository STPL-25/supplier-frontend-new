
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Link, Svg, Path, pdf } from "@react-pdf/renderer";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import {  useContext } from "react";
import moment from "moment";
import RenderSummary from "../PdfStyledComponent/RenderSummary";
import styles from "../PdfStyledComponent/PdfStyled";
import QRCodeComponent from "../PdfStyledComponent/QrCodeComp";
import { getColumns } from "../PdfStyledComponent/GetCoulmns";

const sktmImage = "/images/Skt.png";
const tct = "/images/tct.png";
const sktmgarsons = "/images/grasons.png";
const sktmspace = "/images/stpl.png";

// Calculate totals based on data properties
const calculateTotals = (data) => {
  const totals = {
    totalPieces: 0,
    totalGrossWeight: 0,
    totalNetWeight: 0,
    totalAmount: 0,
    totalDiamondWeight: 0,
    totalStoneWeight: 0,
    totalGoldWeight: 0,
    totalPlatinumWeight: 0,
  };

  const calcPureWeight = data.some((item) => item.productWeightage !== "Pcs");
  if (calcPureWeight) {
    totals.totalPureWeight = 0;
  }

  return data.reduce((acc, item) => {
    acc.totalPieces += parseFloat(item.pieces) || 0;
    acc.totalGrossWeight += parseFloat(item.gross_weight) || 0;
    acc.totalNetWeight += parseFloat(item.net_weight) || 0;
    acc.totalAmount += parseFloat(item.amount) || 0;

    if (item.diamondwt) {
      acc.totalDiamondWeight += parseFloat(item.diamondwt) || 0;
    }

    if (item.stone_weight) {
      acc.totalStoneWeight += parseFloat(item.stone_weight) || 0;
    }

    if (item.metal_type === "Gold_Diamond_Platinum") {
      if (item.goldwt) {
        acc.totalGoldWeight += parseFloat(item.goldwt) || 0;
      }
      if (item.platinumWt) {
        acc.totalPlatinumWeight += parseFloat(item.platinumWt) || 0;
      }
    }

    if (calcPureWeight && item.productWeightage !== "Pcs" && item.pure_wt) {
      acc.totalPureWeight += parseFloat(item.pure_wt) || 0;
    }

    return acc;
  }, totals);
};

// Helper Functions
const formatAddress = (parts) => {
  return parts.filter((part) => part && part.trim()).join(", ");
};

// Watermark Component
const Watermark = () => (
  <View style={styles.watermark}>
    <Text style={styles.watermarkText}>DRAFT</Text>
  </View>
);

// Safe JSON parse helper
function safeJsonParse(value, fallback = null) {
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
}

// POPage Component
const POPage = ({
  data,
  pageNumber,
  totalPages,
  isLastPage,
  totals,
  poAddressData,
  pdfType,
}) => {
  const columns = getColumns(data);
  console.log("data", data);
  const phoneNumber =
    data[0].metal_type === "Gold"
      ? "+91 9629570888, +91 9789680888"
      : data[0].metal_type === "Silver"
      ? "+91 8220576888, +91 9629221888"
      : data[0].metal_type === "Diamond" ||
        data[0].metal_type === "Gold_Diamond" ||
        data[0].metal_type === "Gold_Diamond_Platinum" ||
        data[0].metal_type === "Platinum"
      ? "9790527888"
      : "";
  const catagory = data[0].CATEGORYNAME || "";
  const hallmarking = data[0].hallmark || "";
  const isTct = data[0].poNumber?.includes("TCT");
  const approvedBy = data[0].poApprovedBy;
  const approvedTime = data[0].poApprovedDate;
  const parsedMoment = moment(approvedTime);
  const type=data[0].type;
  const dateOnly = parsedMoment.format("YYYY-MM-DD");
  const timeOnly = parsedMoment.format("HH:mm:ss");

  return (
    <Page size="A4" style={styles.page}>
      {pdfType === "trial" && <Watermark />}
      
      {pageNumber === 1 && (
        <>
          <View style={{ position: "absolute", top: 20, right: 20, zIndex: 100 }}>
            <QRCodeComponent value={poAddressData?.poDetails?.poNumber || "Unknown PO"} />
          </View>
          
          <Image
            source={
              poAddressData?.poDetails?.poNumber?.includes("STPL")
                ? sktmspace
                : poAddressData?.poDetails?.poNumber?.includes("GPL")
                ? sktmgarsons
                : poAddressData?.poDetails?.poNumber?.includes("TCT")
                ? tct
                : sktmImage
            }
            style={
              poAddressData?.poDetails?.poNumber?.includes("TCT")
                ? styles.headerLogoTct
                : styles.headerLogo
            }
          />
          
          <View style={styles.header}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {isTct ? "Job Order" : "Purchase Order"}
              </Text>
            </View>
          </View>
        </>
      )}

      {pageNumber === 1 && (
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>From</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.value}>
                {poAddressData?.our_company_details?.name}
              </Text>
              <Text style={styles.value}>
                {poAddressData?.our_company_details?.subTitle}
              </Text>
              <Text style={styles.label}>
                Address{" "}
                <Text style={styles.value}>
                  {formatAddress([
                    poAddressData?.our_company_details?.doorNo,
                    poAddressData?.our_company_details?.streetName,
                    poAddressData?.our_company_details?.city,
                    poAddressData?.our_company_details?.pincode,
                  ])}
                </Text>
              </Text>
              <Text style={styles.label}>
                Phone{" "}
                <Text style={styles.value}>
                  {poAddressData?.our_company_details?.phone}
                </Text>
              </Text>
              <Text style={styles.label}>
                GST{" "}
                <Text style={styles.value}>
                  {poAddressData?.our_company_details?.gstNo}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoColumn}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>To</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.label}>
                Supplier Name{" "}
                <Text style={styles.value}>{poAddressData?.supplier?.name}</Text>
              </Text>
              <Text style={styles.label}>
                Address{" "}
                <Text style={styles.value}>
                  {formatAddress([
                    poAddressData?.supplier?.doorNo,
                    poAddressData?.supplier?.streetName,
                    poAddressData?.supplier?.city,
                    poAddressData?.supplier?.pincode,
                  ])}
                </Text>
              </Text>
              <Text style={styles.label}>
                Phone{" "}
                <Text style={styles.value}>{poAddressData?.supplier?.phone}</Text>
              </Text>
              <Text style={styles.label}>
                GST{" "}
                <Text style={styles.value}>{poAddressData?.supplier?.gstNo}</Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              {isTct ? "Job Order" : "PO"} Details
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.label}>
              {isTct ? "Job No" : "PO Number"}
              <Text style={styles.value}>{poAddressData?.poDetails?.poNumber}</Text>{" "}
              {isTct ? "Issue Date" : "PO Date"} :{" "}
              <Text style={styles.value}>{poAddressData?.poDetails?.poDate}</Text>
            </Text>
            <Text style={styles.label}>
              Due Date:{" "}
              <Text style={styles.value}>{poAddressData?.poDetails?.dueDate}</Text>{" "}
              Mode:{" "}
              <Text style={styles.value}>{poAddressData?.poDetails?.mode}</Text>
            </Text>
              <Text style={styles.label}>
              Category:{" "}
              <Text style={styles.value}>{catagory||""}</Text>{" "}
           
            </Text>
            <Text style={styles.label}>
              Pur Managers:{" "}
              <Text style={styles.value}>
                {poAddressData?.counterDetails?.purchaseManager ?? "-"}
              </Text>{" "}
              Pur Incharge:{" "}
              <Text style={styles.value}>
                {poAddressData?.counterDetails?.purchaseIncharge ?? "-"}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Delivery Location</Text>
          </View>
          <View style={styles.sectionContent}>
            {(() => {
              const deliveryData = safeJsonParse(poAddressData?.delivery, {
                address: "A.Ku Towers, Crosscut Road,Coimbatore,Tamil Nadu,641012,0422-2490888",
                paymentType: '',
                locationType: 'Direct'
              });

              return (
                <>
                  <Text style={styles.label}>
                    Address{" "}
                    <Text style={styles.value}>
                       {formatAddress([
                    poAddressData?.our_company_details?.doorNo,
                    poAddressData?.our_company_details?.streetName,
                    poAddressData?.our_company_details?.city,
                    poAddressData?.our_company_details?.pincode,
                  ])}
                    </Text>
                  </Text>
                  <Text style={styles.label}>
                    Payment Type{" "}
                    <Text style={styles.value}>{deliveryData?.paymentType ?? "-"}</Text>
                  </Text>
                    <Text style={styles.label}>
                    Hallmark Type{" "}
                    <Text style={styles.value}>{hallmarking}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Location Type{" "}
                    <Text style={styles.value}>{deliveryData?.locationType ?? "-"}</Text>
                  </Text>
                </>
              );
            })()}
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {columns.map((col, index) => (

          <>
            {col.header==='Rate'?
            <View key={index} style={[styles.tableCell, { width: col.width }]}>
              <Text style={styles.tableHeaderCell}>{`${type} ${col.header}`}</Text>
            </View>:
            <View key={index} style={[styles.tableCell, { width: col.width }]}>
              <Text style={styles.tableHeaderCell}>{col.header}</Text>
            </View>}
            </>
          ))}
        </View>

        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}
          >
            {columns.map((col, colIndex) => {
              // if (col.field === "product_name" && item.orderType === "office") {
              //   return (
              //     <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
              //       <Text style={styles.tableCellContent}>-</Text>
              //     </View>
              //   );
              // }

              if (
                (col.field === "stone_cost" ||
                  col.field === "pure_wt" ||
                  col.field === "melting" ||
                  col.field === "wastage" ||
                  col.field === "makingCharges") &&
                item.productWeightage === "Pcs"
              ) {
                return (
                  <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                    <Text style={styles.tableCellContent}>0</Text>
                  </View>
                );
              }

              if ((col.field === "meltingWt" || col.field === "wastageWt") && col.body) {
                if (item.productWeightage === "Pcs") {
                  return (
                    <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                      <Text style={styles.tableCellContent}>0</Text>
                    </View>
                  );
                }
                
                const calculatedValue = col.body(item);
                
                return (
                  <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                    <Text style={styles.tableCellContent}>
                      {calculatedValue !== undefined ? calculatedValue.toFixed(2) : "-"}
                    </Text>
                  </View>
                );
              }

              return (
                <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                  {col.field === "product_image" ? (
                    item.product_image ? (
                      item.product_image.includes("adv.back.spacetextiles.net") ? (
                        <Image src={item.product_image} style={styles.productImage} />
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
        ))}
      </View>

      <RenderSummary isLastPage={isLastPage} totals={totals} datas={data} />

      {isLastPage && (
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            {isTct ? "JOB" : "PURCHASE"} ORDER TERMS AND CONDITIONS
          </Text>
          {isTct
            ? [
                "Goods should be delivered within 15 days from the receipt of the Job order.",
                "Goods should be delivered in a completely finished manner.",
                "If any of the products in this Job order fail the hallmark test, the entire quantity in the Job order may be returned at no cost to us.",
                "The invoice should contain the Job order number.",
                `For any queries regarding this Job order, please contact: ${phoneNumber}.`,
              ].map((condition, index) => (
                <View key={index}>
                  <Text style={styles.footerText}>
                    {index + 1}. {condition}
                  </Text>
                </View>
              ))
            : [
                "Goods should be delivered within 15 days from the receipt of the purchase order.",
                "Goods should be delivered in a completely finished manner.",
                "If any of the products in this purchase order fail the hallmark test, the entire quantity in the purchase order may be returned at no cost to us.",
                "The invoice should contain the purchase order number.",
                "The bill set should include the following:",
                `For any queries regarding this purchase order, please contact: ${phoneNumber}.`,
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
          {approvedBy && (
            <View style={styles.approvalInfo}>
              <Text>Digitally Approved By: {approvedBy} (PM)</Text>
              <Text>Date: {dateOnly}</Text>
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
const PODocument = ({ submittedData = [], poAddressData, pdfType }) => {
  const groupByPoNumber = (data) => {
    return data.reduce((acc, item) => {
      const poNumber = item.poNumber || "default";
      if (!acc[poNumber]) {
        acc[poNumber] = [];
      }
      acc[poNumber].push(item);
      return acc;
    }, {});
  };

  const chunkData = (data) => {
    const chunks = [];
    chunks.push(data);
    return chunks;
  };

  const groupedData = groupByPoNumber(submittedData);
  
  return (
    <Document>
      {Object.entries(groupedData).map(([poNumber, poData]) => {
        const dataChunks = chunkData(poData);
        const totalPages = dataChunks.length;
        const totals = calculateTotals(poData);

        return dataChunks.map((chunk, index) => (
          <POPage
            key={`${poNumber}-${index}`}
            data={chunk}
            pageNumber={index + 1}
            totalPages={totalPages}
            isLastPage={index === dataChunks.length - 1}
            totals={totals}
            poAddressData={{
              ...poAddressData,
              poDetails: {
                ...poAddressData?.poDetails,
              },
            }}
            pdfType={pdfType}
          />
        ));
      })}
    </Document>
  );
};

// Main PurchaseOrderGenerator Component
const PurchaseOrderGenerator = ({
  submittedData = [],
  poAddressData,
  selectedPoNumber,
  pdfType = "final",
}) => {
  const { roleData } = useContext(DashBoardContext);

  // Generate unique filename based on PO number and date
  const generateFilename = () => {
    const poNumber = poAddressData?.poDetails?.poNumber || "PO";
    const date = new Date().toISOString().split("T")[0];
    const suffix = pdfType === "trial" ? "_TRIAL" : "";
    return `${poNumber}${suffix}_${date}.pdf`;
  };

  // Validation check - button shows if we have data
  const isDataValid = submittedData && submittedData.length > 0 && poAddressData;

  // Show nothing if no data is available
  if (!isDataValid) {
    return (
      <div className="w-full flex justify-center p-4">
        <div className="text-gray-500 text-center">
          <p>No purchase order data available for PDF generation.</p>
          <p className="text-sm mt-2">Please select filters and load data first.</p>
        </div>
      </div>
    );
  }
  console.log(submittedData, poAddressData, pdfType);
  return (
    <div className="w-full flex justify-center p-4">
      {console.log(submittedData, poAddressData,pdfType)}
      <PDFDownloadLink
        document={
          <PODocument
            submittedData={submittedData}
            poAddressData={poAddressData}
            pdfType={pdfType}
          />
        }
        fileName={generateFilename()}
      >
        {({ loading, error }) => (
          <button
            className={`px-4 py-2 sm:px-6 sm:py-3 ${
              pdfType === "trial"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white rounded-lg transition-colors duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            disabled={loading || error}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : error ? (
              <>
                <span>⚠️</span>
                Error generating PDF
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {pdfType === "trial"
                  ? "Download Trial Purchase Order PDF"
                  : "Download Purchase Order PDF"}
              </>
            )}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PurchaseOrderGenerator;
