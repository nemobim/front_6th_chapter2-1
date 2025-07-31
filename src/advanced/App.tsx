import { useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';
import { PRODUCTS } from './lib/products';
import type { CartItem } from './types';

const App = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = () => {
    if (!selectedProductId) return;

    const product = PRODUCTS.find((p) => p.id === selectedProductId);
    if (!product) return;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === selectedProductId);
      if (existingItem) {
        return prev.map((item) =>
          item.productId === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            productId: selectedProductId,
            productName: product.name,
            quantity: 1,
            price: product.price,
            discountPrice: product.price * 0.76, // 24% 할인
          },
        ];
      }
    });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  return (
    <>
      <Header cartItemCount={totalItemCount} />
      <GuideToggle />
      <Layout>
        <ShoppingCart
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
          products={PRODUCTS}
          onQuantityChange={handleQuantityChange}
        />
        <OrderSummary />
      </Layout>
    </>
  );
};

export default App;
