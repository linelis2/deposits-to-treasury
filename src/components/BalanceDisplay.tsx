import React from 'react';
import { Coins } from 'lucide-react';

interface BalanceDisplayProps {
  balance: number | null;
  isLoading: boolean;
}

export function BalanceDisplay({ balance, isLoading }: BalanceDisplayProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <Coins className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-800">Treasury Balance</h2>
      </div>
      {isLoading ? (
        <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
      ) : (
        <p className="text-3xl font-bold text-purple-600">
          {balance === null ? '--' : balance.toLocaleString()} TAIL
        </p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        Treasury Address: {`EBTv...Q64F`}
      </p>
    </div>
  );
}