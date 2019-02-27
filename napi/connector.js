/* connector.js */

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

module.exports = {

    getPublicStrategies: () => {
        return strats
    }

}
