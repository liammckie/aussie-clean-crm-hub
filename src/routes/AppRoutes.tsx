import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { RouteErrorBoundaryClass } from "@/components/error/RouteErrorBoundary";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import {
  Activities,
  ClientDetail,
  Clients,
  ContractDetail,
  Contracts,
  Dashboard,
  EditClient,
  EditContract,
  EditSupplier,
  ErrorTesting,
  Login,
  NewClient,
  NewContract,
  NewSupplier,
  NewWorkOrder,
  NotFound,
  Sales,
  Schema,
  Sites,
  SupplierDetail,
  Suppliers,
  WorkOrderDetail,
  WorkOrders,
} from "./lazyRoutes";

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
        
        {/* Home/Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Dashboard />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Sales */}
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

        {/* Schema */}
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

        {/* Clients */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Clients />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <ClientDetail />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <NewClient />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <EditClient />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Sites */}
        <Route
          path="/sites"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Sites />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Contracts */}
        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Contracts />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Contract Detail */}
        <Route
          path="/contracts/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <ContractDetail />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* New Contract */}
        <Route
          path="/contracts/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <NewContract />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Edit Contract */}
        <Route
          path="/contracts/:id/edit"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <EditContract />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Suppliers */}
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Suppliers />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Supplier Detail */}
        <Route
          path="/suppliers/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <SupplierDetail />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* New Supplier */}
        <Route
          path="/suppliers/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <NewSupplier />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Edit Supplier */}
        <Route
          path="/suppliers/:id/edit"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <EditSupplier />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Work Orders */}
        <Route
          path="/work-orders"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <WorkOrders />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Work Order Detail */}
        <Route
          path="/work-orders/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <WorkOrderDetail />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* New Work Order */}
        <Route
          path="/work-orders/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <NewWorkOrder />
                </RouteErrorBoundaryClass>
              </Suspense>
            </ProtectedRoute>
          }
        />

        {/* Activities */}
        <Route
          path="/activities"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <Activities />
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

        {/* Fallback for 404 */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundaryClass>
                  <NotFound />
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
