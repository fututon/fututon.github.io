import { Address, toNano } from '@ton/core';
import { TonOracle } from '../wrappers/TonOracle';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('TonOracle address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const coinflip = provider.open(TonOracle.createFromAddress(address));

    await coinflip.sendSetLastPrice(provider.sender(), {
        newLastPrice: 177,
        value: toNano('0.005'),
    });
}
