import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import userApi from '../../api/userApi';
import Can from '../../components/auth/Can';
import Table from '../../components/common/Table';
import Pagination from '../../components/common/Pagination';

const MotionDiv = motion.div;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });

  // Fetch users
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await userApi.getUsers({
        page,
        per_page: pagination.perPage,
        search,
      });

      if (response.success) {
        setUsers(response.data);
        setPagination((prev) => ({
          ...prev,
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          perPage: response.meta.per_page,
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [pagination.perPage]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, searchQuery);
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchUsers(page, searchQuery);
  };

  // Handle delete user
  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    try {
      const response = await userApi.deleteUser(userId);

      if (response.success) {
        toast.success(response.message || 'User deleted successfully');
        fetchUsers(pagination.currentPage, searchQuery);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // Handle activate/deactivate
  const handleToggleStatus = async (userId, isActive) => {
    try {
      const response = isActive
        ? await userApi.deactivateUser(userId)
        : await userApi.activateUser(userId);

      if (response.success) {
        toast.success(response.message);
        fetchUsers(pagination.currentPage, searchQuery);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update user status');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (user) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-600 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles && user.roles.length > 0 ? (
            user.roles.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {role.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">No roles</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      render: (user) => (
        <div className="text-sm text-gray-500">
          {new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className="flex items-center space-x-2">
          {/* View */}
          <Can permission="user_view">
            <Link
              to={`/users/${user.id}`}
              className="text-gray-600 hover:text-primary-600 transition-colors"
              title="View"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </Can>

          {/* Edit */}
          <Can permission="user_edit">
            <Link
              to={`/users/${user.id}/edit`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Edit className="w-5 h-5" />
            </Link>
          </Can>

          {/* Toggle Status */}
          <Can permission="user_edit">
            <button
              onClick={() => handleToggleStatus(user.id, user.is_active)}
              className={`${user.is_active
                  ? 'text-gray-600 hover:text-orange-600'
                  : 'text-gray-600 hover:text-green-600'
                } transition-colors`}
              title={user.is_active ? 'Deactivate' : 'Activate'}
            >
              {user.is_active ? (
                <UserX className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </button>
          </Can>

          {/* Delete */}
          <Can permission="user_delete">
            <button
              onClick={() => handleDelete(user.id, user.name)}
              className="text-gray-600 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-1">Manage all users in the system</p>
            </div>
          </div>

          {/* Add User Button - Permission Protected */}
          <Can permission="user_create">
            <Link
              to="/users/create"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add User</span>
            </Link>
          </Can>
        </div>
      </MotionDiv>

      {/* Search and Filters */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                fetchUsers(1, '');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </form>
        </div>
      </MotionDiv>

      {/* Users Table */}
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Table
          columns={columns}
          data={users}
          isLoading={loading}
          emptyMessage="No users found. Try adjusting your search."
        />

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            total={pagination.total}
            perPage={pagination.perPage}
            onPageChange={handlePageChange}
          />
        )}
      </MotionDiv>
    </div>
  );
};

export default UserList;