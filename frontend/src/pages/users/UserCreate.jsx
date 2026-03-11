import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Save, UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react';
import userApi from '../../api/userApi';

const UserCreate = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { is_active: true }
  });

  const onSubmit = async (data) => {
    try {
      const res = await userApi.createUser(data);
      toast.success('Member provisioned successfully');
      navigate(`/users/${res?.data?.id || ''}`);
    } catch (e) { toast.error(e.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
          <span className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl"><UserPlus className="w-8 h-8" /></span>
          Provision New Member
        </h1>
        <p className="mt-4 text-slate-500 font-medium pl-1">Create a unique system identity with granular access control</p>
      </div>

      <div className="premium-card p-10 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><UserPlus className="w-32 h-32" /></div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            <FormInput register={register} name="name" label="Full Name" icon={UserPlus} placeholder="e.g. Marcus Aurelius" error={errors.name} required />
            <FormInput register={register} name="email" label="Email Workspace" icon={Mail} placeholder="name@company.com" error={errors.email} required />
            <FormInput register={register} name="password" label="Secure Password" icon={Lock} type="password" placeholder="Min. 8 characters" error={errors.password} required />
            <FormInput register={register} name="password_confirmation" label="Confirm Access Key" icon={ShieldCheck} type="password" error={errors.password_confirmation} required />
          </div>

          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <div>
               <h4 className="font-bold text-slate-900 text-sm">Account Initialization</h4>
               <p className="text-xs text-slate-500 font-medium">Enable profile access immediately upon creation</p>
             </div>
             <input type="checkbox" {...register('is_active')} className="w-6 h-6 rounded-lg text-premium-violet focus:ring-premium-violet/20 border-slate-300" />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={() => navigate('/users')} className="px-8 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
            <button disabled={isSubmitting} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-glow-lg disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Authorize & Create
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const FormInput = ({ register, name, label, icon: Icon, type = "text", placeholder, error, required }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-premium-violet transition-colors">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-premium-violet transition-all" />
      <input 
        type={type} 
        placeholder={placeholder}
        {...register(name, { required })} 
        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-premium-violet focus:ring-4 focus:ring-premium-violet/5 transition-all font-semibold text-slate-900" 
      />
    </div>
    {error && <span className="text-[10px] font-bold text-rose-500 uppercase">This field is required</span>}
  </div>
);

export default UserCreate;