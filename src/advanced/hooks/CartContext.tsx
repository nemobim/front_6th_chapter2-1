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
      productsHook.decreaseStock(productId, 1); // 실제 재고 차감
      setLastSelectedProductId(productId);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = productsHook.products.find((p) => p.productId === productId);
    const cartItem = cartHook.cartItems.find((item) => item.productId === productId);
    const currentQuantity = cartItem?.quantity || 0;
    const quantityDiff = newQuantity - currentQuantity;

    if (newQuantity <= 0) {
      // 수량이 0 이하가 되면 전체 수량만큼 재고 복구
      productsHook.increaseStock(productId, currentQuantity);
      cartHook.updateQuantity(productId, newQuantity);
      return;
    }

    if (quantityDiff > 0) {
      // 수량 증가 시 재고 차감
      if (product && product.stock >= quantityDiff) {
        productsHook.decreaseStock(productId, quantityDiff);
        cartHook.updateQuantity(productId, newQuantity);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 수량 감소 시 재고 복구
      productsHook.increaseStock(productId, Math.abs(quantityDiff));
      cartHook.updateQuantity(productId, newQuantity);
    }
  };

  const removeFromCart = (productId: string) => {
    const cartItem = cartHook.cartItems.find((item) => item.productId === productId);
    if (cartItem) {
      // 제거 시 전체 수량만큼 재고 복구
      productsHook.increaseStock(productId, cartItem.quantity);
    }
    cartHook.removeFromCart(productId);
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
        cartItems: cartHook.cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
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
