import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { parseEther } from "viem";

const deployTapKarnival: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Set your entry fee (in KDA units on Kadena EVM)
  const entryFee = parseEther("0.01"); // adjust as needed

  await deploy("TapKarnival", {
    from: deployer,
    args: [entryFee, deployer], // constructor(uint256 _entryFee, address initialOwner)
    log: true,
    autoMine: true,
    waitConfirmations: 2,
  });
};

export default deployTapKarnival;
deployTapKarnival.tags = ["TapKarnival"];
