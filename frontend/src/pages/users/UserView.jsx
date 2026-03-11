import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  Loader2, User, Mail, Calendar, Shield, Edit, 
  Trash2, UserCheck, UserX, ArrowLeft, Hash, Activity 
} from 'lucide-react';
import userApi from '../../api/userApi';
import Can from '../../components/auth/Can';

const MotionDiv = motion.div;

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useMemo(() => Number(id), [id]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userApi.getUser(userId);
      setUser(res?.data || null);
    } catch (e) {
      toast.error(e.message || 'Failed to load user');
      navigate('/users', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate, userId]);

  useEffect(() => {
    if (!Number.isFinite(userId)) { navigate('/users', { replace: true }); return; }
    loadUser();
  }, [loadUser, navigate, userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const res = user.is_active ? await userApi.deactivateUser(userId) : await userApi.activateUser(userId);
      toast.success(res.message || 'Status updated');
      await loadUser();
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-premium-violet" />
      <span className="font-medium animate-pulse">Retrieving encrypted profile...</span>
    </div>
  );

  const roles = user?.roles || [];

  return (
    <MotionDiv initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between px-1">
        <Link to="/users" className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Directory
        </Link>
        <div className="flex gap-2">
          <Can permission="user_edit">
            <Link to={`/users/${userId}/edit`} className="premium-card !bg-white px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-700 hover:border-premium-violet/30 transition-all">
              <Edit className="w-4 h-4 text-premium-violet" /> Edit Profile
            </Link>
          </Can>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="premium-card p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-premium-violet/10 to-transparent rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-premium-violet to-premium-indigo p-1 shadow-glow">
            <div className="h-full w-full bg-white rounded-[22px] flex items-center justify-center text-4xl font-black text-slate-900">
              {user.name.charAt(0)}
            </div>
          </div>

          <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {roles.map(r => (
                <span key={r.id} className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">
                  {r.name}
                </span>
              ))}
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${user.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                {user.is_active ? 'Account Verified' : 'Access Restricted'}
              </span>
            </div>
          </div>

          <div className="md:ml-auto flex flex-col gap-2 w-full md:w-auto">
            <button onClick={handleToggleStatus} className={`w-full px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${user.is_active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
              {user.is_active ? 'Deactivate Account' : 'Activate Account'}
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-6 space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-premium-violet" /> Core Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DetailItem icon={Mail} label="Primary Email" value={user.email} />
              <DetailItem icon={Calendar} label="Member Since" value={new Date(user.created_at).toLocaleDateString('en-US', { dateStyle: 'long' })} />
              <DetailItem icon={Hash} label="System Identifier" value={`#USR-${user.id.toString().padStart(5, '0')}`} />
              <DetailItem icon={Shield} label="Security Status" value={user.is_active ? 'Active' : 'Locked'} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="premium-card p-6 bg-slate-900 text-white border-none shadow-glass-lg relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-premium-indigo/20 rounded-full -mb-16 -mr-16 blur-2xl" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Permission Map</h3>
            <div className="space-y-3 relative z-10">
              {roles.length > 0 ? roles.map(r => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="h-2 w-2 rounded-full bg-premium-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <span className="text-sm font-semibold">{r.name} Access</span>
                </div>
              )) : (
                <p className="text-slate-500 text-xs italic">No high-level roles assigned to this profile.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1.5 group">
    <div className="flex items-center gap-2 text-slate-400">
      <Icon className="w-4 h-4 group-hover:text-premium-violet transition-colors" />
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-slate-900 font-bold tracking-tight text-lg pl-6">{value}</div>
  </div>
);

export default UserView;