// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20, ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IComplianceRegistry {
    function checkTransfer(address from, address to) external view returns (bool);
}

contract RestrictedToken is ERC20 {
    IComplianceRegistry public registry;

    error TRANSFER_RESTRICTED();

    constructor(string memory name_, string memory symbol_, address registry_) ERC20(name_, symbol_) {
        registry = IComplianceRegistry(registry_);
        _mint(msg.sender, 1_000_000 ether);
    }

    function _update(address from, address to, uint256 value) internal override {
        // Minting (from == address(0)) and burning (to == address(0)) bypass
        if (from != address(0) && to != address(0)) {
            if (!registry.checkTransfer(from, to)) {
                revert TRANSFER_RESTRICTED();
            }
        }
        super._update(from, to, value);
    }
}
