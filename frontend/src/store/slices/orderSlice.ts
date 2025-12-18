import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderCreateRequest, OrderStatusUpdateRequest, Page, PageRequest } from '../../types/models';
import orderService from '../../services/orderService';

// Define the initial state
interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalPages: number;
    totalElements: number;
    currentPage: number;
    pageSize: number;
  };
}

const initialState: OrderState = {
  orders: [],
  order: null,
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
export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (pageRequest: PageRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders(pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user orders');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderRequest: OrderCreateRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (pageRequest: PageRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.getAdminOrders(pageRequest);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (
    { id, statusUpdate }: { id: number; statusUpdate: OrderStatusUpdateRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await orderService.updateOrderStatus(id, statusUpdate);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

// Create the slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user orders
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchUserOrders.fulfilled,
      (state, action: PayloadAction<Page<Order>>) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.error = null;
      }
    );
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createOrder.fulfilled,
      (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.order = action.payload;
        state.orders = [action.payload, ...state.orders];
        state.error = null;
      }
    );
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch admin orders
    builder.addCase(fetchAdminOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAdminOrders.fulfilled,
      (state, action: PayloadAction<Page<Order>>) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.pagination = {
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          currentPage: action.payload.number,
          pageSize: action.payload.size,
        };
        state.error = null;
      }
    );
    builder.addCase(fetchAdminOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update order status
    builder.addCase(updateOrderStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateOrderStatus.fulfilled,
      (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
        if (state.order && state.order.id === action.payload.id) {
          state.order = action.payload;
        }
        state.error = null;
      }
    );
    builder.addCase(updateOrderStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderError, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;