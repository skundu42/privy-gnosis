import { createWalletClient, custom } from 'viem';
import { gnosisChiado } from 'viem/chains';

export const initializeWalletClient = async (wallets: string | any[]) => {
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
    console.log("No wallets found.");
    throw new Error('No wallets found.');
  }
};
