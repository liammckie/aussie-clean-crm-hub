
import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { RouteErrorBoundaryClass } from "@/components/error/RouteErrorBoundary";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Login } from "./lazyRoutes";
import { ClientRoutes } from "./route-groups/ClientRoutes";
import { SupplierRoutes } from "./route-groups/SupplierRoutes";
import { ContractRoutes } from "./route-groups/ContractRoutes";
import { WorkOrderRoutes } from "./route-groups/WorkOrderRoutes";
import { MiscRoutes } from "./route-groups/MiscRoutes";
import { Schema, Sales, ErrorTesting } from "./lazyRoutes";

export function AppRoutes() {
  return (
    <GlobalErrorBoundary>
      <Routes>
        {/* Authentication Route */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <RouteErrorBoundaryClass>
                <Login />
              </RouteErrorBoundaryClass>
            </Suspense>
          }
        />
        
        {/* Client Routes */}
        <Route path="/clients/*" element={<ClientRoutes />} />
        
        {/* Supplier Routes */}
        <Route path="/suppliers/*" element={<SupplierRoutes />} />
        
        {/* Contract Routes */}
        <Route path="/contracts/*" element={<ContractRoutes />} />
        
        {/* Work Order Routes */}
        <Route path="/work-orders/*" element={<WorkOrderRoutes />} />
        
        {/* Misc Routes (Dashboard, Sites, Activities) */}
        <Route path="/*" element={<MiscRoutes />} />
        
        {/* Schema Page */}
        <Route
          path="/schema"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Schema />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        {/* Sales Page */}
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Sales />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
        
        {/* Developer Routes */}
        <Route
          path="/developer/error-testing"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <ErrorTesting />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </GlobalErrorBoundary>
  );
}

export default AppRoutes;
