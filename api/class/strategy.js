
const Backtest = require('./backtest')
const Run = require('./run')

class Strategy {
    constructor(id, name) {
        this.id = id
        this.name = name

        this.backtest = []
        this.run = null
    }

    createBacktest(inst, gran, from, to) {
        let bt = new Backtest(this.id, inst, gran, from, to)
        this.backtest.push(bt)
        return bt
    }

    getBacktest(id) {
        return this.backtest.find( e => e.id == id )
    }

    startRun(inst, gran, account) {
        if(this.run) return null
        this.run = new Run(this.id, inst, gran, account)
        return this.run
    }
}

module.exports = Strategy