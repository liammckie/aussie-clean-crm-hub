
interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function DashboardGrid({ 
  children, 
  columns = 3,
  className = "" 
}: DashboardGridProps) {
  // Dynamically determine grid columns based on the columns prop
  const gridColsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-4 md:gap-6 w-full ${className}`}>
      {children}
    </div>
  );
}
