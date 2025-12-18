import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import orderService from '../services/orderService';
import { Order, OrderStatus, OrderStatusUpdateRequest, PageRequest } from '../types/models';

const UserOrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  const pageSize = 10;
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
    }
  }, [isAuthenticated, navigate]);

  // Common function за зареждане на поръчки
  const loadOrders = async (page: number) => {
    const pageRequest: PageRequest = {
      page,
      size: pageSize,
      sort: 'createdAt',
      direction: 'desc',
    };
    const response = await orderService.getUserOrders(pageRequest);
    setOrders(response.content);
    setTotalPages(response.totalPages);
    setTotalElements(response.totalElements);
  };

  // Fetch orders when page changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        await loadOrders(currentPage);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [currentPage, isAuthenticated]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  // 👉 ТОВА е handler-ът за Cancel
  const handleCancelOrder = async (orderId: number) => {
    try {
      setError(null);
      setCancellingOrderId(orderId);

      const statusUpdate: OrderStatusUpdateRequest = {
        status: OrderStatus.CANCELED,
      };

      await orderService.updateOrderStatus(orderId, statusUpdate);

      // Вариант 1: презареждаме текущата страница
      await loadOrders(currentPage);

      // Вариант 2 (без нов request):
      // setOrders(prev =>
      //   prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.CANCELED } : o)
      // );

    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order. Please try again later.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading && orders.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading orders...</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
        )}

        {orders.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-lg mb-4">You haven't placed any orders yet.</p>
              <Link to="/products">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </Card>
        ) : (
            <>
              <p className="mb-4 text-gray-600">
                Showing {orders.length} of {totalElements} orders
              </p>

              <div className="space-y-6">
                {orders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                          <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                        </div>
                        <div className="mt-2 md:mt-0">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                            order.status
                        )}`}
                    >
                      {order.status}
                    </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-medium mb-2">Items</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subtotal
                              </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {order.orderItems.map((item) => (
                                <tr key={item.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        to={`/products/${item.productId}`}
                                        className="text-primary hover:underline"
                                    >
                                      {item.productName}
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {item.unitPrice.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {item.quantity}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {item.subtotal.toFixed(2)}
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                        <div>
                          <p className="text-lg font-semibold">
                            Total: {order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        {order.status === OrderStatus.NEW && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingOrderId === order.id}
                            >
                              {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </Button>
                        )}
                      </div>
                    </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                          disabled={currentPage === 0}
                          className="mr-2"
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => (
                          <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`mx-1 px-3 py-1 rounded ${
                                  currentPage === i
                                      ? 'bg-primary text-white'
                                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                          >
                            {i + 1}
                          </button>
                      ))}

                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                          disabled={currentPage === totalPages - 1}
                          className="ml-2"
                      >
                        Next
                      </Button>
                    </nav>
                  </div>
              )}
            </>
        )}
      </div>
  );
};

export default UserOrdersPage;