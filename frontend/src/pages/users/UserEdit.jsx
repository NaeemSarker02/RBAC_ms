import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
// ADDED 'User' to the imports below
import { Loader2, Save, UserCog, Mail, Lock, X, User } from 'lucide-react';
import userApi from '../../api/userApi';

const MotionDiv = motion.div;

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useMemo(() => Number(id), [id]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    // Safety check: if ID is not a number, redirect immediately
    if (isNaN(userId)) {
      toast.error("Invalid User ID");
      navigate('/users');
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUser(userId);
        
        // Ensure data exists before resetting
        if (res?.data) {
          reset({
            name: res.data.name || '',
            email: res.data.email || '',
            is_active: !!res.data.is_active,
          });
        }
      } catch (e) {
        console.error("Edit Load Error:", e);
        toast.error('Failed to load user credentials');
        navigate('/users');
      } finally { 
        setLoading(false); 
      }
    };

    load();
  }, [userId, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      // Clean up password fields if they are empty strings
      const payload = { ...data };
      if (!payload.password || payload.password.trim() === "") {
        delete payload.password;
        delete payload.password_confirmation;
      }

      await userApi.updateUser(userId, payload);
      toast.success('Account updated successfully');
      navigate(`/users/${userId}`);
    } catch (e) { 
      toast.error(e.message || "Update failed"); 
    }
  };

  return (
    <MotionDiv 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-premium-violet/10 rounded-2xl">
            <UserCog className="w-8 h-8 text-premium-violet" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Modify Account</h1>
            <p className="text-slate-500 text-sm font-medium">Update profile identity and security protocols</p>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="premium-card p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-premium-violet" />
            <p className="text-slate-400 font-medium animate-pulse">Loading credentials...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Field */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-premium-violet transition-colors">
                  Legal Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-violet transition-colors" />
                  <input 
                    {...register('name', { required: "Name is required" })} 
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl outline-none transition-all font-semibold ${
                      errors.name ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 focus:border-premium-violet focus:ring-4 focus:ring-premium-violet/5'
                    }`} 
                  />
                </div>
                {errors.name && <p className="text-rose-500 text-xs font-bold">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-premium-violet transition-colors">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-violet transition-colors" />
                  <input 
                    {...register('email', { required: "Email is required" })} 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-premium-violet focus:ring-4 focus:ring-premium-violet/5 transition-all font-semibold" 
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs font-bold">{errors.email.message}</p>}
              </div>

              {/* Password Fields */}
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-focus-within:text-premium-violet transition-colors">
                  New Password (Auth)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-violet transition-colors" />
                  <input 
                    type="password" 
                    {...register('password')} 
                    placeholder="Leave blank to keep current" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-premium-violet focus:ring-4 focus:ring-premium-violet/5 transition-all font-semibold" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6 h-fit self-end">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...register('is_active')} id="is_active" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-premium-violet"></div>
                  <label htmlFor="is_active" className="ml-3 text-sm font-bold text-slate-700 select-none">Account Active</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                Discard
              </button>
              <button 
                disabled={isSubmitting} 
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}Change
              </button>
            </div>
          </form>
        )}
      </div>
    </MotionDiv>
  );
};

export default UserEdit;