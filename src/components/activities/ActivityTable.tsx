
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TabulatorTable from '@/components/contracts/TabulatorTable';
import { Activity } from '@/types/activity-types';
import { TabulatorColumn } from '@/types/tabulator-types';

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  const navigate = useNavigate();

  // Define explicit column definitions with proper TypeScript typing
  const columns: TabulatorColumn[] = [
    {
      title: "Type",
      field: "type",
      headerFilter: true,
      formatter: (cell) => {
        const value = cell.getValue() as string;
        const formattedType = value.replace(/_/g, ' ');
        return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
      }
    },
    {
      title: "Title",
      field: "title",
      headerFilter: true,
      sorter: "string",
      tooltip: true,
      width: 200
    },
    {
      title: "User",
      field: "user.name",
      headerFilter: true,
      formatter: (cell) => {
        const user = cell.getRow().getData().user;
        return user ? user.name : 'N/A';
      }
    },
    {
      title: "Entity",
      field: "entity.name",
      headerFilter: true,
      formatter: (cell) => {
        const entity = cell.getRow().getData().entity;
        const entityType = entity?.type ? `${entity.type}: ` : '';
        return entity ? `${entityType}${entity.name}` : 'N/A';
      }
    },
    {
      title: "Status", 
      field: "status", 
      headerFilter: "select",
      headerFilterParams: {
        values: {
          "success": "Success", 
          "warning": "Warning", 
          "error": "Error",
          "info": "Info"
        }
      },
      formatter: (cell) => {
        const value = cell.getValue() as string;
        const statusColors: Record<string, string> = {
          success: 'bg-green-100 text-green-800',
          warning: 'bg-amber-100 text-amber-800',
          error: 'bg-red-100 text-red-800',
          info: 'bg-blue-100 text-blue-800'
        };

        const colorClass = statusColors[value] || 'bg-gray-100 text-gray-800';
        
        const badge = document.createElement('span');
        badge.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`;
        badge.textContent = value.charAt(0).toUpperCase() + value.slice(1);
        
        return badge;
      }
    },
    {
      title: "Timestamp",
      field: "timestamp",
      sorter: "datetime",
      sorterParams: {
        format: "YYYY-MM-DD HH:mm:ss"
      },
      formatter: (cell) => {
        const value = cell.getValue() as string;
        const date = new Date(value);
        return date.toLocaleString();
      }
    }
  ];

  // Handle row click to navigate to activity detail (if needed)
  const handleRowClick = (_e: Event, row: any) => {
    const activity = row.getData();
    // For future implementation of activity detail view
    console.log("Activity clicked:", activity);
    
    // If there's a specific entity to navigate to
    if (activity.entity && activity.entity.id) {
      if (activity.entity.type === 'client') {
        navigate(`/clients/${activity.entity.id}`);
      } else if (activity.entity.type === 'contract') {
        navigate(`/contracts/${activity.entity.id}`);
      } else if (activity.entity.type === 'work_order') {
        navigate(`/work-orders/${activity.entity.id}`);
      }
    }
  };

  return (
    <TabulatorTable
      columns={columns}
      data={activities}
      onRowClick={handleRowClick}
      title="Activity Log"
      options={{
        pagination: true,
        paginationSize: 15,
        initialSort: [{ column: "timestamp", dir: "desc" }],
        placeholder: "No activities found",
      }}
    />
  );
}

export default ActivityTable;
