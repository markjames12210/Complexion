import React, {useEffect} from 'react'
import {UnsupportedChainIdError, Web3ReactProvider} from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected
} from '@web3-react/injected-connector'
import {ExternalProvider, JsonRpcFetchFunc} from '@ethersproject/providers'
import {getProvider} from "../../../features/contract/contractReducers";
import {useSelector} from 'react-redux'
import {ethers} from "ethers";


function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

export type MainProps = {}


const MainWeb3Wrapper: React.FC<MainProps> = (props) => {
  // const provider = useSelector(getProvider);
  // console.log('WEB3PROVIDER',provider);

  // Inyects the inyectable window.ethereum through the props back
  function getLibrary(provider: any) {
    // if (!provider) {
    //   return;
    // }
    // provider.pollingInterval = 12000;
    return new ethers.providers.Web3Provider(provider);
  }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    return () => {

    };
  }, []);

  return (
    <>
      {<Web3ReactProvider getLibrary={getLibrary}>
        {props.children}
      </Web3ReactProvider>}
    </>
  )
}

export default MainWeb3Wrapper;
