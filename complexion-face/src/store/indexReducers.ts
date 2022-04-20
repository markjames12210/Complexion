import {combineReducers} from 'redux'
import {accountReducer} from '../features/account/';
import {contractReducer} from "../features/contract";
import { transactionReducer } from '../features/transaction';

const rootState = {
  accountReducer,
  contractReducer,
  transactionReducer,
}

const rootReducer = combineReducers(rootState)

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

console.log('REDUCERS LOADED')
