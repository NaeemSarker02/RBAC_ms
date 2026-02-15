import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <ShieldCheck className="w-24 h-24 text-primary-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          This is an exclusive admin area. Only users with Super Admin role can access this page.
        </p>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;