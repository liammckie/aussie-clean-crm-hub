
import React from "react";
import { Link } from "react-router-dom";
import { Building, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientRecord } from "@/services/client";

interface ClientsTableProps {
  clients: ClientRecord[];
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
}

const ClientsTable = ({ clients, formatDate, getStatusColor }: ClientsTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Business Name</TableHead>
            <TableHead>ABN</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Onboarding Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">
                <Link 
                  to={`/clients/${client.id}`} 
                  className="hover:underline flex items-center gap-2"
                >
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div>{client.business_name}</div>
                    {client.trading_name && client.trading_name !== client.business_name && (
                      <div className="text-xs text-muted-foreground">
                        Trading as: {client.trading_name}
                      </div>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell>{client.abn || 'N/A'}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(client.status)}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>{client.industry || 'N/A'}</TableCell>
              <TableCell>{formatDate(client.onboarding_date)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/clients/${client.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/clients/${client.id}/edit`}>Edit Client</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Create Quote</DropdownMenuItem>
                    <DropdownMenuItem>Create Contract</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
