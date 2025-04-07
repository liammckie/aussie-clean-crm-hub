
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building, Users, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SiteData } from '@/services/site/types';

interface SiteCardProps {
  site: SiteData;
  onDelete: () => Promise<void>;
}

export function SiteCard({ site, onDelete }: SiteCardProps) {
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{site.site_name}</CardTitle>
          <Badge className={getStatusColor(site.status)}>
            {site.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm line-clamp-2">
              {site.address_line_1}, {site.suburb}, {site.state}
            </p>
          </div>
          
          {site.site_type && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{site.site_type}</p>
            </div>
          )}
          
          {site.site_contact_name && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{site.site_contact_name}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/sites/${site.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete()} 
            className="text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to={`/sites/${site.id}`}>
            View <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
