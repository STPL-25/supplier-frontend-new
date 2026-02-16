// import  { useState, useEffect, useContext, useRef, useMemo } from 'react';
// import { DashBoardContext } from '../../../DashBoardContext/DashBoardContext';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { useReactToPrint } from 'react-to-print';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import {  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle,} from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {  Table,  TableBody,  TableCell,  TableHead,  TableHeader,  TableRow,} from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from '@/components/ui/select';
// import {   FileText,  CheckCircle,   XCircle,   Clock,  Search,  FileSpreadsheet,  Printer,  Filter,  X,  Calendar,  User } from 'lucide-react';
// import { API } from '../../../config/configData';

// const KYCReport = () => {
//   const [allKycData, setAllKycData] = useState([]);
//   const [kycData, setKycData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, userRole } = useContext(DashBoardContext);
//   const printRef = useRef();
//    console.log(user)

//   // Filter States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [showFilters, setShowFilters] = useState(false);

//   // New filter states for verified/rejected user
//   const [verifiedUserFilter, setVerifiedUserFilter] = useState('all');
//   const [rejectedUserFilter, setRejectedUserFilter] = useState('all');

//   // For A/C role specific filters
//   const [acStatusFilter, setAcStatusFilter] = useState('all');

//   // Helper function to check if value is valid
//   const isValidValue = (value) => {
//     return value !== null && value !== undefined && value !== '' && value !== 'null' && value !== 'undefined';
//   };

//   const getDisplayValue = (value, fallback = 'N/A') => {
//     return isValidValue(value) ? value : fallback;
//   };

//   // Helper function to format ISO date to readable format
//   const formatISODate = (isoString) => {
//     if (!isValidValue(isoString)) return 'N/A';
//     try {
//       const date = new Date(isoString);
//       return date.toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
//     } catch {
//       return 'N/A';
//     }
//   };

//   // Helper function to compare dates (handles ISO strings)
//   const isDateInRange = (dateString, startDate, endDate) => {
//     if (!isValidValue(dateString) || !startDate || !endDate) return true;

//     try {
//       const itemDate = new Date(dateString);
//       // Reset time to compare only dates
//       itemDate.setHours(0, 0, 0, 0);

//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);

//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);

//       return itemDate >= start && itemDate <= end;
//     } catch {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const fetchKYCData = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get(`${API}/kyc/get_kyc_report/${encodeURIComponent(userRole)}/${user}`);

//         // If response contains array of data
//         if (Array.isArray(response.data.datas)) {
//           setAllKycData(response.data.datas);
//           setKycData(response.data.datas[0]);
//         } else if (Array.isArray(response.data)) {
//           setAllKycData(response.data);
//           setKycData(response.data[0]);
//         } else {
//           setAllKycData([response.data]);
//           setKycData(response.data);
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message || 'Failed to fetch KYC data');
//         console.error('Error fetching KYC data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchKYCData();
//   }, [userRole]);

//   // Get unique verified users
//   const verifiedUsers = useMemo(() => {
//     const users = [...new Set(allKycData
//       .map(item => item.verifiedUser)
//       .filter(Boolean))];
//     return users;
//   }, [allKycData]);

//   // Get unique rejected users
//   const rejectedUsers = useMemo(() => {
//     const users = [...new Set(allKycData
//       .map(item => item.rejectedUser)
//       .filter(Boolean))];
//     return users;
//   }, [allKycData]);

//   console.log(allKycData)
//   // Filtered Data using useMemo for performance
//   const filteredData = useMemo(() => {
//     return allKycData.filter((item) => {
//       // Search filter
//       const matchesSearch = searchQuery === '' ||
//         (item.SupplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          item.Suppcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//          item.companyname?.toLowerCase().includes(searchQuery.toLowerCase()));

//       // Status filter
//       const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

//       // Category filter
//       const matchesCategory = categoryFilter === 'all' || item.supplierCategory === categoryFilter;

//       // Verified user filter
//       const matchesVerifiedUser = verifiedUserFilter === 'all' ||
//         item.verifiedUser === verifiedUserFilter;

//       // Rejected user filter
//       const matchesRejectedUser = rejectedUserFilter === 'all' ||
//         item.rejectedUser === rejectedUserFilter;

//       // A/C specific status filter
//       const matchesAcStatus = acStatusFilter === 'all' || item.status === acStatusFilter;
//       const matchesMyApproval = acStatusFilter === 'myapproval' && item.verifiedUser === user;
//       // Date range filter for verifydate (ISO format)
//       console.log(acStatusFilter )
//       const matchesDateRange = isDateInRange(item.verifydate, startDate, endDate);

//       return matchesSearch &&
//              matchesStatus &&
//              matchesCategory &&
//              matchesVerifiedUser &&
//              matchesRejectedUser &&
//              (userRole.includes('A/C') ? matchesAcStatus : true) &&
//               (acStatusFilter === 'myapproval' ? matchesMyApproval : true) &&
//              matchesDateRange;
//     });
//   }, [allKycData, searchQuery, statusFilter, categoryFilter, verifiedUserFilter,
//       rejectedUserFilter, acStatusFilter, startDate, endDate, userRole]);

//   // Get unique categories for filter dropdown
//   const categories = useMemo(() => {
//     const cats = [...new Set(allKycData.map(item => item.supplierCategory).filter(Boolean))];
//     return cats;
//   }, [allKycData]);

