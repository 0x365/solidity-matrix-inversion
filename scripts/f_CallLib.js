// Function that calls add_notification function in smart contract

const hre = require("hardhat");
const path = require("path");
const { Signer, Wallet } = require("ethers");
const dapp_data = require("../dapp/dapp-data.json");
const wallets = require("../wallets-example.json");
const { Decipher } = require("crypto");
const { DECIMALS } = require("prb-math");

// Converts private key to a signer
async function key_to_signer(priv) {
    const provider = hre.ethers.provider;
    const signer_wallet = new Wallet(priv);
    const signer = signer_wallet.connect(provider);
    return signer;
  }
  
const contract_name = "CallLib";

async function main() {  
    // Gets smart contract ABI
    const Contract = await ethers.getContractFactory(contract_name);
    // Attatches contract address for IRL location
    const dapp = await Contract.attach(dapp_data.dapp_address);


    tx_params = {
        gasLimit: 10000000 
    }

    // const in_matrix = [[3, 2],[5, 4]]
    // const b = [36,64]

    // const in_matrix = [[2, -1, 3], [1, 3, -2], [3, -2, 4]];
    // const b = [10, 5, 12];

    const DECIMALS = 5

    const multiplier = Math.pow(10,DECIMALS);
    const multiplier2 = Math.pow(10,15-DECIMALS);

    const in_matrix = [
        [ 3.45788928, -3.12857843, -0.26355039],
        [ 3.44245193, -0.27898774, -2.66421811],
        [-0.01543735,  2.84959069, -2.40066772]
    ]

    // const in_matrix = [
    //     [ 3.45788, -3.12857, -0.26355],
    //     [ 3.44245, -0.27898, -2.66421],
    //     [-0.01543,  2.84959, -2.40066]
    // ]

    // const in_matrix = [
    //     [ 3.45788, -3.12857, -0.26355, 2],
    //     [ 3.44245, -0.27898, -2.66421, 4],
    //     [-0.01543,  2.84959, -2.40066, 7]
    // ]

    const b = [1, 1, 1]

    var inputMat = []
    for (let y = 0; y < in_matrix.length; y++) {
        var temp = [];
        for (let x = 0; x < in_matrix.length; x++) {
            temp.push(Math.round((in_matrix[x][y])*multiplier)*multiplier2);
        }
        inputMat.push(temp);
    }

    //inputMat = in_matrix;
    console.log(inputMat);

    tx = await dapp.connect(await key_to_signer(wallets["a"]["private"])).multipleLinearRegression(inputMat, b, tx_params);
    // Output transaction to console
    out = []
    for (let x = 0; x < tx.length; x++) {
        out.push(parseInt(tx[x])/Math.pow(10,21));
    }
    console.log(out);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// 0.457889280000003,
// -0.128578430000003,
// -0.26355039

// 0.442451930000003,
// -0.27898774,
// 0.335781889999997

// -0.01543735,
// -0.150409309999997,
// 0.599332279999997