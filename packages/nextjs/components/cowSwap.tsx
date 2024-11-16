import React, { useEffect, useState } from 'react';
import { initCoWHookDapp, HookDappContext, CoWHookDappActions } from '@cowprotocol/hook-dapp-lib';
import { useAccount } from "wagmi";


const CALL_DATA = (account: string): string => `0x70a08231000000000000000000000000${account.slice(2)}`;

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
          target: '0xdef1ca1fb7fbcdc777520aa7f396b4e015f497ab', // COW token
          callData: CALL_DATA(context.account!),
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
