import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { HELIUS_RPC_URL, TAIL_TOKEN_ADDRESS, LOBBY_WALLET_ADDRESS } from '../config/constants';
import { createTransferInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const getProvider = () => {
  if ('phantom' in window) {
    const provider = (window as any).phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }

  window.open('https://phantom.app/', '_blank');
};

export const connectWallet = async () => {
  try {
    const provider = getProvider();
    const response = await provider.connect();
    return response.publicKey.toString();
  } catch (err) {
    console.error('Error connecting wallet:', err);
    throw err;
  }
};

export const disconnectWallet = async () => {
  try {
    const provider = getProvider();
    await provider.disconnect();
  } catch (err) {
    console.error('Error disconnecting wallet:', err);
    throw err;
  }
};

export const getBalance = async (publicKey: string) => {
  try {
    const connection = new Connection(HELIUS_RPC_URL);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(LOBBY_WALLET_ADDRESS),
      { mint: new PublicKey(TAIL_TOKEN_ADDRESS) }
    );

    if (tokenAccounts.value.length === 0) {
      return 0;
    }

    const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    return balance;
  } catch (err) {
    console.error('Error fetching balance:', err);
    throw err;
  }
};

export const depositTail = async (amount: number, fromPublicKey: string) => {
  try {
    const provider = getProvider();
    const connection = new Connection(HELIUS_RPC_URL);
    
    const fromPubkey = new PublicKey(fromPublicKey);
    const toPubkey = new PublicKey(LOBBY_WALLET_ADDRESS);
    const mintPubkey = new PublicKey(TAIL_TOKEN_ADDRESS);

    // Get the associated token accounts for both wallets
    const fromATA = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
    const toATA = await getAssociatedTokenAddress(mintPubkey, toPubkey);

    // Create the transfer instruction for SPL tokens
    const transferInstruction = createTransferInstruction(
      fromATA,
      toATA,
      fromPubkey,
      amount * LAMPORTS_PER_SOL // Convert to raw amount
    );

    // Create and populate the transaction
    const transaction = new Transaction().add(transferInstruction);

    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fromPubkey;

    // Sign and send the transaction
    const signed = await provider.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature);

    return signature;
  } catch (err) {
    console.error('Error depositing TAIL:', err);
    throw err;
  }
};