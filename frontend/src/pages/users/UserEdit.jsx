import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Loader2, Save, UserCog } from 'lucide-react';
import userApi from '../../api/userApi';

const MotionDiv = motion.div;

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = useMemo(() => Number(id), [id]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      is_active: true,
    },
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await userApi.getUser(userId);
        if (!mounted) return;

        const u = res?.data;
        reset({
          name: u?.name || '',
          email: u?.email || '',
          password: '',
          password_confirmation: '',
          is_active: !!u?.is_active,
        });
      } catch (e) {
        toast.error(e.message || 'Failed to load user');
        navigate('/users', { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!Number.isFinite(userId)) {
      navigate('/users', { replace: true });
      return () => { };
    }

    load();
    return () => {
      mounted = false;
    };
  }, [navigate, reset, userId]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };

      // Password is optional on update; avoid sending empty strings.
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      const res = await userApi.updateUser(userId, payload);
      toast.success(res.message || 'User updated successfully');
      navigate(`/users/${userId}`, { replace: true });
    } catch (e) {
      toast.error(e.message || 'Failed to update user');
    }
  };

  return (
    <div>
      <MotionDiv initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <UserCog className="w-7 h-7 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
            <p className="text-gray-600 mt-1">Update user details and status</p>
          </div>
        </div>
      </MotionDiv>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="py-16 flex items-center justify-center text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading user...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="john@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New password (optional)</label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Leave blank to keep current password"
                  {...register('password', {
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm new password</label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.password_confirmation ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Repeat new password"
                  {...register('password_confirmation')}
                />
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.password_confirmation.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="is_active"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...register('is_active')}
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active user
              </label>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/users/${userId}`)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEdit;