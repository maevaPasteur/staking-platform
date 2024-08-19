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
  const stakingBalance = ref(null);

  const getSignerAddress = async (signer) => {
    try {
      return await toRaw(signer).getAddress();
    } catch (error) {
      console.error("Error getting signer address:", error);
      throw error;
    }
  };

  const getContractBalance = async () => {
    try {
      if (stakingContract) {
        const balance = await provider.getBalance(stakingContract.address);
        stakingBalance.value = ethers.utils.formatEther(balance);
      }
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      throw error;
    }
  };

  const getSignerBalance = async (address) => {
    try {
      return await provider.getBalance(address);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return null;
    }
  };

  const getSignerStakingBalance = async (address) => {
    try {
      console.log("address", address);
      const amount = await stakingContract.getUserBalance(address);
      console.log("amount", amount);
    } catch (error) {
      console.error("Error fetching signer staking balance:", error);
      throw error;
    }
  };

  const getAPY = async () => {
    if (stakingContract) {
      try {
        apy.value = await stakingContract.apy();
      } catch (error) {
        console.error("Error calling apy():", error);
      }
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

  const stake = async (amount, signer, address) => {
    try {
      await tokenContract
        .connect(toRaw(signer))
        .approve(
          stakingContract.address,
          ethers.utils.parseUnits(amount.toString(), 18),
        );
      const tx = await stakingContract
        .connect(toRaw(signer))
        .stake(ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
    } catch (error) {
      console.error("Error staking tokens:", error);
      throw error;
    }
  };

  const withdrawing = async (amount, address) => {
    try {
      const tx = await stakingContract
        .connect(address)
        .withdrawing(ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
      console.log(`Withdrew ${amount} tokens successfully`);
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      throw error;
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
      await getContractBalance();
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
    stakingBalance,
    getSignerBalance,
    setAPY,
    getAPY,
    stake,
    withdrawing,
    getSignerAddress,
    getSignerStakingBalance,
  };
}
