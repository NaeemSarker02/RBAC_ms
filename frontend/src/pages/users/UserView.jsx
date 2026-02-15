// Similar placeholder structure for other pages
import { motion } from 'framer-motion';

const UserView = () => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create User</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600">User creation form will appear here...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default UserView;