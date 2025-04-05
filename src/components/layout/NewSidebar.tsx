
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Building2,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

export type SidebarLink = {
  text: string;
  href: string;
  icon: React.ElementType;
};

const defaultLinks: SidebarLink[] = [
  {
    text: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    text: "Clients",
    href: "/clients",
    icon: Building2
  },
  {
    text: "Contacts",
    href: "/contacts",
    icon: Users
  },
];

interface NewSidebarProps {
  links?: SidebarLink[];
}

export function NewSidebar({ links = defaultLinks }: NewSidebarProps) {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <Sidebar className="border-r border-white/10 bg-[#1A1F2C] h-screen">
      <SidebarHeader className="pb-2 px-4">
        <h2 className="text-lg font-bold text-white">ERP System</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={link.text}
                      className={`${isActive ? 'bg-primary/10 text-primary' : 'text-white'} hover:bg-white/5`}
                    >
                      <Link to={link.href}>
                        <Icon className="w-4 h-4" />
                        <span>{link.text}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-white/70">Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="text-white hover:bg-white/5">
                  <Link to="/settings">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} tooltip="Log out" className="text-white hover:bg-white/5">
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-4 py-2 text-xs text-white/50">
        <p>© 2025 ERP Inc.</p>
      </SidebarFooter>
    </Sidebar>
  );
}
