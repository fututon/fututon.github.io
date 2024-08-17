import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import {Cell, fromNano, toNano} from '@ton/core';
import { BetsWallet } from '../wrappers/BetsWallet';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('BetsWallet', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('BetsWallet');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let betsWallet: SandboxContract<BetsWallet>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        betsWallet = blockchain.openContract(BetsWallet.createFromConfig({
            owner_address: deployer.address
        }, code));

        const deployResult = await betsWallet.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: betsWallet.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and betsWallet are ready to use
    });

    it('add items', async () => {
        const wallet = await blockchain.treasury('wallet');
        const round1 = await blockchain.treasury('round1');
        const round2 = await blockchain.treasury('round2');

        await betsWallet.sendAddRound(round1.getSender());
        await betsWallet.sendAddRound(round2.getSender());

        let rounds = await betsWallet.getRounds();
        
        console.log(rounds);
        console.log(round1.address)
        console.log(round2.address)

        expect(rounds[0].toString()).toBe(round1.address.toString())
        expect(rounds[1].toString()).toBe(round2.address.toString())
    });
});
