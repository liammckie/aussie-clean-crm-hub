
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Opportunity } from '@/types/sales-types';
import { formatCurrency } from '@/utils/formatters';
import { Award, TrendingUp, User } from 'lucide-react';

interface SalesLeaderboardProps {
  opportunities: Opportunity[];
  isLoading: boolean;
}

interface LeaderboardEntry {
  name: string;
  value: number;
  count: number;
}

export function SalesLeaderboard({ opportunities, isLoading }: SalesLeaderboardProps) {
  // Calculate leaderboard data by assigned_to
  const calculateLeaderboard = (): LeaderboardEntry[] => {
    const salespeople: Record<string, { value: number; count: number }> = {};
    
    opportunities.forEach(opp => {
      if (opp.assigned_to) {
        if (!salespeople[opp.assigned_to]) {
          salespeople[opp.assigned_to] = { value: 0, count: 0 };
        }
        
        // Only count opportunities that are not closed lost
        if (opp.stage !== 'CLOSED_LOST') {
          salespeople[opp.assigned_to].value += opp.value;
          salespeople[opp.assigned_to].count += 1;
        }
      }
    });
    
    return Object.entries(salespeople)
      .map(([name, stats]) => ({
        name,
        value: stats.value,
        count: stats.count
      }))
      .sort((a, b) => b.value - a.value);
  };
  
  // Calculate win rate by assigned_to
  const calculateWinRates = (): LeaderboardEntry[] => {
    const salespeople: Record<string, { won: number; total: number }> = {};
    
    opportunities.forEach(opp => {
      if (opp.assigned_to) {
        if (!salespeople[opp.assigned_to]) {
          salespeople[opp.assigned_to] = { won: 0, total: 0 };
        }
        
        // Only count closed opportunities
        if (opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST') {
          salespeople[opp.assigned_to].total += 1;
          if (opp.stage === 'CLOSED_WON') {
            salespeople[opp.assigned_to].won += 1;
          }
        }
      }
    });
    
    return Object.entries(salespeople)
      .map(([name, stats]) => ({
        name,
        value: stats.total > 0 ? (stats.won / stats.total) * 100 : 0,
        count: stats.total
      }))
      .sort((a, b) => b.value - a.value);
  };
  
  const leaderboard = calculateLeaderboard();
  const winRates = calculateWinRates();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="pipeline">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline Value</TabsTrigger>
          <TabsTrigger value="win-rate">Win Rate</TabsTrigger>
          <TabsTrigger value="quotes">Quotes Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Sales Pipeline Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No sales data available
                  </p>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div 
                        key={entry.name} 
                        className={`flex items-center p-3 rounded-lg ${
                          index === 0 ? 'bg-amber-50' : 
                          index === 1 ? 'bg-slate-50' : 
                          index === 2 ? 'bg-orange-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm mr-3">
                          {index === 0 ? (
                            <Award className="h-4 w-4 text-amber-500" />
                          ) : index === 1 ? (
                            <Award className="h-4 w-4 text-slate-400" />
                          ) : index === 2 ? (
                            <Award className="h-4 w-4 text-orange-400" />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.count} opportunities
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(entry.value)}</div>
                          <div className="text-xs text-muted-foreground">
                            Pipeline Value
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Performers</CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.slice(0, 3).length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No data available
                  </p>
                ) : (
                  <div className="space-y-6">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                      <div key={entry.name} className="text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                          index === 0 ? 'bg-amber-100 text-amber-800' : 
                          index === 1 ? 'bg-slate-100 text-slate-800' : 
                          'bg-orange-100 text-orange-800'
                        }`}>
                          <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="mt-2 font-medium">{entry.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(entry.value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="win-rate" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Win Rate Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              {winRates.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No closed deals data available
                </p>
              ) : (
                <div className="space-y-2">
                  {winRates.map((entry, index) => (
                    <div key={entry.name} className="flex items-center p-3 rounded-lg bg-gray-50">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm mr-3">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {entry.count} closed deals
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{entry.value.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">
                          Win rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes" className="pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quotes Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Quote tracking coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
