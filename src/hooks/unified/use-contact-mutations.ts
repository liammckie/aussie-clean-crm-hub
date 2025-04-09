
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedService } from '@/services/unified';
import { EntityType as FormEntityType } from '@/types/form-types';
import { EntityType as DbEntityType } from '@/types/database-schema';
import { UnifiedContactFormData } from '@/types/form-types';
import { toast } from 'sonner';

// Convert form entity type to database entity type
const toDbEntityType = (formType: FormEntityType): DbEntityType => {
  // Use lowercase version as database expects lowercase values
  return formType.toLowerCase() as DbEntityType;
};

/**
 * Hook for contact mutations (create, update, delete)
 */
export function useContactMutations() {
  const queryClient = useQueryClient();

  /**
   * Create a new contact
   */
  const createContactMutation = useMutation({
    mutationFn: async ({
      entityType,
      entityId,
      contactData
    }: {
      entityType: FormEntityType;
      entityId: string;
      contactData: UnifiedContactFormData;
    }) => {
      const response = await unifiedService.createContact(
        toDbEntityType(entityType),
        entityId,
        contactData
      );
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['unified-contacts', variables.entityType, variables.entityId] });
      toast.success('Contact added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create contact: ${error.message}`);
    }
  });

  /**
   * Update an existing contact
   */
  const updateContactMutation = useMutation({
    mutationFn: async ({
      contactId,
      contactData
    }: {
      contactId: string;
      contactData: Partial<UnifiedContactFormData>;
    }) => {
      const response = await unifiedService.updateContact(contactId, contactData);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (_, variables) => {
      // We don't have entity information here, so invalidate all contact queries
      queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
      toast.success('Contact updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update contact: ${error.message}`);
    }
  });

  /**
   * Delete a contact
   */
  const deleteContactMutation = useMutation({
    mutationFn: async ({ contactId }: { contactId: string }) => {
      const response = await unifiedService.deleteContact(contactId);
      
      if ('category' in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: () => {
      // We don't have entity information here, so invalidate all contact queries
      queryClient.invalidateQueries({ queryKey: ['unified-contacts'] });
      toast.success('Contact deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    }
  });

  return {
    createContact: createContactMutation.mutateAsync,
    updateContact: updateContactMutation.mutateAsync,
    deleteContact: deleteContactMutation.mutateAsync,
    isCreatingContact: createContactMutation.isPending,
    isUpdatingContact: updateContactMutation.isPending,
    isDeletingContact: deleteContactMutation.isPending
  };
}
