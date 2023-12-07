import Web3 from 'web3';
import { WEB3_PROVIDER_TESTNET } from './constants.js';
import postBlockNumber from '../api/postBlockNumber.js';

const web3 = new Web3(Web3.givenProvider || WEB3_PROVIDER_TESTNET);

async function getBlock(blockhash, userAddress) {
  try {
    const block = await new Promise((resolve, reject) => {
      web3.eth.getBlock(blockhash, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const blockNumber = block.number;
    console.log(`Block number: ${blockNumber}`);

    const data = {
      address: userAddress,
      blockNumber: blockNumber,
    };

    console.log(data);
    console.log(blockNumber ?? 'no block number');

    postBlockNumber(data);

    return blockNumber;
  } catch (error) {
    console.log(error);
  }
}

export default getBlock;
