const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('../compile');

// set global variables
let accounts;
let lottery;

beforeEach(async () =>  {
    // get list of all accounts
    accounts = await web3.eth.getAccounts();

    // use account to deploy contract
    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: 1000000});
});

describe('Inbox', () => {

    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(1, players.length);
    });

    it('allows multiple accounts to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.strictEqual(accounts[0], players[0]);
        assert.strictEqual(accounts[1], players[1]);
        assert.strictEqual(accounts[2], players[2]);
        assert.strictEqual(3, players.length);
    });

    it('requires a minimum ammont of ether to enter', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('only manager can call pickWinner', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.02', 'ether')
            });

            await lottery.methods.enter().send({
                from: accounts[1],
                value: web3.utils.toWei('0.02', 'ether')
            });

            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('manager call pickWinner', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const pickWinner = await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        assert.ok(pickWinner);
    });

    it('sends money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        // get ammount ether from accounts []
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        const pickWinner = await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        // the difference between is not 2 because we pay gas for enter
        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        // players zero
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.strictEqual(0, players.length);

        // value contract is empty
        const prize = await lottery.methods.getPrize().call({
            from: accounts[0]
        });
        assert.strictEqual('0', prize);
    });

});

