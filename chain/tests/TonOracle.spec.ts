import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { TonOracle } from '../wrappers/TonOracle';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('TonOracle', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('TonOracle');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tonOracle: SandboxContract<TonOracle>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        tonOracle = blockchain.openContract(
            TonOracle.createFromConfig(
                {
                    owner: deployer.address,
                    id: 0,
                    last_price: 12,
                },
                code
            )
        );

        const deployResult = await tonOracle.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonOracle.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tonOracle are ready to use
    });

    it('should increase counter', async () => {
        const deployer = await blockchain.treasury('deployer');

        const counterBefore = await tonOracle.getLastPrice();
        console.log('last price before', counterBefore);


        const increaseResult = await tonOracle.sendSetLastPrice(deployer.getSender(), {
            newLastPrice: 124.0,
            value: toNano('0.05'),
        });

        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: tonOracle.address,
            success: true,
        });

        const counterAfter = await tonOracle.getLastPrice();
        console.log('last price after', counterAfter);
        expect(counterAfter).toBe(124);
    });
});
