import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { RegisterRequest } from '../types/models';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const { register: registerUser, isAuthenticated, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();
  const password = watch('password', '');

  // Clear any auth errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    // Remove confirmPassword as it's not needed in the API request
    const { confirmPassword, ...registerData } = data;

    const success = await registerUser(registerData);
    if (success) {
      setRegistrationSuccess(true);
    }
  };

  if (registrationSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Registration Successful!</h1>
              <p className="mb-6">Your account has been created successfully. You can now log in.</p>
              <Link to="/login">
                <Button variant="primary">Go to Login</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                error={errors.firstName?.message}
                {...register('firstName', { 
                  required: 'First name is required'
                })}
              />

              <Input
                label="Last Name"
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                error={errors.lastName?.message}
                {...register('lastName', { 
                  required: 'Last name is required'
                })}
              />
            </div>

            <Input
              label="Email"
              type="email"
              id="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
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

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4"
              isLoading={loading}
            >
              Register
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
