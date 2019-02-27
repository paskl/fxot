
const Worker = require('./worker')

var workers = []

exports.run = (arg) => {
    let w = new Worker('EUR_JPY', 'S5')
    w.run()
    workers.push(w)
}

exports.backtest = (arg) => {
    let w = new Worker('EUR_JPY', 'S5')
    w.backtest()
    workers.push(w)
}

exports.kill = (id) => {
    workers.forEach( w => {
        if(w.id == id && w.isRunning) w.kill()
    })
}

exports.list = (arg) => {
    return workers
}

exports.getById = (id) => {
    let ret = null
    workers.forEach( w => {
        if(w.id == id) ret = w
    })
    return ret
}
