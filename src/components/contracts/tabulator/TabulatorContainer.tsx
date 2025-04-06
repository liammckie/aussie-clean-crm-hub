
import React, { useEffect, useRef, useState } from 'react';
import "tabulator-tables/dist/css/tabulator_semanticui.min.css";
import { toast } from 'sonner';
import { useTabulator } from '@/hooks/use-tabulator';

interface TabulatorContainerProps {
  data: any[];
  onSelectionChange?: (selectedRows: any[]) => void;
}

export const TabulatorContainer: React.FC<TabulatorContainerProps> = ({ 
  data, 
  onSelectionChange 
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Only render on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use our custom hook to handle Tabulator initialization
  const { initializeTabulator, destroyTabulator } = useTabulator({
    element: tableRef,
    data,
    onSelectionChange
  });

  // Initialize Tabulator when data is available
  useEffect(() => {
    if (!isClient || !data?.length) return;
    
    console.log("Initializing Tabulator with data:", data.length, "rows");
    const init = async () => {
      try {
        await initializeTabulator();
      } catch (error) {
        console.error("Failed to initialize Tabulator:", error);
        toast.error("Failed to initialize contracts table");
      }
    };
    
    init();
    return destroyTabulator;
  }, [isClient, data, onSelectionChange]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div ref={tableRef} className="tabulator-container"></div>
    </div>
  );
};
