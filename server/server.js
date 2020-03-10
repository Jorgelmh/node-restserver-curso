require('./config/config')
require('./routes/usuario')

const express = require('express')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

/* MIDDLEWARES */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//Global Routes
app.use(require('./routes/index'))


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  } ,(err, res) => {
    if(err) throw err;

    console.log('Base de datos online', process.env.URLDB);
})

app.listen(process.env.PORT, () =>{
    console.log('Escuchando puerto: ', 3000);
})

