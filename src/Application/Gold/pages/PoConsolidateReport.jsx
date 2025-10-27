

// export default PoConsolidateReport;
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API } from "../../../config/configData";
import PurchaseOrderGenerator from "../components/PurchaseOrderGenerator";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import ContentLoader from "../../../DashBoardContext/ContentLoader";
import Snackbar from "../../../Components/Snackbar";
import { useSendToServer } from "../components/SendToServer";

function PoConsolidateReport() {
  const [poCreationDatas, setPoCreationDatas] = useState([]);
  const [poAddressData, setPoAddressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [poNumbers, setPoNumbers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedPoNumber, setSelectedPoNumber] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [consolidatedData, setConsolidatedData] = useState(null);
  const { userRole, roleData } = useContext(DashBoardContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Function to show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const { generatePdf, isGenerating, errors } = useSendToServer({
    onPdfGenerated: (pdfFile) => {
      console.log(pdfFile);
      console.log("PDF generated successfully");
    },
  });

  // Function to hide snackbar
  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedSupplier("");
    setSelectedPoNumber("");
    setFromDate("");
    setToDate("");
    showSnackbar("Filters have been reset");
  };

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/fetch_supplier/${userRole}`
        );
        setSuppliers(response.data.supplierNames);
      } catch (error) {
        console.error("Error fetching supplier and PO details:", error);
        showSnackbar("Failed to fetch suppliers", "error");
      }
    };
    fetchSupplier();
  }, [userRole]);

  useEffect(() => {
    const fetchPoDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/fetch_po_number/${selectedSupplier}/${userRole}/Accepted`
        );
        setPoNumbers(response.data.filteredData.poNumbers);
      } catch (error) {
        console.error("Error fetching supplier and PO details:", error);
        showSnackbar("Failed to fetch PO numbers", "error");
      }
    };

    if (selectedSupplier) {
      fetchPoDetails();
    } else {
      setPoNumbers([]);
    }
  }, [selectedSupplier, userRole]);

  const fetchPoCreationDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API}/gold_po/fetch_po_creation`, {
          userRole,
          selectedSupplier,
          selectedPoNumber,
          fromDate: btoa(fromDate),
          toDate: btoa(toDate),
          selectedPoStatus: "Accepted"
        }
      );

      if (response.status === 200) {
        if (!response.data) {
          showSnackbar("No Data Found", "error");
          throw new Error("No data received from the API");
        }

        const addressData = response.data.address;
        const poCreationData = response.data.data;

        if (!poCreationData) {
          throw new Error("PO creation data is missing");
        }

        setFilteredData(poCreationData);
        setPoAddressData(addressData ? addressData : {});

        // Generate consolidated data
        const consolidated = consolidatePoData(poCreationData);
        setConsolidatedData(consolidated);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching PO creation details:", error);
      showSnackbar("No Data Found", "error");
      setError(error.message);
      setFilteredData([]);
      setPoAddressData({});
      setConsolidatedData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to consolidate PO data
  // Function to consolidate PO data
  const consolidatePoData = (poData) => {
    if (!poData || poData.length === 0) return null;

    // Create a map to group items by product code or other relevant identifier
    const groupedItems = {};
    let totalAmount = 0;
    let totalTax = 0;
    let totalQuantity = 0;
    let totalGrsWt = 0;
    let totalNetWt = 0;
    let totalPureWt = 0;
    let totalStoneWt = 0;
    let totalStoneCost = 0;

    poData.forEach((item) => {
      // Use product as key if available, fallback to other identifiers
      const key = item.product || item.product_name || item.sno.toString();

      // Parse numeric values safely
      const pieces = parseFloat(item.pieces) || 0;
      const grossWeight = parseFloat(item.gross_weight) || 0;
      const netWeight = parseFloat(item.net_weight) || 0;
      const pureWt = parseFloat(item.pure_wt) || 0;
      const stoneWeight = parseFloat(item.stone_weight) || 0;
      const stoneCost = parseFloat(item.stone_cost) || 0;
      // Calculate amount if not provided directly
      const itemAmount = parseFloat(item.amount) || stoneCost || 0;

      if (!groupedItems[key]) {
        groupedItems[key] = {
          ...item,
          quantity: pieces,
          amount: itemAmount,
          gross_weight: grossWeight,
          net_weight: netWeight,
          pure_wt: pureWt,
          stone_weight: stoneWeight,
          stone_cost: stoneCost,
          count: 1,
        };
      } else {
        groupedItems[key].quantity += pieces;
        groupedItems[key].amount += itemAmount;
        groupedItems[key].gross_weight += grossWeight;
        groupedItems[key].net_weight += netWeight;
        groupedItems[key].pure_wt += pureWt;
        groupedItems[key].stone_weight += stoneWeight;
        groupedItems[key].stone_cost += stoneCost;
        groupedItems[key].count += 1;
      }

      totalAmount += itemAmount;
      totalQuantity += pieces;
      totalGrsWt += grossWeight;
      totalNetWt += netWeight;
      totalPureWt += pureWt;
      totalStoneWt += stoneWeight;
      totalStoneCost += stoneCost;
    });

    // Determine tax amount - in this case it seems to be missing from the sample data
    // If tax is available elsewhere, incorporate it here

    return {
      items: Object.values(groupedItems),
      summary: {
        totalItems: Object.keys(groupedItems).length,
        totalRecords: poData.length,
        totalAmount,
        totalTax,
        totalQuantity,
        totalGrsWt,
        totalNetWt,
        totalPureWt,
        totalStoneWt,
        totalStoneCost,
        grandTotal: totalAmount + totalTax,
        supplier:
          poData[0]?.supplierName ||
          poData[0]?.supplier?.name ||
          selectedSupplier,
        poNumber:
          poData[0]?.poNumber ||
          poData[0]?.poDetails?.poNumber ||
          selectedPoNumber,
        date:
          poData[0]?.poDetails?.poDate ||
          poData[0]?.created_date?.split(" ")[0],
      },
    };
  };
  useEffect(() => {
    if (selectedSupplier || selectedPoNumber || fromDate || toDate) {
      fetchPoCreationDetails();
    }
  }, [selectedPoNumber, selectedSupplier, fromDate, toDate, userRole]);

  const handleSupplierChange = (event) => {
    setSelectedSupplier(event.target.value);
    // Reset PO number when supplier changes
    setSelectedPoNumber("");
  };

  const handlePoNumberChange = (event) => {
    setSelectedPoNumber(event.target.value);
  };

  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };

  return (
    <div className="w-full max-w-full">
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Purchase Order Consolidated Report
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full">
            <label
              htmlFor="supplier"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Supplier
            </label>
            <select
              id="supplier"
              value={selectedSupplier}
              onChange={handleSupplierChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="poNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PO Number
            </label>
            <select
              id="poNumber"
              value={selectedPoNumber}
              onChange={handlePoNumberChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedSupplier}
            >
              <option value="">Select PO Number</option>
              {poNumbers.map((poNumber, index) => (
                <option key={index} value={poNumber}>
                  {poNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="fromDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              From Date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="toDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              To Date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ContentLoader variant="skeleton" />
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-red-500 text-center">
          No Data Found
        </div>
      ) : consolidatedData ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Consolidated Purchase Order Summary
              </h3>
              <div className="flex gap-3"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-lg font-medium">
                  {consolidatedData.summary.supplier}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">PO Number</p>
                <p className="text-lg font-medium">
                  {consolidatedData.summary.poNumber}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-lg font-medium">
                  {consolidatedData.summary.totalItems}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Quantity</p>
                <p className="text-lg font-medium">
                  {consolidatedData.summary.totalQuantity.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Amount</p>
                <p className="text-xl font-medium text-blue-700">
                  ₹{consolidatedData.summary.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Stone Cost</p>
                <p className="text-xl font-medium text-blue-700">
                  ₹{consolidatedData.summary.totalStoneCost.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Grand Total</p>
                <p className="text-xl font-medium text-green-700">
                  ₹{consolidatedData.summary.grandTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Total Gross Weight</p>
                <p className="text-lg font-medium text-yellow-700">
                  {consolidatedData.summary.totalGrsWt.toFixed(3)} g
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Total Net Weight</p>
                <p className="text-lg font-medium text-yellow-700">
                  {consolidatedData.summary.totalNetWt.toFixed(3)} g
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Total Pure Weight</p>
                <p className="text-lg font-medium text-yellow-700">
                  {consolidatedData.summary.totalPureWt.toFixed(3)} g
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Total Stone Weight</p>
                <p className="text-lg font-medium text-yellow-700">
                  {consolidatedData.summary.totalStoneWt.toFixed(3)} g
                </p>
              </div>
            </div>
            {/* <div className="overflow-x-auto"> */}
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-3 border-b text-left">Product</th>
                    <th className="py-2 px-3 border-b text-left">Metal Type</th>
                    <th className="py-2 px-3 border-b text-right">Pieces</th>
                    <th className="py-2 px-3 border-b text-right">
                      Gross Wt (g)
                    </th>
                    <th className="py-2 px-3 border-b text-right">
                      Net Wt (g)
                    </th>
                    <th className="py-2 px-3 border-b text-right">
                      Pure Wt (g)
                    </th>
                    <th className="py-2 px-3 border-b text-right">
                      Stone Wt (g)
                    </th>
                    <th className="py-2 px-3 border-b text-right">
                      Stone Cost (₹)
                    </th>
                    <th className="py-2 px-3 border-b text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {consolidatedData.items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-2 px-3 border-b">
                        {item.product || "-"}
                      </td>
                      <td className="py-2 px-3 border-b">
                        {item.metal_type || "-"}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        {item.quantity.toFixed(0)}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        {item.gross_weight.toFixed(3)}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        {item.net_weight.toFixed(3)}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        {item.pure_wt.toFixed(3)}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        {item.stone_weight.toFixed(3)}
                      </td>
                      <td className="py-2 px-3 border-b text-right">
                        ₹{item.stone_cost.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 border-b text-right font-medium">
                        ₹{item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan="2" className="py-2 px-3 border-t-2 text-right">
                      Total:
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      {consolidatedData.summary.totalQuantity.toFixed(0)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      {consolidatedData.summary.totalGrsWt.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      {consolidatedData.summary.totalNetWt.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      {consolidatedData.summary.totalPureWt.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      {consolidatedData.summary.totalStoneWt.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      ₹{consolidatedData.summary.totalStoneCost.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 border-t-2 text-right">
                      ₹{consolidatedData.summary.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          {/* </div> */}

          {/* <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <PurchaseOrderGenerator
              submittedData={filteredData}
              poAddressData={poAddressData}
              selectedPoNumber={selectedPoNumber}
              consolidatedData={consolidatedData}
            />
          </div> */}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
          No data available. Please select filters to view purchase orders.
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
        position="top-right"
        duration={5000}
      />
    </div>
  );
}

export default PoConsolidateReport;
