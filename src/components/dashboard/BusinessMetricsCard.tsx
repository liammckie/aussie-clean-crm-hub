
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { AppLogger, LogCategory } from '@/utils/logging';
import { generateFinancialBreakdown, formatCurrency } from '@/utils/financeCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data - in a real application this would come from the API
const financialData = [
  { month: 'Jan', revenue: 65000, cost: 45000, profit: 20000 },
  { month: 'Feb', revenue: 72000, cost: 48000, profit: 24000 },
  { month: 'Mar', revenue: 80000, cost: 52000, profit: 28000 },
  { month: 'Apr', revenue: 85000, cost: 55000, profit: 30000 },
  { month: 'May', revenue: 92000, cost: 58000, profit: 34000 },
  { month: 'Jun', revenue: 95000, cost: 60000, profit: 35000 },
];

// Pipeline data
const pipelineData = [
  { name: "Jan", john: 4000, sarah: 2400, tom: 1600 },
  { name: "Feb", john: 3000, sarah: 1398, tom: 2210 },
  { name: "Mar", john: 2000, sarah: 9800, tom: 2290 },
  { name: "Apr", john: 2780, sarah: 3908, tom: 2000 },
  { name: "May", john: 1890, sarah: 4800, tom: 2181 },
  { name: "Jun", john: 2390, sarah: 3800, tom: 2500 },
];

export function BusinessMetricsCard() {
  const [activeTab, setActiveTab] = React.useState("performance");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['businessMetrics'],
    queryFn: async () => {
      // In a real application, you would fetch this data from an API
      AppLogger.debug(LogCategory.DATA, 'Fetching business metrics');
      
      // For now, using mock data with calculated profit values
      const data = [...financialData];
      
      // Calculate some aggregate metrics
      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
      const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
      const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
      const averageMargin = (totalProfit / totalRevenue) * 100;
      
      return {
        data,
        summary: {
          totalRevenue,
          totalCost,
          totalProfit,
          averageMargin
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Calculate weekly metrics based on monthly data
  const weeklyMetrics = React.useMemo(() => {
    if (!data) return { revenue: 0, cost: 0, profit: 0, marginPercentage: 0 };
    
    const monthlyAvgRevenue = data.summary.totalRevenue / 6; // 6 months of data
    const monthlyAvgCost = data.summary.totalCost / 6;
    const weeklyRevenue = monthlyAvgRevenue / 4.33; // Approximate weeks per month
    const weeklyCost = monthlyAvgCost / 4.33;
    
    return generateFinancialBreakdown(weeklyRevenue, weeklyCost).weekly;
  }, [data]);
  
  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Business Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Business Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            {error instanceof Error ? error.message : 'Error loading business metrics'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="col-span-4">
      <CardHeader className="pb-2">
        <CardTitle>Business Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-2xl font-semibold text-muted-foreground">{formatCurrency(data.summary.totalCost)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Profit</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(data.summary.totalProfit)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Average Margin</p>
            <p className="text-2xl font-bold text-green-600">{data.summary.averageMargin.toFixed(1)}%</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value) => [`${formatCurrency(value as number)}`, undefined]}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" />
                <Bar dataKey="cost" name="Cost" fill="#94a3b8" />
                <Bar dataKey="profit" name="Profit" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="pipeline" className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={pipelineData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorJohn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSarah" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                  itemStyle={{ color: "#e2e8f0" }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Legend />
                <Area type="monotone" dataKey="john" name="John" stroke="#8884d8" fillOpacity={1} fill="url(#colorJohn)" />
                <Area type="monotone" dataKey="sarah" name="Sarah" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSarah)" />
                <Area type="monotone" dataKey="tom" name="Tom" stroke="#ffc658" fillOpacity={1} fill="url(#colorTom)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
