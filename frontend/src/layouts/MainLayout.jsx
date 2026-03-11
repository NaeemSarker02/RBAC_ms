import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const MainLayout = () => {
  // sidebarOpen: Mobile drawer (True/False)
  // isCollapsed: Desktop width (80px/280px)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} // Pass the setter for mobile overlay/close
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        <Navbar 
          setIsOpen={setSidebarOpen} // Navbar needs to open the drawer on mobile
          isCollapsed={isCollapsed}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
          <div className="max-w-7xl mx-auto min-h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex-1"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

            <footer className="mt-auto py-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} 
              <span className="text-violet-600 ml-1">RBAC Premium UI</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;