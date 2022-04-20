import { ethers } from "ethers";

export const getProvider = async () => {
  let provider;
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    throw new Error("Web3 Providers not available");
  }
  return provider;
};

export const getSignerAddress = async () => {
  try {
    const provider = await getProvider();
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    return signerAddress;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSigner = async () => {
  try {
    const provider = await getProvider();
    const signer = provider.getSigner();
    return signer;
  } catch (err) {
    console.log(err);
    return null;
  }
};
