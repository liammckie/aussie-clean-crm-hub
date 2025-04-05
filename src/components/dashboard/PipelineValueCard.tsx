
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { XAxis, YAxis } from "@/components/ui/sidebar/components/chart-wrappers";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

const data = [
  { name: "Jan", john: 4000, sarah: 2400, tom: 1600 },
  { name: "Feb", john: 3000, sarah: 1398, tom: 2210 },
  { name: "Mar", john: 2000, sarah: 9800, tom: 2290 },
  { name: "Apr", john: 2780, sarah: 3908, tom: 2000 },
  { name: "May", john: 1890, sarah: 4800, tom: 2181 },
  { name: "Jun", john: 2390, sarah: 3800, tom: 2500 },
];

const chartConfig = {
  john: {
    label: "John",
    color: "#8884d8"
  },
  sarah: {
    label: "Sarah",
    color: "#82ca9d"
  },
  tom: {
    label: "Tom",
    color: "#ffc658"
  }
};

export function PipelineValueCard() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Pipeline Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ChartContainer config={chartConfig}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorJohn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-john, #8884d8)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-john, #8884d8)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSarah" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sarah, #82ca9d)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-sarah, #82ca9d)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tom, #ffc658)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-tom, #ffc658)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="john" 
                stroke="var(--color-john, #8884d8)" 
                fillOpacity={1} 
                fill="url(#colorJohn)" 
              />
              <Area 
                type="monotone" 
                dataKey="sarah" 
                stroke="var(--color-sarah, #82ca9d)" 
                fillOpacity={1} 
                fill="url(#colorSarah)" 
              />
              <Area 
                type="monotone" 
                dataKey="tom" 
                stroke="var(--color-tom, #ffc658)" 
                fillOpacity={1} 
                fill="url(#colorTom)" 
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
