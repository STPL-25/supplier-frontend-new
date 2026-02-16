// export const getColumns = (data) => {
//     // Base columns that are always shown
//     const DEFAULT_COLUMNS = [
//       { width: "5%", field: "sno", header: "S.No" },
//       { width: "8%", field: "product", header: "Product" },
//       { width: "8%", field: "product_name", header: "Sub product Name" },
//       { width: "5%", field: "pieces", header: "Pcs" },
//       { width: "5%", field: "rate", header: "Rate" },
//       { width: "7%", field: "gross_weight", header: "Grs Wt" },
//       { width: "7%", field: "stone_weight", header: "Stn Wt" },
//       { width: "8%", field: "stone_cost", header: "Stn Cost" },
//       { width: "7%", field: "wax_weight", header: "Wax Wt" },
//       { width: "7%", field: "net_weight", header: "Net Wt" },
//       { width: "8%", field: "amount", header: "Amount" },
//       { width: "7%", field: "melting", header: "Melting %" },
//       { width: "7%", field: "wastage", header: "Wastage %" },
//       { width: "7%", field: "makingCharges", header: "Making Charges %" },
//       { width: "7%", field: "pure_wt", header: "Fine Wt" },
//       { width: "5%", field: "product_image", header: "Images" },
//     ];
//     const baseColumns = [
//       { width: "5%", field: "sno", header: "S.No" },
//       { width: "10%", field: "product", header: "Product" },
//       { width: "10%", field: "pieces", header: "Pcs" },
//       { width: "10%", field: "rate", header: "Rate" },
//       { width: "15%", field: "amount", header: "Amount" },
//       { width: "10%", field: "gross_weight", header: "Grs Wt" },
//       { width: "10%", field: "stone_weight", header: "Stn Wt" },
//       { width: "10%", field: "wax_weight", header: "Wax Wt" },
  
//       { width: "10%", field: "net_weight", header: "Net Wt" },
//       { width: "10%", field: "product_image", header: "Images" },
//     ];
  
//     // Check if any item has orderType !== 'office' to show product_name
//     const showProductName = data.some((item) => item.orderType !== "office");
  
//     // Check if any item has productWeightage !== 'Pcs' to show additional columns
//     const showAdditionalColumns = data.some(
//       (item) => item.productWeightage !== "Pcs"
//     );
  
//     // Check if any item has metal_type === "Gold_Diamond_Platinum"
//     const showGoldPlatinumDiamond = data.some(
//       (item) => item.metal_type === "Gold_Diamond_Platinum"
//     );
  
//     console.log("Gold Diamond Platinum Items:", showGoldPlatinumDiamond);
  
//     let columns = [...baseColumns];
  
//     // Insert product_name column at position 3 if needed
//     if (showProductName) {
//       columns.splice(2, 0, {
//         width: "8%",
//         field: "product_name",
//         header: "Sub product Name",
//       });
//     }
  
//     // Handle different column configurations based on product types
//     if (showAdditionalColumns && !showGoldPlatinumDiamond) {
//       // These columns show if at least one item has productWeightage !== 'Pcs' but no Gold_Diamond_Platinum
//       columns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "9%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "diamondwt", header: "Dia Wt" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt" },
//         { width: "8%", field: "stone_cost", header: "Stn Cost" },
//         { width: "7%", field: "wax_weight", header: "Wax Wt" },
//         { width: "8%", field: "net_weight", header: "Net Wt" },
//         { width: "8%", field: "amount", header: "Amount" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "7%", field: "pure_wt", header: "Fine Wt" },
//         { width: "8%", field: "product_image", header: "Images" },
//       ];
//     } else if (showGoldPlatinumDiamond) {
//       columns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "10%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "diamondwt", header: "Dia Ct" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt (g)" },
//         { width: "8%", field: "goldwt", header: "Gold ne Wt" },
//         { width: "8%", field: "platinumWt", header: "Pt grs Wt" },
//         { width: "8%", field: "net_weight", header: "Pt Net Wt" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
  
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
  
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "10%", field: "product_image", header: "Images" },
//       ];
//     }
  
