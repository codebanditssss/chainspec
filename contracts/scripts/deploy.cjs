const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
    const generatedDir = path.join(__dirname, "../generated");

    if (!fs.existsSync(generatedDir)) {
        console.error("Error: No generated contracts found!");
        process.exit(1);
    }

    const files = fs.readdirSync(generatedDir).filter(f => f.endsWith(".sol"));
    if (files.length === 0) {
        console.error("Error: No .sol files in generated/ directory.");
        process.exit(1);
    }

    // Pick the most recently modified file
    const contractFile = files.sort((a, b) => {
        return fs.statSync(path.join(generatedDir, b)).mtime.getTime() -
            fs.statSync(path.join(generatedDir, a)).mtime.getTime();
    })[0];

    const contractName = contractFile.replace(".sol", "");
    console.log(`Found contract: ${contractName}`);

    const Contract = await hre.ethers.getContractFactory(contractName);

    // Determine constructor args
    let args = [];
    if (contractName.includes("Vault")) {
        console.log("Info: Detected Vault contract. Using mock token address.");
        args = ["0x0000000000000000000000000000000000000000"]; // Replace with real token if needed
    }

    console.log(`deploying with args: ${args}`);
    const contract = await Contract.deploy(...args);

    console.log("Waiting for deployment...");
    await contract.waitForDeployment();
    const address = await contract.getAddress();

    console.log(`${contractName} deployed to: ${address}`);

    if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
        console.log("Waiting for block confirmations...");
        await new Promise(resolve => setTimeout(resolve, 15000));

        console.log("Verifying on Etherscan...");
        try {
            await hre.run("verify:verify", {
                address: address,
                constructorArguments: args,
            });
            console.log("Verified!");
        } catch (err) {
            console.log("Verification failed:", err.message);
        }
    }

    // Save deployment info for Frontend
    const deploymentPath = path.join(__dirname, "../../dashboard/public/deployment.json");
    const deploymentData = {
        contractName: contractName,
        address: address,
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        verifiedUrl: `https://${hre.network.name === 'sepolia' ? 'sepolia.' : ''}etherscan.io/address/${address}#code`
    };

    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentData, null, 2));
    console.log(`Deployment info saved to ${deploymentPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
