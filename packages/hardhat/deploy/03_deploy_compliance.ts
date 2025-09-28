import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const registry = await deploy("ComplianceRegistry", {
    from: deployer,
    args: [deployer],
    log: true,
  });

  await deploy("RestrictedToken", {
    from: deployer,
    args: ["RestrictedToken", "RTK", registry.address],
    log: true,
  });
};
export default func;
func.tags = ["compliance"];
