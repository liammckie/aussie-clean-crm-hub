
import React from "react";
import { Link } from "react-router-dom";
import { User, CalendarClock, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientRecord } from "@/services/client";

interface ClientCardsProps {
  clients: ClientRecord[];
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

const ClientCards = ({ clients, formatDate, getStatusColor }: ClientCardsProps) => {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{client.business_name}</h3>
                <p className="text-sm text-muted-foreground">{client.trading_name || ''}</p>
              </div>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{client.industry || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span>Client since {formatDate(client.onboarding_date)}</span>
              </div>
              <div className="flex text-sm">
                <span>ABN: {client.abn || 'N/A'}</span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button size="sm" variant="outline" asChild>
                <Link to={`/clients/${client.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientCards;
