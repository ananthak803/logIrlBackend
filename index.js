const express = require('express');
const app=express();
const connectDB=require('./connection')
require('dotenv').config();
const port=process.env.PORT;

connectDB(process.env.MONGO_URI).then(()=>console.log('connected to databse')).catch((err)=>console.log(err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user',require('./routes/user'));
app.use('/api/logs',require('./routes/log'))
app.get('/',(req,res)=>{
    res.send("live......");
})
app.listen(port,console.log('server running on port ',port))
