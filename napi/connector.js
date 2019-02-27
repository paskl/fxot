/* connector.js */

const strats =  [
    {
        id: 'strateg01',
        name:'10 v 50 EMA periods'
    },
    {
        id: 'strat02',
        name:'50 v 200 EMA periods'
    }
]

var localData = {
    data:{},
    // has(year):{},
    getIndex: (d) => {
        return ( d - new Date(d.getFullYear()) ) / 1000 / 60
    },
    getDistance: (d1, d2) => {
        return (d2 - d1) / 1000 / 60
    }
    get: (from, to) => {
        let ind, limit
        let res = []
        let diffYear = to.getFullYear() - from.getFullYear()


        // if(from>to)
        //     console.log('ERROR') && return
        // if(!data[instrument] || !data[instrument][f.getFullYear()])
        //   // get year for from
        // if(!data[instrument[t.getFullYear()]])
        //     // get year


        if(diffYear == 0){
            res = data[from.getFullYear()][ this.getIndex(from) ].splice( this.getDistance(from, to) )
        }
        else{
            res = data[from.getFullYear()][ this.getIndex(from) ].splice(data[from.getFullYear()].length - this.getIndex(from))
            for( let i = 1; i<diffYear-1; i++){
                res.push( data[from.getFullYear()+i] )
            }
            res.push(data[to.getFullYear()][0].splice(this.getIndex(to)))
        }

        return res

    }
}

module.exports = {

    getPublicStrategies: () => {
        return strats
    }

    getCandles: (f, t, instrument, granulity) => {
        let from = new Date(f)
        let to = new Date(t)


    }

}
