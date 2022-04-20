import {combineEpics, Epic} from 'redux-observable'
import {navigateEpic} from "../features/global/globalEpics";
import {manageOngoingTx_Epic, submitTxPayable_Epic} from '../features/transaction/transactionEpics';
import {loadColorsData_Epic} from "../features/contract/contractEpics";

const rootEpic = combineEpics(
  navigateEpic,
  manageOngoingTx_Epic,
  submitTxPayable_Epic,
  loadColorsData_Epic,
)

console.log('EPICS LOADED');
export default rootEpic
