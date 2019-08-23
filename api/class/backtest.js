class Backtest {
    constructor(stratId, inst, gran, from, to){
        this.id = new Date().getTime()
        this.stratId = stratId
        this.props = {
            instrument: inst,
            granulity: gran,
            from: from,
            to: to
        }
        this.status = 'init'
        this.events = []
        this.stats = {}
    }

    result(){
        return {
            status: this.status,
            stats: this.stats,
            events: this.events,
            props: this.props
        }
    }

}

module.exports = Backtest