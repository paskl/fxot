/* scheduler.js */

const Worker = require('./worker')

const that = {
    workers: [],
    workerIndex: {},
    backtest: (context, pair, gran) => {
        let w = new Worker(context, pair, gran)
        w.backtest()
        let ind = that.workers.push(w) - 1
        that.workerIndex[w.id] = ind
        return w
    },
    getWorker(id){
        return that.workers[that.workerIndex[id]]
    },
    getStatus(id){
        return getWorker(id).status
    }
}

module.exports = that
