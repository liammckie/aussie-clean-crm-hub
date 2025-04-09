
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { 
  Home, 
  Users, 
  FileText, 
  Package, 
  Briefcase, 
  Map, 
  Calendar,
  BarChart,
  Database
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MobileSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function MobileSidebar({ expanded, onToggle }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : "AU";

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    return (
      <li>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `flex items-center space-x-2 py-3 px-4 rounded-lg 
            ${isActive ? "bg-slate-800 text-white font-medium" : "text-slate-300 hover:text-white hover:bg-slate-800/50"}`
          }
          onClick={() => setOpen(false)}
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <div className="md:hidden fixed top-0 left-0 z-50 w-full bg-slate-900 border-b border-slate-800 px-4 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Aussie Clean</h1>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[250px] bg-slate-900 border-r border-slate-800 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-800 text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white truncate">
                      {user?.email || "User"}
                    </p>
                    <p className="text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-2">
                <nav>
                  <ul className="space-y-1">
                    <NavItem to="/" icon={Home} label="Dashboard" />
                    <NavItem to="/clients" icon={Users} label="Clients" />
                    <NavItem to="/contracts" icon={FileText} label="Contracts" />
                    <NavItem to="/suppliers" icon={Package} label="Suppliers" />
                    <NavItem to="/work-orders" icon={Briefcase} label="Work Orders" />
                    <NavItem to="/sites" icon={Map} label="Sites" />
                    <NavItem to="/activities" icon={Calendar} label="Activities" />
                    <NavItem to="/sales" icon={BarChart} label="Sales" />
                    <NavItem to="/schema" icon={Database} label="Schema" />
                  </ul>
                </nav>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
