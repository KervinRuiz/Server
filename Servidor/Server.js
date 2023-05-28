//Modulos para importaciones
const express = require("express");
const server = express();
const port = 8000;
const sql = require("mssql");
const {body,validationResult} = require("express-validator");
const cors = require("cors");
server.use(cors());

process.env.NODE_TLS_ALLOW_INSECURE_SERVER = '1';

//Configuramos la configuracion
const config = {
     server: 'localhost',
     database: 'Crud_Clientes',
     user: 'sa',
     password: 'Rostranruiz2106',
     options:{
          trustServerCertificate: true //Nos permite conectarnos a la base de dato local
     }
}
sql.connect(config)
     .then(()=>{
          console.log("Conexion exitosa a la base de datos");
     })
     .catch((err)=>{
          console.log("Error al conectar a la base de datos",err);
     });
//Peticion para obtener los datos
server.get("/ObtenerDatosPersonas", async(req, res) => {
     const conexion = await sql.connect(config);
     const Consulta = await conexion.query("select*from [dbo].[Clientes]");
     res.json(Consulta.recordset);
});
//Peticion para enviar los datos
server.post("/EnviarDatosPersonas",[
     //Parametros requeridos
     body("Identificacion"),
     body("Nombre_Completo"),
     body("Telefono"),
     body("edad")
],async(req,res)=>{
     try{
          //Hacemos la conexion
          const conexion = await sql.connect(config);
          //Primero requerimos los parametros
          await conexion.request()
          .input('Identificacion',sql.VarChar,req.query.Identificacion)
          .input('Nombre_Completo',sql.VarChar,req.query.Nombre_Completo)
          .input('Telefono',sql.VarChar,req.query.Telefono)
          .input('edad',sql.VarChar,req.query.edad)
          .query("Insert into Clientes (Identificacion,Nombre_Completo,Telefono,edad) values(@Identificacion,@Nombre_Completo,@Telefono,@edad)")//Ejecutamos la consulta
          res.json({
               status: true,
               Identificacion: req.query.Identificacion,
               Nombre_Completo: req.query.Nombre_Completo,
               Telefono: req.query.Telefono,
               edad: req.query.edad
          });
     }catch(err){
          console.log("Error al insertar datos en la base de datos",err);
          res.status(500).json({
               status: false,
               error: "Error al insertar datos en la base de datos"
          })
     }
})
//Peticion para actualizar la base de datos
server.put("/ActualizarDatosPersonas",[
     //Parametros requeridos
     body("Identificacion"),
     body("Nombre_Completo"),
     body("Telefono"),
     body("edad")
],async(req,res)=>{
     //Hacemos la conexion
     const conexion = await sql.connect(config);
     //Primero requerimos los parametros
     await conexion.request()
     .input('Identificacion',sql.VarChar,req.query.Identificacion)
     .input('Nombre_Completo',sql.VarChar,req.query.Nombre_Completo)
     .input('Telefono',sql.VarChar,req.query.Telefono)
     .input('edad',sql.VarChar,req.query.edad)
     .query("update Clientes set Nombre_Completo = @Nombre_Completo, Telefono = @Telefono,edad = @edad where Identificacion = @Identificacion")//Ejecutamos la consulta
     res.json("Cliente actualizado con exito");
});
//Peticion para eliminar
server.delete("/EliminarCliente",
[
     //Parametros requeridos
     body("Identificacion")
],async(req,res)=>{
     try{
            //Hacemos la conexion
     const conexion = await sql.connect(config);
     //Primero requerimos los parametros
     await conexion.request()
     .input('Identificacion',sql.VarChar,req.query.Identificacion)
     .query("delete from Clientes where Identificacion = @Identificacion")//Ejecutamos la consulta
     res.json({
          status:true,
          Identificacion: req.query.Identificacion
     });
     }catch(err){
          console.log("Error al eliminar datos en la base de datos",err);
     }
})

server.listen(port,()=>{
     console.log("Servidor corriendo en el puerto ",port);
})
