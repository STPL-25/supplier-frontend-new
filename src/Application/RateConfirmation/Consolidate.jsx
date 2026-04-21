// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import moment from "moment";
// import { API } from "../../config/configData";
// import "./print.css";

// const ReportPage = () => {
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [showFilterDialog, setShowFilterDialog] = useState(false);
//   const [repData, setRepData] = useState({
//     totalPureWt: "",
//     avgRate: "",
//   });
//   const printableRef = useRef(null);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const response = await axios.get(`${API}/reports`);
//         setReports(response.data);
//         setFilteredReports(response.data);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       }
//     };

//     fetchReports();
//   }, []);

//   useEffect(() => {
//     const calculateReportData = () => {
//       const totalPureWt = filteredReports
//         .reduce((acc, cv) => acc + parseFloat(cv.tQty), 0)
//         .toFixed(3);

//       const totalRate = filteredReports.reduce((acc, cv) => {
//         const rateMap = {
//           "999 Rate": parseFloat(cv.PureRate),
//           "9999 Rate": parseFloat(cv.pure999Rate),
//           "995 Rate": parseFloat(cv.cRate),
//         };
//         return acc + (rateMap[cv.goldData] || 0) * parseFloat(cv.tQty);
//       }, 0);

//       const avgRate =
//         filteredReports.length > 0 ? (totalRate / totalPureWt).toFixed(3) : 0;

//       setRepData({ totalPureWt, avgRate });
//     };

//     calculateReportData();
//   }, [filteredReports]);

//   const handleDateFilter = () => {
//     if (fromDate && toDate && moment(fromDate).isAfter(moment(toDate))) {
//       alert("The 'From Date' must be earlier than or equal to the 'To Date'.");
//       return;
//     }

//     let filtered = reports;

//     if (fromDate) {
//       filtered = filtered.filter((report) =>
//         moment(report.StatusDate).isSameOrAfter(moment(fromDate), "day")
//       );
//     }

//     if (toDate) {
//       const toDatePlusOne = moment(toDate).add(1, "day");
//       filtered = filtered.filter((report) =>
//         moment(report.StatusDate).isSameOrBefore(toDatePlusOne, "day")
//       );
//     }

//     if (statusFilter) {
//       filtered = filtered.filter((report) =>
//         report.approvedstatus.toLowerCase().includes(statusFilter.toLowerCase())
//       );
//     }

//     setFilteredReports(filtered);
//     setShowFilterDialog(false);
//   };

//   const handleResetFilters = () => {
//     setFromDate("");
//     setToDate("");
//     setStatusFilter("");
//     setFilteredReports(reports);
//     setShowFilterDialog(false);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const renderGoldRate = (report) => {
//     const rateMap = {
//       "999 Rate": report.PureRate,
//       "9999 Rate": report.pure999Rate,
//       "995 Rate": report.cRate,
//     };
//     return rateMap[report.goldData] || "N/A";
//   };

//   return (
//     <div className="p-4 " ref={printableRef}>
//       <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-blue-600 m-auto">
//           Consolidated Reports
//         </h1>

//         <div className="w-full sm:w-auto p-4 border rounded-lg shadow">
//           <div className="flex justify-between gap-8">
//             <div>
//               <p className="text-sm text-gray-600">Total Pure Wt</p>
//               <p className="text-xl font-semibold">{repData.totalPureWt}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Avg Wt Rate</p>
//               <p className="text-xl font-semibold">{repData.avgRate}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setShowFilterDialog(true)}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Filters
//         </button>
//         <button
//           onClick={handlePrint}
//           className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
//         >
//           Print Report
//         </button>
//       </div>

//       {showFilterDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Filter Reports</h2>
//               <button
//                 onClick={() => setShowFilterDialog(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={(e) => setToDate(e.target.value)}
//                   className="w-full p-2 border rounded"
//                 />
//               </div>
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Approved Status
//               </label>
//               <input
//                 type="text"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 placeholder="Search status..."
//               />
//             </div>

//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={handleResetFilters}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Reset
//               </button>
//               <button
//                 onClick={handleDateFilter}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className=" flex gap-4 mb-6 print-area">
//         <table className="w-full table-auto">
//           <thead className="bg-gray-100">
//             <tr>
//               {[
//                 "Invoice No|Invoice Date",
//                 "Supplier Name",
//                 "Mobile No",
//                 "Total Qty",
//                 "Purity",
//                 "Gold Rate",
//                 "Requested Date",
//                 "Status",
                
//                 "Status Date",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="px-4 py-2  text-sm font-semibold text-gray-900"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filteredReports.map((report) => (
//               <tr key={report.id} className="border-t hover:bg-gray-50">
//                 <td className="px-2 py-2">{report.Billno}</td>
//                 {/* <td className="px-4 py-2">
//                   {report.Date ? moment(report.Date).format("DD-MM-YYYY") : "00-00-0000"}
//                 </td> */}
//                 <td className="px-4 py-2">{report.Suppliername}</td>
//                 <td className="px-4 py-2">{report.mobileNumber}</td>
//                 <td className="px-4 py-2">{report.tQty}</td>
//                 <td className="px-4 py-2">{report.goldData}</td>
//                 <td className="px-4 py-2">{renderGoldRate(report)}</td>
//                 <td className="px-4 py-2">
//                   {report.createdAt
//                     ? moment(report.createdAt)
//                         .utcOffset(330)
//                         .format("DD-MM-YY HH:mm:ss")
//                     : "00-00-0000"}
//                 </td>
//                 <td
//                   className={`px-4 py-2 ${
//                     report.approvedstatus === "accepted"
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   <div>{report.approvedstatus}</div>
//                   {report.approvedstatus !== "accepted" &&
//                     report.rejectionReason && (
//                       <div className="text-sm text-red-500">
//                         {`(${report.rejectionReason})`}
//                       </div>
//                     )}
//                 </td>

