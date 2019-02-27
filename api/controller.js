/* controller.js */
/*  API FUNCTIONS

CONTEXT
    listStrategy
    viewStrategy
    runStrategy
    backtestStrategy

WORKERS
    listWorkers
    killWorker

DATAPOINTS
    datapoints
*/

const localdata = require('../lib/localdata.js')
const Pool = require('../workers/pool')
const strategies = require('../strategies/strats.js')
const Scheduler = require('../workers/scheduler')


const controller = {

    fnc: {

        init: (ctx) => {
            controller.context = ctx
        }

    },

    ctx: {

        listStrategy: async (req, res) => {
            let strategies = controller.context.public().get('strategy') /// TODO
            let list = strategies.map( s =>{ return {id:s.id, name:s.name} })
            let ret = {list: list}
            res.json(ret)
        },

        viewStrategy: async (req, res) => {
            let strat = controller.context.public().findById('strategy', req.params.strategyId)
            res.json( strat )
        },

        listWorkers: async (req, res) => {
            let ret = controller.context.public().workers.list()
            res.json(ret)
        },

        workerStatus: async (req, res) => {
            let worker = Scheduler.getWorker(req.params.workerId)
            res.json({
                id: worker.id,
                status: worker.status
            })
        },

        backtestResult: async (req, res) => {
            let backtest = controller.context.public().findById('backtest', req.params.backtestId)
            res.json({ backtest: backtest.logger })
        },


        viewLogsWorker: async (req, res) => {
            let workerId = req.params.workerId
            let worker = controller.context.public().workers.getById(workerId)
            // let worker = Pool.getById(workerId)
            if(worker)
                res.json(worker.logger)
            else
                res.json({error: 'worker unknown'})
        }

    },

    wrk: {

        runStrategy: async (req, res) => {
            let stratId = req.params.strategyId
            console.log('[GET] /strategy/run/'+stratId)
            // controller.context.run.start(stratId) // TODO: specify pair and granulity
            // Pool.run() /// TODO: specify pair and granulity

            res.json({message: 'run START'})
        },

        backtestStrategy: async (req, res) => {
            let stratId = req.params.strategyId
            console.log('[GET] /strategy/backtest/'+stratId)
            let w = Scheduler.backtest(controller.context.public(), 'EUR_JPY', 'S5')
            let wid = w ? w.id : null
            res.json({id: wid})
        },

        killWorker: async (req, res) => {
            let workerId = req.params.workerId
            let ret = controller.context.workers.kill(workerId)
            // let ret = Pool.kill(workerId)
            res.json({message: 'killed'})
        }

    },


    dat: {

        datapoints: async (req, res) => {
            let pair = req.params.pair
            // console.log('[GET] /datapoints/'+pair)
            let granulity = req.query.granulity
            let from = String( new Date(parseInt(req.query.from)).getTime() )
            let limit = parseInt(req.query.limit) || 300
            let dd = localdata.getAll('EUR_JPY', 'S5', from, limit)
            res.json({data:dd})
        }

    }
}


module.exports = controller
