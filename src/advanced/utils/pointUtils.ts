import { POINTS_POLICY } from '../constants/policy';
import { PRODUCTS } from '../lib/products';
import type { CartItem, Product } from '../types';

const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
};

export const isTuesday = (): boolean => {
  return new Date().getDay() === 2;
};

// 기본 포인트 계산
const calculateBasePoints = (totalAmount: number): number => {
  return Math.floor(totalAmount * POINTS_POLICY.BASE_RATE);
};

// 상품 조합 확인
const getProductCombination = (cartItems: CartItem[], products: Product[]) => {
  const combination = {
    hasKeyboard: false,
    hasMouse: false,
    hasMonitorArm: false,
  };

  cartItems.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    switch (product.id) {
      case PRODUCT_IDS.KEYBOARD:
        combination.hasKeyboard = true;
        break;
      case PRODUCT_IDS.MOUSE:
        combination.hasMouse = true;
        break;
      case PRODUCT_IDS.MONITOR_ARM:
        combination.hasMonitorArm = true;
        break;
    }
  });

  return combination;
};

// 모든 보너스 계산
const calculateAllBonuses = (combination: any, itemCount: number) => {
  const { hasKeyboard, hasMouse, hasMonitorArm } = combination;
  let totalBonus = 0;
  const bonusDetails: string[] = [];

  // 세트 구매 보너스
  if (hasKeyboard && hasMouse) {
    totalBonus += POINTS_POLICY.SET_BONUS.KEYBOARD_MOUSE;
    bonusDetails.push('키보드+마우스 세트 +50p');
  }

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    totalBonus += POINTS_POLICY.SET_BONUS.FULL_SET;
    bonusDetails.push('풀세트 구매 +100p');
  }

  // 수량 구매 보너스 (basic의 정책에 맞게 수정)
  const { SMALL, MEDIUM, LARGE } = POINTS_POLICY.BULK_PURCHASE_BONUS;

  if (itemCount >= LARGE.minQuantity) {
    totalBonus += LARGE.points;
    bonusDetails.push(`대량구매(${LARGE.minQuantity}개+) +${LARGE.points}p`);
  } else if (itemCount >= MEDIUM.minQuantity) {
    totalBonus += MEDIUM.points;
    bonusDetails.push(`대량구매(${MEDIUM.minQuantity}개+) +${MEDIUM.points}p`);
  } else if (itemCount >= SMALL.minQuantity) {
    totalBonus += SMALL.points;
    bonusDetails.push(`대량구매(${SMALL.minQuantity}개+) +${SMALL.points}p`);
  }

  return { totalBonus, bonusDetails };
};

// 총 포인트 계산
export const calculateTotalPoints = (
  cartItems: CartItem[],
  products: Product[],
  totalAmount: number,
  itemCount: number
) => {
  const basePoints = calculateBasePoints(totalAmount);

  if (basePoints === 0) {
    return { totalPoints: 0, pointsDetails: [] };
  }

  let finalPoints = basePoints;
  const pointsDetails: string[] = [`기본: ${basePoints}p`];

  // 화요일 2배 보너스
  if (isTuesday()) {
    finalPoints = basePoints * POINTS_POLICY.TUESDAY_MULTIPLIER;
    pointsDetails.push('화요일 2배');
  }

  // 세트 및 수량 보너스 계산
  const combination = getProductCombination(cartItems, products);
  const { totalBonus, bonusDetails } = calculateAllBonuses(combination, itemCount);

  finalPoints += totalBonus;
  pointsDetails.push(...bonusDetails);

  return { totalPoints: finalPoints, pointsDetails };
};
