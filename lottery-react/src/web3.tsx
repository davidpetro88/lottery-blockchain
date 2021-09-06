// import Web3 from "web3";
//
// const web3 = new Web3((window as any).web3.currentProvider);
//
// export default web3;

import Web3 from "web3";

(window as any).ethereum.request({ method: "eth_requestAccounts" });

const web3 = new Web3((window as any).ethereum);

export default web3;
