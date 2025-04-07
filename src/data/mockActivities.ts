
import { Activity } from '@/types/activity-types';

// Sample mock activities data
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'client_created',
    title: 'New client added',
    description: 'A new client "ABC Corporation" was added to the system',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: {
      id: 'user1',
      name: 'Jane Smith',
      avatar: '/placeholder.svg'
    },
    status: 'success',
    entity: {
      type: 'client',
      id: 'client1',
      name: 'ABC Corporation'
    }
  },
  {
    id: '2',
    type: 'contract_signed',
    title: 'Contract signed with XYZ Ltd',
    description: 'Annual maintenance contract #CT-2023-004 was signed',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: {
      id: 'user2',
      name: 'John Doe',
      avatar: '/placeholder.svg'
    },
    status: 'success',
    entity: {
      type: 'contract',
      id: 'contract1',
      name: 'Annual Maintenance Agreement'
    }
  },
  {
    id: '3',
    type: 'work_order_created',
    title: 'Work order created',
    description: 'New work order #WO-2023-089 for emergency repair',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    user: {
      id: 'user3',
      name: 'David Johnson',
    },
    status: 'info',
    entity: {
      type: 'work_order',
      id: 'wo1',
      name: 'Emergency Repair - Site #45'
    }
  },
  {
    id: '4',
    type: 'invoice_paid',
    title: 'Invoice payment received',
    description: 'Payment received for invoice #INV-2023-156',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'user4',
      name: 'Sarah Williams',
    },
    status: 'success',
    entity: {
      type: 'invoice',
      id: 'inv1',
      name: 'Invoice #INV-2023-156'
    }
  },
  {
    id: '5',
    type: 'site_added',
    title: 'New site registered',
    description: 'Added new site location for client FastTrack Inc',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 'user1',
      name: 'Jane Smith',
      avatar: '/placeholder.svg'
    },
    status: 'success',
    entity: {
      type: 'site',
      id: 'site1',
      name: 'FastTrack HQ Building'
    }
  },
  {
    id: '6',
    type: 'system_event',
    title: 'System backup completed',
    description: 'Automated system backup completed successfully',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    user: {
      id: 'system',
      name: 'System',
    },
    status: 'info',
    entity: {
      type: 'system',
      id: 'backup1',
      name: 'Database Backup'
    }
  },
  {
    id: '7',
    type: 'task_completed',
    title: 'Maintenance task completed',
    description: 'Scheduled maintenance task completed for client Acme Inc',
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    user: {
      id: 'user5',
      name: 'Michael Brown',
    },
    status: 'success',
    entity: {
      type: 'task',
      id: 'task1',
      name: 'Quarterly Maintenance Check'
    }
  },
  {
    id: '8',
    type: 'client_updated',
    title: 'Client information updated',
    description: 'Contact information updated for Global Enterprises',
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    user: {
      id: 'user2',
      name: 'John Doe',
      avatar: '/placeholder.svg'
    },
    status: 'warning',
    entity: {
      type: 'client',
      id: 'client2',
      name: 'Global Enterprises'
    }
  },
  {
    id: '9',
    type: 'supplier_added',
    title: 'New supplier onboarded',
    description: 'Supplier "Quality Parts Ltd" has been added',
    timestamp: new Date(Date.now() - 518400000).toISOString(),
    user: {
      id: 'user3',
      name: 'David Johnson',
    },
    status: 'success',
    entity: {
      type: 'supplier',
      id: 'supplier1',
      name: 'Quality Parts Ltd'
    }
  },
  {
    id: '10',
    type: 'user_login',
    title: 'User login detected',
    description: 'Unusual login time detected for user Adam Wilson',
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    user: {
      id: 'user6',
      name: 'Adam Wilson',
    },
    status: 'warning',
    entity: {
      type: 'user',
      id: 'user6',
      name: 'Adam Wilson'
    }
  }
];
