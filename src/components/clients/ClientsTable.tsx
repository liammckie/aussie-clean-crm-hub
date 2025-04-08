
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatShortDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/financeCalculations";
import { ClientRecord } from "@/types/clients";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ClientsTableProps {
  clients: ClientRecord[];
  getStatusColor?: (status: string | undefined) => string;
  formatDate?: (date: string) => string;
}

export function ClientsTable({ 
  clients, 
  getStatusColor = getDefaultStatusColor,
  formatDate = formatShortDate 
}: ClientsTableProps) {
  const navigate = useNavigate();
  
  const handleRowClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Sites</TableHead>
            <TableHead className="hidden lg:table-cell">Onboarding Date</TableHead>
            <TableHead className="hidden lg:table-cell">Annual Revenue</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(client.id)}
            >
              <TableCell>
                <div>
                  <div className="font-medium">{client.business_name}</div>
                  {client.trading_name && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Trading as: {client.trading_name}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={getStatusColor(client.status)}
                >
                  {client.status || "Unknown"}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {client.site_count || 0}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {client.onboarding_date 
                  ? formatDate(client.onboarding_date)
                  : "Not set"}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {formatCurrency(client.annual_revenue || 0)}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(client.id);
                  }}
                >
                  View
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function for status color
function getDefaultStatusColor(status: string | undefined): string {
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
}
