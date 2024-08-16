import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano, TupleBuilder
} from '@ton/core';

export type PredictRoundConfig = {
    deployed: number;
    round_id: number;
    state: number;
    up_sum: number;
    down_sum: number;
    bets_wallet_code: Cell
};

export function predictRoundConfigToCell(config: PredictRoundConfig): Cell {
    console.log("PDPASA", config)



      // .store_ref(bets_wallet_code)
      // .store_uint(deployed, 32)
      // .store_slice(owner_address)
      // .store_uint(round_id, 32)
      // .store_uint(state,32)


    //   ;; .store_ref(bets_wallet_code)
    //   .store_uint(deployed, 32)
    //   ;; .store_slice(owner_address)
    //   .store_uint(round_id, 32)
    //   .store_uint(state,32)
    //   .store_coins(marketmaker_bet_amount)
    //   .store_coins(up_sum)
    //   .store_coins(down_sum)
    //   .store_coins(start_price)
    //   .store_coins(finish_price)
    //   .store_uint(round_direction, 32)
    //   .store_uint(commission, 32)
    //   .store_dict(bets)


    return beginCell()
      .storeUint(0, 32) // deployed
      .storeAddress(Address.parse('0QCKzlvU69-kdaDaJf9r_yWUaCBZZpm3mP9yNp2oL_LRkk0j'))
      .storeUint(Math.floor(Math.random() * 10000), 32)
      .storeUint(1, 32) // state
      .storeCoins(0) // marketmaker_bet_amount
      .storeCoins(0) // up_sum
      .storeCoins(0) // down_sum

      .storeCoins(0) // start_price
      .storeCoins(0) // finish_price
      .storeUint(0, 32) // round_direction
      .storeUint(10, 32) // commission
      .storeDict(null)
      .storeRef(config.bets_wallet_code)
      .endCell()


      // .storeRef(config.bets_wallet_code)
      // .storeUint(config.deployed, 32)
      // .storeAddress(Address.parse('0QCKzlvU69-kdaDaJf9r_yWUaCBZZpm3mP9yNp2oL_LRkk0j'))
      // .storeUint(config.round_id, 32)
      // .storeCoins(config.state)
      // .storeCoins(config.up_sum)
      // .storeCoins(config.down_sum)
      // .endCell();
}

export const Opcodes = {
    deploy: 0,
    withdraw: 1,
    place_up: 2,
    place_down: 3,
    test: 4,
    withdraw_winning: 5,
    set_state: 6,
    start_round: 7,
    finish_round: 8,
    finish_betting: 9,
    start_betting: 10,
    withdraw_commission: 11
};

export class PredictRound implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PredictRound(address);
    }

    static createFromConfig(config: PredictRoundConfig, code: Cell, workchain = 0) {
        console.log("ASASDS", config)

        const data = predictRoundConfigToCell(config);

        console.log("111ASASDS", data)



        const init = { code, data };
        return new PredictRound(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.deploy, 32)
              .storeUint(0, 64) // TODO: ???? зачем
              .endCell(),
        });
    }

    async sendTest(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.test, 32)
              .endCell(),
        });
    }

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
            sendMode: SendMode.PAY_GAS_SEPARATELY,
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
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.place_down, 32)
              .storeUint(opts.queryID ?? 0, 64)
              .endCell(),
        });
    }

    async sendSetState(
      provider: ContractProvider,
      via: Sender,
      opts: {
          state: number;
          queryID?: number;
      }
    ) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.set_state, 32)
              .storeUint(opts.queryID ?? 0, 64)
              .storeInt(opts.state, 32)
              .endCell(),
        });
    }

    async sendWithdrawWinning(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.withdraw_winning, 32)
              .storeUint(0, 64)
              .endCell(),
        });
    }

    async sendWithdrawCommission(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.withdraw_commission, 32)
              .storeUint(0, 64)
              .endCell(),
        });
    }

    async sendStartRound(provider: ContractProvider, via: Sender, opts: {
        start_price: bigint;
        queryID?: number;
    }) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.start_round, 32)
              .storeUint(opts.queryID ?? 0, 64)
              .storeCoins(opts.start_price)
              .endCell(),
        });
    }

    async sendFinishRound(provider: ContractProvider, via: Sender, opts: {
        finish_price: bigint;
        queryID?: number;
    }) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.finish_round, 32)
              .storeUint(opts.queryID ?? 0, 64)
              .storeCoins(opts.finish_price)
              .endCell(),
        });
    }

    async getUpSum(provider: ContractProvider) {
        const result = await provider.get('get_up_sum', []);
        return result.stack.readNumber();
    }

    async getDownSum(provider: ContractProvider) {
        const result = await provider.get('get_down_sum', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }

    async getOwner(provider: ContractProvider) {
        const result = await provider.get('get_owner', []);
        return result.stack.readAddress();
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
        const finishPrice = result.stack.readNumber();
        const roundDirection = result.stack.readNumber();

        return [roundId, roundState, upSum, downSum, startPrice, finishPrice, roundDirection];
    }
}