//   // Export to Excel
//   const exportToExcel = () => {
//     const exportData = filteredData.map(item => ({
//       'Supplier Code': getDisplayValue(item.Suppcode),
//       'Supplier Name': getDisplayValue(item.SupplierName),
//       'Company Name': getDisplayValue(item.companyname),
//       'GST Number': getDisplayValue(item.gst),
//       'PAN Number': getDisplayValue(item.pan),
//       'Status': item.status === 'A' ? 'Approved' : item.status === 'P' ? 'Pending' :
//                 item.status === 'C' ? 'Accounts Pending' : item.status === 'V' ? 'Admin Pending': item.status === 'D' ? 'Supplier Re-Submitted Kyc' : 'Rejected',
//       'Category': getDisplayValue(item.supplierCategory),
//       'Mobile': getDisplayValue(item.mobilenumber),
//       'Email': getDisplayValue(item.email),
//       'City': getDisplayValue(item.city),
//       'State': getDisplayValue(item.state),

//       'Verified By': getDisplayValue(item.verifiedUser),
//       'Verified Date': formatISODate(item.verifydate),
//       'Rejected By': getDisplayValue(item.rejectedUser),
//       'Approved Date': formatISODate(item.approveddate)
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'KYC Report');

//     // Set column widths
//     const maxWidth = 20;
//     worksheet['!cols'] = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));

//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const exportData = filteredData.map(item => ({
//       'Supplier Code': getDisplayValue(item.Suppcode),
//       'Supplier Name': getDisplayValue(item.SupplierName),
//       'Company Name': getDisplayValue(item.companyname),
//       'GST Number': getDisplayValue(item.gst),
//       'PAN Number': getDisplayValue(item.pan),
//       'Status': item.status === 'A' ? 'Approved' : item.status === 'P' ? 'Pending' :
//                 item.status === 'C' ? 'Accounts Pending' : item.status === 'V' ? 'Admin Pending' : 'Rejected',
//       'Category': getDisplayValue(item.supplierCategory),
//       'Mobile': getDisplayValue(item.mobilenumber),
//       'Email': getDisplayValue(item.email),
//       'City': getDisplayValue(item.city),

//       'Verified By': getDisplayValue(item.verifiedUser),
//       'Verified Date': formatISODate(item.verifydate),
//       'Rejected By': getDisplayValue(item.rejectedUser)
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);
//     const data = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.csv`);
//   };

//   // Print functionality
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `KYC_Report_${kycData?.SupplierName || 'Unknown'}`,
//     pageStyle: `
//       @page {
//         size: A4;
//         margin: 20mm;
//       }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         .no-print { display: none !important; }
//       }
//     `
//   });

//   // Clear all filters
//   const clearFilters = () => {
//     setSearchQuery('');
//     setStatusFilter('all');
//     setCategoryFilter('all');
//     setDateRange([null, null]);
//     setVerifiedUserFilter('all');
//     setRejectedUserFilter('all');
//     setAcStatusFilter('all');
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       'A': { label: 'Approved', variant: 'success', icon: CheckCircle },
//       'C': { label: 'Accounts Pending', variant: 'warning', icon: Clock },
//       'V': { label: 'Admin Pending', variant: 'warning', icon: Clock },
//       'P': { label: 'Purchase Pending', variant: 'warning', icon: Clock },
//       'R': { label: 'Rejected', variant: 'destructive', icon: XCircle },
//       'D': { label: 'Supplier Re-Submitted Kyc', variant: 'default', icon: Clock },
//     };

//     const config = statusConfig[status] || { label: 'Unknown', variant: 'default', icon: Clock };
//     const Icon = config.icon;

//     return (
//       <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
//         <Icon className="w-3 h-3" />
//         {config.label}
//       </Badge>
//     );
//   };

//   const parseMetals = (metalsString) => {
//     if (!isValidValue(metalsString)) return [];
//     try {
//       const parsed = JSON.parse(JSON.parse(metalsString));
//       return Array.isArray(parsed) ? parsed.filter(m => isValidValue(m)) : [];
//     } catch {
//       return [];
//     }
//   };

//   const cleanFileUrl = (url) => {
//     if (!isValidValue(url)) return null;
//     try {
//       const cleaned = JSON.parse(url);
//       return isValidValue(cleaned) ? cleaned : null;
//     } catch {
//       return url;
//     }
//   };

//   const downloadFile = (url, filename) => {
//     const cleanUrl = cleanFileUrl(url);
//     if (!cleanUrl) return;

//     const link = document.createElement('a');
//     link.href = cleanUrl;
//     link.download = filename;
//     link.target = '_blank';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading KYC Report...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-red-600 flex items-center gap-2">
//               <XCircle className="w-5 h-5" />
//               Error Loading Data
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">{error}</p>
//             <Button onClick={() => window.location.reload()} className="mt-4">
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!kycData && allKycData.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>No Data Found</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">No KYC data available for this user role.</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const metals = parseMetals(kycData?.tradeMetals);
//   const hasInsurance = kycData?.hasInsurance === 'Yes' && isValidValue(kycData?.insurance_company);

//   return (
//     <div className="container mx-auto py-8">
//       {/* Filter and Export Section */}
//       <Card className="mb-6 no-print">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5" />
//               <CardTitle>Filters & Export</CardTitle>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? 'Hide' : 'Show'} Filters
//             </Button>
//           </div>
//         </CardHeader>

//         {showFilters && (
//           <CardContent className="space-y-4">
//             {/* First Row - Search and Basic Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Search Input */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by name or code..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>

