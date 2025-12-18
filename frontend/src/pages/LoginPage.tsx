import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';
import { LoginRequest } from '../types/models';

interface LocationState {
  from?: string;
}

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const from = state?.from || '/';

  // Clear any auth errors when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-4"
              isLoading={loading}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
