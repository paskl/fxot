/* backtest.js */
//********************************************************************************************************************************
//********************************************************************************************************************************
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
    console.log( pair.lastCandle().time+': ')
}