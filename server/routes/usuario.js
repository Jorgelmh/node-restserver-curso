const express = require('express')
const bcrypt = require('bcryptjs')

const _ = require('underscore')

const app = express()
const Usuario = require('../models/usuario')

//Middlewares

const { verificaToken, verificaAdmin } = require('../middlewares/authentication')

app.get('/', (req, res) =>{
    res.json('Hello world')
})

app.get('/usuarios', verificaToken ,(req, res) =>{

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    //Find parameter => conditions from the schema for example google: true, name: Jorge
    Usuario.find({ estado: true }, 'nombre email role estado')
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                
                Usuario.countDocuments({estado: true}, (err, count) => {
                    res.json(({
                        ok: true,
                        usuarios,
                        cuantos: count
                    }))
                })

            } )

})

app.post('/usuarios', [verificaToken, verificaAdmin] , (req, res) => {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
})

app.put('/usuarios/:id',  [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })  
})

app.delete('/usuarios/:id',  [verificaToken, verificaAdmin],(req, res) => {
    let id = req.params.id


    Usuario.findByIdAndUpdate(id, {estado: false}, {new: true} , (err, usuarioBorrado) => {
        if(err){
            return res.json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
    /*  BORRAR REGISTROS FISICAMENTE
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })
    })
    */
})


module.exports = app