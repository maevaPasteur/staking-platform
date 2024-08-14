require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
      rinkeby: {
        url: process.env.ALCHEMY_API_KEY_URL,
        accounts: [process.env.PRIVATE_KEY]
      }
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
