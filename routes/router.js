const router = require('express').Router();
const regController=require('../controllers/register_controller')
const logController = require('../controllers/logController')

//rutas para vistas
router.get('/', logController.isAuthenticated /*con este controlamos que este logueado*/, (req, res)=>{
    res.render('index')
})

router.get('/login', (req, res)=>{
    res.render('login', {alert:false})
})

router.get('/register', (req, res)=>{
    res.render('register')
})


//rutas para controller

router.post('/register', regController.register)
router.post('/login', regController.login)
router.get('/logout', regController.logout)

module.exports = router