//     // Add product_name column if needed, after reconfiguring columns
//     if (showProductName && (showAdditionalColumns || showGoldPlatinumDiamond)) {
//       columns.splice(2, 0, {
//         width: "8%",
//         field: "product_name",
//         header: "Sub product Name",
//       });
//     }
  
//     return columns;
//   };

/**
 * Generates dynamic table columns based on data characteristics
 * @param {Array} data - Array of data items to analyze for column configuration
 * @return {Array} Configured columns for the table
 */
/**

 */
// export const getColumns = (data) => {
//     // Guard clause for empty data
//     if (!data || data.length === 0) {
//         return [];
//     }

//     // Detect special data characteristics
//     const columTypeWithoutDia = data[0].productType === "GO";
//     const columTypeWithGoldAndPlatinum = data[0].productType === "GP";
//     const columTypeWithGoldAndPlatinumAndDiamond = data[0].productType === "GDP";

//     const showProductName = data.some(item => item.orderType !== "office");
//     const showAdditionalColumns = data.some(item => item.productWeightage !== "Pcs");
//     const showGoldPlatinumDiamond = data.some(item => item.metal_type === "Gold_Diamond_Platinum");
    
//     // Define base columns (default configuration)
//     const baseColumns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "10%", field: "product", header: "Product" },
//         { width: "10%", field: "pieces", header: "Pcs" },
//         { width: "10%", field: "rate", header: "Rate" },
//         { width: "15%", field: "amount", header: "Amount" },
//         { width: "10%", field: "gross_weight", header: "Grs Wt" },
//         { width: "10%", field: "stone_weight", header: "Stn Wt" },
//         { width: "10%", field: "wax_weight", header: "Wax Wt" },
//         { width: "10%", field: "net_weight", header: "Net Wt" },
//         { width: "10%", field: "product_image", header: "Images" }
//     ];
    
//     // Define specialized columns for non-piece items without diamond
//     const nonPieceColumnsWithoutDiamond = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "9%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt" },
//         { width: "8%", field: "stone_cost", header: "Stn Cost" },
//         { width: "7%", field: "wax_weight", header: "Wax Wt" },
//         { width: "8%", field: "net_weight", header: "Net Wt" },
//         { width: "8%", field: "amount", header: "Amount" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "7%", field: "pure_wt", header: "Fine Wt" },
//         { width: "8%", field: "product_image", header: "Images" }
//     ];

//     // Define specialized columns for non-piece items with diamond
//     const nonPieceColumns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "9%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "diamondwt", header: "Dia Wt" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt" },
//         { width: "8%", field: "stone_cost", header: "Stn Cost" },
//         { width: "7%", field: "wax_weight", header: "Wax Wt" },
//         { width: "8%", field: "net_weight", header: "Net Wt" },
//         { width: "8%", field: "amount", header: "Amount" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "7%", field: "pure_wt", header: "Fine Wt" },
//         { width: "8%", field: "product_image", header: "Images" }
//     ];
    
//     // Define specialized columns for gold-diamond-platinum items
//     const goldPlatinumDiamondColumns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "10%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "diamondwt", header: "Dia Ct" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt (g)" },
//         { width: "8%", field: "goldwt", header: "Gold Net Wt" },
//         { width: "8%", field: "platinumWt", header: "Pt Grs Wt" },
//         { width: "8%", field: "net_weight", header: "Pt Net Wt" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "10%", field: "product_image", header: "Images" }
//     ];

