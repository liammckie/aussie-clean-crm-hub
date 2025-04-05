
import { useState, useEffect } from "react";
import { TopNavbar } from "./TopNavbar";
import { NewSidebar } from "./NewSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { useSidebar } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Get initial sidebar state from localStorage or default to expanded
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  // Access the sidebar context
  const { toggleSidebar } = useSidebar();

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(sidebarExpanded));
  }, [sidebarExpanded]);

  const handleToggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
    toggleSidebar(); // Also toggle the context sidebar
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <NewSidebar 
          expanded={sidebarExpanded} 
          onToggle={handleToggleSidebar} 
        />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        expanded={sidebarExpanded}
        onToggle={handleToggleSidebar}
      />
      
      {/* Main Content */}
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
  );
}
