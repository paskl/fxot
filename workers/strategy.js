/* strategy.js */

const log = require('./logger.js')

const TI = require('technicalindicators')

// console.log(process.argv[2])
// console.log(process.argv[3])

module.exports = (worker) => {
    if(worker.wallet){
        // update the trades here
    }else{
        // get the trades from LOGs
    }
    console.log( worker.pair.lastCandle().time+': '+TI.SMA.calculate({period : 10, values : worker.pair.closes(10) }) )
}


///////////// PRIVATE
var test = () => {
    console.log('HEHO')
}

