/* main.js */
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
//
const api = require('./api/api')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

api(app)
app.listen(port)

console.log('fxot API server started on: ' + port)
