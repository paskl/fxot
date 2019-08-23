/* execute.js */
//********************************************************************************************************************************
//********************************************************************************************************************************
const Listener = require('../listener.js')
const Pair = require('../class/pair.js')
const connector = require('../lib/connector.js')
let instrument = 'EUR_JPY'
let granulity = 'S5'
let pair = new Pair(instrument, granulity)
let listenMarket = new Listener()
let listenWallet = new Listener()
// let wallet = new Wallet()
let limit = 300

listenWallet.start( 900, async () => {
    // let trades = ( await oanda.trade.all() ).trades
    // wallet.update(trades)
})

var a = async() => {
    var b =  await connector.Trade.all()
    // var c =  await connector.Trade.open(null, instrument, 100)
    var c =  await connector.Trade.addTakeProfit(null, b.trades[0].id, 140)
    // var c =  await connector.Trade.addStopLoss(null, b.trades[0].id, 100)
    // var d =  await connector.Trade.all()
    // console.log(b)
    console.log(c)
    // console.log(d)
    // console.log(oanda.trade.close(b.trades[0].id))
    return c
}

// a()

let counter = 0
listenMarket.start( 500, async () => {
    console.log('tick '+(counter++))
    // let candles = (await connector.RealTimeCandle.getLast(null, pair.instrument, pair.granulity, limit)).candles
    // if(pair.update(candles, 'OANDA')){
    //     doStrategy()
    // }
})
//-------------------------------------------------------------------------------------------------------------------------------
//********************************************************************************************************************************
//                                                         STRATEGY
//********************************************************************************************************************************

function doStrategy() {
    console.log( pair.lastCandle().time+': '+pair.lastCandle().close)
}