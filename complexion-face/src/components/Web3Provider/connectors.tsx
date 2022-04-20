import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'


const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: any } = {
  1: process.env.REACT_APP_RPC_URL_3,
  4: process.env.REACT_APP_RPC_URL_31337,
}

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 31337, 80001] })

/*export const network = new NetworkConnector({
  urls: {
    1: RPC_URLS[1],
    4: RPC_URLS[4]
  },
  defaultChainId: 1
})*/
