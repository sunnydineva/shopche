import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { Product, Category, PageRequest, ProductCreateRequest, ProductUpdateRequest, Currency } from '../../types/models';

const AdminProductsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // State for product form
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProductCreateRequest | ProductUpdateRequest>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0
  });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/admin/products' } });
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const pageRequest: PageRequest = {
          page: currentPage,
          size: pageSize,
          sort: 'id',
          direction: 'asc'
        };

        const response = await productService.getAdminProducts(pageRequest);
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

    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        setCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      }
    };

    if (isAuthenticated && isAdmin) {
      fetchProducts();
      fetchCategories();
    }
  }, [isAuthenticated, isAdmin, currentPage, pageSize]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Convert numeric values
    if (name === 'price' || name === 'stockQuantity' || name === 'categoryId') {
      setFormData({
        ...formData,
        [name]: Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isCreating) {
        await productService.createProduct(formData as ProductCreateRequest);
        setIsCreating(false);
      } else if (isEditing && selectedProduct) {
        await productService.updateProduct(selectedProduct.id, formData as ProductUpdateRequest);
        setIsEditing(false);
        setSelectedProduct(null);
      }

      // Refresh products
      const pageRequest: PageRequest = {
        page: currentPage,
        size: pageSize,
        sort: 'id',
        direction: 'asc'
      };

      const response = await productService.getAdminProducts(pageRequest);
      setProducts(response.content);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        stockQuantity: 0,
        imageUrl: '',
        categoryId: 0
      });
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product. Please try again later.');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);

        // Refresh products
        const pageRequest: PageRequest = {
          page: currentPage,
          size: pageSize,
          sort: 'id',
          direction: 'asc'
        };

        const response = await productService.getAdminProducts(pageRequest);
        setProducts(response.content);
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again later.');
      }
    }
  };

  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency as Currency,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId,
      isActive: product.isActive
    });
    setIsEditing(true);
    setIsCreating(false);
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

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button 
          variant="primary" 
          onClick={() => {
            setIsCreating(true);
            setIsEditing(false);
            setSelectedProduct(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              currency: 'USD',
              stockQuantity: 0,
              imageUrl: '',
              categoryId: 0
            });
          }}
        >
          Add New Product
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Product Form */}
      {(isCreating || isEditing) && (
        <Card className="mb-6 p-4">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? 'Create New Product' : 'Edit Product'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Product name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                >
                  {Object.values(Currency).map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
              </div>
              {isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({
                      ...formData,
                      isActive: e.target.value === 'true'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Product description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {isCreating ? 'Create Product' : 'Update Product'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-500">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.price} {product.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.stockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{products.length}</span> of{' '}
              <span className="font-medium">{totalElements}</span> products
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

export default AdminProductsPage;
