const sha26 = require('crypto-js/sha256');

class Block{
    constructor(timestamp,data,previousHash = ''){
        this.timestamp = timestamp;
        this.data = data;
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
        return sha26(this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.generateGenesisBlock()];
        this.difficulty = 4;
    }

    generateGenesisBlock(){
        return new Block("2019-01-01","GENESIS","0000");
    }

    getLatestBLock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBLock){
        newBLock.previousHash = this.getLatestBLock().hash;
        newBLock.mineBLock(this.difficulty);
        this.chain.push(newBLock);
    }
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
}

const josscoin = new Blockchain();

const block1 = new Block("2019-01-01",{amount: 5});
josscoin.addBlock(block1);
//console.log(josscoin);

const block2 = new Block("2019-01-02",{amount: 10});
josscoin.addBlock(block2);
console.log(josscoin);