import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
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

        betsWallet = blockchain.openContract(BetsWallet.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

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
});
