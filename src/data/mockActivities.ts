
import { Activity } from '@/types/activity-types';
import { faker } from '@faker-js/faker';

// Helper to create a random activity
const createRandomActivity = (): Activity => {
  const types = [
    'client_created',
    'client_updated',
    'contract_signed',
    'task_completed',
    'invoice_paid',
    'work_order_created',
    'site_added',
    'supplier_added',
    'user_login',
    'system_event',
  ] as const;
  
  const statuses = ['success', 'warning', 'error', 'info'] as const;
  const entityTypes = ['client', 'contract', 'work_order', 'supplier', 'site', 'invoice', 'system'];
  
  const type = faker.helpers.arrayElement(types);
  const entityType = type.split('_')[0] === 'system' 
    ? 'system'
    : type.split('_')[0];
  
  let title = '';
  let description = '';
  
  switch (type) {
    case 'client_created':
      title = `New client created`;
      description = `${faker.company.name()} was added to the system`;
      break;
    case 'client_updated':
      title = 'Client information updated';
      description = `${faker.company.name()} details were updated`;
      break;
    case 'contract_signed':
      title = 'Contract signed';
      description = `Contract #${faker.string.alphanumeric(6).toUpperCase()} was signed`;
      break;
    case 'task_completed':
      title = 'Task completed';
      description = `${faker.lorem.sentence(3)} task was marked as complete`;
      break;
    case 'invoice_paid':
      title = 'Invoice payment received';
      description = `Invoice #${faker.string.alphanumeric(6).toUpperCase()} was paid - $${faker.finance.amount(100, 10000, 2)}`;
      break;
    case 'work_order_created':
      title = 'New work order';
      description = `Work order #${faker.string.alphanumeric(6).toUpperCase()} was created`;
      break;
    case 'site_added':
      title = 'New site added';
      description = `${faker.location.streetAddress()} site was added`;
      break;
    case 'supplier_added':
      title = 'New supplier';
      description = `${faker.company.name()} was added as a supplier`;
      break;
    case 'user_login':
      title = 'User login detected';
      description = `${faker.person.fullName()} logged in from ${faker.location.city()}`;
      break;
    case 'system_event':
      title = 'System notification';
      description = `${faker.lorem.sentence(5)}`;
      break;
  }
  
  return {
    id: faker.string.uuid(),
    type,
    title,
    description,
    timestamp: faker.date.recent({ days: 14 }).toISOString(),
    user: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar()
    },
    status: faker.helpers.arrayElement(statuses),
    entity: {
      type: entityType,
      id: faker.string.uuid(),
      name: entityType === 'client' || entityType === 'supplier' 
        ? faker.company.name() 
        : `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} #${faker.string.alphanumeric(6).toUpperCase()}`
    },
    metadata: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      location: faker.location.city() + ', ' + faker.location.country()
    }
  };
};

// Generate mock activities
export const mockActivities: Activity[] = Array.from(
  { length: 50 }, 
  () => createRandomActivity()
).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
