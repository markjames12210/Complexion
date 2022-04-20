import React, {useState, useEffect} from "react";
import cx from "classnames";
import styles from "./core.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {cleanTxState, submitPayableTx} from "../../features/transaction/transactionActions";
import {ethers} from "ethers";
import {getGameLogicContractProvider} from "../../features/contract/contractReducers";
import complexion from "../../assets/complexion.svg"

type ICoreProps = {}

const defaultProps = {};


type teamData = {
  color: number
  mintPrice: string,
  newPrice: number,
  oldSupply: number,
  nextPrice: number
}

const Core: React.FC<ICoreProps> = (props) => {
  const dispatch = useDispatch();
  const gameLogicContract = useSelector(getGameLogicContractProvider);
  const [winner, setWinner] = useState<{ color: number, round: number, status: boolean }>();

  const [teams, setTeams] = useState<teamData[]>([]);

  useEffect(() => {
    getTeamsData();
    getWinner();
    getPrice(1);
  }, [gameLogicContract]);

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

  const getPrice = async (color) => {
    if (!gameLogicContract) {
      return;
    }
    const priceData = await gameLogicContract.votingPrice(color);
    console.log('PRICE (ETHER) => ', priceData);
    return priceData.toString();
  };

  const getTeamsData = async () => {
    if (!gameLogicContract) {
      return;
    }

    let teams = [];
    const indexes = [1, 2, 3, 4];
    for (const index of indexes) {
      const teamData = await gameLogicContract.colorToNFT(index);
      console.log("TEAM INDEX => ", index, teamData);
      const price = ethers.utils.formatEther(teamData.mintPrice.toString());
      const nextPrice = await gameLogicContract.votingPrice(parseFloat(teamData.color.toString()));
      const team = {
        color: parseInt(teamData.color.toString()),
        mintPrice: price,
        newPrice: parseFloat(price) + parseFloat(price) / 5,
        oldSupply: parseInt(teamData.oldSupply.toString()),
        nextPrice: ethers.utils.formatEther(nextPrice)
      };
      teams.push(team);
    }
    console.log(teams);
    setTeams(teams);
  };

  const vote = async (color) => {
    const price = await getPrice(color);
    console.log(price);
    dispatch(cleanTxState());
    dispatch(submitPayableTx(
      {
        functionName: "voteForColor",
        valueArgs: [
          color
        ],
        overrides: {
          // the value could be a number, or a
          value: price
        },
        name: "Vote",
        contract: gameLogicContract
      }
    ));
  };



  const teamStack = (data: teamData, index: number) => {
    const list = Array.from(Array(data.oldSupply).keys());
    return <div key={index} className={"relative flex flex-col h-32 w-36 mb-10"}>
      {list.map((red, i) => {
        return (
          <React.Fragment>
            <section key={data.oldSupply}>
              <div
                style={{
                  bottom: 23 * i,
                  backgroundColor:
                    index === 0 ? "#F16161" :
                      index === 1 ? "#66B1DC" :
                        index === 2 ? "#7FEFAC" :
                          index === 3 ? "#F9E958" :
                            "white"
                }}
                className={cx("flex items-center justify-center shadow absolute h-32 w-32 rounded", styles.layer)}
              >
                <h2 className={"text-4xl"}>
                  {data.oldSupply}
                </h2>
              </div>
            </section>
          </React.Fragment>
        );
      })}
    </div>;
  };

  const paintWinner = (winner) => {
    return (
      <React.Fragment>
            <span className={"mx-2 border border-black border-2 rounded h-6 w-6"} style={{
              backgroundColor:
                winner.color === 1 ? "#F16161" :
                  winner.color === 2 ? "#66B1DC" :
                    winner.color === 3 ? "#7FEFAC" :
                      winner.color === 4 ? "#F9E958" :
                        "white"
            }} />
      </React.Fragment>
    )
  }

  const traduceColor = (color) => {
    return color === 1 ? "#F16161" :
      color === 2 ? "#66B1DC" :
        color === 3 ? "#7FEFAC" :
          color === 4 ? "#F9E958" :
            "white";
  }

  const traduceTeam = (team) => <>{
    team.color === 1 ? "RED" :
      team.color === 2 ? "BLUE" :
      team.color === 3 ? "GREEN" :
      team.color === 4 ? "YELLOW" : ""
  }</>

  return (
    <section className={"relative flex justify-center items-end h-screen w-screen bg-slate-200"}>

      {winner && winner.status ? <div className={"text-2xl flex justify-center flex-col items-center absolute top-10 items-my-4"}>
          <h3 className={"mb-2 flex items-center"}>Team {paintWinner(winner)} won round {winner.round}</h3>
          <h2>Congrats 🎉</h2>
      </div> :
        <div className={"text-2xl flex justify-center flex-col items-center absolute top-10 items-my-4"}>
          <h3 className={"tracking-wider"}>Wins first team reaching 10</h3>
          <h2 className={"tracking-wider"}>Winner team decides</h2>
        </div>
      }
      <div className="max-w-screen-md pb-14 w-full h-full flex items-end justify-between">
        {teams.length > 0 ? teams.map((team, i) => {

            return <div className={"flex flex-col items-center"}>
              {teamStack(team, i)}
              <section className={"mb-2"}>
{/*                {team.color === winner.color && <div className={"text-6xl my-4"}>
                    🎉
                </div>}*/}
                <h3 className={"text-2xl flex"}>
                  {team.nextPrice} <p className={"pl-2"}>Ξ</p>
                </h3>
              </section>
              <button
                onClick={() => {
                  !winner.status && vote(i + 1);
                }}
                style={{
                  backgroundColor: !winner.status && traduceColor(team.color),
                }}
                className={cx("hover:shadow border-black border tracking-wide border-4 rounded-lg bg-white w-44 h-12 items-center flex justify-center", winner.status && "opacity-40 cursor-default")}>
                <h2 className={"text-gray-800"} style={{
                }}>Vote for {traduceTeam(team)}</h2>
              </button>
            </div>;
          })
          : <div className={"h-full w-full flex flex-col items-center justify-center"}>
            <img src={complexion} alt={""}/>
            <h2 className={"mt-10 text-2xl text-gray-500 tracking-wider"}>Connect your wallet</h2>
          </div>
        }
      </div>
    </section>
  );
};

Core.defaultProps = defaultProps;

export default Core;
