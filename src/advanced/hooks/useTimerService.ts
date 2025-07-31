import { useEffect, useRef } from 'react';

import { PRODUCTS } from '../lib/products';

// 타이머 관련 상수
const TIMER_DELAYS = {
  LIGHTNING_SALE_MIN: 0,
  LIGHTNING_SALE_MAX: 10000, // 10초
  RECOMMENDATION_MIN: 0,
  RECOMMENDATION_MAX: 20000, // 20초
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
};

const DISCOUNT_PERCENTAGES = {
  LIGHTNING_SALE: 80, // 20% 할인
  RECOMMENDATION: 95, // 5% 할인
};

export const useTimerService = () => {
  const lastSelectedProductId = useRef<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 추천 상품 찾기
  const findRecommendationProduct = () => {
    if (!lastSelectedProductId.current) return null;

    for (const product of PRODUCTS) {
      if (product.id !== lastSelectedProductId.current && product.stock > 0 && !product.isRecommended) {
        return product;
      }
    }
    return null;
  };

  // 번개 세일 시작
  const startLightningSale = () => {
    const luckyItem = findRecommendationProduct();
    if (luckyItem && luckyItem.stock > 0) {
      luckyItem.isOnSale = true;
      luckyItem.price = Math.round((luckyItem.originalPrice * DISCOUNT_PERCENTAGES.LIGHTNING_SALE) / 100);

      // 알림 표시
      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    }

    const timer = setTimeout(() => {
      startLightningSale();
    }, TIMER_DELAYS.LIGHTNING_SALE_INTERVAL);

    timers.current.push(timer);
  };

  // 추천 상품 표시
  const showRecommendation = () => {
    const recommendationProduct = findRecommendationProduct();
    if (recommendationProduct && recommendationProduct.stock > 0 && !recommendationProduct.isRecommended) {
      recommendationProduct.isRecommended = true;

      alert(' ' + recommendationProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      recommendationProduct.price = Math.round(
        (recommendationProduct.price * DISCOUNT_PERCENTAGES.RECOMMENDATION) / 100
      );
    }

    const timer = setTimeout(() => {
      showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);

    timers.current.push(timer);
  };

  // 타이머 서비스 시작
  const startTimers = () => {
    // 번개 세일 타이머 시작
    const lightningTimer = setTimeout(() => {
      startLightningSale();
    }, Math.random() * TIMER_DELAYS.LIGHTNING_SALE_MAX);

    // 추천 상품 타이머 시작
    const recommendationTimer = setTimeout(() => {
      showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);

    timers.current.push(lightningTimer, recommendationTimer);
  };

  // 마지막 선택된 상품 설정
  const setLastSelectedProduct = (productId: string) => {
    lastSelectedProductId.current = productId;
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return {
    startTimers,
    setLastSelectedProduct,
  };
};