//               {/* Status Filter */}
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="myapproval">My Approval</SelectItem>
//                   <SelectItem value="A">Fully Approved</SelectItem>
//                   <SelectItem value="C">Accounts Pending</SelectItem>
//                   <SelectItem value="V">Admin Pending</SelectItem>
//                   <SelectItem value="P">Purchase Pending</SelectItem>
//                   <SelectItem value="R">Rejected</SelectItem>
//                 </SelectContent>
//               </Select>

//               {/* Category Filter */}
//               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               {/* Date Range Picker */}
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={(update) => setDateRange(update)}
//                   isClearable={true}
//                   placeholderText="Select date range"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   dateFormat="dd/MM/yyyy"
//                 />
//               </div>
//             </div>

//             {/* Second Row - User Filters and A/C Specific */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Verified User Filter */}
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <Select value={verifiedUserFilter} onValueChange={setVerifiedUserFilter}>
//                   <SelectTrigger className="pl-10">
//                     <SelectValue placeholder="Filter by Verified User" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Verified Users</SelectItem>
//                     {verifiedUsers.map((user) => (
//                       <SelectItem key={user} value={user}>
//                         {user}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Rejected User Filter */}
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <Select value={rejectedUserFilter} onValueChange={setRejectedUserFilter}>
//                   <SelectTrigger className="pl-10">
//                     <SelectValue placeholder="Filter by Rejected User" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Rejected Users</SelectItem>
//                     {rejectedUsers.map((user) => (
//                       <SelectItem key={user} value={user}>
//                         {user}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* A/C Role Specific Filter */}
//               {userRole.includes('A/C') && (
//                 <Select value={acStatusFilter} onValueChange={setAcStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="A/C Status Filter" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All A/C Status</SelectItem>
//                      <SelectItem value="myapproval">My Approval</SelectItem>
//                     <SelectItem value="A">Approved</SelectItem>
//                     <SelectItem value="C">Accounts Pending</SelectItem>
//                     <SelectItem value="V">Admin Pending</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex items-center justify-between pt-4 border-t">
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline">
//                   {filteredData.length} of {allKycData.length} records
//                 </Badge>
//                 {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ||
//                   verifiedUserFilter !== 'all' || rejectedUserFilter !== 'all' ||
//                   acStatusFilter !== 'all' || startDate) && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={clearFilters}
//                     className="text-red-600"
//                   >
//                     <X className="w-4 h-4 mr-1" />
//                     Clear Filters
//                   </Button>
//                 )}
//               </div>

//               <div className="flex items-center gap-2">

//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToExcel}
//                   disabled={filteredData.length === 0}
//                 >
//                   <FileSpreadsheet className="w-4 h-4 mr-2" />
//                   Export Excel
//                 </Button>

//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>

//       {/* Supplier List Table */}
//       {allKycData.length > 1 && (
//         <Card className="mb-6 no-print">
//           <CardHeader>
//             <CardTitle>All KYC Records</CardTitle>
//             <CardDescription>Click on a row to view details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Supplier Code</TableHead>
//                     <TableHead>Supplier Name</TableHead>
//                     <TableHead>Company</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>GST</TableHead>
//                     <TableHead>Verified By</TableHead>
//                     <TableHead>Verified Date</TableHead>
//                     <TableHead>Rejected By</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredData.map((item, index) => (
//                     <TableRow
//                       key={index}
//                       className="cursor-pointer hover:bg-gray-50"
//                       onClick={() => setKycData(item)}
//                     >
//                       <TableCell className="font-medium">{getDisplayValue(item.Suppcode)}</TableCell>
//                       <TableCell>{getDisplayValue(item.SupplierName)}</TableCell>
//                       <TableCell>{getDisplayValue(item.companyname)}</TableCell>
//                       <TableCell>{getStatusBadge(item.status)}</TableCell>
//                       <TableCell>
//                         {isValidValue(item.supplierCategory) && (
//                           <Badge variant="outline">{item.supplierCategory}</Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{getDisplayValue(item.gst)}</TableCell>
//                       <TableCell>
//                         {isValidValue(item.verifiedUser) && (
//                           <Badge variant="secondary" className="flex items-center gap-1">
//                             <User className="w-3 h-3" />
//                             {item.verifiedUser}
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{formatISODate(item.verifydate)}</TableCell>
//                       <TableCell>
//                         {isValidValue(item.rejectedUser) && (
//                           <Badge variant="destructive" className="flex items-center gap-1">
//                             <User className="w-3 h-3" />
//                             {item.rejectedUser}
//                           </Badge>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//             {filteredData.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>No records match your filters</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}

//     </div>
//   );
// };

// export default KYCReport;
// import { useState, useEffect, useContext, useRef, useMemo } from "react";
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useReactToPrint } from "react-to-print";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   FileText,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Search,
//   FileSpreadsheet,
//   Printer,
//   Filter,
//   X,
//   Calendar,
//   User,
// } from "lucide-react";
// import { API } from "../../../config/configData";

// const KYCReport = () => {
//   const [allKycData, setAllKycData] = useState([]);
//   const [kycData, setKycData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user, userRole } = useContext(DashBoardContext);
//   const printRef = useRef();

//   // Filter States
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [startDate, endDate] = dateRange;
//   const [showFilters, setShowFilters] = useState(false);
//   const [verifiedUserFilter, setVerifiedUserFilter] = useState("all");
//   const [rejectedUserFilter, setRejectedUserFilter] = useState("all");
//   const [acStatusFilter, setAcStatusFilter] = useState("all");

