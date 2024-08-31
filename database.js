//*****************************************/
//*****************************************/
//2- Koordinat bilgisi alınan yerleri harita üzerinden nasıl gösterebiliriz?
//3- Street view görüntüsü gibi biz de kendi fotoğraflarımızı harita üzerinde gösterebilir miyiz?
//4- Database olarak Blockchain kullanabilir miyiz?
//5- Bir validation sistemi olabilir mi?
//6- Model entegrasyonu
//7- Akıllı kontrat yazıp her foto yüklendiğinde test ağında x miktar ödeme yapılabilir mi?
//8- Fotoğrafların yüklenmesi için bir ödeme sistemi olabilir mi?
//*****************************************/
//*****************************************/
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
