const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../../database/db')



exports.register = async(req, res)=>{
    try {
        const name= req.body.name
        const dni= req.body.dni
        const nac= req.body.nac
        const select= req.body.select
        const email= req.body.email
        const pass= req.body.pass

 
        let passHash = await bcryptjs.hash(pass, 8)

        if(!name || !email || !pass){
            return res.render('register',{
                alert:true,
                alertTitle: "Advertencia",
                alertMenssage: "INGRESA DATOS",
                alertIcon: "info",
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            })
        }
        
        conexion.query('INSERT INTO personas SET ?', {nom_apell:name, DNI:dni, fecha_nac:nac, domicilio:null, id_tipo_sangre:null, id_tipo_persona:null, id_sexo: select}, (error, results)=>{
            if(error){console.log(error)}
            conexion.query('SELECT id_persona FROM personas WHERE DNI=?', [dni], (error, results)=>{
                if(error){console.log(error)}
                
                let data=JSON.parse(JSON.stringify(results))
                const idpersona=(data[0].id_persona)
                conexion.query('INSERT INTO usuarios SET ?', {correo:email, password:passHash, id_persona:idpersona})
                res.redirect('/')
            })

        })
    } catch (error) {
        console.log(error)
    }
    
}