import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { unifiedService } from '@/services/unified';
import { 
  UnifiedAddressFormData, 
  UnifiedContactFormData, 
  EntityType, 
  ValidationErrorResponse 
} from '@/services/unified';
import { useUnifiedAddressesRealtimeSync, useUnifiedContactsRealtimeSync } from './use-realtime-sync';

/**
 * Hook for managing unified addresses and contacts for various entity types
 */
export function useUnifiedEntities() {
  const queryClient = useQueryClient();
  
  // Query for fetching addresses for an entity
  const useEntityAddresses = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Set up realtime sync for this entity's addresses
    useUnifiedAddressesRealtimeSync(entityType, entityId);
    
    return useQuery({
      queryKey: ['unified-addresses', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        console.log(`Fetching addresses for ${entityType} ${entityId}...`);
        const response = await unifiedService.getAddresses(entityType, entityId);
        if ('category' in response) {
          console.error(`Error fetching addresses for ${entityType} ${entityId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched addresses for ${entityType} ${entityId} successfully:`, response.data);
        return response.data || []; 
      },
      enabled: !!entityType && !!entityId,
    });
  };

  // Query for fetching contacts for an entity
  const useEntityContacts = (entityType: EntityType | undefined, entityId: string | undefined) => {
    // Set up realtime sync for this entity's contacts
    useUnifiedContactsRealtimeSync(entityType, entityId);
    
    return useQuery({
      queryKey: ['unified-contacts', entityType, entityId],
      queryFn: async () => {
        if (!entityType || !entityId) throw new Error('Entity type and ID are required');
        
        console.log(`Fetching contacts for ${entityType} ${entityId}...`);
        const response = await unifiedService.getContacts(entityType, entityId);
        if ('category' in response) {
          console.error(`Error fetching contacts for ${entityType} ${entityId}:`, response);
          throw new Error(response.message);
        }
        console.log(`Fetched contacts for ${entityType} ${entityId} successfully:`, response.data);
        return response.data || [];
      },
      enabled: !!entityType && !!entityId,
    });
  };

  // Mutation to create a new address
  const createAddressMutation = useMutation({
    mutationFn: async ({ 
      entityType, 
      entityId, 
      addressData 
    }: { 
      entityType: EntityType; 
      entityId: string; 
      addressData: Omit<UnifiedAddressFormData, 'entity_type' | 'entity_id'> 
    }) => {
      console.log(`Creating address for ${entityType} ${entityId} with data:`, addressData);
      const response = await unifiedService.createAddress(entityType, entityId, addressData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during address creation:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error creating address:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Address created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating addresses query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['unified-addresses', variables.entityType, variables.entityId] });
        toast.success('Address created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to update an address
  const updateAddressMutation = useMutation({
    mutationFn: async ({ 
      addressId, 
      addressData 
    }: { 
      addressId: string;
      addressData: Partial<UnifiedAddressFormData>;
    }) => {
      console.log(`Updating address ${addressId} with data:`, addressData);
      const response = await unifiedService.updateAddress(addressId, addressData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during address update:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error updating address:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Address updated successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating addresses query after successful update');
        queryClient.invalidateQueries({ queryKey: ['unified-addresses'] });
        toast.success('Address updated successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to delete an address
  const deleteAddressMutation = useMutation({
    mutationFn: async ({ addressId }: { addressId: string }) => {
      console.log(`Deleting address ${addressId}`);
      const response = await unifiedService.deleteAddress(addressId);
      
      if ('category' in response) {
        console.error('Error deleting address:', response);
        throw new Error(response.message);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-addresses'] });
      toast.success('Address deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete address');
    }
  });

  // Mutation to create a new contact
  const createContactMutation = useMutation({
    mutationFn: async ({ 
      entityType, 
      entityId, 
      contactData 
    }: { 
      entityType: EntityType; 
      entityId: string; 
      contactData: Omit<UnifiedContactFormData, 'entity_type' | 'entity_id'> 
    }) => {
      console.log(`Creating contact for ${entityType} ${entityId} with data:`, contactData);
      const response = await unifiedService.createContact(entityType, entityId, contactData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during contact creation:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error creating contact:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Contact created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating contacts query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['unified-contacts', variables.entityType, variables.entityId] });
        toast.success('Contact created successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to update a contact
  const updateContactMutation = useMutation({
    mutationFn: async ({ 
      contactId, 
      contactData 
    }: { 
      contactId: string;
      contactData: Partial<UnifiedContactFormData>;
    }) => {
      console.log(`Updating contact ${contactId} with data:`, contactData);
      const response = await unifiedService.updateContact(contactId, contactData);
      
      if ('category' in response && response.category === 'validation') {
        console.warn('Validation error during contact update:', response);
        return response as ValidationErrorResponse;
      }
      
      if ('category' in response) {
        console.error('Error updating contact:', response);
        toast.error(`Error: ${response.message}`);
        throw new Error(response.message);
      }
      
      console.log('Contact updated successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data || !('category' in data)) {
        console.log('Invalidating contacts query after successful update');
        queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
        toast.success('Contact updated successfully!');
      }
      return data;
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to delete a contact
  const deleteContactMutation = useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      console.log(`Deleting contact ${contactId}`);
      const response = await unifiedService.deleteContact(contactId);
      
      if ('category' in response) {
        console.error('Error deleting contact:', response);
        throw new Error(response.message);
      }
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
      toast.success('Contact deleted successfully!');
    },
    onError: (error) => {
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to delete contact');
    }
  });

  return {
    // Queries
    useEntityAddresses,
    useEntityContacts,
    
    // Address Mutations
    createAddress: createAddressMutation.mutate,
    isCreatingAddress: createAddressMutation.isPending,
    updateAddress: updateAddressMutation.mutate,
    isUpdatingAddress: updateAddressMutation.isPending,
    deleteAddress: deleteAddressMutation.mutate,
    isDeletingAddress: deleteAddressMutation.isPending,
    
    // Contact Mutations
    createContact: createContactMutation.mutate,
    isCreatingContact: createContactMutation.isPending,
    updateContact: updateContactMutation.mutate,
    isUpdatingContact: updateContactMutation.isPending,
    deleteContact: deleteContactMutation.mutate,
    isDeletingContact: deleteContactMutation.isPending,
  };
}
