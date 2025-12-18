import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  login, 
  logout, 
  register, 
  clearError 
} from '../store/slices/authSlice';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { LoginRequest, RegisterRequest } from '../types/models';

/**
 * Custom hook for authentication functionality
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  /**
   * Handle user login
   */
  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const resultAction = await dispatch(login(credentials));
      if (login.fulfilled.match(resultAction)) {
        // Redirect based on user role
        if (resultAction.payload.roles.includes('ROLE_ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  /**
   * Handle user registration
   */
  const handleRegister = async (userData: RegisterRequest) => {
    try {
      const resultAction = await dispatch(register(userData));
      if (register.fulfilled.match(resultAction)) {
        navigate('/login');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  /**
   * Clear authentication errors
   */
  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    isAdmin: auth.isAdmin,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
