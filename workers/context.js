// context.js
const strategies = require('../strategies/strats.js')

class Context {
    constructor(id){
        this.id = id
        this.objects = {}
        this.workers = []
    }

    get(obj){
        return this.objects[obj]
    }
    set(obj, val){
        this.objects[obj] = val
    }
    push(obj, val){
        this.objects[obj].push( val )
    }
    findById(obj, id){
        return this.objects[obj].find( e => e.id == id )
    }

}

const that = {
    list: {},
    init: () => {
        // 1- create public context
        that.list.public = new Context(0)
        that.list.public.set('strategy', strategies)
        that.list.public.set('backtest', []) // TODO : populate
        that.list.public.set('run', []) // TODO : populate
    },
    public: () => {
        return that.list.public
    },
    user: (uuid) => {
        // return user context
    }
}

module.exports = that
