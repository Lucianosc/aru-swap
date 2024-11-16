// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolSwapTest} from "v4-core/src/test/PoolSwapTest.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";

import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

contract SwapScript is Script, Constants, Config {
    // slippage tolerance to allow for unlimited price impact
    uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////

    // --- pool configuration --- //
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;

    // --- cross-chain configuration --- //
    uint32 destinationDomain = 1; // destination chain domain ID
    address recipient = address(0x81d786b35f3EA2F39Aa17cb18d9772E4EcD97206); // recipient address on destination chain

    function run() external {
        PoolKey memory pool = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: hookContract
        });

        // approve tokens to the swap router
        vm.broadcast();
        token0.approve(address(swapRouter), type(uint256).max);
        vm.broadcast();
        token1.approve(address(swapRouter), type(uint256).max);

        // Approve hook to spend USDC
        vm.broadcast();
        token0.approve(address(hookContract), type(uint256).max);

        // ------------------------------ //
        // Swap 100e18 token1 into USDC and bridge //
        // ------------------------------ //
        bool zeroForOne = false; // swap token1 for USDC (assuming USDC is token0)
        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: -1e18,
            sqrtPriceLimitX96: zeroForOne ? MIN_PRICE_LIMIT : MAX_PRICE_LIMIT // unlimited impact
        });

        PoolSwapTest.TestSettings memory testSettings =
            PoolSwapTest.TestSettings({takeClaims: false, settleUsingBurn: false});

        // Prepare cross-chain transfer parameters
        bytes32 mintRecipient = bytes32(uint256(uint160(recipient)));
        bytes memory hookData = abi.encode(destinationDomain, mintRecipient);

        vm.broadcast();
        swapRouter.swap(pool, params, testSettings, hookData);
    }
}