//     // Define specialized columns for gold-platinum items
//     const goldPlatinumColumns = [
//         { width: "5%", field: "sno", header: "S.No" },
//         { width: "10%", field: "product", header: "Product" },
//         { width: "5%", field: "pieces", header: "Pcs" },
//         { width: "8%", field: "gross_weight", header: "Grs Wt" },
//         { width: "8%", field: "stone_weight", header: "Stn Wt (g)" },
//         { width: "8%", field: "goldwt", header: "Gold Net Wt" },
//         { width: "8%", field: "platinumWt", header: "Pt Grs Wt" },
//         { width: "8%", field: "net_weight", header: "Pt Net Wt" },
//         { width: "7%", field: "melting", header: "Melting %" },
//         { width: "7%", field: "meltingWt", header: "Melting wt" },
//         { width: "7%", field: "wastage", header: "Wastage %" },
//         { width: "7%", field: "wastageWt", header: "Wastage wt" },
//         { width: "7%", field: "makingCharges", header: "MC %" },
//         { width: "10%", field: "product_image", header: "Images" }
//     ];
    
//     // The product name column to insert when needed
//     const productNameColumn = {
//         width: "8%",
//         field: "product_name",
//         header: "Sub product Name"
//     };
  
//     // Select the appropriate column set based on data characteristics
//     let columns;
    
//     if (showGoldPlatinumDiamond && columTypeWithGoldAndPlatinumAndDiamond) {
//         columns = [...goldPlatinumDiamondColumns];
//     } else if (columTypeWithGoldAndPlatinum) {
//         columns = [...goldPlatinumColumns];
//     } else if (columTypeWithoutDia) {
//         columns = [...nonPieceColumnsWithoutDiamond];
//     } else if (showAdditionalColumns) {
//         columns = [...nonPieceColumns];
//     } else {
//         columns = [...baseColumns];
//     }
    
//     // Insert product name column if needed (at position 2, after product)
//     if (showProductName) {
//         columns.splice(2, 0, productNameColumn);
//     }
    
//     return columns;
// };

