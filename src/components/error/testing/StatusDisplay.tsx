
import React from 'react';

interface StatusDisplayProps {
  status: string | null;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  if (!status) return null;
  
  return (
    <div className="p-2 w-full rounded bg-secondary/50 text-sm">
      <p>{status}</p>
    </div>
  );
};
