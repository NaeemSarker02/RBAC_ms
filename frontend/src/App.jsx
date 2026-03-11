import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import PermissionGuard from './components/auth/PermissionGuard';
import RoleGuard from './components/auth/RoleGuard';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// User Pages
import UserList from './pages/users/UserList';
import UserCreate from './pages/users/UserCreate';
import UserEdit from './pages/users/UserEdit';
import UserView from './pages/users/UserView';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Forbidden from './pages/errors/Forbidden';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Root - Redirect to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Auth Routes */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <AuthLayout>
                <ForgotPassword />
              </AuthLayout>
            </GuestRoute>
          }
        />

        {/* Protected Routes with Main Layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/admin"
            element={
              <RoleGuard requiredRole="super_admin">
                <AdminDashboard />
              </RoleGuard>
            }
          />

          {/* User Management Routes */}
          <Route
            path="/users"
            element={
              <PermissionGuard requiredPermission="user_list">
                <UserList />
              </PermissionGuard>
            }
          />
          <Route
            path="/users/create"
            element={
              <PermissionGuard requiredPermission="user_create">
                <UserCreate />
              </PermissionGuard>
            }
          />
          <Route
            path="/users/:id"
            element={
              <PermissionGuard requiredPermission="user_view">
                <UserView />
              </PermissionGuard>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <PermissionGuard requiredPermission="user_edit">
                <UserEdit />
              </PermissionGuard>
            }
          />
        </Route>

        {/* Error Routes */}
        <Route path="/401" element={<Unauthorized />} />
        <Route path="/403" element={<Forbidden />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;