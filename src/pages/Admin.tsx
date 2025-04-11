
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddressMigrationTool } from '@/components/admin/AddressMigrationTool';
import { PageHeader } from '@/components/layout/PageHeader';

export default function Admin() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="System Administration"
        description="Manage system settings and maintenance tasks"
      />
      
      <Tabs defaultValue="data-migration" className="mt-6">
        <TabsList>
          <TabsTrigger value="data-migration">Data Migration</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="data-migration" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AddressMigrationTool />
            
            {/* Additional migration tools would go here */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Database Documentation</h3>
              <p className="text-sm text-muted-foreground">
                The unified address system allows us to store addresses for all entity types in a single table with consistent validation and geocoding.
              </p>
              <p className="text-sm text-muted-foreground">
                The migration tool helps move existing address data from legacy tables into the unified system.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="text-center py-8 text-muted-foreground">
            System settings section coming soon
          </div>
        </TabsContent>
        <TabsContent value="users">
          <div className="text-center py-8 text-muted-foreground">
            User management section coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
