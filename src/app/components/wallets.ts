import { useWallets } from '@privy-io/react-auth';
import { createWalletClient, custom } from 'viem';
import { gnosisChiado } from 'viem/chains';

export const initializeWalletClient = async () => {
  const { wallets } = useWallets(); 

  if (wallets.length > 0) {
    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();

    const walletClient = createWalletClient({
      chain: gnosisChiado,
      transport: custom(provider),
    });

    const [account] = await walletClient.getAddresses();

    return {
      walletClient,
      account,
    };
  } else {
    throw new Error('No wallets found.');
  }
};

