// export const Sales_Report_Config = [
//   { field: "RPTDATE", label: "Report Date", require: true, view: true, type: 'date', input: false },
//   { field: "GOLDSALWGT", label: "Gold Sales Weight (g)", require: false, view: true, type: 'number', input: false },
//   { field: "TOTSALVAL", label: "Total Sales Amt", require: false, view: true, type: 'number', input: false },
//   { field: "CHIT_TRN_VAL", label: "Chit Collection Amt", require: false, view: true, type: 'number', input: false },
//   { field: "DIGI_GOLD_WGT", label: "Digi Gold Weight (g)", require: false, view: true, type: 'number', input: false },
//   { field: "DIGI_GOLD_PURE_CONV_WGT", label: "Digi Gold Weight", require: false, view: false, type: 'number', input: false },
//   { field: "OG_WGT_GRAM", label: "OG Purchase Wt (g)", require: false, view: true, type: 'number', input: false },
//   { field: "NIDHI_VAL", label: "Nidhi Amt", require: false, view: true, type: 'number', input: false },
//   { field: "NIDHI_COMVERT_WGT", label: "Nidhi Convert Weight", require: false, view: false, type: 'number', input: false },
//   { field: "OG_WGT_PURRATE", label: "OG Purchase Amt", require: false, view: true, type: 'number', input: false },
//   { field: "CHIT_CLOSE_VAL", label: "Chit Closing Amt", require: false, view: true, type: 'number', input: false },
//   { field: "CHIT_DIFF_VAL", label: "Chit Benefit Amt", require: false, view: true, type: 'number', input: false },
//   { field: "CHIT_DIFF_CONV_WGT", label: "Chit Diff Conv Weight", require: false, view: false, type: 'number', input: false },
//   { field: "NET_SALES_WGT", label: "Net Sales Weight (g) (Gold Sale Wt -Og Purchase Wt)", require: false, view: true, type: 'number', input: false },
//   { field: "WGT_RATE_FIX_CONVERT", label: "Weight Rate Fix Convert", require: false, view: false, type: 'number', input: false },
//   { field: "NET_VALUE_RATE_FIX", label: "Net Amt Rate Fix", require: false, view: true, type: 'number', input: false },
//   { field: "GOLD_SALE_RATE", label: "Gold Sale Rate", require: false, view: true, type: 'number', input: false },
//   { field: "GOLD_99_90_PERC_RATE", label: "Gold 99.90% Rate", require: false, view: false, type: 'number', input: false },
//   { field: "GOLD_99_90_PERC_GST", label: "Gold 99.90% GST", require: false, view: false, type: 'number', input: false },
//   { field: "GOLD_99_99_PERC_RATE", label: "Gold 99.99% Rate", require: false, view: false, type: 'number', input: false },
//   { field: "GOLD_100PERC_PURRATE", label: "Gold 100% Pure Rate", require: false, view: true, type: 'number', input: false },
//   { field: "AKSHYA_TRI_SALE_VAL", label: "Akshaya Tritiya Sale Amt", require: false, view: false, type: 'number', input: false },
//   { field: "AKSHYA_TRI_SALE_CONVERT_WGT", label: "Akshaya Tritiya Sale Conv Weight", require: false, view: false, type: 'number', input: false },
//   { field: "GO_WI_DIA_WGT", label: "Gold with Diamond Weight", require: false, view: true, type: 'number', input: false },
//   { field: "OG_GO_WI_DIA_WGT", label: "OG Gold with Diamond Weight", require: false, view: false, type: 'number', input: false },
//   { field: "GO_WI_DIA_PURE_WGT", label: "Gold with Diamond Pure Weight", require: false, view: false, type: 'number', input: false },
//   { field: "CUS_ORD_WGT", label: "Customer Order Weight (g)", require: false, view: true, type: 'number', input: false },
//   { field: "CUS_ORD_PURE_CONV_WGT", label: "Customer Order Pure Conv Weight", require: false, view: false, type: 'number', input: false },
 
