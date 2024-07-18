import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TonOracleConfig = {
    owner: Address,
    id: number;
    last_price: number;
};

export function tonOracleConfigToCell(config: TonOracleConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeUint(config.id, 32)
        .storeUint(config.last_price, 32)
        .endCell();
}

export const Opcodes = {
    deploy: 0,
    set_last_price: 1,
};

export class TonOracle implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TonOracle(address);
    }

    static createFromConfig(config: TonOracleConfig, code: Cell, workchain = 0) {
        const data = tonOracleConfigToCell(config);
        const init = { code, data };
        return new TonOracle(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendSetLastPrice(
        provider: ContractProvider,
        via: Sender,
        opts: {
            newLastPrice: number;
            value: bigint;
            queryID?: number;
        }
    ) {
        await provider.internal(via, {
            value: opts.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(Opcodes.set_last_price, 32)
                .storeUint(opts.queryID ?? 0, 64)
                .storeUint(opts.newLastPrice, 32)
                .endCell(),
        });
    }

    async getLastPrice(provider: ContractProvider) {
        const result = await provider.get('get_last_price', []);
        return result.stack.readNumber();
    }

    async getID(provider: ContractProvider) {
        const result = await provider.get('get_id', []);
        return result.stack.readNumber();
    }
}
