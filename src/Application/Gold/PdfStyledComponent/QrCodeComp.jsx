import QRCode from "qrcode";
import { useEffect, useState, useContext } from "react";
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
const QRCodeComponent = ({ value }) => {
    const [qrDataURL, setQrDataURL] = useState("");
  
    useEffect(() => {
      const generateQRCode = async () => {
        try {
          const url = await QRCode.toDataURL(value, {
            width: 80,
            margin: 1,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          setQrDataURL(url);
        } catch (err) {
          console.error("Error generating QR code:", err);
        }
      };
  
      if (value) {
        generateQRCode();
      }
    }, [value]);
  
    // Return SVG image for React PDF
    return qrDataURL ? (
      <Image src={qrDataURL} style={{ width: 80, height: 80 }} />
    ) : null;
  };

  export default QRCodeComponent;