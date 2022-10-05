const express = require('express');

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

require('./database/db');
require('dotenv').config();
 const userRouter=require('./router/rute');

 const app = express();
 const swaggerDefinition = {
   info: {
     title: "Node Test",
     version: "1.0.0",
     description: "Swagger API Docs",
   },
   host: `localhost:5002`,
   basePath: "/",
 };
 const options = {
   swaggerDefinition: swaggerDefinition,
   apis: ["./router/*.js"],
 };
 const swaggerSpec = swaggerJSDoc(options);
 app.get("/swagger.json", (req, res) => {
   res.setHeader("Content-Type", "application/json");
   res.send(swaggerSpec);
 });
 app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



 
 const port =5002;

 app.use(express.json())
 app.use(express.urlencoded({extended:true,limit:"1000mb"}))
 app.use('/user',userRouter)

 
 app.get('/',(req,res)=>{
    console.log("Data send succesful"+req.query.name)
    res.send("welcome to" +req.query.name)
 });
 app.get('/about',(req,res)=>{
    res.send("About Us page")
 });

 
 app.listen(port,()=>{
    console.log("server is running")
 });
 