export const getColumns = (data) => {
    // Guard clause for empty data
    console.log(data)
    if (!data || data.length === 0) {
        return [];
    }

    // Detect special data characteristics
    const columTypeWithoutDia = data[0].productType === "GO";
    const columTypeWithGoldAndPlatinum = data[0].productType === "GP";
    const columTypeWithGoldAndPlatinumAndDiamond = data[0].productType === "GDP";

    const showProductName = data.some(item => item.orderType !== "office");
    const showAdditionalColumns = data.some(item => item.productWeightage !== "Pcs");
    const showGoldPlatinumDiamond = data.some(item => item.metal_type === "Gold_Diamond_Platinum");
    const type=data[0].type;
    // Define base columns (default configuration)
    const baseColumns = [
        { 
            width: "5%", 
            field: "sno", 
            header: "S.No" 
        },
        { 
            width: "10%", 
            field: "product_name", 
            header: "Product" 
        },
        { 
            width: "10%", 
            field: "pieces", 
            header: "Pcs" 
        },
        { 
            width: "10%", 
            field: 'rate', 
            header: "Rate" 
        },
        // { 
        //     width: "15%", 
        //     field: "amount", 
        //     header: "Amount" 
        // },
        { 
            width: "10%", 
            field: "gross_weight", 
            header: "Grs Wt" 
        },
        { 
            width: "10%", 
            field: "stone_weight", 
            header: "Stn Wt" 
        },
        { 
            width: "10%", 
            field: "wax_weight", 
            header: "Wax Wt" 
        },
        { 
            width: "10%", 
            field: "net_weight", 
            header: "Net Wt" 
        },
        { 
            width: "10%", 
            field: "product_image", 
            header: "Images" 
        }
    ];
    
    // Define specialized columns for non-piece items without diamond
    const nonPieceColumnsWithoutDiamond = [
        { 
            width: "5%", 
            field: "sno", 
            header: "S.No" 
        },
        { 
            width: "9%", 
            field: "product_name", 
            header: "Product" 
        },
        { 
            width: "5%", 
            field: "pieces", 
            header: "Pcs" 
        },
        { 
            width: "8%", 
            field: "gross_weight", 
            header: "Grs Wt" 
        },
        { 
            width: "8%", 
            field: "stone_weight", 
            header: "Stn Wt" 
        },
        { 
            width: "8%", 
            field: "stone_cost", 
            header: "Stn Cost" 
        },
        { 
            width: "7%", 
            field: "wax_weight", 
            header: "Wax Wt" 
        },
        { 
            width: "8%", 
            field: "net_weight", 
            header: "Net Wt" 
        },
         { 
            width: "10%", 
            field: "rate", 
            header: "Rate" 
        },
        // { 
        //     width: "8%", 
        //     field: "amount", 
        //     header: "Amount" 
        // },
        { 
            width: "7%", 
            field: "melting", 
            header: "Melting %" 
        },
        { 
            width: "7%", 
            field: "meltingWt", 
            header: "Melting wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) * parseFloat(rowData.melting)) / 100;
            }
        },
        { 
            width: "7%", 
            field: "wastage", 
            header: "Wastage %" 
        },
        { 
            width: "7%", 
            field: "wastageWt", 
            header: "Wastage wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) *parseFloat(rowData.wastage) ) / 100;
            }
        },
        { 
            width: "7%", 
            field: "makingCharges", 
            header: "MC %" 
        },
        { 
            width: "7%", 
            field: "pure_wt", 
            header: "Fine Wt" 
        },
        { 
            width: "8%", 
            field: "product_image", 
            header: "Images" 
        }
    ];

    // Define specialized columns for non-piece items with diamond
    const nonPieceColumns = [
        { 
            width: "5%", 
            field: "sno", 
            header: "S.No" 
        },
        { 
            width: "9%", 
            field: "product_name", 
            header: "Product" 
        },
        { 
            width: "5%", 
            field: "pieces", 
            header: "Pcs" 
        },
        { 
            width: "8%", 
            field: "gross_weight", 
            header: "Grs Wt" 
        },
        { 
            width: "8%", 
            field: "diamondwt", 
            header: "Dia Wt" 
        },
        { 
            width: "8%", 
            field: "stone_weight", 
            header: "Stn Wt" 
        },
        { 
            width: "8%", 
            field: "stone_cost", 
            header: "Stn Cost" 
        },
        { 
            width: "7%", 
            field: "wax_weight", 
            header: "Wax Wt" 
        },
        { 
            width: "8%", 
            field: "net_weight", 
            header: "Net Wt" 
        },
         { 
            width: "10%", 
            field: "rate", 
            header: "Rate" 
        },
        // { 
        //     width: "8%", 
        //     field: "amount", 
        //     header: "Amount" 
        // },
        { 
            width: "7%", 
            field: "melting", 
            header: "Melting %" 
        },
        { 
            width: "7%", 
            field: "meltingWt", 
            header: "Melting wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) * parseFloat(rowData.melting)) / 100;
            }
        },
        { 
            width: "7%", 
            field: "wastage", 
            header: "Wastage %" 
        },
        { 
            width: "7%", 
            field: "wastageWt", 
            header: "Wastage wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) *parseFloat(rowData.wastage) ) / 100;
            }
        },
        { 
            width: "7%", 
            field: "makingCharges", 
            header: "MC %" 
        },
        { 
            width: "7%", 
            field: "pure_wt", 
            header: "Fine Wt" 
        },
        { 
            width: "8%", 
            field: "product_image", 
            header: "Images" 
        }
    ];
    
    // Define specialized columns for gold-diamond-platinum items
    const goldPlatinumDiamondColumns = [
        { 
            width: "5%", 
            field: "sno", 
            header: "S.No" 
        },
        { 
            width: "10%", 
            field: "product_name", 
            header: "Product" 
        },
        { 
            width: "5%", 
            field: "pieces", 
            header: "Pcs" 
        },
        { 
            width: "8%", 
            field: "gross_weight", 
            header: "Grs Wt" 
        },
        { 
            width: "8%", 
            field: "diamondwt", 
            header: "Dia Ct" 
        },
        { 
            width: "8%", 
            field: "stone_weight", 
            header: "Stn Wt (g)" 
        },
        { 
            width: "8%", 
            field: "goldwt", 
            header: "Gold Net Wt" 
        },
        { 
            width: "8%", 
            field: "platinumWt", 
            header: "Pt Grs Wt" 
        },
        { 
            width: "8%", 
            field: "net_weight", 
            header: "Pt Net Wt" 
        },
        { 
            width: "6%", 
            field: "melting", 
            header: "Melting %" 
        },
        { 
            width: "8%", 
            field: "meltingWt", 
            header: "Melting wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) * parseFloat(rowData.melting)) / 100;
            }
        },
        { 
            width: "6%", 
            field: "wastage", 
            header: "Wastage %" 
        },
        { 
            width: "8%", 
            field: "wastageWt", 
            header: "Wastage wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) *parseFloat(rowData.wastage) ) / 100;
            }
        },
        { 
            width: "7%", 
            field: "makingCharges", 
            header: "MC %" 
        },
         { 
            width: "10%", 
            field: "rate", 
            header: "Rate" 
        },
        { 
            width: "10%", 
            field: "product_image", 
            header: "Images" 
        }
    ];

    // Define specialized columns for gold-platinum items
    const goldPlatinumColumns = [
        { 
            width: "5%", 
            field: "sno", 
            header: "S.No" 
        },
        { 
            width: "10%", 
            field: "product_name", 
            header: "Product" 
        },
        { 
            width: "5%", 
            field: "pieces", 
            header: "Pcs" 
        },
        { 
            width: "8%", 
            field: "gross_weight", 
            header: "Grs Wt" 
        },
        { 
            width: "8%", 
            field: "stone_weight", 
            header: "Stn Wt (g)" 
        },
        { 
            width: "8%", 
            field: "goldwt", 
            header: "Gold Net Wt" 
        },
        { 
            width: "8%", 
            field: "platinumWt", 
            header: "Pt Grs Wt" 
        },
        { 
            width: "8%", 
            field: "net_weight", 
            header: "Pt Net Wt" 
        },
        { 
            width: "7%", 
            field: "melting", 
            header: "Melting %" 
        },
        { 
            width: "7%", 
            field: "meltingWt", 
            header: "Melting wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) * parseFloat(rowData.melting)) / 100;
            }
        },
        { 
            width: "7%", 
            field: "wastage", 
            header: "Wastage %" 
        },
        { 
            width: "7%", 
            field: "wastageWt", 
            header: "Wastage wt",
            body: (rowData) => {
                return (parseFloat(rowData.net_weight) * parseFloat(rowData.wastage)) / 100;
            }
        },
        { 
            width: "7%", 
            field: "makingCharges", 
            header: "MC %" 
        },
         { 
            width: "10%", 
            field: "rate", 
            header: "Rate" 
        },
        { 
            width: "10%", 
            field: "product_image", 
            header: "Images" 
        }
    ];
    
    // The product name column to insert when needed
    const productNameColumn = {
        width: "8%",
        field: "product_name",
        header: "Sub product Name"
    };
  
    // Select the appropriate column set based on data characteristics
    let columns;
    
    if (showGoldPlatinumDiamond && columTypeWithGoldAndPlatinumAndDiamond) {
        columns = [...goldPlatinumDiamondColumns];
    } else if (columTypeWithGoldAndPlatinum) {
        columns = [...goldPlatinumColumns];
    } else if (columTypeWithoutDia) {
        columns = [...nonPieceColumnsWithoutDiamond];
    } else if (showAdditionalColumns) {
        columns = [...nonPieceColumns];
    } else {
        columns = [...baseColumns];
    }
    
    // Insert product name column if needed (at position 2, after product)
    if (showProductName) {
        columns.splice(2, 0, productNameColumn);
    }
    
    return columns;
};