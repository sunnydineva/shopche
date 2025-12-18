import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../components/common/Button';
import productService from '../services/productService';
import { Product } from '../types/models';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await productService.getProductById(Number(id));
        setProduct(productData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Product not found'}</p>
        </div>
        <div className="mt-4">
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex text-sm">
          <li className="mr-2">
            <Link to="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="mr-2">
            <Link to="/products" className="text-gray-500 hover:text-primary">
              Products
            </Link>
          </li>
          <li className="mx-2 text-gray-500">/</li>
          <li className="text-primary">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4">Category: {product.categoryName}</p>

          <div className="mb-6">
            <p className="text-2xl font-semibold text-primary">
              {product.price} {product.currency}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {product.stockQuantity > 0 
                ? `In Stock (${product.stockQuantity} available)` 
                : 'Out of Stock'}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {product.stockQuantity > 0 && (
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center border-t border-b border-gray-300 py-1"
                />
                <button
                  type="button"
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100"
                  onClick={() => quantity < product.stockQuantity && setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              fullWidth
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBuyNow}
              disabled={product.stockQuantity <= 0}
              fullWidth
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
