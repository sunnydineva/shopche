import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Page, PageRequest, Product, ProductCreateRequest, ProductUpdateRequest } from '../../types/models';
import productService from '../../services/productService';

// Define the initial state
interface ProductState {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 10,
  },
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    {
      pageRequest,
      categoryId,
      minPrice,
      maxPrice,
      name,
    }: {
      pageRequest: PageRequest;
      categoryId?: number;
      minPrice?: number;
      maxPrice?: number;
      name?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.getProducts(
        pageRequest,
        categoryId,
        minPrice,
        maxPrice,
        name
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  'products/fetchAdminProducts',
  async (pageRequest: PageRequest, { rejectWithValue }) => {
    try {
      const response = await productService.getAdminProducts(pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: ProductCreateRequest, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(product);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (
    { id, product }: { id: number; product: ProductUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.updateProduct(id, product);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Create the slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<Page<Product>>) => {
        state.loading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.error = null;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      }
    );
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch admin products
    builder.addCase(fetchAdminProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAdminProducts.fulfilled,
      (state, action: PayloadAction<Page<Product>>) => {
        state.loading = false;
        state.products = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.error = null;
      }
    );
    builder.addCase(fetchAdminProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
        state.error = null;
      }
    );
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateProduct.fulfilled,
      (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products = state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        );
        if (state.product && state.product.id === action.payload.id) {
          state.product = action.payload;
        }
        state.error = null;
      }
    );
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
      if (state.product && state.product.id === action.payload) {
        state.product = null;
      }
      state.error = null;
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProductError, clearProduct } = productSlice.actions;
export default productSlice.reducer;