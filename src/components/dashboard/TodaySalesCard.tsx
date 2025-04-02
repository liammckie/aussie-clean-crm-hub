
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Users, FileCheck } from "lucide-react";

export function TodaySalesCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Today's Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">$24,500</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">+12%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Quotes</span>
              </div>
              <p className="text-sm font-medium">14</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Signed</span>
              </div>
              <p className="text-sm font-medium">7</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-500" />
                <span className="text-xs text-muted-foreground">New Clients</span>
              </div>
              <p className="text-sm font-medium">3</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground">Declined</span>
              </div>
              <p className="text-sm font-medium">2</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
