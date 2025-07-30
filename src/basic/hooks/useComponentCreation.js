import { createAddToCartButton } from '../components/AddToCartButton';
import { createCartDisplay } from '../components/CartDisplay';
import { createGridContainer } from '../components/GridContainer';
import { createHeader } from '../components/Header';
import { createLeftColumn } from '../components/LeftColumn';
import { createManualOverlay } from '../components/ManualOverlay';
import { createProductSelector } from '../components/ProductSelector';
import { createRightColumn } from '../components/RightColumn';
import { createStockInfo } from '../components/StockInfo';
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
    const addToCartButton = createAddToCartButton();
    const stockInfo = createStockInfo();
    const cartDisplay = createCartDisplay();
    return { productSelector, addToCartButton, stockInfo, cartDisplay };
  }

  /**
   * 레이아웃 컴포넌트들을 생성하고 조립
   */
  function createLayoutComponents(productSelector, addToCartButton, stockInfo, cartDisplay) {
    const header = createHeader({ cartItemCount: getCartState().totalItemCount });

    const leftColumn = createLeftColumn({
      productSelector: productSelector,
      addToCartButton: addToCartButton,
      stockStatusElement: stockInfo,
      cartDisplay: cartDisplay,
    });

    const rightColumn = createRightColumn();
    const { manualToggle, manualOverlay } = createManualOverlay();
    const gridContainer = createGridContainer({ leftColumn, rightColumn });

    return { header, gridContainer, manualToggle, manualOverlay };
  }

  /**
   * 생성된 컴포넌트들을 DOM에 마운트
   */
  function mountComponentsToDOM(components) {
    const { header, gridContainer, manualToggle, manualOverlay } = components;
    const root = document.getElementById('app');

    root.appendChild(header);
    root.appendChild(gridContainer);
    root.appendChild(manualToggle);
    root.appendChild(manualOverlay);
  }

  return { createCoreComponents, createLayoutComponents, mountComponentsToDOM };
}
