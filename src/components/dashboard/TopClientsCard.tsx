
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const topClients = [
  { id: 1, name: "ABC Corporation", gpPercentage: 78, value: "$245,000" },
  { id: 2, name: "XYZ Industries", gpPercentage: 72, value: "$198,000" },
  { id: 3, name: "123 Services", gpPercentage: 65, value: "$145,000" },
  { id: 4, name: "Tech Solutions", gpPercentage: 58, value: "$112,000" },
];

export function TopClientsCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Top Clients GP%</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClients.map((client) => (
            <div key={client.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{client.name}</span>
                <span className="text-sm text-muted-foreground">{client.value}</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={client.gpPercentage} 
                  className="h-2"
                  indicatorClassName={
                    client.gpPercentage > 70 
                      ? "bg-green-500" 
                      : client.gpPercentage > 60 
                      ? "bg-blue-500" 
                      : "bg-amber-500"
                  }
                />
                <span className="text-xs font-medium">{client.gpPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
