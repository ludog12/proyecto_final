const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db')

const{promisify} = require('util')

//metodo para registrarse


exports.login = async(req, res)=>{
    try {
        const dni = req.body.dni
        const pass = req.body.pass
        
        if(!dni || !pass){
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMenssage: "INGRESA DATOS",
                alertIcon: "info",
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            conexion.query('SELECT id_persona FROM personas WHERE DNI=?', [dni], (error, results)=>{
                if(results.length<=0){
                    res.render('login',{
                        alert:true,
                        alertTitle: "error",
                        alertMenssage: "DNI no registrado",
                        alertIcon: "info",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                } else{ 
                console.log("user found");
                let data=JSON.parse(JSON.stringify(results))
                const idpersona=(data[0].id_persona)
                console.log(idpersona)
                conexion.query('SELECT * FROM usuarios WHERE id_persona = ?', [idpersona], async(error, results)=>{
                let compare = bcryptjs.compareSync(pass, results[0].password)
                console.log(compare)
                if(!compare){
                    res.render('login',{
                        alert:true,
                        alertTitle: "error",
                        alertMenssage: "DNI y/o Contraseña Incorrectos",
                        alertIcon: "info",
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                }
                else{
                    //Aca ponemos un query que busque el rol de persona/usuario y lo redirija segun su rol
                    
                    const iduser = results[0].id_usuario
                    const token = jwt.sign({id_usuario:iduser}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                        //TOKEN sin tiempo de expiracion
                        //const token = jwt.sign({iduser:id_usuario}, process.env.JWT_SECRETO)
                    })
                    console.log(token)
                    const cookiesOptions={
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true}

                        res.cookie('jwt', token, cookiesOptions)
                        
                        res.render('login', {
                            alert:true,
                            alertTitle: "biem",
                            alertMenssage: "logueado con exito",
                            alertIcon: "success",
                            showConfirmButton: false,
                            timer: 800,
                            ruta: ''
                        })
                
                    }
                })}})
            
        }
    } catch (error) {
        console.log(error)
    }
}


exports.isAuthenticated = async(req, res, next)=>{ //este vamos a usar en todas las rutas pra controllar que este logueado
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM usuarios WHERE id = ?', [decodificada.iduser], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}

exports.logout = (req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/')
}




