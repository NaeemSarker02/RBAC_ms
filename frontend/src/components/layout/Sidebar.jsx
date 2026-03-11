import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Shield,
  Key,
  FileText,
  LogOut,
  ChevronRight,
  Circle,
  Menu
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuthStore();
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    if (isCollapsed) setExpandedMenus({});
  }, [isCollapsed]);

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { 
      title: 'Users', 
      icon: Users, 
      children: [
        { title: 'All Users', path: '/users' },
        { title: 'Create User', path: '/users/create' },
      ]
    },
    { 
      title: 'Roles', 
      icon: Shield, 
      children: [
        { title: 'All Roles', path: '/roles' },
        { title: 'Create Role', path: '/roles/create' },
      ]
    },
    { 
      title: 'Permissions', 
      icon: Key, 
      children: [{ title: 'All Permissions', path: '/permissions' }]
    },
    { title: 'Reports', icon: FileText, path: '/reports' },
  ];

  const toggleSubmenu = (title) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setExpandedMenus({ [title]: true });
    } else {
      setExpandedMenus(prev => ({ ...prev, [title]: !prev[title] }));
    }
  };

  const isActivePath = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const springTransition = { type: 'spring', stiffness: 400, damping: 32 };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" 
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '88px' : '280px',
          x: isOpen || window.innerWidth >= 1024 ? 0 : -280
        }}
        transition={springTransition}
        className="fixed lg:relative z-50 h-screen bg-[#0F172A] border-r border-slate-800 shadow-[20px_0_50px_rgba(0,0,0,0.2)] flex flex-col"
      >
        {/* Header Section */}
        <div className="h-20 flex items-center px-6 border-b border-slate-800/50 shrink-0 relative">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                key="logo"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black text-white tracking-tighter uppercase italic">RBAC</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 hidden lg:block
              ${isCollapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto no-scrollbar overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus[item.title];
            const isActive = item.path && isActivePath(item.path);

            return (
              <div key={item.title} className="relative group">
                {hasChildren ? (
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                      isExpanded ? 'bg-slate-800/40 text-white' : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 shrink-0 ${isExpanded ? 'text-violet-400' : 'text-slate-500'}`} />
                      {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.title}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-violet-400' : 'text-slate-600'}`} />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`group relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-violet-600/10 text-violet-400' 
                        : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.title}</span>}
                    
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <motion.div 
                        layoutId="activeBar" 
                        className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full" 
                      />
                    )}
                  </Link>
                )}

                {/* Submenu */}
                <AnimatePresence>
                  {hasChildren && isExpanded && !isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-9 border-l border-slate-800/80"
                    >
                      <div className="pl-4 py-2 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path} to={child.path}
                            className={`flex items-center space-x-3 p-2 rounded-lg text-xs font-bold transition-all ${
                              isActivePath(child.path) ? 'text-violet-400 bg-violet-400/5' : 'text-slate-500 hover:text-slate-200'
                            }`}
                          >
                            <Circle className={`w-1.5 h-1.5 fill-current ${isActivePath(child.path) ? 'text-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]' : 'text-slate-600'}`} />
                            <span>{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-[11px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-[-10px] pointer-events-none transition-all duration-300 z-[100] shadow-2xl border border-slate-700">
                    {item.title}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-700 rotate-45" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

         {/* Footer Branding */}
        <div className="p-4 border-t border-slate-800/50 text-center">
          {!isCollapsed && <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Version 1.0</span>}
        </div>
      </motion.aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;