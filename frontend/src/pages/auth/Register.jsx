import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);

    if (result.success) {
      navigate('/dashboard', { replace: true });
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
          <ShieldCheck className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Create Account</h2>
        <p className="text-gray-600 text-lg">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="name"
              type="text"
              className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                transition-all duration-300 bg-gray-50 hover:bg-white
                ${errors.name ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'}
              `}
              placeholder="John Doe"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 font-medium"
            >
              {errors.name.message}
            </motion.p>
          )}
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="email"
              type="email"
              className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
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
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`block w-full pl-12 pr-14 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                transition-all duration-300 bg-gray-50 hover:bg-white
                ${errors.password ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'}
              `}
              placeholder="Create a password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
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

        {/* Confirm Password Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <label
            htmlFor="password_confirmation"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="password_confirmation"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`block w-full pl-12 pr-14 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500
                transition-all duration-300 bg-gray-50 hover:bg-white
                ${errors.password_confirmation ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'}
              `}
              placeholder="Confirm your password"
              {...register('password_confirmation', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password_confirmation && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 font-medium"
            >
              {errors.password_confirmation.message}
            </motion.p>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Sign In Link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center text-sm text-gray-600"
      >
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
};

export default Register;