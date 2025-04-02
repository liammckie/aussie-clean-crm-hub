
import { useState, useEffect } from "react";
import { TopNavbar } from "./TopNavbar";
import { NewSidebar } from "./NewSidebar";
import { MobileSidebar } from "./MobileSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <NewSidebar 
          expanded={sidebarExpanded} 
          onToggle={toggleSidebar} 
        />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        expanded={sidebarExpanded}
        onToggle={toggleSidebar}
      />
      
      {/* Main Content */}
      <main className={`transition-all duration-300 md:ml-${sidebarExpanded ? '64' : '20'}`}>
        <TopNavbar />
        <div className="px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
