import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, fromNano } from '@ton/core';
import { PredictRound } from '../wrappers/PredictRound';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('PredictRound', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('PredictRound');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let predictRound: SandboxContract<PredictRound>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        predictRound = blockchain.openContract(
            PredictRound.createFromConfig(
                {
                    deployed: 0,
                    round_id: 0,
                    state: 0,
                    up_sum: 0,
                    down_sum: 0
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        console.log(deployer.address)

        const deployResult = await predictRound.sendDeploy(deployer.getSender(), toNano('0.05'));

        console.log(deployResult)

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: predictRound.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and predictRound are ready to use
    });

    it('should place up', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            console.log("asdasd")

            const increaser = await blockchain.treasury('increaser' + i);
            const balance = await increaser.getBalance()

            const counterBefore = await predictRound.getUpSum();

            console.log('counter before increasing', counterBefore, balance);

            const increaseBy = Math.random() + 0.1;

            console.log('increasing by', increaseBy, toNano(increaseBy));

            const increaseResult = await predictRound.sendPlaceUp(increaser.getSender(), {
                value: toNano(increaseBy),
            });

            console.log(increaseResult)

            // expect(increaseResult.transactions).toHaveTransaction({
            //     from: increaser.address,
            //     to: predictRound.address,
            //     success: true,
            // });

            const counterAfter = await predictRound.getUpSum();

            console.log('counter after increasing', counterAfter);

            const info = await predictRound.getPlayerInfo(increaser.address);

            console.log('info', info);

            const roundInfo = await predictRound.getRoundInfo();

            console.log('roundInfo', roundInfo);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });

    it('lol', async () => {
        const wallet = await blockchain.treasury('wallet');
        const balance = await wallet.getBalance();
        console.log('Balane', balance);

        const result = await predictRound.sendTest(wallet.getSender());
        console.log(result)


        const owner = await predictRound.getOwner();
        console.log(owner)



    });
});
