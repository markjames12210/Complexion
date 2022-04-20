import {ofType, Epic} from 'redux-observable'
import {catchError, switchMap, map, mergeMap} from 'rxjs/operators'
import {RootState} from "../../store/indexReducers";
import accountService from "../../services/accountService";
import {from, of} from "rxjs";
import {setTxFailed, setTxSuccess, setTxTentative, TransactionTypes} from '../transaction/transactionActions';
import {ContractTypes, isColorsDataLoading} from './contractActions';
import {ethers} from "ethers";

export const loadColorsData_Epic: Epic<any, any, RootState, any> = (
  action$,
  state$: any
) => {
  return action$.pipe(
    ofType(ContractTypes.LOAD_CORE_DATA),
    switchMap((action: any): any => {
/*      const redContract = state$.value.contractReducer.redContract;
      const blueContract = state$.value.contractReducer.blueContract;
      const yellowContract = state$.value.contractReducer.yellowContract;
      const greenContract = state$.value.contractReducer.greenContract;*/
      const gameLogic = state$.value.contractReducer.gameLogicContract;
      console.log('EPIC: LOAD_CORE_DATA')
      return from(
        Promise.all([
/*          redContract.totalSupply(),
          blueContract.totalSupply(),
          yellowContract.totalSupply(),
          greenContract.totalSupply(),*/
          // gameLogic.MAX_COLORS(),
        ])
      ).pipe(
        mergeMap((response: any): any => {

          console.log(response);

            return of(
              isColorsDataLoading(false)
            )

          }
        ),
        catchError((err): any => {
            console.log("EPIC: LOAD_CORE_DATA ERR => ", err);
            return of(
              // setPixels(allPixels)
            )
          }
        )
      )
    })
  )
}
