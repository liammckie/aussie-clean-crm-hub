
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

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  width: number;
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

  useEffect(() => {
    // Save to localStorage whenever state changes
    localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
  }, [isOpen]);

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
