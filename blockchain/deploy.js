const HDWalletProvider = require("@truffle/hdwallet-provider");

const Web3 = require('web3');
const {abi, bytecode} = require('./compile');

const privateKey = "YOUR_PRIVATE_KEY"
const infuraKey = "YOUR_KEY"

let provider = new HDWalletProvider(privateKey,
    `wss://rinkeby.infura.io/ws/v3/${infuraKey}`);

// HDWalletProvider is compatible with Web3. Use it at Web3 constructor, just like any other Web3 Provider
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({data: bytecode})
        .send({gas: 1000000, from: accounts[0]});
    console.log("Contract deployed to", result.options.address);
};
deploy();
