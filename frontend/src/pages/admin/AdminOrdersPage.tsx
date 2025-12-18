import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import orderService from '../../services/orderService';
import { Order, PageRequest, OrderStatus, OrderStatusUpdateRequest } from '../../types/models';

const AdminOrdersPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State for orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // State for order status update
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.NEW);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/orders' } });
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const pageRequest: PageRequest = {
          page: currentPage,
          size: pageSize,
          sort: 'createdAt',
          direction: 'desc'
        };

        const response = await orderService.getAdminOrders(pageRequest);
        setOrders(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchOrders();
    }
  }, [isAuthenticated, isAdmin, currentPage, pageSize]);

  // Handle order status update
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const statusUpdate: OrderStatusUpdateRequest = {
        status: newStatus
      };

      await orderService.updateOrderStatus(selectedOrder.id, statusUpdate);

      // Refresh orders
      const pageRequest: PageRequest = {
        page: currentPage,
        size: pageSize,
        sort: 'createdAt',
        direction: 'desc'
      };

      const response = await orderService.getAdminOrders(pageRequest);
      setOrders(response.content);

      // Reset state
      setIsUpdatingStatus(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again later.');
    }
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

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Status Update Modal */}
      {isUpdatingStatus && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
            <p className="mb-4">
              Order #{selectedOrder.id} - Current Status: 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                {Object.values(OrderStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUpdatingStatus(false);
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
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
                  Items
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
              {orders.length > 0 ? (
                orders.map((order) => (
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
                      {order.orderItems.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setNewStatus(order.status);
                            setIsUpdatingStatus(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Update Status
                        </button>
                        <button
                          onClick={() => {
                            // Toggle order details
                            const row = document.getElementById(`order-details-${order.id}`);
                            if (row) {
                              row.classList.toggle('hidden');
                            }
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details (Hidden by default) */}
      {orders.map((order) => (
        <div key={`details-${order.id}`} id={`order-details-${order.id}`} className="mt-2 mb-4 hidden">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Order #{order.id} Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Customer: {order.userEmail}</p>
                <p className="text-sm text-gray-600">Date: {formatDate(order.createdAt)}</p>
                <p className="text-sm text-gray-600">
                  Status: 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Items: {order.orderItems.length}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium mb-2">Order Items</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.productName}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        ${item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        ${item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{orders.length}</span> of{' '}
              <span className="font-medium">{totalElements}</span> orders
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

export default AdminOrdersPage;
