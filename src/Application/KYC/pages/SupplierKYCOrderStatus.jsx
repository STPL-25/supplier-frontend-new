import React, { useState, useEffect, useContext, useMemo } from "react";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CheckCircle, XCircle, Clock, Search, X, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API } from "../../../config/configData";

const statusMeta = {
  C: { label: "Accounts Verified", variant: "warning", icon: Clock },
  V: { label: "MIS Approved", variant: "warning", icon: Clock },
  A: { label: "Purchase Approved", variant: "success", icon: CheckCircle },
  R: { label: "Rejected", variant: "destructive", icon: XCircle },
  D: { label: "Re-Submitted After Rejection", variant: "default", icon: Clock },
  P: { label: "Created", variant: "default", icon: Clock },
};

const SupplierKYCOrderStatus = () => {
  const [allKycData, setAllKycData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, userRole } = useContext(DashBoardContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null); // changed to array for modal

  const isValidValue = (val) =>
    val !== null && val !== undefined && val !== "" && val !== "null" && val !== "undefined";
  const getDisplayValue = (val, fallback = "N/A") => (isValidValue(val) ? val : fallback);

  const statusConfig = {
    A: { label: "Approved", variant: "success", icon: CheckCircle },
    C: { label: "Accounts Pending", variant: "warning", icon: Clock },
    V: { label: "MIS Pending", variant: "warning", icon: Clock },
    P: { label: "Purchase Pending", variant: "warning", icon: Clock },
    R: { label: "Rejected", variant: "destructive", icon: XCircle },
    D: { label: "Supplier Re-Submitted Kyc", variant: "default", icon: Clock },
  };

  const getStatusBadge = (status) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/kyc/get_kyc_report/${encodeURIComponent(userRole)}/${user}`);
        if (Array.isArray(res.data.datas)) {
          setAllKycData(res.data.datas);
        } else if (Array.isArray(res.data)) {
          setAllKycData(res.data);
        } else {
          setAllKycData([res.data]);
        }
        setError(null);
      } catch (e) {
        setError(e.message || "Failed to fetch KYC data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userRole, user]);

  // Apply frontend filters: search and category
  const filteredData = useMemo(() => {
    return allKycData.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        getDisplayValue(item.SupplierName, "").toLowerCase().includes(searchLower) ||
        getDisplayValue(item.Suppcode, "").toLowerCase().includes(searchLower) ||
        getDisplayValue(item.companyname, "").toLowerCase().includes(searchLower);
      const matchesCategory = categoryFilter === "all" || item.supplierCategory === categoryFilter;

      let matchesDate = true;
      if (startDate) {
        const createdAt = new Date(item.Createddate || item.createdAt);
        matchesDate = createdAt >= startDate;
      }
      if (matchesDate && endDate) {
        const createdAt = new Date(item.Createddate || item.createdAt);
        matchesDate = createdAt <= endDate;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [allKycData, searchQuery, categoryFilter, startDate, endDate]);

  // Group filtered data by GST, taking latest id (assuming id is numeric and present)
  const groupedByGST = useMemo(() => {
    const grouped = {};
    filteredData.forEach((item) => {
      const gst = item.gst || "NO_GST";
      if (!grouped[gst] || (item.id && grouped[gst].id < item.id)) {
        grouped[gst] = item;
      }
    });
    return Object.values(grouped);
  }, [filteredData]);

  // When user clicks on status, show all statuses for that GST
  const handleStatusClick = (gst) => {
    const allStatuses = allKycData.filter((item) => item.gst === gst);
    setSelectedItems(allStatuses.length > 0 ? allStatuses : null);
  };

  const DetailModal = ({ items, onClose }) => {
  if (!items || items.length === 0) return null;

  // Sort items by updatedAt in ascending order
  const sortedItems = [...items].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  const renderStatusRow = (label, user, date, reason = null) => {
    if (!user && !date) return null;
    return (
      <TableRow key={label}>
        <TableCell>{label}</TableCell>
        <TableCell>{getDisplayValue(user, "-")}</TableCell>
        <TableCell>{formatISODate(date)}</TableCell>
        <TableCell>{reason ? getDisplayValue(reason, "-") : "-"}</TableCell>
      </TableRow>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">KYC Status History for GST: {sortedItems[0].gst}-{sortedItems[0].companyname}</h2>

        <Table className="table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Step</TableHead>
              <TableHead>Action By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
  {sortedItems.map((item, idx) => (
    <React.Fragment key={idx}>
      {renderStatusRow(
        "Checked",
        item.chechedUser||"Purchase Team",
        item.checkeddate
      )}
      {renderStatusRow(
        "Verified",
        item.verifiedUser,
        item.verifydate
      )}
      {renderStatusRow(
        "Approved",
        item.approvedUser,
        item.approveddate
      )}
      {console.log(item.status)}
      {(item.status === "D" || item.status === "R")
        && renderStatusRow(
            "Rejected",
            item.rejectedUser || item.RejectectedBy,
            item.rejectedDate || item.updatedAt,
            item.RejecteedReason || item.rejectReason
          )
        
      }
      {renderStatusRow(
        "Re-Submitted",
        item.resubmittedUser,
        item.resubmittedDate
      )}
    </React.Fragment>
  ))}
</TableBody>

        </Table>
      </div>
    </div>
  );
};


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KYC Report...</p>
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
              <XCircle className="w-5 h-5" />
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

  // if (!groupedByGST) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle>No Data Found</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <p className="text-gray-600">No KYC data available for this user role.</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6 no-print">
        <CardHeader>
          <div className="flex items-center justify-between w-full gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {[...new Set(allKycData.map((i) => i.supplierCategory).filter(Boolean))].map(
                      (cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  isClearable
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
                  isClearable
                  placeholderText="End date"
                  className="w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStartDate(null);
                  setEndDate(null);
                }}
                className="text-red-600"
              >
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedByGST.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleStatusClick(item.gst)}
                  >
                    <TableCell>{getDisplayValue(item.supplierCategory)}</TableCell>
                    <TableCell className="font-medium">{getDisplayValue(item.Suppcode)}</TableCell>
                    <TableCell>{getDisplayValue(item.gst)}</TableCell>
                    <TableCell>{getDisplayValue(item.companyname)}</TableCell>
                    <TableCell>{getDisplayValue(item.city)}</TableCell>
                    <TableCell>{getDisplayValue(item.state)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {groupedByGST.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No records match your filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedItems && <DetailModal items={selectedItems} onClose={() => setSelectedItems(null)} />}
    </div>
  );
};

export default SupplierKYCOrderStatus;