// ];
export const Sales_Report_Config =[
  //InWard
   { field: "RPTDATE", label: "Report Date", require: true, view: true, type: 'date', input: false },
  { field: "GOLDSALWGT", label: "Gold Sales Weight (g)", require: false, view: true, type: 'number', input: false },
  { field: "TOTSALVAL", label: "Total Sales Amt", require: false, view: true, type: 'number', input: false },
  { field: "CHIT_TRN_VAL", label: "Chit Collection Amt", require: false, view: true, type: 'number', input: false },
  { field: "CHIT_TRN_WT", label: "Chit Collection Wt", require: false, view: true, type: 'number', input: false },
  { field: "NIDHI_VAL", label: "Nidhi Amt", require: false, view: true, type: 'number', input: false },
 { field: "NIDHI_ACT_WT", label: "Nidhi  Wt", require: false, view: true, type: 'number', input: false },


  { field: "DIGI_GOLD_WGT", label: "Digi Gold Weight (g)", require: true, view: true, type: 'number', input: false },
  { field: "DIGI_GOLD_PURE_CONV_WGT", label: "Digi Gold Pure Weight", require: true, view: false, type: 'number', input: false },
 
 
  { field: "AKSHYA_TRI_SALE_VAL", label: "Akshaya Tritiya Sale Amt", require: false, view: false, type: 'number', input: false },
  { field: "AKSHYA_TRI_SALE_CONVERT_WGT", label: "Akshaya Tritiya Sale Conv Weight", require: false, view: false, type: 'number', input: false },
  { field: "GO_WI_DIA_WGT", label: "Gold with Diamond Weight", require: false, view: true, type: 'number', input: false },
  { field: "GO_WI_DIA_PURE_WGT", label: "Gold with Diamond Pure Weight", require: true, view: false, type: 'number', input: false },
  { field: "CUS_ORD_WGT", label: "Customer Order Weight (g)", require: false, view: true, type: 'number', input: false },
  { field: "CUS_ORD_PURE_CONV_WGT", label: "Customer Order Pure Conv Weight", require: true, view: false, type: 'number', input: false },
 //OutWard 
   { field: "OG_WGT_PURRATE", label: "OG Purchase Amt", require: false, view: true, type: 'number', input: false },
  { field: "OG_WGT_GRAM", label: "OG Purchase Wt (g)", require: false, view: true, type: 'number', input: false },
  { field: "OG_GO_WI_DIA_WGT", label: "OG Gold with Diamond Weight", require: true, view: false, type: 'number', input: false },
   { field: "CHIT_CLOSE_VAL", label: "Chit Closing Amt", require: false, view: true, type: 'number', input: false },
   { field: "CHIT_CLS_WT", label: "Chit Closing Wt", require: false, view: true, type: 'number', input: false },
  // { field: "CHIT_DIFF_VAL", label: "Chit Benefit Amt", require: false, view: true, type: 'number', input: false },
  { field: "CHIT_DIFF_CONV_WGT", label: "Chit Diff Conv Weight", require: false, view: false, type: 'number', input: false },
//Net Values
  { field: "NIDHI_COMVERT_WGT", label: "Nidhi converted Wt", require: false, view: true, type: 'number', input: false },
  { field: "NET_SALES_WGT", label: "Net Sales Weight (g) (Gold Sale Wt -Og Purchase Wt)", require: false, view: true, type: 'number', input: false },
  { field: "WGT_RATE_FIX_CONVERT", label: "Weight Rate Fix Convert", require: false, view: false, type: 'number', input: false },
  { field: "NET_VALUE_RATE_FIX", label: "Net Amt Rate Fix", require: false, view: true, type: 'number', input: false },
  { field: "GOLD_SALE_RATE", label: "Gold Sale Rate", require: false, view: true, type: 'number', input: false },
  { field: "GOLD_99_90_PERC_RATE", label: "Gold 99.90% Rate", require: false, view: false, type: 'number', input: false },
  { field: "GOLD_99_90_PERC_GST", label: "Gold 99.90% GST", require: false, view: false, type: 'number', input: false },
  { field: "GOLD_99_99_PERC_RATE", label: "Gold 99.99% Rate", require: false, view: false, type: 'number', input: false },
  { field: "GOLD_100PERC_PURRATE", label: "Gold 100% Pure Rate", require: false, view: true, type: 'number', input: false },
  //final Values
   { field: "CLOSING_VALUE_FORMATTED", label: "Closing Value", require: false, view: true, type: 'number', input: false },
  { field: "TOTAL_METAL_IN_FORMATTED", label: "Inflow", require: false, view: true, type: 'number', input: false },
  { field: "TOTAL_METAL_OUT_FORMATTED", label: "Outflow", require: false, view: true, type: 'number', input: false },
  { field: "CLOSING_WT_FORMATTED", label: "Closing Wt", require: false, view: true, type: 'number', input: false },
  { field: "PURE_WT_KG_FORMATTED", label: "Pure Wt in Kgs", require: false, view: true, type: 'number', input: false },
 
]

