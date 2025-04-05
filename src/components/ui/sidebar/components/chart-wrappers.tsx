
import React from 'react';
import { XAxis as RechartXAxis, XAxisProps } from 'recharts';
import { YAxis as RechartYAxis, YAxisProps } from 'recharts';

// Create wrapper components with default parameters instead of defaultProps

export function XAxis(props: XAxisProps) {
  // Define orientation as a literal "bottom" | "top" type
  const defaultProps: Partial<XAxisProps> = {
    allowDecimals: true,
    hide: false,
    orientation: "bottom", // Recharts expects "bottom" | "top" only
    width: 0,
    height: 30,
    mirror: false,
    tickCount: 5,
    scale: 'auto',
  };

  return <RechartXAxis {...defaultProps} {...props} />;
}

export function YAxis(props: YAxisProps) {
  // Define orientation as a literal "left" | "right" type
  const defaultProps: Partial<YAxisProps> = {
    allowDecimals: true,
    hide: false,
    orientation: "left", // Recharts expects "left" | "right" only
    width: 60,
    height: 0,
    mirror: false,
    tickCount: 5,
    scale: 'auto',
  };

  return <RechartYAxis {...defaultProps} {...props} />;
}
