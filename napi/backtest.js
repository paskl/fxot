/* run.js */

const TI = require('technicalindicators')
const fs = require('fs')

const Pair = require('../napi/pair.js')
const connector = require('../napi/connector.js')

const oanda = require('../lib/oanda.js')

let cursor = 0
let limit = 300
let counter = 0

let iterations = []
let events = []

let trades = []
let wallet = 0
let audit = []

// PARAMS
let stratId = process.argv[2]
let instrument = process.argv[3]
let granulity = process.argv[4]
let from = process.argv[5]
let to = process.argv[6]

console.log(stratId)
console.log(instrument)
console.log(granulity)

let pair = new Pair(instrument, granulity)
let candles = connector.getCandles(instrument, granulity, from, to)


// Get the strategy
var getStrategy = (stratId) => {
    let loc = './strategies/'+stratId+'.js'
    let content = fs.readFileSync(loc, 'utf8')
    let temp = eval(content)
    if(typeof(temp) != 'function') console.log('ERROR')
    return temp
}
var strategy = getStrategy(stratId)

// Trade
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

// Log
var Log = {
    audit: [],
    add: (key, value) => {
        Log.audit.push( [key,value] )
    },
    commit: () => {
        Log.audit.forEach( l => {
            process.send( JSON.stringify({ key: l[0], value: l[1]}) )
        })
    }
}


// Iteration
Log.add('start', new Date().getTime())
while( cursor++ < candles.length-limit-1 ){
    pair.update(candles.slice(cursor, cursor+limit) , 'LOCAL')
    strategy(pair)
}
Log.add('end', new Date().getTime())
Log.add('counter', cursor)

Log.commit()
