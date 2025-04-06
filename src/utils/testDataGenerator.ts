
import { ClientFormData, ContactFormData } from '@/services/client';
import { SiteFormData } from '@/components/site/SiteFormTypes';
import { generateRandomId } from '@/utils/idGenerator';
import { SiteStatus, SiteType, ClientStatus } from '@/types/database-schema';

/**
 * Generates sample client data for testing purposes
 */
export function generateSampleClient(overrides: Partial<ClientFormData> = {}): ClientFormData {
  // Base client data that conforms to database expectations
  const baseClient: ClientFormData = {
    business_name: `Test Business ${Math.floor(Math.random() * 1000)}`,
    trading_name: 'Trading As Test Co.',
    abn: '83914571673', // Valid ABN format
    acn: '000000019', // Valid ACN format
    industry: 'Technology',
    status: ClientStatus.ACTIVE,
    onboarding_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    source: 'Website',
    billing_cycle: 'Monthly',
    payment_terms: 'Net 30',
    payment_method: 'Direct Debit',
    tax_status: 'GST Registered',
    credit_limit: 10000,
    // Address fields
    address_line_1: '123 Test Street',
    address_line_2: 'Suite 101',
    suburb: 'Melbourne',
    state: 'VIC',
    postcode: '3000',
    country: 'Australia',
  };

  // Merge base client with any overrides
  return { ...baseClient, ...overrides };
}

/**
 * Generates a sample contact for testing purposes
 */
export function generateSampleContact(clientId: string, overrides: Partial<ContactFormData> = {}): ContactFormData {
  const baseContact: ContactFormData = {
    client_id: clientId,
    name: `Contact ${Math.floor(Math.random() * 1000)}`,
    email: `contact${Math.floor(Math.random() * 1000)}@example.com`,
    position: 'Manager',
    phone: '0399999999',
    mobile: '0412345678',
    contact_type: 'Primary',
    is_primary: true
  };

  return { ...baseContact, ...overrides };
}

/**
 * Generates a sample site for testing purposes
 */
export function generateSampleSite(clientId: string, overrides: Partial<SiteFormData> = {}): SiteFormData & { client_id: string } {
  const siteCode = `SITE${Math.floor(Math.random() * 10000)}`;
  
  const baseSite: SiteFormData & { client_id: string } = {
    client_id: clientId,
    site_name: `Test Site ${Math.floor(Math.random() * 1000)}`,
    site_code: siteCode,
    address_line_1: '456 Test Avenue',
    address_line_2: 'Level 2',
    suburb: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    site_contact_name: 'Site Manager',
    site_contact_email: `site-${siteCode.toLowerCase()}@example.com`,
    site_contact_phone: '0298765432',
    notes: 'This is a test site for development',
    region: 'Metro',
    induction_required: false,
    status: SiteStatus.ACTIVE,
    site_type: SiteType.OFFICE,
    square_meters: 500,
  };

  return { ...baseSite, ...overrides };
}
