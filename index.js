const express = require('express');
const app=express();
const connectDB=require('./connection')
require('dotenv').config();
const port=process.env.PORT;
const cors = require('cors');
app.use(cors());

connectDB(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas');
    console.error(err);
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user',require('./routes/user'));
app.use('/api/logs',require('./routes/log'))
app.get('/',(req,res)=>{
    res.send("live......");
})
app.listen(port,console.log('server running on port ',port))
