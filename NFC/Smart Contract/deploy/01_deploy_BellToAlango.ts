import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import {verifyContracts} from '../utils/verify'
import {CONTRACT_BELLTOALANGO} from "../utils/constants"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts, network} = hre
    const {deploy} = deployments
    const arg1 = "BellToAlango"
    const arg2 = "BTA"
    const {deployer} = await getNamedAccounts()
    const args: Array<string> = [arg1, arg2]
    const deployResult = await deploy(CONTRACT_BELLTOALANGO, {
        from: deployer,
        log: true,
        args: args,
    })

    if (network.live) {
        await verifyContracts(
            hre,
            deployResult,
            args,
            `contracts/${CONTRACT_BELLTOALANGO}.sol:${CONTRACT_BELLTOALANGO}`
        )
    }
}

func.tags = [CONTRACT_BELLTOALANGO, "1.0.0"]
func.id = CONTRACT_BELLTOALANGO
export default func