import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, UserPlus, Loader2, 
  ShieldCheck, CheckCircle2, ArrowRight,
  User, Globe, Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) navigate('/dashboard', { replace: true });
  };

  const benefits = [
    { title: 'Secure Identity', desc: 'Enterprise-grade credential protection' },
    { title: 'Instant Setup', desc: 'Initialize your workspace in seconds' },
    { title: 'Nexus Sync', desc: 'Real-time access across all nodes' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#f8fafc] overflow-hidden relative">
      {/* Shared Premium Background Engine */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_40%)]" />
        
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-96 h-96 bg-primary-200/30 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]" 
        />
      </div>

      <div className="w-full max-w-[1100px] grid lg:grid-cols-12 gap-0 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 relative z-10 overflow-hidden">
        
        {/* Left Section: Contextual Hook */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden lg:flex lg:col-span-5 bg-[#0f172a] p-12 flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-16">
              <div className="p-2.5 bg-primary-500 rounded-xl shadow-lg shadow-primary-500/30">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Nexus Cloud</span>
            </div>

            <h2 className="text-4xl font-extrabold text-white leading-[1.1] mb-6">
              Join the <span className="text-primary-400">secure</span> mesh network.
            </h2>
            
            <div className="space-y-6">
              {benefits.map((b, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  key={i} 
                  className="flex items-start space-x-4 group"
                >
                  <div className="mt-1 p-1 bg-white/10 rounded-md group-hover:bg-primary-500/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{b.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10">
            <div className="flex items-center space-x-3 text-primary-400">
              <Sparkles className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Ready for Deployment</p>
            </div>
          </div>
        </motion.div>

        {/* Right Section: Registration Form */}
        <div className="col-span-12 lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white/60">
          <div className="max-w-md mx-auto w-full">
            <header className="mb-8">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="lg:hidden w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary-200"
              >
                <ShieldCheck className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
              <p className="text-slate-500 font-medium">Get started with your professional identity.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    {...register('name', { required: 'Name is required' })}
                    type="text" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <span className="text-xs text-red-500 font-bold ml-1">{errors.name.message}</span>}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                  <input 
                    {...register('email', { required: 'Email is required' })}
                    type="email" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</span>}
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <input 
                      {...register('password', { required: 'Required', minLength: { value: 8, message: '8+ chars' } })}
                      type={showPassword ? 'text' : 'password'} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium text-sm"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700 ml-1">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <input 
                      {...register('password_confirmation', { 
                        validate: v => v === password || 'No match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'} 
                      className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-slate-900 font-medium text-sm"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 flex items-center justify-center space-x-3 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                ) : (
                  <>
                    <span>Initialize Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-8 text-center text-sm font-medium text-slate-500">
              Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;