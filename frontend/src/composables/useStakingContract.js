import { Contract, ethers } from "ethers";
import { ref, toRaw, onMounted } from "vue";
import stakingCompiled from "../../../artifacts/contracts/Staking.sol/Staking.json";
import tokenCompiled from "../../../artifacts/contracts/Token.sol/Token.json";

export function useStakingContract() {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545",
  );
  let owner = null;
  let stakingContract = null;
  let tokenContract = null;

  const julia = ref(null);
  const tom = ref(null);
  const isInitialized = ref(false);
  const apy = ref(null);
  const totalStakedBalance = ref(null);

  const convertIntoUnits = (amount) => {
    return ethers.utils.parseUnits(amount.toString(), 18);
  };

  const getErrorMessage = (error) => {
    const errorObject = JSON.parse(JSON.stringify(error));
    return errorObject?.reason || error;
  };

  const setGasLimit = async (contract, signer, address) => {
    try {
      await contract
        .connect(toRaw(signer))
        .approve(address, convertIntoUnits(1));
    } catch (error) {
      console.error("Error settings gas limit:", error);
      throw error;
    }
  };

  const getSignerAddress = async (signer) => {
    try {
      return await toRaw(signer).getAddress();
    } catch (error) {
      console.error("Error getting signer address:", error);
      throw error;
    }
  };

  const getTotalStakedBalance = async () => {
    try {
      totalStakedBalance.value = await stakingContract.totalStakedBalance();
    } catch (error) {
      console.error("Error getting contract total staked balance:", error);
      throw error;
    }
  };

  const getSignerEthersBalance = async (address) => {
    try {
      return await provider.getBalance(address);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  const getSignerStakingBalance = async (address) => {
    try {
      const amount = await stakingContract.getUserBalance(address);
      return amount;
    } catch (error) {
      console.error("Error fetching signer staking balance:", error);
      throw error;
    }
  };

  const getSignerTokenBalance = async (address) => {
    try {
      return await tokenContract.balanceOf(address);
    } catch (error) {
      console.error("Error fetching signer token balance:", error);
      throw error;
    }
  };

  const getAPY = async () => {
    try {
      apy.value = await stakingContract.apy();
    } catch (error) {
      throw error;
    }
  };

  const setAPY = async (newAPY) => {
    if (stakingContract && owner) {
      try {
        const contractWithSigner = stakingContract.connect(owner);
        const tx = await contractWithSigner.setApy(newAPY);
        await tx.wait();
        apy.value = newAPY;
      } catch (error) {
        console.error("Error setting APY:", error);
        throw error;
      }
    }
  };

  const stake = async (amount, signer) => {
    try {
      await setGasLimit(tokenContract, signer, stakingContract.address, amount);
      const tx = await stakingContract
        .connect(toRaw(signer))
        .stake(convertIntoUnits(amount));
      await tx.wait();
      getTotalStakedBalance();
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw getErrorMessage(error);
    }
  };

  const withdrawing = async (amount, signer) => {
    try {
      await setGasLimit(tokenContract, signer, stakingContract.address, amount);
      const tx = await stakingContract
        .connect(toRaw(signer))
        .withdrawing(convertIntoUnits(amount));
      await tx.wait();
      getTotalStakedBalance();
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      throw getErrorMessage(error);
    }
  };

  const transferERC20Tokens = async (amount, signer, address) => {
    try {
      await tokenContract
        .connect(owner)
        .transfer(address, convertIntoUnits(amount));
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  onMounted(async () => {
    try {
      // Get signers
      owner = await provider.getSigner(0);
      tom.value = await provider.getSigner(1);
      julia.value = await provider.getSigner(2);

      // Init contracts with a provider
      stakingContract = new Contract(
        import.meta.env.VITE_STAKING_ADDRESS,
        stakingCompiled.abi,
        provider,
      );
      tokenContract = new Contract(
        import.meta.env.VITE_TOKEN_ADDRESS,
        tokenCompiled.abi,
        provider,
      );

      isInitialized.value = true;

      await getAPY();
      await getTotalStakedBalance();

      // Init ERC20 tokens quantity per user
    } catch (error) {
      console.error("Error initializing contracts:", error);
      throw error;
    }
  });

  return {
    isInitialized,
    julia,
    tom,
    provider,
    apy,
    totalStakedBalance,
    getSignerEthersBalance,
    setAPY,
    getAPY,
    stake,
    withdrawing,
    getSignerAddress,
    getSignerStakingBalance,
    getSignerTokenBalance,
    transferERC20Tokens,
  };
}
