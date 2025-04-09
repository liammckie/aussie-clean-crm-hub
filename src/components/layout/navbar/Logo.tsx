
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
      src="/lovable-uploads/Logo.png" 
      alt="Aussie Clean ERP Logo" 
      className={`h-10 w-auto object-contain transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
}
