import React from 'react';
import { CreditCard } from '../types';
import { CreditCard as CardIcon, Coins } from 'lucide-react';

interface SimpleCardListProps {
  cards: CreditCard[];
}

export const SimpleCardList: React.FC<SimpleCardListProps> = ({ cards }) => {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.id} className="relative bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className={`${card.color} h-2 w-full`}></div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <div className="text-xs text-gray-500 font-medium">{card.issuer}</div>
                        <div className="font-bold text-gray-900">{card.name}</div>
                    </div>
                </div>
                
                <div className="mt-3 bg-gray-50 rounded-lg p-2.5">
                    {card.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                             {rule.type === 'COIN_SAVE' ? (
                                <Coins size={14} className="shrink-0 mt-0.5 text-blue-500" />
                             ) : (
                                <CardIcon size={14} className="shrink-0 mt-0.5 text-green-500" />
                             )}
                             <span>{rule.description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};