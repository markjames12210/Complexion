import {TransactionTypes, ITransactionActions} from "./transactionActions";

/* SELECTORS */

export const getTxStatus = (state: any) => state.transactionReducer;

/* REDUCER */

export interface ITransactionState {
  hasFailed: boolean,
  receipt: any,
  txName: undefined | string,
  isOngoingTx: boolean,
  isMined: boolean,
  txBeingSent: any,
  transactionError: any,
  txReceipt: any
}

export const TransactionInitialState: ITransactionState = {
  hasFailed: false,
  txName: undefined,
  receipt: null,
  isOngoingTx: false,
  isMined: true,
  txBeingSent: null,
  transactionError: false,
  txReceipt: null
}

export const transactionReducer = (
  state = TransactionInitialState,
  action: ITransactionActions,
) => {
  switch (action.type) {
    case TransactionTypes.SUBMIT_PAYABLE_TX:
      console.log("REDUCER SUBMIT_PAYABLE_TX =>", action)
      return {
        ...state,
        isOngoingTx: true,
        isMined: false,
        txName: action.name ? action.name : ""
      }
    case TransactionTypes.SET_TX_TENTATIVE:
      return {
        ...state,
        hasFailed: false,
        txName: undefined,
        receipt: null,
        isOngoingTx: false,
        isMined: true,
        transactionError: false,
        txReceipt: null,
        txBeingSent: action.tx,
      }
    case TransactionTypes.SET_TX_FAILED:
      return {
        ...state,
        isMined: true,
        transactionError: true,
        txReceipt: action.txReceipt,
        txBeingSent: undefined,
      }
    case TransactionTypes.SET_TX_ERRROR:
      return {
        ...state,
        isMined: true,
        transactionError: action.error,
      }
    case TransactionTypes.SET_TX_SUCCESS:
      return {
        ...state,
        isMined: true,
        txReceipt: action.txReceipt,
        txBeingSent: null,
      }
    case TransactionTypes.CLEAN_TX_STATE:
      return {
        ...state,
        hasFailed: false,
        txName: undefined,
        receipt: null,
        isOngoingTx: false,
        isMined: true,
        txBeingSent: null,
        transactionError: null,
        txReceipt: null
      }
    default:
      return state
  }
}