//   // Helper functions
//   const isValidValue = (value) =>
//     value !== null &&
//     value !== undefined &&
//     value !== "" &&
//     value !== "null" &&
//     value !== "undefined";
//   const getDisplayValue = (value, fallback = "N/A") =>
//     isValidValue(value) ? value : fallback;
//   const formatISODate = (isoString) => {
//     if (!isValidValue(isoString)) return "N/A";
//     try {
//       const date = new Date(isoString);
//       return date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//       });
//     } catch {
//       return "N/A";
//     }
//   };
//   const isDateInRange = (dateString, startDate, endDate) => {
//     if (!isValidValue(dateString) || !startDate || !endDate) return true;
//     try {
//       const itemDate = new Date(dateString);
//       itemDate.setHours(0, 0, 0, 0);
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
//       return itemDate >= start && itemDate <= end;
//     } catch {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const fetchKYCData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `${API}/kyc/get_kyc_report/${encodeURIComponent(userRole)}/${user}`
//         );
//         if (Array.isArray(response.data.datas)) {
//           setAllKycData(response.data.datas);
//           setKycData(response.data.datas[0]);
//         } else if (Array.isArray(response.data)) {
//           setAllKycData(response.data);
//           setKycData(response.data[0]);
//         } else {
//           setAllKycData([response.data]);
//           setKycData(response.data);
//         }
//         setError(null);
//       } catch (err) {
//         setError(err.message || "Failed to fetch KYC data");
//         console.error("Error fetching KYC data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchKYCData();
//   }, [userRole, user]);

//   const verifiedUsers = useMemo(() => {
//     return [
//       ...new Set(allKycData.map((item) => item.verifiedUser).filter(Boolean)),
//     ];
//   }, [allKycData]);
//   const rejectedUsers = useMemo(() => {
//     return [
//       ...new Set(allKycData.map((item) => item.rejectedUser).filter(Boolean)),
//     ];
//   }, [allKycData]);

//   // FINAL FILTER LOGIC WITH "MY APPROVAL" SUPPORT
//   const filteredData = useMemo(() => {
//     return allKycData.filter((item) => {
//       const matchesSearch =
//         searchQuery === "" ||
//         item.SupplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.Suppcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.companyname?.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesStatus =
//         statusFilter === "all" ||
//         (statusFilter !== "myapproval" ? item.status === statusFilter : true);

//       const matchesCategory =
//         categoryFilter === "all" || item.supplierCategory === categoryFilter;
//       const matchesVerifiedUser =
//         verifiedUserFilter === "all" ||
//         item.verifiedUser === verifiedUserFilter;
//       const matchesRejectedUser =
//         rejectedUserFilter === "all" ||
//         item.rejectedUser === rejectedUserFilter;

//       const matchesAcStatus =
//         acStatusFilter === "all" ||
//         (acStatusFilter !== "myapproval"
//           ? item.status === acStatusFilter
//           : true);
//       const matchesDateRange = isDateInRange(
//         item.verifydate,
//         startDate,
//         endDate
//       );

//       // For "My Approval" logic
//       // A/C Role: filter by acStatusFilter if set to 'myapproval'
//       if (userRole.includes("A/C") && acStatusFilter === "myapproval") {
//         // Show only if user is verifier and status is A (Approved) or V (Admin Pending)
//         if (
//           !(
//             item.verifiedUser === user &&
//             (item.status === "A" || item.status === "V")
//           )
//         ) {
//           return false;
//         }
//       }
//       // General Role: filter by statusFilter if set to 'myapproval'
//       else if (statusFilter === "myapproval") {
//         // Show only if user is verifier
//         if (item.verifiedUser !== user) {
//           return false;
//         }
//       }

//       // Final composite filter
//       return (
//         matchesSearch &&
//         matchesStatus &&
//         matchesCategory &&
//         matchesVerifiedUser &&
//         matchesRejectedUser &&
//         matchesAcStatus &&
//         matchesDateRange
//       );
//     });
//   }, [
//     allKycData,
//     searchQuery,
//     statusFilter,
//     categoryFilter,
//     verifiedUserFilter,
//     rejectedUserFilter,
//     acStatusFilter,
//     startDate,
//     endDate,
//     userRole,
//     user,
//   ]);

