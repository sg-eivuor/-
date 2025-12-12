import { GoogleGenAI, Type } from "@google/genai";
import { BenefitRule, MerchantCategory } from "../types";

// Fix: Use import.meta.env for Vite, or fallback to empty string to prevent "process is not defined" error in browser
const apiKey = import.meta.env?.VITE_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const parseCardBenefits = async (text: string): Promise<BenefitRule[]> => {
  if (!apiKey || !ai) {
    console.warn("API Key is missing or AI not initialized");
    return [];
  }

  const prompt = `
    Analyze the credit card benefit text provided below (in Korean) and extract the benefit rules into a structured JSON format.
    
    Map the benefits to the following standardized categories:
    - ALL (Base rate for everything else / 전월 실적 조건 없는 기본 적립 등)
    - DINING (Restaurants, food / 음식점)
    - GROCERY (Supermarkets, marts / 이마트, 홈플러스 등 대형마트)
    - TRAVEL (Hotels, flights / 여행, 항공)
    - TRANSPORT (Bus, subway, taxi / 대중교통, 택시)
    - SHOPPING (Department stores, retail / 백화점, 아울렛)
    - ONLINE (Online shopping, e-commerce / 쿠팡, 네이버쇼핑, 11번가 등)
    - CAFE (Coffee shops, bakeries / 스타벅스, 커피빈 등)
    - CONVENIENCE (Convenience stores / 편의점)
    - GAS (Gas stations / 주유소)

    Benefit Types:
    - 'PERCENTAGE': Standard discount or point accumulation rate (e.g., 1%, 0.7%).
    - 'COIN_SAVE': "Change savings" logic. Specifically for benefits like "Save amount less than 1000 KRW" (천원 미만 잔돈 적립).

    Rules:
    1. If a benefit implies "All merchants" or "Base accumulation" (전 가맹점, 기본 적립), map to ALL.
    2. Determine 'type':
       - If text says "천원 미만 적립", "잔돈 적립" or "Save change < 1000", set 'type' to 'COIN_SAVE'.
       - Otherwise, set 'type' to 'PERCENTAGE'.
    3. Determine 'rate' (only for PERCENTAGE):
       - 1.5% -> 1.5
       - 1000원당 1점 -> 0.1
    4. Determine 'minAmount' (Optional condition):
       - If text says "5000원 이상 결제 시" (Payments over 5000), set 'minAmount' to 5000.
    5. The 'description' should be a short summary in Korean.

    Text to analyze: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: {
                type: Type.STRING,
                enum: Object.values(MerchantCategory),
                description: "The standardized merchant category."
              },
              type: {
                type: Type.STRING,
                enum: ['PERCENTAGE', 'COIN_SAVE'],
                description: "The type of benefit."
              },
              rate: {
                type: Type.NUMBER,
                description: "The benefit rate in percentage (for PERCENTAGE type)."
              },
              minAmount: {
                type: Type.NUMBER,
                description: "Minimum transaction amount required (e.g., 5000)."
              },
              description: {
                type: Type.STRING,
                description: "Short original description of the benefit in Korean."
              }
            },
            required: ["category", "type"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BenefitRule[];
    }
    return [];
  } catch (error) {
    console.error("Failed to parse card benefits with Gemini:", error);
    throw error;
  }
};

export const suggestCategory = async (merchantName: string): Promise<MerchantCategory> => {
    if (!apiKey || !ai) return MerchantCategory.ALL;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Classify the merchant "${merchantName}" (which is likely a Korean business) into one of these categories: ${Object.values(MerchantCategory).join(', ')}. 
            
            Examples:
            - 스타벅스, 이디야 -> CAFE
            - 쿠팡, 11번가, 네이버페이 -> ONLINE
            - GS25, CU -> CONVENIENCE
            - 이마트, 홈플러스 -> GROCERY
            - 식당이름 -> DINING
            - KTX, 카카오택시 -> TRANSPORT
            
            Return ONLY the category enum string. If unsure, return ALL.`,
            config: {
                responseMimeType: "text/plain",
            }
        });
        
        const text = response.text?.trim().toUpperCase();
        if (text && Object.values(MerchantCategory).includes(text as MerchantCategory)) {
            return text as MerchantCategory;
        }
        return MerchantCategory.ALL;
    } catch (e) {
        console.error("Category suggestion failed", e);
        return MerchantCategory.ALL;
    }
}