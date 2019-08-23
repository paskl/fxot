class Run {
    constructor(stratId, inst, gran, account){
        this.id = new Date().getTime()
        this.stratId = stratId
        this.inst = inst
        this.gran = gran
        this.account = account
        this.status = 'init'


        this.events = []
        this.stats = {}
    }

    result(){
        return {
            status: this.status,
            stats: this.stats,
            events: this.events
        }
    }

}

module.exports = Run