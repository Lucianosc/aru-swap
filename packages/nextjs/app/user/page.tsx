"use client";

import { useEffect, useState } from "react";
import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, decodeToken } from "@web3auth/single-factor-auth";
import { getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, UserCredential, getAuth, signInWithPopup } from "firebase/auth";
import RPC from "~~/services/web3/viem/RPC";

const clientId = "BIZBqC4L8bFWbdFjPwIeboE4Pj9aKyuSjuaT9ystH8SsjCK8Xn4xpVbZmBwe4lV_evcBgze_PRE5XXbqIYPcueg";

const verifier = "w3a-sfa-web-google";

const chainConfig = {
  chainId: "0xaa36a7",
  displayName: "Ethereum Sepolia Testnet",
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  tickerName: "Ethereum",
  ticker: "ETH",
  decimals: 18,
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

const firebaseConfig = {
  apiKey: "AIzaSyCa4PKNw-WMIYbfawIZG2JB9p2IfS31UV4",
  authDomain: "aru-swap.firebaseapp.com",
  projectId: "aru-swap",
  storageBucket: "aru-swap.firebasestorage.app",
  messagingSenderId: "557724170653",
  appId: "1:557724170653:web:6915d71f09054cbd929774",
  measurementId: "G-W5MK57FYN3",
};

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoginEnabled, enableLoginButton] = useState(false);

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        enableLoginButton(true);
        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          setProvider(web3auth.provider);
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth initialised yet");
      return;
    }
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    const { payload } = decodeToken(idToken);
    console.log(verifier, (payload as any).sub, idToken);

    const web3authProvider = await web3auth.connect({
      verifier,
      verifierId: (payload as any).sub,
      idToken,
    });
    console.log(web3authProvider);
    if (web3authProvider) {
      setLoggedIn(true);
      setProvider(web3authProvider);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button
      disabled={!isLoginEnabled}
      onClick={login}
      className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/25 w-full py-4 mt-5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg transition"
    >
      Web3Auth login
    </button>
  );

  return (
    <div className="text-white p-4">
      <div className="max-w-lg mx-auto mt-10">{loggedIn ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default App;
