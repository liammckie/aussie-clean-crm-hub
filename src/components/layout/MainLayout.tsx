
import { useState, useEffect } from "react";
import { TopNavbar } from "./TopNavbar";
import { NewSidebar, SidebarLink } from "./NewSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  links?: SidebarLink[];
}

export function MainLayout({ children, links }: MainLayoutProps) {
  // Get initial sidebar state from localStorage or default to expanded
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  return (
    <SidebarProvider defaultOpen={sidebarExpanded}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <NewSidebar links={links} />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar links={links} />
        
        {/* Main Content - Fixed the transition and margin classes */}
        <main 
          className={`transition-all duration-300 ${
            sidebarExpanded 
              ? 'md:ml-64' // When sidebar is expanded
              : 'md:ml-20' // When sidebar is collapsed
          }`}
        >
          <TopNavbar />
          <div className="px-4 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
