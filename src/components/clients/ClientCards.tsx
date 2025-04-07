
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ClientRecord } from "@/types/clients";

interface ClientsCardsProps {
  clients: ClientRecord[];
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
}

const ClientCards: React.FC<ClientsCardsProps> = ({
  clients,
  formatDate,
  getStatusColor,
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4">
      {clients.map((client) => (
        <Card key={client.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{client.business_name}</h3>
                {client.trading_name && (
                  <p className="text-xs text-muted-foreground">
                    Trading as: {client.trading_name}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div>
                <p className="text-muted-foreground text-xs">ABN</p>
                <p>{client.abn || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <Badge className={getStatusColor(client.status || '')}>
                  {client.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Annual Revenue</p>
                <p>{formatCurrency(client.annual_revenue || 0)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total Sites</p>
                <p>{client.site_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientCards;
