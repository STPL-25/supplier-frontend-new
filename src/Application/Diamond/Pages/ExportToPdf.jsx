



import React from 'react';
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  header: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1a365d',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  table: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#2d3748',
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: 'bold',
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    padding: 4,
    fontSize: 8,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#2d3748',
  },
  groupHeader: {
    backgroundColor: '#4299e1',
    fontWeight: 'bold',
    fontSize: 10,
    padding: 6,
    textAlign: 'center',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  columnHeader: {
    backgroundColor: '#63b3ed',
    fontWeight: 'bold',
    fontSize: 8,
    padding: 4,
    textAlign: 'center',
    color: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
  },
  dataRow: {
    backgroundColor: '#ffffff',
  },
  alternateRow: {
    backgroundColor: '#f7fafc',
  },
  totalsRow: {
    backgroundColor: '#2d3748',
    fontWeight: 'bold',
    fontSize: 9,
    borderBottomWidth: 3,
    borderTopWidth: 3,
    borderColor: '#1a202c',
    color: '#ffffff',
    minHeight: 30,
  },
  totalCell: {
    backgroundColor: '#2d3748',
    fontWeight: 'bold',
    fontSize: 9,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#4a5568',
    textAlign: 'center',
    color: '#ffffff',
  },
});

const DiamondPDF = ({ data }) => {
  // console.log(data)
  
  const formatNumber = (value) => {
    if (!value) return '0.00';
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };
  
  const formatStackedItems = (items, key) => {
    if (!items?.length) return '';
    
    return items.map(item => {
      const value = item[key] || '';
      return key === 'Amount' && typeof value === 'number' 
        ? value.toFixed(3) 
        : value;
    }).join('\n\n');
  };

  // Check if columns have data
  const hasGoldData = data.some(row => 
    (row.GoldWt && Number(row.GoldWt) > 0) || 
    (row.GNetWt && Number(row.GNetWt) > 0) || 
    (row.GoldValue && Number(row.GoldValue) > 0) ||
    (row.GoldPurity && row.GoldPurity.trim() !== '')
  );

  const hasPlatinumData = data.some(row => 
    (row.PTWt && Number(row.PTWt) > 0) || 
    (row.PNetWt && Number(row.PNetWt) > 0) || 
    (row.PTValue && Number(row.PTValue) > 0) ||
    (row.PTPurity && row.PTPurity.trim() !== '')
  );

  const hasDiamondData = data.some(row => 
    row.Diamonds && row.Diamonds.length > 0 && 
    row.Diamonds.some(d => 
      (d.NoOfStones && Number(d.NoOfStones) > 0) || 
      (d.Carat && Number(d.Carat) > 0) || 
      (d.Value && Number(d.Value) > 0)
    )
  );

  const hasColorStoneData = data.some(row => 
    row.ColorStones && row.ColorStones.length > 0 && 
    row.ColorStones.some(s => 
      (s.Pcs && Number(s.Pcs) > 0) || 
      (s.csCarat && Number(s.csCarat) > 0) || 
      (s.Amount && Number(s.Amount) > 0)
    )
  );

  const hasWastageData = data.some(row => 
    row.WastageAmt && Number(row.WastageAmt) > 0
  );

  const hasGoldMakingData = data.some(row => 
    row.GoMcAmount && Number(row.GoMcAmount) > 0
  );

  const hasPtMakingData = data.some(row => 
    row.PTMcAmount && Number(row.PTMcAmount) > 0
  );

  const hasHandleChargeData = data.some(row => 
    row.HandleAmount && Number(row.HandleAmount) > 0
  );

  const hasHMData = data.some(row => 
    row.HMTaxableAmt && Number(row.HMTaxableAmt) > 0
  );

  const hasCertData = data.some(row => 
    row.CertTaxableAmt && Number(row.CertTaxableAmt) > 0
  );

  // Calculate dynamic widths
  const baseColumns = 2; // S.No + Description (always present)
  const metalColumns = (hasGoldData ? 1 : 0) + (hasPlatinumData ? 1 : 0); // Purity, Gross Wt, Net Wt, Value
  const diamondColumns = hasDiamondData ? 5 : 0; // Shape, Pcs, Cts, Rate, Amount
  const colorStoneColumns = hasColorStoneData ? 5 : 0; // Type, Pcs, Cts, Rate, Amount
  const chargeColumns = (hasWastageData ? 1 : 0) + 
                       ((hasGoldMakingData || hasPtMakingData || hasHandleChargeData) ? 1 : 0) + 
                       ((hasHMData || hasCertData) ? 1 : 0);
  const totalColumns = 1; // Grand Total (always present)

  const totalActiveColumns = baseColumns + 
    (metalColumns > 0 ? 3 : 0) + // If any metal data, show Purity, Gross, Net, Value
    diamondColumns + 
    colorStoneColumns + 
    chargeColumns + 
    totalColumns;

  // Dynamic width calculation
  const availableWidth = 100;
  const baseWidth = availableWidth / totalActiveColumns;

  // Width adjustments
  const snoWidth = Math.max(baseWidth * 0.6, 3);
  const descWidth = Math.max(baseWidth * 1.8, 8);
  const metalSectionWidth = metalColumns > 0 ? Math.max(baseWidth * 3, 15) : 0;
  const diamondSectionWidth = hasDiamondData ? Math.max(baseWidth * 5, 24) : 0;
  const colorStoneSectionWidth = hasColorStoneData ? Math.max(baseWidth * 5, 25) : 0;
  const chargeSectionWidth = chargeColumns > 0 ? Math.max(baseWidth * chargeColumns, 12) : 0;
  const totalWidth = Math.max(baseWidth, 7);

  // Distribute remaining width
  const usedWidth = snoWidth + descWidth + metalSectionWidth + diamondSectionWidth + 
                   colorStoneSectionWidth + chargeSectionWidth + totalWidth;
  const remainingWidth = Math.max(0, availableWidth - usedWidth);

  // Add remaining width to the largest section
  let adjustedDiamondWidth = diamondSectionWidth;
  let adjustedColorStoneWidth = colorStoneSectionWidth;
  let adjustedMetalWidth = metalSectionWidth;

  if (remainingWidth > 0) {
    if (diamondSectionWidth >= colorStoneSectionWidth && diamondSectionWidth >= metalSectionWidth) {
      adjustedDiamondWidth += remainingWidth;
    } else if (colorStoneSectionWidth >= metalSectionWidth) {
      adjustedColorStoneWidth += remainingWidth;
    } else if (metalSectionWidth > 0) {
      adjustedMetalWidth += remainingWidth;
    } else {
      // If no major sections, distribute to description
      const newDescWidth = descWidth + remainingWidth;
    }
  }

  const calculateTotals = () => {
    return data.reduce((acc, row) => ({
      diamondPcs: Math.round(acc.diamondPcs + (row.Diamonds?.reduce((sum, d) => sum + (Number(d.NoOfStones) || 0), 0) || 0)),
      diamondCts: Number((acc.diamondCts + (row.Diamonds?.reduce((sum, d) => sum + (Number(d.Carat) || 0), 0) || 0)).toFixed(3)),
      diamondValue: Math.round(acc.diamondValue + (row.Diamonds?.reduce((sum, d) => sum + (Number(d.Value) || 0), 0) || 0)),
      goldGrossWt: Number((acc.goldGrossWt + (Number(row.GoldWt) || 0)).toFixed(3)),
      goldNetWt: Number((acc.goldNetWt + (Number(row.GNetWt) || 0)).toFixed(3)),
      goldValue: Math.round(acc.goldValue + (Number(row.GoldValue) || 0)),
      ptGrossWt: Number((acc.ptGrossWt + (Number(row.PTWt) || 0)).toFixed(3)),
      ptNetWt: Number((acc.ptNetWt + (Number(row.PNetWt) || 0)).toFixed(3)),
      ptValue: Math.round(acc.ptValue + (Number(row.PTValue) || 0)),
      stonePcs: Math.round(acc.stonePcs + (row.ColorStones?.reduce((sum, s) => sum + (Number(s.Pcs) || 0), 0) || 0)),
      stoneCts: Number((acc.stoneCts + (row.ColorStones?.reduce((sum, s) => sum + (Number(s.csCarat) || 0), 0) || 0)).toFixed(3)),
      stoneValue:(acc.stoneValue + (row.ColorStones?.reduce((sum, s) => sum + (parseFloat(s.Amount) || 0), 0) || 0)),
      wastage: Math.round(acc.wastage + (Number(row.WastageAmt) || 0)),
      HMTaxableAmt: Math.round(acc.HMTaxableAmt + (Number(row.HMTaxableAmt) || 0)),
      goldMaking: Math.round(acc.goldMaking + (Number(row.GoMcAmount) || 0)),
      ptMaking: Math.round(acc.ptMaking + (Number(row.PTMcAmount) || 0)),
      CertTaxableAmt: Math.round(acc.CertTaxableAmt + (Number(row.CertTaxableAmt) || 0)),
      grandTotal: Math.round(acc.grandTotal + (Number(row.GrandTotal) || 0)),
      HandleAmount: Math.round(acc.HandleAmount + (Number(row.HandleAmount) || 0)),
    }), {
      diamondPcs: 0, diamondCts: 0, diamondValue: 0,
      goldGrossWt: 0, goldNetWt: 0, goldValue: 0,
      ptGrossWt: 0, ptNetWt: 0, ptValue: 0,
      stonePcs: 0, stoneCts: 0, stoneValue: 0,
      wastage: 0, goldMaking: 0, ptMaking: 0,
      CertTaxableAmt: 0, grandTotal: 0, HMTaxableAmt: 0, HandleAmount:0,
    });
  };

  const SubHeader = ({ width, children }) => (
    <Text style={[styles.columnHeader, { width: `${width}%` }]}>{children}</Text>
  );

  const DataCell = ({ width, children, isAlternate = false }) => (
    <Text style={[
      styles.cell, 
      { width: `${width}%` },
      isAlternate && { backgroundColor: '#f7fafc' }
    ]}>
      {children}
    </Text>
  );

  const TotalCell = ({ width, children }) => (
    <Text style={[styles.totalCell, { width: `${width}%` }]}>{children}</Text>
  );

  const GroupHeader = ({ width, children }) => (
    <Text style={[styles.groupHeader, { width: `${width}%` }]}>{children}</Text>
  );

  const totals = calculateTotals();
  // console.log(totals);
  
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.header}>Diamond Dealer Receipt</Text>
        <Text style={styles.subHeader}>
          {data[0]?.SupplierName} • {data[0]?.invoiceNumber ? `Invoice: ${data[0].invoiceNumber}` : `Estimate: ${data[0]?.EstNo}`}
        </Text>

        <View style={styles.table}>
          {/* Group Headers */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <GroupHeader width={snoWidth + descWidth}>Basic Details</GroupHeader>
            {adjustedMetalWidth > 0 && (
              <GroupHeader width={adjustedMetalWidth}>Metal Details</GroupHeader>
            )}
            {adjustedDiamondWidth > 0 && (
              <GroupHeader width={adjustedDiamondWidth}>Diamond Details</GroupHeader>
            )}
            {adjustedColorStoneWidth > 0 && (
              <GroupHeader width={adjustedColorStoneWidth}>ColorStone Details</GroupHeader>
            )}
            {chargeSectionWidth > 0 && (
              <GroupHeader width={chargeSectionWidth}>Charges</GroupHeader>
            )}
            <GroupHeader width={totalWidth}>Total</GroupHeader>
          </View>

          {/* Column Headers */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <SubHeader width={snoWidth}>S.No</SubHeader>
            <SubHeader width={descWidth}>Description</SubHeader>
            
            {adjustedMetalWidth > 0 && (
              <>
                <SubHeader width={adjustedMetalWidth * 0.25}>Purity</SubHeader>
                <SubHeader width={adjustedMetalWidth * 0.25}>Gross Wt</SubHeader>
                <SubHeader width={adjustedMetalWidth * 0.25}>Net Wt</SubHeader>
                <SubHeader width={adjustedMetalWidth * 0.25}>Value</SubHeader>
              </>
            )}
            
            {adjustedDiamondWidth > 0 && (
              <>
                <SubHeader width={adjustedDiamondWidth * 0.25}>Shape</SubHeader>
                <SubHeader width={adjustedDiamondWidth * 0.15}>Pcs</SubHeader>
                <SubHeader width={adjustedDiamondWidth * 0.2}>Cts</SubHeader>
                <SubHeader width={adjustedDiamondWidth * 0.2}>Rate</SubHeader>
                <SubHeader width={adjustedDiamondWidth * 0.2}>Amount</SubHeader>
              </>
            )}
            
            {adjustedColorStoneWidth > 0 && (
              <>
                <SubHeader width={adjustedColorStoneWidth * 0.34}>Type</SubHeader>
                <SubHeader width={adjustedColorStoneWidth * 0.1}>Pcs</SubHeader>
                <SubHeader width={adjustedColorStoneWidth * 0.16}>Cts</SubHeader>
                <SubHeader width={adjustedColorStoneWidth * 0.2}>Rate</SubHeader>
                <SubHeader width={adjustedColorStoneWidth * 0.2}>Amount</SubHeader>
              </>
            )}
            
            {hasWastageData && (
              <SubHeader width={chargeSectionWidth * (1/chargeColumns)}>Wastage</SubHeader>
            )}
            {(hasGoldMakingData || hasPtMakingData || hasHandleChargeData) && (
              <SubHeader width={chargeSectionWidth * (1/chargeColumns)}>Making</SubHeader>
            )}
            {(hasHMData || hasCertData) && (
              <SubHeader width={chargeSectionWidth * (1/chargeColumns)}>Cert & HM</SubHeader>
            )}
            
            <SubHeader width={totalWidth}>Value with GST</SubHeader>
          </View>

          {/* Data Rows */}
          {data.map((row, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
              <DataCell width={snoWidth} isAlternate={index % 2 === 1}>{index + 1}</DataCell>
              <DataCell width={descWidth} isAlternate={index % 2 === 1}>
                {`${row.ProductName || ''}\n\n${row.DesignNo || ''}\n\n${row.HUID || ''}`}
              </DataCell>
              
              {adjustedMetalWidth > 0 && (
                <>
                  <DataCell width={adjustedMetalWidth * 0.25} isAlternate={index % 2 === 1}>
                    {`${hasGoldData ? `G- ${row.GoldPurity || ''}` : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? `P-${row.PTPurity || ''}` : ''}`}
                  </DataCell>
                  <DataCell width={adjustedMetalWidth * 0.25} isAlternate={index % 2 === 1}>
                    {`${hasGoldData ? formatNumber(row.GoldWt) : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? formatNumber(row.PTWt) : ''}`}
                  </DataCell>
                  <DataCell width={adjustedMetalWidth * 0.25} isAlternate={index % 2 === 1}>
                    {`${hasGoldData ? formatNumber(row.GNetWt) : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? formatNumber(row.PNetWt) : ''}`}
                  </DataCell>
                  <DataCell width={adjustedMetalWidth * 0.25} isAlternate={index % 2 === 1}>
                    {`${hasGoldData ? Math.round(row.GoldValue) : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? Math.round(row.PTValue) : ''}`}
                  </DataCell>
                </>
              )}
              
              {adjustedDiamondWidth > 0 && (
                <>
                  <DataCell width={adjustedDiamondWidth * 0.25} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.Diamonds, 'ShapeShortName')}
                  </DataCell>
                  <DataCell width={adjustedDiamondWidth * 0.15} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.Diamonds, 'NoOfStones')}
                  </DataCell>
                  <DataCell width={adjustedDiamondWidth * 0.2} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.Diamonds, 'Carat')}
                  </DataCell>
                  <DataCell width={adjustedDiamondWidth * 0.2} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.Diamonds, 'Rate')}
                  </DataCell>
                  <DataCell width={adjustedDiamondWidth * 0.2} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.Diamonds, 'Value')}
                  </DataCell>
                </>
              )}
              
              {adjustedColorStoneWidth > 0 && (
                <>
                  <DataCell width={adjustedColorStoneWidth * 0.34} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.ColorStones, 'ShapeShortName')}
                  </DataCell>
                  <DataCell width={adjustedColorStoneWidth * 0.1} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.ColorStones, 'Pcs')}
                  </DataCell>
                  <DataCell width={adjustedColorStoneWidth * 0.16} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.ColorStones, 'csCarat')}
                  </DataCell>
                  <DataCell width={adjustedColorStoneWidth * 0.2} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.ColorStones, 'csRate')}
                  </DataCell>
                  <DataCell width={adjustedColorStoneWidth * 0.2} isAlternate={index % 2 === 1}>
                    {formatStackedItems(row.ColorStones, 'Amount')}
                  </DataCell>
                </>
              )}
              
              {hasWastageData && (
                <DataCell width={chargeSectionWidth * (1/chargeColumns)} isAlternate={index % 2 === 1}>
                  {Math.round(row.WastageAmt)}
                </DataCell>
              )}
              {(hasGoldMakingData || hasPtMakingData || hasHandleChargeData) && (
                <DataCell width={chargeSectionWidth * (1/chargeColumns)} isAlternate={index % 2 === 1}>
                  {`${hasGoldMakingData ? `G-${Math.round(row.GoMcAmount)}` : ''}${hasGoldMakingData && hasPtMakingData ? '\n\n' : ''}${hasPtMakingData ? `P-${Math.round(row.PTMcAmount)}` : ''}${(hasGoldMakingData || hasPtMakingData) && hasHandleChargeData ? '\n\n' : ''}${hasHandleChargeData ? `HC-${Math.round(row.HandleAmount)}` : ''}`}
                </DataCell>
              )}
              {(hasHMData || hasCertData) && (
                <DataCell width={chargeSectionWidth * (1/chargeColumns)} isAlternate={index % 2 === 1}>
                  {`${hasHMData ? `HM: ${Math.round(row.HMTaxableAmt)}` : ''}${hasHMData && hasCertData ? '\n\n' : ''}${hasCertData ? `Cert: ${Math.round(row.CertTaxableAmt)}` : ''}`}
                </DataCell>
              )}
              
              <DataCell width={totalWidth} isAlternate={index % 2 === 1}>
                {Math.round(row.GrandTotal)}
              </DataCell>
            </View>
          ))}

          {/* Totals Row */}
          <View style={[styles.tableRow, styles.totalsRow]}>
            <TotalCell width={snoWidth + descWidth}>GRAND TOTAL</TotalCell>
            
            {adjustedMetalWidth > 0 && (
              <>
                <TotalCell width={adjustedMetalWidth * 0.25}>—</TotalCell>
                <TotalCell width={adjustedMetalWidth * 0.25}>
                  {`${hasGoldData ? `G: ${formatNumber(totals.goldGrossWt)}` : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? `Pt: ${formatNumber(totals.ptGrossWt)}` : ''}`}
                </TotalCell>
                <TotalCell width={adjustedMetalWidth * 0.25}>
                  {`${hasGoldData ? `G: ${formatNumber(totals.goldNetWt)}` : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? `Pt: ${formatNumber(totals.ptNetWt)}` : ''}`}
                </TotalCell>
                <TotalCell width={adjustedMetalWidth * 0.25}>
                  {`${hasGoldData ? `G: ${Math.round(totals.goldValue)}` : ''}${hasGoldData && hasPlatinumData ? '\n\n' : ''}${hasPlatinumData ? `Pt: ${Math.round(totals.ptValue)}` : ''}`}
                </TotalCell>
              </>
            )}
            
            {adjustedDiamondWidth > 0 && (
              <>
                <TotalCell width={adjustedDiamondWidth * 0.25}>—</TotalCell>
                <TotalCell width={adjustedDiamondWidth * 0.15}>{Math.round(totals.diamondPcs)}</TotalCell>
                <TotalCell width={adjustedDiamondWidth * 0.2}>{formatNumber(totals.diamondCts)}</TotalCell>
                <TotalCell width={adjustedDiamondWidth * 0.2}>—</TotalCell>
                <TotalCell width={adjustedDiamondWidth * 0.2}>{Math.round(totals.diamondValue)}</TotalCell>
              </>
            )}
            
            {adjustedColorStoneWidth > 0 && (
              <>
                <TotalCell width={adjustedColorStoneWidth * 0.34}>—</TotalCell>
                <TotalCell width={adjustedColorStoneWidth * 0.1}>{Math.round(totals.stonePcs)}</TotalCell>
                <TotalCell width={adjustedColorStoneWidth * 0.16}>{formatNumber(totals.stoneCts)}</TotalCell>
                <TotalCell width={adjustedColorStoneWidth * 0.2}>—</TotalCell>
                <TotalCell width={adjustedColorStoneWidth * 0.2}>{(totals.stoneValue).toFixed(3)}</TotalCell>
              </>
            )}
            
            {hasWastageData && (
              <TotalCell width={chargeSectionWidth * (1/chargeColumns)}>{Math.round(totals.wastage)}</TotalCell>
            )}
            {(hasGoldMakingData || hasPtMakingData || hasHandleChargeData) && (
              <TotalCell width={chargeSectionWidth * (1/chargeColumns)}>
                {`${hasGoldMakingData ? `G: ${Math.round(totals.goldMaking)}` : ''}${hasGoldMakingData && hasPtMakingData ? '\n\n' : ''}${hasPtMakingData ? `P: ${Math.round(totals.ptMaking)}` : ''}${(hasGoldMakingData || hasPtMakingData) && hasHandleChargeData ? '\n\n' : ''}${hasHandleChargeData ? `HC: ${Math.round(totals.HandleAmount)}` : ''}`}
              </TotalCell>
            )}
            {(hasHMData || hasCertData) && (
              <TotalCell width={chargeSectionWidth * (1/chargeColumns)}>
                {`${hasHMData ? `HM: ${Math.round(totals.HMTaxableAmt)}` : ''}${hasHMData && hasCertData ? '\n\n' : ''}${hasCertData ? `Cert: ${Math.round(totals.CertTaxableAmt)}` : ''}`}
              </TotalCell>
            )}
            
            <TotalCell width={totalWidth}>{Math.round(totals.grandTotal)}</TotalCell>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFExportButton = ({ data }) => (
  <PDFDownloadLink
    document={<DiamondPDF data={data} />}
    fileName="diamond-dealer-receipt.pdf"
    style={{
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#4299e1',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '14px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      marginLeft: '8px'
    }}
  >
    {({ loading }) => loading ? '🔄 Preparing PDF...' : '📄 Export to PDF'}
  </PDFDownloadLink>
);

export default PDFExportButton;