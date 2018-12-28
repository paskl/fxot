/* candle.js */

class Candle{
    constructor(data, format){
        this.format = format
        if(format=='OANDA') this.initFromOanda(data)
        if(format=='LOCAL') this.initFromLocal(data)
        // this.init(array[0], array[1], array[2], array[3], array[4])
    }

    initFromOanda(opt){
        this.time = new Date(opt.time)
        this.open = opt.mid.o
        this.high = opt.mid.h
        this.low = opt.mid.l
        this.close = opt.mid.c
        return this
    }

    initFromLocal(opt){
        let a = opt[0]
        this.time = new Date(a.slice(0,4)+"-"+a.slice(4,6)+"-"+a.slice(6,8)+"T"+a.slice(9,11)+":"+a.slice(11,13)+":"+a.slice(13,15)+"Z")
        this.open = opt[1]
        this.high = opt[2]
        this.low = opt[3]
        this.close = opt[4]
        return this
    }

    toString(opt){
        let t = this.time
        let str = ''
        switch(opt){
            case 'time': str = t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()
                break
            default: str = t.getFullYear()+"-"+t.getMonth()+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()
        }
        return str
    }


}

module.exports = Candle
