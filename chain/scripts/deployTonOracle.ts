import { toNano, Address } from '@ton/core';
import { TonOracle } from '../wrappers/TonOracle';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tonOracle = provider.open(
        TonOracle.createFromConfig(
            {
                owner: Address.parse('UQC7IWHa_QCcCVpeh8rRxrHhCzswZwMMHPIg9q948LUTrxRb'),
                id: Math.floor(Math.random() * 10000),
                last_price: 10,
            },
            await compile('TonOracle')
        )
    );

    await tonOracle.sendDeploy(provider.sender(), toNano('0.005'));

    await provider.waitForDeploy(tonOracle.address, 20);

    console.log('ID', await tonOracle.getID());
}
