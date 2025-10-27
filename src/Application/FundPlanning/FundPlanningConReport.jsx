import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config/configData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Scale, 
  CalendarIcon, 
  X, 
  Filter,
  Sparkles,
  Activity
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";


function FundPlanningConReport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });


  useEffect(() => {
    const fetchFundPlanningDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API}/summary_report/daily-fund-transfer-summary`);
        const responseData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        
        setData(responseData);
        
        if (responseData.length > 0) {
          setFilteredData([responseData[0]]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };


    fetchFundPlanningDetails();
  }, []);


useEffect(() => {
  if (!dateRange.from && !dateRange.to) {
    if (data.length > 0) {
      setFilteredData([data[0]]);
    }
    return;
  }

  const filtered = data.filter(record => {
    const recordDate = new Date(record.RPTDATE);
    // Normalize record date to midnight for comparison
    recordDate.setHours(0, 0, 0, 0);
    
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      
      const toDate = new Date(dateRange.to);
      toDate.setHours(0, 0, 0, 0);
      
      // For same day comparison (like 1 Day filter)
      return recordDate >= fromDate && recordDate <= toDate;
    } else if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      return recordDate >= fromDate;
    } else if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(0, 0, 0, 0);
      return recordDate <= toDate;
    }
    
    return true;
  });

  setFilteredData(filtered);
}, [dateRange, data]);



  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    if (data.length > 0) {
      setFilteredData([data[0]]);
    }
  };


 const handleQuickFilter = (days) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight
  
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (days === 1) { // Changed from == to ===
    // For 1 day filter, set both from and to as yesterday
    setDateRange({
      from: new Date(yesterday),
      to: new Date(yesterday)
    });
  } else {
    // For other filters, calculate from date
    const fromDate = new Date(yesterday);
    fromDate.setDate(yesterday.getDate() - days + 1);
    
    setDateRange({
      from: fromDate,
      to: new Date(yesterday)
    });
  }
};
 console.log(dateRange);

  const applyFilters = () => {
    setIsFilterDialogOpen(false);
  };


  // Aggregation function to sum all filtered records
  const aggregateFilteredData = (dataArray) => {
    if (dataArray.length === 0) return null;
    
    // If only one record, return it as is
    if (dataArray.length === 1) return dataArray[0];
    
    // Sort by date to get proper date range
    const sortedData = [...dataArray].sort((a, b) => 
      new Date(a.RPTDATE) - new Date(b.RPTDATE)
    );
    
    // Aggregate all records
    const aggregated = sortedData.reduce((acc, record, index) => {
      if (index === 0) {
        // Initialize with first record
        return {
          RPTDATE: record.RPTDATE,
          GOLD_SALE_RATE: record.GOLD_SALE_RATE || 0,
          GOLDSALWGT: record.GOLDSALWGT || 0,
          CHIT_TRN_VAL: record.CHIT_TRN_VAL || 0,
          CUS_ADV_WGT: record.CUS_ADV_WGT || 0,
          CUS_ADV_RATE_FIX_WGT: record.CUS_ADV_RATE_FIX_WGT || 0,
          NIDHI_VAL: record.NIDHI_VAL || 0,
          DIGI_GOLD_WGT: record.DIGI_GOLD_WGT || 0,
          CUS_ORD_WGT: record.CUS_ORD_WGT || 0,
          OG_WGT_GRAM: record.OG_WGT_GRAM || 0,
          CHIT_CLOSE_VAL: record.CHIT_CLOSE_VAL || 0,
          START_DATE: record.RPTDATE,
          END_DATE: record.RPTDATE,
        };
      }
      
      // Sum all numeric fields
      return {
        RPTDATE: acc.RPTDATE,
        GOLD_SALE_RATE: record.GOLD_SALE_RATE || acc.GOLD_SALE_RATE, // Use latest rate
        GOLDSALWGT: acc.GOLDSALWGT + (record.GOLDSALWGT || 0),
        CHIT_TRN_VAL: acc.CHIT_TRN_VAL + (record.CHIT_TRN_VAL || 0),
        CUS_ADV_WGT: acc.CUS_ADV_WGT + (record.CUS_ADV_WGT || 0),
        CUS_ADV_RATE_FIX_WGT: acc.CUS_ADV_RATE_FIX_WGT + (record.CUS_ADV_RATE_FIX_WGT || 0),
        NIDHI_VAL: acc.NIDHI_VAL + (record.NIDHI_VAL || 0),
        DIGI_GOLD_WGT: acc.DIGI_GOLD_WGT + (record.DIGI_GOLD_WGT || 0),
        CUS_ORD_WGT: acc.CUS_ORD_WGT + (record.CUS_ORD_WGT || 0),
        OG_WGT_GRAM: acc.OG_WGT_GRAM + (record.OG_WGT_GRAM || 0),
        CHIT_CLOSE_VAL: acc.CHIT_CLOSE_VAL + (record.CHIT_CLOSE_VAL || 0),
        START_DATE: acc.START_DATE,
        END_DATE: record.RPTDATE,
      };
    }, {});


    // Format date range for display
    if (sortedData.length > 1) {
      aggregated.RPTDATE = `${format(new Date(aggregated.START_DATE), "dd MMM yyyy")} - ${format(new Date(aggregated.END_DATE), "dd MMM yyyy")}`;
    }
    
    return aggregated;
  };


  const transformToBalanceSheet = (record) => {
    const goldSaleRate = record.GOLD_SALE_RATE || 1;
    
    const metalIn = [
      { 
        label: "Gold Sales", 
        weight: record.GOLDSALWGT || 0,
        value: (record.GOLDSALWGT || 0) * goldSaleRate,
        icon: "💰"
      },
      { 
        label: "Chit Transaction", 
        weight: (record.CHIT_TRN_VAL || 0) / goldSaleRate,
        value: record.CHIT_TRN_VAL || 0,
        icon: "🎯"
      },
      { 
        label: "Customer Advance", 
        weight: (record.CUS_ADV_WGT || 0),
        value: (record.CUS_ADV_WGT || 0) * goldSaleRate,
        icon: "👤"
      },
      { 
        label: "Advance Rate Fix", 
        weight: record.CUS_ADV_RATE_FIX_WGT || 0,
        value: (record.CUS_ADV_RATE_FIX_WGT || 0) * goldSaleRate,
        icon: "📌"
      },
      { 
        label: "Nidhi", 
        weight: (record.NIDHI_VAL || 0) / goldSaleRate,
        value: record.NIDHI_VAL || 0,
        icon: "🏦"
      },
      { 
        label: "Digi Gold", 
        weight: record.DIGI_GOLD_WGT || 0,
        value: (record.DIGI_GOLD_WGT || 0) * goldSaleRate,
        icon: "💎"
      },
      { 
        label: "Customer Order", 
        weight: record.CUS_ORD_WGT || 0,
        value: (record.CUS_ORD_WGT || 0) * goldSaleRate,
        icon: "📋"
      },
    ];


    const metalOut = [
      { 
        label: "Old Gold", 
        weight: record.OG_WGT_GRAM || 0,
        value: (record.OG_WGT_GRAM || 0) * goldSaleRate,
        icon: "♻️"
      },
      { 
        label: "Chit Closing", 
        weight: (record.CHIT_CLOSE_VAL || 0) / goldSaleRate,
        value: record.CHIT_CLOSE_VAL || 0,
        icon: "🔒"
      }
    ];


    const totalMetalIn = metalIn.reduce((sum, item) => sum + item.weight, 0);
    const totalMetalOut = metalOut.reduce((sum, item) => sum + item.weight, 0);
    const totalValueIn = metalIn.reduce((sum, item) => sum + item.value, 0);
    const totalValueOut = metalOut.reduce((sum, item) => sum + item.value, 0);


    return {
      date: record.RPTDATE,
      goldRate: goldSaleRate,
      metalIn,
      metalOut,
      totalMetalIn,
      totalMetalOut,
      totalValueIn,
      totalValueOut,
      netPosition: totalMetalIn - totalMetalOut,
      netValue: totalValueIn - totalValueOut,
      pureConversion: ((parseFloat(totalMetalIn) - parseFloat(totalMetalOut)) * (99.99/100)) / 1000,
    };
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-500 animate-pulse" />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="glass-card p-6 max-w-md w-full text-center space-y-3">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800">Error Loading Data</h2>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }


  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="glass-card p-6 max-w-md w-full text-center space-y-3">
          <div className="text-5xl">📊</div>
          <h2 className="text-xl font-bold text-gray-800">No Data Available</h2>
          <p className="text-sm text-gray-600">No metal transfer records found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 overflow-x-hidden">
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
          overflow: hidden;
        }
        
        .glass-card-hover {
          transition: all 0.3s ease;
        }
        
        .glass-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.25);
        }


        .metric-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
          overflow: hidden;
        }


        .transaction-item {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          transition: all 0.2s ease;
          overflow: hidden;
        }


        .transaction-item:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(139, 92, 246, 0.3);
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
        }


        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }


        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>


      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-xl md:text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Metal Analytics Report
            </h1>
          </div>
        </div>


        {/* Records - Aggregated View */}
        {filteredData.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your date filters</p>
          </div>
        ) : (
          (() => {
            const aggregatedRecord = aggregateFilteredData(filteredData);
            const bs = transformToBalanceSheet(aggregatedRecord);
            
            return (
              <div className="space-y-6">
                <div className={`metric-card p-4 bg-gradient-to-r ${bs.netPosition >= 0 ? 'from-blue-100/80 to-purple-100/80 border-blue-300' : 'from-orange-100/80 to-red-100/80 border-orange-300'}`}>
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-600">Report Date</p>
                        <p className="text-xl font-bold text-gray-800">{bs.date}</p>
                      </div>
                      
                      {/* Filter Dialog Button */}
<div className="flex justify-center">
  <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
    <DialogTrigger asChild>
      <button className="glass-card glass-card-hover rounded-xl px-4 py-2 sm:px-6 sm:py-3 text-gray-700 text-sm sm:text-base font-medium flex items-center gap-2 hover:text-purple-700">
        <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
        Filters
        {(dateRange.from || dateRange.to) && (
          <Badge className="ml-1 sm:ml-2 bg-purple-500 text-xs px-1.5 py-0.5">Active</Badge>
        )}
      </button>
    </DialogTrigger>
    <DialogContent className="w-[calc(100%-40px)] max-w-[calc(100%-40px)] sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6 rounded-2xl">
      <DialogHeader className="space-y-1 sm:space-y-1.5">
        <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg">
          <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          Date Range Filter
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          Select a date range to filter your metal analytics report
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
        {/* Quick Filters */}
        <div>
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2 block">Quick Filters</label>
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {[
              { label: '1 Day', days: 1 },
              { label: '7 Days', days: 7 },
              { label: '30 Days', days: 30 },
              { label: '90 Days', days: 90 },
              { label: 'All', days: null }
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => filter.days ? handleQuickFilter(filter.days) : setDateRange({ from: undefined, to: undefined })}
                className={cn(
                  "px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all",
                  "hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700",
                  "bg-white border-gray-200 text-gray-700"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-300" />

        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">From Date</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <button className="w-full px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm rounded-lg border border-gray-200 bg-white text-gray-700 flex items-center gap-1.5 sm:gap-2 hover:border-purple-300 hover:text-purple-700 transition-all">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                  <span className="truncate">{dateRange.from ? format(dateRange.from, "PP") : "Select start date"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-gray-200 rounded-xl" align="center">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                  className="text-gray-800 text-xs sm:text-sm scale-90 sm:scale-100 origin-top"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm font-medium text-gray-700">To Date</label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <button className="w-full px-2.5 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm rounded-lg border border-gray-200 bg-white text-gray-700 flex items-center gap-1.5 sm:gap-2 hover:border-purple-300 hover:text-purple-700 transition-all">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                  <span className="truncate">{dateRange.to ? format(dateRange.to, "PP") : "Select end date"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-gray-200 rounded-xl" align="center">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                  disabled={(date) => dateRange.from ? date < dateRange.from : false}
                  className="text-gray-800 text-xs sm:text-sm scale-90 sm:scale-100 origin-top"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Filter Summary */}
        {(dateRange.from || dateRange.to) && (
          <div className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs sm:text-sm text-purple-700 font-medium">
              {filteredData.length} record{filteredData.length !== 1 ? 's' : ''} found
            </div>
            <button
              onClick={clearFilters}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-purple-700 flex items-center gap-1 sm:gap-2 hover:bg-purple-100 rounded-md transition-all"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              Clear
            </button>
          </div>
        )}
      </div>

      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
        <Button 
          variant="outline" 
          onClick={() => setIsFilterDialogOpen(false)}
          className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
        >
          Cancel
        </Button>
        <Button 
          onClick={applyFilters}
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10 px-3 sm:px-4"
        >
          Apply Filters
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>



                      
                      <Separator orientation="vertical" className="h-12 bg-gray-300 hidden md:block" />
                    </div>
                  </div>
                </div>


                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Cash In  */}
                  <div className="metric-card p-4 space-y-2 border-emerald-200">
                    <div className="flex items-center justify-between">
                      <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
                      <div className="text-2xl">📥</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Inward </p>
                      <p className="text-2xl font-bold text-emerald-700">{bs.totalMetalIn.toFixed(3)}g</p>
                      <p className="text-xs text-gray-600">₹{(bs.totalValueIn).toFixed(3)}</p>
                    </div>
                  </div>


                  {/* Total Cash Out */}
                  <div className="metric-card p-4 space-y-2 border-rose-200">
                    <div className="flex items-center justify-between">
                      <ArrowUpFromLine className="h-5 w-5 text-rose-600" />
                      <div className="text-2xl">📤</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Outward</p>
                      <p className="text-2xl font-bold text-rose-700">{bs.totalMetalOut.toFixed(3)}g</p>
                      <p className="text-xs text-gray-600">₹{(bs.totalValueOut).toFixed(3)}</p>
                    </div>
                  </div>


                  {/* Net Position */}
                  <div className="metric-card p-4 space-y-2 border-blue-200">
                    <div className="flex items-center justify-between">
                      {bs.netPosition >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-orange-600" />
                      )}
                      <div className="text-2xl">{bs.netPosition >= 0 ? '📈' : '📉'}</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Closing Wt(916)</p>
                      <p className={`text-2xl font-bold ${bs.netPosition >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                        {bs.netPosition.toFixed(3)}g
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹{(bs.netValue).toFixed(3)}
                      </p>
                    </div>
                  </div>


                  {/* Pure Conversion */}
                  <div className="metric-card p-4 space-y-2 border-purple-200">
                    <div className="flex items-center justify-between">
                      <Scale className="h-5 w-5 text-purple-600" />
                      <div className="text-2xl">⚖️</div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Closing Wt(99.99%)</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {bs.pureConversion.toFixed(3)}kg
                      </p>
                      <p className="text-xs text-gray-600">
                        ₹{((bs.pureConversion * 1000 * bs.goldRate)).toFixed(3)}
                      </p>
                    </div>
                  </div>
                </div>


                {/* Transactions */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Inflows */}
                  <div className="glass-card p-6 flex flex-col max-h-[600px]">
                    <div className="flex items-center gap-3 flex-shrink-0 mb-4">
                      <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Inflows</h3>
                        <p className="text-xs text-gray-600">{bs.metalIn.length} transactions</p>
                      </div>
                    </div>


                    <div className="space-y-2 overflow-y-auto no-scrollbar flex-1">
                      {bs.metalIn.map((item, idx) => (
                        <div key={idx} className="transaction-item p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{item.icon}</span>
                              <span className="text-sm font-medium text-gray-800">{item.label}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">Weight</p>
                              <p className="font-semibold text-emerald-700">{item.weight.toFixed(3)}g</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600">Value</p>
                              <p className="font-semibold text-emerald-700">
                                ₹{(item.value).toFixed(3)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}


                      {/* Total */}
                      <div className="metric-card p-4 bg-gradient-to-r from-emerald-100/80 to-emerald-50/80 border-emerald-300 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">Total Inflows</span>
                          <div className="text-right">
                            <p className="font-bold text-emerald-700">{bs.totalMetalIn.toFixed(3)}g</p>
                            <p className="text-xs text-gray-600">₹{(bs.totalValueIn).toFixed(3)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Outflows */}
                  <div className="glass-card p-6 flex flex-col max-h-[600px]">
                    <div className="flex items-center gap-3 flex-shrink-0 mb-4">
                      <div className="h-10 w-1 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Outflows</h3>
                        <p className="text-xs text-gray-600">{bs.metalOut.length} transactions</p>
                      </div>
                    </div>


                    <div className="space-y-2 overflow-y-auto no-scrollbar flex-1">
                      {bs.metalOut.map((item, idx) => (
                        <div key={idx} className="transaction-item p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{item.icon}</span>
                              <span className="text-sm font-medium text-gray-800">{item.label}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-600">Weight</p>
                              <p className="font-semibold text-rose-700">{item.weight.toFixed(3)}g</p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600">Value</p>
                              <p className="font-semibold text-rose-700">
                                ₹{(item.value).toFixed(3)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}


                      {/* Total */}
                      <div className="metric-card p-4 bg-gradient-to-r from-rose-100/80 to-rose-50/80 border-rose-300 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">Total Outflows</span>
                          <div className="text-right">
                            <p className="font-bold text-rose-700">{bs.totalMetalOut.toFixed(3)}g</p>
                            <p className="text-xs text-gray-600">₹{(bs.totalValueOut).toFixed(3)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}


export default FundPlanningConReport;
