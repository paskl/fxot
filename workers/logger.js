/* logger.js */

module.exports = {
    event: (value) => {
        process.send( JSON.stringify({ type: 'event', value: value}) )
    },
    status: (key, value) => {
        process.send( JSON.stringify({ type: 'status', key: key, value: value}) )
    }
}


