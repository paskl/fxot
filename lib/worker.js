/* worker2.js */

const Listener = require('./listener.js')
const Pair = require('./pair.js')
const Wallet = require('./wallet.js')
const Logger = require('./logger.js')

const oanda = require('./oanda.js')
const localdata = require('./localdata.js')

class Worker {

    constructor(){
        this.pair = null
        this.strategy = null
        this.audit = null
        this.wallet = new Wallet()
    }

    setPair(instrument, granulity){
        this.pair = new Pair(instrument, granulity)
    }

    setStrategy(s){
        this.strategy = s
    }

    practice(limit){
        let listenMarket = new Listener()
        let listenWallet = new Listener()
        let log = new Logger()

        listenWallet.start( 900, async () => {
            let trades = ( await oanda.trade.all() ).trades
            this.wallet.update(trades)
        })

        listenMarket.start( 1000, async () => {
            let candles = (await oanda.instrument.candles(this.pair.instrument, this.pair.granulity, limit)).candles
            if(this.pair.update(candles, 'OANDA')){
                // do strategy
                this.strategy(this.pair, this.wallet)
            }
        })
    }

    backtest(limit){
        let cursor = 0
        // request
        let candles = localdata.candles(this.instrument, this.granulity, cursor++, limit)
        // while(candles.length == limit){
            this.pair.update(candles, 'LOCAL')
            this.strategy(this.pair, this.wallet)
            // next
            candles = localdata.candles(this.instrument, this.granulity, cursor++, limit)
        // }

    }

}

module.exports = Worker