import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../../config/configData';
import {  Card,  CardContent,  CardDescription,  CardHeader,  CardTitle,} from '@/components/ui/card';
import {  ChartContainer,  ChartTooltip,  ChartTooltipContent,  ChartLegend,  ChartLegendContent,} from '@/components/ui/chart';
import {  BarChart,  Bar,  LineChart,  Line,  AreaChart,  Area,  PieChart,  Pie,  Cell,  CartesianGrid,  XAxis,  YAxis,  ResponsiveContainer,} from 'recharts';
import {  TrendingUp,  TrendingDown,  DollarSign,  Weight,  Package,  Calendar, } from 'lucide-react';

const FundPlanningDashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState('7d');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/summary_report/daily-fund-transfer-summary`);
      const responseData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setData(responseData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary metrics
  const getSummaryMetrics = () => {
    if (!data || data.length === 0) return null;

    const totalSales = data.reduce((sum, item) => sum + (item.TOTSALVAL || 0), 0);
    const totalGoldWeight = data.reduce((sum, item) => sum + (item.GOLDSALWGT || 0), 0);
    const totalNetSales = data.reduce((sum, item) => sum + (item.NET_SALES_WGT || 0), 0);
    const avgGoldRate = data.reduce((sum, item) => sum + (item.GOLD_SALE_RATE || 0), 0) / data.length;

    const prevTotal = data.slice(0, Math.floor(data.length / 2))
      .reduce((sum, item) => sum + (item.TOTSALVAL || 0), 0);
    const currentTotal = data.slice(Math.floor(data.length / 2))
      .reduce((sum, item) => sum + (item.TOTSALVAL || 0), 0);
    const trend = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

    return {
      totalSales,
      totalGoldWeight,
      totalNetSales,
      avgGoldRate,
      trend,
    };
  };

  const metrics = getSummaryMetrics();

  // Chart configurations
  const chartConfig = {
    sales: {
      label: 'Total Sales',
      color: 'hsl(var(--chart-1))',
    },
    goldWeight: {
      label: 'Gold Weight',
      color: 'hsl(var(--chart-2))',
    },
    netSales: {
      label: 'Net Sales Weight',
      color: 'hsl(var(--chart-3))',
    },
    goldRate: {
      label: 'Gold Rate',
      color: 'hsl(var(--chart-4))',
    },
  };

  // Prepare chart data
  const prepareChartData = () => {
    return data.slice(0, 10).map((item, index) => ({
      date: item.RPTDATE ? new Date(item.RPTDATE).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short' 
      }) : `Day ${index + 1}`,
      sales: item.TOTSALVAL || 0,
      goldWeight: item.GOLDSALWGT || 0,
      netSales: item.NET_SALES_WGT || 0,
      goldRate: item.GOLD_SALE_RATE || 0,
    }));
  };

  const chartData = prepareChartData();

  // Pie chart data for sales distribution
  const pieChartData = [
    { name: 'Gold Sales', value: metrics?.totalGoldWeight || 0, color: '#f59e0b' },
    { name: 'Digi Gold', value: data.reduce((sum, item) => sum + (item.DIGI_GOLD_WGT || 0), 0), color: '#3b82f6' },
    { name: 'Gold with Diamond', value: data.reduce((sum, item) => sum + (item.GO_WI_DIA_WGT || 0), 0), color: '#8b5cf6' },
    { name: 'Customer Order', value: data.reduce((sum, item) => sum + (item.CUS_ORD_WGT || 0), 0), color: '#10b981' },
  ].filter(item => item.value > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fund Planning Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Daily fund transfer and sales summary
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{metrics?.totalSales?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              {metrics?.trend >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+{metrics?.trend?.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{metrics?.trend?.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last period</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold Sales Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalGoldWeight?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}g
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total gold sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Sales Weight</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.totalNetSales?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}g
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              After adjustments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Gold Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{metrics?.avgGoldRate?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per gram
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sales Trend - Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Total sales value over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => `Date: ${value}`}
                      formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gold Weight - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gold Weight Analysis</CardTitle>
            <CardDescription>Gold and net sales weight comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `${value}g`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${Number(value).toFixed(2)}g`}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="goldWeight" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netSales" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Gold Rate Trend - Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gold Rate Fluctuation</CardTitle>
            <CardDescription>Daily gold rate changes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="goldRate"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales Distribution - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Distribution by Category</CardTitle>
            <CardDescription>Breakdown of gold sales types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `${Number(value).toFixed(2)}g`}
                    />
                  }
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest {data.slice(0, 5).length} records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Date</th>
                  <th className="text-right p-2 font-semibold">Total Sales</th>
                  <th className="text-right p-2 font-semibold">Gold Weight</th>
                  <th className="text-right p-2 font-semibold">Gold Rate</th>
                  <th className="text-right p-2 font-semibold">Net Sales</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      {item.RPTDATE ? new Date(item.RPTDATE).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="text-right p-2 font-mono">
                      ₹{(item.TOTSALVAL || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="text-right p-2 font-mono">
                      {(item.GOLDSALWGT || 0).toFixed(2)}g
                    </td>
                    <td className="text-right p-2 font-mono">
                      ₹{(item.GOLD_SALE_RATE || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="text-right p-2 font-mono">
                      {(item.NET_SALES_WGT || 0).toFixed(2)}g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundPlanningDashboard;
