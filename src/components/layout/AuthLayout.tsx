
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
      <div className="min-h-screen flex w-full bg-background dark:bg-slate-950">
        <main className="w-full">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
