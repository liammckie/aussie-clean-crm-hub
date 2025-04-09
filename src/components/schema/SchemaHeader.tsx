
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileJson, FileDown, RefreshCw, Save, DiffIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SchemaHeaderProps {
  lastUpdated: Date | null;
  baselineDate: Date | null;
  isCheckingDrift: boolean;
  onRefreshSchema: () => void;
  onSaveBaseline: () => void;
  onCheckDrift: () => void;
  onDownloadJson: () => void;
  onDownloadMarkdown: () => void;
  onUpdateDocumentation: () => void;
}

export function SchemaHeader({
  lastUpdated,
  baselineDate,
  isCheckingDrift,
  onRefreshSchema,
  onSaveBaseline,
  onCheckDrift,
  onDownloadJson,
  onDownloadMarkdown,
  onUpdateDocumentation
}: SchemaHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Database Schema</h1>
          <p className="text-muted-foreground">
            View and explore the database structure
            {lastUpdated && (
              <span className="ml-2 text-xs">
                Last updated: {lastUpdated.toLocaleString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onRefreshSchema}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Schema
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onSaveBaseline}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {baselineDate ? 'Update Baseline' : 'Save Baseline'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onCheckDrift}
            disabled={!baselineDate || isCheckingDrift}
            className="gap-2"
          >
            <DiffIcon className="h-4 w-4" />
            {isCheckingDrift ? 'Checking...' : 'Check Drift'}
          </Button>
          
          <Button variant="outline" onClick={onDownloadJson}>
            <FileJson className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
          
          <Button variant="outline" onClick={onDownloadMarkdown}>
            <FileDown className="mr-2 h-4 w-4" />
            Download Markdown
          </Button>
          
          <Button variant="default" onClick={onUpdateDocumentation}>
            <Clock className="mr-2 h-4 w-4" />
            Update Docs
          </Button>
        </div>
      </div>
      
      {baselineDate && (
        <div className="mb-4 p-2 bg-muted/50 rounded-md text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Baseline schema saved: {format(baselineDate, 'yyyy-MM-dd HH:mm')}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
