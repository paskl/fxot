/* localdata.js */

const fs = require('fs')

var data = []

module.exports = {
    candles: (instrument, granulity, cursor, limit) => {
            let pg = instrument+'_'+granulity
            if(!data[pg]){
                contents = fs.readFileSync('data/DAT_ASCII_EURUSD_M1_201807.csv', 'utf8')
                data[pg] = {}
                data[pg].index = {}
                data[pg].data = []
                contents.split('\n').forEach( (l, i) => {
                    u = l.split(';')
                    t = u[0]
                    u[0] = new Date(t.substr(0,4), t.substr(4,2)-1, t.substr(6,2), t.substr(9,2), t.substr(11,2), t.substr(13,2))
                    data[pg].index[u[0].toString()] = i
                    data[pg].data.push(u)
                })
            }
            return data[pg].data.slice(cursor, cursor+limit)
    },

    getAll: (instrument, granulity, from, limit) => {
        let pg = instrument+'_'+granulity
        if(!data[pg]) module.exports.candles(instrument, granulity, 0, 1)
        let ind = data[pg].index[from]
        return data[pg].data.slice(ind, limit)
    }
}



