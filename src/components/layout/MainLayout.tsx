
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TopNavbar } from "./TopNavbar";
import { MainSidebar } from "./MainSidebar";
import { CollapsedMenuDrawer } from "./CollapsedMenuDrawer";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <MainSidebar />
        <CollapsedMenuDrawer />
        <SidebarInset className="relative flex-grow bg-gradient-to-br from-slate-900 to-slate-950">
          <TopNavbar />
          <main className="px-4 py-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
