
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Aussie Clean CRM Hub</h1>
        <p className="text-lg mb-4">
          Your centralized platform for managing client relationships, tracking sales, and monitoring quality metrics.
        </p>
        <div className="bg-card/50 border-border/50 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            Navigate to the <a href="/dashboard" className="text-blue-500 hover:underline">Dashboard</a> to view your business metrics or use the sidebar to access specific modules.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
