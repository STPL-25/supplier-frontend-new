
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ChevronDown, X, Download } from "lucide-react";
// import axios from "axios";
// import { API } from "../../../config/configData";
// import { Loader2 } from "lucide-react";

// export default function MetalTransferReport() {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Essential filter states
//   const [filters, setFilters] = useState({
//     issue_no: "",
//     trns_metal: "",
//     trns_company: "",
//     status: "",
//     po_number: "",
//   });

//   // Column visibility state
//   const [visibleColumns, setVisibleColumns] = useState({
//     issue_no: true,
//     is_metal_available: true,
//     trns_metal: true,
//     crt_stock: true,
//     trns_company: true,
//     melting_wt: true,
//     wastage_wt: true,
//     pure_wt: true,
//     net_wt: true,
//     processed_by: true,
//     status: true,
//     comments: true,
//     po_number: true,
//     metal_issued_date: true,
//     created_date: true,
//     ParentCompany: true,
//     supplierIssueVoucherNo: true,
//     supplierIssueDate: true,
//     supplierTransferredMetalGrams: true,
//     suptotalWastage: true,
//     supmeltingWeight: true,
//     suppureWeight: true,
//     supnetWeight: true,
//   });

//   // Row selection state
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${API}/gold_Po/get_metal_allocated_date`);
//         setData(response.data || []);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Filter data based on filter values
//   const filteredData = data.filter((item) => {
//     return (
//       (item.issue_voucher_number?.toString().toLowerCase() || "")
//         .includes((filters.issue_no || "").toLowerCase()) &&
//       (item.trns_metal?.toString().toLowerCase() || "")
//         .includes((filters.trns_metal || "").toLowerCase()) &&
//       (item.trns_company?.toString().toLowerCase() || "")
//         .includes((filters.trns_company || "").toLowerCase()) &&
//       (item.status?.toString().toLowerCase() || "")
//         .includes((filters.status || "").toLowerCase()) &&
//       (item.po_number?.toString().toLowerCase() || "")
//         .includes((filters.po_number || "").toLowerCase())
//     );
//   });

//   // Calculate pagination
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = filteredData.slice(startIndex, endIndex);

//   // Handle filter change
//   const handleFilterChange = (filterName, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [filterName]: value,
//     }));
//     setCurrentPage(1);
//   };

//   // Handle column visibility toggle
//   const handleColumnVisibility = (column) => {
//     setVisibleColumns((prev) => ({
//       ...prev,
//       [column]: !prev[column],
//     }));
//   };

  
//   // Check if all visible rows are selected
//   const allSelected =
//     paginatedData.length > 0 &&
//     paginatedData.every((_, index) => selectedRows.has(startIndex + index));

//   // Reset filters
//   const handleResetFilters = () => {
//     setFilters({
//       issue_no: "",
//       trns_metal: "",
//       trns_company: "",
//       status: "",
//       po_number: "",
//     });
//     setCurrentPage(1);
//   };

//   const isFiltered = Object.values(filters).some((val) => val !== "");

//   // Format date
//   const formatDate = (dateString) => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString();
//     } catch {
//       return dateString;
//     }
//   };

//   // Toggle row expand
//   const toggleRowExpand = (index) => {
//     const newExpanded = new Set(expandedRows);
//     if (newExpanded.has(index)) {
//       newExpanded.delete(index);
//     } else {
//       newExpanded.add(index);
//     }
//     setExpandedRows(newExpanded);
//   };

//   // Professional download handler
//   const handleDownload = (url, filename = "document.pdf") => {
//     if (!url) return;
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = filename;
//     link.target = "_blank";
//     link.rel = "noopener noreferrer";
//     link.click();
//     link.remove();
//   };

//   return (
//     <div className="w-full space-y-6 p-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">
//           Metal Transfer Against PO Report
//         </h1>
//         <p className="mt-2 text-gray-600">
//           View and manage all metal transfer transactions
//         </p>
//       </div>

//       {/* Main Card */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle>Transactions</CardTitle>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="ml-auto h-8">
//                   Columns <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuCheckboxItem
//                   checked={allSelected}
//                   onCheckedChange={(checked) => {
//                     const allVisible = Object.values(visibleColumns).every((v) => v);
//                     setVisibleColumns(
//                       Object.keys(visibleColumns).reduce(
//                         (acc, key) => ({
//                           ...acc,
//                           [key]: !allVisible,
//                         }),
//                         {}
//                       )
//                     );
//                   }}
//                 >
//                   Toggle All
//                 </DropdownMenuCheckboxItem>
//                 <div className="border-t my-2"></div>
//                 {Object.keys(visibleColumns).map((column) => (
//                   <DropdownMenuCheckboxItem
//                     key={column}
//                     className="capitalize"
//                     checked={visibleColumns[column]}
//                     onCheckedChange={() => handleColumnVisibility(column)}
//                   >
//                     {column.replace(/_/g, " ")}
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           {/* Filters Section */}
//           <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
//             <div className="flex items-center justify-between">
//               <h3 className="font-semibold text-gray-700">Filters</h3>
//               {isFiltered && (
//                 <Button
//                   variant="ghost"
//                   onClick={handleResetFilters}
//                   size="sm"
//                   className="h-8"
//                 >
//                   Reset Filters
//                   <X className="ml-2 h-4 w-4" />
//                 </Button>
//               )}
//             </div>

//             {/* Filter Row 1 */}
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
//               <Input
//                 placeholder="Filter by Parent Issue No..."
//                 value={filters.issue_no}
//                 onChange={(e) => handleFilterChange("issue_no", e.target.value)}
//                 className="h-8"
//               />
//                <Input
//                 placeholder="Filter by Supplier Issue No..."
//                 value={filters.supplierIssueVoucherNo}
//                 onChange={(e) => handleFilterChange("supplierIssueVoucherNo", e.target.value)}
//                 className="h-8"
//               />
            
//             </div>

//             {/* Filter Row 2 */}
//             <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
//               <Select
//                 value={filters.status}
//                 onValueChange={(value) => handleFilterChange("status", value)}
//               >
//                 <SelectTrigger className="h-8">
//                   <SelectValue placeholder="Filter by Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All</SelectItem>
//                   <SelectItem value="A">Metal Issued</SelectItem>
//                   <SelectItem value="R">Metal Not Issued</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Input
//                 placeholder="Filter by Supplier PO Number..."
//                 value={filters.po_number}
//                 onChange={(e) => handleFilterChange("po_number", e.target.value)}
//                 className="h-8"
//               />
//             </div>
//           </div>

//           {/* Table */}
//           <div className="rounded-md border overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50">
//                   {/* <TableHead className="w-[50px] font-bold">
//                     <Checkbox
//                       checked={allSelected}
//                       onCheckedChange={handleSelectAll}
//                       aria-label="Select all rows"
//                     />
//                   </TableHead> */}
//                     <TableHead className="font-bold">S.no</TableHead>
                  
//                   {visibleColumns.issue_no && (
//                     <TableHead className="font-bold">Parent Issue Voucher No</TableHead>
//                   )}
//                   {/* {visibleColumns.is_metal_available && (
//                     <TableHead className="font-bold">Metal Available</TableHead>
//                   )} */}
               
//                   {visibleColumns.trns_metal && (
//                     <TableHead className="font-bold">parent Transfer Metal</TableHead>
//                   )}
//                        {visibleColumns.metal_issued_date && (
//                     <TableHead className="font-bold">Issued Date</TableHead>
//                   )}
               
//                   {visibleColumns.trns_company && (
//                     <TableHead className="font-bold">Company</TableHead>
//                   )}
//                     {visibleColumns.po_number && (
//                     <TableHead className="font-bold">Parent PO Number</TableHead>
//                   )}
//                   {visibleColumns.melting_wt && (
//                     <TableHead className="font-bold text-right">
//                       Parent Melting Weight (g)
//                     </TableHead>
//                   )}
//                   {visibleColumns.wastage_wt && (
//                     <TableHead className="font-bold text-right">
//                      Parent Wastage Weight (g)
//                     </TableHead>
//                   )}
//                   {visibleColumns.pure_wt && (
//                     <TableHead className="font-bold text-right">
//                       Parent Pure Weight (g)
//                     </TableHead>
//                   )}
//                   {visibleColumns.net_wt && (
//                     <TableHead className="font-bold text-right">
//                      Parent Net Weight (g)
//                     </TableHead>
//                   )}
                 
             
                
//                   {visibleColumns.created_date && (
//                     <TableHead className="font-bold">Created Date</TableHead>
//                   )}
//                   {visibleColumns.ParentCompany && (
//                     <TableHead className="font-bold">Supplier </TableHead>
//                   )}
//                   {visibleColumns.po_number && (
//                     <TableHead className="font-bold">Supplier PO Number</TableHead>
//                   )}
//                   {visibleColumns.supplierIssueVoucherNo && (
//                     <TableHead className="font-bold">Supp Voucher No</TableHead>
//                   )}
//                   {visibleColumns.supplierIssueDate && (
//                     <TableHead className="font-bold">Supp Issue Date</TableHead>
//                   )}
//                   {visibleColumns.supplierTransferredMetalGrams && (
//                     <TableHead className="font-bold">Trns Metal To Supp (g)</TableHead>
//                   )}
//                   {visibleColumns.suptotalWastage && (
//                     <TableHead className="font-bold">Supp Wastage</TableHead>
//                   )}
//                   {visibleColumns.supmeltingWeight && (
//                     <TableHead className="font-bold">Supp Melting Wt (g)</TableHead>
//                   )}
//                   {visibleColumns.suppureWeight && (
//                     <TableHead className="font-bold">Supp Pure Wt (g)</TableHead>
//                   )}
//                   {visibleColumns.supnetWeight && (
//                     <TableHead className="font-bold">Supp Net Wt (g)</TableHead>
//                   )}
//                    {visibleColumns.processed_by && (
//                     <TableHead className="font-bold">Processed By</TableHead>
//                   )}
//                   {visibleColumns.status && (
//                     <TableHead className="font-bold">Status</TableHead>
//                   )}
//                   {visibleColumns.comments && (
//                     <TableHead className="font-bold">Comments</TableHead>
//                   )}
//                   <TableHead className="font-bold">Parent Po Download</TableHead>
//                   <TableHead className="font-bold">Supplier Po Download</TableHead>
//                      {visibleColumns.crt_stock && (
//                     <TableHead className="font-bold">Current Stock</TableHead>
//                   )}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {isLoading ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={Object.values(visibleColumns).filter((v) => v).length + 2}
//                       className="h-24 text-center text-gray-500"
//                     >
//                       <div className="flex items-center justify-center gap-2">
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Loading data...
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ) : paginatedData.length === 0 ? (
//                   <TableRow>
//                     <TableCell
//                       colSpan={Object.values(visibleColumns).filter((v) => v).length + 2}
//                       className="h-24 text-center text-gray-500"
//                     >
//                       No results found.
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   paginatedData.map((row, index) => {
//                     const rowIndex = startIndex + index;
//                     const isSelected = selectedRows.has(rowIndex);
//                     const tctPoUrl=row["goldPoData.tct_po_url"]
//                     const pdfUrl = row["goldPoData.po_pdf"];
//                     // const tctPoUrl=
                     

//                     return (
//                       <React.Fragment key={rowIndex}>
//                         <TableRow
//                           key={rowIndex}
//                           className={`hover:bg-gray-50 ${
//                             isSelected ? "bg-blue-50" : ""
//                           }`}
//                         >
//                           {/* <TableCell className="text-center">
//                             <Checkbox
//                               checked={isSelected}
//                               onCheckedChange={() => handleRowSelect(rowIndex)}
//                               aria-label="Select row"
//                             />
//                           </TableCell> */}
//                           <TableCell className="font-medium">
//                               {index+1}
//                             </TableCell>
//                           {visibleColumns.issue_no && (
//                             <TableCell className="font-medium text-blue-600">
//                               {row.issue_voucher_number}
//                             </TableCell>
//                           )}
//                           {/* {visibleColumns.is_metal_available && (
//                             <TableCell>
//                               <Badge
//                                 variant={
//                                   row.is_metal_available === 1 ? "default" : "secondary"
//                                 }
//                               >
//                                 {row.is_metal_available === 1 ? "Yes" : "No"}
//                               </Badge>
//                             </TableCell>
//                           )} */}
//                           {visibleColumns.trns_metal && (
//                             <TableCell className="font-medium text-green-600">{row.trns_metal}</TableCell>
//                           )}
//                             {visibleColumns.metal_issued_date && (
//                             <TableCell>
//                               {formatDate(row.metal_issued_date)}
//                             </TableCell>
//                           )}
                        
//                           {visibleColumns.trns_company && (
//                             <TableCell>{row.ParentCompany+"->"+row.trns_company }</TableCell>
//                           )}
//                           {visibleColumns.po_number && (
//                             <TableCell className="font-medium text-red-600">{row["goldPoData.ParentPoNumber"]}</TableCell>
//                           )}
//                           {visibleColumns.melting_wt && (
//                             <TableCell className="text-right">
//                               {row.melting_wt} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.wastage_wt && (
//                             <TableCell className="text-right">
//                               {row.wastage_wt} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.pure_wt && (
//                             <TableCell className="text-right">
//                               {row.pure_wt} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.net_wt && (
//                             <TableCell className="text-right">
//                               {row.net_wt} 
//                             </TableCell>
//                           )}
                                                           
                        
//                           {visibleColumns.created_date && (
//                             <TableCell>
//                               {formatDate(row.created_date)}
//                             </TableCell>
//                           )}
//                           {visibleColumns.ParentCompany && (
//                             <TableCell>{"TCT -> Supplier"}</TableCell>
//                           )}
//                               {visibleColumns.po_number && (
//                             <TableCell className="font-medium text-red-600">{row.po_number}</TableCell>
//                           )}
//                           {visibleColumns.supplierIssueVoucherNo && (
//                             <TableCell className="font-medium text-blue-600">{row.supplierIssueVoucherNo}</TableCell>
//                           )}
//                           {visibleColumns.supplierIssueDate && (
//                             <TableCell >
//                               {formatDate(row.supplierIssueDate||row.metal_issued_date)}
//                             </TableCell>
//                           )}
//                           {visibleColumns.supplierTransferredMetalGrams && (
//                             <TableCell className="text-right text-green-600">
//                               {row.supplierTransferredMetalGrams} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.suptotalWastage && (
//                             <TableCell className="text-right">
//                               {row.suptotalWastage} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.supmeltingWeight && (
//                             <TableCell className="text-right">
//                               {row.supmeltingWeight} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.suppureWeight && (
//                             <TableCell className="text-right">
//                               {row.suppureWeight} 
//                             </TableCell>
//                           )}
//                           {visibleColumns.supnetWeight && (
//                             <TableCell className="text-right">
//                               {row.supnetWeight} 
//                             </TableCell>
//                           )}
//                             {visibleColumns.processed_by && (
//                             <TableCell>{row.processed_by}</TableCell>
//                           )}
//                           {visibleColumns.status && (
//                             <TableCell>
//                               <Badge
//                                 variant={
//                                   row.status === "Active" ? "default" : "outline"
//                                 }
//                               >
//                                 {row.status}
//                               </Badge>
//                             </TableCell>
//                           )}
//                           {visibleColumns.comments && (
//                             <TableCell>
//                               <div
//                                 className="max-w-xs truncate"
//                                 title={row.comments}
//                               >
//                                 {row.comments}
//                               </div>
//                             </TableCell>
//                           )}
//                             <TableCell>
//                             {tctPoUrl && (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleDownload(tctPoUrl, row.po_number)}
//                                 aria-label={`Download PO ${row.po_number}`}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Download className="h-4 w-4" />
//                                 <span>Download</span>
//                               </Button>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {pdfUrl && (
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => handleDownload(pdfUrl, row.po_number)}
//                                 aria-label={`Download PO ${row.po_number}`}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Download className="h-4 w-4" />
//                                 <span>Download</span>
//                               </Button>
//                             )}
//                           </TableCell>
//                             {visibleColumns.crt_stock && (
//                             <TableCell>{row.crt_stock}</TableCell>
//                           )}
//                         </TableRow>
                       
