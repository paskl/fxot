/* index.js */
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  // mongoose = require('mongoose'),
  // Task = require('./api/models/todoListModel'), //created model loading here
  bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/routes'); //importing route
routes(app); //register the route

app.listen(port);
console.log('fxot API server started on: ' + port);

// const strategy = require('./lib/strategy.js')
// const Worker = require('./lib/worker.js')

// let start = async() => {
//     //
//     let w1 = new Worker()
//     w1.setPair('EUR_JPY', 'S5')
//     w1.setStrategy(strategy)
//     // w1.backtest(300)
//     w1.practice(300)
// }

// start()
