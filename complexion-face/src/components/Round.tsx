import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGameLogicContractProvider } from "../features/contract/contractReducers";
import { ethers } from "ethers";
import { cleanTxState, submitPayableTx } from "../features/transaction/transactionActions";
import {blockNumber} from "./Web3Provider/DataLoaders/dataLoaders";
import Moment from "react-moment";
import {useWeb3React} from "@web3-react/core";
import cx from "classnames";

type IRoundProps = {}

const defaultProps = {};

const Round: React.FC<IRoundProps> = (props) => {
  const {} = props;
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);
  const [round, setRound] = useState(0);

  const nextRound = () => {
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "reset",
        valueArgs: [
          // color
        ],
        overrides: {
          // the value could be a number, or a
          // value: ethers.utils.parseEther()
        },
        name: "Next Round",
        contract: gameLogicContract
      }
    ));
  }



  const [remainingLeassingTime, setRemainingLeassingTime] = useState<any>(null);
  const [remainingResetTime, setRemainingResetTime] = useState<any>();
  const [testTime, setTestTime] = useState<any>(null);
  const blockN = blockNumber();
  const [resetTime, setResetTime] = useState(0);
  const [blockTime, setBlockTime] = useState(0);
  const [winner, setWinner] = useState<{ color: number, round: number, status: boolean }>();


  const {account, library} = useWeb3React();

  const updateBlockTime = async () => {
    const blockTime = await library.getBlock('latest');
    console.log(blockTime.timestamp)
    setBlockTime(blockTime.timestamp);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateBlockTime();
      if (resetTime && blockTime) {
        setRemainingResetTime(<Moment
          format={"D[d] H[h] m[m] s[s]"}
          duration={new Date()}
          date={(new Date((resetTime) * 1000))}
        />);
        setTestTime(new Date((resetTime - blockTime)))
      }
    }, 1000);
    return () => clearInterval(interval);

  }, [blockN]);


  const getWinner = async () => {
    if (!gameLogicContract) {
      return;
    }
    const winnerRound = await gameLogicContract.winningRound();
    const winnerColor = await gameLogicContract.winningColor();
    const winnerStatus = await gameLogicContract.winningStatus();
    console.log('winnerRound => ', parseInt(winnerRound.toString()));
    console.log('winnerColor => ', parseInt(winnerColor.toString()));
    console.log('winnerStatus => ', winnerStatus);

    setWinner({
        color: parseInt(winnerColor.toString()),
        round: parseInt(winnerRound.toString()),
        status: winnerStatus
      }
    );
  };

  useEffect(() => {
    getTeamsData();
    getWinner();
  }, [gameLogicContract]);

  const getTeamsData = async () => {
    if (!gameLogicContract) {
      return;
    }
    const round = await gameLogicContract.roundNumber();
    const resetTime = await gameLogicContract.resetTime();
    console.log("Round => ", round.toString());
    console.log("ResetTime => ", resetTime.toString());

    if (library) {
      const blockTime = await library.getBlock('latest');
      setBlockTime(blockTime.timestamp);
    }

    // setRound(parseInt(round.toString()));
    setRound(parseInt(round.toString()));
    setResetTime(parseInt(resetTime.toString()))
  };

  return (
    <div className={"absolute top-16 left-6 z-10"}>
      <h3>Round: {round}</h3>
      <button
        onClick={() => {
          // vote(i + 1, team.mintPrice);
          nextRound();
        }}
        className={cx("mt-4 hover:shadow border-black border tracking-wide border-4 rounded-lg bg-white w-44 h-12 items-center flex justify-center",
          blockTime > resetTime && winner && !winner.status && "opacity-40 cursor-default")}>
        <h2 className={""}>Next round</h2>
      </button>
      {winner && winner.status && <div className={"mt-4"}>
        <p>Next round will be able to start in:</p>
        <h3 className={"tracking-wider"}>{remainingResetTime}</h3>
      </div>}
    </div>
  );
};

Round.defaultProps = defaultProps;

export default Round;
