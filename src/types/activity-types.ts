
export type ActivityType = 'system' | 'user' | 'client' | 'contract' | 'work_order' | 'supplier' | 
  'client_created' | 'client_updated' | 'contract_signed' | 'task_completed' | 
  'invoice_paid' | 'work_order_created' | 'site_added' | 'supplier_added' | 
  'user_login' | 'system_event';
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
  // Add these fields to support ActivityCard.tsx
  user?: {
    name: string;
    avatar?: string;
  };
  entity?: {
    id: string;
    type: string;
  };
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
