import { z } from 'zod';

// Work Order Status Options
export const workOrderStatusOptions = [
  'pending',
  'assigned',
  'in_progress',
  'completed',
  'cancelled'
] as const;

// Work Order Priority Options
export const workOrderPriorityOptions = [
  'low',
  'medium',
  'high',
  'urgent'
] as const;

// Zod schema for work order creation/update
export const workOrderFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(workOrderStatusOptions),
  priority: z.enum(workOrderPriorityOptions),
  scheduled_start: z.string().min(1, "Start date is required"),
  scheduled_end: z.string().optional(),
  client_id: z.string().uuid("Invalid client ID"),
  site_id: z.string().uuid("Invalid site ID"),
  contract_id: z.string().uuid("Invalid contract ID"),
  service_type: z.string().min(1, "Service type is required"),
  supplier_id: z.string().uuid("Invalid supplier ID").optional(),
  billing_method: z.string().optional(),
  estimated_cost: z.number().optional(),
  special_instructions: z.string().optional(),
});

// Create data type (for API requests)
export type WorkOrderCreateData = z.infer<typeof workOrderFormSchema>;

// Complete work order data type (from API responses)
export interface WorkOrderData {
  id: string;
  work_order_number: string;
  title: string;
  description?: string;
  status: typeof workOrderStatusOptions[number];
  priority: typeof workOrderPriorityOptions[number];
  service_type: string;
  scheduled_start: string;
  scheduled_end?: string;
  actual_start?: string;
  actual_end?: string;
  client_id: string;
  site_id: string;
  contract_id: string;
  supplier_id?: string;
  billing_method?: string;
  estimated_cost?: number;
  actual_cost?: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  // Joined fields (not in the database but returned by API)
  client_name?: string;
  site_name?: string;
  supplier_name?: string;
}

// Work order task type
export interface WorkOrderTask {
  id: string;
  work_order_id: string;
  task_name: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  completed_at?: string;
  completed_by?: string;
  created_at: string;
  updated_at: string;
}

// Workbill type
export interface WorkbillData {
  id: string;
  work_order_id: string;
  supplier_id?: string;
  status: 'pending' | 'approved' | 'paid' | 'disputed';
  amount: number;
  hours_worked?: number;
  pay_rate?: number;
  invoice_number?: string;
  invoice_date?: string;
  payment_date?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  site_id?: string; // Optional site ID
}
