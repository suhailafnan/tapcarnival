import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys TapKarnival using the deployer account.
 */
const deployTapKarnival: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy contract (no constructor args in the basic example)
  await deploy("TapKarnival", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    waitConfirmations: 2,
  });

  // Get the deployed instance
  const tap = await hre.ethers.getContract<Contract>("TapKarnival", deployer);

  // Optional: call a view/read to confirm ABI wiring (comment out if no such function)
  console.log("Deployed TapKarnival at:", await tap.getAddress());
};

export default deployTapKarnival;

// Tags help selective deployments: yarn deploy --tags TapKarnival
deployTapKarnival.tags = ["TapKarnival"];
