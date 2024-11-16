import { abiTokenMessenger } from "./abiCCTP";
import abiUSDC from "./abiUSDC";
import { encodeAbiParameters, encodeFunctionData, parseAbiParameters } from "viem";
import { ethers, MaxUint256 } from "ethers";

import { Order, OrderBalance, OrderKind } from '@cowprotocol/contracts';
import {
    ABI_CODER,
    USDC,
    VAULT_RELAYER,
    WEIROLL_ADDRESS,
    WETH,
    approveToken,
    createOrder,
    estimateGasForExecuteHooks,
    fnCalldata,
    fnSelector,
    getTokenBalance,
    mockUsdcBalance,
    resolveName,
    settleOrder,
    withAnvilProvider,
    wrapEther,
  } from './common';
  import { CowShedSdk, ICall } from '../ts';

  import {
    CallType,
    END_OF_ARGS,
    encodeCommand,
    encodeFlag,
    encodeInput,
    encodeInputArg,
    encodeWeirollExecuteCall,
  } from './weiroll';
  import { hexZeroPad } from 'ethers/lib/utils';

const cctpAddress = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5"; // Address of the CCTP's TokenMessenger contract in Sepolia

// Sign the transaction
const privateKey = ""; // your private key
const wallet = new ethers.Wallet(privateKey);


// Approve USDC for spending by the CCTP contract
const encodeApproveUSDCCowShed = (cowshedAddress: string, amount: string) => {
    return encodeFunctionData({
      abi: abiUSDC,
      functionName: "approve",
      args: [cowshedAddress, amount],
    });
  };

const encodeApproveUSDCSender = (sender: string, amount: string) => {
    return encodeFunctionData({
      abi: abiUSDC,
      functionName: "approve",
      args: [sender, amount],
    });
  };



// Approve USDC for spending by the CCTP contract
const sendUSDCtoCowShed = (senderAddress:string, cowshedAddress: string, amount: string) => {
    const cctpAddressA = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5"; // Address of the CCTP's TokenMessenger contract in Sepolia

    return encodeFunctionData({
      abi: abiUSDC,
      functionName: "transferFrom",
      args: [senderAddress, cowshedAddress, amount],
    });
  };

// Approve USDC for spending by the CCTP contract
const encodeApproveUSDC = (cctpAddress: string, amount: string) => {
  return encodeFunctionData({
    abi: abiUSDC,
    functionName: "approve",
    args: [cctpAddress, amount],
  });
};


const getBurnTransactionCalldata = (
    usdcAddress: string,
    cctpAddress: string,
    amount: string,
    destinationDomain: number,
    destinationAddress: string
  ) => {
    const burnData = encodeBurnUSDC(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress);
    console.log("Burn transaction calldata:", burnData);
    return burnData;
  };
// Burn USDC by sending to the CCTP contract
const encodeBurnUSDC = (
  usdcAddress: string,
  cctpAddress: string,
  amount: string,
  destinationDomain: number,
  destinationAddress: string,
) => {
  // Encode the destination address as bytes32
  //const encodedDestinationAddress = `0x${Buffer.from(destinationAddress.slice(2), 'hex').toString('hex').padStart(64, '0')}`;
  //This is ok
  const encodedMintRecipient = `0x${destinationAddress.slice(2).padStart(64, "0")}`; // Ensure the address is 40 characters long
  console.log("encodedDestinationAddress", encodedMintRecipient);
  //await burnUSDC(provider, usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress, signer);

  return encodeFunctionData({
    abi: abiTokenMessenger,
    functionName: "depositForBurn",
    args: [amount, destinationDomain, encodedMintRecipient, usdcAddress],
  });
};

