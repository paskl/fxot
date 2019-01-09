/* worker.js */

// const Listener = require('./listener.js')
// const Pair = require('./pair.js')
// const Wallet = require('./wallet.js')
// const Logger = require('./logger.js')

// const oanda = require('./oanda.js')
// const localdata = require('./localdata.js')

const { fork } = require('child_process')

class Worker {

    constructor(pair, gran){
        this.id = new Date().getTime()
        this.proc = null
        this.pair = pair
        this.gran = gran
        this.isBacktest = null
        this.isRunning = false
        this.forceKill = false
        this.logger = { status: {}, result: {}, events: {}}
        // this.audit = new Logger()
        // this.wallet = new W allet()
    }

    run(){
        this.isBacktest = false
        this.proc = fork('./lib/execute.js', [this.pair, this.gran]);
        this.bind()
    }

    backtest(){
        this.isBacktest = true
        this.proc = fork('./lib/backtest.js', [this.pair, this.gran]);
        this.bind()
    }

    kill(){
        this.forceKill = true
        this.proc.kill()
    }

    bind(){
        var that = this
        this.isRunning = true

        this.proc.on('message', msg => {
            that.log(msg)
        })

        this.proc.on('close', () => {
            that.isRunning = false
        })
    }

    log(msg){
        let jmsg = JSON.parse(msg)
        switch(jmsg.type){
            case 'status': this.logger.status[jmsg.key] = jmsg.value
                break
            case 'result': this.logger.result[jmsg.key] = jmsg.value
                break
            case 'event':
                break
        }
    }

}


module.exports = Worker