import React from 'react';
import { Wallet } from 'lucide-react';

interface WalletButtonProps {
  connected: boolean;
  publicKey: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({ connected, publicKey, onConnect, onDisconnect }: WalletButtonProps) {
  return (
    <button
      onClick={connected ? onDisconnect : onConnect}
      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
    >
      <Wallet className="w-5 h-5" />
      {connected ? (
        <span className="font-mono">
          {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}