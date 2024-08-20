const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  let owner, Tom, Jane;
  let Token, token;
  const tokenName = "MyToken";
  const tokenSymbol = "MTK";

  beforeEach(async () => {
    // Get signers
    [owner, Tom, Jane] = await ethers.getSigners();

    // Deploy the token contract
    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(tokenName, tokenSymbol);
    await token.deployed();
  });

  describe("Deployment", () => {
    it("Should assign the total supply of tokens to the owner", async () => {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", () => {
    it("Should transfer tokens between accounts", async () => {
      const transferAmount = ethers.utils.parseUnits("50", 18);

      // Transfer 50 tokens from owner to Tom
      await token.transfer(Tom.address, transferAmount);
      const TomBalance = await token.balanceOf(Tom.address);
      expect(TomBalance).to.equal(transferAmount);

      // Transfer 50 tokens from Tom to Jane
      await token.connect(Tom).transfer(Jane.address, transferAmount);
      const JaneBalance = await token.balanceOf(Jane.address);
      expect(JaneBalance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn’t have enough tokens", async () => {
      const initialOwnerBalance = await token.balanceOf(owner.address);

      // Try to send 1 token from Tom (0 tokens) to owner (should fail)
      await expect(
        token
          .connect(Tom)
          .transfer(owner.address, ethers.utils.parseUnits("1", 18)),
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance,
      );
    });

    it("Should update balances after transfers", async () => {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      const transferAmount1 = ethers.utils.parseUnits("100", 18);
      const transferAmount2 = ethers.utils.parseUnits("50", 18);

      // Transfer 100 tokens from owner to Tom
      await token.transfer(Tom.address, transferAmount1);

      // Transfer another 50 tokens from owner to Jane
      await token.transfer(Jane.address, transferAmount2);

      // Check balances
      const finalOwnerBalance = await token.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.sub(transferAmount1).sub(transferAmount2),
      );

      const TomBalance = await token.balanceOf(Tom.address);
      expect(TomBalance).to.equal(transferAmount1);

      const JaneBalance = await token.balanceOf(Jane.address);
      expect(JaneBalance).to.equal(transferAmount2);
    });
  });
});
