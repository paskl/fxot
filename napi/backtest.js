/* run.js */

const TI = require('technicalindicators')
const fs = require('fs')

const Pair = require('../classes/pair.js')
const oanda = require('../lib/oanda.js')
const localdata = require('../lib/localdata.js')
const logger = require('../workers/logger')

let limit = 300
let cursor = 0
let counter = 0

let iterations = []
let events = []

let trades = []
let wallet = 0

// PARAMS
let stratId = process.argv[2]
let instrument = process.argv[3]
let granulity = process.argv[4]
// let instrument = 'EUR_JPY'
// let granulity = 'S5'


// Create Trade
var Trade = {
    long: (market) => {
        trades.push({type:'long', status:'open', open_at: market.candle.time, price: market.candle.close})
    },
    short: (market) => {
        trades.push({type:'short', status:'open', open_at: market.candle.time, price: market.candle.close})
    },
    close: (type, market) => {
        let gain = 0
        trades.forEach( t => {
            if(t.status=='open' && t.type==type){
                gain = (t.type=='long') ? market.candle.close - t.price : t.price - market.candle.close
                t.status = 'close'
            }
        })
        return gain
    }
}

// Create Event
var Event = {
    buy: (market) => {
        events.push({type:'buy', time: market.candle.time, price: market.candle.close })
        let g = Trade.close('short', market) *1000
        Trade.long(market)
        wallet += g
    },
    sell: (market) => {
        events.push({type:'sell', time: market.candle.time, price: market.candle.close })
        let g = Trade.close('long', market) *1000
        Trade.short(market)
        wallet += g
    }
}


var getStrategy = (stratId) => {
    let loc = './strategies/'+stratId+'.js'
    let content = fs.readFileSync(loc, 'utf8')
    let temp = eval(content)
    if(typeof(temp) != 'function') console.log('ERROR')
    return temp
}

// Strategy
var strategy = getStrategy(stratId)

// START
logger.status('run_start', new Date().getTime())

//
let pair = new Pair(instrument, granulity)
let candles = localdata.candles(instrument, granulity, cursor++, limit)
pair.update(candles, 'LOCAL')

//
logger.status('sample_start', candles[0][0])
logger.status('pair', instrument)

var strategy = getStrategy(stratId)


while(candles.length == limit){
    // prepare data
    let market = {}
    market.candle = pair.lastCandle()
    market.sma10 = parseFloat(TI.SMA.calculate({period : 50, values : pair.closes(50)})).toFixed(5)
    market.sma40 = parseFloat(TI.SMA.calculate({period : 200, values : pair.closes(200)})).toFixed(5)
    market.delta = (market.sma10 - market.sma40) > 0

    // Run iteration
    if(counter > 0)
        strategy(market)

    // next
    iterations[counter] = market
    candles = localdata.candles(instrument, granulity, cursor++, limit)
    pair.update(candles, 'LOCAL')
    counter++
}

// console.log(trades)

// END
console.log(wallet)
events.forEach( e => logger.event(e) )

logger.status('nb_iter', counter)
logger.status('sample_done', candles[candles.length-2][0])
logger.status('run_done', new Date().getTime())
console.log('backtest DONE')
