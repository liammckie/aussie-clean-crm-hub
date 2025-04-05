
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
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
  { name: "Jan", delivered: 65, promised: 78 },
  { name: "Feb", delivered: 59, promised: 66 },
  { name: "Mar", delivered: 80, promised: 82 },
  { name: "Apr", delivered: 81, promised: 85 },
  { name: "May", delivered: 56, promised: 67 },
  { name: "Jun", delivered: 55, promised: 58 },
];

const chartConfig = {
  delivered: {
    label: "Delivered",
    color: "#3b82f6"
  },
  promised: {
    label: "Promised",
    color: "#22c55e"
  }
};

export function QualityAuditsCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quality Audit's</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ChartContainer config={chartConfig}>
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="delivered" name="Delivered" fill="var(--color-delivered, #3b82f6)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="promised" name="Promised" fill="var(--color-promised, #22c55e)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
