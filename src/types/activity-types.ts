
export type ActivityType = 'system' | 'user' | 'client' | 'contract' | 'work_order' | 'supplier';
export type ActivityStatus = 'success' | 'warning' | 'error' | 'info';
export type ActivityImpactLevel = 'high' | 'medium' | 'low';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  status: ActivityStatus;
  actor?: string; // User who performed the action
  entityId?: string; // Related entity ID
  entityType?: string; // Related entity type
  icon?: string;
  category?: string;
  duration?: number; // In milliseconds
  metadata?: Record<string, any> | string;
  details?: Record<string, any>;
  impactLevel?: ActivityImpactLevel;
  clientName?: string;
  location?: string;
  tags?: string[];
}

export interface ActivityFilterState {
  type: ActivityType | 'all';
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  search?: string;
  status?: ActivityStatus[];
  entities?: string[];
}
