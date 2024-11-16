import { useEffect, useState } from "react";
import { CowHookCreation, HookDappContext, initCoWHookDapp } from "@cowprotocol/hook-dapp-lib";

export const useCowHook = () => {
  const [context, setContext] = useState<HookDappContext | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [actions, setActions] = useState<any>(null);

  useEffect(() => {
    const { actions: hookActions, provider: hookProvider } = initCoWHookDapp({
      onContext: (_context: HookDappContext) => {
        setContext(_context);
      },
    });

    setProvider(hookProvider);
    setActions(hookActions);
  }, []);

  const addHook = (hookData: CowHookCreation) => {
    if (!actions) return;
    actions.addHook(hookData);
  };

  const updateTokens = (sellToken: string, buyToken: string) => {
    if (!actions) return;

    actions.setSellToken({ address: sellToken });
    actions.setBuyToken({ address: buyToken });
  };

  return {
    context,
    provider,
    addHook,
    updateTokens,
  };
};
