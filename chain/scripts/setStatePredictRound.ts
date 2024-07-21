import { Address, toNano } from '@ton/core';
import { TonOracle } from '../wrappers/TonOracle';
import { NetworkProvider, sleep } from '@ton/blueprint';
import {PredictRound} from "../wrappers/PredictRound";

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();
    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('PredictRound address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const newState = await ui.input('PredictRound new state');
    const predictRound = provider.open(PredictRound.createFromAddress(address));

    await predictRound.sendSetState(provider.sender(), {
        state: Number.parseInt(newState),
    });
}
