
import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";

// Constants for sidebar widths
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_WIDTH_MOBILE = 320;
export const SIDEBAR_WIDTH_ICON = 64;

export type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  width: number;
  isMobile: boolean;
  state: boolean;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
};

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(() => {
    // Get initial state from localStorage or default to true
    const saved = localStorage.getItem("sidebar-open");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Save to localStorage whenever state changes
    localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Calculate width based on state
  const width = isOpen ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        width,
        isMobile,
        state: isOpen,
        openMobile,
        setOpenMobile
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
}
