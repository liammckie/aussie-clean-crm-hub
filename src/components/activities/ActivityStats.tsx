
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ActivityStatCard } from './ActivityStatCard';
import { 
  Users,
  FileText,
  ClipboardList,
  Bell,
} from 'lucide-react';

export function ActivityStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <ActivityStatCard 
        title="User Activities"
        count={256}
        change={12}
        icon={<Users className="h-5 w-5" />}
        color="blue"
      />
      <ActivityStatCard 
        title="Contract Events"
        count={84}
        change={-3}
        icon={<FileText className="h-5 w-5" />}
        color="green"
      />
      <ActivityStatCard 
        title="Work Orders"
        count={124}
        change={8}
        icon={<ClipboardList className="h-5 w-5" />}
        color="purple"
      />
      <ActivityStatCard 
        title="System Alerts"
        count={18}
        change={-2}
        icon={<Bell className="h-5 w-5" />}
        color="amber"
      />
    </div>
  );
}
