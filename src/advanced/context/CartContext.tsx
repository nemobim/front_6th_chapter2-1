// src/advanced/context/AppContext.tsx
import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import type { AppState, CartItem, Product } from '../types';

// 액션 타입 정의
type AppAction =
  | { type: 'SET_PRODUCT_LIST'; payload: Product[] }
  | { type: 'SET_SELECTED_PRODUCT'; payload: string | null }
  | { type: 'ADD_CART_ITEM'; payload: CartItem }
  | { type: 'UPDATE_CART_ITEM_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_CART_ITEM'; payload: string }
  | { type: 'UPDATE_CART_TOTAL'; payload: number }
  | { type: 'UPDATE_CART_DISCOUNT'; payload: number };

// 초기 상태
const initialState: AppState = {
  cart: {
    items: [],
    totalAmount: 0,
    totalItemCount: 0,
    discountAmount: 0,
  },
  product: {
    selected: null,
    list: [],
    stockInfo: null,
  },
};

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PRODUCT_LIST':
      return {
        ...state,
        product: { ...state.product, list: action.payload },
      };
    case 'SET_SELECTED_PRODUCT':
      return {
        ...state,
        product: { ...state.product, selected: action.payload },
      };
    case 'ADD_CART_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
          totalItemCount: state.cart.totalItemCount + action.payload.quantity,
        },
      };
    case 'UPDATE_CART_ITEM_QUANTITY':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.productId === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item
          ),
          totalItemCount: state.cart.items.reduce(
            (sum, item) =>
              sum + (item.productId === action.payload.productId ? action.payload.quantity : item.quantity),
            0
          ),
        },
      };
    case 'REMOVE_CART_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.productId !== action.payload),
          totalItemCount: state.cart.items.reduce(
            (sum, item) => sum + (item.productId !== action.payload ? item.quantity : 0),
            0
          ),
        },
      };
    case 'UPDATE_CART_TOTAL':
      return {
        ...state,
        cart: { ...state.cart, totalAmount: action.payload },
      };
    case 'UPDATE_CART_DISCOUNT':
      return {
        ...state,
        cart: { ...state.cart, discountAmount: action.payload },
      };
    default:
      return state;
  }
}

// Context 생성
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

// 커스텀 훅
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
