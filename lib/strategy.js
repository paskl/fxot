/* strategy.js */

const log = require('./logger.js')

const TI = require('technicalindicators')



module.exports = (pair, wallet) => {
    if(wallet){
        // update the trades here
    }else{
        // get the trades from LOGs
    }
    console.log( pair.lastCandle().time+': '+TI.SMA.calculate({period : 10, values : pair.closes(10) }) )
}


///////////// PRIVATE
var test = () => {
    console.log('HEHO')
}

