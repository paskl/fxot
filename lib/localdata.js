/* localdata.js */

const fs = require('fs')

var data = []

module.exports = {
    candles: (instrument, granulity, cursor, limit) => {
            let index = instrument+'_'+granulity
            if(!data[index]){
                contents = fs.readFileSync('data/DAT_ASCII_EURUSD_M1_201807.csv', 'utf8')
                data[index] = []
                contents.split('\n').forEach( l => {
                    data[index].push(l.split(';'))
                })
            }
            return data[index].slice(cursor, cursor+limit)
    }
}