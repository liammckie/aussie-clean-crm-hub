
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  ClipboardList, 
  BookOpen, 
  Settings, 
  FileText, 
  Database,
  Map
} from 'lucide-react';

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavigationItem({ href, icon, label, active }: NavigationItemProps) {
  return (
    <li>
      <Button
        asChild
        variant={active ? "default" : "ghost"}
        className="w-full justify-start"
      >
        <Link to={href}>
          {icon}
          <span className="ml-2">{label}</span>
        </Link>
      </Button>
    </li>
  );
}

interface NavigationProps {
  activePath?: string;
}

export function Navigation({ activePath }: NavigationProps) {
  // Use the router hook to get the current location
  const location = useLocation();
  
  // If activePath is not provided, use the current location path
  const currentPath = activePath || location.pathname;

  return (
    <nav className="space-y-1">
      <ul className="space-y-1">
        <NavigationItem 
          href="/" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          active={currentPath === '/'} 
        />
        <NavigationItem 
          href="/clients" 
          icon={<Building2 className="h-5 w-5" />} 
          label="Clients" 
          active={currentPath.startsWith('/clients')} 
        />
        <NavigationItem 
          href="/sites" 
          icon={<Map className="h-5 w-5" />} 
          label="Sites" 
          active={currentPath.startsWith('/sites')} 
        />
        <NavigationItem 
          href="/contracts" 
          icon={<FileText className="h-5 w-5" />} 
          label="Contracts" 
          active={currentPath.startsWith('/contracts')} 
        />
        <NavigationItem 
          href="/work-orders" 
          icon={<ClipboardList className="h-5 w-5" />} 
          label="Work Orders" 
          active={currentPath.startsWith('/work-orders')} 
        />
        <NavigationItem 
          href="/suppliers" 
          icon={<Users className="h-5 w-5" />}
          label="Suppliers" 
          active={currentPath.startsWith('/suppliers')} 
        />
        <NavigationItem 
          href="/activities" 
          icon={<ClipboardList className="h-5 w-5" />}
          label="Activities" 
          active={currentPath.startsWith('/activities')} 
        />
        <NavigationItem 
          href="/admin" 
          icon={<Settings className="h-5 w-5" />}
          label="Admin" 
          active={currentPath.startsWith('/admin')} 
        />
        <NavigationItem 
          href="/schema" 
          icon={<Database className="h-5 w-5" />}
          label="Schema" 
          active={currentPath.startsWith('/schema')} 
        />
        <NavigationItem 
          href="/docs" 
          icon={<BookOpen className="h-5 w-5" />}
          label="Documentation" 
          active={currentPath.startsWith('/docs')} 
        />
      </ul>
    </nav>
  );
}
