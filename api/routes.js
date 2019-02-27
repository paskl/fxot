/* routes.js */

module.exports = (app, controller) => {

  app.route('/strategy/list')
    .get(controller.ctx.listStrategy)

  app.route('/strategy/view/:strategyId')
    .get(controller.ctx.viewStrategy)

  app.route('/strategy/run/:strategyId')
    .get(controller.wrk.runStrategy)

  app.route('/strategy/backtest/:strategyId')
    .get(controller.wrk.backtestStrategy)

  app.route('/backtest/view/:backtestId')
    .get(controller.ctx.backtestResult)

  app.route('/worker/list')
    .get(controller.ctx.listWorkers)

  app.route('/worker/status/:workerId')
    .get(controller.ctx.workerStatus)

  app.route('/worker/kill/:workerId')
    .get(controller.wrk.killWorker)

  app.route('/worker/viewLogs/:workerId')
    .get(controller.ctx.viewLogsWorker)

  app.route('/datapoints/:pair')
    .get(controller.dat.datapoints)

}
