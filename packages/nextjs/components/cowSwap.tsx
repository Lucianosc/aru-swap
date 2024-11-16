import React, { useEffect, useState } from 'react';
import { initCoWHookDapp, HookDappContext, CoWHookDappActions } from '@cowprotocol/hook-dapp-lib';
import { useAccount } from "wagmi";
import { generateCombinedCallData } from "~~/utils/cow-hook/cowGenerateHookData";

const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Address of the USDC contract in Sepolia
const cctpAddress = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5"; // Address of the CCTP's TokenMessenger contract in Sepolia
const amount = "10"; // Amount of USDC to approve and burn
const destinationDomain = 3; // Destination domain (e.g., the chain ID)
const destinationAddress = "0x0c558b655d388f7041bc4FbfbdF02AE1a605F19B"; // Change to msg.sender

const calldata = generateCombinedCallData(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress);
const cowshedAddress = "0x56b524AFA4A4d89B110075De9bC16d45b23F3ea9";



const CowHookDappComponent: React.FC = () => {
  const [context, setContext] = useState<HookDappContext | null>(null);
  const [actions, setActions] = useState<CoWHookDappActions | null>(null);
  

  useEffect(() => {
    const { actions, provider } = initCoWHookDapp({
      onContext: (_context) => setContext(_context),
    });

    setActions(actions);

    provider
      .request({ method: 'eth_chainId' })
      .then((chainId: string) => {
        console.log(`User is connected to a network with id=${chainId}`);
      })
      .catch((error: any) => console.error('Error fetching chain ID:', error));
  }, []);

  const handleActionButtonClick = () => {
    if (!context || !actions) {
      console.log('App is not loaded yet, please wait a bit.');
      return;
    }

    if (context.hookToEdit) {
      // Edit a hook
      actions.editHook({
        ...context.hookToEdit,
        hook: {
          ...context.hookToEdit.hook,
          gasLimit: '40000',
        },
      });
    } else {
      // Create a hook
      actions.addHook({
        hook: {
          target: usdcAddress, 
          callData: calldata[0], // USDC Aproval to cowshed
          gasLimit: '32000',
        },
      });
      actions.addHook({
        hook: {
          target: usdcAddress, // Send USDC to COWSHED
          callData: calldata[1],
          gasLimit: '32000',
        },
      });
      actions.addHook({
        hook: {
          target: usdcAddress, //Aprove USDC from cowshed to CCTP Token Messenger Contract
          callData: calldata[2],
          gasLimit: '32000',
        },
      });
      actions.addHook({
        hook: {
          target: cctpAddress, //Send from cowshed to CTTP Contract calling depositForBurn
          callData: calldata[3],
          gasLimit: '32000',
        },
      });
    }
  };

  return (
    <div>
      <button onClick={handleActionButtonClick}>Add or Edit Hook</button>
    </div>
  );
};

export default CowHookDappComponent;
