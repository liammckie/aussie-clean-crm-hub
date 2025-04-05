
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ErrorReporting } from '@/utils/errorReporting';
import { unifiedService } from '@/services/unified';
import { 
  UnifiedContactFormData, 
  EntityType, 
  ValidationErrorResponse 
} from '@/services/unified';

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
    createContact: createContactMutation.mutate,
    isCreatingContact: createContactMutation.isPending,
    updateContact: updateContactMutation.mutate,
    isUpdatingContact: updateContactMutation.isPending,
    deleteContact: deleteContactMutation.mutate,
    isDeletingContact: deleteContactMutation.isPending,
  };
}
