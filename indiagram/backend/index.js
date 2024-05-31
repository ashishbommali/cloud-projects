require('dotenv/config');
const cors =require('cors');
const express =require('express');
const db =require('./src/models/index.js');
const routes =require('./src/routes/index.js');

'use strict';

const app =express();
const HOST =process.env.HOST;
const PORT =process.env.PORT;

// client request middlewares
app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

// routes
Object.keys(routes).forEach(key =>app.use(`/api/v1/${key}`, routes[key]));

app.listen(PORT, HOST, async () =>{
    try {
        await db.sequelize.sync({logging: false});

        console.log(`[+] Server Running On ${PORT}`);
    } catch ({message}) {
        console.log(`[-] Error ${message}`);
    }
});
