import { createCartTotal } from './CartTotal.js';
import { createDiscountInfo } from './DiscountInfo.js';
import { createOrderSummary } from './OrderSummary.js'; // 변경
import { createRewardPoints } from './RewardPoints.js';

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

  // OrderSummary 컴포넌트 생성 및 추가
  const orderSummary = createOrderSummary(); // 변경
  const flexContainer = summaryColumn.querySelector('.flex-1.flex.flex-col');
  flexContainer.insertBefore(orderSummary, flexContainer.querySelector('.mt-auto')); // 변경

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
