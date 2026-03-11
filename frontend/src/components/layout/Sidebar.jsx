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
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';
import { useState } from 'react';

const MotionAside = motion.aside;
const MotionDiv = motion.div;

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, hasPermission, hasAnyPermission, isSuperAdmin, logout } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', permission: null },
    // { title: 'Admin Dashboard', icon: BarChart3, path: '/dashboard/admin', permission: null, roles: ['super_admin'] },
    { 
      title: 'Users', 
      icon: Users, 
      permission: ['user_list', 'user_view'], 
      requireAny: true,
      children: [
        { title: 'All Users', path: '/users', permission: 'user_list' },
        { title: 'Create User', path: '/users/create', permission: 'user_create' },
      ]
    },
    { 
      title: 'Roles', 
      icon: Shield, 
      permission: ['role_list', 'role_view'], 
      requireAny: true,
      children: [
        { title: 'All Roles', path: '/roles', permission: 'role_list' },
        { title: 'Create Role', path: '/roles/create', permission: 'role_create' },
      ]
    },
    { 
      title: 'Permissions', 
      icon: Key, 
      permission: ['permission_list', 'permission_view'], 
      requireAny: true,
      children: [
        { title: 'All Permissions', path: '/permissions', permission: 'permission_list' },
        { title: 'Create Permission', path: '/permissions/create', permission: 'permission_create' },
      ]
    },
    { title: 'Reports', icon: FileText, path: '/reports', permission: 'report_view' },
    { title: 'Settings', icon: Settings, path: '/settings', permission: 'setting_view' },
  ];

  const hasMenuPermission = (item) => {
    if (isSuperAdmin()) return true;
    if (item.roles?.length > 0) {
      return item.roles.some(role => user?.roles?.some(r => r.slug === role));
    }
    if (!item.permission) return true;
    if (Array.isArray(item.permission)) {
      return item.requireAny ? hasAnyPermission(item.permission) : item.permission.every(p => hasPermission(p));
    }
    return hasPermission(item.permission);
  };

  const hasSubmenuPermission = (permission) => {
    if (isSuperAdmin()) return true;
    return !permission || hasPermission(permission);
  };

  const toggleSubmenu = (title) => {
    setExpandedMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <MotionAside
      initial={false}
      animate={{ 
        width: isOpen ? '260px' : '0px',
        x: isOpen ? 0 : -260,
        opacity: isOpen ? 1 : 0 
      }}
      className="fixed lg:relative z-40 h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl lg:shadow-none overflow-hidden"
    >
      <div className="flex flex-col h-full w-[260px]">
        {/* User Profile Section - Enhanced Design */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-primary shadow-lg flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-105 transition-transform duration-300">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                {user?.name}
              </p>
              <p className="text-[11px] font-medium text-primary-600 uppercase tracking-wider mt-0.5">
                {user?.roles?.[0]?.name || 'Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 p-4 space-y-1.5 custom-scrollbar overflow-y-auto">
          {menuItems.map((item) => {
            if (!hasMenuPermission(item)) return null;

            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.title];
            const isActive = item.path && isActivePath(item.path);

            return (
              <div key={item.title} className="space-y-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isExpanded ? 'bg-primary-50/50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isExpanded ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-primary-600' : 'text-gray-300'}`} />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 transform ${
                      isActive 
                        ? 'bg-gradient-primary text-white shadow-premium scale-[1.02]' 
                        : 'text-gray-600 hover:bg-gray-50 hover:translate-x-1'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-500'}`} />
                    <span>{item.title}</span>
                  </Link>
                )}

                <AnimatePresence>
                  {hasChildren && isExpanded && (
                    <MotionDiv
                      initial={{ height: 0, opacity: 0, x: -10 }}
                      animate={{ height: 'auto', opacity: 1, x: 0 }}
                      exit={{ height: 0, opacity: 0, x: -10 }}
                      className="overflow-hidden ml-6 border-l-2 border-primary-100/50"
                    >
                      <div className="pl-4 py-1 space-y-1">
                        {item.children.map((child) => {
                          if (!hasSubmenuPermission(child.permission)) return null;
                          const isChildActive = isActivePath(child.path);

                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`block px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                                isChildActive
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50/50'
                              }`}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 bg-gray-50/30 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <div className="p-1.5 rounded-lg bg-red-100 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Sign Out System</span>
          </button>
        </div>
      </div>
    </MotionAside>
  );
};

Sidebar.propTypes = { isOpen: PropTypes.bool.isRequired };

export default Sidebar;