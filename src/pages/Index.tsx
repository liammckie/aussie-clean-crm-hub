
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { TodaySalesCard } from "@/components/dashboard/TodaySalesCard";
import { QualityAuditsCard } from "@/components/dashboard/QualityAuditsCard";
import { TopClientsCard } from "@/components/dashboard/TopClientsCard";
import { SalesTargetCard } from "@/components/dashboard/SalesTargetCard";
import { NetProfitCard } from "@/components/dashboard/NetProfitCard";
import { PipelineValueCard } from "@/components/dashboard/PipelineValueCard";

const Index = () => {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardGrid>
        <TodaySalesCard />
        <QualityAuditsCard />
        <TopClientsCard />
        <SalesTargetCard />
        <NetProfitCard />
        <PipelineValueCard />
      </DashboardGrid>
    </MainLayout>
  );
};

export default Index;
