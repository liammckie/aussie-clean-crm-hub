
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { name: "Profit", value: 68 },
  { name: "Costs", value: 32 },
];

const COLORS = ["#22c55e", "#334155"];

export function NetProfitCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Net Profit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="text-3xl font-bold flex items-center gap-2">
            $842,000
            <div className="flex items-center text-sm text-green-500 font-normal">
              <TrendingUp className="h-4 w-4 mr-1" />
              +14%
            </div>
          </div>
        </div>
        <div className="h-[200px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <div className="text-4xl font-bold">68%</div>
            <div className="text-sm text-muted-foreground">Profit Margin</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
