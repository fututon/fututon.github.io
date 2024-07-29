import {
  Contract,
  ContractProvider,
  Sender,
  Address,
  Cell,
  contractAddress,
  beginCell,
  SendMode,
  TupleBuilder,
   toNano
} from "ton-core";

const Opcodes = {
  deploy: 0,
  withdraw: 1,
  place_up: 2,
  place_down: 3,
  withdraw_winning: 5
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

  async sendWithdrawWinning(provider: ContractProvider, via: Sender) {
    await provider.internal(via, {
      value: toNano('0.005'),
      sendMode: SendMode.PAY_GAS_SEPARATLY,
      body: beginCell()
        .storeUint(Opcodes.withdraw_winning, 32)
        .storeUint(0, 64)
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
    const args = new TupleBuilder();
    args.writeAddress(playerAddress);
    const result = await provider.get('get_player_info', args.build());

    const flag = result.stack.readBoolean();
    const address = result.stack.readAddress(); // AVOID RERENDER
    const betAmount = result.stack.readNumber();
    const betDirection = result.stack.readNumber();

    return { flag, betAmount, betDirection }
  }

  async getRoundInfo(provider: ContractProvider) {
    const result = await provider.get('get_round_info', []);

    const roundId = result.stack.readNumber();
    const roundState = result.stack.readNumber();
    const upSum = result.stack.readNumber();
    const downSum = result.stack.readNumber();
    const startPrice = result.stack.readNumber();
    const finishPrice = result.stack.readNumber();
    const roundDirection = result.stack.readNumber();

    return { roundId, roundState, upSum, downSum, startPrice, finishPrice, roundDirection };
  }
}
