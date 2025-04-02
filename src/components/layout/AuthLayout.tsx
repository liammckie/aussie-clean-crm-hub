
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen w-full bg-background dark:bg-slate-950 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="fixed inset-0 z-0">
          {/* Main background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-950"></div>
          
          {/* Multiple gradient orbs */}
          <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-purple-800/10 blur-3xl animate-glow-pulse"></div>
          <div className="absolute top-[20%] -left-[200px] w-[400px] h-[400px] rounded-full bg-indigo-700/5 blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-indigo-700/10 blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Subtle light rays */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-purple-500/10 via-purple-500/5 to-transparent skew-x-12 blur-sm"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-indigo-500/10 via-indigo-500/5 to-transparent -skew-x-12 blur-sm"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-300/20 blur-sm animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-3/4 left-2/3 w-1 h-1 rounded-full bg-indigo-300/30 blur-sm animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-purple-400/20 blur-sm animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Enhanced grid pattern overlay */}
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03] z-0"></div>
        
        {/* Subtle noise texture */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-[0.03] z-0"></div>
        
        <main className="w-full relative z-10">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
