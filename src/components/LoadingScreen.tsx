
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LoadingScreenProps {
  videoUrl: string;
  duration?: number;
}

export function LoadingScreen({ videoUrl, duration = 5000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Navigate to login page after video finishes
      navigate("/login");
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {isLoading ? (
        <video 
          src={videoUrl}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          Your browser does not support the video tag.
        </video>
      ) : null}
    </div>
  );
}