export const Fund_Planning_Con_Report_Config = [
  {
    name: "RPTDATE",
    label: "Report Date",
    type: "text",
    placeholder: "Report Date",
    required: true,
    readonly: true,
    gridColumns: "md:col-span-2"
  },
  {
    name: "GOLD_SALE_RATE",
    label: "Gold Sale Rate (₹/g)",
    type: "number",
    placeholder: "Gold Sale Rate",
    required: true,
    readonly: true,
    gridColumns: "md:col-span-2",
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  // Metal In Section
  {
    name: "GOLDSALWGT",
    label: "Gold Sales Weight (g)",
    type: "number",
    placeholder: "Gold Sales Weight",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "GOLDSALWGT_VALUE",
    label: "Gold Sales Value (₹)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.GOLDSALWGT || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CHIT_TRN_VAL",
    label: "Chit Transaction (₹)",
    type: "number",
    placeholder: "Chit Transaction Value",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CHIT_TRN_WGT",
    label: "Chit Transaction Weight (g)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.CHIT_TRN_VAL || 0) / (row.GOLD_SALE_RATE || 1),
    render: (value) => parseFloat(value).toFixed(2)
  },
  {
    name: "CUS_ADV_WGT",
    label: "Customer Advance Weight (g)",
    type: "number",
    placeholder: "Customer Advance Weight",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "CUS_ADV_WGT_VALUE",
    label: "Customer Advance Value (₹)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.CUS_ADV_WGT || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CUS_ADV_RATE_FIX_WGT",
    label: "Customer Advance Rate Fix (g)",
    type: "number",
    placeholder: "Customer Advance Rate Fix Weight",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "CUS_ADV_RATE_FIX_VALUE",
    label: "Customer Advance Rate Fix Value (₹)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.CUS_ADV_RATE_FIX_WGT || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "NIDHI_VAL",
    label: "Nidhi Value (₹)",
    type: "number",
    placeholder: "Nidhi Value",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "NIDHI_WGT",
    label: "Nidhi Weight (g)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.NIDHI_VAL || 0) / (row.GOLD_SALE_RATE || 1),
    render: (value) => parseFloat(value).toFixed(2)
  },
  {
    name: "DIGI_GOLD_WGT",
    label: "Digital Gold Weight (g)",
    type: "number",
    placeholder: "Digital Gold Weight",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "DIGI_GOLD_VALUE",
    label: "Digital Gold Value (₹)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.DIGI_GOLD_WGT || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CUS_ORD_WGT",
    label: "Customer Order Weight (g)",
    type: "number",
    placeholder: "Customer Order Weight",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "CUS_ORD_VALUE",
    label: "Customer Order Value (₹)",
    type: "calculated",
    category: "Metal In",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.CUS_ORD_WGT || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  // Metal Out Section
  {
    name: "OG_WGT_GRAM",
    label: "Old Gold Weight (g)",
    type: "number",
    placeholder: "Old Gold Weight",
    category: "Metal Out",
    gridColumns: "md:col-span-2",
    render: (value) => parseFloat(value || 0).toFixed(2)
  },
  {
    name: "OG_WGT_VALUE",
    label: "Old Gold Value (₹)",
    type: "calculated",
    category: "Metal Out",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.OG_WGT_GRAM || 0) * (row.GOLD_SALE_RATE || 1),
    render: (value) => `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CHIT_CLOSE_VAL",
    label: "Chit Closing Value (₹)",
    type: "number",
    placeholder: "Chit Closing Value",
    category: "Metal Out",
    gridColumns: "md:col-span-2",
    render: (value) => `₹${parseFloat(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  },
  {
    name: "CHIT_CLOSE_WGT",
    label: "Chit Closing Weight (g)",
    type: "calculated",
    category: "Metal Out",
    gridColumns: "md:col-span-2",
    calculate: (row) => (row.CHIT_CLOSE_VAL || 0) / (row.GOLD_SALE_RATE || 1),
    render: (value) => parseFloat(value).toFixed(2)
  },
  // Summary Section
  {
    name: "TOTAL_METAL_IN",
    label: "Total Metal In (g)",
    type: "calculated",
    category: "Summary",
    gridColumns: "md:col-span-2",
    calculate: (row) => {
      const goldRate = row.GOLD_SALE_RATE || 1;
      return (
        (row.GOLDSALWGT || 0) +
        (row.CHIT_TRN_VAL || 0) / goldRate +
        (row.CUS_ADV_WGT || 0) +
        (row.CUS_ADV_RATE_FIX_WGT || 0) +
        (row.NIDHI_VAL || 0) / goldRate +
        (row.DIGI_GOLD_WGT || 0) +
        (row.CUS_ORD_WGT || 0)
      );
    },
    render: (value) => parseFloat(value).toFixed(2),
    className: "font-bold text-green-600"
  },
  {
    name: "TOTAL_METAL_OUT",
    label: "Total Metal Out (g)",
    type: "calculated",
    category: "Summary",
    gridColumns: "md:col-span-2",
    calculate: (row) => {
      const goldRate = row.GOLD_SALE_RATE || 1;
      return (
        (row.OG_WGT_GRAM || 0) +
        (row.CHIT_CLOSE_VAL || 0) / goldRate
      );
    },
    render: (value) => parseFloat(value).toFixed(2),
    className: "font-bold text-red-600"
  },
  {
    name: "NET_POSITION",
    label: "Net Position (In - Out) (g)",
    type: "calculated",
    category: "Summary",
    gridColumns: "md:col-span-2",
    calculate: (row) => {
      const goldRate = row.GOLD_SALE_RATE || 1;
      const totalIn = (
        (row.GOLDSALWGT || 0) +
        (row.CHIT_TRN_VAL || 0) / goldRate +
        (row.CUS_ADV_WGT || 0) +
        (row.CUS_ADV_RATE_FIX_WGT || 0) +
        (row.NIDHI_VAL || 0) / goldRate +
        (row.DIGI_GOLD_WGT || 0) +
        (row.CUS_ORD_WGT || 0)
      );
      const totalOut = (
        (row.OG_WGT_GRAM || 0) +
        (row.CHIT_CLOSE_VAL || 0) / goldRate
      );
      return totalIn - totalOut;
    },
    render: (value) => {
      const val = parseFloat(value);
      return `${val >= 0 ? '+' : ''}${val.toFixed(2)}`;
    },
    className: (value) => value >= 0 ? "font-bold text-blue-600" : "font-bold text-orange-600"
  },
  {
    name: "PURE_CONVERSION",
    label: "Pure Conversion (99.99%) (g)",
    type: "calculated",
    category: "Summary",
    gridColumns: "md:col-span-2",
    calculate: (row) => {
      const goldRate = row.GOLD_SALE_RATE || 1;
      const totalIn = (
        (row.GOLDSALWGT || 0) +
        (row.CHIT_TRN_VAL || 0) / goldRate +
        (row.CUS_ADV_WGT || 0) +
        (row.CUS_ADV_RATE_FIX_WGT || 0) +
        (row.NIDHI_VAL || 0) / goldRate +
        (row.DIGI_GOLD_WGT || 0) +
        (row.CUS_ORD_WGT || 0)
      );
      const totalOut = (
        (row.OG_WGT_GRAM || 0) +
        (row.CHIT_CLOSE_VAL || 0) / goldRate
      );
      const netPosition = totalIn - totalOut;
      return netPosition * 0.9999;
    },
    render: (value) => {
      const val = parseFloat(value);
      return `${val >= 0 ? '+' : ''}${val.toFixed(2)}`;
    },
    className: (value) => value >= 0 ? "font-bold text-blue-600" : "font-bold text-orange-600"
  }
];

