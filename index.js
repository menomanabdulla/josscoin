const sha26 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
var ec = new EC('secp256k1');


class Block{
    constructor(timestamp,transactions,previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    mineBLock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Mining done : "+ this.hash);
    }

    calculateHash(){
        return sha26(this.timestamp + 
            JSON.stringify(this.transactions) + 
            this.previousHash + this.nonce).toString();
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount  =  amount;
    }
    calculateHash(){
        return sha256(
            this.fromAddress + 
            this.toAddress + 
            this.amount
        ).toString();
    }
    signTransaction(key){
        if(key.getPublic('hex' !== this.amount)){
            throw new Error("You do not have access");
        }
        const hashTx = this.calculateHash();
        const signature = key.sign(hashTx, 'base64');
        this.signature = signature.toDer();
    }
    isValid(){
        if(this.fromAddress === null) true;
        if(!this.signature || this.signature.length === 0){
            throw new Error("No signature found");
        }
        const key = ec.keyFromPublic(this.fromAddress,'hex');
        return key.verify(this.calculateHash(), this.signature);
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.generateGenesisBlock()];
        this.difficulty = 2;

        this.pendingTransactions = [];
        this.minigReward = 10;
    }

    generateGenesisBlock(){
        return new Block("2019-01-01","GENESIS","0000");
    }

    getLatestBLock(){
        return this.chain[this.chain.length-1];
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("Cannot process transaction");
        }
        if(!transaction.isValid()){
            throw new Error("Invalid transaction");
        }
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(minerAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBLock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null,minerAddress, this.minigReward)
        ];
    }

    /*addBlock(newBLock){
        newBLock.previousHash = this.getLatestBLock().hash;
        newBLock.mineBLock(this.difficulty);
        this.chain.push(newBLock);
    }*/
    isBlockchinValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBLock = this.chain[i];
            const previousBLock = this.chain[i - 1];
            if(currentBLock.hash !== currentBLock.calculateHash()){
                return false;
            }
            if(currentBLock.previousHash !== previousBLock.hash){
                return false;
            }
            if(!currentBLock.hasValidTransaction()){
                return false;
            }
        }
        return true;
    }

    getBalanceOfAddress(address){
        let balance = 0
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
}

//const josscoian = new Blockchain();

module.exports = {
    Block,
    Transaction,
    Blockchain
}