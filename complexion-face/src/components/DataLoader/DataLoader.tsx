import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import AccountService from "../../services/accountService";
import {useWeb3React} from '@web3-react/core';
import {loadCoreData } from "../../features/contract/contractActions";
import {useEagerConnect, useInactiveListener} from '../Web3Provider/hooks';
import { ethers } from 'ethers';

export type DataloaderProps = {}

export const Dataloader: React.FC<DataloaderProps> = (props) => {
  const dispatch = useDispatch()

  const {library, connector} = useWeb3React()

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
    if (library) {
      console.log('Library',library);
      AccountService._initializeEthersContract(library);
      dispatch(loadCoreData());
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <>
      {props.children}
    </>
  );
}

export default Dataloader;
