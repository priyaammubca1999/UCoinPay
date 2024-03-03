const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const color = require('colors');

var https = require("https");
var http = require("http");

const db = require("./node_details/db");
const config = require("./node_details/config")
const port = config.port;
const app = express();
var CRON = require('./CRON/cron.js');
const ENCRYPTER = require('./helper/common.js')
var common = require("./helper/common.js");

// console.log("ENCRYPT", ENCRYPTER.encrypt("012"));

app.set("port", 3501);
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function (req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
     res.setHeader('Access-Control-Allow-Credentials', true);
     next();
});

app.get("/test", (req, res) => {
     res.send(`<center><h4> Admin Panel1 </h4> </center>`);
});

app.get('/logs', (req, res) => {
     console.log("logcomming")
     let file = path.join(__dirname, '../logs/combined.outerr.log');
     fs.readFile(file, 'utf-8', (err, data) => {
          console.log(err, "err")
          res.json(data);
     })
})

app.get('/emptyLogs', (req, res) => {
     let file = path.join(__dirname, '../logs/combined.outerr.log');
     fs.writeFile(file, "", (err, data) => {
          res.json("Logs truncated");
     })
})

CRON()
app.use('/api/user', require('./Routers/user.router'))
app.use('/api/coin', require('./Routers/coin.router.js'))
app.use('/api/admin/basic', require('./Routers/admin.router.js'))
app.use('/api/transaction', require('./Routers/transaction.router.js'))

var httpServer = http.createServer(app);
httpServer.listen(3501, () => {
     console.log(`Http Server is Up and Running on http://localhost:${3501} `.rainbow);
});


