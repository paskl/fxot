'use strict';

const strategy = require('../../lib/strategy.js')
const Worker = require('../../lib/worker.js')

var workers = []

exports.start = async (req, res) => {
    console.log('launching new strategy : '+req.params.strategyId)

    let w1 = new Worker()
    w1.setPair('EUR_JPY', 'S5')
    w1.setStrategy(strategy)
    w1.practice(300)

    workers.push(w1)

    res.json({message:'running'})
}


exports.backtest = async (req, res) => {
    console.log('launching backtest : '+req.params.strategyId)

    let w1 = new Worker()
    
    // add the backtest to the list of running stuff

    w1.setPair('EUR_JPY', 'S5')
    w1.setStrategy(strategy)
    w1.backtest(300)

    workers.push(w1)

    res.json({message:'backtesting'})
}

exports.list = async (req, res) => {
    // var worker_lists = []
    console.log(workers)
    res.json(workers)
}

// 2- launch a strategy or backtest
// 3- view the list of strategy & backtest launched or history
// 4- view the detail of a strategy and results (in live)

