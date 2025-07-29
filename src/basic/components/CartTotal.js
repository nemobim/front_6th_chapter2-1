export const createCartTotal = () => {
  const cartTotal = document.createElement('div');
  cartTotal.id = 'cart-total';
  cartTotal.className = 'pt-5 border-t border-white/10';
  cartTotal.innerHTML = /* HTML */ `
    <div class="flex justify-between items-baseline">
      <span class="text-sm uppercase tracking-wider">Total</span>
      <div class="text-2xl tracking-tight">₩0</div>
    </div>
  `;

  return cartTotal;
};

// 총 금액 업데이트
export const updateCartTotal = (cartTotalElement, totalAmount) => {
  const totalDiv = cartTotalElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }
};
