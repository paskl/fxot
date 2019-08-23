/* api.js */

const Connector = require('./lib/connector')
const Strategy = require('./class/strategy')
const Worker = require('./class/worker')

//*************************************************************    OBJECTS
var strategies = []
var workers = []

//*************************************************************    ENDPOINTS
var endpoints = [
    {
        URL: '/strategy/list',
        fn: function(req, res){
            res.json( Strategy_List() )
        }
    },
    {
        URL: '/strategy/view/:strategyId',
        fn: function(req, res){
            res.json( Strategy_View(req.params.strategyId) )
        }
    },
    {
        URL: '/backtest/start/:strategyId',
        fn: function(req, res){
            let wid = Backtest_Start( req.params.strategyId, 'EURJPY', 'M1', 1522548000000, 1523757600000 )
            res.json({id: wid})
        }
    },
    {
        URL: '/backtest/view/:stratId/:backtestId',
        fn: function(req, res){
            let backtest = Backtest_View( req.params.stratId, req.params.backtestId )
            let response = backtest ? backtest.result() : {error:'not found'}
            res.json(response)
        }
    },
    {
        URL: '/marketdata/view/',
        fn: function(req, res){
            let from = parseInt(req.query.from) || 1522548000000
            let limit = parseInt(req.query.limit) || 300
            let data = MarketData_View('EURJPY', 'M1', limit, from )
            res.json({data:data})
        }
    },

    {
        URL: '/run/start/:strategyId/:accountId',
        fn: function(req, res){
            if( req.params.accountId == 'dry'){
                Run_Start( req.params.strategyId, 'EURJPY', 'M1', req.params.accountId)
            }
            res.json({id: req.params.strategyId})
        }
    },
    {
        URL: '/run/view/:stratId',
        fn: function(req, res){
            let run = Run_View( req.params.stratId )
            let response = run ? run.result() : {error:1}
            res.json(response)
        }
    },
    {
        URL: '/run/stop/:stratId',
        fn: function(req, res) {
            Run_Stop( req.params.stratId )
            res.json({msg:'done'})
        }
    }
]

//*************************************************************    METHODS
var findStrategyById = (id) => {
    return strategies.find( e => e.id == id )
}
var findWorkerById = (id) => {
    return workers.find( e => e.id == id )
}


var Strategy_List = () => {
    return strategies.map( s =>{ return {id:s.id, name:s.name} })
}

var Strategy_View = (id) => {
    return findStrategyById(id)
}

var Backtest_Start = (sid, inst, gran, from, to) => {
    let strat = findStrategyById (sid)
    let backtest = strat.createBacktest(inst, gran, from, to)
    let worker = new Worker(backtest, strat.id, inst, gran)
    worker.backtest(from, to)
    workers.push( worker )
    return ( backtest ? backtest.id : null )
}

var Backtest_View = (sid, bid) => {
    let strat = findStrategyById(sid)
    let bckt = strat.getBacktest(bid)
    return bckt
}

var Run_Start = (sid, inst, gran, account) => {
    let strat = findStrategyById(sid)
    let run = strat.startRun( inst, gran, account )
    // Run created only if not only running
    let worker
    if(run){
        worker = new Worker(run, strat.id, inst, gran)
        worker.run(account)
        workers.push(worker)
    }
    return ( worker ? worker.id : null )
}

var Run_View = (sid) => {
    let strat = findStrategyById(sid)
    return strat.run
}

var Run_Stop = (sid) => {
    let strat = findStrategyById(sid)
    let worker = findWorkerById(strat.run.wid)
    worker.kill()
}

var MarketData_View = (inst, gran, limit, from) => {
    let res =  Connector.LocalCandle.get(inst, gran, from, limit)
    return res
}

//*************************************************************    INIT
var init_Strategies = () => {
    Connector.Strategy.all().forEach ( s => {
        strategies.push( new Strategy(s.id, s.name) )
    })
}

var init_Endpoints = (app) => {
    endpoints.forEach ( ep => {
        app.route( ep.URL ).get( ep.fn )
    })
}

//*************************************************************    TEST CODE
var test = () => {
    let ret = Connector.LocalCandle.get('EURUSD', 'M1', 1514888100000, 15)
    console.log(ret)
}

//*************************************************************    EXPORT
module.exports = (app) => {
    init_Strategies()
    init_Endpoints( app )
    // test()
}

