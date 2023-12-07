import {HardhatRuntimeEnvironment} from "hardhat/types"
import {DeployFunction} from "hardhat-deploy/types"
import {verifyContracts} from "../utils/verify"
import {CONTRACT_QUANTUM_PROXY_ADMIN} from "../utils/constants"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, network} = hre
  const {deploy} = deployments
  const {deployer} = await getNamedAccounts()

  const deployResult = await deploy(CONTRACT_QUANTUM_PROXY_ADMIN, {
    from: deployer,
    log: true
  })

  if (network.live) {
    await verifyContracts(
      hre,
      deployResult,
      [],
      `contracts/${CONTRACT_QUANTUM_PROXY_ADMIN}.sol:${CONTRACT_QUANTUM_PROXY_ADMIN}`
    )
  }
}

func.tags = [CONTRACT_QUANTUM_PROXY_ADMIN, "1.0.0"]
func.id = CONTRACT_QUANTUM_PROXY_ADMIN
export default func