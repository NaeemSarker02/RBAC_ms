import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Globe, Sparkles, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit } = useForm({
    defaultValues: { email: '', password: '', device_name: 'web' },
  });

  const onLoginSubmit = async (data) => {
    const result = await login(data);
    if (result.success) navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-[#05070a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[1000px] grid lg:grid-cols-[45%_55%] bg-[#0f1115]/80 border border-white/10 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl z-10"
      >
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-14 bg-gradient-to-br from-blue-600/15 to-transparent border-r border-white/5">
          <div>
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">
              Nexus <br />
              <span className="text-blue-500">{isForgotMode ? "Recovery" : "Security Node"}</span>
            </h2>
            <p className="mt-6 text-slate-400 font-medium leading-relaxed max-w-[260px]">
              {isForgotMode ? "Initiating encrypted credential retrieval." : "Access the next generation of data management."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Access</p>
                <p className="text-[11px] text-slate-500">Node sync: 14 regions active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-10 lg:p-16 flex flex-col justify-center bg-[#0d0f14]/30">
          <AnimatePresence mode="wait">
            {!isForgotMode ? (
              <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto">
                <header className="mb-10">
                  <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
                  <p className="text-slate-500 text-sm">Authorized personnel only.</p>
                </header>
                <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold text-slate-300 ml-1">Work Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500" />
                      <input {...register('email')} type="email" placeholder="admin@nexus.io" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 text-white outline-none focus:border-blue-500 transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between px-1">
                      <label className="text-[13px] font-semibold text-slate-300">Password</label>
                      <button type="button" onClick={() => setIsForgotMode(true)} className="text-xs font-bold text-blue-500">Recovery?</button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input {...register('password')} type={showPassword ? 'text' : 'password'} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-blue-500 transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isLoading} className="w-full bg-blue-600 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20">
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Authenticate <ArrowRight className="w-4 h-4" /></>}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="recovery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-sm mx-auto">
                <header className="mb-10"><h1 className="text-3xl font-bold text-white mb-2">Recovery</h1></header>
                <div className="space-y-6">
                   <input placeholder="Enter work email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500" />
                   <button className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3">Send Link <Send className="w-4 h-4" /></button>
                   <button onClick={() => setIsForgotMode(false)} className="w-full text-slate-500 flex items-center justify-center gap-2 text-sm"><ArrowLeft className="w-4 h-4" /> Back to Sign In</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <footer className="mt-10 text-center text-sm text-slate-500">New? <Link to="/register" className="text-white font-bold hover:text-blue-400 transition-colors">Request Access</Link></footer>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;