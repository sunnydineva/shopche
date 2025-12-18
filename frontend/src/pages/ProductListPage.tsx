import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import { Product, Category, PageRequest } from '../types/models';
import { addToCart } from '../store/slices/cartSlice';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 12;

  const dispatch = useDispatch();

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');

    if (categoryParam) setSelectedCategory(Number(categoryParam));
    if (minPriceParam) setMinPrice(minPriceParam);
    if (maxPriceParam) setMaxPrice(maxPriceParam);
    if (searchParam) setSearchTerm(searchParam);
    if (pageParam) setCurrentPage(Number(pageParam) - 1); // Convert from 1-based to 0-based
  }, [searchParams]);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when filters or pagination change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const pageRequest: PageRequest = { 
          page: currentPage, 
          size: pageSize, 
          sort: 'name', 
          direction: 'asc' 
        };

        const response = await productService.getProducts(
          pageRequest,
          selectedCategory || undefined,
          minPrice ? Number(minPrice) : undefined,
          maxPrice ? Number(maxPrice) : undefined,
          searchTerm || undefined
        );

        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedCategory, minPrice, maxPrice, searchTerm]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleApplyFilters = () => {
    // Update URL params
    const params: Record<string, string> = {};

    if (selectedCategory) params.category = selectedCategory.toString();
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (searchTerm) params.search = searchTerm;

    // Reset to first page when filters change
    setCurrentPage(0);
    params.page = '1';

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setCurrentPage(0);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    params.set('page', (page + 1).toString()); // Convert to 1-based for URL
    setSearchParams(params);
  };

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Filters sidebar */}
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Category filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price range filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Search filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter buttons */}
          <div className="flex space-x-2">
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear
            </Button>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:col-span-3">
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          ) : null}

          {/* Results summary */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {products.length} of {totalElements} products
            </p>
          </div>

          {/* Products grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
