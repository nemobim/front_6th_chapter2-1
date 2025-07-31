import { useEffect, useRef } from 'react';

import { Product } from '../lib/products';

interface UseDiscountTimersProps {
  products: Product[];
  updateProductSaleStatus: (_productId: string, _isOnSale: boolean, _newPrice?: number) => void;
  updateProductRecommendStatus: (_productId: string, _isRecommended: boolean, _newPrice?: number) => void;
  lastSelectedProductId: string | null;
}

export function useDiscountTimers({
  products,
  updateProductSaleStatus,
  updateProductRecommendStatus,
  lastSelectedProductId,
}: UseDiscountTimersProps) {
  const lightningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recommendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 최신 값들을 참조하기 위한 ref
  const productsRef = useRef(products);
  const updateProductSaleStatusRef = useRef(updateProductSaleStatus);
  const updateProductRecommendStatusRef = useRef(updateProductRecommendStatus);
  const lastSelectedProductIdRef = useRef(lastSelectedProductId);

  // ref 값들을 항상 최신으로 유지
  productsRef.current = products;
  updateProductSaleStatusRef.current = updateProductSaleStatus;
  updateProductRecommendStatusRef.current = updateProductRecommendStatus;
  lastSelectedProductIdRef.current = lastSelectedProductId;

  useEffect(() => {
    // 번개세일 재귀 타이머 (원본처럼 한 번 실행 후 다음 타이머 설정)
    const startLightningSale = () => {
      const availableProducts = productsRef.current.filter((p) => p.stock > 0 && !p.isOnSale);

      if (availableProducts.length > 0) {
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        const salePrice = Math.round(randomProduct.originalPrice * 0.8); // 20% 할인

        updateProductSaleStatusRef.current(randomProduct.productId, true, salePrice);
        alert(`⚡번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
      }

      // 다음 번개세일 예약 (30초 후)
      lightningTimerRef.current = setTimeout(() => {
        startLightningSale();
      }, 30000);
    };

    // 추천할인 재귀 타이머
    const startRecommendation = () => {
      const currentLastSelected = lastSelectedProductIdRef.current;
      if (currentLastSelected) {
        const availableProducts = productsRef.current.filter(
          (p) => p.productId !== currentLastSelected && p.stock > 0 && !p.isRecommended
        );

        if (availableProducts.length > 0) {
          const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
          const recommendPrice = Math.round(randomProduct.price * 0.95);

          updateProductRecommendStatusRef.current(randomProduct.productId, true, recommendPrice);
          alert(`💝 ${randomProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        }
      }

      // 다음 추천할인 예약 (60초 후)
      recommendTimerRef.current = setTimeout(() => {
        startRecommendation();
      }, 60000);
    };

    // 초기 지연 후 시작
    const lightningDelay = Math.random() * 10000; // 0-10초
    const recommendDelay = Math.random() * 20000; // 0-20초

    lightningTimerRef.current = setTimeout(() => {
      startLightningSale();
    }, lightningDelay);

    recommendTimerRef.current = setTimeout(() => {
      startRecommendation();
    }, recommendDelay);

    return () => {
      if (lightningTimerRef.current) clearTimeout(lightningTimerRef.current);
      if (recommendTimerRef.current) clearTimeout(recommendTimerRef.current);
    };
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  return null;
}
