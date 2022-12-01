const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express()

//setting moto plantilla

app.set('view engine', 'ejs')

//setting public para estaticos
app.use(express.static('public'))


//para procesar los datos de ls form

app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seting variables de entorno

dotenv.config({path: './env/.env'})

//para usar las cookies
app.use(cookieParser())


//routes

app.use('/', require('./src/routes/router'))


//para borrar cache y evitar que vuelvan a atras
app.use(function(req, res, next){
    if(!req.user)
    res.header('Cache-Control', 'private, no-cache, no store, must-revalidate');
    next();
});


app.listen(3000, ()=>{
    console.log('todo okey')
})