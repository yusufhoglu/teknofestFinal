require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const PORT = process.env.PORT || 3000;
const app = express();
const { upload, uploadPhoto, getAllPhotos } = require('./controller/photoUpload.controller');
const search = require('./controller/map.controller');
app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));
// app.use(express.static('public'));
app.set('view engine', 'ejs');

app.route('/test')
  .get((req, res) => {
    res.render('index');
  })
  .post((req, res) => {
    const { publicKey } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'Public key is required' });
    }
  
    console.log('Public Key received:', publicKey);
    req.session.address = publicKey;
    res.json({ message: 'Login successful', publicKey });
  })

app.route('/home')
  .get((req, res) => {
    res.render('home', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
  })
  .post(upload.single('photo'),(req, res) => {
    return uploadPhoto(req,res);
  })

app.route('/search')
  .get((req, res) => {
    return search();
  })

app.route('/getAllPhotos')
    .get((req,res) => {
        getAllPhotos();
    })


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});