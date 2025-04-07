
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ActivityStatCardProps {
  title: string;
  count: number;
  change: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

export function ActivityStatCard({ title, count, change, icon, color }: ActivityStatCardProps) {
  const colorVariants = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    red: 'bg-red-500/10 text-red-500',
    purple: 'bg-purple-500/10 text-purple-500',
    amber: 'bg-amber-500/10 text-amber-500',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{count}</h3>
              <div className={cn(
                "flex items-center text-xs font-medium",
                change > 0 ? "text-green-500" : "text-red-500"
              )}>
                {change > 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +{change}%
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {change}%
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={cn("rounded-full p-2", colorVariants[color])}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
