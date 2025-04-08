
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CashFlowProjection, formatProjectionDate, generateCashFlowProjection } from '@/utils/cashFlowProjections';
import { formatCurrency } from '@/utils/financeCalculations';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface CashFlowProjectionCardProps {
  title: string;
  description?: string;
  projection: CashFlowProjection;
  contractData?: any;
  className?: string;
}

export function CashFlowProjectionCard({
  title,
  description,
  projection: initialProjection,
  contractData,
  className = '',
}: CashFlowProjectionCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('table');
  const [projectionPeriod, setProjectionPeriod] = useState<string>('6');
  
  // Regenerate the projection when period changes
  const projection = useMemo(() => {
    if (!contractData) return initialProjection;
    
    return generateCashFlowProjection(
      contractData,
      parseInt(projectionPeriod, 10)
    );
  }, [contractData, projectionPeriod, initialProjection]);
  
  // Prepare data for chart
  const chartData = useMemo(() => {
    // Group by month for better visualization
    const monthlyData = new Map();
    
    projection.entries.forEach(entry => {
      const month = new Date(entry.date).toLocaleString('en-AU', { month: 'short', year: 'numeric' });
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, {
          month,
          incoming: 0,
          outgoing: 0,
          balance: 0,
          date: new Date(entry.date)
        });
      }
      
      const data = monthlyData.get(month);
      data.incoming += entry.incoming;
      data.outgoing += entry.outgoing;
      
      // The last balance value for the month will be the correct one
      if (entry.balance !== 0) {
        data.balance = entry.balance;
      }
    });
    
    // Sort by date
    return Array.from(monthlyData.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [projection.entries]);
  
  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Incoming', 'Outgoing', 'Balance'];
    const csvRows = [headers];

    projection.entries.forEach(entry => {
      csvRows.push([
        formatProjectionDate(entry.date, true),
        entry.description,
        entry.incoming.toString(),
        entry.outgoing.toString(),
        entry.balance.toString()
      ]);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    
    // Create and download blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `cash_flow_projection_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Configuration for the chart
  const chartConfig = {
    incoming: { label: "Revenue", color: "#22c55e" },
    outgoing: { label: "Costs", color: "#ef4444" },
    balance: { label: "Balance", color: "#3b82f6" },
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Select value={projectionPeriod} onValueChange={setProjectionPeriod}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleDownloadCSV} title="Download CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Projected Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(projection.totalIncoming)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Projected Costs</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(projection.totalOutgoing)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Net Cash Flow</p>
            <div className="flex items-center">
              {projection.netCashFlow >= 0 ? (
                <ArrowUpIcon className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-2xl font-bold ${
                  projection.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(projection.netCashFlow)}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="table" onValueChange={(v) => setView(v as 'chart' | 'table')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableCaption>
                  Cash flow projection from {formatProjectionDate(projection.projectionStart)} to{' '}
                  {formatProjectionDate(projection.projectionEnd)}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Incoming</TableHead>
                    <TableHead className="text-right">Outgoing</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projection.entries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatProjectionDate(entry.date)}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {entry.incoming > 0 ? formatCurrency(entry.incoming) : '-'}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        {entry.outgoing > 0 ? formatCurrency(entry.outgoing) : '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          entry.balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(entry.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="chart">
            <ChartContainer className="h-80" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickMargin={10}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    width={60}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#666" />
                  <Line
                    type="monotone"
                    dataKey="incoming"
                    stroke={chartConfig.incoming.color}
                    name="Revenue"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke={chartConfig.outgoing.color}
                    name="Costs"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={chartConfig.balance.color}
                    name="Balance"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
