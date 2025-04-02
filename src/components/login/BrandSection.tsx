
import React from "react";
import { Sparkles } from "lucide-react";
import { FAQSection } from "./FAQSection";

export function BrandSection() {
  return (
    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <div className="mb-12 text-center">
          {/* Animated gradient text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-purple-300 via-indigo-300 to-purple-200 bg-clip-text text-transparent drop-shadow-sm animate-gradient-shift">
              Aussie Clean ERP
            </span>
            <div className="absolute -inset-1 rounded-lg blur-sm bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-70"></div>
          </h1>
          <p className="text-purple-300/90 text-lg md:text-xl font-light max-w-md mx-auto relative z-10">
            Streamlining operations for cleaning businesses across Australia
          </p>
        </div>
        
        {/* FAQ Section */}
        <FAQSection />
        
        {/* Enhanced divider */}
        <div className="flex items-center mt-8 justify-center">
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <span className="text-purple-300 text-xs font-medium px-4 py-1.5 flex items-center gap-1.5 bg-purple-500/10 backdrop-blur-sm rounded-full border border-purple-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Workflow
          </span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
