function doPost(e) {
  if (!e || !e.parameter) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "No parameters received" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const row = [
    e.parameter.SupplierName || "",
    e.parameter.EstNo || "",
    e.parameter.ProductName || "",
    e.parameter.MetalType || "",
    e.parameter.WtMode || "",
    e.parameter.DesignNo || "",
    e.parameter.GCarat || "",
    e.parameter.PCS || "",
    e.parameter.GoldWt || "",
    e.parameter.GoldPurity || "",
    e.parameter.GoldPurityWt || "",
    e.parameter.Gold999Rate || "",
    e.parameter.GoldValue || "",
    e.parameter.PTWt || "",
    e.parameter.PTPurity || "",
    e.parameter.PTPurityWt || "",
    e.parameter.PT999Rate || "",
    e.parameter.PTValue || "",
    e.parameter.NoofStone || "",
    e.parameter.DCarat || "",
    e.parameter.DiamondWt || "",
    e.parameter.DiamondRate || "",
    e.parameter.DiamondValue || "",
    e.parameter.ClrStnPCS || "",
    e.parameter.CLSCarat || "",
    e.parameter.ClrStnWt || "",
    e.parameter.ClrStnRate || "",
    e.parameter.CSAmount || "",
    e.parameter.GoMcType || "",
    e.parameter.GoMcRate || "",
    e.parameter.GoMcAmount || "",
    e.parameter.PTMcType || "",
    e.parameter.PTMcRate || "",
    e.parameter.PTMcAmount || "",
    e.parameter.WastageType || "",
    e.parameter.WastageWeight || "",
    e.parameter.WastageAmt || "",
    e.parameter.CertType || "",
    e.parameter.CertGST || "",
    e.parameter.CertQty || "",
    e.parameter.CertRate || "",
    e.parameter.CertTaxableAmt || "",
    e.parameter.CertTotal || "",
    e.parameter.HallMarkType || "",
    e.parameter.HMGST || "",
    e.parameter.HMQty || "",
    e.parameter.HMRate || "",
    e.parameter.HMTaxableAmt || "",
    e.parameter.HMTotal || "",
    e.parameter.HandleRate || "",
    e.parameter.HandleAmount || "",
    e.parameter.GNetWt || "",
    e.parameter.PNetWt || "",
    e.parameter.TotalValue || "",
    e.parameter.GST || "",
    e.parameter.GrandTotal || "",
    e.parameter.HUID || ""
  ];

  sheet.appendRow(row);

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastColumn);
  const newRowRange = sheet.getRange(lastRow, 1, 1, lastColumn);
  headerRange.copyTo(newRowRange, { formatOnly: true });

  return ContentService
    .createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Replace with your Google Apps Script web app URL
const GOOGLE_SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";

const BulkUploadForm = ({ inputFields, totalDiamondData, totalClrstnData }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bulkData = {
      ...inputFields,
      diamondData: totalDiamondData,
      colorstoneData: totalClrstnData
    };

    try {
      const params = new URLSearchParams(bulkData).toString();
      const response = await axios.post(`${GOOGLE_SHEET_URL}?${params}`);

      if (response.data.status === "success") {
        toast.success("Bulk upload successful!");
      } else {
        toast.error("Bulk upload failed!");
      }
    } catch (error) {
      toast.error("Something went wrong while submitting.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Bulk Upload to Google Sheets</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BulkUploadForm;
