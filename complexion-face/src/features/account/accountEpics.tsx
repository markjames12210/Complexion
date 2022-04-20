import {ofType, Epic} from 'redux-observable'
import {catchError, switchMap, map} from 'rxjs/operators'
import {RootState} from "../../store/indexReducers";
import {navigateAction} from "../global/globalActions";
import {AccountTypes, setAddress} from "./accountActions";
import accountService from "../../services/accountService";
import {from} from "rxjs";

/*
export const submitAdress: Epic<any, any, RootState> = (
  action$,
  state$) => {
  return action$.pipe(
    ofType(AccountTypes.SUBMIT_ADDRESS),
    switchMap((action: any): any => {
      return from(accountService.checkAddress()).pipe(
        map((res: any) => {
            return setAddress(res.response)
          }
        ),
        catchError((err): any => {
            return
            // loadFailed()
          }
        )
      )
    })
  )
}*/
