const Chain = require("./chain")
const Block = require("./block")
const Info = require("./info")
const Transaction = require("./transaction")
const express = require("express")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const bodyParser = require('body-parser');

let app = express()
let server = "0.0.0.0"
let port = 4577
app.use(express.static(path.join(__dirname ,'views','assets')));
app.use(bodyParser.urlencoded({ extended: false }));

const blocks = []

const blockchain = new Chain()

app.get("/",(req,res)=>{
    let html = fs.readFileSync("./views/index.html")
    res.setHeader("content-type","text/html")
    res.statusCode = 200
    res.end(html)
});

app.get("/register",(req,res)=>{
    let html = fs.readFileSync("./views/register.html")
    res.setHeader("content-type","text/html")
    res.statusCode = 200
    res.end(html)
});

app.get("/balance",(req,res)=>{
    let html = fs.readFileSync("./views/balance.html")
    res.setHeader("content-type","text/html")
    res.statusCode = 200
    res.end(html)
});

app.get("/about",(req,res)=>{
    let html = fs.readFileSync("./views/about.html")
    res.setHeader("content-type","text/html")
    res.statusCode = 200
    res.end(html)
});

app.get("/miner/pedram/auth",(req,res)=>{
    let html = fs.readFileSync("./views/miner.html")
    res.setHeader("content-type","text/html")
    res.statusCode = 200
    res.end(html)
});

// app.get("/mine",(req,res)=>{
//     let html = fs.readFileSync("./views/mine.html")
//     res.setHeader("content-type","text/html")
//     res.statusCode = 200
//     res.end(html)
// });

app.post("/register",(req,res)=>{
    let id = req.body.id
    let sign = crypto.createHash("sha256").update(req.body.sign).digest('base64')
    if(!blockchain.is_uninque_id(id)){
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("This ID already defined")
        return
    }
    blocks.push(new Block(new Info("#"+id, sign)))
    blocks.push(new Block(new Transaction(null, id, 100)))
    res.setHeader("content-type","text/plain")
    res.statusCode = 200
    res.end("Registered")
});

app.post("/", (req,res)=>{
    let from = req.body.from
    let to = req.body.to
    let amount = req.body.amount
    let sign = crypto.createHash("sha256").update(req.body.sign).digest('base64')
    if(!blockchain.is_valid_auth(from, sign)){
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("Invalid sign")
        return
    }
    if(blockchain.is_uninque_id(to)){
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("Target account is invalid")
        return
    }
    if(blockchain.balance(from)<amount){
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("Low Balance")
        return
    }
    blocks.push(new Block(new Transaction(from, to, amount)))
    res.setHeader("content-type","text/plain")
    res.statusCode = 200
    res.end("Payment was successful")
});

app.post("/balance",(req,res)=>{
    let id = req.body.id
    let sign = crypto.createHash("sha256").update(req.body.sign).digest('base64')
    if(!blockchain.is_valid_auth(id, sign)){
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("Invalid sign")
        return
    }
    let amount = blockchain.balance(id)
    res.setHeader("content-type","text/plain")
    res.statusCode = 200
    res.end(amount.toString())
});

app.post("/mine",(req,res)=>{
    let block = blocks.pop()
    if(!block)
    {
        res.setHeader("content-type","text/plain")
        res.statusCode = 200
        res.end("EMPTY")
        return
    }
    block.index = blockchain.index++
    blockchain.mine_block(block)
    blockchain.add(block)
    res.setHeader("content-type","text/plain")
    res.statusCode = 200
    res.end("OK")
});

app.listen(port, server, ()=>{
    console.log(`Server is ready, now listening to port ${port} (http://${server}:${port})`)
})