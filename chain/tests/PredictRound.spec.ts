import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano, fromNano } from '@ton/core';
import { PredictRound } from '../wrappers/PredictRound';
import { BetsWallet } from '../wrappers/BetsWallet';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('PredictRound', () => {
    let code: Cell;
    let betsWalletCode: Cell;

    beforeAll(async () => {
        code = await compile('PredictRound');
        betsWalletCode = await compile('BetsWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let predictRound: SandboxContract<PredictRound>;

    let dupmResult = (r:any) => {
        console.log("DUMP")

        // console.log(Object.keys(r))
        // console.log(r.result)

        // console.log("transactions: ", r.transactions.length)


        let tr = r.transactions[1]

        console.log(Object.keys(tr))
        console.log(tr.address)
        console.log(tr.debugLogs)
            // console.log(tr.blockchainLogs)
        console.log(tr.vmLogs)


        // r.transactions.forEach((tr: any) => {
        //     // console.log(Object.keys(tr))

        //     console.log(tr.debugLogs)
        //     // console.log(tr.blockchainLogs)
        //     console.log(tr.vmLogs)
            
        //     // console.log(tr.children)
            
        // });

        console.log("END DUMP")

    }

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        predictRound = blockchain.openContract(
            PredictRound.createFromConfig(
                {
                    bets_wallet_code: betsWalletCode,
                    deployed: 0,
                    round_id: 0,
                    state: 0,
                    up_sum: 0,
                    down_sum: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        console.log(deployer.address)

        const deployResult = await predictRound.sendDeploy(deployer.getSender(), toNano('0.05'));

        dupmResult(deployResult)
        // console.log(deployResult)

        // expect(deployResult.transactions).toHaveTransaction({
        //     from: deployer.address,
        //     to: predictRound.address,
        //     deploy: true,
        //     success: true,
        // });
    });

    it('should deploy', async () => {
        console.log('asdasd')
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

            // console.log(increaseResult)

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

        console.log('LOL')

        const wallet = await blockchain.treasury('wallet');
        const balance = await wallet.getBalance();
        console.log('Balane', balance);

        const result = await predictRound.sendTest(wallet.getSender());
        console.log(result.result)


        const owner = await predictRound.getOwner();
        console.log(owner)

        expect(1).toBe(1);
    });

    it('withdraw winning', async () => {
        const wallet = await blockchain.treasury('wallet');

        const player2 = await blockchain.treasury('player2');
        const player3 = await blockchain.treasury('player3');


        let balance = await wallet.getBalance();

        console.log('Balane', balance);

        const result = await predictRound.sendPlaceUp(wallet.getSender(), { value: toNano(1) });
        // console.log(result)

        dupmResult(result)

        let roundInfo = await predictRound.getRoundInfo();
        console.log(roundInfo)


        // Other players
        await predictRound.sendPlaceUp(player2.getSender(), { value: toNano(3) });
        await predictRound.sendPlaceDown(player3.getSender(), { value: toNano(3) });

        // Fin

        deployer = await blockchain.treasury('deployer');

        const startRoundResult = await predictRound.sendStartRound(deployer.getSender(), { start_price: toNano(1) });
        console.log("startRoundResult", startRoundResult.result)

        const finishRoundResult = await predictRound.sendFinishRound(deployer.getSender(), { finish_price: toNano(2) });
        console.log("finishRoundResult", finishRoundResult.result)

        dupmResult(finishRoundResult)



        roundInfo = await predictRound.getRoundInfo();
        console.log(roundInfo)

        let withdrawWinningResult = await predictRound.sendWithdrawWinning(wallet.getSender());
        
        console.log("withdrawWinningResult")
        dupmResult(withdrawWinningResult)


        let balanceAfter = await wallet.getBalance();

        console.log('balanceBefore', fromNano(balance));
        console.log('balanceAfter', fromNano(balanceAfter));

        expect(fromNano(balanceAfter)).toBe("1000000.5659648");


        // Должен заврш ошибкой
        withdrawWinningResult = await predictRound.sendWithdrawWinning(wallet.getSender());
        dupmResult(withdrawWinningResult)




        ///

        deployer = await blockchain.treasury('deployer');

        balance = await deployer.getBalance();

        const withdrawCommissionResult = await predictRound.sendWithdrawCommission(deployer.getSender());
        console.log("withdrawCommissionResult")
        dupmResult(withdrawCommissionResult)

        balanceAfter = await deployer.getBalance();

        console.log('balanceBefore', fromNano(balance));
        console.log('balanceAfter', fromNano(balanceAfter));

        expect(fromNano(balanceAfter)).toBe("1000000.5659608");

    });
});
