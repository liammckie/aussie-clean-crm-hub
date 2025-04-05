
import React from "react";
import { TopNavbar } from "./TopNavbar";
import { NewSidebar } from "./NewSidebar";
import { MobileSidebar } from "./MobileSidebar";
import { useSidebar } from "@/components/ui/sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  // Use the sidebar context directly
  const { open: sidebarExpanded } = useSidebar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <NewSidebar />
      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
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
