
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    PDFDownloadLink,
    Link,
    Svg,
    Path,
  } from "@react-pdf/renderer";
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 5,
      backgroundColor: "#ffffff",
      position: "relative", // Important for watermark positioning
    },
    watermark: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 10,
      right: 0,
      display: "flex",
      alignItems: "left",
      // justifyContent: "center",
      zIndex: 999, // Ensure watermark is behind content
    },
    watermarkText: {
      fontSize: 30,
      color: "rgba(211, 211, 211, 0.23)",
      // transform: "rotate(-45deg)",
      opacity: 10,
    },
    header: {
      flexDirection: "row",
      marginBottom: 15,
      alignItems: "center",
    },
    headerLogo: {
      width: 150,
      height: 50,
      marginLeft: "39%",
    },
    headerLogoTct: {
      width: 150,
      height: 50,
      marginLeft: "39%",
      objectFit: "contain",
      marginBottom: "5px",
    },
    headerContainer: {
      flex: 1,
      alignItems: "center",
    },
    headerTitle: {
      color: "#1e40af",
      marginTop: "15px",
      fontSize: 13,
      fontWeight: "extrabold",
    },
    infoGrid: {
      flexDirection: "row",
      gap: 15,
      height: "95px",
      marginBottom: 15,
    },
    cardContainer: {
      flexDirection: "row",
      gap: 15,
      marginBottom: 15,
      height: "80px",
    },
    infoColumn: {
      flex: 1,
      borderRadius: 6,
    },
    card: {
      flex: 1,
      borderRadius: 6,
    },
    sectionHeader: {
      backgroundColor: "#1e40af",
      padding: 5,
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
    },
    sectionHeaderText: {
      color: "#ffffff",
      fontSize: 10,
    },
    sectionContent: {
      backgroundColor: "#f8fafc",
      padding: 10,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderBottomLeftRadius: 6,
      borderBottomRightRadius: 6,
    },
    label: {
      fontSize: 8,
      color: "#64748b",
      marginBottom: 3,
    },
    value: {
      fontSize: 9,
      color: "#1e293b",
      marginBottom: 6,
      fontWeight: "bold",
    },
    table: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: "#1e40af",
      borderRadius: 4,
    },
    tableHeader: {
      backgroundColor: "#1e40af",
      flexDirection: "row",
      borderTopLeftRadius: 4,
      borderTopRightRadius: 4,
    },
    tableHeaderCell: {
      color: "#ffffff",
      padding: 4,
      fontSize: 7,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e2e8f0",
    },
    alternateRow: {
      backgroundColor: "#f8fafc",
    },
    tableCell: {
      padding: 4,
      fontSize: 7,
      height: 40,
      borderRightWidth: 1,
      borderRightColor: "#e2e8f0",
    },
    tableCellContent: {
      textAlign: "center",
    },
    summary: {
      marginTop: 15,
      padding: 10,
      backgroundColor: "#f8fafc",
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#e2e8f0",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center", // Added to vertically center items
      marginBottom: 5,
      borderBottomWidth: 1, // Optional: adds a light separator between rows
      borderBottomColor: "#e2e8f0",
      paddingBottom: 3,
    },
    summaryLabel: {
      fontSize: 8,
      color: "#64748b",
      flex: 1, // Added to ensure label takes consistent space
    },
    summaryValue: {
      fontSize: 8,
      color: "#1e293b",
      fontWeight: "bold",
      textAlign: "right", // Ensures values are right-aligned
      flex: 1, // Added to ensure value takes consistent space
    },
    footer: {
      marginTop: 20,
      padding: 10,
      borderTopWidth: 1,
      borderColor: "#e2e8f0",
    },
    footerTitle: {
      fontSize: 9,
      fontWeight: "bold",
      color: "#1e40af",
      marginBottom: 8,
    },
    footerText: {
      fontSize: 7,
      color: "#1e40af",
      marginBottom: 4,
    },
    pageNumber: {
      position: "absolute",
      bottom: 10,
      right: 10,
      fontSize: 8,
      color: "#64748b",
    },
    // approvalInfo: {
    //   backgroundColor: "#f8fafc",
    //   padding: 10,
    //   borderWidth: 1,
    //   borderColor: "#e2e8f0",
    //   borderRadius: 8,
    //   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    //   color: "#1e40af",
    //   textAlign: "right",
    //   fontSize: 12,
    //   // fontFamily: "'Inter', sans-serif",
    //   lineHeight: 0.5,
    //   marginTop: 5,
    //   marginBottom: 5,
    //   display: "flex",
    //   justifyContent: "flex-end",
    //   alignItems: "center",
    //   gap: 16,
    //   transition: "all 0.2s ease"
    // },
    approvalInfo: {
      backgroundColor: "#f8fafc",
      padding: 10,
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 8,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
      color: "#1e40af",
      textAlign: "right",
      fontSize: 12,
      lineHeight: 0.5,
      marginTop: 5,
      marginBottom: 5,
      display: "inline-block",
      alignSelf: "flex-end",
      gap: 16,
      transition: "all 0.2s ease",
      width: "auto",
    },
    imageLink: {
      color: "#2563eb",
      fontSize: 7,
      textDecoration: "underline",
    },
  });
  export default styles;
  

