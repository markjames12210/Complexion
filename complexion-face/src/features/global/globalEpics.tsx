import {ofType, Epic} from 'redux-observable'
import {catchError, switchMap, map, tap, ignoreElements} from 'rxjs/operators'
import {RootState} from "../../store/indexReducers";

export const navigateEpic: Epic<any, any, RootState> = (
  action$,
  state$,
  dependencies
) => {
  return action$.pipe(
    ofType('NAVIGATE'),
    tap((action: any): any => {
        console.log('navigate EPIC => ', action.path);
        dependencies.history.push(action.path)
      }
    ),
    ignoreElements(),
  )
}
