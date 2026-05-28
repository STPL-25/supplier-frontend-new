import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API } from "../../config/configData";
import useSnackbar from "../../CustomHook/useSnackbar";

function PoRateFixingReport() {
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();
  const printRef = useRef();

  const [allData, setAllData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [poOptions, setPoOptions] = useState([]);

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [selectedPo, setSelectedPo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [poItems, setPoItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/gold_Po/fetch_po_details`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setAllData(data);
        const supplierMap = new Map();
        data.forEach((item) => {
          if (item.supplierCode && item.supplierName)
            supplierMap.set(item.supplierCode, item.supplierName);
        });
        setSuppliers(
          Array.from(supplierMap.entries())
            .map(([code, name]) => ({ value: code, name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch(() => showSnackbar("Failed to fetch PO data", "error"))
      .finally(() => setFetching(false));
  }, []);

  const filterByCompany = (item) => {
    if (companyFilter === "space") {
      return typeof item.poNumber === "string" && item.poNumber.toUpperCase().startsWith("STPL");
    }
    if (companyFilter === "garsons") {
      return typeof item.poNumber === "string" && item.poNumber.toUpperCase().startsWith("GPL");
    }
    return true;
  };

  useEffect(() => {
    if (!selectedSupplier) {
      setPoOptions([]);
      setSelectedPo("");
      return;
    }
    const poSet = new Map();
    allData
      .filter((item) => item.supplierCode === selectedSupplier)
      .filter(filterByCompany)
      .forEach((item) => {
        if (item.poNumber) poSet.set(item.poNumber, item.poDate || "");
      });
    setPoOptions(
      Array.from(poSet.entries())
        .map(([poNumber, poDate]) => ({ poNumber, poDate }))
        .sort((a, b) => b.poDate.localeCompare(a.poDate))
    );
    setSelectedPo("");
  }, [selectedSupplier, allData, companyFilter]);

  const parseDate = (item) => {
    try {
      const pd =
        typeof item.poDetails === "string"
          ? JSON.parse(item.poDetails)
          : item.poDetails || {};
      return pd.poDate || item.poDate || "";
    } catch {
      return item.poDate || "";
    }
  };

  const calcRates = (rate) => {
    const r = parseFloat(rate);
    if (!r || r <= 0) return null;
    const rate100 = r / 1.03;
    const rate995 = rate100 * 0.995;
    const rate999 = rate100 * 0.999;
    const gst100 = rate100 * 0.03;
    const gst995 = rate995 * 0.03;
    return { rate100, rate995, rate999, gst100, gst995 };
  };

  const handleSearch = () => {
    if (!selectedSupplier) {
      showSnackbar("Please select a supplier", "error");
      return;
    }
    setSearched(true);
    let data = allData.filter((item) => item.supplierCode === selectedSupplier);
    data = data.filter(filterByCompany);
    if (selectedPo) data = data.filter((item) => item.poNumber === selectedPo);
    data = data.filter((item) => item.rate && parseFloat(item.rate) > 0);
    if (fromDate || toDate) {
      data = data.filter((item) => {
        const d = parseDate(item);
        if (!d) return true;
        const itemDate = new Date(d);
        if (fromDate && itemDate < new Date(fromDate)) return false;
        if (toDate && itemDate > new Date(toDate)) return false;
        return true;
      });
    }
    setPoItems(data);
  };

  const handleReset = () => {
    setSelectedSupplier("");
    setSelectedPo("");
    setFromDate("");
    setToDate("");
    setPoItems([]);
    setSearched(false);
  };

  const fmt = (val, decimals = 2) =>
    val != null && !isNaN(val)
      ? `₹${parseFloat(val).toLocaleString("en-IN", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`
      : "—";

  const groupedByPo = poItems.reduce((acc, item) => {
    const poNum = item.poNumber || "UNKNOWN";
    if (!acc[poNum]) acc[poNum] = [];
    acc[poNum].push(item);
    return acc;
  }, {});

  const poNumbers = Object.keys(groupedByPo);

  const totals = poItems.reduce(
    (acc, item) => {
      const rate = parseFloat(item.rate) || 0;
      const pureWt = parseFloat(item.pure_wt) || 0;
      acc.pieces += parseInt(item.pieces ?? 0) || 0;
      acc.pureWt += pureWt;
      acc.amount += rate > 0 && pureWt > 0 ? pureWt * rate : 0;
      return acc;
    },
    { pieces: 0, pureWt: 0, amount: 0 }
  );

  const handlePrint = () => {
    const supplierName =
      suppliers.find((s) => s.value === selectedSupplier)?.name ||
      selectedSupplier;
    const dateRange =
      fromDate || toDate ? `${fromDate || "—"} to ${toDate || "—"}` : "All Dates";

    const rows = poItems
      .map((item, idx) => {
        const rates = calcRates(item.rate);
        const poDate = parseDate(item);
        const amount =
          (parseFloat(item.rate) || 0) * (parseFloat(item.pure_wt) || 0);
        return `
          <tr>
            <td>${idx + 1}</td>
            <td>${item.product_name || ""}</td>
            <td>${item.poNumber || ""}</td>
            <td>${poDate || "—"}</td>
            <td style="text-align:right">${item.pieces ?? "—"}</td>
            <td style="text-align:right">${parseFloat(item.pure_wt ?? 0).toFixed(3)}</td>
            <td style="text-align:center">${item.type === "fix" ? "Fix" : "Unfix"}</td>
            <td style="text-align:right">${fmt(item.rate)}</td>
            <td style="text-align:right">${amount > 0 ? fmt(amount) : "—"}</td>
            <td style="text-align:center">${item.po_pdf ? `<a href="${item.po_pdf}" target="_blank">PDF</a>` : "—"}</td>
          </tr>`;
      })
      .join("");

    const html = `<!DOCTYPE html><html><head><title>PO Rate Fixing Report</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; padding: 16px; }
        h2 { text-align: center; margin-bottom: 4px; }
        .meta { text-align: center; color: #555; margin-bottom: 12px; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #1e40af; color: #fff; padding: 6px 8px; text-align: left; font-size: 10px; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) td { background: #f8fafc; }
        .tfoot td { font-weight: bold; background: #e0e7ff; padding: 6px 8px; border-top: 2px solid #6366f1; }
        a { color: #dc2626; }
      </style></head><body>
      <h2>PO Rate Fixing Report</h2>
      <p class="meta">Supplier: <strong>${supplierName}</strong>${selectedPo ? ` &nbsp;|&nbsp; PO: <strong>${selectedPo}</strong>` : ""} &nbsp;|&nbsp; Date Range: ${dateRange} &nbsp;|&nbsp; Total POs: ${poNumbers.length} &nbsp;|&nbsp; Total Items: ${poItems.length}</p>
      <table>
        <thead><tr>
          <th>#</th><th>Product</th><th>PO Number</th><th>PO Date</th>
          <th style="text-align:right">Qty</th><th style="text-align:right">Pure Wt (g)</th>
          <th style="text-align:center">Type</th>
          <th style="text-align:right">Pure Rate w/ GST</th>
          <th style="text-align:right">Amount (₹)</th>
          <th style="text-align:center">PO PDF</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr class="tfoot">
          <td colspan="4" style="text-align:right">Grand Total</td>
          <td style="text-align:right">${totals.pieces}</td>
          <td style="text-align:right">${totals.pureWt.toFixed(3)}</td>
          <td colspan="2"></td>
          <td style="text-align:right">${totals.amount > 0 ? fmt(totals.amount) : "—"}</td>
          <td></td>
        </tr></tfoot>
      </table>
      </body></html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const headers = [
    "#", "Product", "PO Number", "PO Date",
    "Qty (Pcs)", "Pure Wt (g)", "Type",
    "Pure Rate w/ GST", "Amount (₹)", "PO PDF",
  ];
  const rightAlignedCols = new Set([4, 5, 7, 8]);
  const centerCols = new Set([6, 9]);

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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          PO Rate Fixing Report
        </h2>

        {fetching ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
            <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading filter data...
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s, i) => (
                  <option key={i} value={s.value}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[200px]">
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

            <div className="min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PO Number
              </label>
              <select
                value={selectedPo}
                onChange={(e) => setSelectedPo(e.target.value)}
                disabled={!selectedSupplier}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">All POs</option>
                {poOptions.map((po, i) => (
                  <option key={i} value={po.poNumber}>
                    {po.poNumber}{po.poDate ? ` (${po.poDate})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={fetching}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-md transition-colors"
              >
                Search
              </button>
              <button
                onClick={handleReset}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-md transition-colors"
              >
                Reset
              </button>
              {poItems.length > 0 && (
                <button
                  onClick={handlePrint}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md transition-colors"
                >
                  Print
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {poItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total POs", value: poNumbers.length, color: "blue" },
            { label: "Total Items", value: poItems.length, color: "indigo" },
            { label: "Total Pure Wt (g)", value: totals.pureWt.toFixed(3), color: "purple" },
            { label: "Total Amount", value: fmt(totals.amount), color: "green" },
          ].map((card, i) => (
            <div key={i} className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-${card.color}-500`}>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
              <p className={`text-xl font-bold text-${card.color}-700 mt-1`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto" ref={printRef}>
        {!searched ? (
          <div className="text-center py-16 text-gray-400">
            Select a supplier and click Search to view the report.
          </div>
        ) : poItems.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No fixed rate PO records found for the selected criteria.
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-700 text-white">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className={`px-3 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border border-blue-600 ${
                      rightAlignedCols.has(i)
                        ? "text-right"
                        : centerCols.has(i)
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {poNumbers.map((poNumber) => {
                const items = groupedByPo[poNumber];
                const poTotals = items.reduce(
                  (acc, item) => {
                    const r = parseFloat(item.rate) || 0;
                    const pw = parseFloat(item.pure_wt) || 0;
                    acc.pieces += parseInt(item.pieces ?? 0) || 0;
                    acc.pureWt += pw;
                    acc.amount += r > 0 && pw > 0 ? pw * r : 0;
                    return acc;
                  },
                  { pieces: 0, pureWt: 0, amount: 0 }
                );

                return [
                  ...items.map((item, itemIdx) => {
                    const poDate = parseDate(item);
                    const rates = calcRates(item.rate);
                    const amount =
                      (parseFloat(item.rate) || 0) * (parseFloat(item.pure_wt) || 0);
                    const sno = poItems.indexOf(item) + 1;
                    const isFirst = itemIdx === 0;
                    const isLast = itemIdx === items.length - 1;

                    return (
                      <tr
                        key={`${poNumber}-${itemIdx}`}
                        className={`hover:bg-gray-50 transition-colors ${
                          isLast && poNumbers.length > 1 ? "border-b-2 border-gray-300" : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 text-gray-500 border border-gray-200">{sno}</td>
                        <td className="px-3 py-2.5 border border-gray-200">
                          <div className="font-medium text-gray-800">{item.product_name}</div>
                          <div className="text-xs text-gray-400">{item.product}</div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-700 border border-gray-200">
                          {item.poNumber || "—"}
                        </td>
                        <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap border border-gray-200">
                          {poDate || "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 border border-gray-200">
                          {item.pieces ?? "—"}
                        </td>
                        <td className="px-3 py-2.5 text-right text-gray-700 border border-gray-200">
                          {parseFloat(item.pure_wt ?? 0).toFixed(3)}
                        </td>
                        <td className="px-3 py-2.5 text-center border border-gray-200">
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
                        {isFirst && (
                          <td rowSpan={items.length} className="px-3 py-2.5 text-right font-medium text-blue-700 bg-blue-50 border border-gray-200">
                            {fmt(item.rate)}
                          </td>
                        )}
                        <td className="px-3 py-2.5 text-right font-medium text-gray-800 border border-gray-200">
                          {amount > 0 ? fmt(amount) : "—"}
                        </td>
                        {isFirst && (
                          <td rowSpan={items.length} className="px-3 py-2.5 text-center border border-gray-200">
                            {item.po_pdf ? (
                              <a
                                href={item.po_pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                PDF
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  }),
                  items.length > 1 && (
                    <tr key={`${poNumber}-subtotal`} className="bg-blue-50 text-xs font-semibold text-blue-700">
                      <td colSpan={4} className="px-3 py-2 text-right uppercase tracking-wide border border-gray-200">
                        PO Subtotal — {poNumber}
                      </td>
                      <td className="px-3 py-2 text-right border border-gray-200">{poTotals.pieces}</td>
                      <td className="px-3 py-2 text-right border border-gray-200">{poTotals.pureWt.toFixed(3)}</td>
                      <td className="border border-gray-200" />
                      <td className="border border-gray-200" />
                      <td className="px-3 py-2 text-right border border-gray-200">
                        {poTotals.amount > 0 ? fmt(poTotals.amount) : "—"}
                      </td>
                      <td className="border border-gray-200" />
                    </tr>
                  ),
                ];
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 border-t-2 border-gray-300 font-bold text-sm">
                <td colSpan={4} className="px-3 py-3 text-right text-gray-700 uppercase tracking-wide text-xs border border-gray-300">
                  Grand Total ({poItems.length} item{poItems.length !== 1 ? "s" : ""} / {poNumbers.length} PO{poNumbers.length !== 1 ? "s" : ""})
                </td>
                <td className="px-3 py-3 text-right text-gray-800 border border-gray-300">{totals.pieces}</td>
                <td className="px-3 py-3 text-right text-gray-800 border border-gray-300">{totals.pureWt.toFixed(3)}</td>
                <td className="border border-gray-300" />
                <td className="border border-gray-300" />
                <td className="px-3 py-3 text-right text-gray-800 border border-gray-300">
                  {totals.amount > 0 ? fmt(totals.amount) : "—"}
                </td>
                <td className="border border-gray-300" />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default PoRateFixingReport;
