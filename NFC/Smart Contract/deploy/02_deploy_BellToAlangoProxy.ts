import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import {ethers} from "hardhat"
import {verifyContracts} from "../utils/verify"
import {CONTRACT_BELLTOALANGO, CONTRACT_BELLTOALANGO_PROXY, CONTRACT_QUANTUM_PROXY_ADMIN} from "../utils/constants"
import {Deployment} from "hardhat-deploy/dist/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts, network} = hre
    const {deploy} = deployments

    const {deployer} = await getNamedAccounts()

    let BellToAlangoProxy: Deployment

    const BellToAlango = await deployments.get(CONTRACT_BELLTOALANGO)
    const ProxyAdmin = await deployments.get(CONTRACT_QUANTUM_PROXY_ADMIN)

    try {
        BellToAlangoProxy = await deployments.get(CONTRACT_BELLTOALANGO_PROXY)
        console.log("BellToAlangoProxy already deployed at ", BellToAlangoProxy.address)
    } catch (e) {
        console.warn("Deployment not found: ", CONTRACT_BELLTOALANGO_PROXY)
    }

    const arg1 = "BellToAlango"
    const arg2 = "BTA"

    const instance = await ethers.getContractAt(BellToAlango.abi, BellToAlango.address)
    const initializeArgs = [
        arg1,
        arg2
    ]
    const encodedInitialize = instance.interface.encodeFunctionData("initialize", initializeArgs)

    let constructorArguments = [
        BellToAlango.address, //implementation address
        ProxyAdmin.address,
        encodedInitialize
    ]

    if (!BellToAlangoProxy) {
        const deployResult = await deploy("BellToAlangoProxy", {
            from: deployer,
            args: constructorArguments,
            log: true
        })

        if (network.live) {
            await verifyContracts(
                hre,
                deployResult,
                constructorArguments,
                `contracts/$BellToAlangoProy.sol:BellToAlangoProxy`
            )
        }
    }
}

func.tags = [CONTRACT_BELLTOALANGO_PROXY, "1.0.0"]
func.id = CONTRACT_BELLTOALANGO_PROXY
func.dependencies = [CONTRACT_QUANTUM_PROXY_ADMIN, CONTRACT_BELLTOALANGO]
export default func