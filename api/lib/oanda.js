const https = require('https');

const baseURL = "https://api-fxpractice.oanda.com"

module.exports = {
    instrument:{
        candles:(account, pair, granularity, count, from) =>{
            let f = ''
            if(from) f = '&from='+from
            return request({
                path: '/v3/instruments/'+pair+'/candles?count='+count+'&granularity='+granularity+from,
                authToken: account.authToken
            })
        }
    },

    position:{
        all:(account) => {
            return request({
                path: '/v3/accounts/'+account.accountID+'/positions'
            })
        },
        open:(account) => {
            return request({
                path: '/v3/accounts/'+account.accountID+'/openPositions'
            })
        }
    },

    trade:{

        all: (account) => {
            return request({
                path: '/v3/accounts/'+account.accountID+'/trades',
                authToken: account.authToken
            })
        },

        close: (account, id) => {
            return request({
                method:'PUT',
                path: '/v3/accounts/'+account.accountID+'/trades/'+id+'/close',
                authToken: account.authToken
            })
        },

        order: (account, id, TP, SL) => {
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
                path: '/v3/accounts/'+account.accountID+'/trades/'+id+'/orders',
                postData: body,
                authToken: account.authToken
            })

        },

        execute: (account, instrument, units, TP, SL) =>{
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
                path: '/v3/accounts/'+account.accountID+'/orders',
                postData: body,
                authToken: account.authToken
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
          headers: {'Authorization':'Bearer '+ params.authToken}
        }

        if(options.method == 'GET')
            ajax_get(options,
                (data) => { resolve(JSON.parse(data)) },
                (error) => { reject(error) }
            )
        else
            ajax_post(options, params.postData, params.authToken,
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

var ajax_post = (options, postData, token, end, error) =>{
    let data = ''
    if(!postData) postData = ''
    options.headers = { 'Authorization':'Bearer '+token,
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length }

    let req = https.request(options, function(resp) {
      resp.on('data', (chunk) => {
        data += chunk
      })
      resp.on('end', () => {end(data)})
    }).on('error', error)
    req.write(postData)
    req.end()
}