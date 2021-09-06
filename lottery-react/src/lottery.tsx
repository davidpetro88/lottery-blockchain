import web3 from "./web3";
// 0x5BbaBD5eDE9610F369E9Ff5488B930ccda488C9d
const address = '0x5BbaBD5eDE9610F369E9Ff5488B930ccda488C9d'

const contractAbi = require("./contractABI.json");

// const abi =

export default new web3.eth.Contract(contractAbi, address);
