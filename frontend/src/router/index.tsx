import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

// Import layouts
// These will be created later, but we'll define the imports now
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import pages
// These will be created later, but we'll define the imports now
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CheckoutPage from '../pages/CheckoutPage';
import UserProfilePage from '../pages/UserProfilePage';
import UserOrdersPage from '../pages/UserOrdersPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';

// Protected route components
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },

      // Protected user routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'orders', element: <UserOrdersPage /> },
        ],
      },

      // Catch-all route
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Admin routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
]);

// Router component
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
