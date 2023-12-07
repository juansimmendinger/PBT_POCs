// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.11;

contract BellToAlangoV2 {
    uint256 private constant VERSION = 2;

    function contractVersion() external pure returns (uint8) {
        return uint8(VERSION);
    }
}