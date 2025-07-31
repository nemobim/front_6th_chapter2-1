import type { ProductStateConfig } from '../types';

// 상품 상태 설정
export const PRODUCT_STATE_CONFIG = {
  SALE_AND_RECOMMEND: {
    badge: '⚡��',
    color: 'text-purple-600',
  },
  SALE_ONLY: {
    badge: '⚡',
    color: 'text-red-500',
  },
  RECOMMEND_ONLY: {
    badge: '��',
    color: 'text-blue-500',
  },
  DEFAULT: {
    badge: '',
    color: '',
  },
} as const;

// 상품 옵션 텍스트 템플릿
export const PRODUCT_OPTION_TEMPLATES = {
  OUT_OF_STOCK: (name: string, price: number, badgeText: string) => `${name} - ${price}원 (품절)${badgeText}`,
  SUPER_SALE: (name: string, originalPrice: number, price: number) =>
    `⚡${name} - ${originalPrice}원 → ${price}원 (25% SUPER SALE!)`,
  SALE: (name: string, originalPrice: number, price: number) =>
    `⚡${name} - ${originalPrice}원 → ${price}원 (20% SALE!)`,
  RECOMMENDED: (name: string, originalPrice: number, price: number) =>
    `${name} - ${originalPrice}원 → ${price}원 (5% 추천할인!)`,
  DEFAULT: (name: string, price: number, badgeText: string) => `${name} - ${price}원${badgeText}`,
} as const;

// 상품 스타일 클래스
export const PRODUCT_STYLE_CLASSES = {
  OUT_OF_STOCK: 'text-gray-400',
  SALE_AND_RECOMMEND: 'text-purple-600 font-bold',
  SALE_ONLY: 'text-red-500 font-bold',
  RECOMMEND_ONLY: 'text-blue-500 font-bold',
  DEFAULT: '',
} as const;
