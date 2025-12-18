import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Sidebar Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="mr-4 text-white focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link to="/admin" className="text-xl font-bold">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-white hover:text-gray-300">
                View Shop
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 text-white w-64 min-h-screen ${
            sidebarOpen ? 'block' : 'hidden'
          } md:block transition-all duration-300 ease-in-out`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin"
                  className={`block px-4 py-2 rounded ${
                    location.pathname === '/admin'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/products"
                  className={`block px-4 py-2 rounded ${
                    location.pathname === '/admin/products'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/orders"
                  className={`block px-4 py-2 rounded ${
                    location.pathname === '/admin/orders'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/users"
                  className={`block px-4 py-2 rounded ${
                    location.pathname === '/admin/users'
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  Users
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
