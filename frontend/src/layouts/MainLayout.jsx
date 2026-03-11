import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex pt-16 h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto custom-scrollbar bg-transparent">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

            <footer className="mt-12 py-6 border-t border-gray-200/60 text-center">
              <p className="text-xs font-medium text-gray-400">
                &copy; {new Date().getFullYear()} <span className="text-primary-600">RBAC Premium</span>. Engineered for Security.
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;