
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Package, 
  Briefcase, 
  Map, 
  Calendar, 
  BarChart,
  Database,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NewSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function NewSidebar({ expanded, onToggle }: NewSidebarProps) {
  const { user } = useAuth();
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AU';

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string }) => {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <li>
              <NavLink
                to={to}
                className={({ isActive }) => cn(
                  'flex items-center space-x-2 py-3 px-4 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors',
                  isActive ? 'bg-slate-800 text-white font-medium' : 'bg-transparent'
                )}
              >
                <Icon size={20} />
                {expanded && <span>{label}</span>}
              </NavLink>
            </li>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div 
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 bg-slate-900 border-r border-slate-800 transition-all duration-300',
        expanded ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 flex justify-between items-center border-b border-slate-800">
          {expanded ? (
            <h1 className="text-xl font-bold text-white">Aussie Clean</h1>
          ) : (
            <div className="mx-auto">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-slate-800 text-white">AC</AvatarFallback>
              </Avatar>
            </div>
          )}
          <button 
            onClick={onToggle}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
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
        
        <div className="p-4 border-t border-slate-800">
          {expanded ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-slate-800 text-white">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-slate-800 text-white">{initials}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
