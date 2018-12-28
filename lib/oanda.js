const https = require('https');

const baseURL = "https://api-fxpractice.oanda.com"
const authToken = "c5f9a24273e97fc6e0743e25f199539a-2cdfaab2086463c504df8c55495d3c96";
const accountID = "101-004-8122375-001";


module.exports = {
    instrument:{
        candles:(pair, granularity, count) =>{
            return request({
                path: '/v3/instruments/'+pair+'/candles?count='+count+'&granularity='+granularity
            })
        }
    },

    position:{
        all:() => {
            return request({
                path: '/v3/accounts/'+accountID+'/positions'
            })
        },
        open:() => {
            return request({
                path: '/v3/accounts/'+accountID+'/openPositions'
            })
        }
    },

    trade:{

        all: () => {
            return request({
                path: '/v3/accounts/'+accountID+'/trades'
            })
        },

        close: (id) => {
            return request({
                method:'PUT',
                path: '/v3/accounts/'+accountID+'/trades/'+id+'/close'
            })
        },

        order: (id, TP, SL) => {
            let rand = new Date().getTime()
            let body = {}
            // add the Take Profit condition
            if (TP)
            body.takeProfit = {
                price : TP,
                timeInForce : 'GTC',
                clientExtensions : {
                    id : rand+'_TP',
                    tag : '(ClientTag)',
                    comment : 'autotesting'
                }
            }

            // Add the Stop Loss condition
            if (SL)
            body.stopLoss = {
                price : SL,
                timeInForce : 'GTC',
                clientExtensions : {
                    id : rand+'_SL',
                    tag : '(ClientTag)',
                    comment : 'autotesting'
                },
                guaranteed : false
            }

            body = JSON.stringify(body)

            return request({
                method:'PUT',
                path: '/v3/accounts/'+accountID+'/trades/'+id+'/orders',
                postData: body
            })

        },

        execute: (instrument, units, TP, SL) =>{
            let rand = new Date().getTime()
            const ce = {
                id : rand,
                tag : '(ClientTag)1',
                comment : 'autotesting'
            }
            let body = {
                order:{
                    type: 'MARKET',
                    instrument: instrument, //EURJPY
                    units: units,
                    timeInForce: 'FOK',
                    // priceBound: ??,
                    positionFill: 'DEFAULT',
                    // "trailingStopLossOnFill":{},
                    tradeClientExtensions : {
                        id : rand+'_TCE',
                        tag : '(ClientTag)',
                        comment : 'autotesting'
                    }
                }
            }

            // Add the Take Profit condition
            if (TP)
            body.order.takeProfitOnFill = {
                price : TP,
                timeInForce : 'GTC',
                clientExtensions : {
                    id : rand+'_TP',
                    tag : '(ClientTag)',
                    comment : 'autotesting'
                }
            }

            // Add the Stop Loss condition
            if (SL)
            body.order.stopLossOnFill = {
                price : SL,
                timeInForce : 'GTC',
                clientExtensions : {
                    id : rand+'_SL',
                    tag : '(ClientTag)',
                    comment : 'autotesting'
                },
                guaranteed : false
            }

            body = JSON.stringify(body)

            return request({
                method:'POST',
                path: '/v3/accounts/'+accountID+'/orders',
                postData: body
            })
        },

    }

}

var request = (params) => {
    return new Promise( (resolve,reject) =>{
        const options = {
          host: 'api-fxpractice.oanda.com',
          path: params.path,
          method: params.method || 'GET',
          headers: {'Authorization':'Bearer '+authToken}
        }

        if(options.method == 'GET')
            ajax_get(options,
                (data) => { resolve(JSON.parse(data)) },
                (error) => { reject(error) }
            )
        else
            ajax_post(options, params.postData,
                (data) => { resolve(JSON.parse(data)) },
                (error) => { reject(error) }
            )
    })
}


var ajax_get = (options, end, error) =>{
    let data=''
    https.get(options, function(resp) {
      resp.on('data', (chunk) => {
        data += chunk
      })
      resp.on('end', () => {
       end(data)
      })
    }).on('error', error)
}

var ajax_post = (options, postData, end, error) =>{
    let data=''
    options.headers = {'Authorization':'Bearer '+authToken,
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length}

    let req = https.request(options, function(resp) {
      resp.on('data', (chunk) => {
        data += chunk
      })
      resp.on('end', () => {end(data)})
    }).on('error', error)
    req.write(postData)
    req.end()
}