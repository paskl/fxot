/* StrategyModel.js */ 
const connector = require('../../classes/Connector.js');
const streamer = require('../../classes/Streamer.js');
const handler = require('../../classes/OrderManager.js');
const worker = require('../../classes/Worker.js');

const fs = require('fs');

const event = require('events');

module.exports =  {
    start: async (strategy, env) => {
        console.log('[STRATMOD] launching');
        
        let listener = new event();
        listener.on('initial_candles', initial_candles_received);
        listener.on('new_candle', new_candle);
        streamer.init(worker_listener); // TODO define in params data to test on (pairs, gran etc.)

    }
}
