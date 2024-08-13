const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", () => {
    let owner, Tom, Jane, Stan;
    let Staking, staking;
    let Token, token;
    const tokenName = "MyToken";

    beforeEach(async () => {
        // Get signers
        [owner, Tom, Jane, Stan] = await ethers.getSigners();

        // Deploy ERC20 Token contract
        Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(tokenName, "MTK");
        await token.deployed();

        // Deploy Stacking contract
        Staking = await ethers.getContractFactory("Staking");
        staking = await Staking.deploy(token.address);
        await staking.deployed();
    });

    describe("Deploy", () => {
       it("Should deploy token", async () => {
           expect(await token.name()).to.equal(tokenName);
           expect(await token.symbol()).to.equal("MTK");
       });

        it("Should get owner", async () => {
            expect(await staking.owner()).to.equal(owner.address);
        });
        
        it("Should get token from staking contract", async () => {
            const stakingTokenAddress = await staking.stakingToken();
            const stakingToken = await ethers.getContractAt("Token", stakingTokenAddress);
            expect(await stakingToken.name()).to.equal(tokenName);
            expect(await stakingToken.symbol()).to.equal("MTK");
        });
    });

    describe("APY", () => {
       it("Should get default APY value", async () => {
           expect(await staking.APY()).to.equal(1);
       });

       it("Should set new APY value", async () => {
           await staking.setAPY(2);
           expect(await staking.APY()).to.equal(2);
       });

       it("Should failed if someone else than the owner set APY", async () => {
           await expect(staking.connect(Tom).setAPY(2))
               .to.be.revertedWith("Only the owner can call this function");
       });
    });
});
