/* worker.js */
const Candle = require('./candle.js')

class MarketView {

    constructor(instrument, granulity, mwindow){
        this.instrument = instrument
        this.granulity = granulity
        this.mwindow = mwindow
        this.candles = []
    }

    reset(){
        this.candles = []
    }

    setCandles(valuesArray){
        valuesArray.forEach( c => {
            this.candles.push( new Candle(c) )
        })
        return true
    }

    pushCandle(values){
       this.candles.push( new Candle( values ) )
       this.candles.shift()
       return true
    }

    dates(limit){
        let dates = []
        if(!limit) limit = this.candles.length
        this.candles.slice( this.candles.length - limit, this.candles.length)
            .forEach( c => dates.push( c.time ))
        return dates
    }

    closes(limit){
        let closes = []
        if(!limit) limit = this.candles.length
        this.candles.slice( this.candles.length - limit, this.candles.length)
            .forEach( c => closes.push( parseFloat( c.close )))
        return closes
    }

    lastCandle(){
        return this.candles[this.candles.length-1]
    }
}

module.exports = MarketView
