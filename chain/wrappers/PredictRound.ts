import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type PredictRoundConfig = {
    id: number;
    up_sum: number;
    down_sum: number;
};

export function predictRoundConfigToCell(config: PredictRoundConfig): Cell {
    return beginCell()
      .storeUint(config.id, 32)
      .storeCoins(config.up_sum)
      .storeCoins(config.down_sum)
      .endCell();
}

export const Opcodes = {
    deploy: 0,
    withdraw: 1,
    place_up: 2,
    place_down: 3,
};

export class PredictRound implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new PredictRound(address);
    }

    static createFromConfig(config: PredictRoundConfig, code: Cell, workchain = 0) {
        const data = predictRoundConfigToCell(config);
        const init = { code, data };
        return new PredictRound(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              // .storeUint(Opcodes.deploy, 32)
              // .storeUint(opts.queryID ?? 0, 64) TODO: ???? зачем
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
}
