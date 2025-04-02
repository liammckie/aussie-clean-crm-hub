
import { Search, Bell, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNavbar() {
  return (
    <div className="border-b border-border/40 py-3 px-4 flex items-center justify-between">
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-8 bg-muted/50 border-muted" 
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <a href="https://www.scserp.com.au" className="text-xs text-muted-foreground">
          www.scserp.com.au
        </a>
      </div>
    </div>
  );
}