//                 {/* <td className="px-4 py-2"></td> */}
                
//                 <td className="px-4 py-2">
//                   {report.StatusDate
//                     ? moment(report.StatusDate)
//                         .utcOffset(330)
//                         .format("DD-MM-YY HH:mm:ss")
//                     : "00-00-0000"}
//                 </td>

//                 {/* <td className="px-4 py-2">
//                   {report.StatusDate
//                     ? moment(report.StatusDate).format("HH:mm:ss")
//                     : "00:00:00"}
//                 </td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ReportPage;
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  FileSpreadsheet,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { API } from "../../config/configData";
import moment from "moment";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const printRef = useRef();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [paymentDateFilter, setPaymentDateFilter] = useState("all");
  const [utrFilter, setUtrFilter] = useState("");
  const [dateSortOrder, setDateSortOrder] = useState("desc");

  const isValidValue = (value) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    value !== "null" &&
    value !== "undefined";

  const getDisplayValue = (value, fallback = "N/A") =>
    isValidValue(value) ? value : fallback;

  const getStatusBadge = (status) => {
    const statusConfig = {
      accepted: { label: "Accepted", variant: "success", icon: Clock },
      rejected: { label: "Rejected", variant: "destructive", icon: X },
    };
    const config = statusConfig[status] || { label: "Unknown", variant: "default", icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const formatISODate = (isoString) => {
    if (!isValidValue(isoString)) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const isDateInRange = (dateString, start, end) => {
    if (!isValidValue(dateString)) return true;
    if (!start && !end) return true;
    try {
      const itemDate = new Date(dateString);
      itemDate.setHours(0, 0, 0, 0);
      if (start) {
        const s = new Date(start);
        s.setHours(0, 0, 0, 0);
        if (itemDate < s) return false;
      }
      if (end) {
        const e = new Date(end);
        e.setHours(23, 59, 59, 999);
        if (itemDate > e) return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/reports`);
        setReports(response.data);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch reports");
        // console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        const matchesSearch =
          searchQuery === "" ||
          report.Billno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.Suppliername?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          report.approvedstatus.toLowerCase() === statusFilter.toLowerCase();

        const matchesPaymentDate =
          paymentDateFilter === "all" ||
          (paymentDateFilter === "with" && isValidValue(report.paymentDate)) ||
          (paymentDateFilter === "without" && !isValidValue(report.paymentDate));

        const matchesUtr = utrFilter === "" || report.utrNo?.toLowerCase().includes(utrFilter.toLowerCase());

        const matchesDateRange = isDateInRange(report.StatusDate, startDate, endDate);

        return matchesSearch && matchesStatus && matchesPaymentDate && matchesUtr && matchesDateRange;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [reports, searchQuery, statusFilter, paymentDateFilter, utrFilter, startDate, endDate, dateSortOrder]);

  const handleExport = () => {
    const exportData = filteredReports.map((report) => ({
      "Invoice No": getDisplayValue(report.Billno),
      "Supplier Name": getDisplayValue(report.Suppliername),
      "Mobile No": getDisplayValue(report.mobileNumber),
      "Total Qty": getDisplayValue(report.tQty),
      "Purity": getDisplayValue(report.goldData),
      "Gold Rate": getDisplayValue(report.PureRate||report.pure999Rate|| report.cRate),
      "Requested Date": formatISODate(report.createdAt),
      "Status": getDisplayValue(report.approvedstatus),
      "Status Date": formatISODate(report.StatusDate),
      "Payment Date": formatISODate(report.paymentDate),
      "UTR No": getDisplayValue(report.utrNo),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    worksheet["!cols"] = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, `Reports_${new Date().toLocaleDateString()}.xlsx`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
    setPaymentDateFilter("all");
    setUtrFilter("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No reports available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6 no-print">
        <CardHeader>
          <div className="flex items-center justify-between w-full gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoice or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={paymentDateFilter} onValueChange={setPaymentDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Payment Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="with">With Payment Date</SelectItem>
                    <SelectItem value="without">Without Payment Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  placeholder="UTR No"
                  value={utrFilter}
                  onChange={(e) => setUtrFilter(e.target.value)}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable={true}
                  placeholderText="Start date"
                  className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  isClearable={true}
                  placeholderText="End date"
                  className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc")}>
                Sort Date: {dateSortOrder === "asc" ? "Asc" : "Desc"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredReports.length === 0}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Mobile No</TableHead>
                  <TableHead>Total Qty</TableHead>
                  <TableHead>Purity</TableHead>
                  <TableHead>Gold Rate</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Status Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>UTR No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell>{getDisplayValue(report.Billno)}</TableCell>
                    <TableCell>{getDisplayValue(report.Suppliername)}</TableCell>
                    <TableCell>{getDisplayValue(report.mobileNumber)}</TableCell>
                    <TableCell>{getDisplayValue(report.tQty)}</TableCell>
                    <TableCell>{getDisplayValue(report.goldData)}</TableCell>
                    <TableCell>{getDisplayValue(report.PureRate||report.pure999Rate|| report.cRate)}</TableCell>
                    <TableCell>{formatISODate(report.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(report.approvedstatus)}</TableCell>
                    <TableCell>{formatISODate(report.StatusDate)}</TableCell>
                    <TableCell>{formatISODate(report.paymentDate)}</TableCell>
                    <TableCell>{getDisplayValue(report.utrNo)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No records match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;

