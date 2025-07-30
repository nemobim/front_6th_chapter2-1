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
    }, Math.random() * 10000);
  }

  // 추천 상품 타이머 시작
  startRecommendationTimer() {
    setTimeout(() => {
      this.showRecommendation();
    }, Math.random() * 20000);
  }

  // 번개 세일 시작
  startLightningSale() {
    const luckyItem = this.findRecommendationProduct();
    if (luckyItem && luckyItem.q > 0) {
      luckyItem.onSale = true;
      luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
      this.updateProductOptions();
      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    }

    setTimeout(() => {
      this.startLightningSale();
    }, 30000);
  }

  // 추천 상품 표시
  showRecommendation() {
    const suggest = this.findRecommendationProduct();
    if (suggest && suggest.q > 0 && !suggest.suggestSale) {
      suggest.suggestSale = true;
      this.updateProductOptions();
      alert(' ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
    }

    setTimeout(() => {
      this.showRecommendation();
    }, Math.random() * 20000);
  }

  // 추천 상품 찾기
  findRecommendationProduct() {
    if (!this.lastSelectedProductId) return null;

    for (const product of this.productList) {
      if (product.id !== this.lastSelectedProductId && product.q > 0 && !product.suggestSale) {
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
