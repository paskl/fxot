/* backtest.js */
//********************************************************************************************************************************
//********************************************************************************************************************************
const TI = require('technicalindicators')
const Pair = require('../lib/pair.js')
const oanda = require('../lib/oanda.js')
const localdata = require('../lib/localdata.js')
const logger = require('../lib/logger')
let instrument = 'EUR_JPY'
let granulity = 'S5'
let pair = new Pair(instrument, granulity)
let limit = 300
let cursor = 0
let counter = 0
let candles = localdata.candles(instrument, granulity, cursor++, limit)
let prev = {}
let iterations = []

while(candles.length == limit){
    pair.update(candles, 'LOCAL')
    // this.strategy(this)
    doStrategy()
    // next
    candles = localdata.candles(instrument, granulity, cursor++, limit)
    counter++
}
logger.result('nb_iter', counter)
logger.done()
//-------------------------------------------------------------------------------------------------------------------------------

//********************************************************************************************************************************
//                                                         STRATEGY
//********************************************************************************************************************************
function doStrategy() {
    let iter = {candle: pair.lastCandle}

    iter.sma10 = parseFloat(TI.SMA.calculate({period : 10, values : pair.closes(10)})).toFixed(5)
    iter.sma40 = parseFloat(TI.SMA.calculate({period : 40, values : pair.closes(40)})).toFixed(5)

    if(!('sma10' in prev)){
        prev.sma10 = iter.sma10
        prev.sma40 = iter.sma40
        return
    }

    let delta = (iter.sma10 - iter.sma40) > 0
    let prev_delta = (prev.sma10 - prev.sma40) > 0

    if(delta != prev_delta){
        if( delta ) console.log('BUY') // we have a cross over up -> BUY ?
        else console.log('SELL') // we have a cross over down -> SELL ?
    }

    // logger.iteration(iter)

    logger.event


    prev.sma10 = iter.sma10
    prev.sma40 = iter.sma40
    // sma10 = sma10.toFixed(5)
    // sma40 = sma40.toFixed(5)
    // console.log( pair.lastCandle().time+': '+sma10+' - '+sma40)
}