import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { API } from "../../config/configData";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import useSnackbar from "../../CustomHook/useSnackbar";
import { useSendToServer } from "../Gold/components/SendToServer";

function PoRateFixing() {
  const { user, userRole } = useContext(DashBoardContext);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const { generatePdf, generatePdfBlobUrl } = useSendToServer({
    onPdfGenerated: () => {},
  });

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [poItems, setPoItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [submitting, setSubmitting] = useState({});

  const [poRates, setPoRates] = useState({});
  const [requestedRates, setRequestedRates] = useState({});
  const [rateErrors, setRateErrors] = useState({});
  const [previewPoNumber, setPreviewPoNumber] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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

  const filterItemsByCompany = (items) => {
    if (companyFilter === "space") {
      return items.filter((item) =>
        typeof item.poNumber === "string" && item.poNumber.toUpperCase().startsWith("STPL"),
      );
    }
    if (companyFilter === "garsons") {
      return items.filter((item) =>
        typeof item.poNumber === "string" && item.poNumber.toUpperCase().startsWith("GPL"),
      );
    }
    return items;
  };

  const getValidRateRange = (metal_type) => {
    // Basic safe range: for silver restrict to 3 integer digits (<= 999)
    // for others allow up to 5 integer digits (<= 99999).
    const mt = String(metal_type || "").toLowerCase();
    const isSilver = mt.includes("silver");
    const max = isSilver ? 999 : 99999;
    const min = 0;
    return { min: Math.round(min * 100) / 100, max: Math.round(max * 100) / 100 };
  };

  const handlePoRateChange = (poNumber, value, metal_type) => {
    // Enforce integer-digit limits based on metal type (silver -> 3, others -> 5)
    const maxIntDigits = String(metal_type || "").toLowerCase().includes("silver") ? 3 : 5;

    // Allow clearing the field
    if (value === "") {
      setPoRates((prev) => ({ ...prev, [poNumber]: "" }));
      setRateErrors((prev) => ({ ...prev, [poNumber]: null }));
      return;
    }

    // Normalize input: remove non-digit except first dot
    let sanitized = String(value).replace(/[^0-9.]/g, "");
    const parts = sanitized.split(".");
    const intPart = (parts[0] || "").slice(0, maxIntDigits);
    const decPart = parts[1] ? parts[1].slice(0, 2) : ""; // allow up to 2 decimals
    sanitized = decPart ? `${intPart}.${decPart}` : intPart;

    setPoRates((prev) => ({ ...prev, [poNumber]: sanitized }));

    const numVal = parseFloat(sanitized);
    if (isNaN(numVal)) {
      setRateErrors((prev) => ({ ...prev, [poNumber]: null }));
      return;
    }

    const range = getValidRateRange(metal_type);
    if (range && (numVal < range.min || numVal > range.max)) {
      setRateErrors((prev) => ({
        ...prev,
        [poNumber]: `Value should be between ${fmt(range.min)} and ${fmt(range.max)}`,
      }));
    } else {
      setRateErrors((prev) => ({ ...prev, [poNumber]: null }));
    }
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

  const filteredPoItems = filterItemsByCompany(poItems);

  const groupedByPo = filteredPoItems.reduce((acc, item) => {
    const poNum = item.poNumber || "UNKNOWN";
    if (!acc[poNum]) acc[poNum] = [];
    acc[poNum].push(item);
    return acc;
  }, {});

  const totals = filteredPoItems.reduce(
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
        const pdfRes = await axios.post(`${API}/gold_po/fetch_po_creation/accounts`, {
          userRole: userRole,
          selectedSupplier,
          selectedPoNumber: poNumber,
         
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
      await generatePdf(filteredItems, poData, orderTypes, poType?.trim(),);
    }
  };

  const openPreview = async (poNumber) => {
    const items = groupedByPo[poNumber] || [];
    if (items.length === 0) {
      showSnackbar("No items found for this PO", "error");
      return;
    }

    const enteredRate = parseFloat(poRates[poNumber]);
    if (!enteredRate || enteredRate <= 0) {
      showSnackbar("Please enter a valid rate before preview", "error");
      return;
    }

    if (rateErrors[poNumber]) {
      showSnackbar(rateErrors[poNumber], "error");
      return;
    }

    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setPreviewPoNumber(poNumber);
    setPreviewBlobUrl(null);
    setPreviewLoading(true);

    try {
      const filteredItems = items.map((item) => {
        const pureWt = parseFloat(item.pure_wt) || 0;
        const amount =
          enteredRate > 0 && pureWt > 0
            ? parseFloat((enteredRate * pureWt).toFixed(2))
            : parseFloat(item.amount) || 0;
        return { ...item, rate: enteredRate, amount };
      });

      const parseJson = (val) => {
        try {
          return typeof val === "string" ? JSON.parse(val) : val || {};
        } catch {
          return {};
        }
      };

      const firstItem = items[0];
      const poDetails = parsePoDetails(firstItem);
      const companyDetails = parseJson(firstItem.our_company_details);
      const supplierDetails = parseJson(firstItem.supplier);
      const counterDetails = parseJson(firstItem.counterDetails);
      const deliveryDetails = parseJson(firstItem.delivery);

      const poData = {
        from: {
          name: companyDetails.name || "",
          subTitle: companyDetails.subTitle || "",
          doorNo: companyDetails.doorNo || "",
          streetName: companyDetails.streetName || "",
          city: companyDetails.city || "",
          pincode: companyDetails.pincode || "",
          phone: companyDetails.phone || "",
          gstNo: companyDetails.gstNo || "",
        },
        supplier: {
          name: supplierDetails.name || firstItem.supplierName || "",
          doorNo: supplierDetails.doorNo || "",
          streetName: supplierDetails.streetName || "",
          city: supplierDetails.city || "",
          pincode: supplierDetails.pincode || "",
          phone: supplierDetails.phone || "",
          gstNo: supplierDetails.gstNo || "",
        },
        poDetails: {
          poNumber,
          poDate: poDetails.poDate || firstItem.poDate || "",
          dueDate: poDetails.dueDate || "",
          mode: poDetails.mode || "",
        },
        counterDetails: {
          purchaseManager: counterDetails.purchaseManager || "",
          purchaseIncharge: counterDetails.purchaseIncharge || "",
        },
        delivery: deliveryDetails,
        payment_Type: firstItem.payment_Type || deliveryDetails.paymentType || "IV",
      };

      const orderTypes = firstItem.orderType || "";
      const url = await generatePdfBlobUrl(filteredItems, poData, orderTypes);
      if (!url) {
        throw new Error("PDF preview generation failed");
      }
      setPreviewBlobUrl(url);
    } catch (err) {
      console.error("PO preview error:", err);
      showSnackbar("Failed to load PDF preview", "error");
      closePreview();
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewBlobUrl) URL.revokeObjectURL(previewBlobUrl);
    setPreviewBlobUrl(null);
    setPreviewPoNumber(null);
  };

  const handleSubmit = async (poNumber) => {
    const rate = parseFloat(poRates[poNumber]);
    if (!rate || rate <= 0) {
      showSnackbar("Please enter a valid rate", "error");
      return;
    }
    if (rateErrors[poNumber]) {
      showSnackbar(rateErrors[poNumber], "error");
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

  const handlePreviewSubmit = async (poNumber) => {
    closePreview();
    await handleSubmit(poNumber);
  };

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl">
          <div>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Filter
            </label>
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Companies</option>
              <option value="space">Space (STPL)</option>
              <option value="garsons">Garsons (GPL)</option>
            </select>
          </div>
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

                          {isFirstInGroup && (() => {
                            const rateRange = getValidRateRange(item.metal_type);
                            return (
                              <td
                                className="px-3 py-3 text-center"
                                rowSpan={items.length}
                              >
                                <input
                                  type="number"
                                  step="0.01"
                                  value={rate ?? ""}
                                  onChange={(e) =>
                                    handlePoRateChange(poNumber, e.target.value, item.metal_type)
                                  }
                                  className={`w-28 text-right p-1.5 border rounded-md focus:outline-none focus:ring-2 ${
                                    rateErrors[poNumber]
                                      ? "border-red-400 focus:ring-red-400"
                                      : "border-gray-300 focus:ring-blue-500"
                                  }`}
                                  placeholder="Enter rate"
                                />
                                {rateErrors[poNumber] ? (
                                  <div className="text-xs text-red-500 mt-0.5 w-28 text-left leading-tight">
                                    {rateErrors[poNumber]}
                                  </div>
                                ) : rateRange ? (
                                  <div className="text-xs text-gray-400 mt-0.5">
                                    {fmt(rateRange.min)} – {fmt(rateRange.max)}
                                  </div>
                                ) : null}
                              </td>
                            );
                          })()}

                          <td className="px-3 py-3 text-right font-medium text-gray-800">
                            {amount > 0 ? fmt(amount) : "—"}
                          </td>

                          {isFirstInGroup && (
                            <td
                              className="px-3 py-3 text-center"
                              rowSpan={items.length}
                            >
                              <button
                                onClick={() => {
                                  const rate = parseFloat(poRates[poNumber]);
                                  if (!rate || rate <= 0) {
                                    showSnackbar("Please enter a valid rate", "error");
                                    return;
                                  }
                                  if (rateErrors[poNumber]) {
                                    showSnackbar(rateErrors[poNumber], "error");
                                    return;
                                  }
                                  openPreview(poNumber);
                                }}
                                disabled={submitting[poNumber]}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {submitting[poNumber] ? "Saving..." : "Preview & Submit"}
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
                  {/* <td className="px-3 py-3 text-center">
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
                  </td> */}
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewPoNumber && previewPoNumber !== "__ALL__" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col"
               style={{ width: "min(860px, 95vw)", height: "min(92vh, 900px)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
              <h3 className="text-sm font-semibold text-gray-800">
                PO Preview — {previewPoNumber}
              </h3>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* PDF area */}
            <div className="flex-1 overflow-hidden bg-gray-100 relative">
              {previewLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50">
                  <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm text-gray-500">Generating PDF preview...</span>
                </div>
              )}
              {!previewLoading && !previewBlobUrl && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
                  Preview unavailable
                </div>
              )}
              {!previewLoading && previewBlobUrl && (
                <iframe
                  src={previewBlobUrl}
                  className="w-full h-full border-0"
                  title="PO Preview"
                />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t bg-gray-50 shrink-0">
              <button
                onClick={closePreview}
                className="px-5 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePreviewSubmit(previewPoNumber)}
                disabled={previewLoading}
                className="px-5 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PoRateFixing;
