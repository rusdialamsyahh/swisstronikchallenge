const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/swisstronik.js");

/**
 * Sending a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */

const sendShieldedTransaction = async (signer, destination, data, value) => {
      // Get the RPC link from the network configuration
    const rpclink = hre.network.config.url;

      // Encrypt transaction data
    const [encryptedData] = await encryptDataField(rpclink, data);

      // Construct and sign transaction with encrypted data
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
}

// the contract address and the number of tokens to be minted 
const CONTRACT_ADDRESS = "0xCcad4bD21eaD1673c9CF5d3F1ec5732809d6c7E6";
const NUMBER = 50;

async function main() {
    const [signer] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("rusdi");
    const contract = contractFactory.attach(CONTRACT_ADDRESS);
    const mintTxn = await sendShieldedTransaction(signer, CONTRACT_ADDRESS, contract.interface.encodeFunctionData("mint", [NUMBER]), 0);
    await mintTxn.wait();
    console.log("Transaction Receipt: ", mintTxn);
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})