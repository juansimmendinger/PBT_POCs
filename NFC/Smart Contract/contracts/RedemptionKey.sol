// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RedemptionKey is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _tokenId;
    uint256 private _maxSupply = 11;

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) public _ownedTokens;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return _tokenURIs[tokenId];
    }

    function ownerOf(
        uint256 tokenId
    ) public view virtual override returns (address) {
        address owner = _ownerOf(tokenId);
        require(
            owner != address(0),
            "ERC721: owner query for nonexistent token"
        );
        return owner;
    }

    function mintKey(address to, string memory newTokenURI) public onlyOwner {
        require(_tokenId < _maxSupply, "Maximum supply reached");
        // Check if maximum supply has been reached
        require(_ownedTokens[to] == 0, "Address already owns a token");
        // Check if address already owns a token
        _mint(to, _tokenId);
        _tokenURIs[_tokenId] = newTokenURI;
        _ownedTokens[to] = _tokenId;
        _tokenId++;
    }

    function burn(uint256 tokenId) public virtual {
        // Only allow the owner of the token to burn it
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: caller is not owner nor approved"
        );
        _burn(tokenId);

        // Remove the token from the _ownedTokens mapping if it was burned by its owner
        if (_ownedTokens[msg.sender] == tokenId) {
            _ownedTokens[msg.sender] = 0;
        }
    }

    function getTokenId(address owner) public view returns (uint256) {
        return _ownedTokens[owner];
    }
}