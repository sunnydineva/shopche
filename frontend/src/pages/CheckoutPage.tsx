import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import orderService from '../services/orderService';
import { OrderCreateRequest } from '../types/models';
import { useAuth } from '../hooks/useAuth';

interface ShippingFormData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

const CheckoutPage = () => {
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      country: 'United States'
    }
  });

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [items.length, navigate, orderSuccess]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: ShippingFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Create order request from cart items
      const orderRequest: OrderCreateRequest = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      // Call API to create order
      const order = await orderService.createOrder(orderRequest);

      // Clear cart and show success message
      dispatch(clearCart());
      setOrderId(order.id);
      setOrderSuccess(true);
      setLoading(false);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again later.');
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
              <p className="mb-2">Thank you for your order.</p>
              <p className="mb-6">Your order number is: <span className="font-semibold">#{orderId}</span></p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                <Link to="/orders">
                  <Button variant="primary">View Orders</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="md:col-span-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Full Name"
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                error={errors.fullName?.message}
                {...register('fullName', { 
                  required: 'Full name is required'
                })}
              />

              <Input
                label="Address"
                type="text"
                id="address"
                placeholder="Enter your street address"
                error={errors.address?.message}
                {...register('address', { 
                  required: 'Address is required'
                })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  type="text"
                  id="city"
                  placeholder="Enter your city"
                  error={errors.city?.message}
                  {...register('city', { 
                    required: 'City is required'
                  })}
                />

                <Input
                  label="State/Province"
                  type="text"
                  id="state"
                  placeholder="Enter your state"
                  error={errors.state?.message}
                  {...register('state', { 
                    required: 'State is required'
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ZIP/Postal Code"
                  type="text"
                  id="zipCode"
                  placeholder="Enter your ZIP code"
                  error={errors.zipCode?.message}
                  {...register('zipCode', { 
                    required: 'ZIP code is required'
                  })}
                />

                <Input
                  label="Country"
                  type="text"
                  id="country"
                  placeholder="Enter your country"
                  error={errors.country?.message}
                  {...register('country', { 
                    required: 'Country is required'
                  })}
                />
              </div>

              <Input
                label="Phone Number"
                type="tel"
                id="phoneNumber"
                placeholder="Enter your phone number"
                error={errors.phoneNumber?.message}
                {...register('phoneNumber', { 
                  required: 'Phone number is required'
                })}
              />

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Payment Method</h3>
                <div className="bg-gray-100 p-4 rounded">
                  <p className="text-gray-700">
                    This is a demo application. No actual payment will be processed.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Link to="/cart">
                  <Button variant="outline">
                    Back to Cart
                  </Button>
                </Link>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                >
                  Place Order
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="border-t border-gray-200 pt-4">
              <div className="max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center py-2 border-b border-gray-100">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-3">
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
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {item.price} {item.currency}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} {item.currency}
                    </div>
                  </div>
                ))}
              </div>

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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
