
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  BarChart3,
  Building,
  ClipboardCheck,
  Database,
  FileText,
  Home,
  LayoutDashboard,
  Map,
  Truck,
  Contact,
  Settings,
  Activity,
  DollarSign,
} from 'lucide-react';

interface NewSidebarProps {
  expanded?: boolean;
  onToggle?: () => void;
}

export function NewSidebar({ expanded, onToggle }: NewSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Sales', path: '/sales', icon: <DollarSign className="h-5 w-5" /> },
    { name: 'Clients', path: '/clients', icon: <Building className="h-5 w-5" /> },
    { name: 'Sites', path: '/sites', icon: <Map className="h-5 w-5" /> },
    { name: 'Contracts', path: '/contracts', icon: <FileText className="h-5 w-5" /> },
    { name: 'Work Orders', path: '/work-orders', icon: <ClipboardCheck className="h-5 w-5" /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck className="h-5 w-5" /> },
    { name: 'Activities', path: '/activities', icon: <Activity className="h-5 w-5" /> },
    { name: 'Reports', path: '/reports', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Contacts', path: '/contacts', icon: <Contact className="h-5 w-5" /> },
    { name: 'Schema', path: '/schema', icon: <Database className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background pt-16">
      <div className="h-full overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <div className="mr-2">{item.icon}</div>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
