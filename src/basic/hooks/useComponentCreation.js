import { createCartAddButton } from '../components/CartAddButton';
import { createCartDisplay } from '../components/CartDisplay';
import { createHeader } from '../components/Header';
import { createMainLayout } from '../components/MainLayout';
import { createProductColumn } from '../components/ProductColumn';
import { createProductSelector } from '../components/ProductSelector';
import { createStockInfo } from '../components/StockInfo';
import { createSummaryColumn } from '../components/SummaryColumn';
import { createUsageInfo } from '../components/UsageInfo';
import { getCartState } from '../state/appState.js';

/**
 * 컴포넌트 생성 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useComponentCreation() {
  /**
   * 핵심 상호작용 컴포넌트들을 생성
   */
  function createCoreComponents() {
    const productSelector = createProductSelector();
    const cartAddButton = createCartAddButton();
    const stockInfo = createStockInfo();
    const cartDisplay = createCartDisplay();
    return { productSelector, cartAddButton, stockInfo, cartDisplay };
  }

  /**
   * 레이아웃 컴포넌트들을 생성하고 조립
   */
  function createLayoutComponents(productSelector, cartAddButton, stockInfo, cartDisplay) {
    const header = createHeader({ cartItemCount: getCartState().totalItemCount });

    const productColumn = createProductColumn({
      productSelector: productSelector,
      cartAddButton: cartAddButton,
      stockStatusElement: stockInfo,
      cartDisplay: cartDisplay,
    });

    const summaryColumn = createSummaryColumn();
    const { usageToggle, usageOverlay } = createUsageInfo();
    const mainLayout = createMainLayout({ productColumn: productColumn, summaryColumn: summaryColumn });

    return { header, mainLayout, usageToggle, usageOverlay };
  }

  /**
   * 생성된 컴포넌트들을 DOM에 마운트
   */
  function mountComponentsToDOM(components) {
    const { header, mainLayout, usageToggle, usageOverlay } = components;
    const root = document.getElementById('app');

    root.appendChild(header);
    root.appendChild(mainLayout);
    root.appendChild(usageToggle);
    root.appendChild(usageOverlay);
  }

  return { createCoreComponents, createLayoutComponents, mountComponentsToDOM };
}
