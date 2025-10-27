import {
  Document,
  Page,
  Text,
  View,

  Link,
  Svg,
  Path,
} from "@react-pdf/renderer";
import styles from "./PdfStyled";
const RenderSummary = ({isLastPage, totals, datas}) => {
    if (!isLastPage) return null;
    const showPureWeight = datas.some((item) => item.productWeightage !== "Pcs");
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
        {/* <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount (INR):</Text>
          <Text style={styles.summaryValue}>
            {totals.totalAmount?.toFixed(2)}
          </Text>
        </View> */}
      </View>
    );
  };

  export default RenderSummary;