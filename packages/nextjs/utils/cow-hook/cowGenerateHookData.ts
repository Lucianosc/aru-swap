import { encodeFunctionData } from 'viem';
import abiUSDC from './abiUSDC';
import {abiTokenMessenger} from './abiCCTP'

// Approve USDC for spending by the CCTP contract
const encodeApproveUSDC = (usdcAddress: string, cctpAddress: string, amount: string) => {   

  return encodeFunctionData({
    abi: abiUSDC,
    functionName: 'approve',
    args: [cctpAddress, amount],
  });
};

// Burn USDC by sending to the CCTP contract
 const encodeBurnUSDC = (usdcAddress: string, cctpAddress: string, amount: string, destinationDomain: number, destinationAddress: string) => {
  
  // Encode the destination address as bytes32
  const encodedDestinationAddress = `0x${Buffer.from(destinationAddress.slice(2), 'hex').toString('hex').padStart(64, '0')}`;

  //await burnUSDC(provider, usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress, signer);

  return encodeFunctionData({
    abi: abiTokenMessenger,
    functionName: 'depositForBurn',
    args: [amount, destinationDomain, encodedDestinationAddress, usdcAddress],
  });
 };

// Function to combine both calldata (approve + burn) into a single transaction
const generateCombinedCallData = (
  usdcAddress: string,
  cctpAddress: string,
  amount: string,
  destinationDomain: number,
  destinationAddress: string
) => {
  const approveData = encodeApproveUSDC(usdcAddress, cctpAddress, amount);
  const burnData = encodeBurnUSDC(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress);

  // Combine both calls into a single calldata
  //return approveData + burnData.slice(2); // Remove the leading "0x" from burnData
    return approveData + burnData.slice(2);
};

export { generateCombinedCallData };
