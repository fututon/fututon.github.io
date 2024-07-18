import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  SendMode
} from "ton-core";

const Opcodes = {
  deploy: 0,
  withdraw: 1,
  place_up: 2,
  place_down: 3,
};

export default class PredictRound implements Contract {

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  async sendPlaceUp(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATLY,
      body: beginCell()
        .storeUint(Opcodes.place_up, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async sendPlaceDown(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      queryID?: number;
    }
  ) {
    await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATLY,
      body: beginCell()
        .storeUint(Opcodes.place_down, 32)
        .storeUint(opts.queryID ?? 0, 64)
        .endCell(),
    });
  }

  async getUpSum(provider: ContractProvider) {
    const { stack } = await provider.get("get_up_sum", []);
    return stack.readBigNumber();
  }

  async getDownSum(provider: ContractProvider) {
    const { stack } = await provider.get("get_down_sum", []);
    return stack.readBigNumber();
  }

  async getID(provider: ContractProvider) {
    const result = await provider.get('get_id', []);
    return result.stack.readNumber();
  }
}
