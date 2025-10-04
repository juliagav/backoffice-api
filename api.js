require('dotenv').config();
const express = require("express")
const app = express()
const db = require('./config/db');
const cors = require("cors") // habilita outras aplicações a realizar requisições para a minha API.
app.use(cors())
app.use(express.json()) 
require('./config/routes')(app);


db.on("connected", function () {
    console.log("connected!");
});

db.on("disconnected", function () {
    console.log("disconnected!");
});

db.on("error", function (error) {
    console.log(`Connection error ${error}`);
});




app.listen(3000, ()=>{
  console.log("server running on port 3000")
})


