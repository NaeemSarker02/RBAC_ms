import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      permissions: [],
      roles: [],
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (userData) => {
        set({
          user: userData.user,
          token: userData.access_token || userData.token,
          permissions: userData.permissions || [],
          roles: userData.user?.roles || [],
          isAuthenticated: true,
        });

        // Store token in localStorage
        if (userData.access_token || userData.token) {
          localStorage.setItem('auth_token', userData.access_token || userData.token);
        }
      },

      setUser: (user) => {
        set({ user });
      },

      setPermissions: (permissions) => {
        set({ permissions });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      logout: () => {
        set({
          user: null,
          token: null,
          permissions: [],
          roles: [],
          isAuthenticated: false,
        });

        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth-storage');
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // Permission checks
      hasPermission: (permission) => {
        const { permissions, user } = get();
        
        // Super Admin bypass
        if (user?.roles?.some(role => role.slug === 'super_admin')) {
          return true;
        }

        return permissions.some(p => p.slug === permission);
      },

      hasAnyPermission: (permissionArray) => {
        const { permissions, user } = get();
        
        // Super Admin bypass
        if (user?.roles?.some(role => role.slug === 'super_admin')) {
          return true;
        }

        return permissionArray.some(permission =>
          permissions.some(p => p.slug === permission)
        );
      },

      hasAllPermissions: (permissionArray) => {
        const { permissions, user } = get();
        
        // Super Admin bypass
        if (user?.roles?.some(role => role.slug === 'super_admin')) {
          return true;
        }

        return permissionArray.every(permission =>
          permissions.some(p => p.slug === permission)
        );
      },

      // Role checks
      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.some(r => r.slug === role);
      },

      hasAnyRole: (roleArray) => {
        const { user } = get();
        return roleArray.some(role =>
          user?.roles?.some(r => r.slug === role)
        );
      },

      hasAllRoles: (roleArray) => {
        const { user } = get();
        return roleArray.every(role =>
          user?.roles?.some(r => r.slug === role)
        );
      },

      // Check if user is Super Admin
      isSuperAdmin: () => {
        const { user } = get();
        return user?.roles?.some(role => role.slug === 'super_admin');
      },

      // Get user's role names
      getRoleNames: () => {
        const { user } = get();
        return user?.roles?.map(role => role.name) || [];
      },

      // Get user's permission slugs
      getPermissionSlugs: () => {
        const { permissions } = get();
        return permissions.map(p => p.slug);
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        roles: state.roles,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };