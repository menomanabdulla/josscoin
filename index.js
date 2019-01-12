const sha26 = require('crypto-js/sha256');

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
}

class Transaction{
    constructor(fromAddress,toAddress,amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount  =  amount;
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.generateGenesisBlock()];
        this.difficulty = 2;

        this.pendingTransactions = [];
    }

    generateGenesisBlock(){
        return new Block("2019-01-01","GENESIS","0000");
    }

    getLatestBLock(){
        return this.chain[this.chain.length-1];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBLock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
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

const josscoin = new Blockchain();
josscoin.createTransaction(new Transaction('address1','address2',100));
josscoin.createTransaction(new Transaction('address2','address1',50));
josscoin.minePendingTransactions();

console.log(josscoin.getBalanceOfAddress('address1'));
console.log(josscoin.getBalanceOfAddress('address2'));
//console.log(josscoin);