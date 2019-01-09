/* index.js */
// var express = require('express')
// var app = express()
// var port = process.env.PORT || 3000

// var bodyParser = require('body-parser')


// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*")
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
//   next()
// })

// var routes = require('./api/routes/routes') //importing route
// routes(app) //register the route

// app.listen(port)
// console.log('fxot API server started on: ' + port)

var pool = require('./lib/pool')
pool.backtest('EUR_JPY')
// pool.run('EUR_JPY')

// setInterval(function(){ console.log("HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello"); }, 500)
