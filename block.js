const crypto = require("crypto")

class Block{
    constructor(data){
        this.data = data
        this.time = Date.now()
        this.hash = null
        this.prev_hash = null
        this.nonce = 0
        this.index = 0
    }
    update_hash(){
        let data = this.data + this.time + this.index + this.nonce
        let hash = crypto.createHash("sha256").update(data).digest('base64')
        this.hash = hash
    }
    is_valid(){
        let data = this.data + this.time + this.index + this.nonce
        let hash = crypto.createHash("sha256").update(data).digest('base64')
        return this.hash === hash
    }
}


module.exports = Block;