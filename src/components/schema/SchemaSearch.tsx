
import React from 'react';
import { Database } from 'lucide-react';

interface SchemaSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SchemaSearch({ searchTerm, onSearchChange }: SchemaSearchProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search tables and columns..."
          className="w-full p-2 pl-10 border rounded bg-background"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
