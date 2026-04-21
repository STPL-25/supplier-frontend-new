import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API } from "../../config/configData";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import useSnackbar from "../../CustomHook/useSnackbar";
import { useSendToServer } from "../Gold/components/SendToServer";

function PoRateFixing() {
  const { user, userRole } = useContext(DashBoardContext);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const { generatePdf } = useSendToServer({
    onPdfGenerated: () => {},
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [poItems, setPoItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState({});

  // Rate entered by user (pure rate with GST)
  const [poRates, setPoRates] = useState({});
  // Previous rate from DB (requested rate)
  const [requestedRates, setRequestedRates] = useState({});

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(
        `${API}/gold_Po/find_supplier_name_fix_unfix_po_details/rate_fixing`,
      );
      setSuppliers(res.data);
    } catch {
      showSnackbar("Failed to fetch suppliers", "error");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchPoDetails = async () => {
    setLoadingItems(true);
    try {
      const res = await axios.get(
        `${API}/gold_Po/fix_unfix_po_details/rate_fixing/${selectedSupplier}`,
      );
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setPoItems(data);

      const initialRates = {};
      const initialRequestedRates = {};
      data.forEach((item) => {
        const poNum = item.poNumber;
        if (poNum && !(poNum in initialRates)) {
          initialRates[poNum] = item.rate && item.rate > 0 ? item.rate : "";
          initialRequestedRates[poNum] =
            item.rate && item.rate > 0 ? parseFloat(item.rate) : 0;
        }
      });
      setPoRates(initialRates);
      setRequestedRates(initialRequestedRates);
    } catch {
      showSnackbar("Failed to fetch PO details", "error");
      setPoItems([]);
      setPoRates({});
      setRequestedRates({});
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (!selectedSupplier) {
      setPoItems([]);
      setPoRates({});
      setRequestedRates({});
      return;
    }
    fetchPoDetails();
  }, [selectedSupplier]);

  const parsePoDetails = (item) => {
    try {
      return typeof item.poDetails === "string"
        ? JSON.parse(item.poDetails)
        : item.poDetails || {};
    } catch {
      return {};
    }
  };

  const handlePoRateChange = (poNumber, value) => {
    setPoRates((prev) => ({ ...prev, [poNumber]: value }));
  };

  const calcAmount = (item) => {
    const rate = parseFloat(poRates[item.poNumber]);
    const pureWt = parseFloat(item.pure_wt);
    if (!isNaN(rate) && rate > 0 && !isNaN(pureWt) && pureWt > 0) {
      return pureWt * rate;
    }
    return 0;
  };

  // Derive all rates from pure rate with GST (3% GST assumed)
  const calcRates = (poNumber) => {
    const pureRateWithGst = parseFloat(poRates[poNumber]);
    if (!pureRateWithGst || pureRateWithGst <= 0) return null;
    const rate100 = pureRateWithGst / 1.03;   // 100% rate without GST
    const rate995 = rate100 * 0.995;           // 995 rate without GST
    const rate999 = rate100 * 0.999;           // 999 rate without GST
    const gst100 = rate100 * 0.03;             // 100% GST amount
    const gst995 = rate995 * 0.03;             // 995 GST amount
    return { rate100, rate995, rate999, gst100, gst995 };
  };

  const groupedByPo = poItems.reduce((acc, item) => {
    const poNum = item.poNumber || "UNKNOWN";
    if (!acc[poNum]) acc[poNum] = [];
    acc[poNum].push(item);
    return acc;
  }, {});

  const totals = poItems.reduce(
    (acc, item) => {
      acc.pieces += parseInt(item.pieces ?? 0) || 0;
      acc.pureWt += parseFloat(item.pure_wt ?? 0) || 0;
      acc.amount += calcAmount(item);
      return acc;
    },
    { pieces: 0, pureWt: 0, amount: 0 },
  );

  const buildPoPayload = (poNumber) => {
    const rate = parseFloat(poRates[poNumber]);
    const rates = calcRates(poNumber);
    const itemsForPo = groupedByPo[poNumber] || [];
    const totalQty = itemsForPo.reduce(
      (sum, item) => sum + (parseInt(item.pieces ?? 0) || 0),
      0,
    );
    const totalAmount = itemsForPo.reduce(
      (sum, item) => sum + calcAmount(item),
      0,
    );
    const type = itemsForPo[0]?.type || "";
    const firstItem = itemsForPo[0];
    const poDate = firstItem
      ? parsePoDetails(firstItem).poDate || firstItem.poDate || ""
      : "";
    return {
      poNumber,
      poDate,
      rate,                                // pure rate with GST (entered)
      rate100: rates?.rate100 ?? 0,        // 100% rate without GST
      rate995: rates?.rate995 ?? 0,        // 995 rate without GST
      rate999: rates?.rate999 ?? 0,        // 999 rate without GST
      gst100Amount: rates?.gst100 ?? 0,    // 100% GST amount
      gst995Amount: rates?.gst995 ?? 0,    // 995 GST amount
      totalQty,
      totalAmount,
      type,
      user,
    };
  };

  const sendPoAfterSuccess = async (res, poNumber) => {
    if (poNumber.includes("TCT")) return;

    let filteredItems = res.data?.findPoDatas;
    let poData = res.data?.poData;
    let orderTypes = res.data?.orderTypes;
    let poType = res.data?.poType;

    if (!filteredItems || !poData) {
      try {
        const pdfRes = await axios.post(`${API}/gold_po/fetch_po_creation`, {
          userRole: userRole,
          selectedSupplier,
          selectedPoNumber: poNumber,
          fromDate: "",
          toDate: "",
          selectedPoStatus: "Accepted",
          selectCompany: "",
        });
        filteredItems = pdfRes.data?.data;
        poData = pdfRes.data?.address;
        orderTypes = pdfRes.data?.orderTypes;
        poType = groupedByPo[poNumber]?.[0]?.type || "fix";
      } catch {
        return;
      }
    }

    if (filteredItems && filteredItems.length > 0 && poData) {
      await generatePdf(filteredItems, poData, orderTypes, poType?.trim());
    }
  };

  const handleSubmit = async (poNumber) => {
    const rate = parseFloat(poRates[poNumber]);
    if (!rate || rate <= 0) {
      showSnackbar("Please enter a valid rate", "error");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [poNumber]: true }));

    try {
      const res = await axios.post(
        `${API}/gold_Po/update_rate_fixing`,
        buildPoPayload(poNumber),
      );
      showSnackbar(`Rate updated for PO ${poNumber}`, "success");
      if (res.status === 200) {
        await sendPoAfterSuccess(res, poNumber);
        fetchSuppliers();
        fetchPoDetails();
      }
    } catch {
      showSnackbar("Failed to update rate", "error");
    } finally {
      setSubmitting((prev) => ({ ...prev, [poNumber]: false }));
    }
  };

  const handleSubmitAll = async () => {
    const poNumbers = Object.keys(groupedByPo);
    const invalid = poNumbers.filter((poNum) => {
      const rate = parseFloat(poRates[poNum]);
      return !rate || rate <= 0;
    });
    if (invalid.length > 0) {
      showSnackbar("Please enter valid rates for all POs", "error");
      return;
    }
    const allSubmitting = {};
    poNumbers.forEach((poNum) => (allSubmitting[poNum] = true));
    setSubmitting(allSubmitting);
    try {
      const results = await Promise.all(
        poNumbers.map((poNum) =>
          axios.post(`${API}/gold_Po/update_rate_fixing`, buildPoPayload(poNum)),
        ),
      );
      showSnackbar("All rates updated successfully", "success");
      await Promise.all(
        results.map((res, idx) => sendPoAfterSuccess(res, poNumbers[idx])),
      );
    } catch {
      showSnackbar("Failed to update some rates", "error");
    } finally {
      setSubmitting({});
    }
  };

  const poNumbers = Object.keys(groupedByPo);

  const fmt = (val, decimals = 2) =>
    val != null && !isNaN(val)
      ? `₹${parseFloat(val).toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`
      : "—";

  // Columns: #, Product, PO#, PO Date, Qty, Pure Wt, Type,
  //          Req Rate, Pure Rate w/GST, 100% Rate, 995 Rate,
  //          995 GST Amt, 100% GST Amt, 999 Rate, Amount, Action  → 16 total
  return (
    <div className="w-full max-w-full p-4">
      {snackbar?.open && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
            snackbar?.severity === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          <span>{snackbar?.message}</span>
          <button
            onClick={hideSnackbar}
            className="ml-1 font-bold text-lg leading-none hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          PO Rate Fixing
        </h2>
        <div className="max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s, i) => (
              <option key={i} value={s.value}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSupplier && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          {loadingItems ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <svg
                className="animate-spin h-6 w-6 mr-2 text-blue-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Loading...
            </div>
          ) : poItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No PO records found for selected supplier.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  {[
                    "#",
                    "Product",
                    "PO Number",
                    "PO Date",
                    "Qty (Pcs)",
                    "Pure Wt (g)",
                    "Type",
                    "Req. Rate (₹/g)",
                    "Pure Rate w/ GST",
                    "Amount (₹)",
                    "Action",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-3 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                        i >= 4 ? "text-right" : "text-left"
                      } ${i === 6 || i === 7 || i === 8 || i === 10 ? "text-center" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {poNumbers.map((poNumber) => {
                  const items = groupedByPo[poNumber];
                  const rate = poRates[poNumber];
                  const rates = calcRates(poNumber);
                  const reqRate = requestedRates[poNumber];

                  const poTotals = items.reduce(
                    (acc, item) => {
                      acc.pieces += parseInt(item.pieces ?? 0) || 0;
                      acc.pureWt += parseFloat(item.pure_wt ?? 0) || 0;
                      acc.amount += calcAmount(item);
                      return acc;
                    },
                    { pieces: 0, pureWt: 0, amount: 0 },
                  );

                  return items.map((item, itemIdx) => {
                    const poDetails = parsePoDetails(item);
                    const isFirstInGroup = itemIdx === 0;
                    const isLastInGroup = itemIdx === items.length - 1;
                    const amount = calcAmount(item);
                    const sno = poItems.indexOf(item) + 1;

                    return (
                      <>
                        <tr
                          key={`${poNumber}-${itemIdx}`}
                          className={`hover:bg-gray-50 transition-colors ${
                            isLastInGroup && poNumbers.length > 1
                              ? "border-b-2 border-gray-200"
                              : ""
                          }`}
                        >
                          {/* cols 1-7: per-item */}
                          <td className="px-3 py-3 text-gray-500">{sno}</td>
                          <td className="px-3 py-3">
                            <div className="font-medium text-gray-800">
                              {item.product_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.product}
                            </div>
                          </td>
                          <td className="px-3 py-3 font-mono text-gray-700">
                            {item.poNumber || poDetails.poNumber || "—"}
                          </td>
                          <td className="px-3 py-3 text-gray-600">
                            {poDetails.poDate || item.poDate || "—"}
                          </td>
                          <td className="px-3 py-3 text-right text-gray-700">
                            {item.pieces ?? "—"}
                          </td>
                          <td className="px-3 py-3 text-right text-gray-700">
                            {parseFloat(item.pure_wt ?? 0).toFixed(3)}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                                item.type === "fix"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {item.type === "fix" ? "Fix" : "Unfix"}
                            </span>
                          </td>

                          {/* cols 8-16: per-PO (rowSpan) */}
                          {isFirstInGroup && (
                            <td
                              className="px-3 py-3 text-right font-medium text-gray-700 bg-amber-50"
                              rowSpan={items.length}
                            >
                              {reqRate > 0 ? fmt(reqRate) : "—"}
                            </td>
                          )}

                          {isFirstInGroup && (
                            <td
                              className="px-3 py-3 text-center"
                              rowSpan={items.length}
                            >
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={rate ?? ""}
                                onChange={(e) =>
                                  handlePoRateChange(poNumber, e.target.value)
                                }
                                className="w-28 text-right p-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter rate"
                              />
                            </td>
                          )}

                          <td className="px-3 py-3 text-right font-medium text-gray-800">
                            {amount > 0 ? fmt(amount) : "—"}
                          </td>

                          {isFirstInGroup && (
                            <td
                              className="px-3 py-3 text-center"
                              rowSpan={items.length}
                            >
                              <button
                                onClick={() => handleSubmit(poNumber)}
                                disabled={submitting[poNumber]}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {submitting[poNumber] ? "Saving..." : "Submit"}
                              </button>
                            </td>
                          )}
                        </tr>

                        {isLastInGroup && items.length > 1 && (
                          <tr
                            key={`${poNumber}-subtotal`}
                            className="bg-blue-50 text-xs font-semibold text-blue-700"
                          >
                            <td
                              colSpan={4}
                              className="px-3 py-2 text-right uppercase tracking-wide"
                            >
                              PO Subtotal — {poNumber}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {poTotals.pieces}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {poTotals.pureWt.toFixed(3)}
                            </td>
                            {/* Type, ReqRate, PureRate = 3 cols */}
                            <td colSpan={3} className="px-3 py-2" />
                            <td className="px-3 py-2 text-right">
                              {poTotals.amount > 0 ? fmt(poTotals.amount) : "—"}
                            </td>
                            <td className="px-3 py-2" />
                          </tr>
                        )}
                      </>
                    );
                  });
                })}
              </tbody>

              <tfoot>
                <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold text-sm">
                  <td
                    colSpan={4}
                    className="px-3 py-3 text-right text-gray-700 uppercase tracking-wide text-xs"
                  >
                    Grand Total ({poItems.length} item
                    {poItems.length !== 1 ? "s" : ""} / {poNumbers.length} PO
                    {poNumbers.length !== 1 ? "s" : ""})
                  </td>
                  <td className="px-3 py-3 text-right text-gray-800">
                    {totals.pieces}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-800">
                    {totals.pureWt.toFixed(3)}
                  </td>
                  {/* Type, ReqRate, PureRate = 3 cols */}
                  <td colSpan={3} className="px-3 py-3" />
                  <td className="px-3 py-3 text-right text-gray-800">
                    {totals.amount > 0 ? fmt(totals.amount) : "—"}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {poNumbers.length > 1 && (
                      <button
                        onClick={handleSubmitAll}
                        disabled={Object.values(submitting).some(Boolean)}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 whitespace-nowrap"
                      >
                        {Object.values(submitting).some(Boolean)
                          ? "Saving..."
                          : "Submit All"}
                      </button>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default PoRateFixing;
