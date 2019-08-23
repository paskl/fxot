class Wallet {
    constructor(process) {
        this.profit = 0
        this.trades = []
        this.audit = []
        this.process = process
    }

    long(time, price) {
        this.trades.push({type:'long', status:'open', time: time, price: price})
        this.event('long', time, {price: price} )
    }

    short(time, price){
        this.trades.push({type:'short', status:'open', time: time, price: price})
        this.event('long', {time: market.candle.time, price: price} )
    }

    close(type, condition, market) {
        // let gain = 0
        // Trade.trades.forEach( t => {
        //     if(t.status=='open' && t.type==type){
        //         gain = (t.type=='long') ? market.candle.close - t.price : t.price - market.candle.close
        //         t.status = 'close'
        //     }
        // })
        // return gain
    }

    stat(key, value) {
        this.audit.push( { type:'stat', content:{ key:key, value:value } } )
    }

    event(key, time, value) {
        this.audit.push( { type:'event', content:{ key:key, time:time, value:value } } )
    }

    commit() {
        this.audit.forEach( l => { this.process.send( JSON.stringify(l) ) })
        this.audit = []
    }
}


module.exports = Wallet