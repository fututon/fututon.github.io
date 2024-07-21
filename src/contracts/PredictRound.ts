import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  SendMode,
  TupleBuilder
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
        // .storeUint(opts.queryID ?? 0, 64)
        .storeStringTail("Place Up")
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
        .storeStringTail("Place Down")
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

  async getPlayerInfo(provider: ContractProvider, playerAddress: Address) {
    const args= new TupleBuilder();
    args.writeAddress(playerAddress);

    const result = await provider.get('get_player_info', args.build());

    const flag = result.stack.readBoolean();
    const address = result.stack.readAddress();
    const betAmount = result.stack.readNumber();
    const betDirection = result.stack.readNumber();
    return [flag, address, betAmount, betDirection]
  }

  async getRoundInfo(provider: ContractProvider) {
    const result = await provider.get('get_round_info', []);

    const roundId = result.stack.readNumber();
    const roundState = result.stack.readNumber();
    const upSum = result.stack.readNumber();
    const downSum = result.stack.readNumber();
    const startPrice = result.stack.readNumber();
    const endPrice = result.stack.readNumber();

    return [roundId, roundState, upSum, downSum, startPrice, endPrice];
  }
}
