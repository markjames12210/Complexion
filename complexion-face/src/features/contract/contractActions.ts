export enum ContractTypes {
  SET_CONTRACT_PROVIDER = 'Contract/set/contract/all',
  SET_ETHERS_PROVIDER = 'Contract/set/ethersProvider',
  IS_COLORS_LOADING = 'Contract/colors/isLoading',
  LOAD_CORE_DATA = 'Contract/load/colorsData',
}

export type IContractActions =
  ISet_ContractProvider |
  IisColorsLoading |
  ILoadCoreData |
  ISetProvider;

export interface ISet_ContractProvider {
  type: ContractTypes.SET_CONTRACT_PROVIDER,
  name: any,
  provider: any,
}
export const setContractProvider = (provider: any, name: string): ISet_ContractProvider => {
  console.log("SET_CONTRACT_PROVIDER ACTION", provider);
  return {
    type: ContractTypes.SET_CONTRACT_PROVIDER,
    provider,
    name,
  }
}

export interface ISetProvider {
  type: ContractTypes.SET_ETHERS_PROVIDER,
  provider: any
}
export const setEthersProvider = (provider: any): ISetProvider => {
  console.log("SET_ETHERS_PROVIDER ACTION", provider);
  return {
    type: ContractTypes.SET_ETHERS_PROVIDER,
    provider
  }
}

export interface ILoadCoreData {
  type: ContractTypes.LOAD_CORE_DATA,
}
export const loadCoreData = (): ILoadCoreData => {
  return {
    type: ContractTypes.LOAD_CORE_DATA,
  }
}

export interface IisColorsLoading {
  type: ContractTypes.IS_COLORS_LOADING,
  isLoading: boolean
}
export const isColorsDataLoading = (isLoading: boolean): IisColorsLoading => {
  return {
    type: ContractTypes.IS_COLORS_LOADING,
    isLoading
  }
}


