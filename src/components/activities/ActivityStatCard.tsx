
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ActivityStatCardProps {
  title: string;
  count: number;
  change: number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber';
  description?: string;
  chartData?: number[];
}

export function ActivityStatCard({ 
  title, 
  count, 
  change, 
  icon, 
  color, 
  description,
  chartData = []
}: ActivityStatCardProps) {
  const colorVariants = {
    blue: {
      bgLight: 'bg-blue-500/10',
      text: 'text-blue-500',
      border: 'border-blue-500/20',
      fill: 'rgba(59, 130, 246, 0.2)', // blue-500 with opacity
      stroke: 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
    },
    green: {
      bgLight: 'bg-green-500/10',
      text: 'text-green-500',
      border: 'border-green-500/20',
      fill: 'rgba(34, 197, 94, 0.2)', // green-500 with opacity
      stroke: 'rgba(34, 197, 94, 0.8)', // green-500 with opacity
    },
    red: {
      bgLight: 'bg-red-500/10',
      text: 'text-red-500',
      border: 'border-red-500/20',
      fill: 'rgba(239, 68, 68, 0.2)', // red-500 with opacity
      stroke: 'rgba(239, 68, 68, 0.8)', // red-500 with opacity
    },
    purple: {
      bgLight: 'bg-purple-500/10',
      text: 'text-purple-500',
      border: 'border-purple-500/20',
      fill: 'rgba(168, 85, 247, 0.2)', // purple-500 with opacity
      stroke: 'rgba(168, 85, 247, 0.8)', // purple-500 with opacity
    },
    amber: {
      bgLight: 'bg-amber-500/10',
      text: 'text-amber-500',
      border: 'border-amber-500/20',
      fill: 'rgba(245, 158, 11, 0.2)', // amber-500 with opacity
      stroke: 'rgba(245, 158, 11, 0.8)', // amber-500 with opacity
    },
  };
  
  // Create SVG path for the sparkline chart
  const renderSparkline = () => {
    if (!chartData.length) return null;
    
    const width = 120;
    const height = 40;
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min || 1;
    
    // Calculate points for the path
    const points = chartData.map((value, index) => {
      const x = (index / (chartData.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    const path = `M${points.join(' L')}`;
    
    // Create the area below the line
    const areaPath = `${path} L${width},${height} L0,${height} Z`;
    
    return (
      <svg width={width} height={height} className="mt-2">
        {/* Area under the line */}
        <path 
          d={areaPath} 
          fill={colorVariants[color].fill} 
          strokeWidth="0"
        />
        {/* Line */}
        <path 
          d={path} 
          fill="none" 
          stroke={colorVariants[color].stroke} 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current point (last point) */}
        <circle 
          cx={width} 
          cy={height - ((chartData[chartData.length - 1] - min) / range) * height} 
          r="3"
          fill={colorVariants[color].stroke}
        />
      </svg>
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-white/40 border-white/20 shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{count}</h3>
              <div className={cn(
                "flex items-center text-xs font-medium",
                change > 0 ? "text-green-500" : "text-red-500"
              )}>
                {change > 0 ? (
                  <>
                    <ArrowUp className="h-3 w-3 mr-1" />
                    +{change}%
                  </>
                ) : (
                  <>
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {change}%
                  </>
                )}
              </div>
            </div>
            
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          <div className={cn(
            "rounded-full p-2 transition-transform group-hover:scale-110",
            colorVariants[color].bgLight
          )}>
            <div className={cn(colorVariants[color].text)}>
              {icon}
            </div>
          </div>
        </div>
        
        {/* Sparkline chart */}
        <div className="h-10 mt-2">
          {renderSparkline()}
        </div>
      </CardContent>
    </Card>
  );
}
