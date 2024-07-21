import { toNano } from '@ton/core';
import { PredictRound } from '../wrappers/PredictRound';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const predictRound = provider.open(
        PredictRound.createFromConfig(
            {
              deployed: 0,
              round_id: Math.floor(Math.random() * 10000),
              state: 0,
              up_sum: 0,
              down_sum: 0
            },
            await compile('PredictRound')
        )
    );

    await predictRound.sendDeploy(provider.sender(), toNano('0.005'));

    await provider.waitForDeploy(predictRound.address);

    console.log('ID', await predictRound.getID());
}
