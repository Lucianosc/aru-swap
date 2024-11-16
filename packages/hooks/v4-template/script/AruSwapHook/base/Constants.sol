// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {ITokenMessenger} from "../../../src/AruSwapHook.sol";
/// @notice Shared constants used in scripts
// https://docs.uniswap.org/contracts/v4/deployments#sepolia-11155111
contract Constants {
    address constant CREATE2_DEPLOYER = address(0x4e59b44847b379578588920cA78FbF26c0B4956C); // https://createx.rocks/
    
    IPoolManager constant POOLMANAGER = IPoolManager(address(0x8C4BcBE6b9eF47855f97E675296FA3F6fafa5F1A));
    PositionManager constant posm = PositionManager(payable(address(0x1B1C77B606d13b09C84d1c7394B96b147bC03147)));
    IAllowanceTransfer constant PERMIT2 = IAllowanceTransfer(address(0x000000000022D473030F116dDEE9F6B43aC78BA3));
    PoolSwapTest constant swapRouter = PoolSwapTest(address(0xe49d2815C231826caB58017e214Bed19fE1c2dD4));
    
    // Address for TokenMessenger contract - should be set in Constants or configured here
    // https://developers.circle.com/stablecoins/evm-smart-contracts
    ITokenMessenger constant tokenMessenger = ITokenMessenger(address(0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5));
    address constant tokenMinter = address(0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A);
}
