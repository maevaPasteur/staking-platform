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
      const stakingToken = await ethers.getContractAt(
        "Token",
        stakingTokenAddress,
      );
      expect(await stakingToken.name()).to.equal(tokenName);
      expect(await stakingToken.symbol()).to.equal("MTK");
    });
  });

  describe("APY", () => {
    it("Should get default APY value", async () => {
      expect(await staking.apy()).to.equal(1);
    });

    it("Should set new APY value", async () => {
      await staking.setApy(2);
      expect(await staking.apy()).to.equal(2);
    });

    it("Should failed if someone else than the owner set APY", async () => {
      await expect(
        staking.connect(Tom).setApy(2),
      ).to.be.revertedWithCustomError(staking, "OnlyOwner");
    });
  });

  describe("Stake", () => {
    beforeEach(async () => {
      // Transfer to Jane 10 tokens
      await token.transfer(Jane.address, ethers.utils.parseEther("10"));
    });

    it("Should stake from Jane account", async () => {
      const amount = ethers.utils.parseEther("10");
      await token.connect(Jane).approve(staking.address, amount);
      await staking.connect(Jane).stake(amount);
      expect(await staking.getUserBalance(Jane.address)).to.equal(amount);
    });

    it("Shouldn't stake if amount is greater than Jane's balance", async () => {
      const amount = ethers.utils.parseEther("15");
      await token.connect(Jane).approve(staking.address, amount);
      await expect(staking.connect(Jane).stake(amount)).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance",
      );
    });

    it("Shouldn't stake if amount isn't greater than 0", async () => {
      const amount = ethers.utils.parseEther("0");
      await expect(
        staking.connect(Jane).stake(amount),
      ).to.be.revertedWithCustomError(staking, "AmountMustBeGreaterThanZero");
    });
  });

  describe("Withdrawing", () => {
    beforeEach(async () => {
      // Transfer to Jane 10 tokens
      await token.transfer(Jane.address, ethers.utils.parseEther("10"));
    });

    it("Should withdrawing from Jane account", async () => {
      const amount = ethers.utils.parseEther("10");
      await token.connect(Jane).approve(staking.address, amount);
      await staking.connect(Jane).stake(amount);
      expect(await staking.getUserBalance(Jane.address)).to.equal(amount);
      await staking.connect(Jane).withdrawing(amount);
      expect(await staking.getUserBalance(Jane.address)).to.equal(0);
    });

    it("Shouldn't withdrawing more than Jane balance", async () => {
      const stakeAmount = ethers.utils.parseEther("10");
      const withdrawingAmount = ethers.utils.parseEther("20");
      await token.connect(Jane).approve(staking.address, stakeAmount);
      await staking.connect(Jane).stake(stakeAmount);
      await expect(
        staking.connect(Jane).withdrawing(withdrawingAmount),
      ).to.revertedWithCustomError(staking, "InsufficientBalance");
    });

    it("Shouldn't withdrawing mis amount isn't grater than 0", async () => {
      const stakeAmount = ethers.utils.parseEther("10");
      const withdrawingAmount = ethers.utils.parseEther("0");
      await token.connect(Jane).approve(staking.address, stakeAmount);
      await staking.connect(Jane).stake(stakeAmount);
      await expect(
        staking.connect(Jane).withdrawing(withdrawingAmount),
      ).to.revertedWithCustomError(staking, "AmountMustBeGreaterThanZero");
    });
  });

  describe("User balances", () => {
    beforeEach(async () => {
      // Transfer to Jane 10 tokens
      await token.transfer(Jane.address, ethers.utils.parseEther("10"));
    });

    it("Should get empty user balance", async () => {
      const userBalance = await staking.getUserBalance(Jane.address);
      expect(userBalance).to.equal(0);
    });

    it("Should get user balance after stake", async () => {
      const initialBalanceAmount = await token.balanceOf(Jane.address);

      // Stake
      const stakeAmount = ethers.utils.parseEther("10");
      await token.connect(Jane).approve(staking.address, stakeAmount);
      await staking.connect(Jane).stake(stakeAmount);

      // Verify Jane balance
      expect(await staking.getUserBalance(Jane.address)).to.equal(stakeAmount);
      expect(await token.balanceOf(Jane.address)).to.equal(0);
    });

    it("Shouldn't allow stake if amount is greater than user balance", async () => {
      const initialBalanceAmount = await token.balanceOf(Jane.address);

      // Stake
      const stakeAmount = ethers.utils.parseEther("1000");
      await token.connect(Jane).approve(staking.address, stakeAmount);
      await expect(staking.connect(Jane).stake(stakeAmount)).to.be.revertedWith(
        "ERC20: transfer amount exceeds balance",
      );

      // Verify that Jane balance stay at 0 after the fail
      expect(await staking.getUserBalance(Jane.address)).to.equal(0);
      expect(await token.balanceOf(Jane.address)).to.equal(
        initialBalanceAmount,
      );
    });

    it("Should get user balance after withdrawing", async () => {
      const amount = ethers.utils.parseEther("10");
      const initialBalanceAmount = await token.balanceOf(Jane.address);

      // Stake
      await token.connect(Jane).approve(staking.address, amount);
      await staking.connect(Jane).stake(amount);

      // Withdrawing
      await staking.connect(Jane).withdrawing(amount);

      // Verify Jane's balance
      expect(await staking.getUserBalance(Jane.address)).to.equal(0);
      expect(await token.balanceOf(Jane.address)).to.equal(
        initialBalanceAmount,
      );
    });
  });

  describe("Rewards", () => {
    beforeEach(async () => {
      // Set APY at 10%
      await staking.setApy(10);

      const stakeAmount = ethers.utils.parseEther("90");
      await token.transfer(Jane.address, ethers.utils.parseEther("100"));
      await token.connect(Jane).approve(staking.address, stakeAmount);
      await staking.connect(Jane).stake(stakeAmount);

      // Simulate 6 months of delay
      const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;
      await ethers.provider.send("evm_increaseTime", [sixMonthsInSeconds]);
      await ethers.provider.send("evm_mine");
    });

    it("Should accumulate rewards after stake and claim them", async () => {
      const initialStakingBalance = await staking.getUserBalance(Jane.address);
      const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;
      const stakeAmount = ethers.utils.parseEther("90");
      const apy = await staking.apy();
      const tolerance = ethers.utils.parseEther("0.00001");

      // Claiming rewards
      await staking.connect(Jane).claimingRewards();

      // Calculate rewards
      const expectedRewards = stakeAmount
        .mul(apy)
        .mul(sixMonthsInSeconds)
        .div(365 * 24 * 60 * 60)
        .div(100);
      const expectedStakeBalance = initialStakingBalance.add(expectedRewards);

      // Verify new stake balance including rewards
      expect(await staking.getUserBalance(Jane.address)).to.be.closeTo(
        expectedStakeBalance,
        tolerance,
      );

      // Verify that rewards have been reset to 0 after claiming
      expect(await staking.getUserRewards(Jane.address)).to.equal(0);
    });

    it("Should accumulate rewards after withdrawing", async () => {
      const stakeAmount = ethers.utils.parseEther("90");
      const withdrawingAmount = ethers.utils.parseEther("80");
      const sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;
      const apy = await staking.apy();

      // Set a small tolerance for comparison
      const tolerance = ethers.utils.parseEther("0.00001");

      // Withdrawing
      await staking.connect(Jane).withdrawing(withdrawingAmount);

      // Calculate rewards for the remaining 10 tokens after 6 months
      const remainingStakeAmount = stakeAmount.sub(withdrawingAmount);
      const expectedRewards = remainingStakeAmount
        .mul(apy)
        .mul(sixMonthsInSeconds)
        .div(365 * 24 * 60 * 60)
        .div(100);

      // Verify user rewards
      expect(await staking.getUserRewards(Jane.address)).to.be.closeTo(
        expectedRewards,
        tolerance,
      );
    });
  });
});
