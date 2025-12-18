import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category } from '../../types/models';
import categoryService from '../../services/categoryService';

// Define the initial state
interface CategoryState {
  categories: Category[];
  category: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch category');
    }
  }
);

// Create the slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch category by ID
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategoryById.fulfilled,
      (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.category = action.payload;
        state.error = null;
      }
    );
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCategoryError, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;