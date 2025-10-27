import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import moment from "moment";
import { API } from "../../config/configData";
import "./print.css";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [repData, setRepData] = useState({
    totalPureWt: "",
    avgRate: "",
  });
  const printableRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${API}/reports`);
        setReports(response.data);
        setFilteredReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const calculateReportData = () => {
      const totalPureWt = filteredReports
        .reduce((acc, cv) => acc + parseFloat(cv.tQty), 0)
        .toFixed(3);

      const totalRate = filteredReports.reduce((acc, cv) => {
        const rateMap = {
          "999 Rate": parseFloat(cv.PureRate),
          "9999 Rate": parseFloat(cv.pure999Rate),
          "995 Rate": parseFloat(cv.cRate),
        };
        return acc + (rateMap[cv.goldData] || 0) * parseFloat(cv.tQty);
      }, 0);

      const avgRate =
        filteredReports.length > 0 ? (totalRate / totalPureWt).toFixed(3) : 0;

      setRepData({ totalPureWt, avgRate });
    };

    calculateReportData();
  }, [filteredReports]);

  const handleDateFilter = () => {
    if (fromDate && toDate && moment(fromDate).isAfter(moment(toDate))) {
      alert("The 'From Date' must be earlier than or equal to the 'To Date'.");
      return;
    }

    let filtered = reports;

    if (fromDate) {
      filtered = filtered.filter((report) =>
        moment(report.StatusDate).isSameOrAfter(moment(fromDate), "day")
      );
    }

    if (toDate) {
      const toDatePlusOne = moment(toDate).add(1, "day");
      filtered = filtered.filter((report) =>
        moment(report.StatusDate).isSameOrBefore(toDatePlusOne, "day")
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((report) =>
        report.approvedstatus.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    setFilteredReports(filtered);
    setShowFilterDialog(false);
  };

  const handleResetFilters = () => {
    setFromDate("");
    setToDate("");
    setStatusFilter("");
    setFilteredReports(reports);
    setShowFilterDialog(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderGoldRate = (report) => {
    const rateMap = {
      "999 Rate": report.PureRate,
      "9999 Rate": report.pure999Rate,
      "995 Rate": report.cRate,
    };
    return rateMap[report.goldData] || "N/A";
  };

  return (
    <div className="p-4 " ref={printableRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-600 m-auto">
          Consolidated Reports
        </h1>

        <div className="w-full sm:w-auto p-4 border rounded-lg shadow">
          <div className="flex justify-between gap-8">
            <div>
              <p className="text-sm text-gray-600">Total Pure Wt</p>
              <p className="text-xl font-semibold">{repData.totalPureWt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Wt Rate</p>
              <p className="text-xl font-semibold">{repData.avgRate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowFilterDialog(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Filters
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
        >
          Print Report
        </button>
      </div>

      {showFilterDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter Reports</h2>
              <button
                onClick={() => setShowFilterDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approved Status
              </label>
              <input
                type="text"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Search status..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Reset
              </button>
              <button
                onClick={handleDateFilter}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" flex gap-4 mb-6 print-area">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Invoice No|Invoice Date",
                "Supplier Name",
                "Mobile No",
                "Total Qty",
                "Purity",
                "Gold Rate",
                "Requested Date",
                "Status",
                
                "Status Date",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2  text-sm font-semibold text-gray-900"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id} className="border-t hover:bg-gray-50">
                <td className="px-2 py-2">{report.Billno}</td>
                {/* <td className="px-4 py-2">
                  {report.Date ? moment(report.Date).format("DD-MM-YYYY") : "00-00-0000"}
                </td> */}
                <td className="px-4 py-2">{report.Suppliername}</td>
                <td className="px-4 py-2">{report.mobileNumber}</td>
                <td className="px-4 py-2">{report.tQty}</td>
                <td className="px-4 py-2">{report.goldData}</td>
                <td className="px-4 py-2">{renderGoldRate(report)}</td>
                <td className="px-4 py-2">
                  {report.createdAt
                    ? moment(report.createdAt)
                        .utcOffset(330)
                        .format("DD-MM-YY HH:mm:ss")
                    : "00-00-0000"}
                </td>
                <td
                  className={`px-4 py-2 ${
                    report.approvedstatus === "accepted"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  <div>{report.approvedstatus}</div>
                  {report.approvedstatus !== "accepted" &&
                    report.rejectionReason && (
                      <div className="text-sm text-red-500">
                        {`(${report.rejectionReason})`}
                      </div>
                    )}
                </td>

                {/* <td className="px-4 py-2"></td> */}
                
                <td className="px-4 py-2">
                  {report.StatusDate
                    ? moment(report.StatusDate)
                        .utcOffset(330)
                        .format("DD-MM-YY HH:mm:ss")
                    : "00-00-0000"}
                </td>

                {/* <td className="px-4 py-2">
                  {report.StatusDate
                    ? moment(report.StatusDate).format("HH:mm:ss")
                    : "00:00:00"}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPage;
