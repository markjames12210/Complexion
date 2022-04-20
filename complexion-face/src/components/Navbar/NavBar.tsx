import React, { useState, useEffect } from "react";
// @ts-ignore
import styles from "./navbar.module.scss";
import { Link, useLocation } from "react-router-dom";
import { getAddress } from "../../features/account/accountReducers";
import { useDispatch, useSelector } from "react-redux";
import { Account, blockNumber } from "../Web3Provider/DataLoaders/dataLoaders";
import { useWeb3React } from "@web3-react/core";
import { setEthersProvider } from "../../features/contract/contractActions";
import AccountService from "../../services/accountService";
import cx from "classnames";

import {
  getGameLogicContractProvider
} from "../../features/contract/contractReducers";
import { getTxStatus } from "../../features/transaction/transactionReducers";
import { BigNumber } from "ethers";

declare let window: any;
type INavBarProps = {}

const NavBar: React.FC<INavBarProps> = ({}) => {

  const address = useSelector(getAddress);
  const txStatus = useSelector(getTxStatus);

  const dispatch = useDispatch();
  const [isMetamask, setIsMetamask] = useState(true);
  const aBlock = blockNumber();
  const { account, library } = useWeb3React();
  const gameContract = useSelector(getGameLogicContractProvider);

  const [path, setPath] = useState<string>("");
  const [isOwning, setIsOwning] = useState<number>(0);

  const loadLibrary = async () => {
    if (!window.ethereum) {
      setIsMetamask(false);
      return;
    } else {
      window.ethereum.enable()
        .then(() => {
          if (library) {
            dispatch(setEthersProvider(library));
            return AccountService._initializeEthersContract(library);
          }
        }).then(() => {

      }).catch((err: any) => {
        alert("Check your wallet");
      });
    }
  };

  const loadAccountData = async () => {
    if (!gameContract) {
      return;
    }

    /*
        gameContract.callContract(account)
          .then((ownerBalance: BigNumber) => {


          }).catch((err: any) => {
          console.log(err);
        });
    */

  };

  let location = useLocation();

  React.useEffect(() => {
    setPath(location.pathname);
    console.log(location.pathname);
  }, [location]);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.enable();
    }
    loadAccountData();
  }, [gameContract, txStatus]);

  return (
    <React.Fragment>

      {!isMetamask && <div className={"w-full h-full z-50 flex justify-center items-center"}>
        <div onClick={() => setIsMetamask(true)} className="w-full h-full bg-black opacity-40 absolute ">
        </div>

        <div className="bg-white p-6 absolute m-10 border-black">
          <p className={"text-sm pb-6"}>In order to interact with the art piece you need a browser capable of
            connecting to the ethereum blockchain.
          </p>
          <p className={"text-xs text-center border-2 border-black hover:shadow cursor-pointer px-4 py-2"}>Let's
            start
            with <a href="https://metamask.io/">metamask</a></p>
        </div>
      </div>}

      <nav className={styles.navbar}>

        <div className={"px-6 py-4"}>
          {/* LINE */}
          <h1 className={"tracking-wider text-2xl"}>COMPLEXION</h1>
        </div>

        <div className={styles.accountElement}>

          {!!account ?
            <Account /> :
            <button
              className={cx(
                "px-6 py-1 text-sm mt-2", styles.connectBtn
              )}
              onClick={() => {
                loadLibrary();
              }}>
              <h3 className={"tracking-wider"}>Connect</h3>
            </button>
          }

          <div className={styles.userInfo}>
            {!!account ? <>
                {isOwning > 0 && !path?.includes("account") &&
                  <Link className={"text-sm text-gray-500"} to={"/account"}>
                    My account &gt;
                  </Link>}
              </>
              :
              <p className={"text-xs text-gray-500"}>
{/*                Connect your <a className="underline" href="https://metamask.io/" target="_blank">metamask</a>**/}
              </p>
            }
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
};

NavBar.defaultProps = {};

export default NavBar;
