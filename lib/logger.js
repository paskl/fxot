/* logger.js */

module.exports = {
    start: () => {
        process.send( [{ start: new Date().getTime() }] )
    },
    done: () => {
        process.send( JSON.stringify({ type: 'status', key: 'done', value: new Date().getTime() }) )
    },
    status: (key, value) => {
        process.send( JSON.stringify({ type: 'status', key: key, value: value}) )
    },
    result: (key, value) => {
        process.send(JSON.stringify({ type:'result', key: key, value: value }))
    },
    event: (value) => {

    }
}


