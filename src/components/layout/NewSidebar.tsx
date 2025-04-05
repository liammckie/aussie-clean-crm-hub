import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarItem,
  SidebarMenu,
  SidebarToggle,
  SidebarCollapse,
  SidebarGroup,
  SidebarLabel,
  SidebarSections
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Building2,
  Users
} from 'lucide-react';

export function NewSidebar() {
  return (
    <Sidebar className="border-r bg-card pt-2 h-screen">
      <SidebarSections>
        <SidebarSection title="Navigation">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarTrigger asChild>
                <Link to="/dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarTrigger>
              <SidebarTrigger asChild>
                <Link to="/clients">
                  <Building2 className="w-4 h-4" />
                  <span>Clients</span>
                </Link>
              </SidebarTrigger>
              <SidebarTrigger asChild>
                <Link to="/contacts">
                  <Users className="w-4 h-4" />
                  <span>Contacts</span>
                </Link>
              </SidebarTrigger>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarSection>
      </SidebarSections>
    </Sidebar>
  );
}
