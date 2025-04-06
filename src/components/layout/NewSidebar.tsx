
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  BarChart4,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define the navigation item type
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  badge?: string | number;
  onClick?: () => void;
}

// NavItem component for cleaner sidebar code
const NavItem = ({ to, icon, label, expanded, badge, onClick }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center p-2 my-1 transition-colors duration-200 rounded-md hover:bg-slate-800",
          isActive ? "bg-slate-800 text-primary" : "text-slate-300",
          expanded ? "justify-start" : "justify-center"
        )
      }
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
    >
      <div className={cn("flex items-center", expanded ? "justify-start" : "justify-center", "w-full")}>
        <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
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
};

interface NewSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export const NewSidebar: React.FC<NewSidebarProps> = ({ 
  expanded,
  onToggle
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

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
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={expanded}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex flex-col justify-between flex-1">
          <nav className="flex-1" aria-label="Main navigation">
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
          
          {/* Bottom actions */}
          <div className="mt-auto">
            <NavItem 
              to="/settings" 
              icon={<Settings size={20} />} 
              label="Settings" 
              expanded={expanded} 
            />
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center p-2 my-1 transition-colors duration-200 rounded-md hover:bg-slate-800 w-full",
                "text-slate-300",
                expanded ? "justify-start" : "justify-center"
              )}
              aria-label="Logout"
            >
              <div className={cn("flex items-center", expanded ? "justify-start" : "justify-center", "w-full")}>
                <span className="flex-shrink-0" aria-hidden="true"><LogOut size={20} /></span>
                {expanded && (
                  <span className="ml-3 text-sm font-medium flex-grow">Logout</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
