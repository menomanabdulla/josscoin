const { Block,
    Transaction,
    Blockchain
} = require('./index');

const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

//generate key
const key = ec.genKeyPair();
const privatKey = key.getPrivate("hex");
const walletNumber = key.getPublic("hex");


const josscoian = new Blockchain();
const tx1 = new Transaction(walletNumber,'randomAddress',100);
tx1.signTransaction(key);
josscoian.addTransaction(tx1);

josscoian.minePendingTransactions(walletNumber);

console.log(josscoian.getBalanceOfAddress(walletNumber));