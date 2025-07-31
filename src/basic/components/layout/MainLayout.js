import { createItemCount, updateItemCount } from '../product/ItemCount.js';

export const createHeader = ({ cartItemCount = 0 }) => {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  `;

  // ItemCount 컴포넌트 생성 및 추가
  const itemCount = createItemCount();
  updateItemCount(itemCount, cartItemCount);
  header.appendChild(itemCount);

  return header;
};

import { createCartTotal } from '../cart/CartTotal.js';
import { createDiscountInfo } from '../order/DiscountInfo.js';
import { createOrderSummary } from '../order/OrderSummary.js';
import { createRewardPoints } from '../order/RewardPoints.js';

export const createSummaryColumn = () => {
  const summaryColumn = document.createElement('div');
  summaryColumn.className = 'bg-black text-white p-8 flex flex-col';
  summaryColumn.innerHTML = /* HTML */ `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div class="mt-auto">
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs"></span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button
      class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
    >
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;

  // SummaryDetails 컴포넌트 생성 및 추가
  const orderSummary = createOrderSummary();
  const flexContainer = summaryColumn.querySelector('.flex-1.flex.flex-col');
  flexContainer.insertBefore(orderSummary, flexContainer.querySelector('.mt-auto'));

  // DiscountInfo 컴포넌트 생성 및 추가
  const discountInfo = createDiscountInfo();
  const mtAuto = summaryColumn.querySelector('.mt-auto');
  mtAuto.insertBefore(discountInfo, mtAuto.querySelector('#tuesday-special'));

  // CartTotal 컴포넌트 생성 및 추가
  const cartTotal = createCartTotal();
  mtAuto.insertBefore(cartTotal, mtAuto.querySelector('#tuesday-special'));

  // RewardPoints 컴포넌트 생성 및 추가
  const rewardPoints = createRewardPoints();
  cartTotal.appendChild(rewardPoints);

  return summaryColumn;
};

export const createProductColumn = ({ productSelector, cartAddButton, stockStatusElement, cartDisplay }) => {
  const productColumn = document.createElement('div');
  productColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'space-y-2';
  selectorContainer.appendChild(productSelector);

  selectorContainer.appendChild(cartAddButton);

  productColumn.appendChild(selectorContainer);
  productColumn.appendChild(stockStatusElement);
  productColumn.appendChild(cartDisplay);

  return productColumn;
};

export const createMainLayout = ({ productColumn, summaryColumn }) => {
  const mainLayout = document.createElement('div');
  mainLayout.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // 자식 요소들 추가
  mainLayout.appendChild(productColumn);
  mainLayout.appendChild(summaryColumn);

  return mainLayout;
};
