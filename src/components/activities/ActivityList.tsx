
import React from 'react';
import { Activity } from '@/types/activity-types';
import { ActivityItem } from './ActivityItem';
import { ActivityCard } from './ActivityCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface ActivityListProps {
  activities: Activity[];
  viewMode: 'list' | 'grid';
}

export function ActivityList({ activities, viewMode }: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-muted p-4">
          <div className="h-12 w-12 text-muted-foreground">📋</div>
        </div>
        <h3 className="mt-4 text-lg font-semibold">No activities found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No activities match your current filters.
        </p>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px] pr-4">
      {viewMode === 'list' ? (
        <motion.div 
          className="space-y-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities.map((activity, index) => (
            <motion.div key={activity.id} variants={item}>
              <ActivityItem activity={activity} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {activities.map((activity, index) => (
            <motion.div key={activity.id} variants={item}>
              <ActivityCard activity={activity} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </ScrollArea>
  );
}
