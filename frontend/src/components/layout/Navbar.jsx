import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, Search, Settings, User, LogOut, ChevronDown, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout, getRoleNames } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, message: 'New user registered', time: '5 min ago', unread: true },
    { id: 2, message: 'System backup completed', time: '2 hours ago', unread: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 blur-bg bg-white/70 border-b border-white/20 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-primary-50 transition-colors duration-200 lg:hidden"
          >
            {sidebarOpen ? <X className="w-6 h-6 text-primary-600" /> : <Menu className="w-6 h-6 text-primary-600" />}
          </button>

          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block text-xl font-bold text-gradient">RBAC System</span>
          </Link>
        </div>

        {/* Search Bar with input-premium style */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search insights..." className="input-premium pl-10 py-2 text-sm" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <button onClick={() => setNotificationOpen(!notificationOpen)} className="p-2 rounded-xl hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full border-2 border-white"></span>
            </button>
            <AnimatePresence>
              {notificationOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-80 glass-card-lg rounded-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-100 font-bold text-gray-800">Notifications</div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-primary-50/50 transition-colors border-b border-gray-50">
                        <p className="text-sm text-gray-700">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-secondary flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-64 glass-card-lg rounded-2xl overflow-hidden py-2"
                >
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button onClick={() => navigate('/profile')} className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-primary-50 text-gray-700 text-sm">
                    <User className="w-4 h-4" /> <span>Profile Settings</span>
                  </button>
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-danger-100 text-danger-600 text-sm font-medium">
                    <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = { sidebarOpen: PropTypes.bool.isRequired, setSidebarOpen: PropTypes.func.isRequired };
export default Navbar;