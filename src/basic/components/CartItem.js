export const createCartItem = (product) => {
  const cartItem = document.createElement('div');
  cartItem.id = product.id;
  cartItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  cartItem.innerHTML = /* HTML */ `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div
        class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
      ></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">
        ${product.onSale && product.suggestSale
          ? '⚡💝'
          : product.onSale
            ? '⚡'
            : product.suggestSale
              ? '💝'
              : ''}${product.name}
      </h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">
        ${product.onSale || product.suggestSale
          ? '<span class="line-through text-gray-400">₩' +
            product.originalVal.toLocaleString() +
            '</span> <span class="' +
            (product.onSale && product.suggestSale
              ? 'text-purple-600'
              : product.onSale
                ? 'text-red-500'
                : 'text-blue-500') +
            '">₩' +
            product.val.toLocaleString() +
            '</span>'
          : '₩' + product.val.toLocaleString()}
      </p>
      <div class="flex items-center gap-4">
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.id}"
          data-change="-1"
        >
          −
        </button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button
          class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          data-product-id="${product.id}"
          data-change="1"
        >
          +
        </button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">
        ${product.onSale || product.suggestSale
          ? '<span class="line-through text-gray-400">₩' +
            product.originalVal.toLocaleString() +
            '</span> <span class="' +
            (product.onSale && product.suggestSale
              ? 'text-purple-600'
              : product.onSale
                ? 'text-red-500'
                : 'text-blue-500') +
            '">₩' +
            product.val.toLocaleString() +
            '</span>'
          : '₩' + product.val.toLocaleString()}
      </div>
      <a
        class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        data-product-id="${product.id}"
        >Remove</a
      >
    </div>
  `;

  return cartItem;
};

// 카트 아이템 가격 업데이트 함수
export const updateCartItemPrice = (cartItem, product) => {
  const priceDiv = cartItem.querySelector('.text-lg');
  const nameDiv = cartItem.querySelector('h3');

  if (product.onSale && product.suggestSale) {
    priceDiv.innerHTML =
      '<span class="line-through text-gray-400">₩' +
      product.originalVal.toLocaleString() +
      '</span> <span class="text-purple-600">₩' +
      product.val.toLocaleString() +
      '</span>';
    nameDiv.textContent = '⚡💝' + product.name;
  } else if (product.onSale) {
    priceDiv.innerHTML =
      '<span class="line-through text-gray-400">₩' +
      product.originalVal.toLocaleString() +
      '</span> <span class="text-red-500">₩' +
      product.val.toLocaleString() +
      '</span>';
    nameDiv.textContent = '⚡' + product.name;
  } else if (product.suggestSale) {
    priceDiv.innerHTML =
      '<span class="line-through text-gray-400">₩' +
      product.originalVal.toLocaleString() +
      '</span> <span class="text-blue-500">₩' +
      product.val.toLocaleString() +
      '</span>';
    nameDiv.textContent = '💝' + product.name;
  } else {
    priceDiv.textContent = '₩' + product.val.toLocaleString();
    nameDiv.textContent = product.name;
  }
};
