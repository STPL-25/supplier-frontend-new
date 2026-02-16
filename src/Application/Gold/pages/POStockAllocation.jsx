
// import { useState, useEffect, useContext } from "react"
// import axios from "axios"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { 
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableFooter,
// } from "@/components/ui/table"
// import { useSendToServer } from "../components/SendToServer"
// import { useTctSendToServer } from "../components/TctSendToServer"
// import { 
//   CheckCircle2, 
//   XCircle, 
//   Loader2, 
//   Package, 
//   FileText, 
//   AlertTriangle,
//   Calculator,
//   TrendingUp,
//   Calendar
// } from "lucide-react"
// import { API } from "@/config/configData"
// import { toast } from "sonner"
// import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext"


// export default function POStockAllocation() {
//   // ✅ State Management
//   const [approvedPOs, setApprovedPOs] = useState([])
//   const [approvedPoAllDetails, setApprovedPoAllDetails] = useState([])
//   const [selectedPO, setSelectedPO] = useState("")
//   const [selectedPoItems, setSelectedPoItems] = useState([])
//   const [poBasicInfo, setPoBasicInfo] = useState(null)
//   const [stockAvailable, setStockAvailable] = useState(null)
//   const [issueVoucherNo, setIssueVoucherNo] = useState("")
//   const [metalIssueDate, setMetalIssueDate] = useState("") 
//   const [transferredMetalGrams, setTransferredMetalGrams] = useState("")
//   const [remainingStock, setRemainingStock] = useState("")
//   const [comments, setComments] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFetching, setIsFetching] = useState(false)
//   const { user } = useContext(DashBoardContext)


//   // ✅ Aggregate Calculations State
//   const [aggregateCalculations, setAggregateCalculations] = useState({
//     totalNetWeight: 0,
//     totalBaseWastage: 0,
//     totalAdditionalWastage: 0,
//     totalWastage: 0,
//     totalMeltingWeight: 0,
//     totalWastageWeight: 0,
//     totalPureWeight: 0,
//     totalPieces: 0,
//     totalGrossWeight: 0,
//   })


//   const { generatePdf, isGenerating, errors } = useSendToServer({
//     onPdfGenerated: (pdfFile) => {
//       console.log("PDF generated successfully")
//     },
//   })


//   const { generatePdf: generateTctPdf } = useTctSendToServer({
//     onPdfGenerated: (pdfFile) => {
//       console.log("TCT PDF generated successfully")
//     },
//   })


//   // ✅ Calculate metal weights for each item
//   const calculateItemWeights = (item) => {
//     const netWeight = parseFloat(item?.net_weight || 0)
//     const wastagePercent = parseFloat(item?.wastage || 0)
//     const meltingPercent = parseFloat(item?.melting || 0)
    
//     const baseWastage = (netWeight * wastagePercent) / 100
//     const additionalWastage = baseWastage * 0.1
//     const totalWastage = baseWastage + additionalWastage
//     const meltingWeight = (netWeight * meltingPercent) / 100
//     const wastageWeight = totalWastage
//     const pureWeight = parseFloat(wastageWeight) + parseFloat(meltingWeight)


//     return {
//       baseWastage: baseWastage.toFixed(3),
//       additionalWastage: additionalWastage.toFixed(3),
//       totalWastage: totalWastage.toFixed(3),
//       meltingWeight: meltingWeight.toFixed(3),
//       wastageWeight: wastageWeight.toFixed(3),
//       pureWeight: pureWeight.toFixed(3),
//       netWeight: netWeight.toFixed(3),
//     }
//   }


//   // ✅ Calculate aggregate totals across all items
//   const calculateAggregates = (items) => {
//     const totals = items.reduce((acc, item) => {
//       const itemCalc = calculateItemWeights(item)
      
//       return {
//         totalNetWeight: acc.totalNetWeight + parseFloat(itemCalc.netWeight),
//         totalBaseWastage: acc.totalBaseWastage + parseFloat(itemCalc.baseWastage),
//         totalAdditionalWastage: acc.totalAdditionalWastage + parseFloat(itemCalc.additionalWastage),
//         totalWastage: acc.totalWastage + parseFloat(itemCalc.totalWastage),
//         totalMeltingWeight: acc.totalMeltingWeight + parseFloat(itemCalc.meltingWeight),
//         totalWastageWeight: acc.totalWastageWeight + parseFloat(itemCalc.wastageWeight),
//         totalPureWeight: acc.totalPureWeight + parseFloat(itemCalc.pureWeight),
//         totalPieces: acc.totalPieces + parseInt(item.pieces || 0),
//         totalGrossWeight: acc.totalGrossWeight + parseFloat(item.gross_weight || 0),
//       }
//     }, {
//       totalNetWeight: 0,
//       totalBaseWastage: 0,
//       totalAdditionalWastage: 0,
//       totalWastage: 0,
//       totalMeltingWeight: 0,
//       totalWastageWeight: 0,
//       totalPureWeight: 0,
//       totalPieces: 0,
//       totalGrossWeight: 0,
//     })


//     setAggregateCalculations({
//       totalNetWeight: totals.totalNetWeight.toFixed(3),
//       totalBaseWastage: totals.totalBaseWastage.toFixed(3),
//       totalAdditionalWastage: totals.totalAdditionalWastage.toFixed(3),
//       totalWastage: totals.totalWastage.toFixed(3),
//       totalMeltingWeight: totals.totalMeltingWeight.toFixed(3),
//       totalWastageWeight: totals.totalWastageWeight.toFixed(3),
//       totalPureWeight: totals.totalPureWeight.toFixed(3),
//       totalPieces: totals.totalPieces,
//       totalGrossWeight: totals.totalGrossWeight.toFixed(3),
//     })
//   }


//   // ✅ NEW: Get today's date in YYYY-MM-DD format
//   const getTodayDate = () => {
//     const today = new Date()
//     return today.toISOString().split('T')[0]
//   }


//   useEffect(() => {
//     const fetchApprovedPOs = async () => {
//       setIsFetching(true)
//       try {
//         const response = await axios.get(`${API}/gold_po/fetch_approved_po`)
//         setApprovedPOs(response.data.approvedTctPos || [])
//         setApprovedPoAllDetails(response.data.result || [])
        
//         toast.success("Purchase orders loaded successfully")
        
//       } catch (error) {
//         console.error("Error fetching approved POs:", error)
//         toast.error("Failed to fetch approved POs")
//       } finally {
//         setIsFetching(false)
//       }
//     }
    
//     fetchApprovedPOs()
//   }, [])


//   // ✅ Handle PO selection
//   const handlePOSelect = (value) => {
//     setSelectedPO(value)
    
//     // Reset other fields
//     setStockAvailable(null)
//     setIssueVoucherNo("")
//     setMetalIssueDate("") 
//     setTransferredMetalGrams("")
//     setRemainingStock("")
//     setComments("")


//     // Find ALL items for this PO
//     const poItems = approvedPoAllDetails.filter(
//       (po) => po.poNumber === value
//     )
    
//     if (poItems.length > 0) {
//       setSelectedPoItems(poItems)
      
