/* run.js */

const TI = require('technicalindicators')
const fs = require('fs')

const MarketView = require('../class/marketview.js')
const Connector = require('../lib/connector.js')
const Wallet = require('./wallet.js')


// CONST
const MAX_CANDLES = 100000

// PARAMS
let stratId = process.argv[2]
let instrument = process.argv[3]
let granulity = process.argv[4]
let from = parseInt(process.argv[5]) // make it timestamp
let to =  parseInt(process.argv[6]) // make it timestamp
//
let mwindow = 300
//
let counter = 0
//
let marketview = new MarketView(instrument, granulity, mwindow)
let wallet = new Wallet(process)
//
let candles_to_test = (to - from) / 1000 / 60
//

if ( candles_to_test > MAX_CANDLES) {
    console.log('WARNING: RANGE TOO BIG, TODO => PAGINATE')
}

console.log(stratId, instrument, granulity, from, to, candles_to_test)
let candles = Connector.LocalCandle.get(instrument, granulity, from, candles_to_test)
var strategy = eval(Connector.Strategy.get(stratId))

// STRATEGY ITERATIONS

wallet.stat('start', new Date().getTime())

marketview.setCandles( candles.splice(0, mwindow) )

while(candles.length > 0) {
    let tmp = candles.splice(0, 1)
    marketview.pushCandle(tmp[0] )
    strategy(marketview)
    counter++
}

wallet.stat('end', new Date().getTime())
wallet.stat('iteration', counter)

//  POST ANALYSIS
wallet.stat('profit', 4568)

// END
wallet.commit()
