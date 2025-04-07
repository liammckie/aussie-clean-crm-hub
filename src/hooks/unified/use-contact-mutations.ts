import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { unifiedService } from '@/services/unified';
import { UnifiedContactFormData, EntityType } from '@/types/form-types';
import { ValidationErrorResponse } from '@/services/unified/types';
import { isApiError } from '@/types/api-response';

/**
 * Hook for contact mutations (create, update, delete)
 */
export function useContactMutations() {
  const queryClient = useQueryClient();

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
      
      // Ensure is_primary is a boolean
      const processedData = {
        ...contactData,
        is_primary: Boolean(contactData.is_primary)
      };
      
      const response = await unifiedService.createContact(entityType, entityId, processedData);
      
      if (isApiError(response)) {
        if (response.category === 'validation') {
          console.warn('Validation error during contact creation:', response);
          return response as ValidationErrorResponse;
        }
        
        console.error('Error creating contact:', response);
        throw new Error(response.message);
      }
      
      console.log('Contact created successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data && !('category' in data)) {
        console.log('Invalidating contacts query after successful creation');
        queryClient.invalidateQueries({ queryKey: ['unified-contacts', variables.entityType, variables.entityId] });
        toast.success('Contact created successfully!');
      }
      return data;
    },
    onError: (error) => {
      console.error('Contact creation error:', error);
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
      
      // Ensure is_primary is a boolean if present
      const processedData = {
        ...contactData,
        is_primary: contactData.is_primary !== undefined ? Boolean(contactData.is_primary) : undefined
      };
      
      const response = await unifiedService.updateContact(contactId, processedData);
      
      if (isApiError(response)) {
        if (response.category === 'validation') {
          console.warn('Validation error during contact update:', response);
          return response as ValidationErrorResponse;
        }
        
        console.error('Error updating contact:', response);
        throw new Error(response.message);
      }
      
      console.log('Contact updated successfully:', response.data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data && !('category' in data)) {
        console.log('Invalidating contacts query after successful update');
        queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
      }
      return data;
    },
    onError: (error) => {
      console.error('Contact update error:', error);
      ErrorReporting.captureException(error as Error);
    }
  });

  // Mutation to delete a contact
  const deleteContactMutation = useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      console.log(`Deleting contact ${contactId}`);
      const response = await unifiedService.deleteContact(contactId);
      
      if (isApiError(response)) {
        console.error('Error deleting contact:', response);
        throw new Error(response.message);
      }
      
      return { success: true };
    },
    onSuccess: () => {
      console.log('Contact deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
    },
    onError: (error) => {
      console.error('Contact deletion error:', error);
      ErrorReporting.captureException(error as Error);
    }
  });

  return {
    createContact: createContactMutation.mutateAsync,
    isCreatingContact: createContactMutation.isPending,
    updateContact: updateContactMutation.mutateAsync,
    isUpdatingContact: updateContactMutation.isPending,
    deleteContact: deleteContactMutation.mutateAsync,
    isDeletingContact: deleteContactMutation.isPending,
  };
}
