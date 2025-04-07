
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { ClientRecord } from "@/types/clients";

interface ClientsTableProps {
  clients: ClientRecord[];
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  formatDate,
  getStatusColor,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>ABN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead className="hidden md:table-cell">Annual Revenue</TableHead>
            <TableHead className="hidden md:table-cell">Total Sites</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="hover:bg-accent/30">
              <TableCell className="font-medium">
                <div>
                  <p className="font-medium">{client.business_name}</p>
                  {client.trading_name && (
                    <p className="text-xs text-muted-foreground">
                      Trading as: {client.trading_name}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{client.abn || "-"}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(client.status || '')}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>{client.industry || "-"}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatCurrency(client.annual_revenue || 0)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.site_count || 0}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
