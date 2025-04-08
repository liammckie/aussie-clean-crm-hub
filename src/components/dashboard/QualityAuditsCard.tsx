
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from "recharts";

const data = [
  { name: "Jan", delivered: 65, promised: 78 },
  { name: "Feb", delivered: 59, promised: 66 },
  { name: "Mar", delivered: 80, promised: 82 },
  { name: "Apr", delivered: 81, promised: 85 },
  { name: "May", delivered: 56, promised: 67 },
  { name: "Jun", delivered: 55, promised: 58 },
];

export function QualityAuditsCard() {
  return (
    <Card className="bg-card/50 border-border/50 w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Quality Audits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                itemStyle={{ color: "#e2e8f0" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Legend />
              <Bar dataKey="delivered" name="Delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="promised" name="Promised" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
