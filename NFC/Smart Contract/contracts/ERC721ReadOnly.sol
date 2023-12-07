// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/**
 * An implementation of 721 that's publicly readonly (no approvals or transfers exposed).
 */

contract ERC721ReadOnly is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    function initialize(string memory name_, string memory symbol_) public virtual initializer {
        __ERC721_init(name_, symbol_);
        __Ownable_init();
    }

    function approve(address to, uint256 tokenId) public virtual override {
        revert("ERC721 public approve not allowed");
    }

    function getApproved(uint256 tokenId) public view virtual override returns (address) {
        require(_exists(tokenId), "ERC721: invalid token ID");
        return address(0);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override {
        revert("ERC721 public setApprovalForAll not allowed");
    }

    function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
        return false;
    }

    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("ERC721 public transferFrom not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override {
        revert("ERC721 public safeTransferFrom not allowed");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override {
        revert("ERC721 public safeTransferFrom not allowed");
    }
}