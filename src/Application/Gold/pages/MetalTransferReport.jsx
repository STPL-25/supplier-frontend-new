
import { useState, useEffect } from "react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, X } from "lucide-react";
import axios from "axios";
import { API } from "../../../config/configData";
import { Loader2 } from "lucide-react";

export default function MetalTransferReport() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    issue_no: "",
    trns_metal: "",
    trns_company: "",
    status: "",
    processed_by: "",
    net_wt: "",
    po_number: "",
    crt_stock: "",
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    issue_no: true,
    is_metal_available: true,
    trns_metal: true,
    crt_stock: true,
    trns_company: true,
    melting_wt: true,
    wastage_wt: true,
    references_w: true,
    net_wt: true,
    processed_by: true,
    status: true,
    comments: true,
    po_number: true,
    metal_issued_date: true,
    created_date: true,
  });

  // Row selection state
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Filter data based on filter values
const filteredData = data.filter((item) => {
  return (
    (item.issue_no?.toString().toLowerCase() || "")
      .includes((filters.issue_no || "").toLowerCase()) &&
    (item.trns_metal?.toString().toLowerCase() || "")
      .includes((filters.trns_metal || "").toLowerCase()) &&
    (item.trns_company?.toString().toLowerCase() || "")
      .includes((filters.trns_company || "").toLowerCase()) &&
    (item.status?.toString().toLowerCase() || "")
      .includes((filters.status || "").toLowerCase()) &&
    (item.processed_by?.toString().toLowerCase() || "")
      .includes((filters.processed_by || "").toLowerCase()) &&
    (item.net_wt?.toString().toLowerCase() || "")
      .includes((filters.net_wt || "").toLowerCase()) &&
    (item.po_number?.toString().toLowerCase() || "")
      .includes((filters.po_number || "").toLowerCase()) &&
    (item.crt_stock?.toString().toLowerCase() || "")
      .includes((filters.crt_stock || "").toLowerCase())
  );
});


  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);


  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle column visibility toggle
  const handleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Handle row selection
  const handleRowSelect = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(
        new Set(paginatedData.map((_, index) => startIndex + index))
      );
    } else {
      setSelectedRows(new Set());
    }
  };

  // Check if all visible rows are selected
  const allSelected =
    paginatedData.length > 0 &&
    paginatedData.every((_, index) => selectedRows.has(startIndex + index));

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      issue_no: "",
      trns_metal: "",
      trns_company: "",
      status: "",
      processed_by: "",
      net_wt: "",
      po_number: "",
      crt_stock: "",
    });
    setCurrentPage(1);
  };

  const isFiltered = Object.values(filters).some((val) => val !== "");

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto h-8">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuCheckboxItem
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    // Toggle all columns
                    const allVisible = Object.values(visibleColumns).every(
                      (v) => v
                    );
                    setVisibleColumns(
                      Object.keys(visibleColumns).reduce(
                        (acc, key) => ({
                          ...acc,
                          [key]: !allVisible,
                        }),
                        {}
                      )
                    );
                  }}
                >
                  Toggle All
                </DropdownMenuCheckboxItem>
                <div className="border-t my-2"></div>
                {Object.keys(visibleColumns).map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className="capitalize"
                    checked={visibleColumns[column]}
                    onCheckedChange={() => handleColumnVisibility(column)}
                  >
                    {column.replace(/_/g, " ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input
                placeholder="Filter by Issue No..."
                value={filters.issue_no}
                onChange={(e) => handleFilterChange("issue_no", e.target.value)}
                className="h-8"
              />

              <Input
                placeholder="Filter by Metal..."
                value={filters.trns_metal}
                onChange={(e) =>
                  handleFilterChange("trns_metal", e.target.value)
                }
                className="h-8"
              />

              <Input
                placeholder="Filter by Company..."
                value={filters.trns_company}
                onChange={(e) =>
                  handleFilterChange("trns_company", e.target.value)
                }
                className="h-8"
              />

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

            </div>

            {/* Filter Row 2 */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input
                placeholder="Filter by Processed By..."
                value={filters.processed_by}
                onChange={(e) =>
                  handleFilterChange("processed_by", e.target.value)
                }
                className="h-8"
              />

              <Input
                placeholder="Filter by Net Weight..."
                type="text"
                value={filters.net_wt}
                onChange={(e) => handleFilterChange("net_wt", e.target.value)}
                className="h-8"
              />

              <Input
                placeholder="Filter by PO Number..."
                value={filters.po_number}
                onChange={(e) => handleFilterChange("po_number", e.target.value)}
                className="h-8"
              />

              <Input
                placeholder="Filter by Stock..."
                value={filters.crt_stock}
                onChange={(e) => handleFilterChange("crt_stock", e.target.value)}
                className="h-8"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px] font-bold">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  {visibleColumns.issue_no && (
                    <TableHead className="font-bold">Issue Voucher No</TableHead>
                  )}
                  {visibleColumns.is_metal_available && (
                    <TableHead className="font-bold">Metal Available</TableHead>
                  )}
                  {visibleColumns.trns_metal && (
                    <TableHead className="font-bold">Transfer Metal</TableHead>
                  )}
                  {visibleColumns.crt_stock && (
                    <TableHead className="font-bold">Current Stock</TableHead>
                  )}
                  {visibleColumns.trns_company && (
                    <TableHead className="font-bold">Company</TableHead>
                  )}
                  {visibleColumns.melting_wt && (
                    <TableHead className="font-bold text-right">
                      Melting Weight
                    </TableHead>
                  )}
                  {visibleColumns.wastage_wt && (
                    <TableHead className="font-bold text-right">
                      Wastage Weight
                    </TableHead>
                  )}
                  {visibleColumns.references_w && (
                    <TableHead className="font-bold">References</TableHead>
                  )}
                  {visibleColumns.net_wt && (
                    <TableHead className="font-bold text-right">
                      Net Weight
                    </TableHead>
                  )}
                  {visibleColumns.processed_by && (
                    <TableHead className="font-bold">Processed By</TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="font-bold">Status</TableHead>
                  )}
                  {visibleColumns.comments && (
                    <TableHead className="font-bold">Comments</TableHead>
                  )}
                  {visibleColumns.po_number && (
                    <TableHead className="font-bold">PO Number</TableHead>
                  )}
                  {visibleColumns.metal_issued_date && (
                    <TableHead className="font-bold">Issued Date</TableHead>
                  )}
                  {visibleColumns.created_date && (
                    <TableHead className="font-bold">Created Date</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={Object.values(visibleColumns).filter((v) => v)
                        .length + 1}
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
                      colSpan={Object.values(visibleColumns).filter((v) => v)
                        .length + 1}
                      className="h-24 text-center text-gray-500"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => {
                    const rowIndex = startIndex + index;
                    const isSelected = selectedRows.has(rowIndex);

                    return (
                      <TableRow
                        key={rowIndex}
                        className={`hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50" : ""
                        }`}
                      >
                        <TableCell className="text-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleRowSelect(rowIndex)}
                            aria-label="Select row"
                          />
                        </TableCell>
                        {visibleColumns.issue_no && (
                          <TableCell className="font-medium">
                            {row.issue_voucher_number}
                          </TableCell>
                        )}
                        {visibleColumns.is_metal_available && (
                          <TableCell>
                            <Badge
                              variant={
                                row.is_metal_available === 1
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {row.is_metal_available === 1 ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.trns_metal && (
                          <TableCell>{row.trns_metal}</TableCell>
                        )}
                        {visibleColumns.crt_stock && (
                          <TableCell>{row.crt_stock}</TableCell>
                        )}
                        {visibleColumns.trns_company && (
                          <TableCell>{row.trns_company}</TableCell>
                        )}
                        {visibleColumns.melting_wt && (
                          <TableCell className="text-right">
                            {row.melting_wt} g
                          </TableCell>
                        )}
                        {visibleColumns.wastage_wt && (
                          <TableCell className="text-right">
                            {row.wastage_wt} g
                          </TableCell>
                        )}
                        {visibleColumns.references_w && (
                          <TableCell>{row.references_w}</TableCell>
                        )}
                        {visibleColumns.net_wt && (
                          <TableCell className="text-right">
                            {row.net_wt} g
                          </TableCell>
                        )}
                        {visibleColumns.processed_by && (
                          <TableCell>{row.processed_by}</TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell>
                            <Badge
                              variant={
                                row.status === "Active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {row.status}
                            </Badge>
                          </TableCell>
                        )}
                        {visibleColumns.comments && (
                          <TableCell>
                            <div
                              className="max-w-xs truncate"
                              title={row.comments}
                            >
                              {row.comments}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.po_number && (
                          <TableCell>{row.po_number}</TableCell>
                        )}
                        {visibleColumns.metal_issued_date && (
                          <TableCell>
                            {formatDate(row.metal_issued_date)}
                          </TableCell>
                        )}
                        {visibleColumns.created_date && (
                          <TableCell>
                            {formatDate(row.created_date)}
                          </TableCell>
                        )}
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
              {selectedRows.size > 0 && (
                <span className="ml-2 font-medium">
                  ({selectedRows.size} selected)
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8"
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages || 1}
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
    </div>
  );
}
