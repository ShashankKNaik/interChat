module.exports = (app) =>{
    router = require('express').Router()
    const controller = require('./controller')

    router.get('/chats',(req,res)=>{
        if(req.session.userId == undefined)
            res.redirect('/')
        else
            res.render('chats')
    })

    router.get('/msg/:email',controller.msg)
    
    router.get('/block/:email',controller.block)

    router.get('/clearchat/:email',controller.clearchat)

    router.get('/moremsg/:email/:time',controller.moremsg)

    router.get('/reqsent',controller.reqsent)

    router.get('/remove/:id',controller.remove)

    router.get('/approve/:id',controller.approve)

    router.get('/decline/:id',controller.decline)

    router.get('/friendreq',controller.friendreq)

    router.post('/req',controller.req)

    router.get('/autos/:name',controller.autos)

    router.get('/',controller.main)

    router.post('/signup',controller.signup)

    router.get('/logout',controller.logout)

    app.use(router)
}