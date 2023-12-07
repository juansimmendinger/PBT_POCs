import Web3 from 'web3';
import { WEB3_PROVIDER_TESTNET } from './constants.js'
// Connect to a Web3 provider (e.g., MetaMask, Infura, etc.)
const web3 = new Web3(Web3.givenProvider || WEB3_PROVIDER_TESTNET);

async function getCurrentBlockHash() {
  // Get the current block number
  const blockNumber = await web3.eth.getBlockNumber();

  // Get the block details using the block number
  const block = await web3.eth.getBlock(blockNumber);

  // Get the block hash
  const blockHash = block.hash;

  console.log('Current block hash:', blockHash);
  return blockHash;
}

// Call the function
getCurrentBlockHash();


export default getCurrentBlockHash;