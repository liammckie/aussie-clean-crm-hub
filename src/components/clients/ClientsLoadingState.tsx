
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientsLoadingState() {
  return (
    <div className="space-y-6">
      {/* Skeleton for summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-7 w-28 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
        ))}
      </div>

      {/* Skeleton for toolbar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </Card>

      {/* Skeleton for client list */}
      <Card className="overflow-hidden">
        <div className="p-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
