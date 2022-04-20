import {ofType, Epic} from 'redux-observable'
import { catchError, switchMap, map, mergeMap, tap } from "rxjs/operators";
import {RootState} from "../../store/indexReducers";
import {from, of} from "rxjs";
import {setTxError, setTxFailed, setTxSuccess, setTxTentative, TransactionTypes} from "./transactionActions";
import accountService from "../../services/accountService";
import { loadCoreData, setContractProvider } from "../contract/contractActions";
import { dispatch } from "../../store/store";

export const submitTxPayable_Epic: Epic<any, any, RootState, any> = (
  action$,
  state$: any
) => {
  console.log(action$)
  return action$.pipe(
    ofType(TransactionTypes.SUBMIT_PAYABLE_TX),
    tap(val => console.log(`BEFORE MAP: ${val}`)),
    switchMap((action: any): any => {

      console.log("EPIC", action);
      const contract = state$.value.contractReducer.gameLogicContract;
      return from(accountService.doPayableTransaction(
        {
          functionName: action.functionName,
          valueArgs: action.valueArgs,
          contract: action.contract ? action.contract : contract,
          overrides: action.overrides,
        }
      )).pipe(
        mergeMap((tx: any): any => {
            console.log("EPIC: SUBMIT_PAYABLE_TX SUCCESS => ", tx);
            return of(
              setTxTentative(tx)
            )
          }
        ),
        catchError((err): any => {
            console.log("EPIC: SUBMIT_PAYABLE_TX ERR => ", err);
            if (err && err.message) {
              let message;
              if (err.data && err.data.message) {
                var regexp = new RegExp("([\'])(?:(?=(\\\\?))\\2.)*?\\1", "g");
                const string = regexp.exec(err.data.message);
                console.log('ERROR => ', err.data.message)
                console.log('ERROR => ', string)
                message = string ? string[0].replace("\'", " ") : "Unknown error";
              } else {
                message = err.message.replace(/ *\([^)]*\) */g, "")
              }

              // message = message.replace("Error: VM Exception while processing transaction: reverted with reason string ", "")
              return of(setTxError(message));
            }
            return of(
              setTxError('Transaction error')
            )
          }
        )
      )
    })
  )
}

export const manageOngoingTx_Epic: Epic<any, any, RootState, any> = (
  action$,
  state$: any
) => {
  return action$.pipe(
    ofType(TransactionTypes.SET_TX_TENTATIVE),
    switchMap((action: any): any => {
      const tx = state$.value.transactionReducer.txBeingSent;
      const gameLogic = state$.value.contractReducer.gameLogicContract;
      return from(tx.wait())
        .pipe(
          mergeMap((receipt: any): any => {
              console.log("EPIC: TRANSACTION_RECEIPT => ", receipt);
              if (receipt === 0) {
                return setTxFailed(receipt)
              } else {
                return of(
                  setTxSuccess(receipt),
                  // setContractProvider(gameLogic, 'gameLogicContract'),
              )
              }
            }
          ),
          catchError((err): any => {
              console.log("EPIC: SET_TX_TENTATIVE ERR => ", err);
              let message;
              if (err && err.message) {
                if (err.data && err.data.message) {
                  var regexp = new RegExp("([\'])(?:(?=(\\\\?))\\2.)*?\\1", "g");
                  const string = regexp.exec(err.data.message);
                  console.log('ERROR => ', err.data.message)
                  console.log('ERROR => ', string)
                  message = string ? string[0].replace("\'", " ") : "Unknown error";
                } else {
                  message = err.message.replace(/ *\([^)]*\) */g, "")
                }
                // message = message.replace("Error: VM Exception while processing transaction: reverted with reason string ", "")
              }
              message = message ? message : "Unknown error";
              return of(setTxError(message));
            }
          )
        )
    })
  )
}
