
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
      <DashboardGrid>
        <BusinessMetricsCard />
        <TodaySalesCard />
        <QualityAuditsCard />
        <TopClientsCard />
        <SalesTargetCard />
        <NetProfitCard />
        <PipelineValueCard />
      </DashboardGrid>
    </div>
  );
};

export default Dashboard;
