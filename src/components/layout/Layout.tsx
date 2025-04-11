
import React from "react";
import { Outlet } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";

export function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 hidden md:block">
        <Navigation />
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
