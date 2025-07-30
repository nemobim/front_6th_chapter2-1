// 가격 포맷팅 유틸리티 함수들
const createSaleBadge = (product) => {
  if (product.onSale && product.suggestSale) return '⚡💝';
  if (product.onSale) return '⚡';
  if (product.suggestSale) return '💝';
  return '';
};

const getPriceColorClass = (product) => {
  if (product.onSale && product.suggestSale) return 'text-purple-600';
  if (product.onSale) return 'text-red-500';
  if (product.suggestSale) return 'text-blue-500';
  return '';
};

const formatPriceDisplay = (product) => {
  if (product.onSale || product.suggestSale) {
    const colorClass = getPriceColorClass(product);
    return `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="${colorClass}">₩${product.val.toLocaleString()}</span>`;
  }
  return `₩${product.val.toLocaleString()}`;
};

const createProductImage = () => {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  `;
};

const createProductInfo = (product) => {
  const saleBadge = createSaleBadge(product);
  const priceDisplay = formatPriceDisplay(product);

  return `
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleBadge}${product.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceDisplay}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
  `;
};

const createPriceSection = (product) => {
  const priceDisplay = formatPriceDisplay(product);

  return `
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceDisplay}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;
};

export const createCartItem = (product) => {
  const cartItem = document.createElement('div');
  cartItem.id = product.id;
  cartItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  cartItem.innerHTML = createProductImage() + createProductInfo(product) + createPriceSection(product);

  return cartItem;
};

// 카트 아이템 가격 업데이트 함수
export const updateCartItemPrice = (cartItem, product) => {
  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');
  const saleBadge = createSaleBadge(product);
  const priceDisplay = formatPriceDisplay(product);

  priceDiv.innerHTML = priceDisplay;
  nameDiv.textContent = saleBadge + product.name;
};
