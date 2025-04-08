
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatShortDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/financeCalculations";
import { ClientRecord } from "@/types/clients";
import { Building, MapPin, Phone, CalendarRange, ChevronRight } from "lucide-react";

interface ClientsGridProps {
  clients: ClientRecord[];
}

export function ClientsGrid({ clients }: ClientsGridProps) {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string | undefined): string => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "On Hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "Prospect":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card 
          key={client.id} 
          className="hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => navigate(`/clients/${client.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <h3 className="font-semibold">{client.business_name}</h3>
                {client.trading_name && (
                  <p className="text-sm text-muted-foreground">
                    Trading as: {client.trading_name}
                  </p>
                )}
              </div>
              <Badge variant="outline" className={getStatusColor(client.status)}>
                {client.status || "Unknown"}
              </Badge>
            </div>
            
            <div className="mt-4 space-y-2">
              {client.abn && (
                <p className="text-sm flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>ABN: {client.abn}</span>
                </p>
              )}
              
              {(client.address_line_1 || client.displayAddress) && (
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{client.displayAddress || client.address_line_1}</span>
                </p>
              )}
              
              {client.phone && (
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{client.phone}</span>
                </p>
              )}
              
              {client.onboarding_date && (
                <p className="text-sm flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-muted-foreground" />
                  <span>Onboarded: {formatShortDate(client.onboarding_date)}</span>
                </p>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">Sites</p>
                <p className="font-semibold">{client.site_count || 0}</p>
              </div>
              <div className="rounded-md border p-2">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="font-semibold">{formatCurrency(client.annual_revenue || 0)}</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-6 py-3 border-t flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/clients/${client.id}`);
              }}
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
