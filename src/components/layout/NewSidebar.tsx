
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  Truck,
  Package,
  Calendar,
  Building,
  ClipboardList,
  BarChart4
} from 'lucide-react';

// Define the navigation item type
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  badge?: string | number;
}

// NavItem component for cleaner sidebar code
const NavItem = ({ to, icon, label, expanded, badge }: NavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center p-2 my-1 transition-colors duration-200 rounded-md hover:bg-slate-800",
        isActive ? "bg-slate-800 text-primary" : "text-slate-300",
        expanded ? "justify-start" : "justify-center"
      )
    }
  >
    <div className={cn("flex items-center", expanded ? "justify-start" : "justify-center", "w-full")}>
      <span className="flex-shrink-0">{icon}</span>
      {expanded && (
        <span className="ml-3 text-sm font-medium flex-grow">{label}</span>
      )}
      {expanded && badge && (
        <div className="ml-auto bg-slate-700 text-xs px-2 py-0.5 rounded-full">
          {badge}
        </div>
      )}
    </div>
  </NavLink>
);

interface NewSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export const NewSidebar: React.FC<NewSidebarProps> = ({ 
  expanded,
  onToggle
}) => {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 h-screen z-40 transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex flex-col h-full p-3 bg-slate-900 shadow-lg">
        {/* Sidebar header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className={cn(
              "font-semibold text-white transition-opacity duration-300",
              expanded ? "opacity-100" : "opacity-0 w-0 hidden"
            )}>
              Aussie Clean ERP
            </span>
          </div>
          <button 
            onClick={onToggle}
            className="p-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors duration-200"
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col justify-between flex-1">
          <nav className="flex-1">
            <NavItem 
              to="/" 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
              expanded={expanded} 
            />
            <NavItem 
              to="/clients" 
              icon={<Users size={20} />} 
              label="Clients" 
              expanded={expanded} 
              badge={4}
            />
            <NavItem 
              to="/contracts" 
              icon={<FileText size={20} />} 
              label="Contracts" 
              expanded={expanded} 
            />
            <NavItem 
              to="/suppliers" 
              icon={<Truck size={20} />} 
              label="Suppliers" 
              expanded={expanded} 
            />
            <NavItem 
              to="/sites" 
              icon={<Building size={20} />} 
              label="Sites" 
              expanded={expanded} 
            />
            <NavItem 
              to="/inventory" 
              icon={<Package size={20} />} 
              label="Inventory" 
              expanded={expanded} 
            />
            <NavItem 
              to="/schedule" 
              icon={<Calendar size={20} />} 
              label="Schedule" 
              expanded={expanded} 
            />
            <NavItem 
              to="/tasks" 
              icon={<ClipboardList size={20} />} 
              label="Tasks" 
              expanded={expanded} 
              badge={12}
            />
            <NavItem 
              to="/reports" 
              icon={<BarChart4 size={20} />} 
              label="Reports" 
              expanded={expanded} 
            />
          </nav>
          
          {/* Bottom settings link */}
          <NavItem 
            to="/settings" 
            icon={<Settings size={20} />} 
            label="Settings" 
            expanded={expanded} 
          />
        </div>
      </div>
    </div>
  );
};
