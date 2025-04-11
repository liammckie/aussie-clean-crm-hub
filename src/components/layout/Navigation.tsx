
import React from 'react';
import { Link } from 'react-router-dom';
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

export function Navigation({ activePath = '' }: NavigationProps) {
  return (
    <nav className="space-y-1">
      <ul className="space-y-1">
        <NavigationItem 
          href="/" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          label="Dashboard" 
          active={activePath === '/'} 
        />
        <NavigationItem 
          href="/clients" 
          icon={<Building2 className="h-5 w-5" />} 
          label="Clients" 
          active={activePath.startsWith('/clients')} 
        />
        <NavigationItem 
          href="/sites" 
          icon={<Map className="h-5 w-5" />} 
          label="Sites" 
          active={activePath.startsWith('/sites')} 
        />
        <NavigationItem 
          href="/contracts" 
          icon={<FileText className="h-5 w-5" />} 
          label="Contracts" 
          active={activePath.startsWith('/contracts')} 
        />
        <NavigationItem 
          href="/work-orders" 
          icon={<ClipboardList className="h-5 w-5" />} 
          label="Work Orders" 
          active={activePath.startsWith('/work-orders')} 
        />
        <NavigationItem 
          href="/suppliers" 
          icon={<Users className="h-5 w-5" />}
          label="Suppliers" 
          active={activePath.startsWith('/suppliers')} 
        />
        <NavigationItem 
          href="/admin" 
          icon={<Settings className="h-5 w-5" />}
          label="Admin" 
          active={activePath.startsWith('/admin')} 
        />
        <NavigationItem 
          href="/schema" 
          icon={<Database className="h-5 w-5" />}
          label="Schema" 
          active={activePath.startsWith('/schema')} 
        />
        <NavigationItem 
          href="/docs" 
          icon={<BookOpen className="h-5 w-5" />}
          label="Documentation" 
          active={activePath.startsWith('/docs')} 
        />
      </ul>
    </nav>
  );
}
