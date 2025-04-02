
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
                <SidebarMenuButton isActive={true} tooltip="Dashboard" className="sidebar-item hover:bg-white/10">
                  <Home />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Clients" className="sidebar-item hover:bg-white/10">
                  <Users />
                  <span>Clients</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Contracts" className="sidebar-item hover:bg-white/10">
                  <FileCheck />
                  <span>Contracts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Sales" className="sidebar-item hover:bg-white/10">
                  <TrendingUp />
                  <span>Sales</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Work Orders" className="sidebar-item hover:bg-white/10">
                  <Briefcase />
                  <span>Work Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Activities" className="sidebar-item hover:bg-white/10">
                  <Calendar />
                  <span>Activities</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Finance" className="sidebar-item hover:bg-white/10">
                  <DollarSign />
                  <span>Finance</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" className="sidebar-item hover:bg-white/10">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Quick Forms" className="sidebar-item hover:bg-white/10">
                  <FileText />
                  <span>Quick Forms</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Suppliers" className="sidebar-item hover:bg-white/10">
                  <Truck />
                  <span>Suppliers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Activity Log" className="sidebar-item hover:bg-white/10">
                  <Activity />
                  <span>Activity Log</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarTrigger className="w-full flex justify-center items-center gap-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-colors border border-white/10 rounded-md">
          <span>Close Sidebar</span>
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}
