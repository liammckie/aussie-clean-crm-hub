
import React from 'react';
import { SiteData } from '@/services/site/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SiteListTableProps {
  sites: SiteData[];
  clientId: string;
  onSiteUpdated: () => void;
}

export function SiteListTable({ sites, clientId, onSiteUpdated }: SiteListTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
      case 'pending_activation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Site Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.id}>
              <TableCell className="font-medium">
                <Link to={`/sites/${site.id}`} className="hover:underline">
                  {site.site_name}
                </Link>
                <div className="text-xs text-muted-foreground">{site.site_code}</div>
              </TableCell>
              <TableCell>
                {site.address_line_1}, {site.suburb}, {site.state}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(site.status)}>
                  {site.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/sites/${site.id}/edit`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
