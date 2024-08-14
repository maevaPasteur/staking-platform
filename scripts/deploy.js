async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy();

    console.log("Token contract deployed to:", token.address);

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(token.address);

    console.log("Staking contract deployed to:", staking.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
