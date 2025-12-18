import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAuth } from '../hooks/useAuth';

const MainLayout = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-primary">
              Online Shop
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`hover:text-primary ${
                  location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`hover:text-primary ${
                  location.pathname.startsWith('/products') ? 'text-primary font-medium' : 'text-gray-600'
                }`}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className={`hover:text-primary ${
                      location.pathname === '/orders' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className={`hover:text-primary ${
                      location.pathname === '/profile' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`hover:text-primary ${
                        location.pathname.startsWith('/admin') ? 'text-primary font-medium' : 'text-gray-600'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`hover:text-primary ${
                      location.pathname === '/login' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`hover:text-primary ${
                      location.pathname === '/register' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>

            {/* Cart and Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && user && (
                <span className="text-gray-600 font-medium hidden md:inline-block">
                  Hi, {user.firstName}
                </span>
              )}
              <Link to="/cart" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600 hover:text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600 hover:text-primary"
                onClick={toggleMobileMenu}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-3">
              {isAuthenticated && user && (
                <div className="text-gray-600 font-medium mb-2 pb-2 border-b border-gray-200">
                  Hi, {user.firstName}
                </div>
              )}
              <Link
                to="/"
                className={`block hover:text-primary ${
                  location.pathname === '/' ? 'text-primary font-medium' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`block hover:text-primary ${
                  location.pathname.startsWith('/products') ? 'text-primary font-medium' : 'text-gray-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/orders"
                    className={`block hover:text-primary ${
                      location.pathname === '/orders' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    className={`block hover:text-primary ${
                      location.pathname === '/profile' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`block hover:text-primary ${
                        location.pathname.startsWith('/admin') ? 'text-primary font-medium' : 'text-gray-600'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-gray-600 hover:text-primary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`block hover:text-primary ${
                      location.pathname === '/login' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`block hover:text-primary ${
                      location.pathname === '/register' ? 'text-primary font-medium' : 'text-gray-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Online Shop</h3>
              <p className="text-gray-300">
                Your one-stop shop for all your needs. Quality products at affordable prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-gray-300 hover:text-white">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="text-gray-300 not-italic">
                <p>123 Shop Street</p>
                <p>Shopville, SH 12345</p>
                <p>Email: info@onlineshop.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Online Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
