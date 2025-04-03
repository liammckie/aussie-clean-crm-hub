
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileCheck, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Settings, 
  FileText, 
  Truck, 
  Activity,
  ChevronLeft,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { PermissionType } from "@/domains/users/types";

// Define menu items in a single location for easy management
const getMenuItems = (canAccessModule: (moduleName: string) => boolean) => [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Clients", path: "/clients", module: "clients" },
  { icon: FileCheck, label: "Contracts", path: "/contracts", module: "contracts" },
  { icon: TrendingUp, label: "Sales", path: "/sales", module: "sales" },
  { icon: Briefcase, label: "Work Orders", path: "/work-orders", module: "workOrders" },
  { icon: Calendar, label: "Activities", path: "/activities", module: "activities" },
  { icon: DollarSign, label: "Finance", path: "/finance", module: "finance" },
  { icon: UserCog, label: "User Management", path: "/users", module: "users" },
  { icon: Settings, label: "Settings", path: "/settings", module: "settings" },
  { icon: FileText, label: "Quick Forms", path: "/forms", module: "forms" },
  { icon: Truck, label: "Suppliers", path: "/suppliers", module: "suppliers" },
  { icon: Activity, label: "Activity Log", path: "/logs", module: "logs" },
].filter(item => !item.module || canAccessModule(item.module));

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function NewSidebar({ expanded, onToggle }: SidebarProps) {
  const location = useLocation();
  const { canAccessModule } = usePermissions();
  
  // Filter menu items based on user permissions
  const menuItems = getMenuItems(canAccessModule);
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col transition-all duration-300 ease-in-out",
        expanded ? "w-64" : "w-20",
        "sidebar-glass"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <h2 className={cn(
          "text-xl font-bold text-white transition-opacity duration-200",
          expanded ? "opacity-100" : "opacity-0"
        )}>
          SCSERP
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="text-white hover:bg-white/10"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform duration-300",
            !expanded && "rotate-180"
          )} />
        </Button>
      </div>
      
      {/* Sidebar Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md sidebar-item",
                    isActive && "bg-white/10 font-medium"
                  )}
                >
                  <item.icon className="flex-shrink-0 w-5 h-5" />
                  <span className={cn(
                    "ml-3 transition-all duration-200",
                    !expanded && "opacity-0 w-0 overflow-hidden"
                  )}>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/10">
        <Button 
          onClick={onToggle}
          variant="outline" 
          className="w-full text-white bg-black/20 border-white/10 hover:bg-white/10 hover:text-white"
        >
          {expanded ? "Collapse Sidebar" : ""}
        </Button>
      </div>
    </aside>
  );
}
