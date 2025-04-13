
import React from "react";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils";

interface NewSidebarProps {
  expanded: boolean;
  onToggle: () => void;
  activePath?: string;
}

export function NewSidebar({ expanded, onToggle, activePath }: NewSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-10",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
        <div
          className={cn(
            "font-bold text-xl transition-opacity duration-300",
            expanded ? "opacity-100" : "opacity-0 hidden"
          )}
        >
          SCS ERP
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          {expanded ? "←" : "→"}
        </button>
      </div>
      <div className="p-4">
        <Navigation activePath={activePath} />
      </div>
    </aside>
  );
}
