export enum MerchantCategory {
  ALL = 'ALL',
  DINING = 'DINING',
  GROCERY = 'GROCERY',
  TRAVEL = 'TRAVEL',
  TRANSPORT = 'TRANSPORT',
  SHOPPING = 'SHOPPING',
  ONLINE = 'ONLINE',
  CAFE = 'CAFE',
  CONVENIENCE = 'CONVENIENCE',
  GAS = 'GAS'
}

export type BenefitType = 'PERCENTAGE' | 'COIN_SAVE';

export interface BenefitRule {
  category: MerchantCategory;
  type: BenefitType;
  rate?: number; // Percentage (e.g., 3.0 for 3%)
  minAmount?: number; // Minimum transaction amount for the rule to apply
  description?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  color: string;
  rules: BenefitRule[];
}

export interface CalculationResult {
  cardId: string;
  cardName: string;
  benefitAmount: number;
  appliedRule: BenefitRule;
}

// Helper to get a human-readable label for categories
export const getCategoryLabel = (category: MerchantCategory): string => {
  switch (category) {
    case MerchantCategory.ALL: return '전체 / 기본';
    case MerchantCategory.DINING: return '음식점';
    case MerchantCategory.GROCERY: return '대형마트';
    case MerchantCategory.TRAVEL: return '여행 / 항공';
    case MerchantCategory.TRANSPORT: return '대중교통 / 택시';
    case MerchantCategory.SHOPPING: return '쇼핑 / 백화점';
    case MerchantCategory.ONLINE: return '온라인 쇼핑';
    case MerchantCategory.CAFE: return '카페 / 베이커리';
    case MerchantCategory.CONVENIENCE: return '편의점';
    case MerchantCategory.GAS: return '주유소';
    default: return category;
  }
};