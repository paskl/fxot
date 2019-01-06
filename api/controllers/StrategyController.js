'use strict';

exports.list = async (req, res) => {
    var my_strategies = [
        {
            name: 'strategy01'
        }
    ]

    res.json(my_strategies)
}
