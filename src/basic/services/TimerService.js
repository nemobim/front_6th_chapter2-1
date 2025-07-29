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

  // 번개세일 타이머 시작
  startLightningSaleTimer() {
    const lightningDelay = Math.random() * 10000;
    setTimeout(() => {
      setInterval(() => {
        this.triggerLightningSale();
      }, 30000);
    }, lightningDelay);
  }

  // 추천상품 타이머 시작
  startRecommendationTimer() {
    setTimeout(() => {
      setInterval(() => {
        this.triggerRecommendation();
      }, 60000);
    }, Math.random() * 20000);
  }

  // 번개세일 트리거
  triggerLightningSale() {
    const luckyIndex = Math.floor(Math.random() * this.productList.length);
    const luckyItem = this.productList[luckyIndex];

    if (luckyItem.q > 0 && !luckyItem.onSale) {
      luckyItem.val = Math.round((luckyItem.originalVal * 80) / 100);
      luckyItem.onSale = true;
      alert('⚡번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      this.updateProductOptions(this.productList);
      this.updatePricesInCart();
    }
  }

  // 추천상품 트리거
  triggerRecommendation() {
    if (!this.lastSelectedProductId) return;

    const suggest = this.findRecommendationProduct();
    if (suggest) {
      alert('�� ' + suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      suggest.val = Math.round((suggest.val * (100 - 5)) / 100);
      suggest.suggestSale = true;
      this.updateProductOptions(this.productList);
      this.updatePricesInCart();
    }
  }

  // 추천 상품 찾기
  findRecommendationProduct() {
    for (const product of this.productList) {
      if (product.id !== this.lastSelectedProductId && product.q > 0 && !product.suggestSale) {
        return product;
      }
    }
    return null;
  }

  // 마지막 선택된 상품 ID 설정
  setLastSelectedProduct(productId) {
    this.lastSelectedProductId = productId;
  }
}
