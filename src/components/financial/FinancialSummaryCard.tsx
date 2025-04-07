
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/utils/financeCalculations';

interface FinancialMetric {
  revenue: number;
  cost: number;
  profit: number;
  marginPercentage: number;
}

interface FinancialSummaryCardProps {
  title: string;
  description?: string;
  weekly: FinancialMetric;
  monthly: FinancialMetric;
  annual: FinancialMetric;
  className?: string;
  showTabs?: boolean;
  initialView?: 'weekly' | 'monthly' | 'annual';
  loading?: boolean;
}

export function FinancialSummaryCard({
  title,
  description,
  weekly,
  monthly,
  annual,
  className = '',
  showTabs = true,
  initialView = 'monthly',
  loading = false
}: FinancialSummaryCardProps) {
  
  const renderMetrics = (data: FinancialMetric) => {
    const isPositiveMargin = data.marginPercentage >= 0;
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="text-2xl font-bold">{formatCurrency(data.revenue)}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Cost</p>
          <p className="text-2xl font-semibold text-muted-foreground">
            {formatCurrency(data.cost)}
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Profit</p>
          <p className={`text-xl font-bold ${data.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.profit)}
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Margin</p>
          <div className="flex items-center">
            {isPositiveMargin ? (
              <ArrowUpIcon className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span className={`text-xl font-bold ${isPositiveMargin ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.marginPercentage)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!showTabs) {
    // If not showing tabs, just render the monthly view
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
        <CardContent>
          {renderMetrics(initialView === 'weekly' ? weekly : initialView === 'annual' ? annual : monthly)}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSignIcon className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={initialView}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            {renderMetrics(weekly)}
          </TabsContent>
          <TabsContent value="monthly">
            {renderMetrics(monthly)}
          </TabsContent>
          <TabsContent value="annual">
            {renderMetrics(annual)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
