
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Users, 
  FileCheck, 
  TrendingUp, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Settings, 
  FileText, 
  Truck, 
  Activity 
} from "lucide-react";
import { Link } from "react-router-dom";

export function MainSidebar() {
  return (
    <Sidebar className="sidebar-glass">
      <SidebarHeader className="flex items-center px-4 py-2">
        <h2 className="text-xl font-bold text-white">SCSERP</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={window.location.pathname === '/dashboard'} 
                  tooltip="Dashboard" 
                  className="sidebar-item"
                  asChild
                >
                  <Link to="/dashboard">
                    <Home className="text-white" />
                    <span className="text-white">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Clients" className="sidebar-item" asChild>
                  <Link to="#">
                    <Users className="text-white" />
                    <span className="text-white">Clients</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Contracts" className="sidebar-item" asChild>
                  <Link to="#">
                    <FileCheck className="text-white" />
                    <span className="text-white">Contracts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sales" className="sidebar-item" asChild>
                  <Link to="#">
                    <TrendingUp className="text-white" />
                    <span className="text-white">Sales</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Work Orders" className="sidebar-item" asChild>
                  <Link to="#">
                    <Briefcase className="text-white" />
                    <span className="text-white">Work Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Activities" className="sidebar-item" asChild>
                  <Link to="#">
                    <Calendar className="text-white" />
                    <span className="text-white">Activities</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Finance" className="sidebar-item" asChild>
                  <Link to="#">
                    <DollarSign className="text-white" />
                    <span className="text-white">Finance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" className="sidebar-item" asChild>
                  <Link to="#">
                    <Settings className="text-white" />
                    <span className="text-white">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Quick Forms" className="sidebar-item" asChild>
                  <Link to="#">
                    <FileText className="text-white" />
                    <span className="text-white">Quick Forms</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Suppliers" className="sidebar-item" asChild>
                  <Link to="#">
                    <Truck className="text-white" />
                    <span className="text-white">Suppliers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Activity Log" className="sidebar-item" asChild>
                  <Link to="#">
                    <Activity className="text-white" />
                    <span className="text-white">Activity Log</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarTrigger className="w-full flex justify-center items-center gap-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors border border-white/10 rounded-md text-white">
          <span>Close Sidebar</span>
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}
