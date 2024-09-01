const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Photo = require('../model/Photo.model'); // Photo modelini import edin
const connectDB = require('../database'); // database.js dosyasını import edin
const { default: mongoose } = require('mongoose');

const app = express();
connectDB();

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary hesap adınızı buraya girin
  api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API anahtarınızı buraya girin
  api_secret: process.env.CLOUDINARY_API_SECRET // Cloudinary API secretınızı buraya girin
});

// Multer ve Cloudinary için storage ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary'de kaydedilecek klasör adı
    allowedFormats: ['jpg', 'png'], // Kabul edilen dosya formatları
  },
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Fotoğraf yükleme işlevi
function uploadPhoto(req, res) {
    if (req.file) {
        const newPhoto = new Photo({
            imageUrl: req.file.path,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
        });
        newPhoto.save()
            .then(() => {
                console.log('Fotoğraf başarıyla yüklendi ve veritabanına kaydedildi!');
                res.json({
                    message: 'Fotoğraf başarıyla yüklendi ve veritabanına kaydedildi!',
                    imageUrl: req.file.path,
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: 'Veritabanına kaydedilirken bir hata oluştu!' });
            });
        
    } else {
        res.status(400).json({ error: 'Fotoğraf yüklenemedi!' });
    }
  };

 // Tüm fotoğrafları döndüren işlev
function getAllPhotos(req, res) {
  Photo.find()
      .then(photos => {
        console.log(photos)
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Verileri getirirken bir hata oluştu!' });
      });
}

module.exports = { upload, uploadPhoto, getAllPhotos };
