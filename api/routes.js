/* routes.js */

const controller = require('./controller')

module.exports = function(app) {

  // GET LIST OF STRATEGIES
  app.route('/strategy/list')
    .get(controller.listStrategy)

  app.route('/strategy/run/:strategyId')
    .get(controller.runStrategy)

  app.route('/strategy/backtest/:strategyId')
    .get(controller.backtestStrategy)

  app.route('/workers/list')
    .get(controller.listWorkers)

  app.route('/worker/kill/:workerId')
    .get(controller.killWorker)

  app.route('/worker/viewLogs/:workerId')
    .get(controller.viewLogsWorker)

  // app.route('/worker/list')
  //   .get(controller.list)

}