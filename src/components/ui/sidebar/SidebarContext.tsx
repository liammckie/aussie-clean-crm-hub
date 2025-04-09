
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // Add missing properties
  isMobile: boolean;
  state: boolean;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  setIsOpen: () => {},
  isMobile: false,
  state: false,
  openMobile: false,
  setOpenMobile: () => {}
});

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [openMobile, setOpenMobile] = useState<boolean>(false);
  
  // Detect mobile devices
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      setIsOpen,
      isMobile,
      state: isOpen,
      openMobile,
      setOpenMobile
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
