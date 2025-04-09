
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SchemaDiff, formatSchemaDiff } from '@/utils/schema/checkSchemaDrift';

interface SchemaDriftViewProps {
  schemaDiff: SchemaDiff;
  onHideDiff: () => void;
}

export function SchemaDriftView({ schemaDiff, onHideDiff }: SchemaDriftViewProps) {
  return (
    <Card className="mb-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Schema Drift Analysis</h2>
        <Button variant="outline" size="sm" onClick={onHideDiff}>
          Hide Diff
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="font-semibold">Added Tables:</span> {schemaDiff.addedTables.length}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Removed Tables:</span> {schemaDiff.removedTables.length}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Modified Tables:</span> {schemaDiff.modifiedTables.length}
          </div>
        </div>
        
        <div className="mt-2 p-4 bg-muted text-sm rounded-md overflow-auto max-h-60">
          <pre>{formatSchemaDiff(schemaDiff)}</pre>
        </div>
      </div>
    </Card>
  );
}
