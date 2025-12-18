import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/models';

// Define cart item interface
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  quantity: number;
}

// Define the initial state
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Helper function to load cart from localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      totalItems: 0,
      totalAmount: 0,
    };
  }

  try {
    const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
      const parsedItems = JSON.parse(cartItems) as CartItem[];
      return {
        items: parsedItems,
        totalItems: parsedItems.reduce((total, item) => total + item.quantity, 0),
        totalAmount: parsedItems.reduce((total, item) => total + item.price * item.quantity, 0),
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }

  return {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }
};

const initialState: CartState = loadCartFromStorage();

// Create the slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: Number(product.price),
          currency: product.currency,
          imageUrl: product.imageUrl,
          quantity,
        });
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);

      if (item) {
        item.quantity = quantity;
      }

      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;