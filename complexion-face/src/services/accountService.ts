import {ethers} from "ethers";
import contractAddresses from "../contracts/contracts-address.json";
import GameLogicArtifact from "../contracts/GameLogic.json";
import RedArtifact from "../contracts/Red.json";
import BlueArtifact from "../contracts/Blue.json";
import YellowArtifact from "../contracts/Yellow.json";
import GreenArtifact from "../contracts/Green.json";
import {dispatch} from "../store/store";
import {
  setContractProvider
} from "../features/contract/contractActions";
import {IEthersWritePayable} from "../models/ethersTypes";

export default class AccountService {

  static async _initializeEthersContract(provider: any) {

    // GAME LOGIC
    const gameLogic = new ethers.Contract(
      contractAddresses.GameLogic,
      GameLogicArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: GAME LOGIC CONTRACT PROVIDER => ", gameLogic);
    dispatch(setContractProvider(gameLogic, 'gameLogicContract'));

    // RED
    const redContract = new ethers.Contract(
      contractAddresses.Red,
      RedArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: RED CONTRACT PROVIDER => ", redContract);
    dispatch(setContractProvider(redContract, 'redContract'));

    // BLUE
    const blueContract = new ethers.Contract(
      contractAddresses.Blue,
      BlueArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: BLUE CONTRACT PROVIDER => ", blueContract);
    dispatch(setContractProvider(blueContract, 'blueContract'));

    // YELLOW
    const yellowContract = new ethers.Contract(
      contractAddresses.Yellow,
      YellowArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: YELLOW LOGIC CONTRACT PROVIDER => ", yellowContract);
    dispatch(setContractProvider(yellowContract, 'yellowContract'));

    // GREEN
    const greenContract = new ethers.Contract(
      contractAddresses.Green,
      GreenArtifact.abi,
      provider.getSigner(0)
    );

    console.log("ETHERS: GREEN LOGIC CONTRACT PROVIDER => ", greenContract);
    dispatch(setContractProvider(greenContract, 'greenContract'));

  }

  // Ethers payable tx
  // https://docs.ethers.io/v5/api/contract/contract/#Contract--write
  static async doPayableTransaction(
    {
      functionName: functionName,
      contract: contract,
      valueArgs: valueArgs,
      overrides: overrides
    }: IEthersWritePayable
  ) {

    if (!contract) {
      throw new Error('Not available contract ethers')
    }
    console.log(contract);
    // We send the transaction, and save its hash in the Dapp's state. This
    // way we can indicate that we are waiting for it to be mined.

    console.log("PAYABLE TRANSACTION NAME", functionName);
    console.log("PAYABLE TRANSACTION VALUES", valueArgs);
    console.log("PAYABLE TRANSACTION OVERRIDES", overrides);


    let elements;
    if (overrides) {
      elements = [...valueArgs, overrides]
    } else {
      elements = [...valueArgs]
    }

/*    console.log("DATA", ...elements);

    const gasPrice = await contract.estimateGas[functionName](...elements);
    console.log("ESTIMATED GAS => ", gasPrice);*/

    // To send an specific ammount you have to add the overrides to the function calling the contract.
    const tx = await contract[functionName](
      ...elements
    );

    console.log("TRANSACTION_METADA => ", tx);

    return tx;
  }
}
