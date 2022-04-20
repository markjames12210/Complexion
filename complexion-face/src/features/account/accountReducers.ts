import {AccountTypes, IAccountActions} from "./accountActions";

/* SELECTORS */

export const getAddress = (state: any) => state.accountReducer.selectedAddress;
export const getAccount = (state: any) => state.accountReducer;
export const getNetworkError = (state: any) => state.accountReducer.networkError;

/* REDUCER */

export interface IAccountState {
  tokenData: undefined,
  // The user's address and balance
  selectedAddress: string | undefined,
  isChecking: boolean,
  isProvider: string,
  balance: undefined,
  chainId: string | undefined,
  // The ID about transactions being sent; and any possible error with them
  networkError: undefined,
  provider: any,
  error: string | null
}

export const accountInitialState: IAccountState = {
  tokenData: undefined,
  // The user's address and balance
  selectedAddress: undefined,
  isChecking: false,
  isProvider: "",
  balance: undefined,
  chainId: undefined,
  // The ID about transactions being sent, and any possible error with them
  networkError: undefined,
  provider: null,
  error: null
}

export const accountReducer = (
  state = accountInitialState,
  action: IAccountActions,
) => {
  switch (action.type) {
    case AccountTypes.SET_ADDRESS:
      return {
        ...state,
        isChecking: false,
        selectedAddress: action.address,
      }
    case AccountTypes.SUBMIT_ADDRESS:
      return {
        ...state,
        isChecking: true
      }
    case AccountTypes.SET_PROVIDER:
      return {
        ...state,
        provider: action.provider,
      }
    case AccountTypes.SET_WARN:
      return {
        ...state,
        error: action.error,
      }
    case AccountTypes.SET_NET_ERROR:
      return {
        ...state,
        networkError: action.error,
      }
    case AccountTypes.SET_CHAIN_ID:
      return {
        ...state,
        chainId: action.chainId,
      }
    default:
      return state
  }
}
