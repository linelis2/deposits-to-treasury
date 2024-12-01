import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface DepositFormProps {
  onDeposit: (amount: number) => Promise<void>;
  isDepositing: boolean;
}

export function DepositForm({ onDeposit, isDepositing }: DepositFormProps) {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    await onDeposit(Number(amount));
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Deposit Amount (TAIL)
        </label>
        <div className="relative">
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.000000001"
            placeholder="Enter amount"
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isDepositing}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isDepositing || !amount}
        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white font-semibold
          ${isDepositing || !amount 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700'
          } transition-colors`}
      >
        <Send className="w-5 h-5" />
        {isDepositing ? 'Depositing...' : 'Deposit TAIL'}
      </button>
    </form>
  );
}