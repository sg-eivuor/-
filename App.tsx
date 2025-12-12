import React, { useState } from 'react';
import { CreditCard, MerchantCategory } from './types';
import { Calculator } from './components/Calculator';
import { SimpleCardList } from './components/CardManager';
import { LayoutDashboard } from 'lucide-react';

// Specific configuration for the user's two cards
const MY_CARDS: CreditCard[] = [
  {
    id: 'the-more',
    name: '신한카드 The More',
    issuer: '신한카드',
    color: 'bg-purple-600',
    rules: [
        { 
          category: MerchantCategory.ALL, 
          type: 'COIN_SAVE', 
          minAmount: 5000,
          description: '5천원 이상 결제 시 천원 미만 단위 적립' 
        }
    ]
  },
  {
    id: 'digi-london',
    name: '디지로카 London',
    issuer: '롯데카드',
    color: 'bg-slate-800', // Dark elegant color for London
    rules: [
      { 
        category: MerchantCategory.ALL, 
        type: 'PERCENTAGE', 
        rate: 1.7, 
        description: '국내외 가맹점 1.7% 할인' 
      }
    ]
  }
];

const App: React.FC = () => {
  const [cards] = useState<CreditCard[]>(MY_CARDS);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SmartBenefit</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-xl mx-auto px-4 py-8 w-full space-y-8">
         <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
           
           {/* Section 1: Calculator */}
           <section>
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">얼마를 결제하시나요?</h1>
                <p className="text-gray-500">금액만 입력하면 최적의 카드를 찾아드립니다.</p>
             </div>
             <Calculator cards={cards} />
           </section>

           <div className="border-t border-gray-200 my-8"></div>

           {/* Section 2: My Cards Display */}
           <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">내 보유 카드</h2>
                <p className="text-sm text-gray-500">현재 등록된 카드 목록입니다.</p>
             </div>
             <SimpleCardList cards={cards} />
           </section>

         </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} SmartBenefit</p>
          <p className="mt-1 text-xs">The More & DigiLoca London Optimized</p>
        </div>
      </footer>
    </div>
  );
};

export default App;