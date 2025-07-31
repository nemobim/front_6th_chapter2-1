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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

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

    // 성공 메시지 표시
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000); // 3초 후 자동 숨김

    // 상품 추가 후 선택 상태 초기화
    setSelectedProductId('');
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

  const handleRemoveItem = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      setCartItems((prev) => prev.filter((item) => item.productId !== itemToRemove));
      setItemToRemove(null);
    }
  };

  const cancelRemoveItem = () => {
    setItemToRemove(null);
  };

  return (
    <>
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>상품이 카트에 추가되었습니다!</span>
          </div>
        </div>
      )}

      {itemToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">상품 삭제 확인</h3>
            <p className="text-gray-600 mb-6">이 상품을 카트에서 삭제하시겠습니까?</p>
            <div className="flex gap-3">
              <button
                onClick={cancelRemoveItem}
                className="flex-1 py-2 px-4 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmRemoveItem}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

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
          onRemoveItem={handleRemoveItem}
        />
        <OrderSummary cartItems={cartItems} products={PRODUCTS} />
      </Layout>
    </>
  );
};

export default App;
