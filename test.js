const { Block,
    Transaction,
    Blockchain
} = require('./index');

const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

//generate key

//user1
const key1 = ec.genKeyPair();
const privatKey1 = key1.getPrivate("hex");
const walletNumber1 = key1.getPublic("hex");

//user2
const key2 = ec.genKeyPair();
const privatKey2 = key2.getPrivate("hex");
const walletNumber2 = key2.getPublic("hex");

//create instance
const josscoian = new Blockchain();

//transaction 1
const tx1 = new Transaction(walletNumber1,walletNumber2,100);
tx1.signTransaction(key1);
josscoian.addTransaction(tx1);

//mining1 for transaction 1
josscoian.minePendingTransactions(walletNumber1);
console.log(josscoian.getBalanceOfAddress(walletNumber1));
console.log(josscoian.getBalanceOfAddress(walletNumber2));

//transaction 2
const tx2 = new Transaction(walletNumber2,walletNumber1,50);
tx2.signTransaction(key2);
josscoian.addTransaction(tx2);

//mining2 for transaction 2
josscoian.minePendingTransactions(walletNumber1);
console.log(josscoian.getBalanceOfAddress(walletNumber1));
console.log(josscoian.getBalanceOfAddress(walletNumber2));

console.log(josscoian.isBlockchinValid());