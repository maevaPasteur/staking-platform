const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking", () => {
    let owner, Tom, Jane, Stan;
    let Staking, staking;

    beforeEach(async function () {
        Staking = await ethers.getContractFactory("Staking");
        [owner, Tom, Jane, Stan] = await ethers.getSigners();
        staking = await Staking.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await staking.owner()).to.equal(owner.address);
        });
    });
});