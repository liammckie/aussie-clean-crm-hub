
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Building2,
  Users
} from 'lucide-react';

export function NewSidebar() {
  const { open } = useSidebar();
  
  return (
    <Sidebar className="border-r border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 pt-2 h-screen">
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-lg font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">CleanMap</span>
        </div>
        <SidebarTrigger className="text-white hover:bg-white/10" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                  <Link to="/clients">
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>Clients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-white hover:bg-white/10 focus:bg-white/10">
                  <Link to="/contacts">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
