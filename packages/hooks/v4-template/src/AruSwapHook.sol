// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {Currency, CurrencyLibrary} from "v4-core/src/types/Currency.sol";

// Import CCTP interfaces
interface ITokenMessenger {
    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient, 
        address burnToken
    ) external returns (uint64);
}

contract AruSwapHook is BaseHook {
    using PoolIdLibrary for PoolKey;
    using CurrencyLibrary for Currency;

    // CCTP TokenMessenger contract
    ITokenMessenger public immutable tokenMessenger;
    address public immutable tokenMinter;
    
    // USDC token address that can be burned
    address public immutable usdcToken;

    // Constructor to initialize TokenMessenger and USDC addresses
    constructor(
        IPoolManager _poolManager,
        address _tokenMessenger,
        address _tokenMinter,
        address _usdcToken
    ) BaseHook(_poolManager) {
        require(_tokenMessenger != address(0), "Invalid TokenMessenger");
        tokenMessenger = ITokenMessenger(_tokenMessenger);
        tokenMinter = _tokenMinter;
        usdcToken = _usdcToken;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: true,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function afterSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external override returns (bytes4, int128) {
        // Parse hookData for cross-chain transfer parameters
        if (hookData.length > 0) {
            // Decode hookData (expected format: destinationDomain, mintRecipient)
            (uint32 destinationDomain, bytes32 mintRecipient) = abi.decode(
                hookData,
                (uint32, bytes32)
            );

            // Check if we're swapping for USDC (token0 or token1 depending on zeroForOne)
            bool isUSDCOutput = params.zeroForOne ? 
                Currency.unwrap(key.currency1) == usdcToken :
                Currency.unwrap(key.currency0) == usdcToken;

                // If USDC is the output token and we have a positive balance
             if (isUSDCOutput) {
                 // Get the USDC amount from the delta
                 int128 usdcDeltaAmount = delta.amount0();
              
                 // Only proceed if we have a positive USDC amount
                 if (usdcDeltaAmount > 0) {
                     uint256 usdcAmount = uint256(uint128(usdcDeltaAmount));
                  
                     // Get the USDC currency
                     Currency usdcCurrency = key.currency0;
                  
                     // Take USDC from pool manager to hook
                     poolManager.take(usdcCurrency, address(this), usdcAmount);
                  
                     // Approve CCTP to spend USDC
                     IERC20(usdcToken).approve(address(tokenMessenger), usdcAmount);
                  
                     // poolManager.sync(usdcCurrency);
                     // Initiate the cross-chain transfer
                     tokenMessenger.depositForBurn(
                         usdcAmount,
                         destinationDomain,
                         mintRecipient,
                         usdcToken
                     ); 
                     return (BaseHook.afterSwap.selector, -usdcDeltaAmount);
                     // Settle any remaining balances with the pool
                     // poolManager.settle();
                 }
             }
        }

        return (BaseHook.afterSwap.selector, 0);
    }
}

// Basic IERC20 interface for approval
interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
