"use client";

import { useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { Loader2 } from "lucide-react";
import WorldIDAuth from "~~/components/WorldIDAuth";

const clientId = "BIZBqC4L8bFWbdFjPwIeboE4Pj9aKyuSjuaT9ystH8SsjCK8Xn4xpVbZmBwe4lV_evcBgze_PRE5XXbqIYPcueg";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
};

const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function App() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  // const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<"worldId" | "web3Auth">();
  const [userInfo, setUserInfo] = useState<any>();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        setIsInitializing(true);
        const web3authInstance = new Web3Auth(web3AuthOptions);

        await web3authInstance.initModal();

        if (web3authInstance.connected) {
          setLoggedIn("web3Auth");
          // setProvider(web3authInstance.provider);
          const user = await web3authInstance.getUserInfo();
          setUserInfo(user);
        }

        setWeb3auth(web3authInstance);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();

    // Cleanup function
    return () => {
      if (web3auth && web3auth.connected) {
        web3auth.logout();
      }
    };
  }, []);

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      // setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn("web3Auth");
        const user = await web3auth.getUserInfo();
        setUserInfo(user);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    // setProvider(null);
    setLoggedIn(undefined);
    setUserInfo(undefined);
    uiConsole("logged out");
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  if (isInitializing) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="flex flex-col gap-2 justify-center items-center bg-gray-800/50 rounded-3xl p-4 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-4">
      <div className="max-w-lg mx-auto mt-10">
        <div className="flex flex-col gap-4 justify-center items-center bg-gray-800/50 rounded-3xl p-4 backdrop-blur-sm">
          {loggedIn === "web3Auth" ? (
            <>
              <h1 className="text-3xl">{userInfo?.name}</h1>
              <h2 className="text-xl mb-0">Verified by {capitalizeFirstLetter(userInfo?.verifier)}</h2>
              <h2 className="text-xl ">with {capitalizeFirstLetter(userInfo?.typeOfLogin)} Account</h2>
              <button
                onClick={logout}
                className="max-w-32 bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 w-full py-2 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {!(loggedIn === "worldId") && (
                <button
                  onClick={login}
                  className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition"
                >
                  Web3Auth social login
                </button>
              )}
              <WorldIDAuth onSuccess={() => setLoggedIn("worldId")} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
