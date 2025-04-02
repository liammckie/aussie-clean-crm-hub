
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoadingScreenProps {
  videoUrl: string;
  duration?: number;
  onLoadingComplete: () => void;
}

export function LoadingScreen({ 
  videoUrl, 
  duration = 8000, // Changed to 8 seconds 
  onLoadingComplete 
}: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Start fading out 1 second before the end
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 1000);

    // End the loading screen after the full duration
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      onLoadingComplete();
      // Navigate to login page after video finishes
      navigate("/login");
    }, duration);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fadeTimer);
    };
  }, [duration, navigate, onLoadingComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className={`w-full h-full transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
        <video 
          src={videoUrl}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
