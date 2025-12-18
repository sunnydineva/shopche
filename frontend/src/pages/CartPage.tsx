import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';

const CartPage = () => {
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <p className="mb-6">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
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
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200">
                              <span className="text-xs text-gray-500">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/products/${item.productId}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary"
                          >
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.price} {item.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="px-2 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border-t border-b border-gray-300 py-1"
                        />
                        <button
                          type="button"
                          className="px-2 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.price * item.quantity).toFixed(2)} {item.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between">
            <Link to="/products">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="danger" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Items ({totalItems})</span>
                <span className="text-gray-800 font-medium">
                  {totalAmount.toFixed(2)} {items[0]?.currency}
                </span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">Free</span>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg text-primary font-semibold">
                    {totalAmount.toFixed(2)} {items[0]?.currency}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-4"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
