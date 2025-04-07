
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TodaySalesCard } from "@/components/dashboard/TodaySalesCard";
import { QualityAuditsCard } from "@/components/dashboard/QualityAuditsCard";
import { TopClientsCard } from "@/components/dashboard/TopClientsCard";
import { SalesTargetCard } from "@/components/dashboard/SalesTargetCard";
import { NetProfitCard } from "@/components/dashboard/NetProfitCard";
import { PipelineValueCard } from "@/components/dashboard/PipelineValueCard";
import { BusinessMetricsCard } from "@/components/dashboard/BusinessMetricsCard";
import { useEffect } from "react";
import { AppLogger, LogCategory } from "@/utils/logging";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { FinancialSummaryCard } from "@/components/financial/FinancialSummaryCard";
import { ActivityStats } from "@/components/activities/ActivityStats";
import { generateFinancialBreakdown } from "@/utils/financeCalculations";

// Sample financial data for the dashboard
// In a real application, this would come from an API
const companyFinancials = {
  weekly: {
    revenue: 23500,
    cost: 15300,
    profit: 8200,
    marginPercentage: 34.89
  },
  monthly: {
    revenue: 101800,
    cost: 66300,
    profit: 35500,
    marginPercentage: 34.89
  },
  annual: {
    revenue: 1222000,
    cost: 795600, 
    profit: 426400,
    marginPercentage: 34.89
  }
};

const Dashboard = () => {
  useEffect(() => {
    AppLogger.info(LogCategory.UI, "Dashboard component mounted");
    return () => {
      AppLogger.info(LogCategory.UI, "Dashboard component unmounted");
    };
  }, []);

  return (
    <div className="container mx-auto px-0 max-w-full">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <ActivityStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Business Performance</h2>
        <DashboardGrid>
          <BusinessMetricsCard />
          
          <FinancialSummaryCard
            title="Company Financials"
            description="Overall company revenue and cost breakdown"
            weekly={companyFinancials.weekly}
            monthly={companyFinancials.monthly}
            annual={companyFinancials.annual}
            className="col-span-2"
          />
          
          <TodaySalesCard />
          <QualityAuditsCard />
          <TopClientsCard />
          <SalesTargetCard />
          <NetProfitCard />
          <PipelineValueCard />
        </DashboardGrid>
      </div>
    </div>
  );
};

export default Dashboard;
