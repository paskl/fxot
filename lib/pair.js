/* worker.js */

// const Worker = require('./worker.js')
const Candle = require('./candle.js')
const oanda = require('./oanda.js')

class Pair {

    constructor(instrument, granulity){
        this.instrument = instrument
        this.granulity = granulity
        this.candles = []
    }

    reset(){
        this.candles = []
    }

    // async tack(){
    update(candles, origin){
        // request
        // check if new candles arrived
        if(this.lastCandle() && this.lastCandle().time.getTime() == new Date(candles[candles.length-1].time).getTime())
            return false
        // reset
        this.reset()
        // populate candles
        candles.forEach( c => {
            this.candles.push( new Candle(c, origin) )
        })
        return true
    }

    dates(limit){
        let dates = []
        this.candles.slice( this.candles.length - limit, this.candles.length)
            .forEach( c => dates.push( c.time ))
        return dates
    }

    closes(limit){
        let closes = []
        this.candles.slice( this.candles.length - limit, this.candles.length)
            .forEach( c => closes.push( parseFloat( c.close )))
        return closes
    }

    lastCandle(){
        return this.candles[this.candles.length-1]
    }
}

module.exports = Pair

/*** SAMPLE CODE :

--> opening trade at market value: oanda.trade.execute(instrument, units, TP, SL)

oanda.trade.execute('EUR_USD', '30000', '1.2', '1.1')
    .then( data => {
        if(data.hasOwnProperty('orderCancelTransaction'))
            console.log('FAILED : '+data.orderCancelTransaction.reason)
    }).catch( error => {
        console.log(error)
    })

--> closing trade at market value
trade.close()


--> Edit trade limit
trade.takeProfit('1.50')
trade.stopLoss('0.50')

***/

