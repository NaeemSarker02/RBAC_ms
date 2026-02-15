import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  Settings,
  BarChart3,
  FileText,
  Building2,
  LogOut,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';
import { useState } from 'react';

/**
 * Sidebar Component
 * Dynamically shows menu items based on user permissions
 */
const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, hasAnyPermission, isSuperAdmin, logout } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState({});

  // Menu items with permission requirements
  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      permission: null, // Always visible for authenticated users
    },
    {
      title: 'Admin Dashboard',
      icon: BarChart3,
      path: '/dashboard/admin',
      permission: null,
      roles: ['super_admin'], // Only for super admin
    },
    {
      title: 'Users',
      icon: Users,
      permission: ['user_list', 'user_view'],
      requireAny: true,
      children: [
        {
          title: 'All Users',
          path: '/users',
          permission: 'user_list',
        },
        {
          title: 'Create User',
          path: '/users/create',
          permission: 'user_create',
        },
      ],
    },
    {
      title: 'Roles',
      icon: Shield,
      permission: ['role_list', 'role_view'],
      requireAny: true,
      children: [
        {
          title: 'All Roles',
          path: '/roles',
          permission: 'role_list',
        },
        {
          title: 'Create Role',
          path: '/roles/create',
          permission: 'role_create',
        },
      ],
    },
    {
      title: 'Permissions',
      icon: Key,
      permission: ['permission_list', 'permission_view'],
      requireAny: true,
      children: [
        {
          title: 'All Permissions',
          path: '/permissions',
          permission: 'permission_list',
        },
        {
          title: 'Create Permission',
          path: '/permissions/create',
          permission: 'permission_create',
        },
      ],
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/reports',
      permission: 'report_view',
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/settings',
      permission: 'setting_view',
    },
  ];

  // Check if user has permission for menu item
  const hasMenuPermission = (item) => {
    // Super Admin has access to everything
    if (isSuperAdmin()) return true;

    // Check role-based access
    if (item.roles && item.roles.length > 0) {
      return item.roles.some(role => user?.roles?.some(r => r.slug === role));
    }

    // No permission required
    if (!item.permission) return true;

    // Check permissions
    if (Array.isArray(item.permission)) {
      return item.requireAny
        ? hasAnyPermission(item.permission)
        : item.permission.every(p => hasPermission(p));
    }

    return hasPermission(item.permission);
  };

  // Check if submenu item has permission
  const hasSubmenuPermission = (permission) => {
    if (isSuperAdmin()) return true;
    if (!permission) return true;
    return hasPermission(permission);
  };

  // Toggle submenu expansion
  const toggleSubmenu = (title) => {
    setExpandedMenus(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if path is active
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <>
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64
          bg-white border-r border-gray-200 shadow-sm
          lg:relative lg:top-0 lg:h-full
          custom-scrollbar overflow-y-auto
        `}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user?.roles?.[0]?.name || 'User'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              // Check if user has permission for this menu item
              if (!hasMenuPermission(item)) return null;

              const Icon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.title];
              const isActive = item.path && isActivePath(item.path);

              return (
                <div key={item.title}>
                  {/* Main Menu Item */}
                  {hasChildren ? (
                    // Menu with children (expandable)
                    <button
                      onClick={() => toggleSubmenu(item.title)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-lg
                        text-sm font-medium transition-all duration-200
                        ${isExpanded
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    </button>
                  ) : (
                    // Menu without children (direct link)
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}

                  {/* Submenu Items */}
                  <AnimatePresence>
                    {hasChildren && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => {
                            // Check permission for submenu item
                            if (!hasSubmenuPermission(child.permission)) return null;

                            const isChildActive = isActivePath(child.path);

                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                className={`
                                  block px-4 py-2 rounded-lg text-sm
                                  transition-all duration-200
                                  ${isChildActive
                                    ? 'bg-primary-100 text-primary-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                {child.title}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                text-sm font-medium text-red-600 hover:bg-red-50
                transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default Sidebar;