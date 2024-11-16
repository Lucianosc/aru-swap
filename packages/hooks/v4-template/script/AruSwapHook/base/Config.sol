// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    // USDC
    IERC20 constant token0 = IERC20(address(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238)); // https://developers.circle.com/stablecoins/usdc-on-test-networks usdc 
    // TEST_TOKEN
    IERC20 constant token1 = IERC20(address(0x34182d56d905a195524a8F1813180C134687ca34));
    // https://sepolia.etherscan.io/tx/0xd0c026c0b843d4406818f6f13322635d2d583d1269bf04a63376142b209891e6
    IHooks constant hookContract = IHooks(address(0xa3EC8Bf389cbFB9f74412E5c320EB84C5865C040));

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
