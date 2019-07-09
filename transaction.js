class Transaction{
    constructor(from, to, amount){
        this.from = from
        this.to = to
        this.amount = amount
        this.time = Date.now()
    }
}

module.exports = Transaction;