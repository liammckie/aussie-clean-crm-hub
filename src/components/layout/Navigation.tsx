
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
import { cn } from '@/lib/utils';

interface NavigationItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
}

function NavigationItem({ href, icon, label, active, expanded = true }: NavigationItemProps) {
  return (
    <li>
      <Button
        asChild
        variant={active ? "default" : "ghost"}
        className={cn(
          "w-full justify-start", 
          !expanded && "px-2 justify-center"
        )}
      >
        <Link to={href}>
          {icon}
          <span className={cn("ml-2", !expanded && "hidden")}>{label}</span>
        </Link>
      </Button>
    </li>
  );
}

interface NavigationProps {
  activePath?: string;
  expanded?: boolean;
}

export function Navigation({ activePath, expanded = true }: NavigationProps) {
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
          expanded={expanded}
        />
        <NavigationItem 
          href="/clients" 
          icon={<Building2 className="h-5 w-5" />} 
          label="Clients" 
          active={currentPath.startsWith('/clients')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/sites" 
          icon={<Map className="h-5 w-5" />} 
          label="Sites" 
          active={currentPath.startsWith('/sites')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/contracts" 
          icon={<FileText className="h-5 w-5" />} 
          label="Contracts" 
          active={currentPath.startsWith('/contracts')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/work-orders" 
          icon={<ClipboardList className="h-5 w-5" />} 
          label="Work Orders" 
          active={currentPath.startsWith('/work-orders')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/suppliers" 
          icon={<Users className="h-5 w-5" />}
          label="Suppliers" 
          active={currentPath.startsWith('/suppliers')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/activities" 
          icon={<ClipboardList className="h-5 w-5" />}
          label="Activities" 
          active={currentPath.startsWith('/activities')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/admin" 
          icon={<Settings className="h-5 w-5" />}
          label="Admin" 
          active={currentPath.startsWith('/admin')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/schema" 
          icon={<Database className="h-5 w-5" />}
          label="Schema" 
          active={currentPath.startsWith('/schema')} 
          expanded={expanded}
        />
        <NavigationItem 
          href="/docs" 
          icon={<BookOpen className="h-5 w-5" />}
          label="Documentation" 
          active={currentPath.startsWith('/docs')} 
          expanded={expanded}
        />
      </ul>
    </nav>
  );
}
