import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Loader2, User, Mail, Calendar, Shield, Edit, Trash2, UserCheck, UserX, ArrowLeft } from 'lucide-react';
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
    if (!Number.isFinite(userId)) {
      navigate('/users', { replace: true });
      return;
    }
    loadUser();
  }, [loadUser, navigate, userId]);

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;

    try {
      const res = await userApi.deleteUser(userId);
      toast.success(res.message || 'User deleted successfully');
      navigate('/users', { replace: true });
    } catch (e) {
      toast.error(e.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    try {
      const res = user.is_active
        ? await userApi.deactivateUser(userId)
        : await userApi.activateUser(userId);
      toast.success(res.message || 'Status updated');
      await loadUser();
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading user...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-gray-600">
        User not found.
      </div>
    );
  }

  const roles = user.roles || [];

  return (
    <div>
      <MotionDiv initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="w-7 h-7 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
              <p className="text-gray-600 mt-1">View user profile and access</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/users"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>

            <Can permission="user_edit">
              <button
                onClick={handleToggleStatus}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${user.is_active
                    ? 'border-orange-200 text-orange-700 hover:bg-orange-50'
                    : 'border-green-200 text-green-700 hover:bg-green-50'
                  }`}
              >
                {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                {user.is_active ? 'Deactivate' : 'Activate'}
              </button>
            </Can>

            <Can permission="user_edit">
              <Link
                to={`/users/${userId}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            </Can>

            <Can permission="user_delete">
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </Can>
          </div>
        </div>
      </MotionDiv>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900 font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-900 font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleString() : '—'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Roles</h2>
          {roles.length === 0 ? (
            <p className="text-gray-600">No roles assigned.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span
                  key={r.id || r.slug || r.name}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800"
                >
                  {r.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserView;