import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config/configData";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  CalendarIcon, 
  X, 
  Filter,
  Sparkles,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";
import { format } from "date-fns";
import {BarChart, Bar,LineChart,Line,AreaChart, Area, PieChart, Pie, Cell,XAxis, 
  YAxis, CartesianGrid,Tooltip,Legend, ResponsiveContainer,ComposedChart} from "recharts";

function SalesReportChart() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined
  });
  const [showFilters, setShowFilters] = useState(false);

  // Colors for charts
  const COLORS = {
    inflow: '#10b981',
    outflow: '#f43f5e',
    net: '#3b82f6',
    categories: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#84cc16']
  };

  // Set default date range to last 7 days
  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // Last 7 days including today
    
    setDateRange({
      from: sevenDaysAgo,
      to: today
    });
  }, []);

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
      } catch (error) {
        // console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchFundPlanningDetails();
  }, []);

  useEffect(() => {
    if (!dateRange.from && !dateRange.to) {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
      
      const filtered = data.filter(record => {
        const recordDate = new Date(record.RPTDATE);
        return recordDate >= sevenDaysAgo && recordDate <= today;
      });
      
      setFilteredData(filtered.sort((a, b) => new Date(a.RPTDATE) - new Date(b.RPTDATE)));
      return;
    }

    const filtered = data.filter(record => {
      const recordDate = new Date(record.RPTDATE);
      
      if (dateRange.from && dateRange.to) {
        return recordDate >= dateRange.from && recordDate <= dateRange.to;
      } else if (dateRange.from) {
        return recordDate >= dateRange.from;
      } else if (dateRange.to) {
        return recordDate <= dateRange.to;
      }
      
      return true;
    });

    setFilteredData(filtered.sort((a, b) => new Date(a.RPTDATE) - new Date(b.RPTDATE)));
  }, [dateRange, data]);

  const clearFilters = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    
    setDateRange({ 
      from: sevenDaysAgo, 
      to: today 
    });
  };

  const handleQuickFilter = (days) => {
    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - (days - 1));
    
    setDateRange({
      from: fromDate,
      to: today
    });
  };

  // Transform data for trend charts
  const getTrendData = () => {
    return filteredData.map(record => {
      const goldSaleRate = record.GOLD_SALE_RATE || 1;
      
      const totalInflowWeight = 
        (record.GOLDSALWGT || 0) +
        (record.CHIT_TRN_VAL || 0) / goldSaleRate +
        (record.CUS_ADV_WGT || 0) +
        (record.CUS_ADV_RATE_FIX_WGT || 0) +
        (record.NIDHI_VAL || 0) / goldSaleRate +
        (record.DIGI_GOLD_WGT || 0) +
        (record.CUS_ORD_WGT || 0);

      const totalOutflowWeight = 
        (record.OG_WGT_GRAM || 0) +
        (record.CHIT_CLOSE_VAL || 0) / goldSaleRate;

      const netPosition = totalInflowWeight - totalOutflowWeight;

      return {
        date: format(new Date(record.RPTDATE), 'MM/dd'),
        fullDate: record.RPTDATE,
        inflow: parseFloat(totalInflowWeight.toFixed(2)),
        outflow: parseFloat(totalOutflowWeight.toFixed(2)),
        net: parseFloat(netPosition.toFixed(2)),
        inflowValue: parseFloat((totalInflowWeight * goldSaleRate).toFixed(2)),
        outflowValue: parseFloat((totalOutflowWeight * goldSaleRate).toFixed(2)),
        goldRate: goldSaleRate
      };
    });
  };

  // Get category-wise breakdown (aggregated)
  const getCategoryBreakdown = () => {
    const categories = {
      'Gold Sales': 0,
      'Chit Transaction': 0,
      'Customer Advance': 0,
      'Advance Rate Fix': 0,
      'Nidhi': 0,
      'Digi Gold': 0,
      'Customer Order': 0,
      'Old Gold': 0,
      'Chit Closing': 0
    };

    filteredData.forEach(record => {
      const goldSaleRate = record.GOLD_SALE_RATE || 1;
      categories['Gold Sales'] += record.GOLDSALWGT || 0;
      categories['Chit Transaction'] += (record.CHIT_TRN_VAL || 0) / goldSaleRate;
      categories['Customer Advance'] += record.CUS_ADV_WGT || 0;
      categories['Advance Rate Fix'] += record.CUS_ADV_RATE_FIX_WGT || 0;
      categories['Nidhi'] += (record.NIDHI_VAL || 0) / goldSaleRate;
      categories['Digi Gold'] += record.DIGI_GOLD_WGT || 0;
      categories['Customer Order'] += record.CUS_ORD_WGT || 0;
      categories['Old Gold'] += record.OG_WGT_GRAM || 0;
      categories['Chit Closing'] += (record.CHIT_CLOSE_VAL || 0) / goldSaleRate;
    });

    const inflowCategories = Object.entries(categories)
      .slice(0, 7)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        type: 'inflow'
      }));

    const outflowCategories = Object.entries(categories)
      .slice(7)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        type: 'outflow'
      }));

    return { inflowCategories, outflowCategories };
  };

  // Get summary statistics
  const getSummaryStats = () => {
    const trendData = getTrendData();
    const totalInflow = trendData.reduce((sum, item) => sum + item.inflow, 0);
    const totalOutflow = trendData.reduce((sum, item) => sum + item.outflow, 0);
    const totalNet = totalInflow - totalOutflow;
    const avgInflow = totalInflow / trendData.length;
    const avgOutflow = totalOutflow / trendData.length;
    const avgGoldRate = trendData.reduce((sum, item) => sum + item.goldRate, 0) / trendData.length;

    return {
      totalInflow: totalInflow.toFixed(2),
      totalOutflow: totalOutflow.toFixed(2),
      totalNet: totalNet.toFixed(2),
      avgInflow: avgInflow.toFixed(2),
      avgOutflow: avgOutflow.toFixed(2),
      avgGoldRate: avgGoldRate.toFixed(2),
      totalInflowValue: (totalInflow * avgGoldRate).toFixed(2),
      totalOutflowValue: (totalOutflow * avgGoldRate).toFixed(2),
      days: trendData.length
    };
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-gray-300">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}g
            </p>
          ))}
        </div>
      );
    }
    return null;
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

  const trendData = getTrendData();
  const { inflowCategories, outflowCategories } = getCategoryBreakdown();
  const stats = getSummaryStats();

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
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="flex items-center justify-center gap-3">
            <BarChart3 className="h-10 w-10 text-purple-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Consolidated Metal Analytics Report
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Multi-day trend analysis and category breakdown
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="glass-card glass-card-hover px-6 py-3 text-gray-700 font-medium flex items-center gap-2 hover:text-purple-700"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-600" />
              Date Range Filter
            </h3>
            
            {/* Quick Filters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { label: '7 Days', days: 7 },
                { label: '14 Days', days: 14 },
                { label: '30 Days', days: 30 },
                { label: '90 Days', days: 90 },
              ].map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => handleQuickFilter(filter.days)}
                  className="glass-card glass-card-hover px-4 py-2 text-sm text-gray-700 font-medium hover:text-purple-700"
                >
                  {filter.label}
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="glass-card glass-card-hover px-4 py-2 text-sm text-gray-700 font-medium hover:text-purple-700"
              >
                Reset
              </button>
            </div>

            <Separator className="bg-gray-300" />

            {/* Date Pickers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">From Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="glass-card w-full px-4 py-3 text-left text-sm text-gray-700 flex items-center gap-2 hover:text-purple-700">
                      <CalendarIcon className="h-4 w-4 text-purple-600" />
                      {dateRange.from ? format(dateRange.from, "PPP") : "Select start date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      className="text-gray-800"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">To Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="glass-card w-full px-4 py-3 text-left text-sm text-gray-700 flex items-center gap-2 hover:text-purple-700">
                      <CalendarIcon className="h-4 w-4 text-purple-600" />
                      {dateRange.to ? format(dateRange.to, "PPP") : "Select end date"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border-gray-200">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      disabled={(date) => dateRange.from ? date < dateRange.from : false}
                      className="text-gray-800"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="text-sm text-purple-700 font-medium">
              Showing {stats.days} day{stats.days !== 1 ? 's' : ''} of data
            </div>
          </div>
        )}

        {/* Summary Statistics Cards */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card p-5 border-emerald-300">
            <div className="flex items-center justify-between mb-2">
              <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Total Cash In </p>
            <p className="text-2xl font-bold text-emerald-700">{stats.totalInflow}g</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {stats.avgInflow}g/day</p>
          </div>

          <div className="metric-card p-5 border-rose-300">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpFromLine className="h-5 w-5 text-rose-600" />
              <TrendingDown className="h-4 w-4 text-rose-500" />
            </div>
            <p className="text-xs text-gray-600 mb-1">Total Cash Out</p>
            <p className="text-2xl font-bold text-rose-700">{stats.totalOutflow}g</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {stats.avgOutflow}g/day</p>
          </div>

          <div className={`metric-card p-5 ${parseFloat(stats.totalNet) >= 0 ? 'border-blue-300' : 'border-orange-300'}`}>
            <div className="flex items-center justify-between mb-2">
              {parseFloat(stats.totalNet) >= 0 ? (
                <TrendingUp className="h-5 w-5 text-blue-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1">Closing Wt</p>
            <p className={`text-2xl font-bold ${parseFloat(stats.totalNet) >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
              {parseFloat(stats.totalNet) >= 0 ? '+' : ''}{stats.totalNet}g
            </p>
            <p className="text-xs text-gray-500 mt-1">{stats.days} days</p>
          </div>

          <div className="metric-card p-5 border-purple-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-xs text-gray-600 mb-1"> Gold Rate</p>
            <p className="text-2xl font-bold text-purple-700">₹{parseFloat(stats.avgGoldRate).toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">per gram</p>
          </div>
        </div> */}

        {/* Main Charts Section */}
        {filteredData.length > 0 && (
          <div className="space-y-6">
            {/* Daily Trend Line Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <LineChartIcon className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Daily Trend Analysis</h3>
                  <p className="text-xs text-gray-600">Cash In , Cash Out & Closing Wt over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="inflow" 
                    stroke={COLORS.inflow} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Cash In "
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outflow" 
                    stroke={COLORS.outflow} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Cash Out"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke={COLORS.net} 
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Closing Wt"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stacked Area Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Cumulative Flow Analysis</h3>
                  <p className="text-xs text-gray-600">Stacked view of inflows and outflows</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="inflow" 
                    stackId="1"
                    stroke={COLORS.inflow} 
                    fill={COLORS.inflow}
                    fillOpacity={0.6}
                    name="Cash In "
                  />
                  <Area 
                    type="monotone" 
                    dataKey="outflow" 
                    stackId="2"
                    stroke={COLORS.outflow} 
                    fill={COLORS.outflow}
                    fillOpacity={0.6}
                    name="Cash Out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cash In  Categories Pie Chart */}
              {inflowCategories.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <PieChartIcon className="h-6 w-6 text-emerald-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Cash In  Distribution</h3>
                      <p className="text-xs text-gray-600">Category-wise breakdown</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={inflowCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inflowCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.categories[index % COLORS.categories.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Cash Out Categories Bar Chart */}
              {outflowCategories.length > 0 && (
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="h-6 w-6 text-rose-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Cash Out Distribution</h3>
                      <p className="text-xs text-gray-600">Category-wise breakdown</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={outflowCategories}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }}
                        width={90}
                      />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                        {outflowCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS.outflow} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Combined Category Comparison */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Daily Comparison by Date</h3>
                  <p className="text-xs text-gray-600">Cash In  vs Cash Out comparison</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={trendData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="inflow" fill={COLORS.inflow} name="Cash In " radius={[8, 8, 0, 0]} />
                  <Bar dataKey="outflow" fill={COLORS.outflow} name="Cash Out" radius={[8, 8, 0, 0]} />
                  <Line 
                    type="monotone" 
                    dataKey="net" 
                    stroke={COLORS.net} 
                    strokeWidth={3}
                    name="Closing Wt"
                    dot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Data Table Summary */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Daily Summary Table</h3>
                  <p className="text-xs text-gray-600">Detailed breakdown by date</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Date</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-800">Cash In  (g)</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-800">Cash Out (g)</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-800">Net (g)</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-800">Gold Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {trendData.map((item, index) => (
                      <tr key={index} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3 text-gray-800 font-medium">{item.fullDate}</td>
                        <td className="px-4 py-3 text-right text-emerald-700 font-semibold">{item.inflow}</td>
                        <td className="px-4 py-3 text-right text-rose-700 font-semibold">{item.outflow}</td>
                        <td className={`px-4 py-3 text-right font-bold ${item.net >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                          {item.net >= 0 ? '+' : ''}{item.net}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">₹{item.goldRate.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="bg-gradient-to-r from-purple-100 to-pink-100 font-bold">
                      <td className="px-4 py-3 text-gray-800">TOTAL / AVG</td>
                      <td className="px-4 py-3 text-right text-emerald-700">{stats.totalInflow}</td>
                      <td className="px-4 py-3 text-right text-rose-700">{stats.totalOutflow}</td>
                      <td className={`px-4 py-3 text-right ${parseFloat(stats.totalNet) >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                        {parseFloat(stats.totalNet) >= 0 ? '+' : ''}{stats.totalNet}
                      </td>
                      <td className="px-4 py-3 text-right text-purple-700">₹{parseFloat(stats.avgGoldRate).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Records Found</h3>
            <p className="text-gray-600 text-sm">Try adjusting your date filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesReportChart;
