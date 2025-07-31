import { useEffect, useRef } from 'react';

import { PRODUCT_IDS } from '../lib/products';

interface UseDiscountTimersProps {
  products: any[];
  updateProductSaleStatus: (productId: string, isOnSale: boolean, newPrice?: number) => void;
  updateProductRecommendStatus: (productId: string, isRecommended: boolean, newPrice?: number) => void;
  lastSelectedProductId: string | null;
}

export function useDiscountTimers({
  products,
  updateProductSaleStatus,
  updateProductRecommendStatus,
  lastSelectedProductId,
}: UseDiscountTimersProps) {
  const lightningTimerRef = useRef<NodeJS.Timeout>();
  const recommendTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // 번개세일 타이머 (초기 랜덤 지연 후 30초마다)
    const startLightningTimer = () => {
      const initialDelay = Math.random() * 10000; // 0-10초 랜덤 지연

      setTimeout(() => {
        lightningTimerRef.current = setInterval(() => {
          const availableProducts = products.filter((p) => p.stock > 0 && !p.isOnSale);

          if (availableProducts.length > 0) {
            const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
            const salePrice = Math.round(randomProduct.originalPrice * 0.8); // 20% 할인

            updateProductSaleStatus(randomProduct.productId, true, salePrice);
            alert(`⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
          }
        }, 30000);
      }, initialDelay);
    };

    // 추천할인 타이머 (랜덤 지연 후 60초마다)
    const startRecommendTimer = () => {
      const initialDelay = Math.random() * 20000; // 0-20초 랜덤 지연

      setTimeout(() => {
        recommendTimerRef.current = setInterval(() => {
          if (lastSelectedProductId) {
            const availableProducts = products.filter(
              (p) => p.productId !== lastSelectedProductId && p.stock > 0 && !p.isRecommended
            );

            if (availableProducts.length > 0) {
              const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
              const recommendPrice = Math.round(randomProduct.price * 0.95); // 5% 할인

              updateProductRecommendStatus(randomProduct.productId, true, recommendPrice);
              alert(`💝 ${randomProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            }
          }
        }, 60000);
      }, initialDelay);
    };

    startLightningTimer();
    startRecommendTimer();

    return () => {
      if (lightningTimerRef.current) clearInterval(lightningTimerRef.current);
      if (recommendTimerRef.current) clearInterval(recommendTimerRef.current);
    };
  }, [products, updateProductSaleStatus, updateProductRecommendStatus, lastSelectedProductId]);

  return null;
}
