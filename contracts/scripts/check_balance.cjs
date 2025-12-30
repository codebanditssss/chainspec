const hre = require("hardhat");
require("dotenv").config({ path: "../.env" });

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Checking balance for account:", deployer.address);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
