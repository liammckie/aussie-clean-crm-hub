
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CashFlowProjection, formatProjectionDate } from '@/utils/cashFlowProjections';
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

interface CashFlowProjectionCardProps {
  title: string;
  description?: string;
  projection: CashFlowProjection;
  className?: string;
}

export function CashFlowProjectionCard({
  title,
  description,
  projection,
  className = '',
}: CashFlowProjectionCardProps) {
  const [view, setView] = useState<'chart' | 'table'>('table');
  const [projectionPeriod, setProjectionPeriod] = useState<string>('6');
  
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
            <div className="flex items-center justify-center h-80 bg-slate-50 dark:bg-slate-900 rounded-md">
              <p className="text-muted-foreground text-center">
                Cash flow visualization chart will be implemented in the next phase.
                <br />
                <span className="text-sm">
                  (Will use Recharts library to visualize cash flow data)
                </span>
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
