import { faker } from '@faker-js/faker';
import { ClientStatus, SiteStatus, SiteType, ContactType } from '@/types/database-schema';

/**
 * Generate mock client data
 */
export function generateMockClient(): any {
  return {
    business_name: faker.company.name(),
    trading_name: faker.company.name(),
    abn: faker.string.numeric(11),
    acn: faker.string.numeric(9),
    industry: faker.commerce.department(),
    status: ClientStatus.ACTIVE,
    onboarding_date: faker.date.past().toISOString(),
    source: faker.lorem.word(),
    billing_cycle: faker.finance.transactionType(),
    payment_terms: faker.finance.transactionType(),
    payment_method: faker.finance.transactionType(),
    tax_status: faker.finance.transactionType(),
    credit_limit: faker.number.int(10000),
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.location.secondaryAddress(),
    suburb: faker.location.city(),
    state: faker.location.state(),
    postcode: faker.location.zipCode(),
    country: faker.location.country()
  };
}

/**
 * Generate mock contact data
 */
export function generateMockContact(clientId: string, isPrimary = false): any {
  return {
    client_id: clientId,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    mobile: faker.phone.number(),
    position: faker.person.jobTitle(),
    is_primary: isPrimary,
    contact_type: ContactType.PRIMARY,
    notes: faker.lorem.sentence(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

/**
 * Generate mock address data
 */
export function generateMockAddress(clientId: string): any {
  return {
    client_id: clientId,
    address_type: 'physical',
    street: faker.location.streetAddress(),
    suburb: faker.location.city(),
    state: faker.location.state(),
    postcode: faker.location.zipCode(),
    country: faker.location.country()
  };
}

/**
 * Generate mock site data with the correct SiteType
 */
export function generateMockSite(clientId: string): any {
  return {
    client_id: clientId,
    site_name: faker.company.name() + ' Office',
    site_code: faker.helpers.replaceSymbols('????').toUpperCase(),
    address_line_1: faker.location.streetAddress(),
    address_line_2: faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
    suburb: faker.location.city(),
    state: faker.location.state(),
    postcode: faker.location.zipCode(),
    site_contact_name: faker.person.fullName(),
    site_contact_email: faker.internet.email(),
    site_contact_phone: faker.phone.number(),
    notes: faker.lorem.paragraph(),
    region: faker.location.state(),
    induction_required: faker.datatype.boolean(),
    status: SiteStatus.ACTIVE,
    site_type: SiteType.COMMERCIAL,
    square_meters: faker.number.int({ min: 100, max: 10000 }),
    description: faker.lorem.paragraph()
  };
}
