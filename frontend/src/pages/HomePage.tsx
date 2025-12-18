import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { Product, Category, PageRequest } from '../types/models';
import { addToCart } from '../store/slices/cartSlice';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch featured products (first page, limited to 8)
        const pageRequest: PageRequest = { page: 0, size: 8, sort: 'createdAt', direction: 'desc' };
        const productsResponse = await productService.getProducts(pageRequest);
        setFeaturedProducts(productsResponse.content);

        // Fetch all categories
        const categoriesResponse = await categoryService.getCategories();
        setCategories(categoriesResponse);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Online Shop</h1>
        <p className="text-xl mb-6">Discover amazing products at great prices</p>
        <Link to="/products">
          <Button variant="secondary" size="lg">
            Shop Now
          </Button>
        </Link>
      </div>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link to={`/products?category=${category.id}`} key={category.id}>
              <Card 
                className="h-full transition-transform hover:scale-105"
                title={category.name}
              >
                <p className="text-gray-600">{category.description}</p>
                {category.productCount !== undefined && (
                  <p className="mt-2 text-sm text-gray-500">{category.productCount} products</p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="h-full flex flex-col">
              <Link to={`/products/${product.id}`} className="flex-grow">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-48 w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-gray-500">{product.categoryName}</p>
                <p className="mt-2 text-lg font-semibold">
                  {product.price} {product.currency}
                </p>
              </Link>
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  fullWidth 
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
