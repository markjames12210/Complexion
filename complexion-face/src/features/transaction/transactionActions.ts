import AccountService from "../../services/accountService";

export enum TransactionTypes {
  SET_TX_FAILED = 'Transaction/failed',
  SET_TX_ERRROR = 'Transaction/error',
  SUBMIT_PAYABLE_TX = 'Contract/tx/submit',
  SET_TX_TENTATIVE = 'Contract/tx/set/tentative',
  SET_TX_SUCCESS = 'Contract/tx/set/success',
  CLEAN_TX_STATE = 'Contract/tx/clean',
}

export type ITransactionActions =
  IsetTxFailed |
  ISetTxTentative |
  IsetTxSuccess |
  IcleanTxState |
  IsetTxError |
  ISubmitPayableTx
  ;

export interface ISubmitPayableTx {
  type: TransactionTypes.SUBMIT_PAYABLE_TX,
  functionName: string,
  valueArgs: Array<any>;
  overrides?: any;
  name?: string;
  contract?: string,
}

export const submitPayableTx = (
  {
    functionName,
    valueArgs,
    overrides,
    name,
    contract,
  }: {
    functionName: string,
    valueArgs: Array<any>,
    overrides?: any,
    name?: string,
    contract?: string,
  }
): ISubmitPayableTx => {
  console.log("SUBMIT_PAYABLE_TX ACTION", {
    valueArgs,
    functionName,
    overrides,
    name,
    contract
  });
  return {
    type: TransactionTypes.SUBMIT_PAYABLE_TX,
    valueArgs,
    functionName,
    overrides,
    name,
    contract,
  }
}


export interface ISetTxTentative {
  type: TransactionTypes.SET_TX_TENTATIVE,
  tx: any,
}

export const setTxTentative = (
  tx: any,
): ISetTxTentative => {
  console.log("SET_TX_TENTATIVE ACTION", tx);
  return {
    type: TransactionTypes.SET_TX_TENTATIVE,
    tx,
  }
}


export interface IsetTxFailed {
  type: TransactionTypes.SET_TX_FAILED,
  txReceipt: any
}

export const setTxFailed = (
  txReceipt?: any
): IsetTxFailed => {
  console.log("SET_TX_FAILED ACTION", txReceipt);
  return {
    type: TransactionTypes.SET_TX_FAILED,
    txReceipt
  }
}

export interface IsetTxError {
  type: TransactionTypes.SET_TX_ERRROR,
  error: string
}

export const setTxError = (
  error: string
): IsetTxError => {
  console.log("SET_TX_ERRROR ACTION", error);
  return {
    type: TransactionTypes.SET_TX_ERRROR,
    error
  }
}


export interface IsetTxSuccess {
  type: TransactionTypes.SET_TX_SUCCESS,
  txReceipt: any
}

export const setTxSuccess = (
  txReceipt: any
): IsetTxSuccess => {
  console.log("SET_TX_SUCCESS ACTION", txReceipt);
  // TODO: remove in production
  window.location.reload();
  return {
    type: TransactionTypes.SET_TX_SUCCESS,
    txReceipt
  }
}


export interface IcleanTxState {
  type: TransactionTypes.CLEAN_TX_STATE,
}

export const cleanTxState = (): IcleanTxState => {
  console.log("CLEAN_TX_STATE ACTION");
  return {
    type: TransactionTypes.CLEAN_TX_STATE,
  }
}