//       // Store basic PO info from first item
//       setPoBasicInfo({
//         poNumber: poItems[0].poNumber,
//         poDate: poItems[0].poDate || poItems[0].po_date,
//         poDetails: poItems[0].poDetails,
//         supplierName: poItems[0].supplierName,
//       })
      
//       // Calculate aggregates for all items
//       calculateAggregates(poItems)
//     } else {
//       setSelectedPoItems([])
//       setPoBasicInfo(null)
//       setAggregateCalculations({
//         totalNetWeight: 0,
//         totalBaseWastage: 0,
//         totalAdditionalWastage: 0,
//         totalWastage: 0,
//         totalMeltingWeight: 0,
//         totalWastageWeight: 0,
//         totalPureWeight: 0,
//         totalPieces: 0,
//         totalGrossWeight: 0,
//       })
//     }
//   }


//   // ✅ Handle stock availability
//   const handleStockAvailability = (value) => {
//     setStockAvailable(value === "yes")
//     if (value === "no") {
//       setIssueVoucherNo("")
//       setMetalIssueDate("") // ✅ Reset date when stock not available
//       setTransferredMetalGrams("")
//       setRemainingStock("")
//     } else {
//       // ✅ Auto-set today's date when stock becomes available
//       setMetalIssueDate("")
//     }
//   }


//   // ✅ Subtract one day from date
//   const subtractOneDay = (dateInput) => {
//     try {
//       let dateValue


//       if (typeof dateInput === 'object' && dateInput !== null) {
//         dateValue = dateInput.poDate
//       } else if (typeof dateInput === 'string') {
//         try {
//           const parsedField = JSON.parse(dateInput)
//           dateValue = parsedField.poDate || parsedField
//         } catch {
//           dateValue = dateInput
//         }
//       } else {
//         dateValue = dateInput
//       }
      
//       const date = new Date(dateValue)
      
//       if (isNaN(date.getTime())) {
//         console.error("Invalid date value:", dateValue)
//         throw new Error('Invalid date')
//       }
      
//       date.setDate(date.getDate() - 1)
//       return date.toLocaleDateString('en-GB')
      
//     } catch (error) {
//       console.error("Error parsing date:", error)
//       return 'Invalid Date'
//     }
//   }
//  console.log(selectedPoItems[0]?.ParentCompany )

//   // ✅ CORRECTED: Handle form submission (Approve or Reject)
//   const handleSubmit = async (status) => {
//     // Validation
//     if (!selectedPO) {
//       toast.error("Please select a Purchase Order")
//       return
//     }


//     if (stockAvailable === null) {
//       toast.error("Please select stock availability status")
//       return
//     }


//     // For approval, validate all fields
//     if (status === "Approved") {
//       if (!stockAvailable) {
//         toast.error("Stock must be available to approve PO")
//         return
//       }


//       if (!issueVoucherNo.trim()) {
//         toast.error("Please enter Issue Voucher Number")
//         return
//       }


//       // ✅ NEW: Validate metal issue date
//       if (!metalIssueDate) {
//         toast.error("Please select Metal Issue Date")
//         return
//       }


//       // ✅ NEW: Validate date is not in future
//       const selectedDate = new Date(metalIssueDate)
//       const today = new Date()
//       today.setHours(0, 0, 0, 0) // Reset time for accurate comparison
      
//       if (selectedDate > today) {
//         toast.error("Metal Issue Date cannot be in the future")
//         return
//       }


//       if (!transferredMetalGrams || parseFloat(transferredMetalGrams) <= 0) {
//         toast.error("Please enter valid Transferred Metal weight")
//         return
//       }


//       if (!remainingStock || parseFloat(remainingStock) < 0) {
//         toast.error("Please enter valid Remaining Stock")
//         return
//       }


//       // Check if transferred metal meets minimum requirement
//       const totalMeltingWt = parseFloat(aggregateCalculations.totalMeltingWeight)
//       const transferredWt = parseFloat(transferredMetalGrams)
      
//       if (transferredWt < totalMeltingWt) {
//         toast.error("Insufficient Metal", {
//           description: `Transferred metal (${transferredWt}g) is less than total required melting weight (${totalMeltingWt}g)`
//         })
//         return
//       }
//     }


//     // For rejection, require comments
//     if (status === "Rejected" && !comments.trim()) {
//       toast.error("Please provide comments for rejection")
//       return
//     }


//     setIsLoading(true)
    
//     try {
//       // ✅ SEPARATE LOGIC FOR APPROVAL VS REJECTION
//       if (status === "Approved") {
//         // ✅ CORRECTED: Send calculations with metal issue date
//         const approvalPayload = {
//           poNumber: selectedPO,
//           issueVoucherNo: issueVoucherNo.trim(),
//           metalIssueDate: metalIssueDate, // ✅ NEW: Include metal issue date
//           processedBy: user,
//           stockAvailable: stockAvailable,
//           transferredMetalGrams: parseFloat(transferredMetalGrams),
//           remainingStock: parseFloat(remainingStock),
//           comments: comments.trim(),
//           poDate: poBasicInfo?.poDate,
//           ParentCompany: selectedPoItems[0]?.ParentCompany || "",
//           calculations: {
//             totalWastage: parseFloat(aggregateCalculations.totalWastage),
//             meltingWeight: parseFloat(aggregateCalculations.totalMeltingWeight),
//             pureWeight: parseFloat(aggregateCalculations.totalPureWeight),
//             netWeight: parseFloat(aggregateCalculations.totalNetWeight),
//           }
//         }


//         console.log("Approval Payload:", approvalPayload)

          
//         const response = await axios.post(`${API}/gold_po/stock_allocation`, approvalPayload)
//         console.log("PO Stock Allocation Response:", response.data)
        
//         // ✅ Generate PDFs for approved status
//         if (response.data.findPoDatas) {
//           const filteredItems = response.data.findPoDatas
//           const poData = response.data.poData
//           const orderTypes = response.data.orderTypes
//           const poType = response.data.poType
//           const issueDate= response.data.metalIssueDate
          
          
//           await generatePdf(filteredItems, poData, orderTypes, 'unfix')
          
//           if (poData.parentPo && poData.parentPo.name && poData.parentPo.subTitle) {
//             await generateTctPdf(filteredItems, poData, orderTypes)
//           }
//         }
        
//         toast.success("PO Approved & PDF Generated", {
//           description: "Purchase Order approved and documents generated successfully"
//         })


//       } else if (status === "Rejected") {
//         // ✅ CORRECTED: Use rejection endpoint with separate payload
//         const rejectionPayload = {
//           poNumber: selectedPO,
//           processedBy: user,
//           comments: comments.trim()
//         }


//         console.log("Rejection Payload:", rejectionPayload)


//         const response = await axios.post(`${API}/gold_po/stock_allocation/reject`, rejectionPayload)
//         console.log("PO Rejection Response:", response.data)
        
//         toast.success("PO Rejected", {
//           description: "Purchase Order has been rejected successfully"
//         })
//       }
      
//       // Reset form
//       handleReset()


