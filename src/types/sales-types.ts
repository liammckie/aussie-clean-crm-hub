
import { z } from 'zod';

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

// Add the missing schema
export const opportunitySchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  client_name: z.string().min(1, "Client name is required"),
  description: z.string().optional(),
  value: z.number().min(0, "Value must be positive"),
  probability: z.number().min(0).max(100, "Probability must be between 0 and 100"),
  stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  expected_close_date: z.string(),
  assigned_to: z.string(),
  contact_name: z.string().optional(),
  contact_email: z.string().email("Invalid email format").optional(),
  contact_phone: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string()
});
