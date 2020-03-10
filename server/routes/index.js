
const express = require('express')
const app = express()

//User routes
app.use(require('./usuario'))

//Login routes
app.use(require('./login'))

module.exports = app;