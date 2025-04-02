
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
        {/* Decorative background elements */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 z-0"></div>
        <div className="fixed inset-0 z-0">
          <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-purple-700/10 blur-3xl"></div>
          <div className="absolute -bottom-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-indigo-700/10 blur-3xl"></div>
        </div>
        
        {/* Grid pattern overlay */}
        <div className="fixed inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.02] z-0"></div>
        
        <main className="w-full relative z-10">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
