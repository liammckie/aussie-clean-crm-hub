
import React from 'react';
import { XAxis as RechartXAxis, XAxisProps } from 'recharts';
import { YAxis as RechartYAxis, YAxisProps } from 'recharts';

// Create wrapper components with default parameters instead of defaultProps

export function XAxis(props: XAxisProps) {
  const defaultProps: Partial<XAxisProps> = {
    allowDecimals: true,
    hide: false,
    orientation: "bottom" as const, // Use "as const" to specify the literal type
    width: 0,
    height: 30,
    mirror: false,
    xAxisId: 0,
    tickCount: 5,
    scale: 'auto',
  };

  return <RechartXAxis {...defaultProps} {...props} />;
}

export function YAxis(props: YAxisProps) {
  const defaultProps: Partial<YAxisProps> = {
    allowDecimals: true,
    hide: false,
    orientation: "left" as const, // Use "as const" to specify the literal type
    width: 60,
    height: 0,
    mirror: false,
    yAxisId: 0,
    tickCount: 5,
    scale: 'auto',
  };

  return <RechartYAxis {...defaultProps} {...props} />;
}
