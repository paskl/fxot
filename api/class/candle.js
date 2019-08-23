/* candle.js*/

/*
  FORMAT [ TIMESTAMP(ms), open, high, low, close ]
*/


class Candle{
    constructor(values){
        this.time = new Date(values[0])
        this.open = values[1]
        this.high = values[2]
        this.low = values[3]
        this.close = values[4]
    }

    // initFromOanda(opt){
    //     this.time = new Date(opt.time)
    //     this.open = opt.mid.o
    //     this.high = opt.mid.h
    //     this.low = opt.mid.l
    //     this.close = opt.mid.c
    //     return this
    // }

    // initFromLocal(opt){
    //     this.time = new Date(opt[0])
    //     this.open = opt[1]
    //     this.high = opt[2]
    //     this.low = opt[3]
    //     this.close = opt[4]
    //     return this
    // }

    toString(opt){
        let t = this.time
        let str = ''
        let trailingZero = (s) => { return (s<10?'0':'')+s }

        switch(opt){
            case 'time': str =
                trailingZero(t.getHours())+":"+
                trailingZero(t.getMinutes()) +":"+
                trailingZero(t.getSeconds())
                break
            default: str = t.getFullYear()+"-"+t.getMonth()+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()
        }
        return str
    }


}

module.exports = Candle
