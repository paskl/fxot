
const { fork } = require('child_process')

class Worker {

    constructor(context, stratId, pair, gran){
        this.id = new Date().getTime()
        this.proc = null
        this.status = 'init'

        context.wid = this.id
        this.context = context
        this.isBacktest = null
        this.isRunning = false
        this.forceKill = false

        this.props = {
            stratId: stratId,
            pair: pair,
            gran: gran
        }

        this.stats = {
            init: new Date().getTime()
        }

        this.events = []
    }

    run(account){
        this.props.account = account
        this.isBacktest = false
        this.status = 'running'
        this.proc = fork('./api/process/execute.js', [this.props.stratId, this.props.pair, this.props.gran, this.props.account])
        this.bind()
    }

    backtest(from, to){
        this.isBacktest = true
        this.status = 'running'
        this.context.status = 'running'
        this.proc = fork('./api/process/backtest.js', [this.props.stratId, this.props.pair, this.props.gran, from, to])
        this.bind()
    }

    kill(){
        if(!this.isBacktest){
            this.context.run = null
        }
        this.status = 'dead'
        this.forceKill = true
        this.proc.kill()
    }

    bind(){
        // ON_MESSAGE
        this.proc.on('message', (msg) => {
            msg = JSON.parse(msg)
            if( msg.type == 'stat' ) this.stats[msg.content.key] = msg.content.value
            if( msg.type == 'event' ) this.events.push( msg.content )
        })

        // ON_CLOSE
        this.proc.on('close', () => {
            this.isRunning = false
            this.status = 'done'
            this.context.status = 'done'
            this.context.stats = this.stats
            this.context.events = this.events
        })
    }

}

module.exports = Worker
