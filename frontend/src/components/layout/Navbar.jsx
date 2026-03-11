import { Search, Bell, User, LogOut, ChevronDown, Settings, Shield, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: "New User Registered", time: "2m ago", read: false },
    { id: 2, title: "System Update Complete", time: "1h ago", read: true },
  ];

  return (
    // Updated background to match Sidebar depth (#0F172A / slate-900)
    <nav className={`h-16 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl' 
        : 'bg-[#0F172A] border-b border-slate-800/50'
    }`}>
      
      {/* Left Section */}
      <div className="flex items-center flex-1 max-w-2xl">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 mr-4 text-slate-400 hover:bg-slate-800 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Premium Dark Search Bar */}
        <div className="relative group w-full max-w-md hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="w-full h-10 pl-10 pr-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 focus:border-violet-500/50 focus:bg-[#1e293b] rounded-xl text-sm transition-all outline-none text-slate-200 placeholder:text-slate-500 focus:ring-4 focus:ring-violet-500/10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${
              showNotifications ? 'bg-slate-800 text-violet-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0F172A]"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute right-0 mt-3 w-80 bg-[#1e293b] border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                  <h3 className="font-semibold text-slate-200 text-sm">Notifications</h3>
                  <button className="text-[11px] font-medium text-violet-400 hover:text-violet-300">Mark all read</button>
                </div>
                <div className="py-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex items-center gap-3 group">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.read ? 'bg-slate-700/50' : 'bg-violet-500/20'}`}>
                        <Shield className={`w-4 h-4 ${n.read ? 'text-slate-500' : 'text-violet-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-snug ${n.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile - Matching Sidebar Theme */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 p-[2px] shadow-lg shadow-violet-500/20">
              <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center overflow-hidden">
                <span className="text-xs font-black text-white">{user?.name?.charAt(0) || 'A'}</span>
              </div>
            </div>
            <div className="hidden lg:block text-left">
               <p className="text-xs font-bold text-slate-200 leading-none">{user?.name || 'Admin'}</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showProfile ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-60 bg-[#1e293b] border border-slate-700 shadow-2xl rounded-2xl p-2"
              >
                <div className="px-3 py-3 border-b border-slate-700 mb-1">
                  <p className="text-sm font-bold text-slate-100">{user?.name || 'Admin User'}</p>
                  <p className="text-[10px] text-slate-400 truncate font-medium uppercase tracking-wider">{user?.email}</p>
                </div>
                
                <div className="space-y-0.5">
                  <MenuLink icon={<User className="w-4 h-4" />} label="My Profile" />
                  <MenuLink icon={<Settings className="w-4 h-4" />} label="Account Settings" />
                </div>
                
                <div className="my-1.5 h-px bg-slate-700" />
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

const MenuLink = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all font-medium">
    <span className="text-slate-500 group-hover:text-violet-400">{icon}</span>
    {label}
  </button>
);

export default Navbar;