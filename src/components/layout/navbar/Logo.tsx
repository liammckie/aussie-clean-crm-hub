
import { useEffect, useState } from 'react';

export function Logo() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded state after a short delay to trigger animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <img 
      src="/lovable-uploads/6933e91a-9a74-4058-bce7-c29c11fba4f5.png" 
      alt="ERP Logo" 
      className={`h-10 w-auto object-contain transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
