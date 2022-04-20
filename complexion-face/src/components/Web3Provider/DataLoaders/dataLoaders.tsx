import {useWeb3React} from "@web3-react/core";
import React, {useState} from "react";
import {formatEther} from "@ethersproject/units";

export function ChainId() {
  const { chainId } = useWeb3React()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ''}</span>
    </>
  )
}

export function blockNumber() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { chainId, library } = useWeb3React();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [blockNumber, setBlockNumber] = React.useState<number | null>()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect((): any => {
    if (!!library) {
      let stale = false

      library
        .getBlockNumber()
        .then((blockNumber: number) => {
          if (!stale) {
            setBlockNumber(blockNumber)
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockNumber(null)
          }
        })

      const updateBlockNumber = (blockNumber: number) => {
        setBlockNumber(blockNumber)
      }
      library.on('block', updateBlockNumber)

      return () => {
        stale = true
        library.removeListener('block', updateBlockNumber)
        setBlockNumber(undefined)
      }
    }
  }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return blockNumber === null ? 'Error' : blockNumber ?? '';
}


/*
export function blockTimeStamp(): number | null | string {
  const { chainId, library } = useWeb3React();

  const [blockTimeStamp, setBlockTimeStamp] = useState<number | null>();
  React.useEffect((): any => {
    if (!!library) {
      let stale = false

      library
        .getBlock('latest')
        .then((block: any) => {
          console.log(block);
          if (!stale) {
            setBlockTimeStamp(block)
          }
        })
        .catch(() => {
          if (!stale) {
            setBlockTimeStamp(null)
          }
        })


      const updateBlockNumber = (blockNumber: number) => {
        console.log('Library block => ',blockNumber);
        // setBlockTimeStamp(blockNumber)
      }

      library.on('block', updateBlockNumber)

      return () => {
        stale = true
        library.removeListener('block', updateBlockNumber)
        setBlockTimeStamp(undefined)
      }
    }
  }, [library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return blockTimeStamp === null ? 'Error' : blockTimeStamp ?? '';
}*/

export function Account() {
  const { account } = useWeb3React()

  return (
    <>
      {/*<span>Address: </span>*/}
      <h5 className="tracking-wider">
        {account === null
          ? '-'
          : account
            ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
            : ''}
      </h5>
    </>
  )
}

export function Balance() {
  const { account, library, chainId } = useWeb3React()

  const [balance, setBalance] = React.useState<number | null>()
  React.useEffect((): any => {
    if (!!account && !!library) {
      let stale = false

      library
        .getBalance(account)
        .then((balance: any) => {
          if (!stale) {
            setBalance(balance)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })

      return () => {
        stale = true
        setBalance(undefined)
      }
    }
  }, [account, library, chainId]) // ensures refresh if referential identity of library doesn't change across chainIds

  return (
    <>
      <span>Balance</span>
      <span role="img" aria-label="gold">
        💰
      </span>
      <span>{balance === null ? 'Error' : balance ? `Ξ${formatEther(balance)}` : ''}</span>
    </>
  )
}
