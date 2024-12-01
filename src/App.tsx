import React, { useState, useCallback, useEffect } from 'react';
import { WalletButton } from './components/WalletButton';
import { BalanceDisplay } from './components/BalanceDisplay';
import { DepositForm } from './components/DepositForm';
import { connectWallet, disconnectWallet, getBalance, depositTail } from './utils/phantom';

function App() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const handleConnect = async () => {
    try {
      const walletPublicKey = await connectWallet();
      setPublicKey(walletPublicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setPublicKey(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    try {
      const tokenBalance = await getBalance(publicKey || '');
      setBalance(tokenBalance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  const handleDeposit = async (amount: number) => {
    if (!publicKey) return;

    setIsDepositing(true);
    try {
      await depositTail(amount, publicKey);
      await fetchBalance();
    } catch (error) {
      console.error('Failed to deposit TAIL:', error);
    } finally {
      setIsDepositing(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TAIL Treasury</h1>
          <p className="text-gray-600">Connect your Phantom wallet to deposit TAIL tokens</p>
        </div>

        <div className="flex justify-center">
          <WalletButton
            connected={!!publicKey}
            publicKey={publicKey}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>

        <BalanceDisplay
          balance={balance}
          isLoading={isLoading}
        />

        {publicKey && (
          <DepositForm
            onDeposit={handleDeposit}
            isDepositing={isDepositing}
          />
        )}
      </div>
    </div>
  );
}

export default App;