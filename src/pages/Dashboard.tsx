
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TodaySalesCard } from "@/components/dashboard/TodaySalesCard";
import { QualityAuditsCard } from "@/components/dashboard/QualityAuditsCard";
import { TopClientsCard } from "@/components/dashboard/TopClientsCard";
import { SalesTargetCard } from "@/components/dashboard/SalesTargetCard";
import { NetProfitCard } from "@/components/dashboard/NetProfitCard";
import { BusinessMetricsCard } from "@/components/dashboard/BusinessMetricsCard";
import { useEffect } from "react";
import { AppLogger, LogCategory } from "@/utils/logging";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { FinancialSummaryCard } from "@/components/financial/FinancialSummaryCard";
import { ActivityStats } from "@/components/activities/ActivityStats";
import { PipelineValueCard } from "@/components/dashboard/PipelineValueCard";

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
    <div className="container px-4 sm:px-6 lg:px-4 mx-auto max-w-full">
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
      
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Activity stats section - full width */}
      <section className="mb-8">
        <ActivityStats />
      </section>
      
      {/* Main dashboard content with improved layout */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Business Performance</h2>
        
        {/* First row - 2 columns layout for wider cards */}
        <DashboardGrid columns={2} className="mb-6">
          <BusinessMetricsCard />
          <FinancialSummaryCard
            title="Company Financials"
            description="Overall company revenue and cost breakdown"
            weekly={companyFinancials.weekly}
            monthly={companyFinancials.monthly}
            annual={companyFinancials.annual}
          />
        </DashboardGrid>
        
        {/* Second row - 3 columns layout */}
        <DashboardGrid columns={3} className="mb-6">
          <TopClientsCard />
          <NetProfitCard />
          <TodaySalesCard />
        </DashboardGrid>
        
        {/* Third row - 2 columns layout for charts */}
        <DashboardGrid columns={2} className="mb-6">
          <QualityAuditsCard />
          <SalesTargetCard />
        </DashboardGrid>
      </section>
    </div>
  );
};

export default Dashboard;
