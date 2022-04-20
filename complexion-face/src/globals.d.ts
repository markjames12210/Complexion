import {Ethereumish} from "./models/ethereumProviderTypes";

declare global {
  interface Window {
    ethereum: any;
  }

}
declare let window: any;
