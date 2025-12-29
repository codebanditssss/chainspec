import hardhat from "hardhat";
import { expect } from "chai";

describe("Generated Contracts Registry", function () {

    // We assume the Generator has already run and populated 'contracts/generated/'
    // with 'TestToken.sol' and 'TestVault.sol' during the Validation Step.

    describe("ERC20 Template (TestToken)", function () {
        it("Should deploy and mint initial supply", async function () {
            const [owner] = await hardhat.ethers.getSigners();

            // Get the Contract Factory
            // Note: The name 'TestToken' must match the one generated in validate_templates.js
            const Token = await hardhat.ethers.getContractFactory("TestToken");
            const token = await Token.deploy();
            await token.waitForDeployment();

            console.log(`    Address: ${await token.getAddress()}`);

            // Check Metadata
            expect(await token.name()).to.equal("TestToken");
            expect(await token.symbol()).to.equal("TEST");

            // Check Minting (Constructor logic we defined in validate_templates.js was 1000 tokens)
            const balance = await token.balanceOf(owner.address);
            const expectedSupply = hardhat.ethers.parseEther("1000");
            expect(balance).to.equal(expectedSupply);
        });
    });

    describe("DAO Vault Template (TestVault)", function () {
        it("Should deploy and manage roles", async function () {
            const [owner, user] = await hardhat.ethers.getSigners();

            // 1. Deploy Mock Token first (Vault needs it)
            const Token = await hardhat.ethers.getContractFactory("TestToken");
            const token = await Token.deploy();
            await token.waitForDeployment();

            // 2. Deploy Vault
            const Vault = await hardhat.ethers.getContractFactory("TestVault");
            const vault = await Vault.deploy(await token.getAddress(), owner.address);
            await vault.waitForDeployment();

            // 3. Check Roles
            const STRATEGIST_ROLE = hardhat.ethers.keccak256(hardhat.ethers.toUtf8Bytes("STRATEGIST_ROLE"));
            // The mocked constructor grants STRATEGIST_ROLE to admin (owner)
            const hasRole = await vault.hasRole(STRATEGIST_ROLE, owner.address);
            expect(hasRole).to.be.true;
        });
    });

});
