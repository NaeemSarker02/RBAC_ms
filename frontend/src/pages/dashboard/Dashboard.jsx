import { motion } from 'framer-motion';
import { Users, Shield, Key, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Dashboard = () => {
  const { user, getRoleNames } = useAuthStore();

  const stats = [
    { name: 'Total Users', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { name: 'Active Roles', value: '12', icon: Shield, color: 'bg-green-500' },
    { name: 'Permissions', value: '48', icon: Key, color: 'bg-purple-500' },
    { name: 'Activity', value: '+12%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          You are logged in as{' '}
          <span className="font-semibold text-primary-600">
            {getRoleNames().join(', ')}
          </span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <p className="text-gray-600">Dashboard content will appear here...</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;