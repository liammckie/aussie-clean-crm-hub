import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";
import { generateForecastData, formatCurrency, ForecastDataPoint } from "@/utils/forecastData";

type MetricView = "clients" | "financial" | "profit";

export function BusinessMetricsCard() {
  const [metricView, setMetricView] = useState<MetricView>("clients");
  const [forecastData] = useState(() => generateForecastData());

  const renderClientsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={forecastData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip 
          formatter={(value, name) => {
            return [value, name === "fixedBillingMonthly" ? "Monthly Revenue" : name];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="activeClients" fill="#8884d8" name="Active Clients" xAxisId={0} />
        <Bar yAxisId="left" dataKey="activeSites" fill="#82ca9d" name="Active Sites" xAxisId={0} />
        <Bar yAxisId="left" dataKey="activeContracts" fill="#ffc658" name="Active Contracts" xAxisId={0} />
        <Line yAxisId="right" type="monotone" dataKey="fixedBillingMonthly" stroke="#ff7300" name="Monthly Revenue" xAxisId={0} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderFinancialChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={forecastData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis 
          yAxisId="left" 
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip 
          formatter={(value: number, name) => {
            return [formatCurrency(value), 
              name === "fixedBillingMonthly" ? "Monthly Revenue" :
              name === "fixedBillingAnnual" ? "Annual Revenue" :
              name === "supplierCostMonthly" ? "Monthly Cost" :
              name === "supplierCostAnnual" ? "Annual Cost" : name
            ];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="fixedBillingMonthly" fill="#82ca9d" name="Monthly Revenue" xAxisId={0} />
        <Bar yAxisId="left" dataKey="supplierCostMonthly" fill="#ff8042" name="Monthly Cost" xAxisId={0} />
        <Line yAxisId="left" type="monotone" dataKey="fixedBillingAnnual" stroke="#8884d8" name="Annual Revenue" xAxisId={0} />
        <Line yAxisId="left" type="monotone" dataKey="supplierCostAnnual" stroke="#ff0000" name="Annual Cost" xAxisId={0} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  const renderProfitChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={forecastData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis 
          yAxisId="left" 
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip 
          formatter={(value: number, name) => {
            return [formatCurrency(value), 
              name === "fixedBillingMonthly" ? "Monthly Revenue" :
              name === "supplierCostMonthly" ? "Monthly Supplier Cost" :
              name === "grossProfitMonthly" ? "Monthly Gross Profit" : name
            ];
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="fixedBillingMonthly" fill="#82ca9d" name="Monthly Revenue" xAxisId={0} />
        <Bar yAxisId="left" dataKey="supplierCostMonthly" fill="#ff8042" name="Monthly Supplier Cost" xAxisId={0} />
        <Bar yAxisId="left" dataKey="grossProfitMonthly" fill="#8884d8" name="Monthly Gross Profit" xAxisId={0} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <Card className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-950 border-slate-700 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-white">Business Forecast</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={metricView === "clients" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMetricView("clients")}
          >
            Clients & Contracts
          </Button>
          <Button 
            variant={metricView === "financial" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMetricView("financial")}
          >
            Revenue & Costs
          </Button>
          <Button 
            variant={metricView === "profit" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setMetricView("profit")}
          >
            Gross Profit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="text-sm text-slate-400 mb-4">
          Forecast based on {forecastData[0].activeContracts} active contracts, future signed deals, and projected cancellations
        </div>
        {metricView === "clients" 
          ? renderClientsChart() 
          : metricView === "financial" 
            ? renderFinancialChart() 
            : renderProfitChart()
        }
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox 
            title="Active Clients" 
            value={forecastData[0].activeClients.toString()} 
            change={forecastData[2].activeClients - forecastData[0].activeClients}
          />
          <StatBox 
            title="Monthly Revenue" 
            value={formatCurrency(forecastData[0].fixedBillingMonthly)} 
            change={Math.round((forecastData[2].fixedBillingMonthly - forecastData[0].fixedBillingMonthly) / forecastData[0].fixedBillingMonthly * 100)}
            isPercentage={true}
          />
          <StatBox 
            title="Monthly Costs" 
            value={formatCurrency(forecastData[0].supplierCostMonthly)} 
            change={Math.round((forecastData[2].supplierCostMonthly - forecastData[0].supplierCostMonthly) / forecastData[0].supplierCostMonthly * 100)}
            isPercentage={true}
          />
          <StatBox 
            title="Gross Profit" 
            value={`${Math.round((forecastData[0].fixedBillingMonthly - forecastData[0].supplierCostMonthly) / forecastData[0].fixedBillingMonthly * 100)}%`} 
            change={Math.round((
              (forecastData[2].fixedBillingMonthly - forecastData[2].supplierCostMonthly) / forecastData[2].fixedBillingMonthly * 100
            ) - (
              (forecastData[0].fixedBillingMonthly - forecastData[0].supplierCostMonthly) / forecastData[0].fixedBillingMonthly * 100
            ))}
            isPercentage={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatBoxProps {
  title: string;
  value: string;
  change: number;
  isPercentage?: boolean;
}

const StatBox = ({ title, value, change, isPercentage = false }: StatBoxProps) => {
  const isPositive = change > 0;
  
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <div className="flex items-center mt-1">
        <ChevronDown className={`h-4 w-4 ${isPositive ? 'text-green-500 rotate-180' : 'text-red-500'}`} />
        <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{change}{isPercentage ? '%' : ''} 
          <span className="text-slate-500 text-xs ml-1">Next 90 days</span>
        </span>
      </div>
    </div>
  );
};
