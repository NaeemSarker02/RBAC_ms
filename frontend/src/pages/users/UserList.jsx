import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, Search, Eye, Edit, Trash2, UserCheck, UserX, RefreshCw, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import userApi from '../../api/userApi';
import Can from '../../components/auth/Can';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } }
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0, perPage: 15 });

  const fetchUsers = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({ page, per_page: pagination.perPage, search });
      if (response.success) {
        setUsers(response.data);
        setPagination(prev => ({
          ...prev,
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination.perPage]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const columns = [
    {
      key: 'name',
      header: 'Identity',
      render: (user) => (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-premium-violet to-premium-indigo flex items-center justify-center text-white font-bold shadow-glow border border-white/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 tracking-tight">{user.name}</div>
            <div className="text-xs text-slate-500 font-medium">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Access Level',
      render: (user) => (
        <div className="flex flex-wrap gap-1.5">
          {user.roles?.map((role) => (
            <span key={role.id} className="px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {role.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          user.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Operations',
      render: (user) => (
        <div className="flex items-center gap-1">
          <Link to={`/users/${user.id}`} className="p-2 text-slate-400 hover:text-premium-indigo transition-colors hover:bg-slate-50 rounded-lg"><Eye className="w-4.5 h-4.5" /></Link>
          <Can permission="user_edit">
            <Link to={`/users/${user.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-slate-50 rounded-lg"><Edit className="w-4.5 h-4.5" /></Link>
          </Can>
          <Can permission="user_delete">
            <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors hover:bg-slate-50 rounded-lg"><Trash2 className="w-4.5 h-4.5" /></button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium">Manage corporate access and identity verification</p>
        </div>
        <Can permission="user_create">
          <Link to="/users/create" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 font-semibold text-sm">
            <Plus className="w-5 h-5" /> Add New Member
          </Link>
        </Can>
      </div>

      <div className="premium-card p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, email or UID..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-premium-violet/20 transition-all placeholder:text-slate-400 text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"><Filter className="w-5 h-5" /></button>
      </div>

      <div className="premium-card overflow-hidden">
        <Table columns={columns} data={users} isLoading={loading} />
      </div>
      
      {!loading && <Pagination {...pagination} onPageChange={(p) => fetchUsers(p, searchQuery)} />}
    </motion.div>
  );
};

export default UserList;