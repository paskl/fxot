// strateg01.js
(market) => {
    let prev = iterations[counter-1]
    if( prev.delta != market.delta ){
       ( market.delta ) ? Event.buy(market) : Event.sell(market)
        console.log(wallet)
    }
}
