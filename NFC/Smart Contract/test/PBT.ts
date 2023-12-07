import hre, {ethers} from "hardhat";
import {assert, expect} from "chai";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
    getBellAndRedemptionKeyWithMint,
    bellCanMint,
    hashMessageEIP191SolidityKeccak,
    recoverFromAddress,
    getSignatureFromSigner,
} from "./utilsTest";
import {RedemptionKey} from "../typechain-types";
import {BellToAlango} from "../types/ethers-contracts";

describe("PBT", () => {

    const getDeployedRedemptionKey = async () =>
        await (
            await ethers.getContractFactory("RedemptionKey")
        ).deploy("RedemptionKey", "RK");

    const getDeployedBellToAlango = async () =>
        await (
            await ethers.getContractFactory("BellToAlango")
        ).deploy("BellToAlango", "BTA");

    //Users + Owner + Chips
    let owner: SignerWithAddress;
    let ownerRedemption: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let chip1: SignerWithAddress;
    let chip2: SignerWithAddress;
    let chip3: SignerWithAddress;
    let chip4: SignerWithAddress;

    beforeEach(async () => {
        //reset EVM state
        await hre.network.provider.send("hardhat_reset");

        const signers = await ethers.getSigners();
        owner = signers[0];
        user1 = signers[1];
        user2 = signers[2];
        chip1 = signers[3];
        chip2 = signers[4];
        chip3 = signers[5];
        chip4 = signers[6];
        ownerRedemption = signers[7];
    });

    describe("Bell To Alango", function () {
        describe("Deployment", () => {
            it("Should deploy BellToAlango contract", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                expect(bellToAlango.address).to.not.be.empty;
            });

            it("Should Initialize BellToAlango contract", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                expect(await bellToAlango.address).to.not.be.empty;
            });

            it("Should set the right owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                expect(await bellToAlango.owner()).to.equal(owner.address);
            });

            it("Should assign the total supply of tokens to 0", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                expect((await bellToAlango.supply()).toNumber()).to.equal(0);
            });
        });

        describe("openMint", () => {
            it("Should set canMint to true when called by owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                await bellToAlango.connect(owner).openMint();
                expect(await bellToAlango.canMint()).to.equal(true);
            });

            it("Should fail when called by non-owner", async () => {
                try {
                    const bellToAlango = await getDeployedBellToAlango();
                    await bellToAlango.connect(user1).openMint();
                    expect.fail("Expected openMint to throw an error, but it didn't");
                } catch (err) {
                    if (err instanceof Error) {
                        expect(err.message).to.include("Ownable: caller is not the owner");
                    } else {
                        throw err;
                    }
                }
            });
        });

        describe("setBaseURI", () => {
            it("Should set base URI when called by owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const newBaseURI = "https://example.com/";
                await bellToAlango.connect(owner).setBaseURI(newBaseURI);
                expect(await bellToAlango.baseURI()).to.equal(newBaseURI);
            });

            it("Should fail when called by non-owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const newBaseURI = "https://example.com/";
                await expect(
                    bellToAlango.connect(user1).setBaseURI(newBaseURI)
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });

        describe("setChangeDeadline", function () {
            it("Should set change deadline when called by owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const deadline = Date.now() + 1000 * 60 * 60; // 1 hour from now
                await bellToAlango.connect(owner).setChangeDeadline(deadline);
                expect((await bellToAlango.changeDeadline()).toNumber()).to.equal(
                    deadline
                );
            });

            it("Should fail when called by non-owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const deadline = Date.now() + 1000 * 60 * 60;
                await expect(
                    bellToAlango.connect(user1).setChangeDeadline(deadline)
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });

        describe("seedChipToTokenMapping", function () {
            it("Should seed chip to token mapping when called by owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                // Setup chip addresses and corresponding tokenIds
                /* const chipAddresses = 
                [chip1.address, chip2.address];
                const tokenIds = [0, 1]; */

                const inputJSON = {
                    "chipAddresses": [chip1.address, chip2.address],
                    "tokenIds": [0, 1]
                  };
                  
                // Convert the JSON object to a string
                const inputString = JSON.stringify(inputJSON);
                const parsedInput = JSON.parse(inputString);
                const chipAddresses = parsedInput.chipAddresses;
                const tokenIds = parsedInput.tokenIds;

                await bellToAlango
                    .connect(owner)
                    .seedChipToTokenMapping(chipAddresses, tokenIds, false);

                // Check that the mapping is correct
                for (let i = 0; i < chipAddresses.length; i++) {
                    expect(
                        await bellToAlango.tokenIdMappedFor(chipAddresses[i])
                    ).to.equal(tokenIds[i]);
                }
            });

            it("Should fail when called by non-owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const chipAddresses = [chip1.address, chip2.address];
                const tokenIds = [0, 1];

                await expect(
                    bellToAlango
                        .connect(user1)
                        .seedChipToTokenMapping(chipAddresses, tokenIds, true)
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });

        describe("mintBellToAlango", function () {
            it("Should mint a token when called with valid arguments", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                // Setup chip addresses and corresponding tokenIds
                const inputJSON = {
                    "chipAddresses": [chip1.address, chip2.address],
                    "tokenIds": [0, 1]
                  };
                  
                // Convert the JSON object to a string
                const inputString = JSON.stringify(inputJSON);
                const parsedInput = JSON.parse(inputString);
                const chipAddresses = parsedInput.chipAddresses;
                const tokenIds = parsedInput.tokenIds;

                await bellToAlango
                    .connect(owner)
                    .seedChipToTokenMapping(chipAddresses, tokenIds, true);

                // Check that the mapping is correct
                for (let i = 0; i < chipAddresses.length; i++) {
                    expect(
                        await bellToAlango.tokenIdMappedFor(chipAddresses[i])
                    ).to.equal(tokenIds[i]);
                }
                //await bellCanMint(bellToAlango);
                expect(await bellToAlango.canMint()).to.be.equal(false);
                const openMint = await bellToAlango.connect(owner).openMint();
                await openMint.wait();
                expect(await bellToAlango.canMint()).to.be.equal(true);

                // TODO: EIP-191 Message Hash
                const blockNumber = await ethers.provider.getBlockNumber();
                const block = await ethers.provider.getBlock(blockNumber);
                const blockHash = block.hash;
                console.log(`blockNumber: ${blockNumber}`)
                console.log(`blockHash: ${blockHash}`)

                
            
                const message = hashMessageEIP191SolidityKeccak(
                    owner.address,
                    blockHash
                ); 
                
                const messageTwo = owner.address + blockHash.substring(2);
                //console.log(`messageTwo: ${messageTwo}`)  
                
                const signature = await chip1.signMessage(
                    message
                );
                const isValidSignature = ethers.utils.verifyMessage(message, signature);
                if (isValidSignature.toLowerCase() !== chip1.address.toLowerCase()) {
                    throw new Error("addressMismatch");
                }
                console.log(`isValidSignature: ${isValidSignature}`)
                //const signature2 = await getSignatureFromSigner(chip1, blockHash);
                //console.log(`signature2: ${signature2}`)

               
                
                //console.log(`chip1.address: ${chip1.address}`)
                console.log(`message: ${messageTwo}`)
                console.log(`signature: ${signature}`)
                const recoveredAddress = await recoverFromAddress(message, signature);  
                console.log(`recoveredAddress: ${recoveredAddress}`)
                await bellToAlango
                    .connect(owner)
                    .mintBellToAlango(signature, blockNumber);
            });
        });

        describe("tokenIdMappedFor", function () {
            it("Should return mapped tokenId for given chip address", async () => {
                const bellToAlango = await getDeployedBellToAlango();
                const chipAddresses = [chip1.address];
                const tokenIds = [0];

                await bellToAlango
                    .connect(owner)
                    .seedChipToTokenMapping(chipAddresses, tokenIds, false);
                const tokenId = await bellToAlango.tokenIdMappedFor(chip1.address);
                expect(tokenId).to.equal(0);
            });
        });

        describe("updateChips", function () {
            it("Should update chip addresses when called by owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();

                // Setup old and new chip addresses
                const chipAddressesOld = [chip1.address, chip2.address];
                const chipAddressesNew = [chip3.address, chip4.address];

                // Seed initial mapping
                await bellToAlango
                    .connect(owner)
                    .seedChipToTokenMapping(chipAddressesOld, [0, 1], true);

                // Update chip addresses
                await bellToAlango
                    .connect(owner)
                    .updateChips(chipAddressesOld, chipAddressesNew);

                // Check that old addresses do not map to any tokens
                for (let i = 0; i < chipAddressesOld.length; i++) {
                    expect(await bellToAlango.tokenIdFor(chipAddressesOld[i])).to.equal(
                        0
                    );
                }

                // Check that new addresses map to the correct tokens
                for (let i = 0; i < chipAddressesNew.length; i++) {
                    expect(
                        await bellToAlango.tokenIdMappedFor(chipAddressesNew[i])
                    ).to.equal(i);
                }
            });

            it("Should fail when called by non-owner", async () => {
                const bellToAlango = await getDeployedBellToAlango();

                const chipAddressesOld = [chip1.address, chip2.address];
                const chipAddressesNew = [chip3.address, chip4.address];

                await expect(
                    bellToAlango
                        .connect(user1)
                        .updateChips(chipAddressesOld, chipAddressesNew)
                ).to.be.revertedWith("Ownable: caller is not the owner");
            });
        });
    });

    describe("RedemptionKey", () => {
        // Testing ctract deployment and constructor
        it("Should deploy and set the right owner", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner] = await ethers.getSigners();
            expect(await redemptionKey.owner()).to.equal(owner.address);
        });

        // Testing tokenURI function
        it("Should mint a key and set the right URI", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            const tokenId = await redemptionKey.getTokenId(user1.address);
            expect(await redemptionKey.tokenURI(tokenId)).to.equal(uri);
        });

        // Testing balanceOf function
        it("Should correctly display the balance", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            expect(
                (await redemptionKey.balanceOf(user1.address)).toNumber()
            ).to.equal(1);
        });

        // Testing ownerOf function
        it("Should correctly display the owner of the token", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            const tokenId = await redemptionKey.getTokenId(user1.address);
            expect(await redemptionKey.ownerOf(tokenId)).to.equal(user1.address);
        });

        // Testing transferFrom function
        it("Should correctly transfer the token", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1, user2] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            const tokenId = await redemptionKey.getTokenId(user1.address);
            await redemptionKey
                .connect(user1)
                .transferFrom(user1.address, user2.address, tokenId);
            expect(await redemptionKey.ownerOf(tokenId)).to.equal(user2.address);
        });

        // Testing mintKey function
        it("Should correctly mint a key", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            const tokenId = await redemptionKey.getTokenId(user1.address);
            expect(await redemptionKey.ownerOf(tokenId)).to.equal(user1.address);
        });

        it("Should correctly burn a key", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            await getBellAndRedemptionKeyWithMint(redemptionKey);
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);

            try {
                await redemptionKey.connect(user1).burn(1);
                assert.fail("Expected contract to be reverted");
            } catch (error) {
                if (error instanceof Error) {
                    assert.equal(error.message, "Expected contract to be reverted");
                }
            }
        });

        // Testing getTokenId function
        it("Should correctly get the token id", async () => {
            const redemptionKey = await getDeployedRedemptionKey();
            const [owner, user1] = await ethers.getSigners();
            const uri = "ipfs://tokenURI";
            await redemptionKey.connect(owner).mintKey(user1.address, uri);
            const tokenId = await redemptionKey.getTokenId(user1.address);
            expect(tokenId).to.exist;
        });
    });
});