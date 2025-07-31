// 타이머 관련 상수
const TIMER_DELAYS = {
  LIGHTNING_SALE_MIN: 0,
  LIGHTNING_SALE_MAX: 10000, // 10초
  RECOMMENDATION_MIN: 0,
  RECOMMENDATION_MAX: 20000, // 20초
  LIGHTNING_SALE_INTERVAL: 30000, // 30초
};

const DISCOUNT_PERCENTAGES = {
  LIGHTNING_SALE: 80, // 80% 할인 (20% 할인)
  RECOMMENDATION: 95, // 95% 할인 (5% 할인)
};

export class TimerService {
  constructor(productList, updateProductOptions, updatePricesInCart) {
    this.productList = productList;
    this.updateProductOptions = updateProductOptions;
    this.updatePricesInCart = updatePricesInCart;
    this.lastSelectedProductId = null;
  }

  // 타이머 서비스 시작
  startTimers() {
    this.startLightningSaleTimer();
    this.startRecommendationTimer();
  }

  // 번개 세일 타이머 시작
  startLightningSaleTimer() {
    setTimeout(() => {
      this.startLightningSale();
    }, Math.random() * TIMER_DELAYS.LIGHTNING_SALE_MAX);
  }

  // 추천 상품 타이머 시작
  startRecommendationTimer() {
    setTimeout(() => {
      this.showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);
  }

  // 번개 세일 시작
  startLightningSale() {
    const luckyItem = this.findRecommendationProduct();
    if (luckyItem && luckyItem.stock > 0) {
      luckyItem.isOnSale = true;
      luckyItem.price = Math.round((luckyItem.originalPrice * DISCOUNT_PERCENTAGES.LIGHTNING_SALE) / 100);
      this.updateProductOptions();
      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    }

    setTimeout(() => {
      this.startLightningSale();
    }, TIMER_DELAYS.LIGHTNING_SALE_INTERVAL);
  }

  // 추천 상품 표시
  showRecommendation() {
    const suggest = this.findRecommendationProduct();
    if (suggest && suggest.stock > 0 && !suggest.isRecommended) {
      suggest.isRecommended = true;
      this.updateProductOptions();
      alert(' ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      suggest.price = Math.round((suggest.price * DISCOUNT_PERCENTAGES.RECOMMENDATION) / 100);
    }

    setTimeout(() => {
      this.showRecommendation();
    }, Math.random() * TIMER_DELAYS.RECOMMENDATION_MAX);
  }

  // 추천 상품 찾기
  findRecommendationProduct() {
    if (!this.lastSelectedProductId) return null;

    for (const product of this.productList) {
      if (product.productId !== this.lastSelectedProductId && product.stock > 0 && !product.isRecommended) {
        return product;
      }
    }
    return null;
  }

  // 마지막 선택된 상품 설정
  setLastSelectedProduct(productId) {
    this.lastSelectedProductId = productId;
  }
}
