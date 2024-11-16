// ~/utils/cow-hook/cowBuildData.ts
import { generateCombinedCallData } from "./cowGenerateHookData";

const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Address of the USDC contract in Sepolia
const cctpAddress = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5"; // Address of the CCTP's TokenMessenger contract in Sepolia
const amount = "10"; // Amount of USDC to approve and burn
const destinationDomain = 3; // Destination domain (e.g., the chain ID)
const destinationAddress = "0x0c558b655d388f7041bc4FbfbdF02AE1a605F19B"; // Change to msg.sender

const calldata = generateCombinedCallData(usdcAddress, cctpAddress, amount, destinationDomain, destinationAddress);

console.log("Combined calldata:", calldata);

export default calldata;
