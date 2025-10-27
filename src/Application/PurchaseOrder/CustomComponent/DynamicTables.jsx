// import React, { useState,useEffect } from 'react';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

// // Reusable Dynamic Table Component
// const DynamicTable = ({ 
//   fields, 
//   initialData, 
//   title = "Data Management",
//   selectOptions = {},
//   onDataChange = () => {}
// }) => {
//   const [data, setData] = useState(initialData);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});

//   // Get visible columns
//   const visibleColumns = fields.filter(col => col.view);
// useEffect(() => {
//   setData(initialData);
// }, [initialData]);

//   const handleEdit = (row) => {
//     const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//     setEditingId(row[idField]);
//     setEditData({ ...row });
//   };

//   const handleSave = () => {
//     const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//     const updatedData = data.map(row => row[idField] === editingId ? editData : row);
//     setData(updatedData);
//     setEditingId(null);
//     setEditData({});
//     onDataChange(updatedData);
//   };

//   const handleCancel = () => {
//     setEditingId(null);
//     setEditData({});
//   };

//   const handleDelete = (id) => {
//     const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//     const updatedData = data.filter(row => row[idField] !== id);
//     setData(updatedData);
//     onDataChange(updatedData);
//   };

//   const handleAdd = () => {
//     const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//     const newRow = {};
    
//     // Initialize all fields based on their type
//     fields.forEach(field => {
//       if (field.field === idField) {
//         newRow[field.field] = data.length + 1;
//       } else if (field.type === 'number') {
//         newRow[field.field] = 0;
//       } else if (field.type === 'boolean') {
//         newRow[field.field] = false;
//       } else {
//         newRow[field.field] = '';
//       }
//     });

//     const updatedData = [...data, newRow];
//     setData(updatedData);
//     setEditingId(newRow[idField]);
//     setEditData(newRow);
//   };

//   const handleInputChange = (field, value) => {
//     setEditData({ ...editData, [field]: value });
//   };

//   const renderCell = (row, column) => {
//     const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//     const isEditing = editingId === row[idField];
//     const value = isEditing ? editData[column.field] : row[column.field];

//     if (column.field === 'edit') {
//       return (
//         <div className="flex gap-2">
//           {isEditing ? (
//             <>
//               <Button size="sm" variant="ghost" onClick={handleSave}>
//                 <Save className="h-4 w-4" />
//               </Button>
//               <Button size="sm" variant="ghost" onClick={handleCancel}>
//                 <X className="h-4 w-4" />
//               </Button>
//             </>
//           ) : (
//             <>
//               <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
//                 <Pencil className="h-4 w-4" />
//               </Button>
//               <Button size="sm" variant="ghost" onClick={() => handleDelete(row[idField])}>
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </>
//           )}
//         </div>
//       );
//     }

//     if (isEditing && column.input) {
//       if (column.type === 'select') {
//         const options = selectOptions[column.field] || [];
//         return (
//           <Select value={value} onValueChange={(val) => handleInputChange(column.field, val)}>
//             <SelectTrigger className="w-full">
//               <SelectValue placeholder="Select..." />
//             </SelectTrigger>
//             <SelectContent>
//               {options.map(opt => (
//                 <SelectItem key={opt} value={opt}>{opt}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         );
//       }
      
//       return (
//         <Input
//           type={column.type}
//           value={value || ''}
//           onChange={(e) => handleInputChange(column.field, e.target.value)}
//           className="w-full"
//         />
//       );
//     }

//     return <span>{value || '-'}</span>;
//   };

//   return (
//     <div className="w-full p-6 space-y-4">
//       <div className="flex justify-between items-center">
//         {/* <h2 className="text-2xl font-bold">{title}</h2>
//         <Button onClick={handleAdd}>
//           <Plus className="h-4 w-4 mr-2" />
//           Add Row
//         </Button> */}
//       </div>
      
