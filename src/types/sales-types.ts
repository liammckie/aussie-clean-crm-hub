
import { z } from 'zod';

export type SalesStage = 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Opportunity {
  id: string;
  title: string;
  client_name: string;
  value: number;
  probability: number;
  stage: SalesStage;
  priority: PriorityLevel;
  expected_close_date: string;
  assigned_to: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

// Zod schema for form validation
export const opportunitySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: 'Title is required' }),
  client_name: z.string().min(1, { message: 'Client name is required' }),
  value: z.number().min(0, { message: 'Value must be a positive number' }),
  probability: z.number().min(0).max(100, { message: 'Probability must be between 0-100%' }),
  stage: z.enum(['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  expected_close_date: z.string().min(1, { message: 'Expected close date is required' }),
  assigned_to: z.string().min(1, { message: 'Assigned to is required' }),
  description: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email({ message: 'Invalid email format' }).optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string()
});