//       // Refresh PO list
//       const refreshResponse = await axios.get(`${API}/gold_po/fetch_approved_po`)
//       setApprovedPOs(refreshResponse.data.approvedTctPos || [])
//       setApprovedPoAllDetails(refreshResponse.data.result || [])
      
//     } catch (error) {
//       console.error("Error processing PO:", error)
//       toast.error("Error processing PO", {
//         description: error.response?.data?.message || `Failed to ${status.toLowerCase()} PO`
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }


//   // ✅ Reset form
//   const handleReset = () => {
//     setSelectedPO("")
//     setSelectedPoItems([])
//     setPoBasicInfo(null)
//     setStockAvailable(null)
//     setIssueVoucherNo("")
//     setMetalIssueDate("") // ✅ Reset date field
//     setTransferredMetalGrams("")
//     setRemainingStock("")
//     setComments("")
//     setAggregateCalculations({
//       totalNetWeight: 0,
//       totalBaseWastage: 0,
//       totalAdditionalWastage: 0,
//       totalWastage: 0,
//       totalMeltingWeight: 0,
//       totalWastageWeight: 0,
//       totalPureWeight: 0,
//       totalPieces: 0,
//       totalGrossWeight: 0,
//     })
//   }


//   if (isFetching) {
//     return (
//       <div className="container mx-auto py-8 max-w-5xl flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
//           <p className="text-muted-foreground">Loading purchase orders...</p>
//         </div>
//       </div>
//     )
//   }


//   return (
//     <div className="container mx-auto py-8">
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl flex items-center gap-2">
//             <Package className="h-6 w-6" />
//             PO Stock Allocation
//           </CardTitle>
//           <CardDescription>
//             Manage purchase order stock allocation and metal transfer
//           </CardDescription>
//         </CardHeader>
        
//         <CardContent className="space-y-6">
//           {/* PO Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="po-select">Purchase Order Number *</Label>
//             <Select value={selectedPO} onValueChange={handlePOSelect}>
//               <SelectTrigger id="po-select">
//                 <SelectValue placeholder="Select PO Number" />
//               </SelectTrigger>
//               <SelectContent>
//                 {approvedPOs.length === 0 ? (
//                   <SelectItem value="no-pos" disabled>
//                     No approved POs available
//                   </SelectItem>
//                 ) : (
//                   approvedPOs.map((po, index) => (
//                     <SelectItem key={index} value={po.value}>
//                       {po.label}
//                     </SelectItem>
//                   ))
//                 )}
//               </SelectContent>
//             </Select>
//           </div>


//           {/* PO Details Display */}
//           {selectedPoItems.length > 0 && poBasicInfo && (
//             <>
//               <Separator />
              
//               {/* Basic Details Card */}
//               <Card className="bg-muted/50">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <FileText className="h-5 w-5" />
//                     Purchase Order Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
//                     <div>
//                       <p className="text-muted-foreground">PO Number</p>
//                       <p className="font-medium">{poBasicInfo.poNumber}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Parent Company</p>
//                       <p className="font-medium">
//                         {selectedPoItems[0]?.ParentCompany||JSON.parse(selectedPoItems[0]?.parentPoAddress)?.subTitle}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">PO Date</p>
//                       <p className="font-medium">
//                         {subtractOneDay(poBasicInfo.poDetails)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Supplier</p>
//                       <p className="font-medium">{poBasicInfo.supplierName}</p>
//                     </div>
//                     <div>
//                       <p className="text-muted-foreground">Total Items</p>
//                       <Badge variant="secondary">{selectedPoItems.length} items</Badge>
//                     </div>
//                   </div>


//                   {/* Items Table */}
//                   <div className="rounded-md border mt-4">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead className="w-[50px]">S.No</TableHead>
//                           <TableHead>Product Name</TableHead>
//                           <TableHead>Metal Type</TableHead>
//                           <TableHead className="text-right">Pieces</TableHead>
//                           <TableHead className="text-right">Gross Wt (g)</TableHead>
//                           <TableHead className="text-right">Net Wt (g)</TableHead>
//                           <TableHead className="text-right">Wastage %</TableHead>
//                           <TableHead className="text-right">Melting %</TableHead>
//                           <TableHead className="text-right">Pure Wt (g)</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {selectedPoItems.map((item, index) => {
//                           const itemCalc = calculateItemWeights(item)
//                           return (
//                             <TableRow key={index}>
//                               <TableCell className="font-medium">{index + 1}</TableCell>
//                               <TableCell>{item.product_name}</TableCell>
//                               <TableCell>
//                                 <Badge variant="outline">{item.metal_type}</Badge>
//                               </TableCell>
//                               <TableCell className="text-right">{item.pieces}</TableCell>
//                               <TableCell className="text-right">{parseFloat(item.gross_weight).toFixed(3)}</TableCell>
//                               <TableCell className="text-right">{itemCalc.netWeight}</TableCell>
//                               <TableCell className="text-right">{item.wastage}%</TableCell>
//                               <TableCell className="text-right">{item.melting}%</TableCell>
//                               <TableCell className="text-right font-semibold text-green-600">
//                                 {itemCalc.pureWeight}
//                               </TableCell>
//                             </TableRow>
//                           )
//                         })}
//                       </TableBody>
//                       <TableFooter>
//                         <TableRow>
//                           <TableCell colSpan={3} className="font-bold">TOTAL</TableCell>
//                           <TableCell className="text-right font-bold">{aggregateCalculations.totalPieces}</TableCell>
//                           <TableCell className="text-right font-bold">{aggregateCalculations.totalGrossWeight}</TableCell>
//                           <TableCell className="text-right font-bold">{aggregateCalculations.totalNetWeight}</TableCell>
//                           <TableCell colSpan={2}></TableCell>
//                           <TableCell className="text-right font-bold text-green-600">
//                             {aggregateCalculations.totalPureWeight}
//                           </TableCell>
//                         </TableRow>
//                       </TableFooter>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>


//               {/* Aggregate Calculations Card */}
//               <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg flex items-center gap-2">
//                     <Calculator className="h-5 w-5" />
//                     Total Metal Weight Calculations (All Items)
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                     <div className="bg-background p-3 rounded-lg border">
//                       <p className="text-xs text-muted-foreground mb-1">Total Net Weight</p>
//                       <p className="text-lg font-bold">{aggregateCalculations.totalNetWeight}g</p>
//                     </div>
//                     <div className="bg-background p-3 rounded-lg border">
//                       <p className="text-xs text-muted-foreground mb-1">Total Base Wastage</p>
//                       <p className="text-lg font-bold text-blue-600">{aggregateCalculations.totalBaseWastage}g</p>
//                     </div>
//                     <div className="bg-background p-3 rounded-lg border">
//                       <p className="text-xs text-muted-foreground mb-1">Total Additional (10%)</p>
//                       <p className="text-lg font-bold text-amber-600">{aggregateCalculations.totalAdditionalWastage}g</p>
//                     </div>
//                     <div className="bg-background p-3 rounded-lg border">
//                       <p className="text-xs text-muted-foreground mb-1">Total Wastage</p>
//                       <p className="text-lg font-bold text-orange-600">{aggregateCalculations.totalWastage}g</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-background p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
//                       <div className="flex items-center gap-2 mb-2">
//                         <TrendingUp className="h-4 w-4 text-green-600" />
//                         <p className="text-xs text-muted-foreground font-semibold">Total Pure Weight</p>
//                       </div>
//                       <p className="text-2xl font-bold text-green-600">{aggregateCalculations.totalPureWeight}g</p>
//                     </div>
                    
