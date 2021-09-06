const path = require("path");
const fs = require("fs");
const solc = require("solc");

const inboxPath = path.resolve(__dirname, "contracts", "Lottery.sol");
const source = fs.readFileSync(inboxPath, "utf8"); //read raw source file

const input = {
    language: "Solidity",
    sources: {
        "Lottery.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
exports.abi = output.contracts['Lottery.sol']['Lottery'].abi;
exports.bytecode = output.contracts['Lottery.sol']['Lottery'].evm.bytecode.object;
console.log(output.contracts['Lottery.sol']['Lottery'].abi);