//                       </React.Fragment>
//                     );
//                   })
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination & Info */}
//           <div className="flex items-center justify-between space-x-2 py-4">
//             <div className="text-sm text-gray-600">
//               {filteredData.length} of {data.length} row(s) displayed
//               {selectedRows.size > 0 && (
//                 <span className="ml-2 font-medium">
//                   ({selectedRows.size} selected)
//                 </span>
//               )}
//             </div>
//             <div className="flex gap-2 items-center">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//                 disabled={currentPage === 1}
//                 className="h-8"
//               >
//                 Previous
//               </Button>
//               <div className="text-sm">
//                 Page {currentPage} of {totalPages || 1}
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(totalPages, prev + 1))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="h-8"
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Download, Loader2 } from "lucide-react";
import axios from "axios";
import { API } from "../../../config/configData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function MetalTransferReport() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states (with supplierIssueVoucherNo)
  const [filters, setFilters] = useState({
    issue_no: "",
    trns_metal: "",
    trns_company: "",
    status: "",
    po_number: "",
    supplierIssueVoucherNo: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog state
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API}/gold_Po/get_metal_allocated_date`
        );
        setData(response.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      issue_no: "",
      trns_metal: "",
      trns_company: "",
      status: "",
      po_number: "",
      supplierIssueVoucherNo: "",
    });
    setCurrentPage(1);
  };

  const isFiltered = Object.values(filters).some((val) => val !== "");

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Filter data based on filter values
  const filteredData = data.filter((item) => {
    const issueMatch =
      (item.issue_voucher_number?.toString().toLowerCase() || "").includes(
        (filters.issue_no || "").toLowerCase()
      );

    const supplierIssueMatch =
      (item.supplierIssueVoucherNo?.toString().toLowerCase() || "").includes(
        (filters.supplierIssueVoucherNo || "").toLowerCase()
      );

    const trnsMetalMatch =
      (item.trns_metal?.toString().toLowerCase() || "").includes(
        (filters.trns_metal || "").toLowerCase()
      );

    const trnsCompanyMatch =
      (item.trns_company?.toString().toLowerCase() || "").includes(
        (filters.trns_company || "").toLowerCase()
      );

    const poMatch =
      (item.po_number?.toString().toLowerCase() || "").includes(
        (filters.po_number || "").toLowerCase()
      );

    let statusMatch = true;
    if (filters.status && filters.status !== "all") {
      statusMatch = (
        item.status?.toString().toLowerCase() || ""
      ).includes(filters.status.toLowerCase());
    }

    return (
      issueMatch &&
      supplierIssueMatch &&
      trnsMetalMatch &&
      trnsCompanyMatch &&
      poMatch &&
      statusMatch
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Download handler
  const handleDownload = (url, filename = "document.pdf") => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
    link.remove();
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Metal Transfer Against PO Report
        </h1>
        <p className="mt-2 text-gray-600">
          View and manage all metal transfer transactions
        </p>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters Section */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-700">Filters</h3>
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  size="sm"
                  className="h-8"
                >
                  Reset Filters
                  <X className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Input
                placeholder="Filter by Parent Issue No..."
                value={filters.issue_no}
                onChange={(e) => handleFilterChange("issue_no", e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="Filter by Supplier Issue No..."
                value={filters.supplierIssueVoucherNo}
                onChange={(e) =>
                  handleFilterChange("supplierIssueVoucherNo", e.target.value)
                }
                className="h-8"
              />
            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="A">Metal Issued</SelectItem>
                  <SelectItem value="R">Metal Not Issued</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Filter by Supplier PO Number..."
                value={filters.po_number}
                onChange={(e) =>
                  handleFilterChange("po_number", e.target.value)
                }
                className="h-8"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-bold">S.no</TableHead>
                  <TableHead className="font-bold">
                    Parent Issue Voucher No
                  </TableHead>
                  <TableHead className="font-bold">Company</TableHead>
                  <TableHead className="font-bold">Parent PO Number</TableHead>
                  <TableHead className="font-bold">Supplier</TableHead>
                  <TableHead className="font-bold">Supplier PO Number</TableHead>
                  <TableHead className="font-bold">Supp Voucher No</TableHead>
                  <TableHead className="font-bold">Parent Po Download</TableHead>
                  <TableHead className="font-bold">
                    Supplier Po Download
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-gray-500"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-gray-500"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => {
                    const tctPoUrl = row["goldPoData.tct_po_url"];
                    const parentPoNumber = row["goldPoData.ParentPoNumber"];
                    const pdfUrl = row["goldPoData.po_pdf"];

                    return (
                      <TableRow
                        key={startIndex + index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell className="font-medium">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {row.issue_voucher_number}
                        </TableCell>
                        <TableCell>
                          {row.ParentCompany && row.trns_company
                            ? `${row.ParentCompany} -> ${row.trns_company}`
                            : row.trns_company || row.ParentCompany || "-"}
                        </TableCell>
                        <TableCell className="font-medium text-red-600">
                          {parentPoNumber}
                        </TableCell>
                        <TableCell>{"TCT -> Supplier"}</TableCell>
                        <TableCell className="font-medium text-red-600">
                          {row.po_number}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600">
                          {row.supplierIssueVoucherNo}
                        </TableCell>
                        <TableCell>
                          {tctPoUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(
                                  tctPoUrl,
                                  parentPoNumber || row.po_number
                                );
                              }}
                              aria-label={`Download Parent PO ${
                                parentPoNumber || row.po_number
                              }`}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {pdfUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(pdfUrl, row.po_number);
                              }}
                              aria-label={`Download Supplier PO ${row.po_number}`}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination & Info */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-gray-600">
              {filteredData.length} of {data.length} row(s) displayed
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                className="h-8"
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="h-8"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Metal Transfer Details</DialogTitle>
           
          </DialogHeader>

          {selectedRow && (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Top summary row */}
              <div className="grid gap-4 md:grid-cols-4 text-sm">
                
               
                <div>
                  <div className="text-xs font-semibold">
                    Po Gold Rate- {selectedRow["goldPoData.rate"]||0}
                  </div>
                  {/* <div className="font-medium">
                   
                  </div> */}
                </div>
               
              </div>

              {/* Parent vs Supplier side-by-side */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Parent Side */}
                <div className="rounded-lg border p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold mb-3">
                    Parent Company 
                  </h3>
                  <div className="grid gap-3 text-sm">
                     <div>
                  <div className="text-xs text-gray-500">Company</div>
                  <div className="font-medium">
                    {selectedRow.ParentCompany && selectedRow.trns_company
                      ? `${selectedRow.ParentCompany} -> ${selectedRow.trns_company}`
                      : selectedRow.trns_company ||
                        selectedRow.ParentCompany ||
                        "-"}
                  </div>
                </div>
                    <div>
                  <div className="text-xs text-gray-500">
                    Parent Issue Voucher No
                  </div>
                  <div className="font-medium text-blue-600">
                    {selectedRow.issue_voucher_number}
                  </div>
                </div>
                 <div>
                  <div className="text-xs text-gray-500">Parent PO Number</div>
                  <div className="font-medium text-red-600">
                    {selectedRow["goldPoData.ParentPoNumber"]}
                  </div>
                </div>
                 <div>
                      <div className="text-xs text-gray-500">Issued Date</div>
                      <div>{formatDate(selectedRow.metal_issued_date)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Transfer Metal</div>
                      <div className="font-medium text-green-600">
                        {selectedRow.trns_metal}
                      </div>
                    </div>
                   
                    <div>
                      <div className="text-xs text-gray-500">
                        Parent Melting Weight (g)
                      </div>
                      <div>{selectedRow.melting_wt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Parent Wastage Weight (g)
                      </div>
                      <div>{selectedRow.wastage_wt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Parent Pure Weight (g)
                      </div>
                      <div>{selectedRow.pure_wt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Parent Net Weight (g)
                      </div>
                      <div>{selectedRow.net_wt}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Current Stock</div>
                      <div>{selectedRow.crt_stock}</div>
                    </div>
                    {/* <div>
                      <div className="text-xs text-gray-500">
                        Parent Rate (per g)
                      </div>
                      <div>
                        {selectedRow.parentRate ??
                          selectedRow.rate ??
                          selectedRow.parentMetalRate ??
                          "-"}
                      </div>
                    </div> */}
                    <div>
                      <div className="text-xs text-gray-500">Created Date</div>
                      <div>{formatDate(selectedRow.created_date)}</div>
                    </div>
                  </div>
                </div>

                {/* Supplier Side */}
                <div className="rounded-lg border p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold mb-3">
                    Supplier Side
                  </h3>
                  <div className="grid gap-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Supplier</div>
                      <div>{"TCT -> Supplier"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Supplier Voucher No
                      </div>
                      <div className="font-medium text-blue-600">
                        {selectedRow.supplierIssueVoucherNo}
                      </div>
                    </div>
                   
                    <div>
                  <div className="text-xs text-gray-500">
                    Supplier PO Number
                  </div>
                  <div className="font-medium text-red-600">
                    {selectedRow.po_number}
                  </div>
                </div>
                 <div>
                      <div className="text-xs text-gray-500">
                        Supplier Issue Date
                      </div>
                      <div>
                        {formatDate(
                          selectedRow.supplierIssueDate ||
                            selectedRow.metal_issued_date
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Trns Metal To Supplier (g)
                      </div>
                      <div className="font-medium text-green-600">
                        {selectedRow.supplierTransferredMetalGrams}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Supplier Wastage
                      </div>
                      <div>{selectedRow.suptotalWastage}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Supplier Melting Wt (g)
                      </div>
                      <div>{selectedRow.supmeltingWeight}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Supplier Pure Wt (g)
                      </div>
                      <div>{selectedRow.suppureWeight}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        Supplier Net Wt (g)
                      </div>
                      <div>{selectedRow.supnetWeight}</div>
                    </div>
                    {/* <div>
                      <div className="text-xs text-gray-500">
                        Supplier Rate (per g)
                      </div>
                      <div>
                        {selectedRow.supplierRate ??
                          selectedRow.supRate ??
                          selectedRow.supplierMetalRate ??
                          "-"}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Status & Comments */}
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Processed By</div>
                  <div>{selectedRow.processed_by}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Status</div>
                  <div>
                    <Badge
                      variant={
                        selectedRow.status === "Active" ? "default" : "outline"
                      }
                    >
                      {selectedRow.status}
                    </Badge>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-xs text-gray-500">Comments</div>
                  <div>{selectedRow.comments || "-"}</div>
                </div>
              </div>

              {/* Downloads */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs text-gray-500 mb-2">
                    Parent PO Download
                  </div>
                  {selectedRow["goldPoData.tct_po_url"] ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          selectedRow["goldPoData.tct_po_url"],
                          selectedRow["goldPoData.ParentPoNumber"] ||
                            selectedRow.po_number
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Parent PO</span>
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-500">No file</span>
                  )}
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-2">
                    Supplier PO Download
                  </div>
                  {selectedRow["goldPoData.po_pdf"] ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDownload(
                          selectedRow["goldPoData.po_pdf"],
                          selectedRow.po_number
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Supplier PO</span>
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-500">No file</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

