
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingScreenProps {
  videoUrl: string;
  duration?: number;
  onLoadingComplete: () => void;
}

export function LoadingScreen({ 
  videoUrl, 
  duration = 8000,
  onLoadingComplete 
}: LoadingScreenProps) {
  const [loadingStage, setLoadingStage] = useState<'initial' | 'assets' | 'video' | 'complete'>('initial');
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Starting asset loading simulation");
    setTimeout(() => {
      setLoadingStage('assets');
      
      setTimeout(() => {
        console.log("Assets loaded, showing video");
        setLoadingStage('video');
        
        setTimeout(() => {
          console.log("Starting fade out");
          setIsFading(true);
          
          setTimeout(() => {
            console.log("Loading complete");
            setLoadingStage('complete');
            onLoadingComplete();
            navigate("/login");
          }, 1000);
        }, duration - 1000);
      }, 1500);
    }, 500);
    
    return () => {
      console.log("Cleaning up loading timers");
    };
  }, [duration, navigate, onLoadingComplete]);

  if (loadingStage === 'complete') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgb(2,8,23)] 
      before:absolute before:inset-0 before:bg-gradient-to-b 
      before:from-transparent before:via-transparent 
      before:to-[rgb(2,8,23)] 
      before:pointer-events-none">
      {loadingStage === 'initial' && (
        <div className="text-center">
          <Skeleton className="w-64 h-64 rounded-md mx-auto mb-4" />
          <p className="text-white text-lg">Initializing application...</p>
        </div>
      )}
      
      {loadingStage === 'assets' && (
        <div className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="w-64 h-6 rounded-md" />
            <Skeleton className="w-48 h-6 rounded-md" />
            <Skeleton className="w-56 h-6 rounded-md" />
            <p className="text-white text-lg">Loading assets...</p>
          </div>
        </div>
      )}
      
      {loadingStage === 'video' && (
        <div className={`max-w-2xl mx-auto relative transition-opacity duration-1000 
          before:absolute before:inset-0 before:bg-gradient-to-b 
          before:from-transparent before:via-transparent 
          before:to-[rgb(2,8,23)/50] 
          before:pointer-events-none 
          ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          <video 
            src={videoUrl}
            autoPlay
            muted
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
