import { createContext, ReactNode, useContext, useState } from 'react';

import { useCart } from './useCart';
import { useDiscountTimers } from './useDiscountTimers';
import { useProducts } from './useProducts';

interface CartContextType {
  cartItems: ReturnType<typeof useCart>['cartItems'];
  addToCart: ReturnType<typeof useCart>['addToCart'];
  updateQuantity: ReturnType<typeof useCart>['updateQuantity'];
  removeFromCart: ReturnType<typeof useCart>['removeFromCart'];
  products: ReturnType<typeof useProducts>['products'];
  lastSelectedProductId: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartHook = useCart();
  const productsHook = useProducts();
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);

  const addToCart = (productId: string) => {
    const product = productsHook.products.find((p) => p.productId === productId);
    const cartItem = cartHook.cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;

    if (product && product.stock > currentQuantity) {
      cartHook.addToCart(productId);
      setLastSelectedProductId(productId);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = productsHook.products.find((p) => p.productId === productId);
    const cartItem = cartHook.cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;

    if (newQuantity <= 0) {
      cartHook.updateQuantity(productId, newQuantity);
      return;
    }

    if (product && newQuantity <= product.stock + currentQuantity) {
      cartHook.updateQuantity(productId, newQuantity);
    } else {
      alert('재고가 부족합니다.');
    }
  };

  // 타이머 시작
  useDiscountTimers({
    products: productsHook.products,
    updateProductSaleStatus: productsHook.updateProductSaleStatus,
    updateProductRecommendStatus: productsHook.updateProductRecommendStatus,
    lastSelectedProductId,
  });

  return (
    <CartContext.Provider
      value={{
        ...cartHook,
        addToCart,
        updateQuantity,
        ...productsHook,
        lastSelectedProductId,
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