//   const categories = useMemo(() => {
//     return [
//       ...new Set(
//         allKycData.map((item) => item.supplierCategory).filter(Boolean)
//       ),
//     ];
//   }, [allKycData]);
//   const exportToExcel = () => {
//     const exportData = filteredData.map((item) => ({
//       "Supplier Code": getDisplayValue(item.Suppcode),
//       "Supplier Name": getDisplayValue(item.SupplierName),
//       "Company Name": getDisplayValue(item.companyname),
//       "GST Number": getDisplayValue(item.gst),
//       "PAN Number": getDisplayValue(item.pan),
//       Status:
//         item.status === "A"
//           ? "Approved"
//           : item.status === "P"
//           ? "Pending"
//           : item.status === "C"
//           ? "Accounts Pending"
//           : item.status === "V"
//           ? "Admin Pending"
//           : item.status === "D"
//           ? "Supplier Re-Submitted Kyc"
//           : "Rejected",
//       Category: getDisplayValue(item.supplierCategory),
//       Mobile: getDisplayValue(item.mobilenumber),
//       Email: getDisplayValue(item.email),
//       City: getDisplayValue(item.city),
//       State: getDisplayValue(item.state),
//       // 'Verified By': getDisplayValue(item.verifiedUser),
//       // 'Verified Date': formatISODate(item.verifydate),
//       // 'Rejected By': getDisplayValue(item.rejectedUser),
//       // 'Approved Date': formatISODate(item.approveddate)
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "KYC Report");
//     worksheet["!cols"] = Object.keys(exportData[0] || {}).map(() => ({
//       wch: 20,
//     }));
//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });
//     const data = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.xlsx`);
//   };
//   const exportToCSV = () => {
//     const exportData = filteredData.map((item) => ({
//       "Supplier Code": getDisplayValue(item.Suppcode),
//       "Supplier Name": getDisplayValue(item.SupplierName),
//       "Company Name": getDisplayValue(item.companyname),
//       "GST Number": getDisplayValue(item.gst),
//       "PAN Number": getDisplayValue(item.pan),
//       Status:
//         item.status === "A"
//           ? "Approved"
//           : item.status === "P"
//           ? "Pending"
//           : item.status === "C"
//           ? "Accounts Pending"
//           : item.status === "V"
//           ? "Admin Pending"
//           : "Rejected",
//       Category: getDisplayValue(item.supplierCategory),
//       Mobile: getDisplayValue(item.mobilenumber),
//       Email: getDisplayValue(item.email),
//       City: getDisplayValue(item.city),
//       // 'Verified By': getDisplayValue(item.verifiedUser),
//       // 'Verified Date': formatISODate(item.verifydate),
//       // 'Rejected By': getDisplayValue(item.rejectedUser)
//     }));
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);
//     const data = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.csv`);
//   };
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: `KYC_Report_${kycData?.SupplierName || "Unknown"}`,
//     pageStyle: `
//       @page {
//         size: A4;
//         margin: 20mm;
//       }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         .no-print { display: none !important; }
//       }
//     `,
//   });
//   const clearFilters = () => {
//     setSearchQuery("");
//     setStatusFilter("all");
//     setCategoryFilter("all");
//     setDateRange([null, null]);
//     setVerifiedUserFilter("all");
//     setRejectedUserFilter("all");
//     setAcStatusFilter("all");
//   };
//   const getStatusBadge = (status) => {
//     const statusConfig = {
//       A: { label: "Approved", variant: "success", icon: CheckCircle },
//       C: { label: "Accounts Pending", variant: "warning", icon: Clock },
//       V: { label: "Admin Pending", variant: "warning", icon: Clock },
//       P: { label: "Purchase Pending", variant: "warning", icon: Clock },
//       R: { label: "Rejected", variant: "destructive", icon: XCircle },
//       D: {
//         label: "Supplier Re-Submitted Kyc",
//         variant: "default",
//         icon: Clock,
//       },
//     };
//     const config = statusConfig[status] || {
//       label: "Unknown",
//       variant: "default",
//       icon: Clock,
//     };
//     const Icon = config.icon;
//     return (
//       <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
//         <Icon className="w-3 h-3" />
//         {config.label}
//       </Badge>
//     );
//   };
//   const parseMetals = (metalsString) => {
//     if (!isValidValue(metalsString)) return [];
//     try {
//       const parsed = JSON.parse(JSON.parse(metalsString));
//       return Array.isArray(parsed) ? parsed.filter((m) => isValidValue(m)) : [];
//     } catch {
//       return [];
//     }
//   };
//   const cleanFileUrl = (url) => {
//     if (!isValidValue(url)) return null;
//     try {
//       const cleaned = JSON.parse(url);
//       return isValidValue(cleaned) ? cleaned : null;
//     } catch {
//       return url;
//     }
//   };
//   const downloadFile = (url, filename) => {
//     const cleanUrl = cleanFileUrl(url);
//     if (!cleanUrl) return;
//     const link = document.createElement("a");
//     link.href = cleanUrl;
//     link.download = filename;
//     link.target = "_blank";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading KYC Report...</p>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-red-600 flex items-center gap-2">
//               <XCircle className="w-5 h-5" />
//               Error Loading Data
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">{error}</p>
//             <Button onClick={() => window.location.reload()} className="mt-4">
//               Retry
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
//   if (!kycData && allKycData.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle>No Data Found</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-gray-600">
//               No KYC data available for this user role.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
//   const metals = parseMetals(kycData?.tradeMetals);
//   const hasInsurance =
//     kycData?.hasInsurance === "Yes" && isValidValue(kycData?.insurance_company);

