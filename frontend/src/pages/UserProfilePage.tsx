import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import { UserUpdateDTO, User } from '../types/models';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const UserProfilePage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<ProfileFormData>();
  const newPassword = watch('newPassword', '');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated) {
        try {
          setFetchingUser(true);
          const userData = await userService.getCurrentUser();
          setUser(userData);
          setFetchingUser(false);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to load user profile. Please try again later.');
          setFetchingUser(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Set form default values when user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    } else if (authUser) {
      reset({
        firstName: authUser.firstName || '',
        lastName: authUser.lastName || ''
      });
    }
  }, [user, authUser, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updateData: UserUpdateDTO = {
        firstName: data.firstName,
        lastName: data.lastName
      };

      // Add password to update data if changing password
      if (isChangingPassword && data.currentPassword && data.newPassword) {
        updateData.password = data.newPassword;
      }

      // Call API to update user profile
      const updatedUser = await userService.updateCurrentUser(updateData);
      setUser(updatedUser);

      setSuccess('Profile updated successfully');
      setLoading(false);

      // Reset password fields
      if (isChangingPassword) {
        reset({
          ...data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsChangingPassword(false);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>{success}</p>
            </div>
          )}

          {fetchingUser ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Loading your profile...</p>
            </div>
          ) : (

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Input
                label="First Name"
                type="text"
                id="firstName"
                placeholder={user?.firstName || authUser?.firstName || "Enter your first name"}
                error={errors.firstName?.message}
                {...register('firstName', { 
                  required: 'First name is required'
                })}
              />

              <Input
                label="Last Name"
                type="text"
                id="lastName"
                placeholder={user?.lastName || authUser?.lastName || "Enter your last name"}
                error={errors.lastName?.message}
                {...register('lastName', { 
                  required: 'Last name is required'
                })}
              />
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Account Information</h2>
              <div className="bg-gray-100 p-4 rounded">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <p className="text-gray-700 mb-1"><strong>Email:</strong> {user?.email || authUser?.email}</p>
                    <p className="text-gray-700 mb-1"><strong>Name:</strong> {user?.firstName || authUser?.firstName} {user?.lastName || authUser?.lastName}</p>
                    <p className="text-gray-700"><strong>Account Created:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                  >
                    {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
                  </Button>
                </div>
              </div>
            </div>

            {isChangingPassword && (
              <div className="mb-6 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>

                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    placeholder="Enter your current password"
                    error={errors.currentPassword?.message}
                    {...register('currentPassword', { 
                      required: 'Current password is required'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    placeholder="Enter your new password"
                    error={errors.newPassword?.message}
                    {...register('newPassword', { 
                      required: 'New password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your new password',
                      validate: value => value === newPassword || 'Passwords do not match'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
        </Card>
      </div>
    </div>
  );
};

export default UserProfilePage;
