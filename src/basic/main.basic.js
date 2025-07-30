import { useAppInitialization } from './hooks/useAppInitialization.js';
import { useComponentCreation } from './hooks/useComponentCreation.js';
import { useServiceInitialization } from './hooks/useServiceInitialization.js';
import { useRendering } from './hooks/useRendering.js';

function main() {
  const { initializeAppState, setupStateSubscription } = useAppInitialization();
  const { createCoreComponents, createLayoutComponents, mountComponentsToDOM } = useComponentCreation();
  const { initializeCoreServices, initializeDOMDependentServices } = useServiceInitialization();
  const { performInitialRendering, setupEventHandlers } = useRendering();

  // 1. 애플리케이션 상태 초기화
  initializeAppState();

  // 2. 핵심 서비스 초기화 (DOM 생성 전)
  const { discountCalculator } = initializeCoreServices();

  // 3. 핵심 컴포넌트 생성
  const { sel, addBtn, stockInfo, cartDisp } = createCoreComponents();

  // 4. 레이아웃 컴포넌트 생성 및 조립
  const layoutComponents = createLayoutComponents(sel, addBtn, stockInfo, cartDisp);

  // 5. DOM에 컴포넌트 마운트
  mountComponentsToDOM(layoutComponents);

  // 6. DOM 의존 서비스 초기화
  const { cartEventHandler, uiUpdater } = initializeDOMDependentServices(sel, cartDisp, discountCalculator);

  // 7. 초기 렌더링 수행
  performInitialRendering(sel, cartDisp, discountCalculator, uiUpdater);

  // 8. 이벤트 핸들러 등록
  setupEventHandlers(cartEventHandler, addBtn);

  // 9. 상태 구독 설정
  setupStateSubscription();
}

main();
