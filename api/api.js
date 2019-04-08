/* api.js */

const Context = require('./context')
const Connector = require('./connector')
const Scheduler = require('./scheduler')


module.exports = {
    init: (app) => {

// *********************************************************************************

        var public = new Context()
        public.set('strategy', Connector.getPublicStrategies())


// *********************************************************************************

// STRATEGY

        app.route( '/strategy/list' ).get(
            function(req, res) {
                let list = public.get('strategy').map( s =>{ return {id:s.id, name:s.name} })
                let ret = {list: list}
                res.json(ret)
            }
        )

        app.route( '/strategy/view/:strategyId' ).get(
            function(req, res) {
                let strat = public.findById('strategy', req.params.strategyId)
                res.json( strat )
            }
        )


// WORKER

        app.route('/worker/run/:strategyId').get(
            function(req, res) {
                console.log('running real strategy')
                res.json( {code: 0} )
            }
        )

        app.route('/worker/backtest/:strategyId').get(
            function (req, res) {
                let stratId = req.params.strategyId
                let instrument = 'EURJPY'
                let granulity = 'M1'
                let from = '2018-01'
                let to ='2018-03'
                let w = Scheduler.backtest(public, stratId, instrument, granulity, from, to)
                let wid = w ? w.id : null
                res.json({id: wid})
            }
        )

        app.route('/worker/status/:workerId').get(
            function (req, res) {
                let worker = Scheduler.getWorker(req.params.workerId)
                res.json({
                    id: worker.id,
                    status: worker.status
                })
            }
        )


// BACKTEST

        app.route('/backtest/result/:backtestId').get(
            function (req, res) {
                let backtest = public.findById('backtest', req.params.backtestId)
                res.json({ backtest: backtest.logs })
            }
        )

/*
        // VIEW A STRATEGY
        app.route('/strategy/view/:strategyId')
        .get( (req, res) => {

        })
          // app.route('/worker/kill/:workerId')
          //   .get(controller.wrk.killWorker)


        // VIEW A STRATEGY
        app.route('/strategy/view/:strategyId')
        .get( (req, res) => {

        })
          // app.route('/worker/viewLogs/:workerId')
          //   .get(controller.ctx.viewLogsWorker)

        // VIEW A STRATEGY
        app.route('/strategy/view/:strategyId')
        .get( (req, res) => {

        })
          // app.route('/datapoints/:pair')
          //   .get(controller.dat.datapoints)

*/
    }
}
