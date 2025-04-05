
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, MapPin, Building } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientCardsProps {
  clients: any[];
  formatDate: (date: string | null | undefined) => string;
  getStatusColor: (status: string | null | undefined) => string;
}

const ClientCards = ({ clients, formatDate, getStatusColor }: ClientCardsProps) => {
  return (
    <div className="space-y-4">
      {clients.map((client) => (
        <Card key={client.id}>
          <CardHeader className="px-4 py-3 flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                {client.business_name?.charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-medium text-base">{client.business_name}</h3>
                {client.trading_name && client.trading_name !== client.business_name && (
                  <p className="text-xs text-muted-foreground">
                    Trading as: {client.trading_name}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
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
          </CardHeader>
          <CardContent className="px-4 py-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">ABN</p>
                <p>{client.abn || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Industry</p>
                <p>{client.industry || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground text-xs">Address</p>
                {client.displayAddress ? (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="truncate text-sm">{client.displayAddress}</p>
                  </div>
                ) : (
                  <p>No address</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Onboarding Date</p>
                <p>{formatDate(client.onboarding_date)}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <Badge className={`${getStatusColor(client.status)} text-xs mt-1`}>
                  {client.status}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-4 py-3 flex justify-end border-t">
            <Button asChild size="sm" variant="outline">
              <Link to={`/clients/${client.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ClientCards;
