import React, { useState, useMemo } from 'react';
import { CreditCard, CalculationResult } from '../types';
import { Calculator as CalcIcon, Sparkles, Coins, CreditCard as CardIcon } from 'lucide-react';

interface CalculatorProps {
  cards: CreditCard[];
}

export const Calculator: React.FC<CalculatorProps> = ({ cards }) => {
  const [amount, setAmount] = useState<string>('');

  const results: CalculationResult[] = useMemo(() => {
    if (!amount || isNaN(Number(amount))) return [];
    
    const value = Number(amount);

    return cards.map(card => {
      // Since we removed categories, we just take the first rule (ALL)
      const ruleToUse = card.rules[0];
      
      let benefit = 0;

      if (ruleToUse.type === 'COIN_SAVE') {
          // Strict logic for The More: Must be >= 5000
          const minRequired = ruleToUse.minAmount || 5000;
          if (value >= minRequired) {
              benefit = value % 1000;
              // If exactly multiple of 1000 (remainder 0), benefit is 0.
              // Logic Note: The More usually gives double points for some merchants, 
              // but user requested basic separation.
          } else {
            benefit = 0;
          }
      } else {
          // Simple percentage logic for DigiLondon
          benefit = Math.floor(value * ((ruleToUse.rate || 0) / 100));
      }
      
      return {
        cardId: card.id,
        cardName: card.name,
        benefitAmount: benefit,
        appliedRule: ruleToUse
      };
    }).sort((a, b) => {
        // Sort by benefit amount descending
        if (b.benefitAmount !== a.benefitAmount) {
            return b.benefitAmount - a.benefitAmount;
        }
        // If benefits are equal (e.g. both 0), prefer Percentage card as it's more reliable usually? 
        // Or just stable sort.
        return 0;
    });

  }, [amount, cards]);

  const bestResult = results.length > 0 ? results[0] : null;

  return (
    <div className="space-y-6">
      {/* Simplified Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-4 pr-16 py-4 bg-gray-50 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-3xl font-bold text-right tracking-tight text-gray-900 placeholder-gray-300"
              placeholder="0"
              autoFocus
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xl">원</span>
          </div>
          <div className="mt-3 flex justify-end gap-2">
             {[10000, 50000, 100000].map(val => (
                 <button 
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                 >
                    +{val.toLocaleString()}
                 </button>
             ))}
          </div>
      </div>

      {/* Results Section */}
      {amount && results.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
            
            {/* Best Option Card */}
            {bestResult && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-yellow-400 font-bold text-sm tracking-wide">최고의 선택</span>
                    </div>
                    
                    <div className="flex justify-between items-end mb-6">
                        <h1 className="text-2xl font-bold leading-tight">{bestResult.cardName}</h1>
                        <div className="text-right shrink-0 ml-4">
                            <div className="text-gray-400 text-xs mb-1">예상 혜택</div>
                            <div className="text-3xl font-bold text-green-400 tracking-tight">
                                +{bestResult.benefitAmount.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                        <div className="flex items-center gap-2 text-sm text-gray-200">
                            {bestResult.appliedRule.type === 'COIN_SAVE' ? (
                                <>
                                    <Coins size={16} className="text-blue-300" />
                                    <span>잔돈 적립 적용 (5,000원 이상)</span>
                                </>
                            ) : (
                                <>
                                    <CardIcon size={16} className="text-green-300" />
                                    <span>1.7% 할인 적용</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Comparison List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="divide-y divide-gray-100">
                   {results.map((result, idx) => (
                       <div key={result.cardId} className={`p-4 flex items-center justify-between ${idx === 0 ? 'bg-blue-50/30' : ''}`}>
                           <div className="flex items-center gap-3">
                               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                   {idx + 1}
                               </div>
                               <div>
                                   <div className="font-semibold text-gray-800 text-sm">{result.cardName}</div>
                               </div>
                           </div>
                           <div className="flex items-center gap-2">
                               <span className={`font-bold ${idx === 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                   {result.benefitAmount.toLocaleString()}원
                               </span>
                           </div>
                       </div>
                   ))}
               </div>
            </div>
        </div>
      )}
      
      {!amount && (
         <div className="text-center py-12 text-gray-400">
            <Coins size={48} className="mx-auto mb-3 opacity-10" />
            <p className="text-sm">결제 금액을 입력해주세요</p>
         </div>
      )}
    </div>
  );
};