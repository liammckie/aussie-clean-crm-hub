
import React from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Building } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientsTableProps {
  clients: any[];
  formatDate: (date: string | null | undefined) => string;
  getStatusColor: (status: string | null | undefined) => string;
}

const ClientsTable = ({ clients, formatDate, getStatusColor }: ClientsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Business Name</TableHead>
          <TableHead>ABN</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead className="hidden lg:table-cell">Address</TableHead>
          <TableHead>Onboarding Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <div className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                  {client.business_name?.charAt(0) || "?"}
                </div>
                <div>
                  <div>{client.business_name}</div>
                  {client.trading_name && client.trading_name !== client.business_name && (
                    <div className="text-xs text-muted-foreground">
                      Trading as: {client.trading_name}
                    </div>
                  )}
                </div>
              </div>
            </TableCell>
            <TableCell>{client.abn || "N/A"}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
            </TableCell>
            <TableCell>{client.industry || "N/A"}</TableCell>
            <TableCell className="hidden lg:table-cell">
              {client.displayAddress ? (
                <div className="flex items-center gap-1 max-w-[200px] truncate">
                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="truncate" title={client.displayAddress}>
                    {client.displayAddress}
                  </span>
                </div>
              ) : "No address"}
            </TableCell>
            <TableCell>{formatDate(client.onboarding_date)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border">
                  <DropdownMenuItem asChild>
                    <Link to={`/clients/${client.id}`}>View details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/clients/${client.id}/edit`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
