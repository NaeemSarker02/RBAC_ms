import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      device_name: 'web',
    },
  });

  // Get the redirect URL from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    const result = await login(data);

    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      {/* Header with Icon */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4 shadow-lg"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
        <p className="text-gray-600 text-lg">Sign in to access your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`
                block w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                transition-all duration-300 bg-gray-50 hover:bg-white
                ${errors.email ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'}
              `}
              placeholder="john@example.com"
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 font-medium"
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`
                block w-full pl-12 pr-14 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                transition-all duration-300 bg-gray-50 hover:bg-white
                ${errors.password ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'}
              `}
              placeholder="Enter your password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 font-medium"
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {/* Remember Me & Forgot Password */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0"
        >
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700 font-medium"
            >
              Remember me
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Demo Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Demo Credentials:
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Super Admin:</strong> superadmin@example.com / password</p>
          <p><strong>Manager:</strong> manager@example.com / password</p>
          <p><strong>Viewer:</strong> viewer@example.com / password</p>
        </div>
      </motion.div>

      {/* Sign Up Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center text-sm text-gray-600"
      >
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          Sign up
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default Login;