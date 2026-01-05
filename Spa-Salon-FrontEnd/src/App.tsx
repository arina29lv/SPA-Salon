import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common';
import Layout from './components/layout/Layout';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  ServiceListPage,
  ServiceDetailPage,
  ServiceFormPage,
  CustomerListPage,
  CustomerDetailPage,
  CustomerFormPage,
  EmployeeListPage,
  EmployeeDetailPage,
  EmployeeFormPage,
  AppointmentListPage,
  AppointmentDetailPage,
  AppointmentFormPage,
  UserListPage,
  UserDetailPage,
  UserFormPage,
} from './pages';
import { UserRole } from './types/common';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/services" element={<ServiceListPage />} />
              <Route path="/services/:id" element={<ServiceDetailPage />} />
              <Route
                path="/services/new"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <ServiceFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <ServiceFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/customers"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <CustomerListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:id"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <CustomerDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/new"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <CustomerFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <CustomerFormPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route
                path="/employees/new"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <EmployeeFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Manager, UserRole.Admin]}>
                    <EmployeeFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:id"
                element={
                  <ProtectedRoute>
                    <AppointmentDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/new"
                element={
                  <ProtectedRoute>
                    <AppointmentFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Employee, UserRole.Manager, UserRole.Admin]}>
                    <AppointmentFormPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <UserListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <UserDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/new"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <UserFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[UserRole.Admin]}>
                    <UserFormPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
