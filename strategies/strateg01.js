// strateg01.js

(pair) => {

    let market = {}
    market.candle = pair.lastCandle()
    market.sma10 = parseFloat(TI.SMA.calculate({period : 50, values : pair.closes(50)})).toFixed(5)
    // console.log(pair.lastCandle().close+'- '+market.sma10)
    // let prev = iterations[counter-1]
    // if( prev.delta != market.delta ){
    //    ( market.delta ) ? Event.buy(market) : Event.sell(market)
    //     console.log(wallet)
    // }
}
