import {createStore, applyMiddleware, compose, Store} from 'redux'
import {composeWithDevTools, devToolsEnhancer} from 'redux-devtools-extension'
import {createEpicMiddleware, Epic} from 'redux-observable'
import rootReducer, {RootState} from './indexReducers'
import rootEpic from './indexEpics'
import {history} from '../services/history'

let store:Store<RootState>|null  = null

const epicMiddleware = createEpicMiddleware<any, any, RootState, any>({
  dependencies: {
    history: history
  }
})

function configureStore() {
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(epicMiddleware), devToolsEnhancer({}))
  )
  epicMiddleware.run(rootEpic)
  return store
}


export function dispatch(action:any){
  return store?.dispatch(action)
}

export default function getStore() {
  if (store === null) {
    store = configureStore();
  }
  return store;
}
