'use strict';



const strategy = require('../../lib/strategy.js')
const Worker = require('../../lib/worker.js')

// var mongoose = require('mongoose'),
//   Task = mongoose.model('Tasks');

exports.test_get = async (req, res) => {
    console.log('[GET] '+req);

    let w1 = new Worker()
    w1.setPair('EUR_JPY', 'S5')
    w1.setStrategy(strategy)
    // w1.backtest(300)
    w1.practice(300)

    res.json({});
};

exports.test_get_id = function(req, res) {
    console.log('[GETID] '+req.params.taskId+' -> '+req);
    res.json({});
};

exports.test_post = function(req, res) {
    console.log('[POS] '+req);
    res.json({});
};


