/* wallet.js */

const Worker = require('./worker.js')
const Trade = require('./trade.js')
const oanda = require('./oanda.js')

class Wallet {

    constructor(){
        this.trades = null
    }

    reset(){
        this.trades = []
    }

    update(trades){
        this.reset()
        trades.forEach( t => {
            this.trades.push( new Trade(t, 'OANDA') )
        })
    }

    isInit(){
        return this.trades != null
    }

}

module.exports = Wallet
