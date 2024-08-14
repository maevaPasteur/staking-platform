async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Token contract
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy("MyToken", "MTK");
  await token.deployed();
  console.log("Token contract deployed to:", token.address);

  // Deploy Staking contract
  const Staking = await ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(token.address);
  await staking.deployed();
  await staking.setApy(10);
  console.log("Staking contract deployed to:", staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
