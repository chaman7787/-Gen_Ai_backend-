const express = require('express');
const mongoose = require('mongoose');
const userRouter = require("./routes/user.routes.js");
require('dotenv').config();


const app = express();

app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello World');
})


// user api routes

app.use('/api/user', userRouter);

mongoose.connect(process.env.MONGODB_URI,)
    .then(() => {
        console.log('Connected to MongoDB');        

app.listen(process.env.PORT, () => {
    console.log(`server starts at http://localhost:${process.env.PORT}`);    
});
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);        
 });
