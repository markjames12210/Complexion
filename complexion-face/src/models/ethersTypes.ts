interface IOverridesReadOnly {
  from?: string; // msg.sender
  value?: string; // msg.value
}

interface IOverridesWrite {
  from?: string; // msg.sender
  value?: number; // In WEI
  nonce?: string; // msg.value
  gasPrice?: string; // msg.value
  gasLimit?: string; // msg.value
}

export interface IEthersWritePayable {
  functionName: string,
  contract: any,
  valueArgs: Array<any>;
  overrides: any,
}
