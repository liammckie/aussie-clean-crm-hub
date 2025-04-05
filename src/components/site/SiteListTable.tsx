
import React from 'react';
import { Button } from '@/components/ui/button';
import { SiteData } from '@/services/site';

interface SiteListTableProps {
  sites: SiteData[];
  clientId: string;
  onSiteUpdated: () => void;
}

export function SiteListTable({ sites, clientId, onSiteUpdated }: SiteListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2">Site Name</th>
            <th className="text-left py-2">Location</th>
            <th className="text-left py-2">Status</th>
            <th className="text-left py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id} className="border-t">
              <td className="py-3">{site.site_name}</td>
              <td className="py-3">{site.suburb}, {site.state}</td>
              <td className="py-3 capitalize">{site.status}</td>
              <td className="py-3">
                <Button variant="ghost" size="sm" onClick={() => {}}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
