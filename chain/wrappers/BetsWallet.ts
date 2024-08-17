import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
    Dictionary
} from '@ton/core';

export const Opcodes = {
    deploy: 0,
    add_round: 1
};

export type BetsWalletConfig = {
    owner_address: Address
};

export function betsWalletConfigToCell(config: BetsWalletConfig): Cell {
    return beginCell()
      .storeAddress(config.owner_address)
      .storeDict(null)
      .endCell();
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

    async sendAddRound(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: toNano(0.005),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
              .storeUint(Opcodes.add_round, 32)
              .storeUint(0, 64)
              .endCell(),
        });
    }

    async getRounds(provider: ContractProvider) {
        const result = await provider.get('get_rounds', []);
        let cell = result.stack.readCell();
        let dict = cell.beginParse().loadDictDirect(Dictionary.Keys.Uint(256), Dictionary.Values.Address());
        return dict.values();
    }
}
