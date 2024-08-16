import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type BetsWalletConfig = {};

export function betsWalletConfigToCell(config: BetsWalletConfig): Cell {
    return beginCell().endCell();
}

export class BetsWallet implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new BetsWallet(address);
    }

    static createFromConfig(config: BetsWalletConfig, code: Cell, workchain = 0) {
        const data = betsWalletConfigToCell(config);
        const init = { code, data };
        return new BetsWallet(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
