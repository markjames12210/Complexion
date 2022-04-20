import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getTxStatus} from "../../features/transaction/transactionReducers";
import {cleanTxState} from "../../features/transaction/transactionActions";

// import telegram from "../../assets/svgs/telegram.svg"

type ITxUiProps = {}

const defaultProps = {}

const TxUi: React.FC<ITxUiProps> = (props) => {
  const {} = props;
  const txStatus = useSelector(getTxStatus);
  const dispatch = useDispatch();

  useEffect(() => {

  }, [txStatus]);

  return (
    <div>
      {txStatus.isOngoingTx && <section
          className="absolute rounded-xl border border-4 top-4 right-4
     border border-black shadow bg-white z-50 w-1/3
     px-4 pb-2 pt-6 max-w-xs
     ">
          <button
              onClick={() => dispatch(cleanTxState())}
              className="text-xs font-black absolute top-2 right-2 cursor-pointer">X
          </button>
        {txStatus.txName && <>
            <p className="text-sm text-black font-semibold">{txStatus.txName}</p>
          {!txStatus.isMined && <p className="text-sm text-gray-500">
              On-going tx
          </p>}
        </>
        }

          <div className={"mb-2"}>
            {txStatus.txBeingSent ? <p className="text-sm">
                <a href={"https://etherscan.io/txsPending/" + txStatus.txBeingSent.hash}>
                  {
                    `${txStatus.txBeingSent.hash.substring(0, 6)}...${txStatus.txBeingSent.hash.substring(txStatus.txBeingSent.hash.length - 4)}`
                  }
                </a>
              </p> :
              (!txStatus.isMined && <p className="text-sm text-gray-500">
                  Waiting wallet
              </p>)
            }
          </div>
        {
          txStatus.isMined && <>
                <p className="text-sm text-gray-700"> - Transaction -</p>
                <div className="text-sm text-gray-700">


                  {txStatus.txReceipt?.transactionHash && !txStatus.transactionError ? <>
                      <p className="text-xs text-gray-700">Success</p>
                      <a
                        className="underline"
                        href={"https://etherscan.io/txsPending/" + txStatus.txReceipt?.transactionHash}>
                  <span
                    className="text-sm">
                  {`${txStatus.txReceipt?.transactionHash.substring(0, 6)}...${txStatus.txReceipt?.transactionHash.substring(
                    txStatus.txReceipt?.transactionHash.length - 4
                  )}`}
                </span>
                      </a>
                    </>
                    :
                    <>
                      <p className="text-sm text-gray-700">
                        <span className="text-sm">Failed:</span>
                      </p>
                    </>
                  }

                  {
                    <>
                      {
                        txStatus.transactionError ?
                          <>
                            <div>
                              <p className="text-xs my-2">{txStatus.transactionError}</p>
                            </div>

                            {
                              txStatus.txReceipt?.transactionHash &&
                                <p>
                            <span
                                className="text-sm">
                    {`${txStatus.txReceipt?.transactionHash.substring(0, 6)}...${txStatus.txReceipt?.transactionHash.substring(
                      txStatus.txReceipt?.transactionHash.length - 4
                    )}`}
                  </span>
                                </p>
                            }

                          </> :
                          <>
                            {txStatus.txReceipt?.message && <p>{txStatus.txReceipt?.message}</p>}
                          </>
                      }
                    </>
                  }
                </div>
            </>
        }

      </section>}
    </div>
  )
}

TxUi.defaultProps = defaultProps;

export default TxUi
