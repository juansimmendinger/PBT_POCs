## NFC Implementation (EIP-5791)

# Implementation found in PBT_POC/NFC folder

NFT collectors enjoy collecting digital assets and sharing them with others online. However, there is currently no such standard for showcasing physical assets as NFTs with verified authenticity and ownership. Existing solutions are fragmented and tend to be susceptible to at least one of the following:

-   The NFT cannot proxy as ownership of the physical item. In most current implementations, the NFT and physical item are functionally two decoupled distinct assets after the NFT mint, in which the NFT can be freely traded independently from the physical item.

-   Verification of authenticity of the physical item requires action from a trusted entity.

PBT aims to mitigate these issues in a decentralized way through a new token standard (an extension of EIP-721).

## How does PBT work?

#### Requirements

This approach assumes that the physical item must have a chip attached to it that fulfills the following requirements:

-   The ability to securely generate and store an ECDSA secp256k1 asymmetric keypair
-   The ability to sign messages from the private key of the asymmetric keypair
-   The ability for one to retrieve only the public key of the asymmetric keypair (private key non-extractable)

The approach also requires that the contract uses an account-bound implementation of EIP-721 (where all EIP-721 functions that transfer must throw, e.g. the "read only NFT registry" implementation referenced in EIP-721). This ensures that ownership of the physical item is required to initiate transfers and manage ownership of the NFT, through a new function introduced in `IPBT.sol` (`transferTokenWithChip`).

#### Approach

On a high level:

-   Each NFT is conceptually linked to a physical chip.
-   The NFT can only be transferred to a different owner if a signature from the chip is supplied to the contract.
-   This guarantees that a token cannot be transferred without consent from the owner of the physical item.

More details available in the [EIP](https://eips.ethereum.org/EIPS/eip-5791) and inlined into `IPBT.sol`.

## How do I use PBT for my project?

3 key parts.
- Acquire NFC chips, embed them into the physical items.
  - Before you sell/ship the physicals, make sure you save the public keys of the chips first, since the smart contract you deploy will need to know which chips are applicable to it.
- Write and deploy a PBT smart contract (PBT_POC/Smart Contract).
  - Set the name, symbol of the PBT as stated in the constructor
  - The chip addresses also need to be seeded into the contract as an allowlist for which chips can mint and transfer (seedChipToTokenMapping)
   
- Frontend with functionalities: Scanning NFC and Signing + Minting/Transferring the PBT.
 
  - A working end-to-end flow will also require building out a simple frontend for a mobile browser to grab NFC chip signatures to pass into the smart contract (PBT_POC/Frontend).