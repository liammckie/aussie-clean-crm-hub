
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Input,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Search, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ContactsTable, { UnifiedContactRecord } from '@/components/shared/ContactsTable';
import { toast } from 'sonner';
import { EntityType } from '@/services/unified/types';

type FilterType = {
  search: string;
  entityType: EntityType | 'all';
  contactType: string | 'all';
};

const Contacts = () => {
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    entityType: 'all',
    contactType: 'all',
  });
  const [searchInput, setSearchInput] = useState('');

  // Function to get all contacts
  const getAllContacts = async () => {
    try {
      let query = supabase
        .from('unified_contacts')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,mobile.ilike.%${filters.search}%`
        );
      }

      if (filters.entityType !== 'all') {
        query = query.eq('entity_type', filters.entityType);
      }

      if (filters.contactType !== 'all') {
        query = query.eq('contact_type', filters.contactType);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as UnifiedContactRecord[];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  };

  const {
    data: contacts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['all-contacts', filters],
    queryFn: getAllContacts,
  });

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEntityTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      entityType: value as EntityType | 'all',
    }));
  };

  const handleContactTypeChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      contactType: value,
    }));
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('unified_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      
      toast.success('Contact deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete contact');
      console.error('Delete error:', error);
    }
  };

  const handleEditContact = (contact: UnifiedContactRecord) => {
    // For now, just show a toast with contact details
    toast.info(
      <div>
        <p className="font-medium">{contact.name}</p>
        <p>Type: {contact.contact_type}</p>
        <p>Entity: {contact.entity_type}</p>
        <p className="text-xs text-gray-500 mt-1">Coming soon: edit functionality</p>
      </div>
    );
  };

  const entityTypes = [
    { value: 'all', label: 'All Entity Types' },
    { value: 'client', label: 'Client' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'employee', label: 'Employee' },
    { value: 'site', label: 'Site' },
    { value: 'internal', label: 'Internal' },
  ];

  const contactTypes = [
    { value: 'all', label: 'All Contact Types' },
    { value: 'Primary', label: 'Primary' },
    { value: 'Billing', label: 'Billing' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Support', label: 'Support' },
    { value: 'Sales', label: 'Sales' },
  ];

  return (
    <>
      <Helmet>
        <title>Contacts | CleanMap</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Contacts</h1>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>
              Find contacts across all entities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name, email or phone"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                />
              </div>

              <Select onValueChange={handleEntityTypeChange} defaultValue={filters.entityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={handleContactTypeChange} defaultValue={filters.contactType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Contact Type" />
                </SelectTrigger>
                <SelectContent>
                  {contactTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ContactsTable
              contacts={contacts || []}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              isLoading={isLoading}
              showEntityType={true}
            />
            
            {error && (
              <div className="mt-4 p-4 border rounded bg-red-50 text-red-800">
                Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Contacts;
