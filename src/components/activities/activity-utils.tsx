
import React from 'react';
import { ActivityType } from '@/types/activity-types';
import {
  Users,
  FileText,
  CheckCircle2,
  CreditCard,
  ClipboardList,
  Building,
  Truck,
  LogIn,
  Settings,
  AlertTriangle,
  BarChart,
  Calendar,
  Mail,
  MessageSquare,
  PhoneCall,
  Printer,
  Upload,
} from 'lucide-react';

export const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'client_created':
      return { Icon: Users, color: 'blue' };
    case 'client_updated':
      return { Icon: Users, color: 'indigo' };
    case 'contract_signed':
      return { Icon: FileText, color: 'green' };
    case 'task_completed':
      return { Icon: CheckCircle2, color: 'green' };
    case 'invoice_paid':
      return { Icon: CreditCard, color: 'emerald' };
    case 'work_order_created':
      return { Icon: ClipboardList, color: 'purple' };
    case 'site_added':
      return { Icon: Building, color: 'blue' };
    case 'supplier_added':
      return { Icon: Truck, color: 'amber' };
    case 'user_login':
      return { Icon: LogIn, color: 'blue' };
    case 'system_event':
      return { Icon: Settings, color: 'slate' };
    default:
      return { Icon: AlertTriangle, color: 'rose' };
  }
};

export const getActivityEntityUrl = (entity: { type: string; id: string }): string => {
  switch (entity.type.toLowerCase()) {
    case 'client':
      return `/clients/${entity.id}`;
    case 'contract':
      return `/contracts/${entity.id}`;
    case 'work_order':
    case 'workorder':
      return `/work-orders/${entity.id}`;
    case 'supplier':
      return `/suppliers/${entity.id}`;
    case 'site':
      return `/sites/${entity.id}`;
    case 'invoice':
      return `/invoices/${entity.id}`;
    default:
      return '#';
  }
};
