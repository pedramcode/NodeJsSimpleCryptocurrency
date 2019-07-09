const Block = require("./block")
const Transaction = require("./transaction")
const Info = require("./info")

class Chain{
    constructor(){
        this.ledger = []
        this.index = 0
        this.mine_level = 5
    }
    last(){
        if(this.ledger.length==0)
            return null
        return this.ledger[this.ledger.length-1]
    }
    add(block){
        if(this.ledger.length==0){
            block.prev_hash=null
        }else{
            block.prev_hash = this.last().hash
        }
        //this.mine_block(block)
        //block.update_hash()
        this.ledger.push(block)
    }
    display(){
        this.ledger.forEach(block => {
            console.log(`#${block.index}\n\tData: ${block.data}\n\tHash: ${block.hash}\n\tPrevious Hash: ${block.prev_hash}\n\tTime: ${block.time}\n\tNonce: ${block.nonce}`)
        });
    }
    mine_block(block){
        let pattern = ""
        for (let index = 0; index < this.mine_level; index++) {
            pattern+="0"
        }
        do{
            block.nonce++
            block.update_hash()
        }while(block.hash.substr(0,this.mine_level)!==pattern)
    }
    is_valid(){
        for (let i = 0; i < this.ledger.length; i++) {
            const current = this.ledger[i]
            if(!current.is_valid())
                return false
        }
        for (let i = 1; i < this.ledger.length; i++) {
            const current = this.ledger[i]
            const prev = this.ledger[i-1]
            if(current.prev_hash!==prev.hash){
                return false
            }
        }
        return true
    }
    balance(account){
        let amount = 0
        this.ledger.forEach(block => {
            if(block.data instanceof Transaction){
                if(block.data.from === account){
                    amount -= parseInt(block.data.amount)
                }else if(block.data.to === account){
                    amount += parseInt(block.data.amount)
                }
            }
        });
        return amount
    }
    is_uninque_id(id){
        id = "#" + id;
        let is = true;
        for (let i = 0; i < this.ledger.length; i++) {
            let block = this.ledger[i]
            if(block.data instanceof Info){
                if(block.data.key === id){
                    is=false;
                    break;
                }
            }
        }
        return is;
    }
    is_valid_auth(id, sign){
        id = "#" + id;
        let is = false;
        for (let i = 0; i < this.ledger.length; i++) {
            let block = this.ledger[i]
            if(block.data instanceof Info){
                if(block.data.key === id && block.data.value === sign){
                    is=true;
                    break;
                }
            }
        }
        return is;
    }
}

module.exports = Chain;