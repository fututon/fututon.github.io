import { toNano } from '@ton/core';
import { Coinflip } from '../wrappers/Coinflip';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const coinflip = provider.open(
        Coinflip.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('Coinflip')
        )
    );

    await coinflip.sendDeploy(provider.sender(), toNano('0.005'));

    await provider.waitForDeploy(coinflip.address);

    console.log('ID', await coinflip.getID());
}
