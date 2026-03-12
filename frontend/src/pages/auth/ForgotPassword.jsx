import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async () => {
    // Backend API logic
    toast.error(
      'Security recovery protocol is currently restricted. Please contact system admin.',
      {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)'
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-sm mx-auto"
    >
      {/* Brand Icon Header */}
      <div className="mb-10 text-center">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-6 shadow-[0_0_30px_rgba(37,99,235,0.1)]"
        >
          <ShieldCheck className="w-8 h-8 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Recovery Mode
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Enter your authorized email to receive reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-slate-300 ml-1">
            Work Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="email"
              className={`
                block w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white placeholder-slate-600
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                transition-all duration-300
                ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}
              `}
              placeholder="admin@nexus.io"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] text-red-400 font-medium ml-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.01, translateY: -1 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-500 shadow-[0_10px_20px_-10px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isSubmitting ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <Send className="w-4 h-4" />
            </motion.div>
          ) : (
            <>
              <span>Send Instructions</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-10 text-center border-t border-white/5 pt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Secure Login
        </Link>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;