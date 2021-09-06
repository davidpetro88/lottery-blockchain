import React, {useCallback, useEffect, useState} from 'react';
import './App.css';

import web3  from "./web3";
import lottery from "./lottery";

function App() {

  const [message, setMessage] = useState<string>('')
  const [manager, setManager] = useState<string>('')
  const [players, setPlayers] = useState<any>(null)
  const [balance, setBalance] = useState<any>("")
  const [value, setValue] = useState<any>("")

  const getDataFromBlockchain = useCallback(async () => {
    const managerResponse = await lottery.methods.manager().call();
    const playersResponse = await lottery.methods.getPlayers().call();
    const balanceResponse = await web3.eth.getBalance(lottery.options.address);
    setManager(managerResponse);
    setPlayers(playersResponse);
    setBalance(balanceResponse);
  },[]);

  useEffect(() => {
    getDataFromBlockchain()
  }, [getDataFromBlockchain])

  const handleSubmit = async (event: any) => {
    console.log('submit!!', event);

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    });

    setMessage('You have been entered!');

    getDataFromBlockchain();
  }

  const handlePickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction success...');

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A winner has been picked!');
    getDataFromBlockchain();
  }

  return (

    <div className="App">
      <h2> Lottery Contract</h2>
      <p>
        This contract is managed by {manager}.
        There are currently {players?.length} people entered.
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>

      <hr />

      <form onSubmit={handleSubmit}>
        <h4> Want to try your luck?</h4>
        <div>
          <label>Amount of <strong>ether</strong> to enter</label>
          <input
              value={value}
              onChange={event => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h4> Ready to pick a winner?</h4>
      <button onClick={handlePickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>

    </div>
  );
}

export default App;
