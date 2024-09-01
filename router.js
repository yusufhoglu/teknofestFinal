require('dotenv').config(); 
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const {requestNonce,verifySignature} = require('./controller/metamask.controller');
const { upload, uploadPhoto, getAllPhotos } = require('./controller/photoUpload.controller');
app.use(express.json());
// app.use(express.static('public'));
app.set('view engine', 'ejs');

app.route('/test')
  .get((req, res) => {
    res.render('index');
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })

app.route('/home')
  .get((req, res) => {
    res.render('home', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
  })
  .post(upload.single('photo'),(req, res) => {
    uploadPhoto(req,res);
  })

app.route('/get')
  app.get('/photos', getAllPhotos);

app.route('/request-nonce')
    .post((req, res) => {
        requestNonce(req,res);
    })
app.route('/getAllPhotos')
    .get((req,res) => {
        getAllPhotos();
    })
app.route('/verify-signature')
    .post((req, res) => {
        $data = verifySignature(req,res);
        res.send($data);
    })

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});