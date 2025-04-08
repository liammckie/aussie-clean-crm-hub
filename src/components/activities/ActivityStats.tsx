
import React from 'react';
import { ActivityStatCard } from './ActivityStatCard';
import { 
  Users,
  FileText,
  ClipboardList,
  Bell,
} from 'lucide-react';

export function ActivityStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ActivityStatCard 
        title="User Activities"
        count={256}
        change={12}
        icon={<Users className="h-5 w-5" />}
        color="blue"
        description="Last 30 days"
        chartData={[35, 55, 41, 37, 62, 45, 43, 25, 32, 55, 74, 45, 58]}
      />
      <ActivityStatCard 
        title="Contract Events"
        count={84}
        change={-3}
        icon={<FileText className="h-5 w-5" />}
        color="green"
        description="Last 30 days"
        chartData={[25, 45, 51, 27, 42, 35, 23, 15, 22, 35, 44, 35, 28]}
      />
      <ActivityStatCard 
        title="Work Orders"
        count={124}
        change={8}
        icon={<ClipboardList className="h-5 w-5" />}
        color="purple"
        description="Last 30 days"
        chartData={[45, 65, 51, 37, 52, 35, 73, 35, 42, 65, 54, 45, 48]}
      />
      <ActivityStatCard 
        title="System Alerts"
        count={18}
        change={-2}
        icon={<Bell className="h-5 w-5" />}
        color="amber"
        description="Last 30 days"
        chartData={[15, 25, 11, 17, 12, 25, 13, 15, 12, 25, 14, 15, 8]}
      />
    </div>
  );
}
