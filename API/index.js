const express = require('express')
const app = express()
const mysql2 = require('mysql2')
const config = getDBconfig();
const pool = mysql2.createPool(config)
const promisePool = pool.promise();
const port = 3000

/*
// cors
res.writeHead(200, {
    "Content-Type":"application/json;charset=utf-8",
    "access-control-allow-origin":"*"
})
*/

// using urlencoded() 實現post請求傳遞的數據


const router = require('./router')
app.use('/',router)

app.use((req,res)=> {
    res.status(404).send("You're totally wrong!!")
})

app.listen(port, () =>{
    console.log(`service is running on http://localhost: ${port}`)
})

function getDBconfig() {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "CREATE_ENG", // has to change ot DB's name when DB is ready
      connectionLimit: 1,
    };
}