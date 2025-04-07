
export type ActivityType = 
  | 'client_created'
  | 'client_updated'
  | 'contract_signed'
  | 'task_completed'
  | 'invoice_paid'
  | 'work_order_created'
  | 'site_added'
  | 'supplier_added'
  | 'user_login'
  | 'system_event';

export type ActivityStatus = 'success' | 'warning' | 'error' | 'info';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  status: ActivityStatus;
  entity: {
    type: string;
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export interface ActivityCountStat {
  title: string;
  count: number;
  change: number;
  icon: string;
}