//   return (
//     <div className="container mx-auto py-8">
//       {/* Filter and Export Section */}
//       <Card className="mb-6 no-print">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5" />
//               <CardTitle>Filters & Export</CardTitle>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setShowFilters(!showFilters)}
//             >
//               {showFilters ? "Hide" : "Show"} Filters
//             </Button>
//           </div>
//         </CardHeader>
//         {showFilters && (
//           <CardContent className="space-y-4">
//             {/* First Row - Search and Basic Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Search Input */}
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search by name or code..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               {/* Status Filter */}
//               {!userRole.includes("A/C") && (
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Filter by Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     {/* <SelectItem value="myapproval">My Approval</SelectItem> */}
//                     <SelectItem value="A">Fully Approved</SelectItem>
//                     <SelectItem value="C">Accounts Pending</SelectItem>
//                     <SelectItem value="V">MIS Pending</SelectItem>
//                     <SelectItem value="P">Purchase Pending</SelectItem>
//                     <SelectItem value="R">Rejected</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//               {userRole.includes("A/C") && (
//                 <Select
//                   value={acStatusFilter}
//                   onValueChange={setAcStatusFilter}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="A/C Status Filter" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All A/C Status</SelectItem>
//                     <SelectItem value="myapproval">My Approval</SelectItem>
//                     <SelectItem value="A">Approved</SelectItem>
//                     <SelectItem value="C">Accounts Pending</SelectItem>
//                     <SelectItem value="V">
//                       A/c Verification Completed
//                     </SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//               {/* Category Filter */}
//               <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Filter by Category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Categories</SelectItem>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat} value={cat}>
//                       {cat}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {/* Date Range Picker */}
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={(update) => setDateRange(update)}
//                   isClearable={true}
//                   placeholderText="Select date range"
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   dateFormat="dd/MM/yyyy"
//                 />
//               </div>
//             </div>
//             {/* Second Row - User Filters and A/C Specific */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {/* Verified User Filter */}
//               {/* <div className="relative">
//                 <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <Select value={verifiedUserFilter} onValueChange={setVerifiedUserFilter}>
//                   <SelectTrigger className="pl-10">
//                     <SelectValue placeholder="Filter by Verified User" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Verified Users</SelectItem>
//                     {verifiedUsers.map((user) => (
//                       <SelectItem key={user} value={user}>{user}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div> */}
//               {/* Rejected User Filter */}
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
//                 <Select
//                   value={rejectedUserFilter}
//                   onValueChange={setRejectedUserFilter}
//                 >
//                   <SelectTrigger className="pl-10">
//                     <SelectValue placeholder="Filter by Rejected User" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Rejected Users</SelectItem>
//                     {userRole.includes("A/C") ? (
//                       <SelectItem value={user}>{user}</SelectItem>
//                     ) : (
//                       rejectedUsers.map((user) => (
//                         <SelectItem key={user} value={user}>
//                           {user}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* A/C Role Specific Filter */}
//               {/* {console.log('User Role:', userRole.includes('A/C'))} */}
//             </div>
//             {/* Action Buttons */}
//             <div className="flex items-center justify-between pt-4 border-t">
//               <div className="flex items-center gap-2">
//                 <Badge variant="outline">
//                   {filteredData.length} of {allKycData.length} records
//                 </Badge>
//                 {(searchQuery ||
//                   statusFilter !== "all" ||
//                   categoryFilter !== "all" ||
//                   verifiedUserFilter !== "all" ||
//                   rejectedUserFilter !== "all" ||
//                   acStatusFilter !== "all" ||
//                   startDate) && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={clearFilters}
//                     className="text-red-600"
//                   >
//                     <X className="w-4 h-4 mr-1" />
//                     Clear Filters
//                   </Button>
//                 )}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToExcel}
//                   disabled={filteredData.length === 0}
//                 >
//                   <FileSpreadsheet className="w-4 h-4 mr-2" />
//                   Export Excel
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         )}
//       </Card>
//       {/* Supplier List Table */}
//       {allKycData.length > 1 && (
//         <Card className="mb-6 no-print">
//           <CardHeader>
//             <CardTitle>All KYC Records</CardTitle>
//             <CardDescription>Click on a row to view details</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Supplier Code</TableHead>
//                     <TableHead>Supplier Name</TableHead>
//                     <TableHead>Company</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>GST</TableHead>
//                     {/* <TableHead>Verified By</TableHead>
//                     <TableHead>Verified Date</TableHead> */}
//                     <TableHead>Rejected Reason</TableHead>
//                     <TableHead>Rejected Date</TableHead>

//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredData.map((item, index) => (
//                     <TableRow
//                       key={index}
//                       className="cursor-pointer hover:bg-gray-50"
//                       onClick={() => setKycData(item)}
//                     >
//                       <TableCell className="font-medium">
//                         {getDisplayValue(item.Suppcode)}
//                       </TableCell>
//                       <TableCell>
//                         {getDisplayValue(item.SupplierName)}
//                       </TableCell>
//                       <TableCell>{getDisplayValue(item.companyname)}</TableCell>
//                       <TableCell>{getStatusBadge(item.status)}</TableCell>
//                       <TableCell>
//                         {isValidValue(item.supplierCategory) && (
//                           <Badge variant="outline">
//                             {item.supplierCategory}
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{getDisplayValue(item.gst)}</TableCell>
//                       {/* <TableCell>
//                         {isValidValue(item.verifiedUser) && (
//                           <Badge variant="secondary" className="flex items-center gap-1">
//                             <User className="w-3 h-3" />
//                             {item.verifiedUser}
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell>{formatISODate(item.verifydate)}</TableCell> */}
//                       {/* <TableCell>
//                         {isValidValue(item.rejectedUser) && (
//                           <Badge variant="destructive" className="flex items-center gap-1">
//                             <User className="w-3 h-3" />
//                             {item.rejectedUser}
//                           </Badge>
//                         )}
//                       </TableCell> */}
//                       <TableCell>
//                         {isValidValue(item.rejectedUser) &&
//                           (item.status == "D" || item.status == "R") && (
//                             <Badge
//                               variant="destructive"
//                               className="flex items-center gap-1"
//                             >
//                               <User className="w-3 h-3" />
//                               {item.RejecteedReason}
//                             </Badge>
//                           )}
//                       </TableCell>
//                        <TableCell>
//                         {isValidValue(item.rejectedUser) &&
//                           (item.status == "D" || item.status == "R") && (
//                             <Badge
//                               variant="outline"
//                               className="flex items-center gap-1"
//                             >
//                              <User className="w-3 h-3" />
//                               {item.rejectedDate||item.updatedAt}
//                             </Badge>
//                           )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//             {filteredData.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//                 <p>No records match your filters</p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default KYCReport;
import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
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
  CheckCircle,
  XCircle,
  Clock,
  Search,
  FileSpreadsheet,
  X,
  Calendar,
  User,
} from "lucide-react";
import { API } from "../../../config/configData";

