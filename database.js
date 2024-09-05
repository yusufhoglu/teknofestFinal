const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // .env dosyasını yükler

const app = express();
app.use(cors());
app.use(express.json());
function connectDB(){
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('MongoDB connected...'))
      .catch(err => console.log(err));
}

module.exports = connectDB;
