
import React, { useState } from "react";
import { Navigation } from "./Navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  expanded: boolean;
  onToggle: () => void;
  activePath?: string;
}

export function MobileSidebar({ expanded, onToggle, activePath }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 md:hidden z-30">
        <button
          onClick={toggleMobileNav}
          className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={toggleMobileNav}
      />

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-900 z-30 transition-transform duration-300 md:hidden border-r border-slate-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
          <div className="font-bold text-xl">SCS ERP</div>
          <button
            onClick={toggleMobileNav}
            className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <Navigation activePath={activePath} />
        </div>
      </div>
    </>
  );
}
