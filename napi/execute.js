/* execute.js */
//********************************************************************************************************************************
//********************************************************************************************************************************
const Listener = require('../lib/listener.js')
const Pair = require('../lib/pair.js')
const Wallet = require('../lib/wallet.js')
const oanda = require('../lib/oanda.js')
const localdata = require('../lib/localdata.js')
let instrument = 'EUR_JPY'
let granulity = 'S5'
let pair = new Pair(instrument, granulity)
let listenMarket = new Listener()
let listenWallet = new Listener()
let wallet = new Wallet()
let limit = 300

listenWallet.start( 900, async () => {
    let trades = ( await oanda.trade.all() ).trades
    wallet.update(trades)
})

listenMarket.start( 1000, async () => {
    let candles = (await oanda.instrument.candles(pair.instrument, pair.granulity, limit)).candles
    if(pair.update(candles, 'OANDA')){
        doStrategy()
    }
})
//-------------------------------------------------------------------------------------------------------------------------------
//********************************************************************************************************************************
//                                                         STRATEGY
//********************************************************************************************************************************

function doStrategy() {
    console.log( pair.lastCandle().time+': ')
}