//                     <div className="bg-background p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Package className="h-4 w-4 text-purple-600" />
//                         <p className="text-xs text-muted-foreground font-semibold">Total Wastage Weight</p>
//                       </div>
//                       <p className="text-2xl font-bold text-purple-600">{aggregateCalculations.totalWastageWeight}g</p>
//                     </div>
                    
//                     <div className="bg-background p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
//                         <p className="text-xs text-muted-foreground font-semibold">Total Melting Weight</p>
//                       </div>
//                       <p className="text-2xl font-bold text-indigo-600">{aggregateCalculations.totalMeltingWeight}g</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>


//               {/* Stock Availability */}
//               <div className="space-y-3">
//                 <Label>Stock Availability Status *</Label>
//                 <RadioGroup value={stockAvailable === true ? "yes" : stockAvailable === false ? "no" : ""} onValueChange={handleStockAvailability}>
//                   <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
//                     <RadioGroupItem value="yes" id="stock-yes" />
//                     <Label htmlFor="stock-yes" className="flex items-center gap-2 cursor-pointer flex-1">
//                       <CheckCircle2 className="h-5 w-5 text-green-600" />
//                       <div>
//                         <p className="font-medium">Metal Stock Available</p>
//                         <p className="text-sm text-muted-foreground">Sufficient stock to proceed</p>
//                       </div>
//                     </Label>
//                   </div>
                  
//                   <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
//                     <RadioGroupItem value="no" id="stock-no" />
//                     <Label htmlFor="stock-no" className="flex items-center gap-2 cursor-pointer flex-1">
//                       <XCircle className="h-5 w-5 text-red-600" />
//                       <div>
//                         <p className="font-medium">Metal Stock Not Available</p>
//                         <p className="text-sm text-muted-foreground">Insufficient stock</p>
//                       </div>
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>


//               {/* Stock Not Available Warning */}
//               {stockAvailable === false && (
//                 <Alert variant="destructive">
//                   <AlertTriangle className="h-4 w-4" />
//                   <AlertDescription>
//                     Cannot approve PO when stock is not available. You can only reject with comments explaining the reason.
//                   </AlertDescription>
//                 </Alert>
//               )}


//               {/* Transfer Details - Only if stock available */}
//               {stockAvailable === true && (
//                 <>
//                   <Separator />
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label htmlFor="voucher">Issue Voucher Number *</Label>
//                       <Input 
//                         id="voucher"
//                         placeholder="IV-2025-001"
//                         value={issueVoucherNo}
//                         onChange={(e) => setIssueVoucherNo(e.target.value.toUpperCase())}
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Voucher number linked to this allocation
//                       </p>
//                     </div>
                    
//                     {/* ✅ NEW: Metal Issue Date Field */}
//                     <div className="space-y-2">
//                       <Label htmlFor="issue-date" className="flex items-center gap-2">
//                         <Calendar className="h-4 w-4" />
//                          Issue Voucher Date *
//                       </Label>
//                       <Input 
//                         id="issue-date"
//                         type="date"
//                         value={metalIssueDate}
//                         // max={getTodayDate()} // Prevent future dates
//                         onChange={(e) => setMetalIssueDate(e.target.value)}
//                         className="cursor-pointer"
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Date when metal was issued (cannot be future date)
//                       </p>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="transferred">Transferred Metal (grams) *</Label>
//                       <Input 
//                         id="transferred"
//                         type="number"
//                         step="0.001"
//                         placeholder={`Min: ${aggregateCalculations.totalPureWeight}g`}
//                         value={transferredMetalGrams}
//                         onChange={(e) => setTransferredMetalGrams(e.target.value)}
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Required: <span className="font-semibold">{aggregateCalculations.totalPureWeight}g</span>
//                       </p>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <Label htmlFor="remaining">Remaining Stock (grams) *</Label>
//                       <Input 
//                         id="remaining"
//                         type="number"
//                         step="0.001"
//                         placeholder="Enter remaining stock"
//                         value={remainingStock}
//                         onChange={(e) => setRemainingStock(e.target.value)}
//                       />
//                       <p className="text-xs text-muted-foreground">
//                         Stock remaining after allocation
//                       </p>
//                     </div>
//                   </div>
//                 </>
//               )}


//               {/* Comments - Always visible */}
//               <div className="space-y-2">
//                 <Label htmlFor="comments">
//                   Comments {stockAvailable === false && <span className="text-red-500">*</span>}
//                 </Label>
//                 <Textarea 
//                   id="comments"
//                   placeholder={stockAvailable === false 
//                     ? "Explain reason for rejection (required)..."
//                     : "Enter any additional notes or special instructions..."
//                   }
//                   rows={4}
//                   value={comments}
//                   onChange={(e) => setComments(e.target.value)}
//                 />
//                 <p className="text-xs text-muted-foreground">
//                   {stockAvailable === false 
//                     ? "Comments are mandatory when stock is not available"
//                     : "Add relevant information for this allocation"
//                   }
//                 </p>
//               </div>


//               {/* Action Buttons */}
//               <Separator />
//               <div className="flex justify-end gap-3">
//                 <Button 
//                   variant="outline" 
//                   onClick={handleReset}
//                   disabled={isLoading}
//                 >
//                   Reset
//                 </Button>
                
//                 <Button 
//                   variant="destructive"
//                   onClick={() => handleSubmit('Rejected')}
//                   disabled={isLoading || !selectedPO}
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="mr-2 h-4 w-4" />
//                       Reject PO
//                     </>
//                   )}
//                 </Button>
                
//                 <Button 
//                   onClick={() => handleSubmit('Approved')}
//                   disabled={
//                     isLoading || 
//                     !selectedPO || 
//                     stockAvailable !== true ||
//                     !issueVoucherNo.trim() ||
//                     !metalIssueDate || // ✅ NEW: Validate date field
//                     !transferredMetalGrams ||
//                     parseFloat(transferredMetalGrams) <= 0 ||
//                     !remainingStock ||
//                     parseFloat(remainingStock) < 0
//                   }
//                 >
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Processing...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="mr-2 h-4 w-4" />
//                       Approve & Generate PO
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </>
//           )}


//           {/* Empty State */}
//           {!selectedPO && (
//             <div className="text-center py-12 text-muted-foreground">
//               <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p>Select a purchase order to begin</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { useSendToServer } from "../components/SendToServer"
import { useTctSendToServer } from "../components/TctSendToServer"
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  FileText,
  AlertTriangle,
  Calendar,
} from "lucide-react"
import { API } from "@/config/configData"
import { toast } from "sonner"
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext"

