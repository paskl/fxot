/* worker.js */

const { fork } = require('child_process')

class Worker {

    constructor(context, pair, gran){
        this.id = new Date().getTime()
        this.proc = null
        this.pair = pair
        this.gran = gran
        this.isBacktest = null
        this.isRunning = false
        this.forceKill = false
        this.status = 'new'
        //
        this.context = context
        this.logger = { status: {}, events: [] }
        // this.audit = new Logger()
        // this.wallet = new W allet()
    }

    run(){
        this.isBacktest = false
        this.status = 'running'
        this.proc = fork('./workers/execute.js', [this.pair, this.gran]);
        this.bind()
    }

    backtest(){
        this.isBacktest = true
        this.status = 'running'
        this.proc = fork('./workers/backtest.js', [this.pair, this.gran]);
        this.bind()
    }

    kill(){
        this.status = 'dead'
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
            that.status = 'done'
            // log
            that.context.push('backtest', that)
        })
    }

    log(msg){
        let jmsg = JSON.parse(msg)
        if(jmsg.type == 'status'){
            this.logger.status[jmsg.key] = jmsg.value
        }else if(jmsg.type == 'event'){
            this.logger.events.push(jmsg.value)
        }
    }

}

module.exports = Worker