// KYCReport component
const KYCReport = () => {
  const [allKycData, setAllKycData] = useState([]);
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, userRole } = useContext(DashBoardContext);
  const printRef = useRef();

  // Filter States (now inside table header)
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // grouped for non-A/C (kept for compatibility)
  // tableStatusFilter supports: 'all', 'A', 'A_me', 'P', 'C', 'V', 'R', 'R_me', 'D'
  const [tableStatusFilter, setTableStatusFilter] = useState( userRole.includes("A/C") ? "A_me" : "all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  // replaced dateRange with separate start/end dates
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [verifiedUserFilter, setVerifiedUserFilter] = useState("all");
  const [rejectedUserFilter, setRejectedUserFilter] = useState("all");
  // A/C grouped filter
  const [acStatusFilter, setAcStatusFilter] = useState("all");
  const [dateSortOrder, setDateSortOrder] = useState("asc");

  // Helper functions
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
      A: { label: "Approved", variant: "success", icon: CheckCircle },
      C: { label: "Accounts Pending", variant: "warning", icon: Clock },
      V: { label: "MIS Pending", variant: "warning", icon: Clock },
      P: { label: "Purchase Pending", variant: "warning", icon: Clock },
      R: { label: "Rejected", variant: "destructive", icon: XCircle },
      D: { label: "Supplier Re-Submitted Kyc", variant: "default", icon: Clock },
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
    // if no date filtering applied, accept all
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

  // Fetch data
  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API}/kyc/get_kyc_report/${encodeURIComponent(userRole)}/${user}`
        );
        if (Array.isArray(response.data.datas)) {
          setAllKycData(response.data.datas);
          setKycData(response.data.datas[0]);
        } else if (Array.isArray(response.data)) {
          setAllKycData(response.data);
          setKycData(response.data[0]);
        } else {
          setAllKycData([response.data]);
          setKycData(response.data);
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch KYC data");
        console.error("Error fetching KYC data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKYCData();
  }, [userRole, user]);

  const verifiedUsers = useMemo(() => {
    return [
      ...new Set(allKycData.map((item) => item.verifiedUser).filter(Boolean)),
    ];
  }, [allKycData]);

  const rejectedUsers = useMemo(() => {
    return [
      ...new Set(allKycData.map((item) => item.rejectedUser).filter(Boolean)),
    ];
  }, [allKycData]);

  // Filter logic (tableStatusFilter supports new A_me / R_me)
  const filteredData = useMemo(() => {
    // accepts full item
    const statusGroupMatch = (item) => {
      const itemStatus = item?.status;
      // console.log(item.verifiedUser,user)
      if (tableStatusFilter && tableStatusFilter !== "all") {
        // handle special tableStatusFilter values
        if (tableStatusFilter === "A") return itemStatus === "A"; // Completed (all A)
        if (tableStatusFilter === "all_me") return itemStatus === "A" && item.verifiedUser === user; // Approved by me

        if (tableStatusFilter === "A_me") return item.verifiedUser === user; // Approved by me
        if (tableStatusFilter === "R") return ["R", "D"].includes(itemStatus); // Rejected all
        if (tableStatusFilter === "R_me") return ["R", "D"].includes(itemStatus) && item.rejectedUser === user; // Rejected by me
        // exact match for other codes (P/C/V/D)
        return itemStatus === tableStatusFilter;
      }

      // fallback to grouped statusFilter (kept for compatibility)
      if (statusFilter === "all") return true;
      if (statusFilter === "Approved") return itemStatus === "A";
      if (statusFilter === "Pending") return ["P", "C", "V"].includes(itemStatus);
      if (statusFilter === "Rejected") return ["R", "D"].includes(itemStatus);
      return true;
    };

    const acGroupMatch = (item) => {
      // A/C grouped choices operate on item object
      if (acStatusFilter === "all") return true;
      if (acStatusFilter === "Completed") {
        return item.status === "A" && item.verifiedUser === user;
      }
      if (acStatusFilter === "RejectedByMe") {
        return ["R", "D"].includes(item.status) && item.rejectedUser === user;
      }
      if (acStatusFilter === "myapproval") {
        return item.verifiedUser === user && item.status === "A";
      }
      if (acStatusFilter === "Approved") return item.status === "A";
      if (acStatusFilter === "Pending") return ["P", "C", "V"].includes(item.status);
      if (acStatusFilter === "Rejected") return ["R", "D"].includes(item.status);
      return true;
    };

    return allKycData
      .filter((item) => {
        const matchesSearch =
          searchQuery === "" ||
          item.SupplierName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.Suppcode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.companyname?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusGroupMatch(item);
        const matchesAc = acGroupMatch(item);
        const matchesCategory = categoryFilter === "all" || item.supplierCategory === categoryFilter;
        const matchesVerifiedUser = verifiedUserFilter === "all" || item.verifiedUser === verifiedUserFilter;
        const matchesRejectedUser = rejectedUserFilter === "all" || item.rejectedUser === rejectedUserFilter;
        const matchesDateRange = isDateInRange(item.verifydate, startDate, endDate);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesAc &&
          matchesCategory &&
          matchesVerifiedUser &&
          matchesRejectedUser &&
          matchesDateRange
        );
      })
      .sort((a, b) => {
        const needsRejectedSort =
          statusFilter === "Rejected" ||
          statusFilter === "all" ||
          tableStatusFilter === "R" ||
          tableStatusFilter === "R_me" ||
          tableStatusFilter === "D" ||
          acStatusFilter === "RejectedByMe" ||
          acStatusFilter === "Rejected";

        if (!needsRejectedSort) return 0;
        const dateA = new Date(a.rejectedDate || a.updatedAt || a.verifydate || 0);
        const dateB = new Date(b.rejectedDate || b.updatedAt || b.verifydate || 0);
        return dateSortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  }, [
    allKycData,
    searchQuery,
    statusFilter,
    tableStatusFilter,
    categoryFilter,
    verifiedUserFilter,
    rejectedUserFilter,
    acStatusFilter,
    startDate,
    endDate,
    user,
    dateSortOrder,
  ]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        allKycData.map((item) => item.supplierCategory).filter(Boolean)
      ),
    ];
  }, [allKycData]);

  // Export to Excel
  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      "Supplier Code": getDisplayValue(item.Suppcode),
      "Supplier Name": getDisplayValue(item.SupplierName),
      "Company Name": getDisplayValue(item.companyname),
      "GST Number": getDisplayValue(item.gst),
      "PAN Number": getDisplayValue(item.pan),
      Status:
        item.status === "A"
          ? "Approved"
          : item.status === "P"
          ? "Purchase Pending"
          : item.status === "C"
          ? "Accounts Pending"
          : item.status === "V"
          ? "MIS Pending"
          : item.status === "D"
          ? "Supplier Re-Submitted Kyc"
          : "Rejected",
      Category: getDisplayValue(item.supplierCategory),
      Mobile: getDisplayValue(item.mobilenumber),
      Email: getDisplayValue(item.email),
      City: getDisplayValue(item.city),
      State: getDisplayValue(item.state),
      "Verified Date": formatISODate(item.verifydate),
      "Rejected Date": formatISODate(item.rejectedDate),
      "Rejected Reason": getDisplayValue(item.RejecteedReason, ""),
      "Verified By": getDisplayValue(item.verifiedUser, ""),
      "Rejected By": getDisplayValue(item.rejectedUser, ""),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KYC Report");
    worksheet["!cols"] = Object.keys(exportData[0] || {}).map(() => ({ wch: 20 }));
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, `KYC_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  // decide whether to show extra columns
  const showVerifiedDate =
    statusFilter === "Approved" ||
    acStatusFilter === "Approved" ||
    acStatusFilter === "Completed" ||
    tableStatusFilter === "A" ||
    tableStatusFilter === "A_me" ||
     tableStatusFilter === "all_me" ||
    acStatusFilter === "myapproval";

  const showRejectedDetails =
    statusFilter === "Rejected" ||
    acStatusFilter === "Rejected" ||
    acStatusFilter === "RejectedByMe" ||
    tableStatusFilter === "R" ||
    tableStatusFilter === "R_me" ||
    tableStatusFilter === "D";

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTableStatusFilter("all");
    setCategoryFilter("all");
    setVerifiedUserFilter("all");
    setRejectedUserFilter("all");
    setAcStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
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

  if (!kycData && allKycData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Data Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No KYC data available for this user role.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6 no-print">
        <CardHeader>
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Table status (exact) */}
              <div className="mx-auto">
                <Select value={tableStatusFilter} onValueChange={(v) => setTableStatusFilter(v)}>
                  <SelectTrigger className="min-w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=" " disabled>Status</SelectItem>

                    {userRole.includes("A/C") && (
                      <>
                        <SelectItem value="A_me">Approved (Mine)</SelectItem>
                      </>
                    )}
                    {!userRole.includes("A/C") && (
                      <>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="A">Approved (A)</SelectItem>
                      </>
                    )}
                    <SelectItem value="P">Purchase Pending (P)</SelectItem>
                    <SelectItem value="C">Accounts Pending (C)</SelectItem>
                    <SelectItem value="V">MIS Pending (V)</SelectItem>
                    {!userRole.includes("A/C") && (
                      <>
                        <SelectItem value="R">Rejected (R)</SelectItem>
                        <SelectItem value="D">Re-Submitted (D)</SelectItem>
                      </>
                    )}
                    {userRole.includes("A/C") && <SelectItem value="R_me">Rejected (Mine)</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              {userRole.includes("A/C") && 
              <>
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

              {/* End Date */}
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
              </>
              }
              {/* Clear filters */}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            </div>

            {/* Right side: export and sort */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc")}>
                Sort Date: {dateSortOrder === "asc" ? "Asc" : "Desc"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredData.length === 0}>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>GST</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Status</TableHead>

                  {showVerifiedDate && <TableHead>Verified Date</TableHead>}
                  {showRejectedDetails && <TableHead>Rejected Date</TableHead>}
                  {showRejectedDetails && <TableHead>Rejected Reason</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item, index) => (
                  <TableRow
                    key={index}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setKycData(item)}
                  >
                    <TableCell>{getDisplayValue(item.supplierCategory)}</TableCell>
                    <TableCell className="font-medium">{getDisplayValue(item.Suppcode)}</TableCell>
                    <TableCell>{getDisplayValue(item.gst)}</TableCell>
                    <TableCell>{getDisplayValue(item.companyname)}</TableCell>
                    <TableCell>{getDisplayValue(item.city)}</TableCell>
                    <TableCell>{getDisplayValue(item.state)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    {showVerifiedDate && <TableCell>{formatISODate(item.verifydate)}</TableCell>}
                    {showRejectedDetails && <TableCell>{formatISODate(item.rejectedDate || item.updatedAt)}</TableCell>}
                    {showRejectedDetails && <TableCell>{getDisplayValue(item.RejecteedReason, "N/A")}</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
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

export default KYCReport;


