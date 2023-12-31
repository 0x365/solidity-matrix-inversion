require("@nomicfoundation/hardhat-toolbox");
creds = require( './credentials.json');

//const { config } = require("hardhat");
const { Wallet } = require("ethers");
const { path } = require("path");
const { fs } = require("fs");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {

  solidity: "0.8.20",

  defaultNetwork: "auto",
  
  networks: {
    auto: {
      url: creds.url,
      accounts: [creds.private_key]
    }
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }

};

function jsonConcat(o1, o2) {
  for (var key in o2) {
   o1[key] = o2[key];
  }
  return o1;
}


task("accounts-example", "Prints the list of accounts", async (taskArgs, hre) => {
  const { config } = require("hardhat");

  const accounts = config.networks.hardhat.accounts;

  const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t"]
  var output = {};

  for (let i=0; i < 20; i++) {
    wallet_cur = await Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${i}`);
    privateKey_cur = wallet_cur.privateKey;
    obj = JSON.parse('{"'+alphabet[i]+'": {"public":"'+wallet_cur.address+'","private":"'+wallet_cur.privateKey+'"}}');
    output = jsonConcat(output, obj)
  }
  fs.writeFileSync(
    path.join(__dirname, "wallets-example.json"),
    JSON.stringify(output, undefined, 2)
  );  
});

