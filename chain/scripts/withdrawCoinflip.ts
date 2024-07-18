import { Address, toNano } from '@ton/core';
import { Coinflip } from '../wrappers/Coinflip';
import { NetworkProvider, sleep } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Coinflip address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const coinflip = provider.open(Coinflip.createFromAddress(address));

    await coinflip.sendWithdraw(provider.sender(), {
        value: toNano('0.005'),
    });
}
