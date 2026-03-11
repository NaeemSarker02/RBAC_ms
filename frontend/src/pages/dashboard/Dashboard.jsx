import { motion } from 'framer-motion';
import { 
  Users, Shield, Key, Activity, 
  ArrowUpRight, Clock, ShieldCheck, 
  Zap, Globe, MoreHorizontal, ChevronRight,
  Database, HardDrive, Cpu
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Total Users', value: '1,234', growth: '+12.5%', icon: Users, color: 'text-blue-500', trend: 'up' },
    { name: 'Active Roles', value: '12', growth: 'Stable', icon: Shield, color: 'text-violet-500', trend: 'neutral' },
    { name: 'Permissions', value: '48', growth: '+3', icon: Key, color: 'text-fuchsia-500', trend: 'up' },
    { name: 'Server Load', value: '42%', growth: '-4%', icon: Activity, color: 'text-emerald-500', trend: 'down' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-[1600px] mx-auto space-y-6 pb-12 px-4 md:px-0"
    >
      {/* --- HEADER SECTION --- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Production</span>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 bg-white">
            Download Report
          </button>
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all">
            Create User
          </button>
        </div>
      </motion.div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={itemVariants}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-violet-200 transition-all"
          >
            <div className="flex justify-between items-start">
              <div className={`${stat.color} p-2.5 bg-slate-50 rounded-xl group-hover:bg-white transition-colors`}>
                <stat.icon size={22} />
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                stat.trend === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
              }`}>
                {stat.growth}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.name}</p>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Audit Log Table */}
        <motion.div variants={itemVariants} className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Globe size={18} className="text-violet-500" /> Recent Audit Logs
            </h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                          JD
                        </div>
                        <span className="text-sm font-semibold text-slate-700">John Doe</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">Update Role</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">Oct 24, 2023</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                         <span className="w-1 h-1 rounded-full bg-emerald-500"></span> SUCCESS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-violet-600 border-t border-slate-100 transition-colors bg-slate-50/30">
            View All Transactions
          </button>
        </motion.div>

        {/* Infrastructure Side Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold tracking-tight">System Resources</h3>
              <Zap size={18} className="text-amber-400" />
            </div>

            <div className="space-y-5">
              <ResourceBar icon={<Cpu size={14}/>} label="CPU Usage" value={78} color="bg-violet-500" />
              <ResourceBar icon={<HardDrive size={14}/>} label="Memory" value={52} color="bg-emerald-500" />
              <ResourceBar icon={<Database size={14}/>} label="Storage" value={84} color="bg-blue-500" />
            </div>

            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/10">
              Open Cloud Console
            </button>
          </div>

          <div className="p-5 bg-violet-50 border border-violet-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-violet-600" size={20} />
              <p className="text-sm font-bold text-violet-900">Security Score</p>
            </div>
            <p className="text-xs text-violet-700 leading-relaxed mb-4">
              Your system security is at <span className="font-bold">94%</span>. Rotate API keys to reach 100%.
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-violet-600 cursor-pointer hover:underline">
              Improve Security <ChevronRight size={14} />
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

const ResourceBar = ({ icon, label, value, color }) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
      <span className="flex items-center gap-2">{icon} {label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }} 
        animate={{ width: `${value}%` }} 
        className={`h-full ${color}`} 
      />
    </div>
  </div>
);

export default Dashboard;