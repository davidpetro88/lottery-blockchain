// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function getPrize() public view returns (uint) {
        // .balance is the total eth sent to this contract.
        return address(this).balance;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > .01 ether, '402: below minimum wager');
        players.push(msg.sender);
    }

    function pickWinner() public onlyManager {
        // Index winner using uint from 0 to players.length -1.
        address winner = players[random() % players.length];
        // Use payable() to convert winner of type address 
        // to address payable in order to transfer balance. 
        // this.balance is the ammount of money that the current contract has available
        payable(winner).transfer(address(this).balance);
        // Empty players array. 
        delete players;
    }


    // uint == uint256
    function random() private view returns (uint) {
        // sha3(); and keccak256() is the same!
        // return uint(keccak256(block.difficulty, block.timestamp, players));
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    modifier onlyManager {
        require(msg.sender == manager, '403: call restricted to manager.');
        _;
    }
}
