// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Brush
// } from 'recharts';
// import { API,ChartAPI } from '../../../config/configData';

// const RatesChart = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRetailRate = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get(`${ChartAPI}/dailyrate/retailrates/charts`);
//         setData(response.data);
//       } catch (error) {
//         setError('Failed to fetch rate data');
//         console.error('Error fetching retail rates:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRetailRate();
//   }, []);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 border border-gray-200 shadow-lg rounded">
//           <p className="font-bold text-gray-700">{`Date: ${label}`}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {`${entry.name}: ${entry.value.toLocaleString()}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const ChartComponent = ({ dataKey, color, name }) => (
//     <div className="w-full h-[600px] bg-white p-4 rounded-lg shadow mb-6">
//       {isLoading ? (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-gray-600">Loading chart data...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center h-full">
//           <p className="text-red-600">{error}</p>
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height="100%">
//           <AreaChart
//             data={data}
//             margin={{
//               top: 20,
//               right: 30,
//               left: 50,
//               bottom: 60
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//             <XAxis
//               dataKey="date"
//               angle={-45}
//               textAnchor="end"
//               height={60}
//               tick={{ fill: '#666' }}
//             />
//             <YAxis
//               domain={['auto', 'auto']}
//               tickFormatter={(value) => value.toLocaleString()}
//               tick={{ fill: '#666' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend
//               verticalAlign="top"
//               height={36}
//             />
//             <Brush
//               dataKey="date"
//               height={30}
//               stroke="#8884d8"
//               startIndex={Math.max(0, data.length - 30)}
//             />
//             <Area
//               type="monotone"
//               dataKey={dataKey}
//               stroke={color}
//               fill={color}
//               fillOpacity={0.2}
//               name={name}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-10">
//       <ChartComponent dataKey="goldRate" color="#FFD700" name="Gold Rate" />
//       <ChartComponent dataKey="silverRate" color="#C0C0C0" name="Silver Rate" />
//     </div>
//   );
// };

// export default RatesChart;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { ChartAPI } from '../../../config/configData';
// Replace with your actual API configuration

const RatesChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('both');

  useEffect(() => {
    const fetchRetailRate = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${ChartAPI}/dailyrate/retailrates/charts`);
        setData(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch rate data. Please try again later.');
        // console.error('Error fetching retail rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetailRate();
  }, []);

  const getLatestRate = (dataKey) => {
    if (data.length === 0) return null;
    return data[data.length - 1][dataKey];
  };

  const getRateChange = (dataKey) => {
    if (data.length < 2) return { value: 0, percentage: 0 };
    const latest = data[data.length - 1][dataKey];
    const previous = data[data.length - 2][dataKey];
    const change = latest - previous;
    const percentage = ((change / previous) * 100).toFixed(2);
    return { value: change, percentage };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border shadow-lg rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="font-semibold text-card-foreground">{label}</p>
          </div>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium" style={{ color: entry.color }}>
                  {entry.name}:
                </span>
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  ₹{entry.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, rate, change, color, icon: Icon }) => (
    <Card className="border-l-4" style={{ borderLeftColor: color }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">₹{rate?.toLocaleString()}</div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              change.value >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change.value >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {change.value >= 0 ? '+' : ''}{change.value.toFixed(2)} ({change.percentage}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ChartComponent = ({ dataKey, color, name, description, showInView }) => {
    if (!showInView) return null;

    return (
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] md:h-[500px] lg:h-[600px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 60
                }}
              >
                <defs>
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  className="text-xs text-muted-foreground"
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  className="text-xs text-muted-foreground"
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Brush
                  dataKey="date"
                  height={30}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.1}
                  startIndex={Math.max(0, data.length - 30)}
                  tickFormatter={(value) => value.slice(0, 10)}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#gradient-${dataKey})`}
                  name={name}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive">
          <AlertDescription className="flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const goldRate = getLatestRate('goldRate');
  const silverRate = getLatestRate('silverRate');
  const goldChange = getRateChange('goldRate');
  const silverChange = getRateChange('silverRate');

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <StatCard
          title="Current Gold Rate"
          rate={goldRate}
          change={goldChange}
          color="#FFD700"
          icon={() => <div className="w-5 h-5 rounded-full bg-yellow-500" />}
        />
        <StatCard
          title="Current Silver Rate"
          rate={silverRate}
          change={silverChange}
          color="#C0C0C0"
          icon={() => <div className="w-5 h-5 rounded-full bg-gray-400" />}
        />
      </div>

      {/* Charts with Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="both">Both Rates</TabsTrigger>
          <TabsTrigger value="gold">Gold Only</TabsTrigger>
          <TabsTrigger value="silver">Silver Only</TabsTrigger>
        </TabsList>

        <TabsContent value="both" className="space-y-6">
          <ChartComponent 
            dataKey="goldRate" 
            color="#FFD700" 
            name="Gold Rate" 
            description="Daily gold rate fluctuations over time"
            showInView={true}
          />
          <ChartComponent 
            dataKey="silverRate" 
            color="#C0C0C0" 
            name="Silver Rate" 
            description="Daily silver rate fluctuations over time"
            showInView={true}
          />
        </TabsContent>

        <TabsContent value="gold">
          <ChartComponent 
            dataKey="goldRate" 
            color="#FFD700" 
            name="Gold Rate" 
            description="Daily gold rate fluctuations over time"
            showInView={true}
          />
        </TabsContent>

        <TabsContent value="silver">
          <ChartComponent 
            dataKey="silverRate" 
            color="#C0C0C0" 
            name="Silver Rate" 
            description="Daily silver rate fluctuations over time"
            showInView={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RatesChart;