//       <div className="border rounded-lg overflow-auto">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {visibleColumns.map(column => (
//                 <TableHead key={column.field} className="font-semibold">
//                   {column.label}
//                   {column.require && <span className="text-red-500 ml-1">*</span>}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((row, idx) => {
//               const idField = fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
//               return (
//                 <TableRow key={row[idField] || idx}>
//                   {visibleColumns.map(column => (
//                     <TableCell key={column.field}>
//                       {renderCell(row, column)}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// // Example usage with your Gold/Platinum/Diamond fields
// // const Gold_Platinum_Diamond = [
// //   { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
// //   { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
// //   { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
// //   { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
// //   { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
// //   { field: "productType", label: "Product Type", require: false, view: false, type: 'text', input: false },
// //   { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
// //   { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
// //   { field: "diacent", label: "Dia Cent", require: false, view: true, type: 'number', input: true },
// //   { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
// //   { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
// //   { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
// //   { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
// //   { field: "goldwt", label: "Gold Wt", require: false, view: false, type: 'number', input: true },
// //   { field: "platinumWt", label: "Platinum Wt", require: false, view: false, type: 'number', input: true },
// //   { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
// //   { field: "ptPureWt", label: "Pt Pure Wt", require: false, view: false, type: 'number', input: true },
// //   { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
// //   { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: true },
// //   { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
// //   { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
// //   { field: "ptMelting", label: "Pt Melting", require: false, view: false, type: 'number', input: true },
// //   { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
// //   { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
// //   { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
// // ];

// // const productOptions = ['Gold', 'Platinum', 'Diamond', 'Silver'];

// // const initialData = [
// //   { 
// //     sno: 1, 
// //     product: 'Gold', 
// //     productName: 'Ring', 
// //     pieces: 2, 
// //     grossWt: 10.5,
// //     diacent: 0.5,
// //     stoneWt: 0.2,
// //     stoneCost: 5000,
// //     waxWt: 0.1,
// //     netWt: 10.2,
// //     pureWt: 9.5,
// //     amount: 50000,
// //     mc: 2000
// //   },
// //   { 
// //     sno: 2, 
// //     product: 'Diamond', 
// //     productName: 'Necklace', 
// //     pieces: 1, 
// //     grossWt: 25.3,
// //     diacent: 2.5,
// //     stoneWt: 1.5,
// //     stoneCost: 150000,
// //     waxWt: 0.3,
// //     netWt: 23.5,
// //     pureWt: 22.0,
// //     amount: 350000,
// //     mc: 15000
// //   }
// // ];

// // Demo App
// // export default function App() {
// //   const handleDataChange = (updatedData) => {
// //     console.log('Data updated:', updatedData);
// //   };

// //   return (
// //     <DynamicTable
// //       fields={fields}
// //       initialData={poDatas}
// //       title="Product Management"
// //       selectOptions={{
// //         product: productOptions
// //       }}
// //       onDataChange={handleDataChange}
// //     />
// //   );
// // }

// export default DynamicTable;


import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Settings2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';


