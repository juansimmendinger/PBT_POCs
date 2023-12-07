import {deployments, ethers} from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BellToAlango} from "../types/ethers-contracts";
import {
    CONTRACT_BELLTOALANGO,
    CONTRACT_BELLTOALANGO_PROXY,
    CONTRACT_QUANTUM_PROXY_ADMIN,
} from "../utils/constants";
import {expect} from "chai";
import {BellToAlangoProxy, QuantumProxyAdmin} from "../typechain-types";

describe("BellToAlangoProxy", () => {
    let owner: SignerWithAddress;
    let generator: SignerWithAddress;
    let notTheOwner: SignerWithAddress;
    let instance: BellToAlango;
    let proxyAdmin: QuantumProxyAdmin;


    beforeEach(async () => {
        const addresses = await ethers.getSigners();
        owner = addresses[0];
        generator = addresses[1];
        notTheOwner = addresses[2];

        await deployments.fixture([CONTRACT_BELLTOALANGO_PROXY]);
        const bellToAlangoArtifact = await deployments.get(CONTRACT_BELLTOALANGO);
        const bellToAlangoProxyArtifact = await deployments.get(
            CONTRACT_BELLTOALANGO_PROXY
        );
        const proxyAdminArtifact = await deployments.get(
            CONTRACT_QUANTUM_PROXY_ADMIN
        );

        // Deploying

        instance = (await ethers.getContractAt(
            bellToAlangoArtifact.abi,
            bellToAlangoProxyArtifact.address,
            owner
        )) as BellToAlango;
        proxyAdmin = (await ethers.getContractAt(
            proxyAdminArtifact.abi,
            proxyAdminArtifact.address,
            owner
        )) as QuantumProxyAdmin;
    });

    describe("Marketplace upgrade", () => {
        it("Should deploy Bell To Alango contract", async () => {
            const bellToAlango = await instance.address
            expect(bellToAlango).to.not.be.empty;
        });

        it("Should have correct version", async () => {
            const DEFAULT_VERSION = 1;
            await expect(await instance.contractVersion()).to.be.eq(DEFAULT_VERSION)
        });

        it("Should set the right owner", async () => {
            expect(await instance.owner()).to.equal(owner.address);
        });

        it("Should upgrade proxy instance", async () => {
            const bellToAlangoFactory = await ethers.getContractFactory(
                "BellToAlangoV2"
            );
            const newInstance = await bellToAlangoFactory.deploy();
            await proxyAdmin.upgrade(instance.address, newInstance.address);

            const upgraded = bellToAlangoFactory.attach(instance.address);
            const newVersion = await upgraded.contractVersion();
            await expect(newVersion).to.be.equal(2);
        });
    });
});