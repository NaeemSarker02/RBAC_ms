import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, 
  Command, CheckCircle2, ArrowLeft, Send, Shield 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';

// Sub-Component: Forgot Password Form
const ForgotPasswordForm = ({ onBack }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    // Logic for password reset
    toast('Password reset is not enabled yet. Contact an administrator.', {
      duration: 4000,
      icon: '🔐',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h1>
        <p className="text-slate-500 font-medium">Enter your email to receive recovery instructions.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              {...register('email', { 
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
              type="email" 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
              placeholder="admin@nexus.com"
            />
          </div>
          {errors.email && <span className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</span>}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center space-x-3 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Send Recovery Link</span><Send className="w-4 h-4" /></>}
        </motion.button>
      </form>

      <button 
        onClick={onBack}
        className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Sign In
      </button>
    </motion.div>
  );
};

// Main Login Component
const Login = () => {
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', device_name: 'web' },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) navigate(from, { replace: true });
  };

  const features = [
    { title: 'Secure Gateway', desc: 'Encrypted node access' },
    { title: 'Real-time Audit', desc: 'Activity monitoring enabled' }
  ];

  return (
    <AuthLayout>
      <div className="grid lg:grid-cols-12 gap-0 min-h-[600px]">
        {/* Left Visual Section */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#0f172a] p-12 flex-col justify-between relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-8">
              {isForgotMode ? "Security Recovery" : <>Welcome back to <br /><span className="text-blue-400">Nexus Security</span></>}
            </h2>
            <div className="space-y-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-slate-400 text-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 pt-6 border-t border-white/10">
             <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Node Status: Protected</p>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="col-span-12 lg:col-span-7 p-8 lg:p-12 bg-white/60 flex items-center">
          <div className="max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              {!isForgotMode ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Sign In</h1>
                    <p className="text-slate-500 font-medium">Authorized personnel access only.</p>
                  </header>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          {...register('email', { required: 'Email is required' })}
                          type="email" 
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
                          placeholder="admin@nexus.com"
                        />
                      </div>
                      {errors.email && <span className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-sm font-bold text-slate-700">Password</label>
                        <button 
                          type="button"
                          onClick={() => setIsForgotMode(true)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <input 
                          {...register('password', { required: 'Password is required' })}
                          type={showPassword ? 'text' : 'password'} 
                          className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-slate-900"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center space-x-3 disabled:opacity-70 transition-all"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> : <><span>Initialize Session</span><ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </form>

                  <div className="mt-8 p-4 rounded-2xl bg-slate-100/80 border border-slate-200 relative group">
                    <Command className="absolute top-2 right-2 w-6 h-6 opacity-10 group-hover:opacity-20 transition-opacity" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Dev Access (Key: password)</h4>
                    <div className="space-y-1 text-[11px] font-bold text-slate-600">
                      <p>SuperAdmin: <span className="text-blue-600">superadmin@example.com</span></p>
                      <p>Manager: <span className="text-blue-600">manager@example.com</span></p>
                    </div>
                  </div>

                  <p className="mt-8 text-center text-sm font-medium text-slate-500">
                    New to Nexus? <Link to="/register" className="text-blue-600 font-bold hover:underline">Request Access</Link>
                  </p>
                </motion.div>
              ) : (
                <ForgotPasswordForm onBack={() => setIsForgotMode(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;