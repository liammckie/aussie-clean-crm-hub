
import { useEntityQueries } from './unified/use-entity-queries';
import { useAddressMutations } from './unified/use-address-mutations';
import { useContactMutations } from './unified/use-contact-mutations';

/**
 * Hook for managing unified addresses and contacts for various entity types
 */
export function useUnifiedEntities() {
  const { useEntityAddresses, useEntityContacts } = useEntityQueries();
  const addressMutations = useAddressMutations();
  const contactMutations = useContactMutations();
  
  return {
    // Queries
    useEntityAddresses,
    useEntityContacts,
    
    // Address Mutations
    ...addressMutations,
    
    // Contact Mutations
    ...contactMutations,
  };
}
