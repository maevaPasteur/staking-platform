import { ethers } from "ethers";

export function useFormatToken() {
  const formatToken = (value) => {
    return value
      ? parseFloat(ethers.utils.formatEther(value)).toFixed(2)
      : "0.00";
  };

  return {
    formatToken,
  };
}
