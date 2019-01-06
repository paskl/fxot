'use strict';

module.exports = function(app) {
  const worker_c = require('../controllers/WorkerController')
  const strategy_c = require('../controllers/StrategyController')

  // GET LIST OF STRATEGIES
  app.route('/strategy/list')
    .get(strategy_c.list)

  app.route('/worker/start/:strategyId')
    .get(worker_c.start)

  app.route('/worker/backtest/:strategyId')
    .get(worker_c.backtest)

  app.route('/worker/list')
    .get(worker_c.list)

}
