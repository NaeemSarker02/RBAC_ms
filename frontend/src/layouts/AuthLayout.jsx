import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Shield, Globe } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-8 bg-[#f8fafc]">
      {/* Background Engine */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_40%)]" />
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-200/30 rounded-full blur-[80px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] z-10"
      >
        {/* Unified Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter">RBAC</h1>
          </div>
          <p className="text-slate-500 font-medium tracking-tight">Enterprise Access Simplified</p>
        </div>

        {/* Component Content Injection */}
        <div className="w-full bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden">
          {children}
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="mt-8 flex items-center space-x-4 text-slate-400 z-10">
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Nexus-OS v1.0</span>
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full" />
        <span className="text-[10px] font-bold uppercase tracking-widest">© 2026 Nexus Security</span>
      </div>
    </div>
  );
};

AuthLayout.propTypes = { children: PropTypes.node.isRequired };
export default AuthLayout;