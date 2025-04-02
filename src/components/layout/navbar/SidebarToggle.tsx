
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
  const { state, toggleSidebar } = useSidebar();
  
  if (state !== "collapsed") {
    return null;
  }
  
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
