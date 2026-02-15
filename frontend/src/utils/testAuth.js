import { useAuthStore } from '../store/useAuthStore';

/**
 * Test authentication and permissions
 * Run in browser console: window.testAuth()
 */
export const testAuth = () => {
  const store = useAuthStore.getState();

  console.group('🔐 Auth Store Test');
  console.log('User:', store.user);
  console.log('Token:', store.token);
  console.log('Is Authenticated:', store.isAuthenticated);
  console.log('Permissions:', store.permissions);
  console.log('Roles:', store.roles);
  console.groupEnd();

  console.group('✅ Permission Checks');
  console.log('Has user_create:', store.hasPermission('user_create'));
  console.log('Has user_edit:', store.hasPermission('user_edit'));
  console.log('Is Super Admin:', store.isSuperAdmin());
  console.groupEnd();

  console.group('🎭 Role Checks');
  console.log('Has super_admin role:', store.hasRole('super_admin'));
  console.log('Has manager role:', store.hasRole('manager'));
  console.log('Role Names:', store.getRoleNames());
  console.groupEnd();
};

// Make available in browser console
if (typeof window !== 'undefined') {
  window.testAuth = testAuth;
}
// ```

// ---

// ## 📋 Summary

// ### ✅ What We've Created:

// 1. **ProtectedRoute** - Checks authentication
// 2. **PermissionGuard** - Checks specific permissions
// 3. **RoleGuard** - Checks specific roles
// 4. **GuestRoute** - Redirects authenticated users
// 5. **Can Component** - Conditional rendering based on permissions/roles
// 6. **Error Pages** - 401, 403, 404
// 7. **Main App Router** - Complete routing structure
// 8. **Layouts** - Auth and Dashboard layouts

// ### 🎯 Routes Structure:
// ```
// Public Routes:
//   - /login
//   - /register

// Protected Routes:
//   - /dashboard (authenticated)
//   - /dashboard/admin (super_admin role)
//   - /users (user_list permission)
//   - /users/create (user_create permission)
//   - /users/:id (user_view permission)
//   - /users/:id/edit (user_edit permission)

// Error Routes:
//   - /401 (Unauthorized)
//   - /403 (Forbidden)
//   - /404 (Not Found)