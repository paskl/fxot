// strateg01.js

(marketView) => {
    let sma10 = parseFloat(TI.SMA.calculate({period : 50, values : marketView.closes(50)})).toFixed(5)

    if ( Math.floor(Math.random()*5) == 1){
        wallet.long(marketView.lastCandle().time, marketView.lastCandle().close)
    }

}