// ✅ Common empty calculation object (used for both parent & supplier)
const emptyCalculations = {
  totalNetWeight: 0,
  totalBaseWastage: 0,
  totalAdditionalWastage: 0,
  totalWastage: 0,
  totalMeltingWeight: 0,
  totalWastageWeight: 0,
  totalPureWeight: 0,
  totalPieces: 0,
  totalGrossWeight: 0,
  totalWastageAmt: 0,
}

// ✅ Reusable stock availability block
function StockAvailabilitySection({ label, value, onChange, notAvailableText,}) {
  return (
    <div className="space-y-3 mb-4">
      <Label>{label}</Label>
      <RadioGroup
        value={
          value === true ? "yes" : value === false ? "no" : ""
        }
        onValueChange={onChange}
      >
        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="yes" id={`${label}-yes`} />
          <Label
            htmlFor={`${label}-yes`}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium">Metal Stock Available</p>
              <p className="text-sm text-muted-foreground">
                Sufficient stock to proceed
              </p>
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <RadioGroupItem value="no" id={`${label}-no`} />
          <Label
            htmlFor={`${label}-no`}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium">Metal Stock Not Available</p>
              <p className="text-sm text-muted-foreground">
                Insufficient metal stock
              </p>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {value === false && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{notAvailableText}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// ✅ Reusable allocation table (Parent & Supplier use same table)
function AllocationTable({ items, calculations, calculateItemWeights,}) {
  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">S.No</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Metal Type</TableHead>
            <TableHead className="text-right">Pieces</TableHead>
            <TableHead className="text-right">Gross Wt (g)</TableHead>
            <TableHead className="text-right">Net Wt (g)</TableHead>
            <TableHead className="text-right">Melting %</TableHead>
            <TableHead className="text-right">Melting Wt (g)</TableHead>
            <TableHead className="text-right">Wastage %</TableHead>
            <TableHead className="text-right">Wastage Wt (g)</TableHead>
            <TableHead className="text-right">Amount (Wastage Wt)</TableHead>
            <TableHead className="text-right">Pure Wt (g)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            const itemCalc = calculateItemWeights(item)
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.metal_type}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.pieces}</TableCell>
                <TableCell className="text-right">
                  {parseFloat(item.gross_weight || 0).toFixed(3)}
                </TableCell>
                <TableCell className="text-right">
                  {itemCalc.netWeight}
                </TableCell>
                <TableCell className="text-right">{item.melting}%</TableCell>
                <TableCell className="text-right">
                  {itemCalc.meltingWeight}
                </TableCell>
                {/* <TableCell className="text-right">{item.wastage}%</TableCell> */}
                <TableCell className="text-right">
  {itemCalc.totalWastagePercent
    ? `${itemCalc.totalWastagePercent}%`
    : `${item.wastage}%`}
</TableCell>

                <TableCell className="text-right">
                  {itemCalc.wastageWeight}
                </TableCell>
                <TableCell className="text-right">
                  {itemCalc.wastageAmt}
                </TableCell>
                <TableCell className="text-right font-semibold text-green-600">
                  {itemCalc.pureWeight}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="font-bold">
              TOTAL
            </TableCell>
            {/* Pieces */}
            <TableCell className="text-right font-bold">
              {calculations.totalPieces}
            </TableCell>
            {/* Gross Wt */}
            <TableCell className="text-right font-bold">
              {Number(calculations.totalGrossWeight).toFixed(3)}
            </TableCell>
            {/* Net Wt */}
            <TableCell className="text-right font-bold">
              {Number(calculations.totalNetWeight).toFixed(3)}
            </TableCell>
            {/* Melting % (blank) */}
            <TableCell />
            {/* Melting Wt */}
            <TableCell className="text-right font-bold">
              {Number(calculations.totalMeltingWeight).toFixed(3)}
            </TableCell>
            {/* Wastage % (blank) */}
            <TableCell />
            {/* Wastage Wt */}
            <TableCell className="text-right font-bold">
              {Number(calculations.totalWastageWeight).toFixed(3)}
            </TableCell>
            {/* Amount (Total Wastage Amount) */}
            <TableCell className="text-right font-bold">
              {Number(calculations.totalWastageAmt).toFixed(2)}
            </TableCell>
            {/* Pure Wt */}
            <TableCell className="text-right font-bold text-green-600">
              {Number(calculations.totalPureWeight).toFixed(3)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default function POStockAllocation() {
  // ✅ State Management
  const [approvedPOs, setApprovedPOs] = useState([])
  const [approvedPoAllDetails, setApprovedPoAllDetails] = useState([])
  const [selectedPO, setSelectedPO] = useState("")
  const [selectedPoItems, setSelectedPoItems] = useState([])
  const [poBasicInfo, setPoBasicInfo] = useState(null)

  const [parentStockAvailable, setParentStockAvailable] = useState(null)
  const [supplierStockAvailable, setSupplierStockAvailable] = useState(null)

  const [parentIssueVoucherNo, setParentIssueVoucherNo] = useState("")
  const [supplierIssueVoucherNo, setSupplierIssueVoucherNo] = useState("")
  const [parentIssueDate, setParentIssueDate] = useState("")
  const [supplierIssueDate, setSupplierIssueDate] = useState("")
  const [parentTransferredMetalGrams, setParentTransferredMetalGrams] = useState("")
  const [supplierTransferredMetalGrams, setSupplierTransferredMetalGrams] = useState("")
  const [remainingStock, setRemainingStock] = useState("")
  const [comments, setComments] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const { user } = useContext(DashBoardContext) 

  // ✅ Gold rate inputs (used for wastage amount)
  const [goldRate, setGoldRate] = useState("")

  // ✅ Aggregate Calculations State (now includes totalWastageAmt)
  const [parentCalculations, setParentCalculations] = useState({ ...emptyCalculations })
  const [supplierCalculations, setSupplierCalculations] = useState({ ...emptyCalculations })

  const { generatePdf } = useSendToServer({
    onPdfGenerated: () => {
      console.log("Parent→TCT PDF generated successfully")
    },
  })

  const { generatePdf: generateTctPdf } = useTctSendToServer({
    onPdfGenerated: () => {
      console.log("TCT→Supplier PDF generated successfully")
    },
  })

  // ✅ Calculate metal weights for each item (Parent → 10% additional)
  const calculateParentItemWeights = (item) => {
    const netWeight = parseFloat(item?.net_weight || 0)
    const wastagePercent = parseFloat(item?.wastage || 0)
    const meltingPercent = parseFloat(item?.melting || 0)

    const baseWastage = (netWeight * wastagePercent) / 100
    const additionalWastage = baseWastage * 0.1
    const totalWastage = baseWastage + additionalWastage
    const meltingWeight = (netWeight * meltingPercent) / 100
    const wastageWeight = totalWastage
    const pureWeight = wastageWeight + meltingWeight

    const rate = parseFloat(goldRate || "0")
    const wastageAmt = wastageWeight.toFixed(3) * rate
    return {
      baseWastage: baseWastage.toFixed(3),
      additionalWastage: additionalWastage.toFixed(3),
        totalWastagePercent: (wastagePercent * 1.1).toFixed(2),

      totalWastage: totalWastage.toFixed(3),
      meltingWeight: meltingWeight.toFixed(3),
      wastageWeight: wastageWeight.toFixed(3),
      pureWeight: pureWeight.toFixed(3),
      netWeight: netWeight.toFixed(3),
      wastageAmt: wastageAmt.toFixed(2),
    }
  }

  // ✅ Calculate metal weights for each item (Supplier → no 10% additional)
  const calculateSupplierItemWeights = (item) => {
    const netWeight = parseFloat(item?.net_weight || 0)
    const wastagePercent = parseFloat(item?.wastage || 0)
    const meltingPercent = parseFloat(item?.melting || 0)

    const baseWastage = (netWeight * wastagePercent) / 100
    const meltingWeight = (netWeight * meltingPercent) / 100
    const wastageWeight = baseWastage
    const pureWeight = wastageWeight + meltingWeight

    // Prefer supplier rate, fallback to parent rate
    const rate = parseFloat( goldRate || "0")
    const wastageAmt = wastageWeight * rate

    return {
      baseWastage: baseWastage.toFixed(3),
      totalWastage: baseWastage.toFixed(3),
      meltingWeight: meltingWeight.toFixed(3),
      wastageWeight: wastageWeight.toFixed(3),
      pureWeight: pureWeight.toFixed(3),
      netWeight: netWeight.toFixed(3),
      wastageAmt: wastageAmt.toFixed(2),
    }
  }

  // ✅ Generic aggregate calculator (used for both parent & supplier)
  const calculateAggregates = (items, calcFn) => {
    const totals = items.reduce(
      (acc, item) => {
        const c = calcFn(item)

        return {
          totalNetWeight: acc.totalNetWeight + parseFloat(c.netWeight || 0),
          totalBaseWastage: acc.totalBaseWastage + parseFloat(c.baseWastage || 0),
          totalAdditionalWastage:
            acc.totalAdditionalWastage + parseFloat(c.additionalWastage || 0),
          totalWastage: acc.totalWastage + parseFloat(c.totalWastage || 0),
          totalMeltingWeight: acc.totalMeltingWeight + parseFloat(c.meltingWeight || 0),
          totalWastageWeight: acc.totalWastageWeight + parseFloat(c.wastageWeight || 0),
          totalPureWeight: acc.totalPureWeight + parseFloat(c.pureWeight || 0),
          totalPieces: acc.totalPieces + parseInt(item.pieces || 0),
          totalGrossWeight:
            acc.totalGrossWeight + parseFloat(item.gross_weight || 0),
          totalWastageAmt: acc.totalWastageAmt + parseFloat(c.wastageAmt || 0),
        }
      },
      { ...emptyCalculations }
    )

    // keep full precision in state, formatting only at render
    return totals
  }

  // ✅ Fetch approved POs
  useEffect(() => {
    const fetchApprovedPOs = async () => {
      setIsFetching(true)
      try {
        const response = await axios.get(`${API}/gold_po/fetch_approved_po`)
        setApprovedPOs(response.data.approvedTctPos || [])
        setApprovedPoAllDetails(response.data.result || [])
        toast.success("Purchase orders loaded successfully")
      } catch (error) {
        console.error("Error fetching approved POs:", error)
        toast.error("Failed to fetch approved POs")
      } finally {
        setIsFetching(false)
      }
    }

    fetchApprovedPOs()
  }, [])

  // ✅ Recalculate aggregates whenever items or gold rates change
  useEffect(() => {
    if (!selectedPoItems.length) {
      setParentCalculations({ ...emptyCalculations })
      setSupplierCalculations({ ...emptyCalculations })
      return
    }

    setParentCalculations(
      calculateAggregates(selectedPoItems, calculateParentItemWeights)
    )
    setSupplierCalculations(
      calculateAggregates(selectedPoItems, calculateSupplierItemWeights)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPoItems, goldRate])

  // ✅ Handle PO selection
  const handlePOSelect = (value) => {

    setSelectedPO(value)
    console.log("555555555555555",value)
    // Reset fields
    handleReset(false)
    const poItems = approvedPoAllDetails.filter(
      (po) => po.poNumber == value
    )
console.log(poItems)

    if (poItems.length > 0) {
      setSelectedPoItems(poItems)
      setPoBasicInfo({
        poNumber: poItems[0].poNumber,
        poDate: poItems[0].poDate || poItems[0].po_date,
        poDetails: poItems[0].poDetails,
        supplierName: poItems[0].supplierName,
      })
    } else {
      setSelectedPoItems([])
      setPoBasicInfo(null)
    }
  }

  console.log(selectedPO)

  const handleParentStockAvailability = (value) => {
    const isAvailable = value === "yes"
    setParentStockAvailable(isAvailable)

    if (!isAvailable) {
      setParentIssueVoucherNo("")
      setParentIssueDate("")
      setParentTransferredMetalGrams("")
      setRemainingStock("")
    }
  }

  const handleSupplierStockAvailability = (value) => {
    const isAvailable = value === "yes"
    setSupplierStockAvailable(isAvailable)

    if (!isAvailable) {
      setSupplierIssueVoucherNo("")
      setSupplierIssueDate("")
      setSupplierTransferredMetalGrams("")
    }
  }

  const subtractOneDay = (dateInput) => {
    try {
      let dateValue

      if (typeof dateInput === "object" && dateInput !== null) {
        dateValue = dateInput.poDate
      } else if (typeof dateInput === "string") {
        try {
          const parsedField = JSON.parse(dateInput)
          dateValue = parsedField.poDate || parsedField
        } catch {
          dateValue = dateInput
        }
      } else {
        dateValue = dateInput
      }

      const date = new Date(dateValue)
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date")
      }

      date.setDate(date.getDate() - 1)
      return date.toLocaleDateString("en-GB")
    } catch (error) {
      console.error("Error parsing date:", error)
      return "Invalid Date"
    }
  }

  const handleSubmit = async (status) => {
    if (!selectedPO) {
      toast.error("Please select a Purchase Order")
      return
    }
    if(!goldRate){
    toast.error("Please Enter Current Gold Rate")
    return 
    }
    if (parentStockAvailable === null || supplierStockAvailable === null) {
      toast.error("Please select stock availability for both Parent & Supplier")
      return
    }

    if (status === "Approved") {
      if (!parentStockAvailable || !supplierStockAvailable) {
        toast.error("Stock must be available for both Parent and Supplier to approve PO")
        return
      }

      if (!parentIssueVoucherNo.trim()) {
        toast.error("Please enter Parent Company Issue Voucher Number")
        return
      }
      if (!supplierIssueVoucherNo.trim()) {
        toast.error("Please enter Supplier Issue Voucher Number")
        return
      }
      if (!parentIssueDate) {
        toast.error("Please select Parent Issue Voucher Date")
        return
      }
      if (!supplierIssueDate) {
        toast.error("Please select Supplier Issue Voucher Date")
        return
      }

      const pTrans = parseFloat(parentTransferredMetalGrams || "0")
      const sTrans = parseFloat(supplierTransferredMetalGrams || "0")
      const rem = parseFloat(remainingStock || "0")

      if (pTrans <= 0) {
        toast.error("Please enter valid Transferred Metal weight for Parent")
        return
      }
      if (sTrans <= 0) {
        toast.error("Please enter valid Transferred Metal weight for Supplier")
        return
      }
      if (remainingStock === "" || rem < 0) {
        toast.error("Please enter valid Remaining Stock")
        return
      }

      const totalParentMeltingWt = parentCalculations.totalMeltingWeight
      const totalSupplierMeltingWt = supplierCalculations.totalMeltingWeight

      if (pTrans < totalParentMeltingWt) {
        toast.error("Insufficient Metal for Parent", {
          description: `Transferred metal (${pTrans}g) is less than total required melting weight for parent (${totalParentMeltingWt.toFixed(
            3
          )}g)`,
        })
        return
      }

      if (sTrans < totalSupplierMeltingWt) {
        toast.error("Insufficient Metal for Supplier", {
          description: `Transferred metal (${sTrans}g) is less than total required melting weight for supplier (${totalSupplierMeltingWt.toFixed(
            3
          )}g)`,
        })
        return
      }
    }

    if (status === "Rejected" && !comments.trim()) {
      toast.error("Please provide comments for rejection")
      return
    }

    setIsLoading(true)

    try {
      if (status === "Approved") {
        const approvalPayload = {
          poNumber: selectedPO,
          parentIssueVoucherNo: parentIssueVoucherNo.trim(),
          supplierIssueVoucherNo: supplierIssueVoucherNo.trim(),
          parentIssueDate,
          supplierIssueDate,
          processedBy: user,
          stockAvailable: parentStockAvailable && supplierStockAvailable,
          parentStockAvailable,
          supplierStockAvailable,
          parentTransferredMetalGrams: parseFloat(parentTransferredMetalGrams),
          supplierTransferredMetalGrams: parseFloat(supplierTransferredMetalGrams),
          remainingStock: parseFloat(remainingStock),
          comments: comments.trim(),
          poDate: poBasicInfo?.poDate,
          ParentCompany: selectedPoItems[0]?.ParentCompany || "",
          GoldRate: goldRate ? parseFloat(goldRate) : null,
          // supplierGoldRate: supplierGoldRate ? parseFloat(supplierGoldRate) : null,
          parentCalculations: {
            totalWastage: parentCalculations.totalWastage,
            meltingWeight: parentCalculations.totalMeltingWeight,
            pureWeight: parentCalculations.totalPureWeight,
            netWeight: parentCalculations.totalNetWeight,
            wastageWeight: parentCalculations.totalWastageWeight,
            wastageAmt: parentCalculations.totalWastageAmt,
          },
          supplierCalculations: {
            totalWastage: supplierCalculations.totalWastage,
            meltingWeight: supplierCalculations.totalMeltingWeight,
            pureWeight: supplierCalculations.totalPureWeight,
            netWeight: supplierCalculations.totalNetWeight,
            wastageWeight: supplierCalculations.totalWastageWeight,
            wastageAmt: supplierCalculations.totalWastageAmt,
          },
        }

        console.log("Approval Payload:", approvalPayload)

        const response = await axios.post(
          `${API}/gold_po/stock_allocation`,
          approvalPayload
        )
        console.log("PO Stock Allocation Response:", response.data)

        if (response.data.findPoDatas) {
          const filteredItems = response.data.findPoDatas
          const poData = response.data.poData
          const orderTypes = response.data.orderTypes

          await generatePdf(filteredItems, poData, orderTypes, "parent")
          await generateTctPdf(filteredItems, poData, orderTypes, "supplier")
        }

        toast.success("PO Approved & PDFs Generated", {
          description:
            "Purchase Order approved and both documents generated successfully",
        })
      } else {
        const rejectionPayload = {
          poNumber: selectedPO,
          processedBy: user,
          comments: comments.trim(),
          parentStockAvailable,
          supplierStockAvailable,
        }

        console.log("Rejection Payload:", rejectionPayload)

        const response = await axios.post(
          `${API}/gold_po/stock_allocation/reject`,
          rejectionPayload
        )
        console.log("PO Rejection Response:", response.data)

        toast.success("PO Rejected", {
          description: "Purchase Order has been rejected successfully",
        })
      }

      handleReset(true)
      const refreshResponse = await axios.get(`${API}/gold_po/fetch_approved_po`)
      setApprovedPOs(refreshResponse.data.approvedTctPos || [])
      setApprovedPoAllDetails(refreshResponse.data.result || [])
    } catch (error) {
      console.error("Error processing PO:", error)
      toast.error("Error processing PO", {
        description:
          error?.response?.data?.message ||
          `Failed to ${status.toLowerCase()} PO`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = (keepSelectedPO) => {
    if (keepSelectedPO) {
      setSelectedPO("")
      setSelectedPoItems([])
      setPoBasicInfo(null)
    }

    setParentStockAvailable(null)
    setSupplierStockAvailable(null)
    setParentIssueVoucherNo("")
    setSupplierIssueVoucherNo("")
    setParentIssueDate("")
    setSupplierIssueDate("")
    setParentTransferredMetalGrams("")
    setSupplierTransferredMetalGrams("")
    setRemainingStock("")
    setComments("")
    setGoldRate("")
    setParentCalculations({ ...emptyCalculations })
    setSupplierCalculations({ ...emptyCalculations })
  }

  const isRejectionReasonRequired =
    parentStockAvailable === false || supplierStockAvailable === false

  if (isFetching) {
    return (
      <div className="container mx-auto py-8 max-w-5xl flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading purchase orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Package className="h-6 w-6" />
            PO Stock Allocation
          </CardTitle>
          <CardDescription>
            Manage purchase order stock allocation and metal transfer
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* PO Selection */}
          <div className="space-y-2">
            <Label htmlFor="po-select">Purchase Order Number *</Label>
            <Select value={selectedPO} onValueChange={handlePOSelect}>
              <SelectTrigger id="po-select">
                <SelectValue placeholder="Select PO Number" />
              </SelectTrigger>
              <SelectContent>
                {approvedPOs.length === 0 ? (
                  <SelectItem value="no-pos" disabled>
                    No approved POs available
                  </SelectItem>
                ) : (
                  approvedPOs.map((po, index) => (
                    <SelectItem key={index} value={po.value}>
                      {po.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Gold Rate Inputs */}
          {console.log(selectedPO)}
          {selectedPO && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="parent-gold-rate">Gold Rate (₹ / g)</Label>
                <Input
                  id="parent-gold-rate"
                  type="number"
                  step="0.01"
                  placeholder="Enter parent gold rate"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Gold rate used for Parent Company → TCT allocation
                </p>
              </div>

            
            </div>
          )}

          {/* PO Details + Allocations */}
          {selectedPoItems.length > 0 && poBasicInfo && (
            <>
              <Separator />

              {/* Parent Company → TCT */}
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Parent Company → TCT Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StockAvailabilitySection
                    label="Parent Metal Stock Availability *"
                    value={parentStockAvailable}
                    onChange={handleParentStockAvailability}
                    notAvailableText="Parent metal stock is not available. You will not be able to approve this PO until stock is available. You can reject with comments."
                  />

                  {/* PO Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">PO Number</p>
                      <p className="font-medium">{poBasicInfo.poNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Parent Company</p>
                      <p className="font-medium">
                        {selectedPoItems[0]?.ParentCompany ||
                          (selectedPoItems[0]?.parentPoAddress
                            ? JSON.parse(selectedPoItems[0]?.parentPoAddress)
                                ?.subTitle
                            : "")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">PO Date</p>
                      <p className="font-medium">
                        {subtractOneDay(poBasicInfo.poDetails)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplier</p>
                      <p className="font-medium">{poBasicInfo.supplierName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Items</p>
                      <Badge variant="secondary">
                        {selectedPoItems.length} items
                      </Badge>
                    </div>
                  </div>

                  {/* Parent Items Table */}
                  <AllocationTable
                    items={selectedPoItems}
                    calculations={parentCalculations}
                    calculateItemWeights={calculateParentItemWeights}
                  />

                  {/* Parent Aggregates */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Net Weight
                      </p>
                      <p className="text-lg font-bold">
                        {parentCalculations.totalNetWeight.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Base Wastage
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {parentCalculations.totalBaseWastage.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Additional (10%)
                      </p>
                      <p className="text-lg font-bold text-amber-600">
                        {parentCalculations.totalAdditionalWastage.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Wastage
                      </p>
                      <p className="text-lg font-bold text-orange-600">
                        {parentCalculations.totalWastage.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Wastage Amount
                      </p>
                      <p className="text-lg font-bold">
                        ₹ {parentCalculations.totalWastageAmt.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Parent Transfer */}
                  {parentStockAvailable === true && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="parent-voucher">
                          Parent Company Issue Voucher Number *
                        </Label>
                        <Input
                          id="parent-voucher"
                          placeholder="IV-2025-001"
                          value={parentIssueVoucherNo}
                          onChange={(e) =>
                            setParentIssueVoucherNo(
                              e.target.value.toUpperCase()
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Voucher number for parent company allocation
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="parent-issue-date"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Parent Issue Voucher Date *
                        </Label>
                        <Input
                          id="parent-issue-date"
                          type="date"
                          value={parentIssueDate}
                          onChange={(e) => setParentIssueDate(e.target.value)}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Date when parent metal was issued (cannot be future
                          date)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="parent-transferred">
                          Parent Transferred Metal (grams) *
                        </Label>
                        <Input
                          id="parent-transferred"
                          type="number"
                          step="0.001"
                          placeholder={`Min: ${parentCalculations.totalPureWeight.toFixed(
                            3
                          )}g`}
                          value={parentTransferredMetalGrams}
                          onChange={(e) =>
                            setParentTransferredMetalGrams(e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Required for parent:{" "}
                          <span className="font-semibold">
                            {parentCalculations.totalPureWeight.toFixed(3)}g
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="remaining">
                          Remaining Stock (grams) *
                        </Label>
                        <Input
                          id="remaining"
                          type="number"
                          step="0.001"
                          placeholder="Enter remaining stock"
                          value={remainingStock}
                          onChange={(e) => setRemainingStock(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Stock remaining after allocation
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* TCT → Supplier */}
              <Card className="bg-muted/50 mt-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    TCT → Supplier Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <StockAvailabilitySection
                    label="Supplier Metal Stock Availability *"
                    value={supplierStockAvailable}
                    onChange={handleSupplierStockAvailability}
                    notAvailableText="Supplier metal stock is not available. You will not be able to approve this PO until stock is available. You can reject with comments."
                  />

                  {/* Supplier Table */}
                  <AllocationTable
                    items={selectedPoItems}
                    calculations={supplierCalculations}
                    calculateItemWeights={calculateSupplierItemWeights}
                  />

                  {/* Supplier Aggregates */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Net Weight
                      </p>
                      <p className="text-lg font-bold">
                        {supplierCalculations.totalNetWeight.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Base Wastage
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        {supplierCalculations.totalBaseWastage.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Wastage
                      </p>
                      <p className="text-lg font-bold text-orange-600">
                        {supplierCalculations.totalWastage.toFixed(3)}g
                      </p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Wastage Amount
                      </p>
                      <p className="text-lg font-bold">
                        ₹ {supplierCalculations.totalWastageAmt.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Supplier Transfer */}
                  {supplierStockAvailable === true && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="supplier-voucher">
                          Supplier Issue Voucher Number *
                        </Label>
                        <Input
                          id="supplier-voucher"
                          placeholder="SV-2025-001"
                          value={supplierIssueVoucherNo}
                          onChange={(e) =>
                            setSupplierIssueVoucherNo(
                              e.target.value.toUpperCase()
                            )
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Voucher number for supplier allocation
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="supplier-issue-date"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Supplier Issue Voucher Date *
                        </Label>
                        <Input
                          id="supplier-issue-date"
                          type="date"
                          value={supplierIssueDate}
                          onChange={(e) =>
                            setSupplierIssueDate(e.target.value)
                          }
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Date when supplier metal was issued (cannot be future
                          date)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="supplier-transferred">
                          Supplier Transferred Metal (grams) *
                        </Label>
                        <Input
                          id="supplier-transferred"
                          type="number"
                          step="0.001"
                          placeholder={`Min: ${supplierCalculations.totalPureWeight.toFixed(
                            3
                          )}g`}
                          value={supplierTransferredMetalGrams}
                          onChange={(e) =>
                            setSupplierTransferredMetalGrams(e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Required for supplier:{" "}
                          <span className="font-semibold">
                            {supplierCalculations.totalPureWeight.toFixed(3)}g
                          </span>
                        </p>
                      </div>
                      <div />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments */}
              <div className="space-y-2 mt-6">
                <Label htmlFor="comments">
                  Comments{" "}
                  {isRejectionReasonRequired && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Textarea
                  id="comments"
                  placeholder={
                    isRejectionReasonRequired
                      ? "Explain reason for rejection / stock unavailability (required)..."
                      : "Enter any additional notes or special instructions..."
                  }
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {isRejectionReasonRequired
                    ? "Comments are mandatory when stock is not available for Parent or Supplier"
                    : "Add relevant information for this allocation"}
                </p>
              </div>

              {/* Actions */}
              <Separator />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleReset(false)}
                  disabled={isLoading}
                >
                  Reset
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleSubmit("Rejected")}
                  disabled={isLoading || !selectedPO}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject PO
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleSubmit("Approved")}
                  disabled={
                    isLoading ||
                    !selectedPO ||
                    parentStockAvailable !== true ||
                    supplierStockAvailable !== true ||
                    !parentIssueVoucherNo.trim() ||
                    !supplierIssueVoucherNo.trim() ||
                    !parentIssueDate ||
                    !supplierIssueDate ||
                    !parentTransferredMetalGrams ||
                    parseFloat(parentTransferredMetalGrams || "0") <= 0 ||
                    !supplierTransferredMetalGrams ||
                    parseFloat(supplierTransferredMetalGrams || "0") <= 0 ||
                    remainingStock === "" ||
                    parseFloat(remainingStock || "0") < 0
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve & Generate PO
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {!selectedPO && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a purchase order to begin</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
