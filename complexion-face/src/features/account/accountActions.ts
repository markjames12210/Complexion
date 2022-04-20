export enum AccountTypes {
  SET_ADDRESS = 'account/address/set',
  SET_PROVIDER = 'account/provider/set',
  SET_WARN = 'account/warn/set',
  SET_NET_ERROR = 'account/error/set',
  SET_CHAIN_ID = 'account/provider/chain/set',
  SUBMIT_ADDRESS = 'account/address/submit',
  IS_PROVIDER = 'account/existProvider',
}

export type IAccountActions =
  ISetAddress |
  ISubmitAddress |
  IIsProvider |
  ISetProvider |
  ISetWarn |
  ISetNetworkError |
  ISetChainId
  ;


export interface ISubmitAddress {
  type: AccountTypes.SUBMIT_ADDRESS
}
export const submitAddress = (): ISubmitAddress => {
  console.log("SUBMIT_ADDRESS ACTION");
  return {
    type: AccountTypes.SUBMIT_ADDRESS,
  }
}


export interface ISetAddress {
  type: AccountTypes.SET_ADDRESS;
  address: string | undefined;
}
export const setAddress = (address: string | undefined): ISetAddress => {
  console.log("SET_ADDRESS ACTION", address);
  return {
    type: AccountTypes.SET_ADDRESS,
    address,
  }
}


export interface IIsProvider {
  type: AccountTypes.IS_PROVIDER;
}
export const isProvider = (): IIsProvider => {
  console.log("IS_PROVIDER_ACTION")
  return {
    type: AccountTypes.IS_PROVIDER,
  }
}


export interface ISetProvider {
  type: AccountTypes.SET_PROVIDER;
  provider: any
}
export const setProvider = (provider: any): ISetProvider => {
  console.log("SET_PROVIDER_ACTION", provider)
  return {
    type: AccountTypes.SET_PROVIDER,
    provider
  }
}


export interface ISetWarn {
  type: AccountTypes.SET_WARN;
  error: string
}
export const setWarn = (error: string): ISetWarn => {
  console.log("SET_WARN_ACTION", error)
  return {
    type: AccountTypes.SET_WARN,
    error
  }
}

export interface ISetNetworkError {
  type: AccountTypes.SET_NET_ERROR;
  error: string
}
export const setNetworkError = (error: string): ISetNetworkError => {
  console.log("SET_NET_ERROR_ACTION", error)
  return {
    type: AccountTypes.SET_NET_ERROR,
    error
  }
}


export interface ISetChainId {
  type: AccountTypes.SET_CHAIN_ID;
  chainId: string
}
export const setChainId = (chainId: string): ISetChainId => {
  console.log("SET_CHAIN_ID ACTION", chainId)
  return {
    type: AccountTypes.SET_CHAIN_ID,
    chainId
  }
}

