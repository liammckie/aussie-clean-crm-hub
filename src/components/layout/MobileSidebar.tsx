
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NewSidebar } from "./NewSidebar";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileSidebar() {
  const { setOpenMobile } = useSidebar();

  return (
    <Sheet open={false} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-4 top-4 z-50 md:hidden rounded-full shadow-md border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10"
        >
          <Menu className="h-5 w-5 text-white" />
          <span className="sr-only">Open Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 max-w-xs bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-white/10 text-white">
        <NewSidebar />
      </SheetContent>
    </Sheet>
  );
}
