import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import { User, PageRequest } from '../../types/models';

const AdminUsersPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State for users
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // State for user form
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    roles: [] as string[],
    isActive: true
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/users' } });
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const pageRequest: PageRequest = {
          page: currentPage,
          size: pageSize,
          sort: 'id',
          direction: 'asc'
        };

        const response = await userService.getAdminUsers(pageRequest);
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, currentPage, pageSize]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'isActive') {
      setFormData({
        ...formData,
        isActive: value === 'true'
      });
    } else if (name === 'roles') {
      const select = e.target as HTMLSelectElement;
      const options = Array.from(select.selectedOptions);
      const selectedRoles = options.map(option => option.value);
      setFormData({
        ...formData,
        roles: selectedRoles
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
        setIsEditing(false);
        setSelectedUser(null);
      }

      // Refresh users
      const pageRequest: PageRequest = {
        page: currentPage,
        size: pageSize,
        sort: 'id',
        direction: 'asc'
      };

      const response = await userService.getAdminUsers(pageRequest);
      setUsers(response.content);

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        roles: [],
        isActive: true
      });
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again later.');
    }
  };

  // Handle user deactivation
  const handleDeactivateUser = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userService.deactivateUser(id);

        // Refresh users
        const pageRequest: PageRequest = {
          page: currentPage,
          size: pageSize,
          sort: 'id',
          direction: 'asc'
        };

        const response = await userService.getAdminUsers(pageRequest);
        setUsers(response.content);
      } catch (err) {
        console.error('Error deactivating user:', err);
        setError('Failed to deactivate user. Please try again later.');
      }
    }
  };

  // Handle user edit
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      password: '',
      roles: Array.from(user.roles || []),
      isActive: user.isActive || true
    });
    setIsEditing(true);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* User Form */}
      {isEditing && (
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4">
            Edit User
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email address"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roles
                </label>
                <select
                  name="roles"
                  multiple
                  value={formData.roles}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple roles</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update User
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.roles && user.roles.map(role => (
                        <span key={role} className="inline-block px-2 py-1 mr-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        {user.isActive && (
                          <button
                            onClick={() => handleDeactivateUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{users.length}</span> of{' '}
              <span className="font-medium">{totalElements}</span> users
            </span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;