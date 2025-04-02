import { Search, Bell, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function TopNavbar() {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <div className="border-b border-border/40 py-3 px-4 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        {state === "collapsed" && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <img 
          src="/lovable-uploads/6933e91a-9a74-4058-bce7-c29c11fba4f5.png" 
          alt="ERP Logo" 
          className="h-10 w-auto object-contain" 
        />
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
