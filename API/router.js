// routers modules
// 1. import express and mysql2 modules
const express = require('express');
//const mysql2 = require('mysql2');
// 2. create router
const router = express.Router();
// 3. establish connection pool
//const config = getDBconfig();
//const promisePool = mysql2.createPool(config).promise();

/*
function getDBconfig() {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "CREATE_ENG", // has to change ot DB's name when DB is ready
      connectionLimit: 1,
    };
}*/

// hosting router
// 3. create router address
// 1. GET request to pass parameter req.ruery
router.get('/', async(req,res) => {   //根目錄, 把所有卡片叫出來備用
    // * stands for any region
    // res.header('Access-Control-Allow-Origin', '*')
    try {
        // 執行查詢
        const [rows, fields] = await promisePool.query(
            "SELECT * FROM Credit_Card"
        );
        console.log(rows);
        res.send({ status:200, resData:{ok: 1, data: rows}});
    } catch (err) {
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
})

router.post('/regist', async(req,res) => {   // 註冊, body, 缺少接收使用者寄來之帳密的參數
    console.log('service is running the regist page!')
    try{
        const {mAccount, mPassword} = req.body;
        const [rows,fields] = await promisePool.query(
            "SELECT COUNT(*) AS count FROM member WHERE mAccount = ?"
        )
        const accountExists = rows[0].count > 0;
        
        if(accountExists) {
            res.send({status:200, accountExists: true})// 這裡應該不是200
        } else {
            res.send({status:200, accountExists: false})
            const [rows,fields] = await promisePool.query(
                "insert into member (mAccount, mPassword, email) values (account, password, email)"
            )
        }
    } catch(err){
        console.error("Error executing query:", err);
        res.send({status:500, resData:{ error: "Internal Server Error" }});
    }
    // let userPassword = req.body.password;
    // let passwordInfo = transformPassword(userPassword);

    //const qualified = true
    //res.status(200).send(qualified)
})

// 密碼如果能設太長的話，會有惡意代碼的風險(SQL injection)
router.post('/login', async(req,res) => {   // 登入, body, 用戶收藏的卡片陣列（collectionCards）
    /*try {
        // 執行查詢
        const userPassword = req.body.password;
        res.send("status: 200");

    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500");
        res.send({ error: "Internal Server Error" });
    }*/
    try{    //這個try & catch還沒修完
        const {mAccount, mPassword} = req.body
        const [rows,fields] = await promisePool.query(
            "SELECT COUNT(*) AS count FROM member WHERE mAccount = ?",
        )
        const accountExists = rows[0].count > 0;    //應該是指該參數是否大於0
        
        if(accountExists) {
            const [passwordRows,passwordfields] = await promisePool.query(
                "SELECT mPassword FROM member WHERE mAccount = ?",
                [mAccount]
            )
            if(passwordRows.length>0){
                const dbPassword = passwordRows[0].mPassword;
            }
            
        } else {
            res.send("status: 200") //這裡不是200
            res.send("帳號不存在，請確認輸入無誤!!");
        }
    } catch(err){
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})

router.get('/getCollectionCards', async(req,res) => {
    try{
        //Use a parameterized query to prevent SQL injection
        const query = "SELECT Card_No FROM Credit_Card WHERE password = ?"//這句好像怪怪的，可能是放錯位置
        //const collectionCards = await promisePool.query("SELECT Card_No FROM Credit_Card");
        const [collectionCards, fields] = await promisePool.query(query, [userPassword])
        
        console.log(collectionCards);
        res.send("status: 200")
        res.send({ ok: 1, data: collectionCards });
    } catch (err){
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error"});
    }
})

router.get('/getPlatform', async(req,res) => {   // 顯示購物平台, query, ＊格式：[ 購物平台（*） ]
    try {
        // 執行查詢
        const [shoppingPlatform, fields] = await promisePool.query(
            "SELECT * FROM Shopping_Platform"
        );
        console.log(shoppingPlatform);
        res.send("status: 200")
        res.send({ ok: 1, data: shoppingPlatform });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})

router.get('/compFilter', async(req,res) => {   // 比較, query, ＊格式：[{優惠方案（object）, 卡片編號},　… ]
    try {
        // 執行查詢
        const [cardInfo, fields] = await promisePool.query(
            "SELECT Card_No, discount_information FROM Credit_Card"
        );
        console.log(cardInfo);
        res.send("status: 200")
        res.send({ ok: 1, data: cardInfo });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
    
})

router.post('/notiOn',(req,res) => {   // 開啟推播, body, forntend: 會員帳號（account）：字串 ＊放headers
    res.send("status: 200")
})
router.delete('/notiOff',(req,res) => {   // 關閉推播, params
    res.send("status: 200")
})

router.post('/appendCollection',(req,res) => {   // 把卡片加入收藏, body
    res.send("status: 200")
})
router.delete('/delCollection',(req,res) => {   // 把卡片從收藏中刪除, params
    res.send("status: 200")
})

router.get('/getRankingCate', async(req,res) => {   // 查詢分類編號, query, rankingCates格式：[ { "分類編號", "分類名稱" }, … ]
    try {
        // 執行查詢
        const [rankingCate, fields] = await promisePool.query(
            "SELECT Card_No, discount_information FROM Credit_Card"
        );
        console.log(rankingCate);
        res.send("status: 200")
        res.send({ ok: 1, data: rankingCate });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})
router.get('/ranking', async(req,res) => {   // 顯示排行, query, ＊格式：[　{ 名次, 卡片編號 },　… ]
    try {
        // 執行查詢
        const [ranks, fields] = await promisePool.query(
            "SELECT ranks, Card_No FROM Ranking"
        );
        console.log(ranks);
        res.send("status: 200")
        res.send({ ok: 1, data: ranks });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})

router.get('/notiCards', async(req,res) => {   // 顯示有開通知的卡片（篩選用）, headers, ＊格式：[ { 卡片編號 }, … ]
    try {
        // 執行查詢
        const [cardNo, fields] = await promisePool.query(
            "SELECT Card_No FROM Credit_Card"
        );
        console.log(cardNo);
        res.send("status: 200")
        res.send({ ok: 1, data: cardNo });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})
router.get('/notiAll', async(req,res) => {   // 顯示所有通知, headers, ＊格式：[ { 卡片編號, 通知 }, … ]
    try {
        // 執行查詢
        const [notis, fields] = await promisePool.query(
            "SELECT Card_No, nContent FROM Notificatioin"
        );
        console.log(notis);
        res.send("status: 200")
        res.send({ ok: 1, data: notis });
    } catch (err) {
        console.error("Error executing query:", err);
        res.send("status: 500")
        res.send({ error: "Internal Server Error" });
    }
})
router.post('/appendNotiCollection',(req,res) => {   // 把通知加入收藏, body
    res.send("status: 200")

})
router.delete('/delNotiCollection',(req,res) => {   // 把通知從收藏中刪除, params
    res.send("status: 200")

})

// 4. export the router module, used by home page from index.js
module.exports = router;