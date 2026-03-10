const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const userRouter = require("./routes/user.routes.js");
const {invokeGeminiAi} = require("./services/ai.service.js");
const { resume, selfDescription, jobDescription } = require("./services/temp.js");
const {generateInterviewReport} = require("./services/ai.service.js");

const cors = require('cors');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));



app.get('/',(req,res)=>{
    res.send('Hello World');
})

generateInterviewReport({resume, selfDescription, jobDescription});

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
