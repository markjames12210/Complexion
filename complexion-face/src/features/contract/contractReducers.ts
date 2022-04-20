import { ContractTypes, IContractActions } from "./contractActions";

/* SELECTORS */

export const getGameLogicContractProvider = (state: any) => state.contractReducer.gameLogicContract;
export const getRedContractProvider = (state: any) => state.contractReducer.redContract;
export const getBlueContractProvider = (state: any) => state.contractReducer.blueContract;
export const getYellowContractProvider = (state: any) => state.contractReducer.yellowContract;
export const getGreenContractProvider = (state: any) => state.contractReducer.greenContract;
export const getProvider = (state: any) => state.contractReducer.provider;
export const getTxSentStatus = (state: any) => state.contractReducer.txBeingSent;

/* REDUCER */
export interface IContractState {
  provider: any,
  gameLogicContract: any,
  redContract: any,
  blueContract: any,
  yellowContract: any,
  greenContract: any
}

export const ContractInitialState: IContractState = {
  provider: null,
  gameLogicContract: undefined,
  redContract: undefined,
  blueContract: undefined,
  yellowContract: undefined,
  greenContract: undefined
};

export const contractReducer = (
  state = ContractInitialState,
  action: IContractActions
) => {
  switch (action.type) {
    case ContractTypes.SET_CONTRACT_PROVIDER:
      return {
        ...state,
        [action.name]: action.provider
      };
    case ContractTypes.SET_ETHERS_PROVIDER:
      return {
        ...state,
        provider: action.provider
      };
    default:
      return state;
  }
};
