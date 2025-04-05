
import React, { lazy, Suspense } from "react";
import { AppLogger, LogCategory, LogLevel } from "@/utils/logging";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// Loading component with error boundary
const RouteLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-pulse flex flex-col items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-slate-700"></div>
      <div className="h-4 w-32 rounded bg-slate-700"></div>
    </div>
  </div>
);

// Wrapper for lazy loaded components with error handling
const withLazyLoading = (
  importFn: () => Promise<any>,
  componentName: string
) => {
  const LazyComponent = lazy(() => {
    AppLogger.debug(LogCategory.PERFORMANCE, `Loading component: ${componentName}`);
    
    return importFn().catch((error) => {
      AppLogger.error(
        LogCategory.UI, 
        `Failed to load component: ${componentName}`,
        error
      );
      throw error;
    });
  });

  return (props: any) => (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Lazy-loaded components
export const LazyLogin = withLazyLoading(() => import("@/pages/Login"), "Login");
export const LazyDashboard = withLazyLoading(() => import("@/pages/Dashboard"), "Dashboard");
export const LazyClients = withLazyLoading(() => import("@/pages/Clients"), "Clients");
export const LazyClientDetail = withLazyLoading(() => import("@/pages/ClientDetail"), "ClientDetail");
export const LazyNewClient = withLazyLoading(() => import("@/pages/NewClient"), "NewClient");
export const LazyEditClient = withLazyLoading(() => import("@/pages/EditClient"), "EditClient");
export const LazyContracts = withLazyLoading(() => import("@/pages/Contracts"), "Contracts");
export const LazyNotFound = withLazyLoading(() => import("@/pages/NotFound"), "NotFound");
export const LazyIndex = withLazyLoading(() => import("@/pages/Index"), "Index");
