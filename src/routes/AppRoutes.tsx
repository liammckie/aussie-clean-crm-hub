
import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
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
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Login />
                </RouteErrorBoundary>
              </Suspense>
            </AuthLayout>
          }
        />
        <Route
          path="*"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NotFound />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Dashboard />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Schema */}
        <Route
          path="/schema"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Schema />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Sales */}
        <Route
          path="/sales"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Sales />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Clients */}
        <Route
          path="/clients"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Clients />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Client Detail */}
        <Route
          path="/clients/:id"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <ClientDetail />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* New Client */}
        <Route
          path="/clients/new"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NewClient />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Edit Client */}
        <Route
          path="/clients/:id/edit"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <EditClient />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Sites */}
        <Route
          path="/sites"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Sites />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Contracts */}
        <Route
          path="/contracts"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Contracts />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Contract Detail */}
        <Route
          path="/contracts/:id"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <ContractDetail />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* New Contract */}
        <Route
          path="/contracts/new"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NewContract />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Edit Contract */}
        <Route
          path="/contracts/:id/edit"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <EditContract />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Suppliers */}
        <Route
          path="/suppliers"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Suppliers />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Supplier Detail */}
        <Route
          path="/suppliers/:id"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <SupplierDetail />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* New Supplier */}
        <Route
          path="/suppliers/new"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NewSupplier />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Edit Supplier */}
        <Route
          path="/suppliers/:id/edit"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <EditSupplier />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Work Orders */}
        <Route
          path="/work-orders"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <WorkOrders />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Work Order Detail */}
        <Route
          path="/work-orders/:id"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <WorkOrderDetail />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* New Work Order */}
        <Route
          path="/work-orders/new"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <NewWorkOrder />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Activities */}
        <Route
          path="/activities"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <Activities />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />

        {/* Developer Routes */}
        <Route
          path="/developer/error-testing"
          element={
            <MainLayout>
              <Suspense fallback={<LoadingScreen />}>
                <RouteErrorBoundary>
                  <ErrorTesting />
                </RouteErrorBoundary>
              </Suspense>
            </MainLayout>
          }
        />
      </Routes>
    </GlobalErrorBoundary>
  );
}

// Make sure to properly export the default as well for backwards compatibility
export default AppRoutes;
