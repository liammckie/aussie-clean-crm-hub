
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/financeCalculations';

interface FinancialMetricsProps {
  totalSites: number;
  annualRevenue: number;
  annualCost: number;
  grossProfit: number;
  grossProfitMargin: number;
  isLoading?: boolean;
}

export function ClientFinancialMetrics({ 
  totalSites, 
  annualRevenue, 
  annualCost, 
  grossProfit, 
  grossProfitMargin,
  isLoading = false
}: FinancialMetricsProps) {
  
  if (isLoading) {
    return (
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Active Sites</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{totalSites}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(annualRevenue)}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Annual Cost</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-muted-foreground">{formatCurrency(annualCost)}</p>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Gross Profit</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-green-600">{formatCurrency(grossProfit)}</p>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {formatPercentage(grossProfitMargin, 1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
