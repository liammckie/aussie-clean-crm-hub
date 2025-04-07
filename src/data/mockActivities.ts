
import { Activity } from '@/types/activity-types';
import { addHours, addDays, subDays, subHours, subMinutes, format } from 'date-fns';

// Function to generate a random date between two dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Current date for reference
const now = new Date();

// Generate mock activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'system',
    title: 'System Backup Completed',
    description: 'Weekly system backup completed successfully.',
    timestamp: subHours(now, 2).toISOString(),
    status: 'success',
    actor: 'System',
    category: 'maintenance',
    duration: 23450,
    metadata: {
      backupSize: '1.2GB',
      backupLocation: 'AWS S3',
      retentionPolicy: '30 days'
    },
    impactLevel: 'low',
    tags: ['backup', 'maintenance', 'automated']
  },
  {
    id: '2',
    type: 'user',
    title: 'User Login',
    description: 'User John Doe logged into the system',
    timestamp: subMinutes(now, 45).toISOString(),
    status: 'success',
    actor: 'john.doe@example.com',
    category: 'authentication',
    metadata: {
      ipAddress: '192.168.1.23',
      browser: 'Chrome 98.0.4758.102',
      location: 'Sydney, Australia'
    },
    impactLevel: 'low',
    tags: ['login', 'user-activity']
  },
  {
    id: '3',
    type: 'client',
    title: 'Client Created',
    description: 'New client "ABC Corp" was added to the system',
    timestamp: subDays(now, 1).toISOString(),
    status: 'success',
    actor: 'sarah.admin@example.com',
    entityId: '93402bf9-695c-4898-a835-52db94751a34',
    entityType: 'client',
    category: 'data-entry',
    metadata: {
      clientName: 'ABC Corp',
      industry: 'Technology',
      contactPerson: 'Jane Smith'
    },
    clientName: 'ABC Corp',
    impactLevel: 'medium',
    tags: ['new-client', 'onboarding']
  },
  {
    id: '4',
    type: 'contract',
    title: 'Contract Updated',
    description: 'Contract terms modified for client "XYZ Industries"',
    timestamp: subHours(now, 5).toISOString(),
    status: 'info',
    actor: 'robert.manager@example.com',
    entityId: '7db9e443-7836-4a1b-8fbe-93b1eaadd54e',
    entityType: 'contract',
    category: 'modification',
    details: {
      contractValue: { before: '$50,000', after: '$65,000' },
      endDate: { before: '2023-12-31', after: '2024-06-30' },
      servicesIncluded: { before: '3 services', after: '5 services' }
    },
    clientName: 'XYZ Industries',
    impactLevel: 'high',
    tags: ['contract-update', 'value-increase']
  },
  {
    id: '5',
    type: 'work_order',
    title: 'Work Order Completed',
    description: 'Work order #WO-2023-089 marked as completed',
    timestamp: subHours(now, 8).toISOString(),
    status: 'success',
    actor: 'tech.support@example.com',
    entityId: '26cee87d-892a-4400-b518-1b6b1c4c3ae5',
    entityType: 'work_order',
    category: 'completion',
    metadata: {
      orderNumber: 'WO-2023-089',
      completionTime: '3.5 hours',
      clientFeedback: 'Satisfied'
    },
    clientName: 'Global Retail Inc',
    location: 'Melbourne CBD Store',
    impactLevel: 'medium',
    tags: ['completed', 'client-site']
  },
  {
    id: '6',
    type: 'supplier',
    title: 'Supplier Payment Processed',
    description: 'Invoice #INV-789-2023 paid to supplier "Quality Cleaning Services"',
    timestamp: subDays(now, 2).toISOString(),
    status: 'success',
    actor: 'finance@example.com',
    entityId: 'c29aa3c1-7ab0-4b8d-ad9f-e963316d9d8a',
    entityType: 'supplier',
    category: 'finance',
    metadata: {
      invoiceAmount: '$2,450.00',
      paymentMethod: 'Bank Transfer',
      invoiceNumber: 'INV-789-2023'
    },
    impactLevel: 'medium',
    tags: ['payment', 'finance']
  },
  {
    id: '7',
    type: 'system',
    title: 'System Error',
    description: 'Database connectivity issue detected',
    timestamp: subMinutes(now, 150).toISOString(),
    status: 'error',
    category: 'system-error',
    duration: 420,
    metadata: {
      errorCode: 'DB_CONN_ERR_501',
      affectedServices: ['reports', 'search', 'user-profiles'],
      resolution: 'Auto-recovered after connection retry'
    },
    impactLevel: 'high',
    tags: ['error', 'database', 'connectivity']
  },
  {
    id: '8',
    type: 'client',
    title: 'Client Status Changed',
    description: 'Client "TechForward" status changed from "Prospect" to "Active"',
    timestamp: subDays(now, 3).toISOString(),
    status: 'success',
    actor: 'account.manager@example.com',
    entityId: '48b1e429-6730-4d95-bd5f-0b0e790066e3',
    entityType: 'client',
    category: 'status-change',
    details: {
      status: { before: 'Prospect', after: 'Active' },
      accountManager: { before: 'Unassigned', after: 'Jane Wilson' }
    },
    clientName: 'TechForward',
    impactLevel: 'medium',
    tags: ['status-change', 'prospect-conversion']
  },
  {
    id: '9',
    type: 'user',
    title: 'User Permission Changed',
    description: 'User "Mark Johnson" granted admin access',
    timestamp: subDays(now, 1).toISOString(),
    status: 'warning',
    actor: 'system.admin@example.com',
    category: 'security',
    details: {
      permission: { before: 'Standard User', after: 'System Administrator' },
      accessModules: { before: ['Dashboard', 'Clients'], after: ['All Modules'] }
    },
    impactLevel: 'high',
    tags: ['security', 'permissions', 'admin-access']
  },
  {
    id: '10',
    type: 'work_order',
    title: 'Work Order Assigned',
    description: 'Work order #WO-2023-092 assigned to "Elite Maintenance Team"',
    timestamp: subHours(now, 25).toISOString(),
    status: 'success',
    actor: 'operations.manager@example.com',
    entityId: '8ee7f5a7-c10a-48d9-9cc9-93d59a127a61',
    entityType: 'work_order',
    category: 'assignment',
    metadata: {
      orderNumber: 'WO-2023-092',
      priority: 'High',
      dueDate: format(addDays(now, 2), 'yyyy-MM-dd')
    },
    clientName: 'Sydney Metro Hospital',
    location: 'Emergency Department',
    impactLevel: 'medium',
    tags: ['assignment', 'high-priority', 'healthcare']
  },
  {
    id: '11',
    type: 'contract',
    title: 'Contract Renewal',
    description: 'Annual contract renewed for "Brisbane City Council"',
    timestamp: subDays(now, 4).toISOString(),
    status: 'success',
    actor: 'legal@example.com',
    entityId: 'a727fd12-9b7b-47c5-8855-4a1d72b9a553',
    entityType: 'contract',
    category: 'renewal',
    details: {
      contractTerm: { before: '2022-2023', after: '2023-2024' },
      value: { before: '$175,000', after: '$189,000' }
    },
    clientName: 'Brisbane City Council',
    impactLevel: 'high',
    tags: ['renewal', 'government', 'annual-contract']
  },
  {
    id: '12',
    type: 'supplier',
    title: 'New Supplier Compliance Document',
    description: 'Insurance certificate uploaded for "AAA Industrial Cleaning"',
    timestamp: subDays(now, 2).toISOString(),
    status: 'success',
    actor: 'compliance@example.com',
    entityId: 'e3b4a28c-5711-4f2f-b0c7-0d74ef4a67a8',
    entityType: 'supplier',
    category: 'compliance',
    metadata: {
      documentType: 'Liability Insurance',
      expiryDate: format(addDays(now, 365), 'yyyy-MM-dd'),
      coverageAmount: '$5,000,000'
    },
    impactLevel: 'medium',
    tags: ['compliance', 'insurance', 'documentation']
  },
  {
    id: '13',
    type: 'system',
    title: 'System Update',
    description: 'System updated to version 2.5.1',
    timestamp: subDays(now, 5).toISOString(),
    status: 'success',
    category: 'maintenance',
    duration: 12350,
    metadata: {
      previousVersion: '2.5.0',
      newFeatures: ['Enhanced reporting', 'Mobile optimization', 'Security patches'],
      downtimeDuration: '15 minutes'
    },
    impactLevel: 'medium',
    tags: ['update', 'maintenance', 'feature-release']
  },
  {
    id: '14',
    type: 'work_order',
    title: 'Work Order Deadline Extended',
    description: 'Completion deadline extended for work order #WO-2023-073',
    timestamp: subDays(now, 3).toISOString(),
    status: 'warning',
    actor: 'project.manager@example.com',
    entityId: '5f53ad5d-c82d-4530-8304-b8e43f32c8a9',
    entityType: 'work_order',
    category: 'schedule-change',
    details: {
      dueDate: { before: format(subDays(now, 1), 'yyyy-MM-dd'), after: format(addDays(now, 5), 'yyyy-MM-dd') },
      reason: 'Client requested additional services'
    },
    clientName: 'Perth Shopping Plaza',
    location: 'Food Court',
    impactLevel: 'medium',
    tags: ['schedule-change', 'deadline-extension', 'retail']
  },
  {
    id: '15',
    type: 'client',
    title: 'Client Feedback Received',
    description: 'Client "Adelaide University" submitted feedback survey',
    timestamp: subHours(now, 36).toISOString(),
    status: 'info',
    entityId: 'c821f935-4c5a-4134-9d3f-b58243e1d4a9',
    entityType: 'client',
    category: 'feedback',
    metadata: {
      satisfaction: '4.7/5',
      comments: 'Very pleased with the service quality. Response time could be improved slightly.',
      recommendationScore: '9/10'
    },
    clientName: 'Adelaide University',
    impactLevel: 'medium',
    tags: ['feedback', 'survey', 'education-sector']
  }
];
