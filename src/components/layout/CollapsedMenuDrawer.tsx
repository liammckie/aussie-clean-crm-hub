
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useSidebar } from "@/components/ui/sidebar";

export function CollapsedMenuDrawer() {
  const [open, setOpen] = useState(false);
  const { state, setOpen: setSidebarOpen } = useSidebar();

  // Only show this component when the sidebar is collapsed
  if (state !== "collapsed") {
    return null;
  }

  const handleOpenSidebar = () => {
    setOpen(false);
    setSidebarOpen(true);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-4 top-4 z-50 rounded-full shadow-md border border-border/50 hover:bg-muted/80"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-xs mx-auto">
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Navigation</h3>
          <Button onClick={handleOpenSidebar} className="w-full">
            Open Sidebar
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
