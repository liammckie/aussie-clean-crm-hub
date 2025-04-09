
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoLoadingSpinner } from "@/components/ui/LogoLoadingSpinner";

interface LoadingScreenProps {
  duration?: number;
  onLoadingComplete?: () => void;  // Made optional with ?
}

export function LoadingScreen({ 
  duration = 2000, // Reduced from 3000ms to 2000ms for faster development
  onLoadingComplete = () => {} // Default no-op function
}: LoadingScreenProps) {
  const [loadingStage, setLoadingStage] = useState<'initial' | 'assets' | 'complete'>('initial');
  const [isFading, setIsFading] = useState(false);
  
  useEffect(() => {
    console.log("Starting asset loading simulation");
    setTimeout(() => {
      setLoadingStage('assets');
      
      setTimeout(() => {
        console.log("Starting fade out");
        setIsFading(true);
        
        setTimeout(() => {
          console.log("Loading complete");
          setLoadingStage('complete');
          onLoadingComplete();
        }, 800); // Reduced from 1000ms to 800ms
      }, duration - 800); // Adjusted accordingly
    }, 300); // Reduced from 500ms to 300ms
    
    return () => {
      console.log("Cleaning up loading timers");
    };
  }, [duration, onLoadingComplete]);

  if (loadingStage === 'complete') return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgb(2,8,23)] 
      ${isFading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-indigo-900/10 to-[rgb(2,8,23)] pointer-events-none"></div>
      
      {loadingStage === 'initial' && (
        <div className="text-center relative z-10">
          <LogoLoadingSpinner size="xl" />
          <p className="mt-4 text-white text-lg font-light">Initializing system...</p>
        </div>
      )}
      
      {loadingStage === 'assets' && (
        <div className="text-center relative z-10 flex flex-col items-center">
          <LogoLoadingSpinner size="lg" />
          <div className="loader mt-8 mb-4">
            <div className="h-1 w-64 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 animate-pulse w-3/4"></div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <Skeleton className="w-64 h-4 rounded-md bg-slate-800/60" />
            <Skeleton className="w-48 h-4 rounded-md bg-slate-800/60" />
            <Skeleton className="w-56 h-4 rounded-md bg-slate-800/60" />
          </div>
          <p className="text-white/80 text-sm font-light">Loading enterprise modules...</p>
        </div>
      )}
      
      <div className="absolute bottom-8 inset-x-0 flex justify-center">
        <p className="text-white/40 text-xs font-light">Aussie Clean ERP System</p>
      </div>
    </div>
  );
}
