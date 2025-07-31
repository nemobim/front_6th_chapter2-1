import { useState } from 'react';

import { CartItem } from '../lib/products';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (productId: string) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productId === productId);

      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevItems, { productId, quantity: 1 }];
    });
  };

  return {
    cartItems,
    addToCart,
  };
}
