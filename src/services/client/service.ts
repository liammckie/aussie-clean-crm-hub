
import { clientCrudService, clientContactService, clientAddressService } from './services';

/**
 * Client service containing all client-related operations with business logic
 */
export const clientService = {
  // Client CRUD operations
  getAllClients: clientCrudService.getAllClients,
  getClientById: clientCrudService.getClientById,
  createClient: clientCrudService.createClient,
  updateClient: clientCrudService.updateClient,
  deleteClient: clientCrudService.deleteClient,

  // Contact management
  getClientContacts: clientContactService.getClientContacts,
  createClientContact: clientContactService.createClientContact,

  // Address management
  getClientAddresses: clientAddressService.getClientAddresses,
  createClientAddress: clientAddressService.createClientAddress,
  deleteClientAddress: clientAddressService.deleteClientAddress
};
