import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import categoryService from '../../services/categoryService';
import { Order, Product, Category, PageRequest, OrderStatus } from '../../types/models';

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin' } });
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch recent orders (first page, limited to 5)
        const orderPageRequest: PageRequest = { 
          page: 0, 
          size: 5, 
          sort: 'createdAt', 
          direction: 'desc' 
        };
        const ordersResponse = await orderService.getAdminOrders(orderPageRequest);
        setRecentOrders(ordersResponse.content);

        // Fetch products (first page, limited to 5)
        const productPageRequest: PageRequest = { 
          page: 0, 
          size: 5, 
          sort: 'createdAt', 
          direction: 'desc' 
        };
        const productsResponse = await productService.getAdminProducts(productPageRequest);
        setProducts(productsResponse.content);

        // Fetch all categories
        const categoriesResponse = await categoryService.getCategories();
        setCategories(categoriesResponse);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PAID:
        return 'bg-green-100 text-green-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate statistics
  const calculateStatistics = () => {
    // Count products by status
    const activeProducts = products.filter(p => p.isActive).length;
    const inactiveProducts = products.length - activeProducts;

    // Count orders by status
    const newOrders = recentOrders.filter(o => o.status === OrderStatus.NEW).length;
    const paidOrders = recentOrders.filter(o => o.status === OrderStatus.PAID).length;
    const shippedOrders = recentOrders.filter(o => o.status === OrderStatus.SHIPPED).length;
    const deliveredOrders = recentOrders.filter(o => o.status === OrderStatus.DELIVERED).length;
    const canceledOrders = recentOrders.filter(o => o.status === OrderStatus.CANCELED).length;

    return {
      activeProducts,
      inactiveProducts,
      newOrders,
      paidOrders,
      shippedOrders,
      deliveredOrders,
      canceledOrders
    };
  };

  const stats = calculateStatistics();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-2">
          <Link to="/admin/products">
            <Button variant="primary" size="sm">
              Manage Products
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="outline" size="sm">
              Manage Orders
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              Manage Users
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Products</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Active: {stats.activeProducts}</p>
              <p className="text-gray-600">Inactive: {stats.inactiveProducts}</p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {products.length}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Categories</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">Total Categories</p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {categories.length}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Orders</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">New: {stats.newOrders}</p>
              <p className="text-gray-600">Processing: {stats.paidOrders + stats.shippedOrders}</p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {recentOrders.length}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Revenue</h2>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-600">From Recent Orders</p>
            </div>
            <div className="text-3xl font-bold text-primary">
              {recentOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/orders?id=${order.id}`} className="text-primary hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Products</h2>
          <Link to="/admin/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-200">
                      <span className="text-xs text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.categoryName}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-semibold">{product.price} {product.currency}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
