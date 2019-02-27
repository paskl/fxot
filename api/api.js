/* main.js */
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const controller = require('./controller')
const routes = require('./routes')
const bodyParser = require('body-parser')

module.exports = {
    start: (contexts) => {
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(function(req, res, next) {
          res.header("Access-Control-Allow-Origin", "*")
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
          next()
        })

        controller.fnc.init(contexts)
        routes(app, controller) //register the route

        app.listen(port)
        console.log('fxot API server started on: ' + port)
    }
}