async function executeCCTPFunction() {
    const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
    const cctpAddress = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5";
    const amount = "10";
    const destinationDomain = 3;
    const destinationAddress = "0x0c558b655d388f7041bc4FbfbdF02AE1a605F19B";
    const cowshedAddress = "0x56b524AFA4A4d89B110075De9bC16d45b23F3ea9";

    // Create a wallet instance
    const privateKey = "";
    const wallet = new ethers.Wallet(privateKey);
    const userAddr = await wallet.getAddress();

    // const factory = "0xYourFactoryAddressHere"; // Replace with the actual factory address
    // const implementation = "0xYourImplementationAddressHere"; // Replace with the actual implementation address
    // const proxyInitCode = "0xYourProxyInitCodeHere"; // Replace with the actual proxy initialization code

    // Initialize CowShedSdk
    const shedSdk = new CowShedSdk({
        factoryAddress: cowshedAddress,
        implementationAddress: cctpAddress,
        chainId: 6,
    });

    // Compute the proxy address
    const proxyAddress = shedSdk.computeProxyAddress(userAddr);
    console.log('Computed proxy address for user', userAddr, 'is', proxyAddress);

    // Encode the burn data
    const burnData = encodeBurnUSDC(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress);

    // // Construct the transaction
    // const tx = {
    //     to: cctpAddress,
    //     data: burnData,
    //     from: cowshedAddress,
    // };

    // // Sign the transaction
    // const signedTx = await wallet.signTransaction(tx);

    // Prepare the hooks
    const calls: ICall[] = [
        {
            target: cctpAddress,
            callData: burnData,
            value: 0n,
            isDelegateCall: false,
            allowFailure: false,
        }
    ];

    const nonce = ethers.encodeBytes32String('first');
    const validTo = Math.floor(new Date().getTime() / 1000) + 7200;

    // Signing the hooks intent
    const hashToSign = shedSdk.hashToSignWithUser(
        calls,
        nonce,
        BigInt(validTo),
        userAddr
    );
    console.log('hash to sign', hashToSign);
    const signature = wallet.signingKey.sign(hashToSign);
    console.log('actual signature', signature.r, signature.s, signature.v);
    const encodedSignature = CowShedSdk.encodeEOASignature(
        BigInt(signature.r),
        BigInt(signature.s),
        signature.v
    );

    // Encode hooks for factory
    const hooksCalldata = CowShedSdk.encodeExecuteHooksForFactory(
        calls,
        nonce,
        BigInt(validTo),
        userAddr,
        encodedSignature
    );

    console.log("Calldata for hook:", hooksCalldata);

    return hooksCalldata;

    // Optionally, send the transaction using a provider or signer
    // Example: await provider.sendTransaction(tx);
}


// Function to combine both calldata (approve + burn) into a single transaction
const generateCombinedCallData = (
  usdcAddress: string,
  cctpAddress: string,
  amount: string,
  destinationDomain: number,
  destinationAddress: string,
) => {
    const cowshedAddress = "0x56b524AFA4A4d89B110075De9bC16d45b23F3ea9";
    const sender = "0x0c558b655d388f7041bc4FbfbdF02AE1a605F19B";


    const approveCowShed= encodeApproveUSDCCowShed(cowshedAddress, amount);
    const aproveUSDCSender= encodeApproveUSDCSender(sender, amount);

    encodeApproveUSDCSender
    const sendUSDCCowShed= sendUSDCtoCowShed(sender, cowshedAddress, '9');


    const approveCCTP = encodeApproveUSDC(cctpAddress, amount); //this the signer needs to be the cowshed

    console.log("approveData: ", approveCCTP);

    const burnData = encodeBurnUSDC(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress); //this need to be executed from the cowshed
    console.log("burn: ", burnData);

    console.log('approveCowShed',approveCowShed)
    console.log('aproveUSDCSender',aproveUSDCSender)
    console.log('sendUSDCCowShed',sendUSDCCowShed)
    console.log('approveCCTP',approveCCTP)
    console.log('burnData',burnData)
    console.log('tx', executeCCTPFunction())

  // Combine both calls into a single calldata
  //return approveData + burnData.slice(2); // Remove the leading "0x" from burnData
  return [approveCowShed,sendUSDCCowShed, approveCCTP, burnData] ;
};

export { generateCombinedCallData };
