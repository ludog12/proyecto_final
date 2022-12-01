const router = require('express').Router();
const regController=require('../controllers/regController')
const logController = require('../controllers/logController')

//rutas para vistas
router.get('/', logController.isAuthenticated /*con este controlamos que este logueado*/, (req, res)=>{
    res.render('index')
})

router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})

router.get('/register', (req, res)=>{
    res.render('register', {alert: false})
})


//rutas para controller

router.post('/register', regController.register)
router.post('/login', logController.login)
router.get('/logout', logController.logout)

module.exports = router