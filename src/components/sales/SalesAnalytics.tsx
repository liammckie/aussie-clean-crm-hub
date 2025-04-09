
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Opportunity } from '@/types/sales-types';
import { formatCurrency } from '@/utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface SalesAnalyticsProps {
  opportunities: Opportunity[];
  isLoading: boolean;
}

export function SalesAnalytics({ opportunities, isLoading }: SalesAnalyticsProps) {
  // Calculate pipeline by stage
  const calculatePipelineByStage = () => {
    const stages: Record<string, number> = {
      'LEAD': 0,
      'QUALIFIED': 0,
      'PROPOSAL': 0,
      'NEGOTIATION': 0,
      'CLOSED_WON': 0,
      'CLOSED_LOST': 0
    };
    
    opportunities.forEach(opp => {
      stages[opp.stage] += opp.value;
    });
    
    return Object.entries(stages).map(([name, value]) => ({
      name: name.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      value
    }));
  };
  
  // Calculate win/loss ratio
  const calculateWinLossRatio = () => {
    const closed = opportunities.filter(opp => 
      opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST'
    );
    
    const won = closed.filter(opp => opp.stage === 'CLOSED_WON');
    
    return [
      { name: 'Won', value: won.length },
      { name: 'Lost', value: closed.length - won.length }
    ];
  };
  
  // Calculate pipeline forecast
  const calculateForecast = () => {
    // Group by month for the next 6 months
    const today = new Date();
    const forecast: Record<string, number> = {};
    
    // Initialize the next 6 months
    for (let i = 0; i < 6; i++) {
      const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthKey = month.toLocaleString('default', { month: 'short', year: '2-digit' });
      forecast[monthKey] = 0;
    }
    
    // Add opportunity values weighted by probability
    opportunities.forEach(opp => {
      if (opp.stage !== 'CLOSED_LOST' && opp.stage !== 'CLOSED_WON') {
        const closeDate = new Date(opp.expected_close_date);
        const monthKey = closeDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        
        // Only add if it's in our forecast window
        if (forecast[monthKey] !== undefined) {
          forecast[monthKey] += opp.value * (opp.probability / 100);
        }
      }
    });
    
    return Object.entries(forecast).map(([month, value]) => ({
      month,
      value
    }));
  };
  
  const pipelineByStage = calculatePipelineByStage();
  const winLossRatio = calculateWinLossRatio();
  const forecast = calculateForecast();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ef4444'];
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Calculate total pipeline value
  const totalPipeline = opportunities
    .filter(opp => opp.stage !== 'CLOSED_LOST')
    .reduce((sum, opp) => sum + opp.value, 0);
  
  // Calculate weighted pipeline value
  const weightedPipeline = opportunities
    .filter(opp => opp.stage !== 'CLOSED_LOST')
    .reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalPipeline)}</div>
            <p className="text-muted-foreground">
              Weighted: {formatCurrency(weightedPipeline)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Ratio</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossRatio}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {winLossRatio.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="ml-4">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div>
                <div>Won: {winLossRatio[0]?.value || 0}</div>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-[#ef4444] rounded-full mr-2"></div>
                <div>Lost: {winLossRatio[1]?.value || 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineByStage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                <Bar dataKey="value" fill="#8884d8">
                  {pipelineByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>6-Month Forecast (Probability Weighted)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
