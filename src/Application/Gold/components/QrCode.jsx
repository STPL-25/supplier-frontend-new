// Define default columns with conditional rendering
const getColumns = (data) => {
  // Base columns that are always shown
  const baseColumns = [
    { width: "5%", field: "sno", header: "S.No" },
    { width: "8%", field: "product", header: "Product" },
    { width: "5%", field: "pieces", header: "Pcs" },
    { width: "5%", field: "rate", header: "Rate" },
    { width: "7%", field: "gross_weight", header: "Grs Wt" },
    { width: "7%", field: "stone_weight", header: "Stn Wt" },
    { width: "7%", field: "net_weight", header: "Net Wt" },
    { width: "8%", field: "amount", header: "Amount" },
    { width: "5%", field: "product_image", header: "Images" },
  ];

  // Check if any item has orderType !== 'office' to show product_name
  const showProductName = data.some(item => item.orderType !== 'office');
  
  // Check if any item has productWeightage !== 'Pcs' to show additional columns
  const showAdditionalColumns = data.some(item => item.productWeightage !== 'Pcs');
  
  let columns = [...baseColumns];
  
  // Insert product_name column at position 3 if needed
  if (showProductName) {
    columns.splice(2, 0, { width: "8%", field: "product_name", header: "Sub product Name" });
  }
  
  // Add additional columns for non-Pcs items if needed
  if (showAdditionalColumns) {
    // These columns only show if at least one item has productWeightage !== 'Pcs'
    columns = [
      ...columns,
      { width: "8%", field: "stone_cost", header: "Stn Cost" },
      { width: "7%", field: "wax_weight", header: "Wax Wt" },
      { width: "7%", field: "melting", header: "Melting %" },
      { width: "7%", field: "wastage", header: "Wastage %" },
      { width: "7%", field: "makingCharges", header: "Making Charges %" },
      { width: "7%", field: "pure_wt", header: "Fine Wt" },
    ];
  }
  
  return columns;
};

// Modify the calculateTotals function to be conditional based on data
const calculateTotals = (data) => {
  // Check if we need to calculate pure weight (only for non-Pcs items)
  const calcPureWeight = data.some(item => item.productWeightage !== 'Pcs');
  
  return data.reduce(
    (acc, item) => {
      const totals = {
        totalPieces: (acc.totalPieces || 0) + (parseFloat(item.pieces) || 0),
        totalGrossWeight: (acc.totalGrossWeight || 0) + (parseFloat(item.gross_weight) || 0),
        totalNetWeight: (acc.totalNetWeight || 0) + (parseFloat(item.net_weight) || 0),
        totalAmount: (acc.totalAmount || 0) + (parseFloat(item.amount) || 0),
      };
      
      // Only calculate pure weight for items that are not 'Pcs' weightage
      if (calcPureWeight) {
        totals.totalPureWeight = (acc.totalPureWeight || 0) + 
          (item.productWeightage !== 'Pcs' ? (parseFloat(item.pure_wt) || 0) : 0);
      }
      
      return totals;
    },
    {}
  );
};

// Update the Summary Section in POPage Component
const renderSummary = (isLastPage, totals, data) => {
  if (!isLastPage) return null;
  
  // Check if we should show pure weight in summary
  const showPureWeight = data.some(item => item.productWeightage !== 'Pcs');
  
  return (
    <View style={styles.summary}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Pieces:</Text>
        <Text style={styles.summaryValue}>
          {totals.totalPieces?.toFixed(2)}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Gross Weight:</Text>
        <Text style={styles.summaryValue}>
          {totals.totalGrossWeight?.toFixed(3)} g
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Net Weight:</Text>
        <Text style={styles.summaryValue}>
          {totals.totalNetWeight?.toFixed(3)} g
        </Text>
      </View>
      {showPureWeight && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Pure Weight:</Text>
          <Text style={styles.summaryValue}>
            {totals.totalPureWeight?.toFixed(3)} g
          </Text>
        </View>
      )}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total Amount (INR):</Text>
        <Text style={styles.summaryValue}>
          {totals.totalAmount?.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

// Update the POPage Component
const POPage = ({
  data,
  pageNumber,
  totalPages,
  isLastPage,
  totals,
  poAddressData,
  pdfType,
}) => {
  // Get dynamic columns based on data
  const columns = getColumns(data);
  
  return (
    <Page size="A4" style={styles.page}>
      {/* Existing code for watermark, header, etc. */}
      {/* ... */}
      
      {/* Table Section */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          {columns.map((col, index) => (
            <View key={index} style={[styles.tableCell, { width: col.width }]}>
              <Text style={styles.tableHeaderCell}>{col.header}</Text>
            </View>
          ))}
        </View>

        {data.map((item, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}
          >
            {columns.map((col, colIndex) => {
              // Skip product_name column for items with orderType === 'office'
              if (col.field === 'product_name' && item.orderType === 'office') {
                return <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                  <Text style={styles.tableCellContent}>-</Text>
                </View>;
              }
              
              // Skip stone cost, fine wt, melting, wastage, making charges for Pcs weightage
              if ((col.field === 'stone_cost' || col.field === 'pure_wt' || 
                  col.field === 'melting' || col.field === 'wastage' || 
                  col.field === 'makingCharges') && 
                  item.productWeightage === 'Pcs') {
                return <View key={colIndex} style={[styles.tableCell, { width: col.width }]}>
                  <Text style={styles.tableCellContent}>-</Text>
                </View>;
              }
              
              return (
                <View
                  key={colIndex}
                  style={[styles.tableCell, { width: col.width }]}
                >
                  {col.field === "product_image" ? (
                    <Link src={item.product_image}>
                      <Text style={styles.imageLink}>View Image</Text>
                    </Link>
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

      {/* Summary Section - Only on last page */}
      {renderSummary(isLastPage, totals, data)}

      {/* Existing code for footer, etc. */}
      {/* ... */}
    </Page>
  );
};

// Update PODocument Component to pass dynamic columns
const PODocument = ({
  submittedData = [],
  poAddressData,
  pdfType,
}) => {
  // Group data by PO number
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

  // Chunk data into pages (if needed)
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