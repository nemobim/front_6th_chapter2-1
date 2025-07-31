import { createContext, ReactNode, useContext } from 'react';

import { useCart } from './useCart';
import { useProducts } from './useProducts';

interface CartContextType {
  cartItems: ReturnType<typeof useCart>['cartItems'];
  addToCart: ReturnType<typeof useCart>['addToCart'];
  updateQuantity: ReturnType<typeof useCart>['updateQuantity'];
  removeFromCart: ReturnType<typeof useCart>['removeFromCart'];
  products: ReturnType<typeof useProducts>['products'];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart();
  const productsHook = useProducts();

  return (
    <CartContext.Provider
      value={{
        ...cartHook,
        ...productsHook,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
