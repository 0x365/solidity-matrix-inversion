// Function that deploy smart contract SocialActivation.sol

const hre = require("hardhat");
const path = require("path");
const { Signer, Wallet } = require("ethers");

// Converts private key to a signer
async function key_to_signer(priv) {
  const provider = hre.ethers.provider;
  const signer_wallet = new Wallet(priv);
  const signer = signer_wallet.connect(provider);
  return signer;
}

const accounts = config.networks.auto.accounts;

const contract_name = "GuassianSolve";

async function main() {
  
    // Gets smart contract ABI
    const Contract = await hre.ethers.getContractFactory(contract_name);
    // Deploys smart contract
    tx_params = {
        gasLimit: 10000000
    }
    //console.log(accounts[0]);
    //console.log(await key_to_signer(accounts[0]));
    //input_key = Wallet.fromMnemonic("feed pigeon security vote audit danger sense beef hub name prepare settle").privateKey
    //.connect(await key_to_signer(wallet["mnemonic"]))
    console.log("hey");
    const dapp = await Contract.connect(await key_to_signer(accounts[0])).deploy(tx_params);
    // Waits until smart contract is deployed and returns tx
    const tx = await dapp.deployed();
    // Outputs transaction to console
    var display = tx.deployTransaction;
    display.data = "data...."
    console.log(display);

    ////////////////////////
    console.log("Deployed");
    console.log("------------------");
    console.log("Test")
    ////////////////////////

    tx_params = {
        gasLimit: 1000000 
    }

    // const in_matrix = [
    //     [  2,   1,  -1, 1 ],
    //     [ -3,  -1,   2, 1 ],
    //     [ -2,   1,   2, 1 ]
    // ]

    const DECIMALS = 14

    const multiplier = Math.pow(10,DECIMALS);

    const in_matrix = [
        [ 3.45788928, -3.12857843, -0.26355039, 1],
        [ 3.44245193, -0.27898774, -2.66421811, 1],
        [-0.01543735,  2.84959069, -2.40066772, 1]
    ]

    in_matrix[0][0] += 1/multiplier;

    // const in_matrix = [
    //     [ 3.45788928, 3.44245193, -0.01543735, 1],
    //     [ -3.12857843, -0.27898774, 2.84959069, 1],
    //     [-0.26355039,  -2.66421811, -2.40066771, 1]
    // ]

    // const in_matrix = [
    //     [ 3.45788, -3.12857, -0.26355],
    //     [ 3.44245, -0.27898, -2.66421],
    //     [-0.01543,  2.84959, -2.40066]
    // ]


    k1 = in_matrix.length;
    k2 = in_matrix[0].length;

    

    const b = [0, 0, 0]

    var matrix = []
    for (let y = 0; y < k1; y++) {
        var temp = [];
        for (let x = 0; x < k2; x++) {
            temp.push(Math.round((in_matrix[y][x])*multiplier));
        }
        matrix.push(temp);
    }

    //inputMat = in_matrix;
    console.log(matrix);


    tx2 = await dapp.connect(await key_to_signer(accounts[0]))._invert_matrix(matrix, tx_params);
    console.log(tx2);


}







main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