const DynamicTable = ({ 
  fields, 
  initialData = [], 
  title = "Data Management",
  description = "",
  selectOptions = {},
  onDataChange = () => {},
  pageSize: initialPageSize = 10,
  enableExport = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableColumnFilters = true
}) => {
  const [data, setData] = useState(initialData);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Filtering & Sorting
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Column Visibility
  const [columnVisibility, setColumnVisibility] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.field]: field.view }), {})
  );


  // Get visible columns
  const visibleColumns = fields.filter(col => columnVisibility[col.field]);


  // Sync with external data changes
  useEffect(() => {
    setData(initialData);
    setEditingId(null);
    setEditData({});
    setCurrentPage(0);
  }, [initialData]);


  const getIdField = () => {
    return fields.find(f => f.field === 'sno' || f.field === 'id')?.field || 'sno';
  };


  // Filtering Logic
  const getFilteredData = () => {
    let filtered = [...data];


    // Global Filter
    if (enableGlobalFilter && globalFilter) {
      filtered = filtered.filter(row => {
        return visibleColumns.some(col => {
          const value = row[col.field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(globalFilter.toLowerCase());
        });
      });
    }


    // Column Filters
    if (enableColumnFilters) {
      Object.entries(columnFilters).forEach(([field, filterValue]) => {
        if (filterValue) {
          filtered = filtered.filter(row => {
            const value = row[field];
            if (value == null) return false;
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          });
        }
      });
    }


    return filtered;
  };


  // Sorting Logic
  const getSortedData = (filteredData) => {
    if (!sortConfig.field) return filteredData;


    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.field];
      const bVal = b[sortConfig.field];
      
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * multiplier;
      }
      
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });
  };


  // Get paginated data
  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const sorted = getSortedData(filtered);
    const start = currentPage * pageSize;
    const end = start + pageSize;
    return {
      data: sorted.slice(start, end),
      total: sorted.length,
      totalPages: Math.ceil(sorted.length / pageSize)
    };
  };


  const { data: paginatedData, total, totalPages } = getPaginatedData();


  // Handlers
  const handleEdit = (row) => {
    const idField = getIdField();
    setEditingId(row[idField]);
    setEditData({ ...row });
  };


  const handleSave = () => {
    const idField = getIdField();
    const updatedData = data.map(row => 
      row[idField] === editingId ? editData : row
    );
    setData(updatedData);
    setEditingId(null);
    setEditData({});
    onDataChange(updatedData);
  };


  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };


  const handleDelete = (id) => {
    const idField = getIdField();
    const updatedData = data.filter(row => row[idField] !== id);
    setData(updatedData);
    onDataChange(updatedData);
  };


  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };


  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };


  const handleExport = () => {
    const csv = [
      visibleColumns.map(col => col.label).join(','),
      ...getFilteredData().map(row => 
        visibleColumns.map(col => row[col.field] ?? '').join(',')
      )
    ].join('\n');


    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };


  // Select All Handler
  const handleSelectAll = (checked) => {
    const newVisibility = {};
    fields.forEach(field => {
      if (field.field !== 'edit') {
        newVisibility[field.field] = checked;
      } else {
        newVisibility[field.field] = columnVisibility[field.field];
      }
    });
    setColumnVisibility(newVisibility);
  };


  // Check if all columns are selected
  const areAllColumnsSelected = () => {
    const selectableFields = fields.filter(f => f.field !== 'edit');
    const selectedCount = selectableFields.filter(f => columnVisibility[f.field]).length;
    return selectedCount === selectableFields.length;
  };


  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };


  const renderCell = (row, column) => {
    const idField = getIdField();
    const isEditing = editingId === row[idField];
    const value = isEditing ? editData[column.field] : row[column.field];


    if (column.field === 'edit') {
      return (
        <div className="flex gap-1">
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0">
                <Save className="h-4 w-4 text-green-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                <X className="h-4 w-4 text-red-600" />
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="ghost" onClick={() => handleEdit(row)} className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4 text-blue-600" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(row[idField])} className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </>
          )}
        </div>
      );
    }


    if (isEditing && column.input) {
      if (column.type === 'select') {
        const options = selectOptions[column.field] || [];
        return (
          <Select 
            value={String(value || '')} 
            onValueChange={(val) => handleInputChange(column.field, val)}
          >
            <SelectTrigger className="w-full h-8">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt, idx) => (
                <SelectItem key={`${opt}-${idx}`} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      
      return (
        <Input
          type={column.type === 'number' ? 'number' : 'text'}
          value={value ?? ''}
          onChange={(e) => {
            const newValue = column.type === 'number' 
              ? parseFloat(e.target.value) || 0 
              : e.target.value;
            handleInputChange(column.field, newValue);
          }}
          className="w-full h-8"
        />
      );
    }


    // Format display values
    if (column.type === 'number') {
      return <span className="font-mono">{value != null ? Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</span>;
    }
    if (column.type === 'date') {
      return <span>{value ? new Date(value).toLocaleDateString('en-IN') : '-'}</span>;
    }
    if (column.type === 'boolean') {
      return value ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>;
    }


    return <span className="truncate">{value || '-'}</span>;
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description && <CardDescription className="mt-2">{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            {enableExport && (
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
            {/* <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button> */}
          </div>
        </div>
      </CardHeader>


      <CardContent>
        {/* Filters Toolbar */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
            {/* Global Search */}
            {enableGlobalFilter && (
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search across all columns..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            )}


            <div className="flex gap-2">
              {/* Column Visibility with Select All and Grouped Columns */}
              {enableColumnVisibility && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-4 w-4 mr-2" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {/* Select All Checkbox */}
                    <DropdownMenuCheckboxItem
                      checked={areAllColumnsSelected()}
                      onCheckedChange={handleSelectAll}
                      className="font-semibold"
                    >
                      Select All
                    </DropdownMenuCheckboxItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Main Fields - without () in label */}
                    <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2">
                      Main Columns
                    </DropdownMenuLabel>
                    {fields
                      
                      .map(field => (
                        <DropdownMenuCheckboxItem
                          key={field.field}
                          checked={columnVisibility[field.field]}
                          onCheckedChange={(checked) => 
                            setColumnVisibility(prev => ({ ...prev, [field.field]: checked }))
                          }
                        >
                          {field.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    
                  
                  </DropdownMenuContent>
                </DropdownMenu>
              )}


              {/* Page Size Selector */}
              <Select value={String(pageSize)} onValueChange={(val) => {
                setPageSize(Number(val));
                setCurrentPage(0);
              }}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 row</SelectItem>
                  <SelectItem value="10">10 rows</SelectItem>
                  <SelectItem value="20">20 rows</SelectItem>
                  <SelectItem value="50">50 rows</SelectItem>
                  <SelectItem value="100">100 rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Column Filters */}
          {enableColumnFilters && visibleColumns.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {visibleColumns
                .filter(col => col.field !== 'edit' && col.type !== 'boolean')
                .slice(0, 4)
                .map(col => (
                  <div key={col.field} className="relative min-w-40">
                    <Filter className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={`Filter ${col.label}...`}
                      value={columnFilters[col.field] || ''}
                      onChange={(e) => setColumnFilters(prev => ({ 
                        ...prev, 
                        [col.field]: e.target.value 
                      }))}
                      className="pl-7 h-9 text-sm"
                    />
                  </div>
                ))}
            </div>
          )}
        </div>


        {/* Results Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div>
            Showing <span className="font-medium text-foreground">{Math.min((currentPage * pageSize) + 1, total)}</span> to{' '}
            <span className="font-medium text-foreground">{Math.min((currentPage + 1) * pageSize, total)}</span> of{' '}
            <span className="font-medium text-foreground">{total}</span> results
          </div>
          {(globalFilter || Object.values(columnFilters).some(v => v)) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setGlobalFilter('');
                setColumnFilters({});
              }}
            >
              Clear filters
            </Button>
          )}
        </div>


        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {visibleColumns.map(column => (
                    <TableHead 
                      key={column.field} 
                      className="font-semibold"
                    >
                      <div className="flex items-center">
                        {column.field !== 'edit' && column.type !== 'boolean' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-3 h-8 data-[state=open]:bg-accent"
                            onClick={() => handleSort(column.field)}
                          >
                            {column.label}
                            {column.require && <span className="text-red-500 ml-1">*</span>}
                            {renderSortIcon(column.field)}
                          </Button>
                        ) : (
                          <span>
                            {column.label}
                            {column.require && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-50" />
                        <p>No results found</p>
                        {(globalFilter || Object.values(columnFilters).some(v => v)) && (
                          <p className="text-sm mt-1">Try adjusting your filters</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, idx) => {
                    const idField = getIdField();
                    const isEditing = editingId === row[idField];
                    return (
                      <TableRow 
                        key={row[idField] || idx}
                        className={isEditing ? 'bg-muted/30' : ''}
                      >
                        {visibleColumns.map(column => (
                          <TableCell key={`${row[idField]}-${column.field}`}>
                            {renderCell(row, column)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>


        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default DynamicTable;

