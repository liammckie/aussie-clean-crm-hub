
export type SalesStage = 
  | 'LEAD' 
  | 'QUALIFIED' 
  | 'PROPOSAL' 
  | 'NEGOTIATION' 
  | 'CLOSED_WON' 
  | 'CLOSED_LOST';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Opportunity {
  id: string;
  title: string;
  client_name: string;
  description?: string;
  value: number;
  probability: number;
  stage: SalesStage;
  priority: Priority;
  expected_close_date: string;
  assigned_to: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesKanbanColumn {
  id: SalesStage;
  title: string;
  opportunities: Opportunity[];
}
