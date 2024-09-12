'use client';
import { usePrivy } from "@privy-io/react-auth";
import { Button, Card } from 'antd'; 
import { useEffect, useState } from 'react';
export default function Header() {
  const { user, login, logout } = usePrivy();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {


    if (user && user.wallet?.address) {
      const wallet = user.wallet.address;
      const formattedWalletAddress = wallet.startsWith('0x') ? wallet : `0x${wallet}`;
      setWalletAddress(formattedWalletAddress);
    }
    return () => {
      setWalletAddress(null);
    };
  }, [user]);

  return (
    <Card style={{ maxWidth: "400px", padding: "20px" }}>
      {user ? (
        <>
          <h3>Connected as: {walletAddress}</h3>
          <Button
            size="large"
            onClick={() => logout()}
            type="primary"
            danger
            style={{
              color: 'black'
            }}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          size="large"
          onClick={() => {
            if (!user) {
              login();
            }
          }}
          type="primary"
          style={{
            color: 'white'
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Card>
  );
}
