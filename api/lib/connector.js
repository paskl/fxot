/* connector.js */

const fs = require('fs')
const oanda = require('./oanda.js')

const OandaAccount = {
    accountID: "101-004-8122375-001",
    authToken: "c5f9a24273e97fc6e0743e25f199539a-2cdfaab2086463c504df8c55495d3c96"
}

var data = {}

// STRATEGY PROVIDER
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

// // LOCAL DATA PROVIDER
// var stou = s => { return (new Date(s).getTime() - new Date(s).getTimezoneOffset()*1000*60) }
// var itom = i => { return (i<10) ? '0'+i : i.toString() }
// var localData = {
//     load: (instrument, year) => {
//         console.log('[connector] LOADING: '+instrument+', M1,'+ year)
//         let filename = instrument+'/DAT_ASCII_'+instrument+'_M1_'+year+'.csv'
//         contents = fs.readFileSync('./data/'+filename, 'utf8')
//         if(!data[instrument]) data[instrument] = {}
//         data[instrument][year] = {}
//         contents.split('\n').forEach( (l, i) => {
//             u = l.split(';')
//             y = u[0].substr(0,4)
//             mo = u[0].substr(4,2)
//             d = u[0].substr(6,2)
//             h = u[0].substr(9,2)
//             mi = u[0].substr(11,2)
//             s = u[0].substr(13,2)
//             u[0] = new Date( Date.UTC(y, parseInt(mo)-1, d, h, mi, s) ).getTime()

//             if(u.length == 6){
//                 if(!data[instrument][year][mo]) data[instrument][year][mo] = {}
//                 if(!data[instrument][year][mo][d]) data[instrument][year][mo][d] = []
//                 data[instrument][year][mo][d].push(u)
//             }

//         })
//     },
//     getDay: (instrument, year, month, day) => {
//         if( !data[instrument] )
//             data[instrument] = {}
//         if(!data[instrument][year])
//             localData.load(instrument, year)
//         return data[instrument][year][month][day]
//     },
//     getMonth: (instrument, year, month) => {
//         if( !data[instrument] )
//             data[instrument] = {}
//         if(!data[instrument][year])
//             localData.load(instrument, year)
//         let res = []
//         // remove keys and flatten in res
//         for(let i=1; i<32; i++){
//             let ii = itom(i)
//             if( data[instrument][year][month][ii] ){
//                 data[instrument][year][month][ii].forEach( j => {
//                     res.push(j)
//                 })
//             }
//         }

//         return res
//     }
// }

module.exports = {

    Strategy : {

        all: () => {
            return strats
        },

        get: (stratId) => {
            let loc = './strategies/'+stratId+'.js'
            let content = fs.readFileSync(loc, 'utf8')
            let temp = eval(content)
            if(typeof(temp) != 'function') console.log('ERROR')
            return content
        }
    },

    LocalCandle : {
        // get: (instrument, granulity, f, t) => {
        //     let searchYear  = f.split('-')[0]
        //     let searchMonth = f.split('-')[1]
        //     let toYear  = t.split('-')[0]
        //     let toMonth = t.split('-')[1]

        //     let res = []

        //     // add a month to target
        //     toMonth = itom( parseInt(toMonth)+1 )
        //     if(toMonth > 12){
        //         toYear = (parseInt(toYear) + 1).toString()
        //         toMonth = '01'
        //     }

        //     while( searchMonth != toMonth || searchYear != toYear ){
        //         res = res.concat( localData.getMonth(instrument, searchYear, searchMonth) )
        //         searchMonth = itom( parseInt(searchMonth)+1 )
        //         if(searchMonth > 12){
        //             searchYear = (parseInt(searchYear) + 1).toString()
        //             searchMonth = '01'
        //         }
        //     }
        //     return res
        // },
        get: (instrument, granulity, from, count) => {
            let ret = []
            let iter = 0
            let date = new Date(from)
            let year = date.getFullYear()
            let filename = instrument+'/DAT_ASCII_'+instrument+'_'+granulity+'_'+year+'.csv'
            let contents = fs.readFileSync('./data/'+filename, 'utf8')
            let arr = contents.split('\n')
            for(var i = 0; i < arr.length; i++) {
                let u = arr[i].split(';')
                u[0] =  new Date(Date.UTC( u[0].substr(0,4), parseInt(u[0].substr(4,2))-1, u[0].substr(6,2),
                        u[0].substr(9,2), u[0].substr(11,2), u[0].substr(13,2) )).getTime()
                if( (u[0] >= from && iter==0) || iter > 0){
                    ret.push(u)
                    if ( iter++ >= count-1 ) break
                }
            }
            return ret
        }

    },


    RealTimeCandle : {
        getLast: (acc, instrument, granulity, limit) => {
            let account = OandaAccount // = acc ?
            return oanda.instrument.candles(account, instrument, granulity, limit)
        },
        getFrom: (instrument, granulity, limit, from) => {
            let account = OandaAccount // = acc ?
            return oanda.instrument.candles(account, instrument, granulity, limit, from)
        },
        getRange: (acc, instrument, granulity, from, to) => {
            // let account = OandaAccount // = acc ?
            // return oanda.instrument.candles(account, instrument, granulity, limit)
        },
    },


    Trade : {

        all: (acc) => {
            // TODO make with diff account ID, select account
            let account = OandaAccount // = acc ?
            return oanda.trade.all(account)
        },

        close: (acc, id) => {
            let account = OandaAccount // = acc ?
            return oanda.trade.close(account, id)
        },

        open: (acc, instrument, units, TP, SL) => {
            let account = OandaAccount // = acc ?
            return oanda.trade.execute(account, instrument, units, TP, SL)
        },

        addTakeProfit: (acc, id, val) => {
            let account = OandaAccount // = acc ?
            return oanda.trade.order(account, id, val, null)
        },

        addStopLoss: (acc, id, val) => {
            let account = OandaAccount // = acc ?
            return oanda.trade.order(account, id, null, val)
        }


    }

}
