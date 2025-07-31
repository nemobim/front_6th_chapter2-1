import {
  PRODUCT_OPTION_TEMPLATES,
  PRODUCT_STATE_CONFIG,
  PRODUCT_STYLE_CLASSES,
  TOTAL_STOCK_WARNING,
} from '../../constants';
import { PRODUCTS } from '../../lib/products';
import type { Product } from '../../types';

interface ProductPickerProps {
  selectedProductId?: string;
  onProductSelect?: (productId: string) => void;
  onAddToCart?: () => void;
}

const ProductPicker = ({ selectedProductId = '', onProductSelect, onAddToCart }: ProductPickerProps) => {
  const selectedProduct = PRODUCTS.find((p: Product) => p.id === selectedProductId);
  const isOutOfStock = selectedProduct?.stock === 0;
  const isLowStock = selectedProduct && selectedProduct.stock > 0 && selectedProduct.stock <= 5;

  // 총 재고 계산
  const totalStock = PRODUCTS.reduce((total: number, product: Product) => total + product.stock, 0);
  const isLowTotalStock = totalStock < TOTAL_STOCK_WARNING;

  // 제품 상태 확인
  const getProductState = (product: Product) => {
    if (product.isOnSale && product.isRecommended) return PRODUCT_STATE_CONFIG.SALE_AND_RECOMMEND;
    if (product.isOnSale) return PRODUCT_STATE_CONFIG.SALE_ONLY;
    if (product.isRecommended) return PRODUCT_STATE_CONFIG.RECOMMEND_ONLY;
    return PRODUCT_STATE_CONFIG.DEFAULT;
  };

  // 상품 옵션 텍스트 생성
  const createOptionText = (product: Product): string => {
    const badges: string[] = [];

    if (product.isOnSale) badges.push('⚡SALE');
    if (product.isRecommended) badges.push('💝추천');
    const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : '';

    // 품절 상품
    if (product.stock === 0) {
      return PRODUCT_OPTION_TEMPLATES.OUT_OF_STOCK(product.name, product.price, badgeText);
    }

    // 할인 상품들
    if (product.isOnSale && product.isRecommended) {
      return PRODUCT_OPTION_TEMPLATES.SUPER_SALE(product.name, product.originalPrice, product.price);
    }
    if (product.isOnSale) {
      return PRODUCT_OPTION_TEMPLATES.SALE(product.name, product.originalPrice, product.price);
    }
    if (product.isRecommended) {
      return PRODUCT_OPTION_TEMPLATES.RECOMMENDED(product.name, product.originalPrice, product.price);
    }

    // 일반 상품
    return PRODUCT_OPTION_TEMPLATES.DEFAULT(product.name, product.price, badgeText);
  };

  // 상품 상태에 따른 스타일 적용
  const getProductStyle = (product: Product): string => {
    if (product.stock === 0) return PRODUCT_STYLE_CLASSES.OUT_OF_STOCK;
    if (product.isOnSale && product.isRecommended) return PRODUCT_STYLE_CLASSES.SALE_AND_RECOMMEND;
    if (product.isOnSale) return PRODUCT_STYLE_CLASSES.SALE_ONLY;
    if (product.isRecommended) return PRODUCT_STYLE_CLASSES.RECOMMEND_ONLY;
    return PRODUCT_STYLE_CLASSES.DEFAULT;
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      {isLowTotalStock && (
        <div className="mb-3 p-2 bg-orange-100 border border-orange-300 rounded text-xs text-orange-700">
          ⚠️ 전체 재고가 부족합니다. (총 {totalStock}개)
        </div>
      )}

      <select
        value={selectedProductId}
        onChange={(e) => onProductSelect?.(e.target.value)}
        className={`w-full p-3 border rounded-lg text-base mb-3 ${
          isLowTotalStock ? 'border-orange-300' : 'border-gray-300'
        }`}
      >
        <option value="">Select a product</option>
        {PRODUCTS.map((product: Product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
            className={getProductStyle(product)}
          >
            {createOptionText(product)}
          </option>
        ))}
      </select>
      <button
        onClick={onAddToCart}
        disabled={!selectedProductId || isOutOfStock}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? '품절' : 'Add to Cart'}
      </button>
      {isOutOfStock && selectedProduct && <div className="text-xs text-red-500 mt-3">{selectedProduct.name}: 품절</div>}
      {isLowStock && selectedProduct && (
        <div className="text-xs text-orange-500 mt-3">
          {selectedProduct.name}: 재고 {selectedProduct.stock}개 남음
        </div>
      )}
      {selectedProduct?.isOnSale && (
        <div className="text-xs text-purple-500 mt-3">⚡ {selectedProduct.name}: 번개세일 20% 할인!</div>
      )}
      {selectedProduct?.isRecommended && (
        <div className="text-xs text-blue-500 mt-3">✨ {selectedProduct.name}: 추천상품 5% 할인!</div>
      )}
    </div>
  );
};

export default ProductPicker;
