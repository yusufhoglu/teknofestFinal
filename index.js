const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config(); // .env dosyasını yükler

const app = express();

// EJS Şablon Motorunu Ayarlayın
app.set('view engine', 'ejs');

// Fotoğrafların yükleneceği klasörü belirleyin
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    // index.ejs dosyasını render ederken API anahtarını gönderiyoruz
    res.render('index', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.post('/upload', upload.single('photo'), (req, res) => {
    res.send('Fotoğraf yüklendi: ' + req.file.filename);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
