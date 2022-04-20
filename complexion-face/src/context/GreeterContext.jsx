import { ethers } from "ethers";
import React from "react";
import { getProvider } from "../provider";
import { useWallet } from "./WalletContext";
import greeterArtifact from "../abis/Greeter.json";
import deployedAddress from "../helpers/deployedAddress.json";

const initialState = {
  greeting: "",
  updateGreeting: () => {},
};

const GreeterContext = React.createContext(initialState);

export const GreeterProvider = ({ children }) => {
  const { walletAddress } = useWallet();

  const [message, setMessage] = React.useState();
  const [contract, setContract] = React.useState();

  React.useEffect(() => {
    async function init() {
      const _provider = await getProvider();
      const signer = _provider.getSigner();
      const _contract = new ethers.Contract(deployedAddress.Greeter, greeterArtifact.abi, signer);
      setContract(_contract);
      const _greeting = await _contract.greet();
      setMessage(_greeting);
    }
    if (walletAddress) {
      init();
    }
  }, [walletAddress]);

  async function updateGreeting(_greeting) {
    if (contract) {
      try {
        const tx = await contract.setGreeting(_greeting);
        await tx.wait();
        const _newGreeting = await contract.greet();
        setMessage(_newGreeting);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <GreeterContext.Provider
      value={{
        greeting: message || "",
        updateGreeting,
      }}
    >
      {children}
    </GreeterContext.Provider>
  );
};

export const useGreeter = () => React.useContext(GreeterContext);
