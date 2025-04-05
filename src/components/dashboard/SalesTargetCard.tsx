
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import { XAxis, YAxis } from "@/components/ui/sidebar/components/chart-wrappers";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const data = [
  { name: "Jan", target: 4000, actual: 2400 },
  { name: "Feb", target: 3000, actual: 2980 },
  { name: "Mar", target: 2000, actual: 2800 },
  { name: "Apr", target: 2780, actual: 3908 },
  { name: "May", target: 1890, actual: 4800 },
  { name: "Jun", target: 2390, actual: 3800 },
];

const chartConfig = {
  target: {
    label: "Target",
    color: "#8884d8"
  },
  actual: {
    label: "Actual",
    color: "#22c55e"
  }
};

export function SalesTargetCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Sales V Target</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ChartContainer config={chartConfig}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-target, #8884d8)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="var(--color-actual, #22c55e)" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
