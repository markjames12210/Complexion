import {history} from '../../services/history'

export const navigateAction = (path: any): any => {
  console.log("NAVIGATE ACTION =>", path)
  return {
    type: 'NAVIGATE',
    path: path
  }
}
