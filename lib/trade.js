/*trade.js*/

const conn = require('./oanda.js')

class Trade{
    constructor(data, format){
        if(format=='OANDA') this.initFromOanda(data)
        // this.init(array[0], array[1], array[2], array[3], array[4])
    }

    initFromOanda(p){
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                this[key] = p[key]
            }
        }
        return this
    }

    takeProfit(TP){
      return conn.trade.order(this.id, TP)
    }

    stopLoss(SL){
      return conn.trade.order(this.id, null, SL)
    }

    close(){
        conn.trade.close(this.id).catch( err => {
            console.log(error)
        })
    }
}

module.exports = Trade


///// **************************** /////
/*

  id: '1099',
  instrument: 'EUR_USD',
  price: '1.13501',
  openTime: '2018-12-06T05:32:11.434600773Z',
  initialUnits: '30000',
  initialMarginRequired: '600.0000',
  state: 'OPEN',
  currentUnits: '30000',
  realizedPL: '0.0000',
  financing: '0.0000',
  clientExtensions:
   { id: '1544074332613_TCE',
     tag: '(ClientTag)',
     comment: 'autotesting' },
  unrealizedPL: '-5.0228',
  marginUsed: '600.0000',
  takeProfitOrder:
   { id: '1100',
     createTime: '2018-12-06T05:32:11.434600773Z',
     type: 'TAKE_PROFIT',
     tradeID: '1099',
     price: '1.20000',
     timeInForce: 'GTC',
     triggerCondition: 'DEFAULT',
     state: 'PENDING',
     clientExtensions:
      { id: '1544074332613_TP',
        tag: '(ClientTag)',
        comment: 'autotesting' } },
  stopLossOrder:
   { id: '1101',
     createTime: '2018-12-06T05:32:11.434600773Z',
     type: 'STOP_LOSS',
     tradeID: '1099',
     price: '1.10000',
     guaranteed: false,
     timeInForce: 'GTC',
     triggerCondition: 'DEFAULT',
     state: 'PENDING',
     clientExtensions:
      { id: '1544074332613_SL',
        tag: '(ClientTag)',
        comment: 'autotesting' } } }



*/
