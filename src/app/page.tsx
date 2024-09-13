'use client';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import { useWallets } from '@privy-io/react-auth'; 
import { createWalletClient, custom } from 'viem';
import { gnosisChiado } from 'viem/chains';
import { Button, message as antdMessage } from 'antd';

export default function HomePage() {
  const { wallets } = useWallets(); 
  const [signature, setSignature] = useState<string | null>(null); 
  const [walletClient, setWalletClient] = useState<any | null>(null); 
  const [account, setAccount] = useState<string | null>(null); 

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        if (wallets.length > 0) {
          const wallet = wallets[0];
          const provider = await wallet.getEthereumProvider();

          const client = createWalletClient({
            chain: gnosisChiado,
            transport: custom(provider),
          });

          const [account] = await client.getAddresses();
          setWalletClient(client);
          setAccount(account);
        } else {
          console.log('No wallets found.');
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
        antdMessage.error('Failed to initialize wallet.');
      }
    };

    fetchWalletData();
  }, [wallets]); 

  const handleSignMessage = async () => {
    try {
      const messageToSign = 'This is a test message to sign on-chain';
      
      if (walletClient && account) {
       
        const signature_1 = await walletClient.signMessage({ 
          account,
          message: messageToSign,
        });

        setSignature(signature_1);
        antdMessage.success('Message signed successfully!');
      } else {
        antdMessage.error('Wallet client or account is not available.');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      antdMessage.error('Failed to sign message.');
    }
  };

  return (
    <div>
      <Header />

      <main style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the DApp</h1>
        <p>This is the main content of the page.</p>

        <Button 
          type="primary" 
          size="large" 
          onClick={handleSignMessage} 
          style={{ marginTop: '20px' }}
          disabled={!walletClient || !account}
        >
          Sign On-Chain Message
        </Button>

        {signature && (
          <div style={{ marginTop: '20px', wordBreak: 'break-word' }}>
            <h3>Signature:</h3>
            <p>{signature}</p>
          </div>
        )}
      </main>
    </div>
  );
}
