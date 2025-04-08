
import React, { useMemo } from "react";
import { Building, Users, Map, CreditCard } from "lucide-react";
import { ClientRecord } from "@/types/clients";
import { formatCurrency } from "@/utils/financeCalculations";

interface ClientsSummaryProps {
  clients: ClientRecord[];
}

export function ClientsSummary({ clients }: ClientsSummaryProps) {
  // Calculate summary metrics
  const metrics = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Active').length;
    const totalSites = clients.reduce((sum, client) => sum + (client.site_count || 0), 0);
    const totalRevenue = clients.reduce((sum, client) => sum + (client.annual_revenue || 0), 0);
    
    return {
      totalClients,
      activeClients,
      totalSites,
      totalRevenue,
    };
  }, [clients]);
  
  // Define the metric cards
  const metricCards = [
    {
      title: "Total Clients",
      value: metrics.totalClients,
      icon: Building,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Active Clients",
      value: metrics.activeClients,
      percent: metrics.totalClients ? Math.round((metrics.activeClients / metrics.totalClients) * 100) : 0,
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Sites",
      value: metrics.totalSites,
      icon: Map,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Annual Revenue",
      value: formatCurrency(metrics.totalRevenue),
      icon: CreditCard,
      color: "text-amber-500",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      isMonetary: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metricCards.map((card, index) => (
        <div 
          key={index} 
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <h3 className="text-sm font-medium">{card.title}</h3>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">{card.value}</p>
            {card.percent !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                {card.percent}% of total clients
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
