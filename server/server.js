const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors =require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { readdirSync } = require('fs');
const connectDB = require('./src/config/db'); 




const app = express();
//connectDB
connectDB()


//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb"}));
app.use(cors());

//Route
readdirSync('./routes')
    .map((r) => app.use('/api', require('./routes/' + r)));
   


const port = process.env.PORT
app.listen(port, () => console.log(`Server is Running on port ${port}`));