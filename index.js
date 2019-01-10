const sha26 = require('crypto-js/sha256');

class Block{
    constructor(timestamp,data,previousHash = ''){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha26(this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.generateGenesisBlock()];
    }

    generateGenesisBlock(){
        return new Block("2019-01-01","GENESIS","0000");
    }

    getLatestBLock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBLock){
        newBLock.previousHash = this.getLatestBLock().hash;
        newBLock.hash = newBLock.calculateHash();
        this.chain.push(newBLock);
    }
}

const josscoin = new Blockchain();

const block = new Block("2019-01-01",{amount: 5});
josscoin.addBlock(block);


console.log(josscoin);