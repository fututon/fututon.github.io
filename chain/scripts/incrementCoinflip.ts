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

    const counterBefore = await coinflip.getCounter();

    await coinflip.sendIncrease(provider.sender(), {
        increaseBy: 1,
        value: toNano('0.005'),
    });

    ui.write('Waiting for counter to increase...');

    let counterAfter = await coinflip.getCounter();
    let attempt = 1;
    while (counterAfter === counterBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        counterAfter = await coinflip.getCounter();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write('Counter increased successfully!');
}
