import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
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
              <RouteErrorBoundary>
                <Login />
              </RouteErrorBoundary>
            </Suspense>
          }
        />
        
        {/* Home/Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Dashboard />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Sales />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Schema />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Clients />
                </RouteErrorBoundary>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <ClientDetail />
                </RouteErrorBoundary>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NewClient />
                </RouteErrorBoundary>
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <EditClient />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Sites />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Contracts />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <ContractDetail />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <NewContract />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <EditContract />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Suppliers />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <SupplierDetail />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <NewSupplier />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <EditSupplier />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <WorkOrders />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <WorkOrderDetail />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <NewWorkOrder />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <Activities />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <ErrorTesting />
                </RouteErrorBoundary>
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
                <RouteErrorBoundary>
                  <NotFound />
                </RouteErrorBoundary>
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </GlobalErrorBoundary>
  );
}

export default AppRoutes;
