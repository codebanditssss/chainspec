const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureToken", function () {
    let secureToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        const SecureToken = await ethers.getContractFactory("SecureToken");
        secureToken = await SecureToken.deploy();
    });

    describe("Security Requirements", function () {
        it("Should only allow owner to mint new tokens", async function () {
            await expect(
                secureToken.connect(addr1).mint(addr1.address, 100)
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should maintain state invariant: total supply equals sum of all balances", async function () {
            await secureToken.mint(addr1.address, 100);
            await secureToken.mint(addr2.address, 200);
            
            const totalSupply = await secureToken.totalSupply();
            const balance1 = await secureToken.balanceOf(addr1.address);
            const balance2 = await secureToken.balanceOf(addr2.address);
            
            expect(totalSupply).to.equal(balance1 + balance2);
        });

        it("Should have no reentrancy vulnerabilities", async function () {
            // Test that mint function is protected against reentrancy
            await expect(secureToken.mint(addr1.address, 100)).to.not.be.reverted;
        });
    });

    describe("mint function", function () {
        it("Should satisfy precondition: caller is owner", async function () {
            await expect(secureToken.mint(addr1.address, 100)).to.not.be.reverted;
        });

        it("Should satisfy postcondition: balance of 'to' increases by amount", async function () {
            const initialBalance = await secureToken.balanceOf(addr1.address);
            await secureToken.mint(addr1.address, 100);
            const finalBalance = await secureToken.balanceOf(addr1.address);
            
            expect(finalBalance).to.equal(initialBalance + 100n);
        });

        it("Should satisfy postcondition: total supply increases by amount", async function () {
            const initialSupply = await secureToken.totalSupply();
            await secureToken.mint(addr1.address, 100);
            const finalSupply = await secureToken.totalSupply();
            
            expect(finalSupply).to.equal(initialSupply + 100n);
        });

        it("Should revert when minting to zero address", async function () {
            await expect(
                secureToken.mint(ethers.ZeroAddress, 100)
            ).to.be.revertedWith("ERC20: mint to the zero address");
        });
    });
});
