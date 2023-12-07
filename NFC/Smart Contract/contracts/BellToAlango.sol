// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./PBTSimple.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

error MintNotOpen();
error TotalSupplyReached();
error CannotUpdateDeadline();
error CannotMakeChanges();

contract BellToAlango is PBTSimple {
    uint256 public constant TOTAL_SUPPLY = 9;

    uint256 public supply;
    uint256 public changeDeadline;
    bool public canMint;
    string private _baseTokenURI;
    bytes32 private constant MODULE_TYPE = bytes32("BellToAlango");
    uint256 private constant VERSION = 1;

    constructor(string memory name_, string memory symbol_) {
        initialize(name_, symbol_);
    }

    function mintBellToAlango(
        bytes calldata signatureFromChip,
        uint256 blockNumberUsedInSig
    ) external {
        if (!canMint) {
            revert MintNotOpen();
        }
        if (supply == TOTAL_SUPPLY) {
            revert TotalSupplyReached();
        }

        console.log(msg.sender);
        console.log(blockNumberUsedInSig);

        bytes32 message = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(
                    abi.encodePacked(
                        msg.sender,
                        blockhash(block.number - 1)
                    )
                )
            )
        );

        address signerOz = ECDSA.recover(message, signatureFromChip);
        console.log(signerOz);
        _mintTokenWithChip(signatureFromChip, blockNumberUsedInSig);

        unchecked {
            ++supply;
        }
    }

    function seedChipToTokenMapping(
        address[] calldata chipAddresses,
        uint256[] calldata tokenIds,
        bool throwIfTokenAlreadyMinted
    ) external onlyOwner {
        _seedChipToTokenMapping(
            chipAddresses,
            tokenIds,
            throwIfTokenAlreadyMinted
        );
    }

    function updateChips(
        address[] calldata chipAddressesOld,
        address[] calldata chipAddressesNew
    ) external onlyOwner {
        if (changeDeadline != 0 && block.timestamp > changeDeadline) {
            revert CannotMakeChanges();
        }
        _updateChips(chipAddressesOld, chipAddressesNew);
    }

    function openMint() external onlyOwner {
        canMint = true;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function setChangeDeadline(uint256 timestamp) external onlyOwner {
        if (changeDeadline != 0) {
            revert CannotUpdateDeadline();
        }
        changeDeadline = timestamp;
    }

    /// @dev Returns the type of the contract.
    function contractType() external pure returns (bytes32) {
        return MODULE_TYPE;
    }

    /// @dev Returns the version of the contract.
    function contractVersion() external pure returns (uint8) {
        return uint8(VERSION);
    }
}
