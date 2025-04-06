
import React from 'react';

interface HeadingProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function Heading({ title, description, children }: HeadingProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">{title || children}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
