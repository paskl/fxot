/* localdata.js */

const fs = require('fs')

var data = []

module.exports = {
    candles: (instrument, granulity, cursor, limit) => {
            let pg = instrument+'_'+granulity
            if(!data[pg]){
                contents = fs.readFileSync('lib/data/DAT_ASCII_EURUSD_M1_201807.csv', 'utf8')
                data[pg] = []
                contents.split('\n').forEach( (l, i) => {
                    u = l.split(';')
                    t = u[0]
                    u[0] = new Date(t.substr(0,4), t.substr(4,2)-1, t.substr(6,2), t.substr(9,2), t.substr(11,2), t.substr(13,2)).getTime()
                    data[pg].push(u)
                })
            }
            return data[pg].slice(cursor, cursor+limit)
    },

    getAll: (instrument, granulity, from, limit) => {
        let pg = instrument+'_'+granulity
        let ind = 0
        if(!data[pg]) module.exports.candles(instrument, granulity, 0, 1)
        for(ind; ind < data[pg].length; ind++){
            if( data[pg][ind] >= from ) break
        }
        return data[pg].slice(ind, (ind+limit) )
    }
}



