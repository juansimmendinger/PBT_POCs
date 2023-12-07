import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { RedemptionKey } from "../typechain-types";
import { BellToAlango } from "../types/ethers-contracts";

//Users + Owner + Chips
let owner: SignerWithAddress;
let ownerRedemption: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let chip1: SignerWithAddress;
let chip2: SignerWithAddress;
let chip3: SignerWithAddress;
let chip4: SignerWithAddress;

const initializeSigners = async () => {
  const signers = await ethers.getSigners();
  owner = signers[0];
  user1 = signers[1];
  user2 = signers[2];
  chip1 = signers[3];
  chip2 = signers[4];
  chip3 = signers[5];
  chip4 = signers[6];
  ownerRedemption = signers[7];
};

initializeSigners().then(() => {
  console.log("Initialized Signers");
});

// Get Deployed Instances for Contracts
export const getDeployedRedemptionKey = async () =>
  await (
    await ethers.getContractFactory("RedemptionKey")
  ).deploy("RedemptionKey", "RK");

// Get Contracts
export const getRedemptionKeyContract = async () => {
  const contractRedempetion = await getDeployedRedemptionKey();
  expect(contractRedempetion.address).to.not.be.empty;
};

// Mint RedemptionKey
export const redemptionKeyMint = async (contractRedempetion: RedemptionKey) => {
  expect(await contractRedempetion.balanceOf(chip1.address)).to.be.equal(0);
  const txMint = await contractRedempetion.mintKey(chip1.address, "");
  await txMint.wait();
  expect(await contractRedempetion.balanceOf(chip1.address)).to.be.equal(1);
};
// Get BellToAlango + Redemption Key Contract and mint one RKEY.
export const getBellAndRedemptionKeyWithMint = async (
  contractRedempetion: RedemptionKey
) => {
  await (
    await ethers.getContractFactory("BellToAlango")
  ).deploy("BellToAlango", "BellToAlango");
  await redemptionKeyMint(contractRedempetion);
};

// canMint BellToAlango
export const bellCanMint = async (bellToAlango: BellToAlango) => {
  expect(await bellToAlango.canMint()).to.be.equal(false);
  const openMint = await bellToAlango.connect(owner).openMint();
  await openMint.wait();
  expect(await bellToAlango.canMint()).to.be.equal(true);
};

export const recoverFromAddress = async (message: any, signature: any) => {
  // Ensure the message is a bytes32 string
  const messageBytes = ethers.utils.arrayify(message);

  // Recover the signer's address
  const signerAddress = ethers.utils.recoverAddress(messageBytes, signature);

  return signerAddress;
};

/* export const hashMessageEIP191SolidityKeccak = (
  address: string,
  hash: string
) => {
  const messagePrefix = "\x19Ethereum Signed Message:\n32";
  const message = address
    ? ethers.utils.solidityKeccak256(["address", "bytes32"], [address, hash])
    : ethers.utils.solidityKeccak256(["bytes32"], [hash]);
  return ethers.utils.solidityKeccak256(
    ["string", "bytes32"],
    [messagePrefix, ethers.utils.arrayify(message)]
  );
}; */

export const hashMessageEIP191SolidityKeccak = (address: string, hash: string) => {
    const message = ethers.utils.solidityKeccak256(
      ["string", "address", "bytes32"],
      ["\x19Ethereum Signed Message:\n32", address, hash]
    );
    return message;
  };
  
  export const getSignatureFromSigner = async (
    signer: SignerWithAddress,
    messageHash: string
  ) => {
    // Sign the message hash directly
    const signature = await signer.signMessage(ethers.utils.arrayify(messageHash));
  
    // Split the signature into r, s, and v components
    const { r, s, v } = ethers.utils.splitSignature(signature);
  
    // Create signatures with v set to 27 and 28
    const signatureV27 = ethers.utils.joinSignature({ r, s, v: 27 });
    const signatureV28 = ethers.utils.joinSignature({ r, s, v: 28 });
  
    const computedAddress = await signer.getAddress();
    console.log("Computed address: ", computedAddress);
  
    const recoveredAddress27 = ethers.utils.recoverAddress(messageHash, signatureV27);
    const recoveredAddress28 = ethers.utils.recoverAddress(messageHash, signatureV28);
  
    console.log("Recovered address with v=27: ", recoveredAddress27);
    console.log("Recovered address with v=28: ", recoveredAddress28);
  
    // Return the correct signature based on the recovered address
    if (recoveredAddress27.toLowerCase() === computedAddress.toLowerCase()) {
      return signatureV27;
    } else if (recoveredAddress28.toLowerCase() === computedAddress.toLowerCase()) {
      return signatureV28;
    } else {
      throw new Error("addressMismatch");
    }
  };