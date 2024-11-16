// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
}

interface ITokenMessenger {
    function depositForBurn(
        uint256 amount,
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
    ) external returns (uint64);
}

contract BridgeCCTPScript is Script, Constants, Config {
    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////
    
    uint256 public constant AMOUNT_TO_BRIDGE = 100; // Amount of USDC to bridge
    uint32 public constant DESTINATION_DOMAIN = 6; // destination chain domain ID
    address public constant RECIPIENT = address(0xb01DB4A1AF9bA5001676Fc60f05D1833746f2460); // Replace with actual recipient address

    function run() external {
        // Convert recipient address to bytes32 format required by CCTP
        bytes32 mintRecipient = bytes32(uint256(uint160(RECIPIENT)));

        // Approve USDC to token messenger
        vm.broadcast();
        IERC20(address(token0)).approve(address(tokenMessenger), type(uint256).max);

        // Bridge USDC using CCTP
        vm.broadcast();
        tokenMessenger.depositForBurn(
            AMOUNT_TO_BRIDGE,
            DESTINATION_DOMAIN,
            mintRecipient,
            address(token0)
        );
    }
}
