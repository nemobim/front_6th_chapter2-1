import { useState } from 'react';

import ShoppingCart from './components/cart/ShoppingCart';
import GuideToggle from './components/guide/GuideToggle';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import OrderSummary from './components/order/OrderSummary';

const App = () => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState('');

  return (
    <>
      <Header cartItemCount={cartItemCount} />
      <GuideToggle />
      <Layout>
        <ShoppingCart
          selectedProductId={selectedProductId}
          onProductSelect={setSelectedProductId}
          onAddToCart={() => {
            // 다음 작업에서 구현할 예정
          }}
        />
        <OrderSummary />
      </Layout>
    </>
  );
};

export default App;
