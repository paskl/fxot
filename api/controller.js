/* controller.js */

// const strategy = require('../lib/strategy.js')
// const Worker = require('../lib/worker.js')

const localdata = require('../lib/localdata.js')

const Pool = require('../lib/pool')

const { fork } = require('child_process');


exports.listStrategy = async (req, res) => {
    console.log('[GET] /strategy/list')
    let ret = {list: ['01', '02', '03']}
    res.json(ret)
}

exports.runStrategy = async (req, res) => {
    let stratId = req.params.strategyId
    console.log('[GET] /strategy/run/'+stratId)
    Pool.run() /// TODO: specify pair and granulity
    res.json({message: 'run START'})
}

exports.backtestStrategy = async (req, res) => {
    let stratId = req.params.strategyId
    console.log('[GET] /strategy/backtest/'+stratId)
    Pool.backtest()
    res.json({message: 'backtest START'})
}

exports.listWorkers = async (req, res) => {
    let ret = Pool.list()
    res.json(ret)
}

exports.killWorker = async (req, res) => {
    let workerId = req.params.workerId
    let ret = Pool.kill(workerId)
    res.json({message: 'killed'})
}

exports.viewLogsWorker = async (req, res) => {
    let workerId = req.params.workerId
    let worker = Pool.getById(workerId)
    if(worker)
        res.json(worker.logger)
    else
        res.json({error: 'worker unknown'})
}

exports.datapoints = async (req, res) => {
    let pair = req.params.pair
    console.log('[GET] /datapoints/'+pair)
    let granulity = req.query.granulity
    let from = new Date(2018, 6, 1, 18, 35, 0) // req.query.from
    let limit = req.query.limit || 300
    let dd = localdata.getAll('EUR_JPY', 'S5', from, limit)
    res.json({data:dd})
}



// exports.start = async (req, res) => {
//     console.log('launching new strategy : '+req.params.strategyId)

//     let w1 = new Worker()
//     w1.setPair('EUR_JPY', 'S5')
//     w1.setStrategy(strategy)
//     w1.practice(300)

//     workers.push(w1)

//     res.json({message:'running'})
// }


// exports.backtest = async (req, res) => {
//     console.log('launching backtest : '+req.params.strategyId)

//     let w1 = new Worker()

//     // add the backtest to the list of running stuff

//     w1.setPair('EUR_JPY', 'S5')
//     w1.setStrategy(strategy)
//     fork(w1.backtest)

//     workers.push(w1)

//     res.json({message:'backtesting'})
// }

// exports.list = async (req, res) => {
//     // var worker_lists = []
//     console.log(workers)
//     res.json(workers)
// }