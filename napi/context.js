/* context.js */

class Context {
    constructor(){
        // this.id = id
        this.workspace = {}
        this.workspace['strategy'] = []
        this.workspace['backtest'] = []
        this.workspace['run'] = []
        //
        this.workers = []
    }
    get(obj){
        return this.workspace[obj]
    }
    set(obj, val){
        this.workspace[obj] = val
    }
    push(obj, val){
        this.workspace[obj].push( val )
    }
    findById(obj, id){
        return this.workspace[obj].find( e => e.id == id )
    }
}

// const that = {
//     public: () => {
//         if(!that.pubCtx) {
//             that.pubCtx = new Context()
//             that.pubCtx.set('strategy', strategies)
//             that.pubCtx.set('backtest', []) // TODO : populate
//             that.pubCtx.set('run', []) // TODO : populate
//         }
//         return that.pubCtx
//     },
//     private: (uuid) => {

//     }
// }

module.exports = Context
